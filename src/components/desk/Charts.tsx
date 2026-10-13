"use client";

import { useMemo, useState } from "react";
import type { Site } from "@/lib/desk/types";
import { MONTH_SHORT, compactEur, monthLabel, nf, siteSpend } from "./format";
import { cn } from "@/lib/cn";

/* Palette validée (dataviz) : électricité #C8811F · gaz #4F83E6 sur #0E1319. */
const ELEC = "var(--color-elec)";
const GAS = "var(--color-gas)";

function niceMax(v: number) {
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * pow;
}

function Legend() {
  return (
    <ul className="flex gap-4 text-[11.5px] text-fg-2" aria-label="Légende">
      <li className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-[2px]" style={{ background: ELEC }} /> Électricité
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-[2px]" style={{ background: GAS }} /> Gaz
      </li>
    </ul>
  );
}

function ViewToggle({ table, onChange }: { table: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex rounded-[3px] border border-[var(--line)] p-0.5 font-mono text-[10px] uppercase tracking-[0.1em]">
      {["Graphique", "Tableau"].map((l, i) => (
        <button
          key={l}
          type="button"
          aria-pressed={table === (i === 1)}
          onClick={() => onChange(i === 1)}
          className={cn("rounded-[2px] px-2 py-1 transition-colors", table === (i === 1) ? "bg-fg/10 text-fg" : "text-fg-3 hover:text-fg")}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/** Consommation mensuelle consolidée — colonnes empilées électricité + gaz. */
export function ConsumptionChart({ sites }: { sites: Site[] }) {
  const [table, setTable] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const data = useMemo(() => {
    const months = sites[0]?.monthly.map((m) => m.month) ?? [];
    return months.map((month, i) => ({
      month,
      elec: sites.reduce((s, x) => s + (x.monthly[i]?.elecMWh ?? 0), 0),
      gas: sites.reduce((s, x) => s + (x.monthly[i]?.gasMWh ?? 0), 0),
    }));
  }, [sites]);

  const max = niceMax(Math.max(...data.map((d) => d.elec + d.gas)) * 1.05);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const W = 720,
    H = 240,
    L = 44,
    B = 26,
    T = 8;
  const plotW = W - L;
  const plotH = H - B - T;
  const band = plotW / data.length;
  const bw = Math.min(18, band * 0.62);
  const y = (v: number) => T + plotH - (v / max) * plotH;

  return (
    <figure>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <figcaption>
          <span className="block text-[15px] tracking-tight">Consommation mensuelle</span>
          <span className="block text-[12px] text-fg-3">Tous sites · MWh · 24 derniers mois</span>
        </figcaption>
        <div className="flex items-center gap-4">
          <Legend />
          <ViewToggle table={table} onChange={setTable} />
        </div>
      </div>

      {table ? (
        <div className="thin-scrollbar max-h-[260px] overflow-auto" data-lenis-prevent>
          <table className="num w-full text-right text-[12px]">
            <thead className="sticky top-0 bg-ink-850 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
              <tr>
                <th className="py-2 text-left font-normal">Mois</th>
                <th className="font-normal">Électricité</th>
                <th className="font-normal">Gaz</th>
                <th className="font-normal">Total</th>
              </tr>
            </thead>
            <tbody className="text-fg-2">
              {data.map((d) => (
                <tr key={d.month} className="border-t border-[var(--line)]">
                  <td className="py-1.5 text-left">{monthLabel(d.month)}</td>
                  <td>{nf(d.elec, 1)}</td>
                  <td>{nf(d.gas, 1)}</td>
                  <td className="text-fg">{nf(d.elec + d.gas, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Consommation mensuelle électricité et gaz, 24 mois">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke="rgb(236 234 228 / 0.07)" />
                <text x={L - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="var(--color-fg-3)" fontFamily="var(--font-mono)">
                  {nf(t)}
                </text>
              </g>
            ))}
            {data.map((d, i) => {
              const cx = L + band * i + band / 2;
              const yE = y(d.elec);
              const yT = y(d.elec + d.gas);
              const dim = hover !== null && hover !== i;
              return (
                <g key={d.month} opacity={dim ? 0.45 : 1} style={{ transition: "opacity .2s" }}>
                  {/* électricité, base */}
                  <rect x={cx - bw / 2} y={yE} width={bw} height={y(0) - yE} fill={ELEC} />
                  {/* gaz, empilé avec un écart de 2px et une extrémité arrondie */}
                  {d.gas > 0 && <path d={roundTop(cx - bw / 2, yT, bw, Math.max(0, yE - yT - 2), 3)} fill={GAS} />}
                  {i % 3 === 0 && (
                    <text x={cx} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-fg-3)" fontFamily="var(--font-mono)">
                      {monthLabel(d.month)}
                    </text>
                  )}
                  <rect
                    x={L + band * i}
                    y={T}
                    width={band}
                    height={plotH}
                    fill="transparent"
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover(null)}
                  />
                </g>
              );
            })}
            <line x1={L} x2={W} y1={y(0)} y2={y(0)} stroke="rgb(236 234 228 / 0.2)" />
          </svg>
          {hover !== null && (
            <div
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-[3px] border border-[var(--line-strong)] bg-ink-950/95 px-3 py-2 text-[12px] shadow-xl"
              style={{ left: `${((L + band * hover + band / 2) / W) * 100}%` }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-3">
                {MONTH_SHORT[Number(data[hover].month.slice(5)) - 1]} {data[hover].month.slice(0, 4)}
              </p>
              <p className="num mt-1 flex items-center gap-2 text-fg-2">
                <span className="size-2 rounded-[2px]" style={{ background: ELEC }} /> Électricité <span className="ml-auto pl-3 text-fg">{nf(data[hover].elec, 1)} MWh</span>
              </p>
              <p className="num flex items-center gap-2 text-fg-2">
                <span className="size-2 rounded-[2px]" style={{ background: GAS }} /> Gaz <span className="ml-auto pl-3 text-fg">{nf(data[hover].gas, 1)} MWh</span>
              </p>
            </div>
          )}
        </div>
      )}
    </figure>
  );
}

function roundTop(x: number, y: number, w: number, h: number, r: number) {
  if (h <= 0) return "";
  const rr = Math.min(r, h, w / 2);
  return `M${x} ${y + h}V${y + rr}Q${x} ${y} ${x + rr} ${y}H${x + w - rr}Q${x + w} ${y} ${x + w} ${y + rr}V${y + h}Z`;
}

/** Dépense estimée par site (part énergie) — barres horizontales empilées. */
export function SpendBySite({ sites, onSelect, limit = 8 }: { sites: Site[]; onSelect?: (id: string) => void; limit?: number }) {
  const [table, setTable] = useState(false);
  const rows = useMemo(
    () =>
      sites
        .map((s) => ({ s, ...siteSpend(s) }))
        .sort((a, b) => b.elec + b.gas - (a.elec + a.gas))
        .slice(0, limit),
    [sites, limit],
  );
  const max = Math.max(...rows.map((r) => r.elec + r.gas));

  return (
    <figure>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <figcaption>
          <span className="block text-[15px] tracking-tight">Dépense estimée par site</span>
          <span className="block text-[12px] text-fg-3">12 mois · part énergie · € HT</span>
        </figcaption>
        <div className="flex items-center gap-4">
          <Legend />
          <ViewToggle table={table} onChange={setTable} />
        </div>
      </div>
      {table ? (
        <table className="num w-full text-right text-[12px]">
          <thead className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
            <tr>
              <th className="py-2 text-left font-normal">Site</th>
              <th className="font-normal">Électricité</th>
              <th className="font-normal">Gaz</th>
              <th className="font-normal">Total</th>
            </tr>
          </thead>
          <tbody className="text-fg-2">
            {rows.map((r) => (
              <tr key={r.s.id} className="border-t border-[var(--line)]">
                <td className="py-1.5 text-left">{r.s.name}</td>
                <td>{nf(r.elec)} €</td>
                <td>{nf(r.gas)} €</td>
                <td className="text-fg">{nf(r.elec + r.gas)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <ul className="grid gap-2.5">
          {rows.map((r) => (
            <li key={r.s.id}>
              <button type="button" onClick={() => onSelect?.(r.s.id)} className="group grid w-full grid-cols-[minmax(0,140px)_1fr_auto] items-center gap-3 text-left">
                <span className="truncate text-[12.5px] text-fg-2 group-hover:text-fg">{r.s.name}</span>
                <span className="flex h-3 items-stretch gap-[2px]">
                  <span className="rounded-l-[2px]" style={{ width: `${(r.elec / max) * 100}%`, background: ELEC }} />
                  {r.gas > 0 && <span className="rounded-r-[3px]" style={{ width: `${(r.gas / max) * 100}%`, background: GAS }} />}
                </span>
                <span className="num font-mono text-[11px] text-fg-2">{compactEur(r.elec + r.gas)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
