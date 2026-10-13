"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ALERT_LEVEL_LABEL, type AlertLevel, type DeskAlert, type Site } from "@/lib/desk/types";
import { LEVEL_COLOR } from "./format";
import { cn } from "@/lib/cn";

export function LevelIcon({ level, className }: { level: AlertLevel; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("size-4 shrink-0", className)} style={{ color: LEVEL_COLOR[level] }} aria-hidden>
      {level === 1 && (
        <>
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 7v4M8 4.6v.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {level === 2 && (
        <>
          <path d="M8 1.8l6.6 12H1.4z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M8 6.2v3.6M8 11.8v.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {level === 3 && (
        <>
          <path d="M5.2 1.5h5.6l3.7 3.7v5.6l-3.7 3.7H5.2l-3.7-3.7V5.2z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M8 4.6v4.2M8 11v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function LevelBadge({ level }: { level: AlertLevel }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: LEVEL_COLOR[level] }}>
      <LevelIcon level={level} className="size-3.5" />
      Niveau {level} · {ALERT_LEVEL_LABEL[level]}
    </span>
  );
}

/** Centre d'alertes OMEGA : ce qui se passe / pourquoi c'est important / action disponible. */
export function AlertsCenter({
  alerts,
  sites,
  onAction,
  onSelectSite,
  limit,
}: {
  alerts: DeskAlert[];
  sites: Site[];
  onAction?: (a: DeskAlert) => void;
  onSelectSite?: (id: string) => void;
  limit?: number;
}) {
  const [filter, setFilter] = useState<0 | AlertLevel>(0);
  const [open, setOpen] = useState<string | null>(alerts[0]?.id ?? null);
  const counts = { 1: 0, 2: 0, 3: 0 } as Record<AlertLevel, number>;
  alerts.forEach((a) => counts[a.level]++);
  const list = alerts.filter((a) => !filter || a.level === filter).slice(0, limit ?? Infinity);
  const siteName = (id: string) => sites.find((s) => s.id === id)?.name ?? id;

  return (
    <div>
      <div role="tablist" aria-label="Filtrer par niveau" className="flex flex-wrap gap-1.5">
        {([0, 3, 2, 1] as const).map((l) => (
          <button
            key={l}
            role="tab"
            type="button"
            aria-selected={filter === l}
            onClick={() => setFilter(l)}
            className={cn(
              "flex items-center gap-2 rounded-[3px] border px-2.5 py-1.5 text-[12px] transition-colors",
              filter === l ? "border-fg/40 bg-fg/10 text-fg" : "border-[var(--line)] text-fg-2 hover:text-fg",
            )}
          >
            {l ? <LevelIcon level={l} className="size-3.5" /> : null}
            {l ? ALERT_LEVEL_LABEL[l] : "Toutes"}
            <span className="num font-mono text-[10px] text-fg-3">{l ? counts[l] : alerts.length}</span>
          </button>
        ))}
      </div>

      <ul className="mt-4 grid gap-2">
        {list.map((a) => {
          const isOpen = open === a.id;
          return (
            <li key={a.id} className={cn("overflow-hidden rounded-[4px] border transition-colors", isOpen ? "border-[var(--line-strong)] bg-fg/[0.03]" : "border-[var(--line)]")}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : a.id)} className="flex w-full items-start gap-3 p-3.5 text-left">
                <span className="mt-0.5 h-full w-0.5 self-stretch rounded-full" style={{ background: LEVEL_COLOR[a.level] }} />
                <span className="min-w-0 flex-1">
                  <LevelBadge level={a.level} />
                  <span className="mt-1 block text-[14px] tracking-tight text-fg">{a.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-fg-2">{a.what}</span>
                </span>
                <svg viewBox="0 0 10 6" className={cn("mt-2 size-2.5 shrink-0 text-fg-3 transition-transform", isOpen && "rotate-180")} aria-hidden>
                  <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="grid gap-4 border-t border-[var(--line)] px-3.5 py-4 pl-7 text-[13px] md:grid-cols-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-3">Ce qui se passe</p>
                        <p className="mt-1 leading-snug text-fg-2">{a.what}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-3">Pourquoi c&apos;est important</p>
                        <p className="mt-1 leading-snug text-fg-2">{a.why}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-3">Action disponible</p>
                        <button type="button" onClick={() => onAction?.(a)} className="mt-2 inline-flex items-center gap-2 rounded-[3px] bg-volt px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-950 hover:bg-volt-2">
                          {a.action} →
                        </button>
                      </div>
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--line)] pt-3 font-mono text-[10.5px] text-fg-3 md:col-span-3">
                        <span>Source : {a.evidence}</span>
                        <span>Règle OMEGA : {a.rule}</span>
                        <button type="button" className="link-u text-fg-2" onClick={() => onSelectSite?.(a.siteId)}>
                          Voir le site {siteName(a.siteId)}
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
