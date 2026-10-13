/** Styles partagés des actions de la carte numérique (module neutre, utilisable côté serveur et client). */

export const actionCls =
  "flex h-14 items-center gap-3 rounded-[6px] border border-[var(--line-strong)] bg-ink-900/60 px-4 text-[15px] text-fg transition-colors hover:border-volt/60 hover:bg-ink-800";

export function ActionIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-volt" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
