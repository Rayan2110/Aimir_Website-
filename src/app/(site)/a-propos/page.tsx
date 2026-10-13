import type { Metadata } from "next";
import Link from "next/link";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHead } from "@/components/ui/Section";
import { TerrainSvg } from "@/components/brand/TerrainSvg";
import { CtaBand } from "@/components/ui/CtaBand";
import { fullName, team } from "@/content/team";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "INENCO ENERGY, cabinet de courtage et d'optimisation énergétique pour les professionnels. Notre approche : analyse, consultation, décision, suivi.",
  alternates: { canonical: "/a-propos" },
};

const PRINCIPLES = [
  ["Lisibilité", "Une étude doit se comprendre en une minute. Nous écrivons pour des dirigeants, pas pour des spécialistes de l'énergie."],
  ["Honnêteté", "Pas de promesse d'économies garanties. Si votre contrat est déjà bien placé, nous vous le disons."],
  ["Proximité", "Un interlocuteur unique, joignable, qui connaît votre activité et vos sites."],
  ["Durée", "Nous ne disparaissons pas après la signature : le suivi et le renouvellement font partie du service."],
];

export default function AProposPage() {
  return (
    <PageWrap>
      <PageHero
        eyebrow="À propos"
        title="Rendre l'énergie *lisible* pour ceux qui la paient."
        lead={`${site.name} est né d'un constat simple : les professionnels paient leur énergie sans toujours savoir ce qu'ils paient, ni quand le renégocier. Nous voulons transformer une première analyse de facture en relation de long terme.`}
        seed={1.2}
      />

      <section className="py-24 md:py-32">
        <Container>
          <SectionHead index="01" label="Nos principes" title="Quatre règles, *tenues dans la durée.*" align="split" />
          <ul className="mt-14 grid border-t border-[var(--line)] md:grid-cols-2">
            {PRINCIPLES.map(([t, d], i) => (
              <li key={t} className="border-b border-[var(--line)] py-10 md:pr-12 md:[&:nth-child(even)]:border-l md:[&:nth-child(even)]:pl-12" data-reveal style={{ ["--d" as string]: i * 60 }}>
                <span className="font-mono text-[11px] text-volt">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display mt-4 text-[44px]">{t}</h3>
                <p className="mt-3 max-w-md text-[16px] leading-relaxed text-fg-2">{d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-[var(--line)] py-24 md:py-32">
        <Container>
          <SectionHead index="02" label="L'équipe" title="Les fondateurs" align="split" lead="Vos interlocuteurs directs, de la première analyse au suivi de vos contrats." />
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {team.map((m, i) => (
              <li key={m.slug} className="group overflow-hidden rounded-[6px] border border-[var(--line)]" data-reveal style={{ ["--d" as string]: i * 100 }}>
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">
                  <TerrainSvg className="absolute inset-0 h-full w-full opacity-80 transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-105" seed={3 + i * 2.2} t={1.5 + i} amplitude={0.32} />
                  <span className="display absolute left-6 top-4 text-[120px] text-fg/90">{m.initials}</span>
                  <span className="absolute bottom-4 right-4 rounded-[2px] bg-ink-950/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-3">Photo à venir</span>
                </div>
                <div className="p-6">
                  <h3 className="text-[26px] tracking-tight">{fullName(m)}</h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-volt">{m.role}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-fg-2">{m.bio}</p>
                  <Link href={`/carte/${m.slug}`} className="link-u mt-5 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-fg-2 hover:text-fg">
                    Carte de visite numérique →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="on-paper py-24 md:py-32">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">Notre modèle</p>
            <h2 className="display text-[clamp(2.2rem,4vw,3.6rem)]">Transparent sur ce qui compte.</h2>
          </div>
          <div className="text-[17px] leading-relaxed text-ink-text-2 lg:col-span-6 lg:col-start-7">
            <p>
              {site.name} est un intermédiaire : nous ne sommes ni fournisseur d&apos;énergie, ni gestionnaire de réseau, et nous ne sommes affiliés à aucun organisme public. Aucun frais n&apos;est facturé à nos clients. Nous sommes rémunérés par le fournisseur retenu, via une commission incluse dans le prix de son offre.
            </p>
            <p className="mt-4">
              Nous consultons un panel de fournisseurs partenaires et indiquons dans chaque étude ceux qui ont été consultés.{" "}
              <Link href="/remuneration" className="text-ink-text underline underline-offset-2">
                En savoir plus sur notre rémunération
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      <CtaBand />
    </PageWrap>
  );
}
