import { cn } from "@/lib/cn";

/**
 * Symbole INENCO : une onde (la volatilité du marché) qui se stabilise en
 * ligne droite et aboutit à un point (la décision), dans un cadre.
 * Provisoire tant que le logo officiel n'est pas fourni (brief §8).
 */
export function LogoMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("shrink-0", className)}>
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="3" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.5" />
      <path
        d="M4.5 16c1.6 0 2.1-6.5 4-6.5s2.4 13 4.4 13 2.2-9 3.9-9c1.4 0 1.7 2.5 3.2 2.5H24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? "[stroke-dasharray:60] [stroke-dashoffset:60] animate-[dash_1.6s_var(--ease-out-expo)_0.2s_forwards]" : undefined}
      />
      <circle cx="26.2" cy="16" r="2" fill="var(--color-volt)" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-7" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-[0.2em]">INENCO</span>
          <span className="mt-1 font-mono text-[8.5px] tracking-[0.42em] text-current/55">ENERGY</span>
        </span>
      )}
    </span>
  );
}
