import type { SectorIcon } from "@/content/sectors";

/**
 * Profil de charge électrique type sur 24 h, par secteur — ILLUSTRATION.
 * Ordres de grandeur pédagogiques (0 = minimum, 1 = pointe), non issus de mesures réelles.
 */
const PROFILES: Record<SectorIcon, { values: number[]; note: string }> = {
  restaurant: {
    values: [0.28, 0.26, 0.25, 0.25, 0.25, 0.27, 0.3, 0.36, 0.45, 0.55, 0.7, 0.88, 0.95, 0.85, 0.55, 0.45, 0.5, 0.68, 0.9, 1, 0.95, 0.8, 0.55, 0.35],
    note: "Le froid tourne la nuit ; deux pointes au service du midi et du soir.",
  },
  hotel: {
    values: [0.45, 0.42, 0.4, 0.4, 0.42, 0.55, 0.85, 0.98, 0.9, 0.7, 0.58, 0.55, 0.56, 0.55, 0.52, 0.52, 0.58, 0.7, 0.85, 0.92, 0.9, 0.8, 0.65, 0.52],
    note: "Pointe du matin (eau chaude, petit-déjeuner), remontée en soirée.",
  },
  shop: {
    values: [0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.14, 0.3, 0.65, 0.82, 0.85, 0.86, 0.86, 0.86, 0.86, 0.87, 0.88, 0.88, 0.8, 0.45, 0.2, 0.15, 0.13, 0.12],
    note: "Un plateau régulier sur les heures d'ouverture, un fond de froid la nuit.",
  },
  bakery: {
    values: [0.25, 0.3, 0.55, 0.9, 1, 0.98, 0.9, 0.78, 0.72, 0.68, 0.62, 0.6, 0.58, 0.52, 0.5, 0.52, 0.55, 0.55, 0.5, 0.4, 0.3, 0.25, 0.22, 0.22],
    note: "Une forte pointe avant l'aube, à la cuisson, souvent en heures creuses.",
  },
  office: {
    values: [0.15, 0.14, 0.14, 0.14, 0.14, 0.16, 0.25, 0.55, 0.85, 0.9, 0.9, 0.88, 0.72, 0.8, 0.9, 0.9, 0.88, 0.75, 0.45, 0.25, 0.18, 0.16, 0.15, 0.15],
    note: "Un plateau de 8 h à 18 h, un creux le midi, une veille la nuit.",
  },
  factory: {
    values: [0.32, 0.3, 0.3, 0.3, 0.32, 0.6, 0.92, 0.95, 0.96, 0.95, 0.96, 0.94, 0.88, 0.94, 0.96, 0.95, 0.94, 0.92, 0.9, 0.88, 0.85, 0.6, 0.38, 0.33],
    note: "Deux équipes de production : un plateau élevé de 6 h à 22 h.",
  },
  syndic: {
    values: [0.35, 0.33, 0.32, 0.32, 0.34, 0.45, 0.72, 0.85, 0.7, 0.52, 0.48, 0.5, 0.52, 0.5, 0.48, 0.48, 0.55, 0.7, 0.85, 0.88, 0.8, 0.65, 0.48, 0.4],
    note: "Parties communes et chaufferie : pointes au réveil et en soirée.",
  },
  building: {
    values: [0.35, 0.33, 0.32, 0.32, 0.34, 0.45, 0.72, 0.85, 0.7, 0.52, 0.48, 0.5, 0.52, 0.5, 0.48, 0.48, 0.55, 0.7, 0.85, 0.88, 0.8, 0.65, 0.48, 0.4],
    note: "Éclairage, ascenseurs, chauffage collectif : la vie de l'immeuble se lit dans la courbe.",
  },
  network: {
    values: [0.32, 0.3, 0.29, 0.29, 0.3, 0.38, 0.58, 0.72, 0.75, 0.72, 0.74, 0.82, 0.85, 0.8, 0.66, 0.6, 0.64, 0.74, 0.86, 0.92, 0.88, 0.74, 0.55, 0.4],
    note: "Consolidée sur 20 sites, la courbe lisse les pointes de chaque établissement.",
  },
};

const W = 720;
const H = 220;
const T = 14;
const B = 28;

export function LoadCurve({ icon }: { icon: SectorIcon }) {
  const { values, note } = PROFILES[icon];
  const pts = values.map((v, i) => [(i / 23) * W, T + (1 - v) * (H - T - B)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const area = `${line}L${W} ${H - B}L0 ${H - B}Z`;
  const peak = values.indexOf(Math.max(...values));

  return (
    <figure className="load-curve" data-reveal="fade">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" role="img" aria-label={`Profil de charge type sur 24 heures, illustration. ${note}`}>
        <defs>
          <linearGradient id={`lc-${icon}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--color-volt)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--color-volt)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 6, 12, 18, 24].map((h) => (
          <g key={h}>
            <line x1={(h / 24) * W} x2={(h / 24) * W} y1={T} y2={H - B} stroke="rgb(236 234 228 / 0.07)" />
            <text x={(h / 24) * W} y={H - 8} textAnchor={h === 0 ? "start" : h === 24 ? "end" : "middle"} fontSize="11" fill="var(--color-fg-3)" fontFamily="var(--font-mono)">
              {h} h
            </text>
          </g>
        ))}
        <line x1="0" x2={W} y1={H - B} y2={H - B} stroke="rgb(236 234 228 / 0.2)" />
        <path d={area} fill={`url(#lc-${icon})`} className="lc-area" />
        <path d={line} fill="none" stroke="var(--color-volt)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" pathLength={1} className="lc-line" />
        <g className="lc-peak">
          <circle cx={pts[peak][0]} cy={pts[peak][1]} r="5" fill="var(--color-volt)" stroke="var(--color-ink-950)" strokeWidth="2" />
          <text x={pts[peak][0]} y={pts[peak][1] - 12} textAnchor="middle" fontSize="11" fill="var(--color-fg)" fontFamily="var(--font-mono)">
            pointe · {peak} h
          </text>
        </g>
      </svg>
      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
        <span className="text-[15px] text-fg-2">{note}</span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">Profil type · illustration, non issue de mesures</span>
      </figcaption>
    </figure>
  );
}
