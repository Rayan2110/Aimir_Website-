import Link from "next/link";
import { sectors } from "@/content/sectors";
import { SectorIcon } from "./SectorIcon";

/** Liste « terminal » des secteurs : lignes fines, révélation au survol. */
export function SectorList() {
  return (
    <ul className="border-t border-[var(--line)]">
      {sectors.map((s, i) => (
        <li key={s.slug} data-reveal style={{ ["--d" as string]: i * 40 }}>
          <Link
            href={`/secteurs/${s.slug}`}
            data-cursor="Voir"
            className="group relative isolate grid grid-cols-[auto_1fr_auto] items-center gap-5 overflow-hidden border-b border-[var(--line)] py-6 md:grid-cols-[48px_1.2fr_1fr_32px] md:gap-8 lg:grid-cols-[60px_1.1fr_1fr_180px_40px] md:py-7"
          >
            <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-volt/[0.08] to-transparent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
            <span className="font-mono text-[11px] text-fg-3 transition-colors group-hover:text-volt">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex items-center gap-4">
              <SectorIcon icon={s.icon} className="size-9 shrink-0 text-fg-3 transition-all duration-500 group-hover:text-volt md:size-10" />
              <span className="text-[clamp(1.4rem,2.4vw,2.2rem)] tracking-tight transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">{s.name}</span>
            </span>
            <span className="hidden text-[15px] text-fg-2 md:block">{s.short}</span>
            <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3 lg:block">{s.energies.join(" · ")}</span>
            <svg viewBox="0 0 16 12" className="h-3 w-4 -translate-x-2 text-fg-3 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-volt group-hover:opacity-100 max-md:opacity-100 max-md:translate-x-0" aria-hidden>
              <path d="M0 6h14M9 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  );
}
