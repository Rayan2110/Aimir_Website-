import type { Metadata } from "next";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { Container, ExampleBadge, SectionHead } from "@/components/ui/Section";
import { BeforeAfter } from "@/components/simulator/BeforeAfter";
import { CtaBand } from "@/components/ui/CtaBand";

export const metadata: Metadata = {
  title: "Études de cas",
  description:
    "Le format des études comparatives INENCO ENERGY : contrat actuel, consultation, nouvelle proposition, écart estimé et méthodologie visible. Études réelles anonymisées à venir, publiées avec l'accord des clients.",
  alternates: { canonical: "/etudes-de-cas" },
};

const METHOD = [
  ["Base de consommation", "Consommation annuelle issue de vos factures ou de votre historique, la même pour toutes les offres comparées."],
  ["Périmètre comparé", "Prix de l'énergie (part mise en concurrence), commission du courtier incluse. L'abonnement, l'acheminement, les taxes et la TVA sont présentés à part : ils sont en grande partie réglementés."],
  ["Date des prix", "Les prix des fournisseurs ont une durée de validité courte : chaque étude est datée."],
  ["Écart estimé", "Différence de budget annuel entre le contrat actuel et la proposition, sur la même base. C'est une estimation, pas une garantie."],
];

export default function EtudesDeCasPage() {
  return (
    <PageWrap>
      <PageHero
        eyebrow="Études de cas"
        title="Des preuves, *pas des slogans.*"
        lead="Pas de faux témoignages ni de pourcentages invérifiables. Nous publierons des études réelles, anonymisées et avec l'accord de nos clients, dès que nous en aurons suffisamment. En attendant, voici exactement à quoi elles ressemblent."
        seed={8.1}
      />

      <section className="py-24 md:py-32">
        <Container>
          <SectionHead index="01" label="Le format" title="Une étude, *lue en une minute.*" align="split" lead="Le même cadre pour chaque dossier : contrat actuel, consultation, proposition retenue et écart estimé, avec la méthodologie visible." />
          <div className="mt-14" data-reveal>
            <BeforeAfter />
          </div>
        </Container>
      </section>

      <section className="border-t border-[var(--line)] py-24 md:py-32">
        <Container>
          <SectionHead index="02" label="Méthodologie" title="Comment nous *calculons.*" align="split" />
          <dl className="mt-14 grid border-t border-[var(--line)] md:grid-cols-2">
            {METHOD.map(([t, d], i) => (
              <div key={t} className="border-b border-[var(--line)] py-8 md:pr-12 md:[&:nth-child(even)]:border-l md:[&:nth-child(even)]:pl-12" data-reveal style={{ ["--d" as string]: i * 60 }}>
                <dt className="text-[20px] tracking-tight">{t}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-fg-2">{d}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="border-t border-[var(--line)] py-24 md:py-32">
        <Container>
          <SectionHead index="03" label="Publications" title="Premières études *à venir.*" align="split" />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {["Restaurant — Île-de-France", "Hôtel — Auvergne-Rhône-Alpes", "Copropriété — Nouvelle-Aquitaine"].map((t, i) => (
              <article key={t} className="relative overflow-hidden rounded-[4px] border border-dashed border-[var(--line-strong)] p-6" data-reveal style={{ ["--d" as string]: i * 80 }}>
                <ExampleBadge>Emplacement réservé</ExampleBadge>
                <h3 className="mt-6 text-[20px] tracking-tight text-fg-2">{t}</h3>
                <dl className="mt-5 grid gap-2 font-mono text-[12px] text-fg-3">
                  {["Consommation annuelle", "Contrat précédent", "Nouvelle structure", "Écart estimé", "Durée"].map((k) => (
                    <div key={k} className="flex justify-between border-t border-[var(--line)] pt-2">
                      <dt>{k}</dt>
                      <dd>—</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-[12px] text-fg-3">Publiée après accord écrit du client et anonymisation.</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </PageWrap>
  );
}
