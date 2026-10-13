import Link from "next/link";
import { EnergyField } from "@/components/hero/EnergyField";
import { TaglineCycler } from "@/components/hero/TaglineCycler";
import { InvoiceFlow } from "@/components/upload/InvoiceFlow";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";

const STEPS = [
  ["01", "Analyse", "de votre contrat actuel"],
  ["02", "Consultation", "de plusieurs fournisseurs"],
  ["03", "Comparaison", "lisible, ligne à ligne"],
  ["04", "Mise en place", "et suivi jusqu'à l'échéance"],
] as const;

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[var(--header-h)] lg:pt-[calc(var(--header-h)+32px)]">
      <EnergyField className="-z-20" />
      {/* voiles de lisibilité */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_20%_40%,rgb(6_8_11/0.92),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink-950 to-transparent" />

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-12 px-[var(--gutter)] py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="lg:col-span-7">
          <p className="rise mb-8 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.16em] text-fg-2 md:text-[13px]" style={{ ["--d" as string]: 100 }}>
            <span className="h-px w-8 shrink-0 bg-volt" />
            Courtier en électricité &amp; gaz pour les professionnels
          </p>
          <h1 className="display text-[clamp(2.7rem,5.2vw,5.6rem)]">
            <span className="sr-only">{site.name}, courtier en électricité et gaz pour les professionnels : </span>
            <TaglineCycler />
          </h1>
          <p className="rise mt-8 max-w-xl text-[clamp(1.05rem,1.3vw,1.25rem)] leading-relaxed text-fg-2" style={{ ["--d" as string]: 650 }}>
            {site.baseline}
          </p>
          <div className="rise mt-10 flex flex-wrap items-center gap-4" style={{ ["--d" as string]: 800 }}>
            <ButtonLink href="#depot" magnetic>
              Analyser ma facture
            </ButtonLink>
            <ButtonLink href="/methode" variant="ghost">
              Découvrir notre méthode
            </ButtonLink>
          </div>
          <p className="rise mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3" style={{ ["--d" as string]: 950 }}>
            Rémunéré par le fournisseur retenu · Sans engagement
          </p>
        </div>

        <div id="depot" className="rise scroll-mt-28 lg:col-span-5 lg:pl-6" style={{ ["--d" as string]: 700 }}>
          <InvoiceFlow variant="hero" />
        </div>
      </div>

      <div className="relative border-t border-[var(--line)] bg-ink-950/40 backdrop-blur-sm">
        <ol className="mx-auto grid max-w-[1440px] grid-cols-2 px-[var(--gutter)] lg:grid-cols-4">
          {STEPS.map(([n, title, sub], i) => (
            <li
              key={n}
              className="rise border-[var(--line)] py-5 pr-4 [&:not(:first-child)]:lg:border-l [&:not(:first-child)]:lg:pl-6 max-lg:[&:nth-child(even)]:border-l max-lg:[&:nth-child(even)]:pl-4 max-lg:[&:nth-child(n+3)]:border-t"
              style={{ ["--d" as string]: 1000 + i * 90 }}
            >
              <Link href="/methode" className="group block">
                <span className="font-mono text-[11px] text-volt">{n}</span>
                <span className="ml-3 text-[15px] tracking-tight transition-colors group-hover:text-volt">{title}</span>
                <span className="mt-1 block text-[13px] text-fg-3">{sub}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
