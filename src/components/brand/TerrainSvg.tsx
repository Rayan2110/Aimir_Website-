import { terrainPaths } from "@/lib/terrain";
import { cn } from "@/lib/cn";

/**
 * Version statique (SVG) du relief énergétique de la marque.
 * Utilisée en en-tête des pages intérieures et sur les supports imprimés.
 */
export function TerrainSvg({
  className,
  width = 1600,
  height = 700,
  rows = 34,
  seed = 1.7,
  t = 4.2,
  amplitude = 0.24,
  stroke = "rgb(236 234 228)",
  fill = "var(--color-ink-950)",
  accent = true,
}: {
  className?: string;
  width?: number;
  height?: number;
  rows?: number;
  seed?: number;
  t?: number;
  amplitude?: number;
  stroke?: string;
  fill?: string;
  accent?: boolean;
}) {
  const paths = terrainPaths({ width, height, rows, cols: 110, seed, t, amplitude });
  const gid = `tg-${Math.round(seed * 100)}-${Math.round(t * 100)}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMax slice" className={cn("block", className)} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={stroke} stopOpacity="0" />
          <stop offset="0.25" stopColor={stroke} stopOpacity="0.5" />
          <stop offset="0.5" stopColor={accent ? "#f0a33b" : stroke} stopOpacity="1" />
          <stop offset="0.75" stopColor={stroke} stopOpacity="0.5" />
          <stop offset="1" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.fill} fill={fill} />
          <path d={p.line} fill="none" stroke={`url(#${gid})`} strokeOpacity={0.08 + 0.6 * Math.pow(p.z, 1.6)} strokeWidth={p.z > 0.7 ? 1.1 : 0.9} vectorEffect="non-scaling-stroke" />
        </g>
      ))}
    </svg>
  );
}
