import type { ReactNode } from "react";
import Link from "next/link";
import { TerrainSvg } from "@/components/brand/TerrainSvg";
import { Split } from "@/components/motion/Split";
import { cn } from "@/lib/cn";

/** En-tête des pages intérieures : fil d'Ariane, titre découpé, relief de marque. */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
  aside,
  seed = 2.3,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  crumbs?: { href: string; label: string }[];
  aside?: ReactNode;
  seed?: number;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-[var(--line)] pt-[calc(var(--header-h)+56px)] lg:pt-[calc(var(--header-h)+32px+72px)]", className)}>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[78%] opacity-90 [mask-image:linear-gradient(to_bottom,transparent,black_35%)]">
        <TerrainSvg className="h-full w-full" seed={seed} t={seed * 1.9} amplitude={0.2} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_70%_at_15%_35%,rgb(6_8_11/0.95),transparent_75%)]" />

      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pb-20 md:pb-28">
        <nav aria-label="Fil d'Ariane" className="rise mb-10 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3" style={{ ["--d" as string]: 50 }}>
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-fg">
                Accueil
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link href={c.href} className="hover:text-fg">
                  {c.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-2 text-fg-2" aria-current="page">
              <span aria-hidden>/</span>
              {eyebrow}
            </li>
          </ol>
        </nav>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className={aside ? "lg:col-span-7" : "lg:col-span-10"}>
            <Split as="h1" text={title} immediate delay={120} className="display text-[clamp(2.8rem,6.4vw,6.4rem)]" />
            {lead && (
              <div className="rise mt-8 max-w-2xl text-[clamp(1.05rem,1.3vw,1.25rem)] leading-relaxed text-fg-2" style={{ ["--d" as string]: 350 }}>
                {lead}
              </div>
            )}
            {children && (
              <div className="rise mt-10" style={{ ["--d" as string]: 500 }}>
                {children}
              </div>
            )}
          </div>
          {aside && (
            <div className="rise lg:col-span-5" style={{ ["--d" as string]: 400 }}>
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
