"use client";

import { useEffect, useRef, useState } from "react";
import { LevelIcon } from "./AlertsCenter";
import { LEVEL_COLOR } from "./format";
import { cn } from "@/lib/cn";

/**
 * Energy Timeline narrative (brief §9, §11) : le cycle d'un contrat fictif de
 * 3 ans défile au scroll ; « Aujourd'hui » avance et OMEGA déclenche ses
 * alertes au moment où les règles s'appliquent.
 */
const START = Date.UTC(2026, 2, 1);
const END = Date.UTC(2029, 2, 1);
const DAY = 86_400_000;
const TOTAL = (END - START) / DAY;

const MILESTONES = [
  { label: "Contrat signé", sub: "mars 2026", at: 0 },
  { label: "Suivi", sub: "2027", at: 0.33 },
  { label: "Fenêtre d'anticipation", sub: "J-240", at: 1 - 240 / TOTAL },
  { label: "Échéance", sub: "mars 2029", at: 1 },
];

const ALERTS = [
  { level: 1 as const, from: 1 - 240 / TOTAL, title: "Fenêtre de renouvellement", text: "La fenêtre de préparation du renouvellement approche. OMEGA vous propose de planifier l'étude." },
  { level: 2 as const, from: 1 - 120 / TOTAL, title: "Contrat bientôt à échéance", text: "Le contrat arrive à échéance dans 120 jours : c'est le moment de consulter les fournisseurs." },
  { level: 3 as const, from: 1 - 60 / TOTAL, title: "Échéance très proche", text: "Sans décision, le contrat peut être reconduit ou basculer sur une offre de continuité." },
];

function phaseOf(p: number) {
  if (p < 0.08) return "Signature";
  if (p < 1 - 240 / TOTAL) return "Suivi";
  if (p < 1 - 60 / TOTAL) return "Anticipation";
  return "Décision";
}

export function ContractJourney() {
  const section = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = section.current!;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const v = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      setP(Math.round(v * 1000) / 1000);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const today = START + p * (END - START);
  const daysLeft = Math.max(0, Math.round((END - today) / DAY));
  const date = new Date(today).toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <div ref={section} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-[var(--gutter)] pt-[var(--header-h)]">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">
                <span className="text-volt">Energy timeline</span> — contrat fictif de 3 ans
              </p>
              <p className="display text-[clamp(2.6rem,7vw,6.5rem)]" aria-live="polite">
                {phaseOf(p)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">Aujourd&apos;hui</p>
              <p className="num text-[20px] capitalize tracking-tight">{date}</p>
              <p className="num font-mono text-[13px] text-volt">J-{daysLeft}</p>
            </div>
          </div>

          {/* frise */}
          <div className="relative mt-14 h-24">
            <div className="absolute inset-x-0 top-6 h-1.5 overflow-hidden rounded-full bg-fg/[0.07]">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-fg/20 via-info/60 to-warn" style={{ width: `${p * 100}%` }} />
              <div className="absolute inset-y-0 bg-info/15" style={{ left: `${(1 - 240 / TOTAL) * 100}%`, right: 0 }} />
            </div>
            {MILESTONES.map((m, i) => (
              <div
                key={m.label}
                className={cn("absolute top-0", i === 0 ? "text-left" : i === MILESTONES.length - 1 ? "-translate-x-full text-right" : "-translate-x-1/2 text-center")}
                style={{ left: `${m.at * 100}%` }}
              >
                <span className={cn("block h-[38px] w-px", i === 0 ? "" : i === MILESTONES.length - 1 ? "ml-auto" : "mx-auto", p >= m.at ? "bg-fg/60" : "bg-fg/20")} />
                <span className={cn("mt-2 block whitespace-nowrap text-[13px] transition-colors md:text-[15px]", p >= m.at ? "text-fg" : "text-fg-3")}>{m.label}</span>
                <span className="block font-mono text-[10.5px] text-fg-3">{m.sub}</span>
              </div>
            ))}
            {/* marqueur Aujourd'hui */}
            <div className="absolute top-0 -translate-x-1/2" style={{ left: `${p * 100}%` }}>
              <span className="block size-[18px] translate-y-[1px] rounded-full border-2 border-ink-950 bg-volt shadow-[0_0_24px_rgb(240_163_59/0.9)]" />
            </div>
          </div>

          {/* alertes OMEGA */}
          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {ALERTS.map((a) => {
              const on = p >= a.from;
              return (
                <div
                  key={a.title}
                  className={cn(
                    "rounded-[4px] border p-4 transition-all duration-700 ease-[var(--ease-out-expo)]",
                    on ? "translate-y-0 border-[var(--line-strong)] bg-ink-850 opacity-100" : "translate-y-4 border-[var(--line)] opacity-25",
                  )}
                >
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: LEVEL_COLOR[a.level] }}>
                    <LevelIcon level={a.level} className="size-3.5" /> Ω OMEGA · niveau {a.level}
                  </p>
                  <p className="mt-2 text-[15px] tracking-tight text-fg">{a.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-fg-2">{a.text}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">Faites défiler · exemple fictif · règles OMEGA réelles du prototype</p>
        </div>
      </div>
    </div>
  );
}
