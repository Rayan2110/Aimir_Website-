"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; label: string; share: number; tag: "Mis en concurrence" | "Réglementé"; text: string; tone: number };

/** Répartition indicative d'une facture (part TTC). Illustration pédagogique. */
const DATA: Record<"electricite" | "gaz", Part[]> = {
  electricite: [
    { id: "energie", label: "Prix de l'énergie", share: 42, tag: "Mis en concurrence", tone: 1, text: "Prix du kWh fixé par le fournisseur, unique ou par poste horaire (heures pleines / heures creuses). Il intègre en général les coûts de capacité et des certificats d'économies d'énergie. C'est la part que la consultation permet de faire évoluer." },
    { id: "abonnement", label: "Abonnement", share: 6, tag: "Mis en concurrence", tone: 0.75, text: "Part fixe mensuelle, liée à la puissance souscrite (kVA). Une puissance surdimensionnée se paie toute l'année." },
    { id: "acheminement", label: "Acheminement (TURPE)", share: 24, tag: "Réglementé", tone: 0.4, text: "Utilisation du réseau public, fixée par la Commission de régulation de l'énergie. Le montant est identique quel que soit le fournisseur. Il dépend de votre segment (C5, C4…) et de votre puissance." },
    { id: "taxes", label: "Taxes et contributions", share: 11.3, tag: "Réglementé", tone: 0.28, text: "Accise sur l'électricité et contribution tarifaire d'acheminement (CTA). Fixées par la loi, elles ne dépendent pas du fournisseur." },
    { id: "tva", label: "TVA", share: 16.7, tag: "Réglementé", tone: 0.16, text: "20 % sur l'ensemble. Une entreprise assujettie la récupère en général : nos comparaisons se font donc hors TVA." },
  ],
  gaz: [
    { id: "energie", label: "Prix de la molécule", share: 46, tag: "Mis en concurrence", tone: 1, text: "Prix du MWh de gaz, fixe ou indexé sur un marché de référence. C'est la part que la consultation permet de faire évoluer." },
    { id: "abonnement", label: "Abonnement", share: 4, tag: "Mis en concurrence", tone: 0.75, text: "Part fixe facturée par le fournisseur, selon votre profil de consommation." },
    { id: "acheminement", label: "Acheminement et stockage", share: 21, tag: "Réglementé", tone: 0.4, text: "Distribution (ATRD), transport et stockage : tarifs régulés, identiques quel que soit le fournisseur." },
    { id: "taxes", label: "Taxes et contributions", share: 12.3, tag: "Réglementé", tone: 0.28, text: "Accise sur le gaz naturel et contribution tarifaire d'acheminement (CTA). Fixées par la loi." },
    { id: "tva", label: "TVA", share: 16.7, tag: "Réglementé", tone: 0.16, text: "20 % sur l'ensemble, en général récupérable par l'entreprise. Nos comparaisons se font hors TVA." },
  ],
};

export function OfferAnatomy({ tone = "dark" }: { tone?: "dark" | "paper" }) {
  const [energy, setEnergy] = useState<"electricite" | "gaz">("electricite");
  const parts = DATA[energy];
  const [active, setActive] = useState("energie");
  const part = parts.find((p) => p.id === active) ?? parts[0];
  const paper = tone === "paper";
  const ink = paper ? "11 15 20" : "236 234 228";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Énergie" className={cn("flex rounded-[3px] border p-0.5", paper ? "border-ink-text/15" : "border-[var(--line)]")}>
          {(["electricite", "gaz"] as const).map((e) => (
            <button
              key={e}
              type="button"
              aria-pressed={energy === e}
              onClick={() => {
                setEnergy(e);
                setActive("energie");
              }}
              className={cn(
                "rounded-[2px] px-4 py-1.5 text-[13px] transition-colors",
                energy === e ? (paper ? "bg-ink-text text-paper" : "bg-fg text-ink-950") : "opacity-60 hover:opacity-100",
              )}
            >
              {e === "electricite" ? "Électricité" : "Gaz naturel"}
            </button>
          ))}
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] opacity-60">Répartition indicative d&apos;une facture TTC</span>
      </div>

      {/* barre décomposée */}
      <div className="mt-8 flex h-16 gap-[3px] md:h-20" role="group" aria-label="Composantes de la facture">
        {parts.map((p) => (
          <button
            key={`${energy}-${p.id}`}
            type="button"
            aria-label={`${p.label} : environ ${Math.round(p.share)} % (${p.tag.toLowerCase()})`}
            aria-pressed={active === p.id}
            onClick={() => setActive(p.id)}
            onPointerEnter={() => setActive(p.id)}
            className="group relative h-full origin-left animate-[grow_1.1s_var(--ease-out-expo)_both] overflow-hidden rounded-[2px] text-left transition-[filter] duration-300"
            style={{
              width: `${p.share}%`,
              background: p.tag === "Mis en concurrence" ? `rgb(240 163 59 / ${p.tone})` : `rgb(${ink} / ${p.tone})`,
              filter: active === p.id ? "none" : "saturate(0.6) brightness(0.85)",
            }}
          >
            {active === p.id && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-current" style={{ color: paper ? "#0b0f14" : "#fff" }} />}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-[3px] font-mono text-[10px] uppercase tracking-[0.08em]">
        {parts.map((p) => (
          <span key={p.id} className={cn("truncate transition-opacity", active === p.id ? "opacity-100" : "opacity-50")} style={{ width: `${p.share}%` }}>
            {p.share >= 10 ? p.label : ""}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-5 text-[12px] opacity-75">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-[2px] bg-volt" /> Mis en concurrence par la consultation
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-[2px]" style={{ background: `rgb(${ink} / 0.4)` }} /> Réglementé : identique chez tous les fournisseurs
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${energy}-${part.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className={cn("mt-8 grid gap-4 border-t pt-6 md:grid-cols-[1fr_2fr]", paper ? "border-ink-text/15" : "border-[var(--line)]")}
        >
          <div>
            <p className="text-[26px] tracking-tight">{part.label}</p>
            <p className={cn("mt-1 font-mono text-[11px] uppercase tracking-[0.12em]", part.tag === "Réglementé" ? "opacity-60" : paper ? "text-volt-deep" : "text-volt")}>{part.tag}</p>
          </div>
          <p className="max-w-2xl text-[16px] leading-relaxed opacity-80">{part.text}</p>
        </motion.div>
      </AnimatePresence>
      <p className="mt-6 text-[11.5px] opacity-55">
        Illustration pédagogique : la répartition réelle varie fortement selon le segment, la puissance, la consommation et la période.
      </p>
    </div>
  );
}
