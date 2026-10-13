import type { Metadata } from "next";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHead } from "@/components/ui/Section";
import { METHOD_STEPS } from "@/content/method";
import { OfferAnatomy } from "@/components/transparency/OfferAnatomy";
import { CtaBand } from "@/components/ui/CtaBand";
import { ButtonLink } from "@/components/ui/Button";
import { Commitments } from "@/components/home/Commitments";

export const metadata: Metadata = {
  title: "Notre méthode",
  description:
    "Analyse, consultation, comparaison, mise en place : la méthode INENCO ENERGY pour optimiser vos contrats d'électricité et de gaz, et comprendre ce que contient réellement votre offre.",
  alternates: { canonical: "/methode" },
};

const JOURNEY = ["Facture", "Analyse", "Consultation", "Comparaison", "Votre choix", "Nouveau contrat", "Suivi"];

const UNDERSTAND = [
  {
    title: "Prix de l'énergie",
    text: "Le prix du kWh ou du MWh, fixe ou indexé, unique ou par poste horaire. C'est la part que la consultation des fournisseurs permet de faire évoluer.",
  },
  {
    title: "Abonnement",
    text: "La part fixe, liée à la puissance souscrite en électricité ou au profil en gaz. Elle se paie même sans consommer.",
  },
  {
    title: "Taxes et contributions",
    text: "Accises, contribution tarifaire d'acheminement (CTA), TVA. Fixées par la loi, elles sont identiques chez tous les fournisseurs.",
  },
  {
    title: "Durée",
    text: "12, 24, 36 mois ou plus. Une durée longue sécurise un prix, mais engage sur une période où le marché peut évoluer.",
  },
  {
    title: "Conditions contractuelles",
    text: "Tolérance de volume, conditions de résiliation, reconduction, modalités de facturation : ces clauses comptent autant que le prix.",
  },
  {
    title: "Estimation basée sur votre consommation",
    text: "Nos budgets annuels sont des estimations calculées sur votre consommation réelle ou déclarée. Nous indiquons toujours la base retenue.",
  },
];

export default function MethodePage() {
  return (
    <PageWrap>
      <PageHero
        eyebrow="Notre méthode"
        title="De la facture *à la décision.*"
        lead="Nous lisons votre contrat comme le ferait un directeur financier, nous consultons les fournisseurs sur une base commune et nous vous présentons des offres que vous pouvez réellement comparer."
      >
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-3">
          {JOURNEY.map((j, i) => (
            <li key={j} className="flex items-center gap-3">
              <span className={i === 0 ? "text-volt" : "text-fg-2"}>{j}</span>
              {i < JOURNEY.length - 1 && <span className="h-px w-5 bg-fg/20" aria-hidden />}
            </li>
          ))}
        </ol>
      </PageHero>

      {/* Étapes détaillées */}
      <section className="py-24 md:py-32">
        <Container>
          <ol className="grid gap-0">
            {METHOD_STEPS.map((s, i) => (
              <li key={s.n} className="grid gap-8 border-t border-[var(--line)] py-14 lg:grid-cols-12" data-reveal style={{ ["--d" as string]: i * 40 }}>
                <div className="lg:col-span-5">
                  <span className="font-mono text-[12px] text-volt">{s.n}</span>
                  <h2 className="display mt-2 text-[clamp(2.4rem,4.5vw,4rem)]">{s.title}</h2>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="text-[19px] leading-relaxed text-fg">{s.text}</p>
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-3 border-t border-[var(--line)] pt-3 text-[15px] text-fg-2">
                        <span className="mt-2.5 h-px w-3 shrink-0 bg-volt" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Comprendre votre offre */}
      <section id="comprendre-votre-offre" className="on-paper scroll-mt-28 py-24 md:py-32">
        <Container>
          <SectionHead
            index="§"
            label="Comprendre votre offre"
            title="Distinguer ce qui se *négocie* de ce qui ne se négocie pas."
            lead="Une offre qui paraît moins chère peut simplement exclure une composante, ou reposer sur une autre durée. Voici les éléments que nous isolons systématiquement dans nos études."
            align="split"
          />
          <div className="mt-16" data-reveal>
            <OfferAnatomy tone="paper" />
          </div>
          <ul className="mt-20 grid border-t border-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
            {UNDERSTAND.map((u, i) => (
              <li key={u.title} className="border-b border-[var(--line)] py-8 md:pr-10" data-reveal style={{ ["--d" as string]: i * 50 }}>
                <span className="font-mono text-[11px] text-ink-text-2">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[20px] tracking-tight">{u.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-text-2">{u.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Commitments />

      <section className="border-t border-[var(--line)] py-20">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-xl text-[20px] tracking-tight">Vous voulez voir à quoi ressemble une étude ?</p>
          <ButtonLink href="/etudes-de-cas" variant="ghost">
            Format de nos études
          </ButtonLink>
        </Container>
      </section>

      <CtaBand />
    </PageWrap>
  );
}
