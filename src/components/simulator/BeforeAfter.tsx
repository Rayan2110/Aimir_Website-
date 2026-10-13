"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ExampleBadge } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

/**
 * Simulateur avant / après — EXEMPLES FICTIFS (brief §7).
 * Les prix et profils ci-dessous ne proviennent d'aucun dossier réel ; ils
 * servent uniquement à expliquer la lecture d'une étude comparative.
 */
const PROFILES = [
  {
    id: "restaurant",
    label: "Restaurant",
    region: "Île-de-France",
    energy: "Électricité",
    segment: "C5 · 36 kVA",
    mwh: { min: 40, max: 200, default: 95 },
    current: { structure: "Prix fixe", price: 168, end: "03/2027", conditions: ["Contrat signé en 2023", "Reconduction tacite 12 mois", "Heures pleines / heures creuses"] },
    proposal: { structure: "Prix fixe", price: 139, duration: "24 mois", conditions: ["Prix de l'énergie ferme 24 mois", "Tolérance de volume ± 20 %", "Garanties d'origine incluses"] },
    consulted: 5,
    received: 3,
  },
  {
    id: "hotel",
    label: "Hôtel",
    region: "Auvergne-Rhône-Alpes",
    energy: "Gaz naturel",
    segment: "Profil T3",
    mwh: { min: 150, max: 900, default: 520 },
    current: { structure: "Prix fixe", price: 64, end: "11/2026", conditions: ["Échéance proche", "Offre de continuité si non renouvelé", "Facturation mensuelle"] },
    proposal: { structure: "Prix fixe", price: 52, duration: "36 mois", conditions: ["Prix ferme 36 mois", "Tolérance de volume ± 25 %", "Facturation mensuelle sur relevé"] },
    consulted: 6,
    received: 4,
  },
  {
    id: "copro",
    label: "Copropriété",
    region: "Nouvelle-Aquitaine",
    energy: "Gaz — chaufferie collective",
    segment: "Profil T3",
    mwh: { min: 300, max: 1500, default: 780 },
    current: { structure: "Prix indexé", price: 71, end: "06/2027", conditions: ["Prix moyen constaté sur 12 mois", "Indexé sur le marché de gros", "Budget variable d'un mois à l'autre"] },
    proposal: { structure: "Prix fixe", price: 58, duration: "24 mois", conditions: ["Budget connu à l'avance pour l'AG", "Tolérance de volume ± 20 %", "Signature après vote en AG"] },
    consulted: 5,
    received: 3,
  },
] as const;

function useTween(value: number, ms = 700) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      const id = requestAnimationFrame(() => setV(value));
      return () => cancelAnimationFrame(id);
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - p, 4);
      const cur = start + (value - start) * e;
      setV(cur);
      from.current = cur;
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return v;
}

const eur = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;

export function BeforeAfter() {
  const uid = useId();
  const [pi, setPi] = useState(0);
  const p = PROFILES[pi];
  const [mwh, setMwh] = useState<number>(p.mwh.default);

  const currentBudget = p.current.price * mwh;
  const newBudget = p.proposal.price * mwh;
  const gap = currentBudget - newBudget;
  const pct = (gap / currentBudget) * 100;

  const tCur = useTween(currentBudget);
  const tNew = useTween(newBudget);
  const tGap = useTween(gap);

  return (
    <div className="panel-solid relative overflow-hidden rounded-[6px]">
      {/* barre supérieure */}
      <div className="flex flex-col gap-4 border-b border-[var(--line)] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <ExampleBadge />
        <div role="group" aria-label="Profil d'exemple" className="flex gap-1 overflow-x-auto no-scrollbar">
          {PROFILES.map((x, i) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={i === pi}
              onClick={() => {
                setPi(i);
                setMwh(x.mwh.default);
              }}
              className={cn(
                "relative shrink-0 rounded-[3px] px-3.5 py-2 text-[13px] transition-colors",
                i === pi ? "bg-fg text-ink-950" : "text-fg-2 hover:bg-fg/5 hover:text-fg",
              )}
            >
              {x.label} — {x.region}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-[1fr_auto_1fr]"
        >
          {/* Contrat actuel */}
          <div className="p-5 md:p-8">
            <p className="eyebrow">Contrat actuel</p>
            <p className="mt-2 text-[13px] text-fg-3">
              {p.energy} · {p.segment}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
              <Stat label="Structure" value={p.current.structure} />
              <Stat label="Échéance" value={p.current.end} />
              <Stat label="Prix énergie" value={`${p.current.price} €/MWh`} sub="HT, hors acheminement et taxes" />
              <Stat label="Consommation" value={`${mwh.toLocaleString("fr-FR")} MWh/an`} sub="estimée" />
            </dl>
            <ul className="mt-6 grid gap-2 border-t border-[var(--line)] pt-5 text-[13px] text-fg-2">
              {p.current.conditions.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-fg-3" />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[12px] text-fg-3">Budget énergie annuel estimé</p>
            <p className="num text-[28px] tracking-tight text-fg-2">{eur(tCur)} HT</p>
          </div>

          {/* Consultation */}
          <div className="relative flex items-center justify-center border-y border-[var(--line)] px-6 py-8 lg:w-[220px] lg:border-x lg:border-y-0">
            <div className="flex flex-col items-center text-center">
              <svg viewBox="0 0 160 160" className="size-28 lg:size-36" aria-hidden>
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgb(236 234 228 / 0.08)" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="var(--color-volt)" strokeWidth="1.5" strokeDasharray="40 400" className="origin-center animate-spin-slow" />
                {Array.from({ length: p.consulted }).map((_, i) => {
                  const a = (i / p.consulted) * Math.PI * 2 - Math.PI / 2;
                  const x = 80 + Math.cos(a) * 52;
                  const y = 80 + Math.sin(a) * 52;
                  const replied = i < p.received;
                  return (
                    <g key={i}>
                      <line x1="80" y1="80" x2={x} y2={y} stroke={replied ? "rgb(240 163 59 / 0.6)" : "rgb(236 234 228 / 0.15)"} strokeDasharray="3 3" />
                      <circle cx={x} cy={y} r="5" fill={replied ? "var(--color-volt)" : "var(--color-ink-700)"} />
                    </g>
                  );
                })}
                <circle cx="80" cy="80" r="16" fill="var(--color-ink-950)" stroke="var(--color-volt)" />
                <path d="M72 80c1.5 0 2-4 3.5-4s2 8 3.5 8 2-5 3.5-5 1.5 1 3 1" fill="none" stroke="var(--color-volt)" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <p className="eyebrow mt-4 !text-fg">Consultation INENCO</p>
              <p className="mt-1 text-[12px] text-fg-3">
                {p.consulted} fournisseurs consultés
                <br />
                {p.received} propositions reçues
              </p>
              <svg viewBox="0 0 24 24" className="mt-4 size-5 rotate-90 text-volt lg:rotate-0" aria-hidden>
                <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Nouvelle proposition */}
          <div className="relative p-5 md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(240_163_59/0.08),transparent_60%)]" />
            <p className="eyebrow !text-volt">Proposition retenue</p>
            <p className="mt-2 text-[13px] text-fg-3">
              {p.energy} · {p.segment}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
              <Stat label="Structure" value={p.proposal.structure} />
              <Stat label="Durée" value={p.proposal.duration} />
              <Stat label="Prix énergie" value={`${p.proposal.price} €/MWh`} sub="HT, hors acheminement et taxes" accent />
              <Stat label="Écart estimatif" value={`${pct > 0 ? "−" : "+"}${Math.abs(pct).toFixed(1).replace(".", ",")} %`} sub="sur la part énergie" accent />
            </dl>
            <ul className="mt-6 grid gap-2 border-t border-[var(--line)] pt-5 text-[13px] text-fg-2">
              {p.proposal.conditions.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-volt" />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[12px] text-fg-3">Budget énergie annuel estimé</p>
            <p className="num text-[28px] tracking-tight">{eur(tNew)} HT</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* curseur de consommation + écart */}
      <div className="grid gap-6 border-t border-[var(--line)] p-5 md:grid-cols-[1fr_auto] md:items-end md:p-8">
        <div>
          <label htmlFor={`${uid}-mwh`} className="flex items-baseline justify-between text-[13px] text-fg-2">
            <span>Faites varier la consommation annuelle</span>
            <span className="num font-mono text-fg">{mwh.toLocaleString("fr-FR")} MWh</span>
          </label>
          <input
            id={`${uid}-mwh`}
            type="range"
            min={p.mwh.min}
            max={p.mwh.max}
            step={5}
            value={mwh}
            onChange={(e) => setMwh(Number(e.target.value))}
            className="range mt-4 w-full"
            style={{ ["--p" as string]: `${((mwh - p.mwh.min) / (p.mwh.max - p.mwh.min)) * 100}%` }}
          />
          <div className="mt-2 flex justify-between font-mono text-[10.5px] text-fg-3">
            <span>{p.mwh.min} MWh</span>
            <span>{p.mwh.max} MWh</span>
          </div>
        </div>
        <div className="md:text-right">
          <p className="text-[12px] text-fg-3">Écart annuel estimé dans cet exemple</p>
          <p className="num text-[clamp(2.2rem,4vw,3.4rem)] font-medium leading-none tracking-tight text-volt">
            {eur(tGap)}
            <span className="ml-2 text-[0.4em] text-fg-2">HT / an</span>
          </p>
        </div>
      </div>

      <p className="border-t border-[var(--line)] px-5 py-4 text-[11.5px] leading-relaxed text-fg-3 md:px-8">
        Exemple fictif à visée pédagogique, ne constituant pas une offre. Hypothèses : prix de la part énergie seule, en € HT/MWh, hors abonnement, acheminement (TURPE / ATRD), accise, CTA et TVA. Prix illustratifs, non indexés sur un marché réel ; prix proposés commission du courtier incluse. Les résultats réels varient selon le profil, la date de consultation et l&apos;état du marché et ne sont pas garantis.
      </p>
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div>
      <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-3">{label}</dt>
      <dd className={cn("mt-1 text-[19px] tracking-tight", accent && "text-volt")}>{value}</dd>
      {sub && <dd className="text-[11px] text-fg-3">{sub}</dd>}
    </div>
  );
}
