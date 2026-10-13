"use client";

import { useMemo, useState } from "react";
import { franceDotGrid, outlinePath, project, PROJ_H, PROJ_W } from "@/lib/geo/france";
import type { Site } from "@/lib/desk/types";
import { siteStatus } from "@/lib/omega/engine";
import { LEVEL_COLOR, STATUS_LABEL } from "./format";
import { cn } from "@/lib/cn";

const W = 1000;
const H = Math.round((W * PROJ_H) / PROJ_W);

let dotsCache: string | null = null;
function dotsPath() {
  if (!dotsCache) dotsCache = franceDotGrid(0.19).map((p) => `M${(p.x * W).toFixed(1)} ${(p.y * H).toFixed(1)}h0`).join("");
  return dotsCache;
}

/** Carte de France en trame de points, avec un marqueur par établissement. */
export function FranceMap({
  sites,
  asOf,
  selected,
  onSelect,
  className,
  showLegend = true,
}: {
  sites: Site[];
  asOf: string;
  selected?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  showLegend?: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const dots = useMemo(() => dotsPath(), []);
  const outline = useMemo(() => outlinePath(W, H), []);

  // Écarte légèrement les sites trop proches (plusieurs établissements dans la même ville).
  const placed = useMemo(() => {
    const out: { site: Site; x: number; y: number; level: 0 | 1 | 2 | 3 }[] = [];
    for (const site of sites) {
      const p = project(site.lat, site.lon);
      let x = p.x * W;
      let y = p.y * H;
      const near = out.filter((o) => Math.hypot(o.x - x, o.y - y) < 18).length;
      if (near) {
        const a = near * 2.2;
        x += Math.cos(a) * 18;
        y += Math.sin(a) * 18;
      }
      out.push({ site, x, y, level: siteStatus(site, asOf).level });
    }
    return out;
  }, [sites, asOf]);

  const active = placed.find((p) => p.site.id === (hover ?? selected));

  return (
    <div className={cn("relative", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="group" aria-label="Carte des établissements">
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgb(240 163 59)" stopOpacity="0.5" />
            <stop offset="1" stopColor="rgb(240 163 59)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={outline} fill="rgb(236 234 228 / 0.015)" stroke="rgb(236 234 228 / 0.08)" strokeWidth="1.2" />
        <path d={dots} stroke="rgb(236 234 228 / 0.16)" strokeWidth="3.6" strokeLinecap="round" />

        {/* liaisons vers le site sélectionné */}
        {selected &&
          placed
            .filter((p) => p.site.id !== selected)
            .map((p) => {
              const s = placed.find((q) => q.site.id === selected)!;
              return <line key={p.site.id} x1={s.x} y1={s.y} x2={p.x} y2={p.y} stroke="rgb(240 163 59 / 0.07)" />;
            })}

        {placed.map(({ site, x, y, level }) => {
          const isSel = site.id === selected;
          const color = LEVEL_COLOR[level];
          return (
            <g
              key={site.id}
              role="button"
              tabIndex={0}
              aria-label={`${site.name} — ${site.type} — ${STATUS_LABEL[level]}`}
              aria-pressed={isSel}
              className="cursor-pointer outline-none [&:focus-visible_.focus]:opacity-100"
              onClick={() => onSelect?.(site.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(site.id);
                }
              }}
              onPointerEnter={() => setHover(site.id)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(site.id)}
              onBlur={() => setHover(null)}
            >
              <circle cx={x} cy={y} r="22" fill="transparent" />
              {isSel && <circle cx={x} cy={y} r="40" fill="url(#mapGlow)" />}
              {level >= 2 && (
                <circle cx={x} cy={y} r="8" fill="none" stroke={color} strokeWidth="1.5" className="animate-pulse-ring" style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }} />
              )}
              <circle className="focus opacity-0" cx={x} cy={y} r="15" fill="none" stroke="var(--color-volt)" strokeWidth="2" />
              <circle cx={x} cy={y} r={isSel ? 9 : 6.5} fill={color} stroke="var(--color-ink-950)" strokeWidth="2.5" style={{ transition: "r .4s" }} />
              {isSel && <circle cx={x} cy={y} r="14" fill="none" stroke="var(--color-volt)" strokeWidth="1.5" />}
            </g>
          );
        })}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+16px)] whitespace-nowrap rounded-[3px] border border-[var(--line-strong)] bg-ink-950/95 px-3 py-2 text-[12px] shadow-xl"
          style={{ left: `${(active.x / W) * 100}%`, top: `${(active.y / H) * 100}%` }}
        >
          <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-fg-3">{active.site.type}</span>
          <span className="block text-fg">{active.site.name}</span>
          <span className="mt-1 flex items-center gap-1.5 text-fg-2">
            <span className="size-1.5 rounded-full" style={{ background: LEVEL_COLOR[active.level] }} />
            {STATUS_LABEL[active.level]}
          </span>
        </div>
      )}

      {showLegend && (
        <ul className="absolute bottom-2 left-2 grid gap-1.5 rounded-[3px] bg-ink-950/70 p-2.5 text-[11px] text-fg-2 backdrop-blur" aria-label="Légende">
          {([3, 2, 1, 0] as const).map((l) => (
            <li key={l} className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: LEVEL_COLOR[l] }} />
              {STATUS_LABEL[l]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
