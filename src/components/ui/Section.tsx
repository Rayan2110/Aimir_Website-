import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Split } from "@/components/motion/Split";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-[var(--gutter)]", className)}>{children}</div>;
}

/** En-tête de section : index mono + libellé + titre découpé + chapeau. */
export function SectionHead({
  index,
  label,
  title,
  lead,
  className,
  align = "left",
  as = "h2",
}: {
  index?: string;
  label: string;
  title: string;
  lead?: ReactNode;
  className?: string;
  align?: "left" | "split";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("grid gap-8", align === "split" && "lg:grid-cols-12 lg:items-end", className)}>
      <div className={cn(align === "split" && "lg:col-span-7")}>
        <p className="eyebrow mb-6 flex items-center gap-3" data-reveal>
          {index && <span className="text-volt">{index}</span>}
          <span className="h-px w-8 bg-current opacity-40" />
          <span>{label}</span>
        </p>
        <Split as={as} text={title} className="display text-[clamp(2.4rem,5.6vw,5.2rem)]" />
      </div>
      {lead && (
        <div
          className={cn("max-w-xl text-[17px] leading-relaxed opacity-75", align === "split" && "lg:col-span-5 lg:justify-self-end")}
          data-reveal
          style={{ ["--d" as string]: 150 }}
        >
          {lead}
        </div>
      )}
    </div>
  );
}

/** Badge « exemple » — obligatoire sur toute donnée non issue d'un vrai dossier (brief §7, §15). */
export function ExampleBadge({ children = "Exemple illustratif — données fictives", className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[2px] border border-warn/40 bg-warn/10 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-warn",
        className,
      )}
    >
      <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" />
        <path d="M6 3.2v3.6M6 8.4v.4" stroke="currentColor" strokeLinecap="round" />
      </svg>
      {children}
    </span>
  );
}
