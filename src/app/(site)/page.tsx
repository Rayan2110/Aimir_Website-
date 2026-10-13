import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ScrubText } from "@/components/motion/ScrubText";
import { MethodScroll } from "@/components/method/MethodScroll";
import { BeforeAfter } from "@/components/simulator/BeforeAfter";
import { DeskShowcase } from "@/components/desk/DeskShowcase";
import { SectorList } from "@/components/sectors/SectorList";
import { OfferAnatomy } from "@/components/transparency/OfferAnatomy";
import { InvoiceFlow } from "@/components/upload/InvoiceFlow";
import { Container, SectionHead } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Commitments } from "@/components/home/Commitments";
import { Split } from "@/components/motion/Split";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageWrap } from "@/components/ui/PageWrap";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

export default function HomePage() {
  return (
    <PageWrap>
      <JsonLd />
      <Hero />

      {/* Constat */}
      <section className="relative py-28 md:py-40">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <p className="eyebrow lg:col-span-3" data-reveal>
              <span className="text-volt">00</span> — Le constat
            </p>
            <div className="lg:col-span-9">
              <ScrubText
                className="text-[clamp(1.7rem,3.4vw,3.3rem)] leading-[1.12] tracking-[-0.025em]"
                text="Prix fixes, offres indexées, acheminement, taxes, échéances, reconductions tacites : l'énergie professionnelle est devenue *illisible.* INENCO la rend *lisible,* consulte le marché pour vous et vous laisse *décider.*"
              />
            </div>
          </div>
        </Container>
      </section>

      <VelocityMarquee items={["Analyse", "Consultation", "Décision", "Suivi"]} className="border-y border-[var(--line)]" />

      {/* Méthode */}
      <section id="methode" className="relative border-t border-[var(--line)]">
        <MethodScroll />
      </section>

      {/* Simulateur */}
      <section className="relative border-t border-[var(--line)] py-28 md:py-36">
        <Container>
          <SectionHead
            index="05"
            label="Étude comparative"
            title="Ce que vous recevez : *une décision lisible.*"
            lead="Chaque étude met votre contrat actuel face aux propositions reçues, sur la même base de consommation. Voici à quoi elle ressemble, sur des exemples fictifs."
            align="split"
          />
          <div className="mt-16" data-reveal>
            <BeforeAfter />
          </div>
        </Container>
      </section>

      {/* DESK */}
      <section className="relative overflow-hidden border-t border-[var(--line)] py-28 md:py-36">
        <Container>
          <SectionHead
            index="06"
            label="INENCO ENERGY DESK"
            title="Votre énergie, *pilotée* comme un portefeuille."
            lead={
              <>
                Sites, contrats, échéances, documents et alertes réunis dans un seul espace client. Pour un groupe de 20 établissements, les 20 sites tiennent sur un seul écran.{" "}
                <span className="text-fg-3">Démonstration interactive, données fictives.</span>
              </>
            }
            align="split"
          />
          <div className="mt-16">
            <DeskShowcase />
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/desk">Découvrir le Desk</ButtonLink>
            <ButtonLink href="/multi-sites" variant="ghost">
              Groupes multi-sites
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Secteurs */}
      <section className="relative border-t border-[var(--line)] py-28 md:py-36">
        <Container>
          <SectionHead
            index="07"
            label="Secteurs"
            title="Chaque activité a son *profil d'énergie.*"
            lead="Un restaurant, une boulangerie et une copropriété ne consomment pas de la même façon. Nos études partent de vos contraintes réelles."
            align="split"
          />
          <div className="mt-16">
            <SectorList />
          </div>
        </Container>
      </section>

      {/* Comprendre votre offre */}
      <section className="on-paper relative py-28 md:py-36">
        <Container>
          <SectionHead
            index="08"
            label="Comprendre votre offre"
            title="Ce que vous payez *vraiment.*"
            lead="Seule une partie de votre facture dépend du fournisseur. Le reste est réglementé. Savoir distinguer les deux évite de comparer des offres qui ne se comparent pas."
            align="split"
          />
          <div className="mt-16" data-reveal>
            <OfferAnatomy tone="paper" />
          </div>
          <div className="mt-12">
            <Link href="/methode#comprendre-votre-offre" className="link-u font-mono text-[11px] uppercase tracking-[0.14em]">
              Durée, conditions, estimation : tout comprendre →
            </Link>
          </div>
        </Container>
      </section>

      {/* Engagements */}
      <Commitments />

      {/* Dépôt final */}
      <section className="relative overflow-hidden border-t border-[var(--line)] py-28 md:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_50%,rgb(240_163_59/0.08),transparent_70%)]" />
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-6" data-reveal>
                <span className="text-volt">10</span> — Premier pas
              </p>
              <Split as="h2" className="display text-[clamp(2.4rem,5vw,4.6rem)]" text="Envoyez votre facture. *Nous faisons le reste.*" />
              <ol className="mt-10 grid gap-5" data-reveal>
                {[
                  ["Aujourd'hui", "Vous déposez une facture récente : PDF ou photo."],
                  ["Sous quelques jours", "Un analyste étudie votre contrat et consulte les fournisseurs."],
                  ["Ensuite", "Vous recevez une étude claire. Vous décidez, sans engagement."],
                ].map(([t, d]) => (
                  <li key={t} className="grid grid-cols-[120px_1fr] gap-4 border-t border-[var(--line)] pt-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-volt">{t}</span>
                    <span className="text-[15px] text-fg-2">{d}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-6 lg:col-start-7" data-reveal>
              <InvoiceFlow />
            </div>
          </div>
        </Container>
      </section>
    </PageWrap>
  );
}
