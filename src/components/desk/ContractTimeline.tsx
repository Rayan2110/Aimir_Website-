"use client";

import { ENERGY_LABEL, type EnergyContract, type Site } from "@/lib/desk/types";
import { OMEGA_THRESHOLDS, daysBetween, formatDateFR } from "@/lib/omega/engine";
import { cn } from "@/lib/cn";

const DAY = 86_400_000;
const pct = (t: number, a: number, b: number) => Math.min(100, Math.max(0, ((t - a) / (b - a)) * 100));

/**
 * Energy Timeline (brief §11) : où en est le contrat dans son cycle ?
 * Signature → Suivi → Fenêtre d'anticipation → Échéance.
 */
export function ContractTimeline({ contract, asOf, compact = false }: { contract: EnergyContract; asOf: string; compact?: boolean }) {
  const start = Date.parse(contract.start);
  const end = Date.parse(contract.end);
  const now = Date.parse(asOf);
  const from = start;
  const to = end + 60 * DAY;
  const windowStart = end - OMEGA_THRESHOLDS.renewalWindowDays * DAY;
  const critStart = end - OMEGA_THRESHOLDS.expiryCriticalDays * DAY;
  const days = daysBetween(asOf, contract.end);

  const years: number[] = [];
  for (let y = new Date(from).getUTCFullYear() + 1; y <= new Date(to).getUTCFullYear(); y++) years.push(y);

  const phase =
    now < windowStart ? "Suivi" : now < critStart ? "Fenêtre d'anticipation" : now <= end ? "Échéance proche" : "Échu";

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[13px] text-fg-2">
          {ENERGY_LABEL[contract.energy]} · {contract.supplier} · {contract.structure}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-3">
          Phase : <span className="text-fg">{phase}</span>
        </p>
      </div>

      <div className={cn("relative mt-8", compact ? "h-14" : "h-16")}>
        {/* segments */}
        <div className="absolute inset-x-0 top-3 flex h-2 overflow-hidden rounded-full bg-fg/5">
          <span className="h-full bg-fg/15" style={{ width: `${pct(windowStart, from, to)}%` }} />
          <span className="h-full bg-info/60" style={{ width: `${pct(critStart, from, to) - pct(windowStart, from, to)}%` }} />
          <span className="h-full bg-warn/70" style={{ width: `${pct(end, from, to) - pct(critStart, from, to)}%` }} />
        </div>
        {/* jalons */}
        {[
          { t: start, label: "Signature", date: contract.start },
          { t: start + (windowStart - start) / 2, label: "Suivi" },
          { t: windowStart, label: "Anticipation" },
          { t: end, label: "Échéance", date: contract.end },
        ].map((m, i) => (
          <div
            key={m.label}
            className={cn("absolute top-0", i === 0 ? "text-left" : "-translate-x-1/2 text-center")}
            style={{ left: `${pct(m.t, from, to)}%` }}
          >
            <span className={cn("block h-8 w-px bg-fg/30", i !== 0 && "mx-auto")} />
            <span className="mt-1 block whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">{m.label}</span>
            {m.date && !compact && <span className="block whitespace-nowrap font-mono text-[10px] text-fg-2">{formatDateFR(m.date)}</span>}
          </div>
        ))}
        {/* aujourd'hui */}
        {now >= from && now <= to && (
          <div className="absolute -top-6 -translate-x-1/2" style={{ left: `${pct(now, from, to)}%` }}>
            <span className="block whitespace-nowrap rounded-[2px] bg-volt px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-950">
              Aujourd&apos;hui · {days >= 0 ? `J-${days}` : `+${-days} j`}
            </span>
            <span className="mx-auto mt-0.5 block h-6 w-0.5 bg-volt shadow-[0_0_12px_rgb(240_163_59/0.9)]" />
          </div>
        )}
      </div>

      {!compact && (
        <div className="mt-6 flex justify-between border-t border-[var(--line)] pt-2 font-mono text-[10px] text-fg-3">
          {years.map((y) => (
            <span key={y}>{y}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Échéancier multi-sites : tous les contrats sur un même axe de temps. */
export function ContractsGantt({ sites, asOf, onSelect }: { sites: Site[]; asOf: string; onSelect?: (siteId: string) => void }) {
  const rows = sites
    .flatMap((s) => s.contracts.map((c) => ({ s, c })))
    .sort((a, b) => a.c.end.localeCompare(b.c.end));
  const from = Date.parse("2025-01-01");
  const to = Date.parse("2030-01-01");
  const now = Date.parse(asOf);
  const years = [2025, 2026, 2027, 2028, 2029];

  return (
    <div className="min-w-[680px]">
      <div className="grid grid-cols-[200px_1fr] border-b border-[var(--line)] pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-3">
        <span>Site · énergie</span>
        <div className="relative">
          {years.map((y) => (
            <span key={y} className="absolute" style={{ left: `${pct(Date.parse(`${y}-01-01`), from, to)}%` }}>
              {y}
            </span>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-[200px] right-0">
          {years.map((y) => (
            <span key={y} className="absolute inset-y-0 w-px bg-fg/5" style={{ left: `${pct(Date.parse(`${y}-01-01`), from, to)}%` }} />
          ))}
          <span className="absolute inset-y-0 w-px bg-volt shadow-[0_0_10px_rgb(240_163_59/0.8)]" style={{ left: `${pct(now, from, to)}%` }} />
        </div>
        {rows.map(({ s, c }) => {
          const days = daysBetween(asOf, c.end);
          const level = days <= OMEGA_THRESHOLDS.expiryCriticalDays ? 3 : days <= OMEGA_THRESHOLDS.expiryActionDays ? 2 : days <= OMEGA_THRESHOLDS.renewalWindowDays ? 1 : 0;
          const left = pct(Date.parse(c.start), from, to);
          const right = pct(Date.parse(c.end), from, to);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect?.(s.id)}
              className="group grid w-full grid-cols-[200px_1fr] items-center border-b border-[var(--line)] py-2 text-left hover:bg-fg/[0.03]"
            >
              <span className="truncate pr-3 text-[12.5px]">
                <span className="text-fg">{s.name}</span>
                <span className="text-fg-3"> · {c.energy === "electricite" ? "Élec." : "Gaz"}</span>
              </span>
              <span className="relative h-4">
                <span
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(0.5, right - left)}%`,
                    background: c.energy === "electricite" ? "var(--color-elec)" : "var(--color-gas)",
                    opacity: 0.85,
                  }}
                />
                <span
                  className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-850"
                  style={{ left: `${right}%`, background: level ? `var(--color-${["", "info", "warn", "crit"][level]})` : "var(--color-ok)" }}
                  title={`Échéance ${formatDateFR(c.end)}`}
                />
                <span className="absolute top-1/2 hidden -translate-y-1/2 pl-3 font-mono text-[10px] text-fg-2 group-hover:block" style={{ left: `${right}%` }}>
                  {formatDateFR(c.end)} · J-{days}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-fg-2">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-4 rounded-full bg-elec" /> Électricité
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-4 rounded-full bg-gas" /> Gaz
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-px bg-volt" /> Aujourd&apos;hui
        </span>
      </div>
    </div>
  );
}
