import type { Metadata } from "next";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHead } from "@/components/ui/Section";
import { DeskShowcase } from "@/components/desk/DeskShowcase";
import { CtaBand } from "@/components/ui/CtaBand";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Groupes multi-sites",
  description:
    "Franchises, réseaux, groupes de restauration ou d'hôtellerie : INENCO ENERGY inventorie tous vos sites, consolide vos échéances et pilote vos contrats d'électricité et de gaz depuis une seule interface.",
  alternates: { canonical: "/multi-sites" },
};

const STEPS = [
  { t: "Inventaire", d: "Nous recensons chaque site, chaque point de livraison (PDL, PCE), chaque contrat et chaque échéance, à partir de vos factures." },
  { t: "Consolidation", d: "Consommations, dépenses et calendrier des échéances sont réunis dans une seule lecture, site par site et au global." },
  { t: "Stratégie d'achat", d: "Consultation groupée ou site par site, alignement progressif des échéances : nous construisons le scénario adapté à votre périmètre." },
  { t: "Pilotage", d: "Suivi continu, alertes avant chaque fenêtre de renouvellement, centre documentaire partagé avec vos équipes." },
];

export default function MultiSitesPage() {
  return (
    <PageWrap>
      <PageHero
        eyebrow="Multi-sites"
        title="20 établissements. *Une seule lecture.*"
        lead="Au-delà de quelques sites, gérer l'énergie au cas par cas ne fonctionne plus : échéances dispersées, reconductions subies, factures introuvables. INENCO consolide tout et vous donne la main."
        seed={7.3}
      >
        <ButtonLink href="/contact?objet=multi-sites">Parler de votre périmètre</ButtonLink>
      </PageHero>

      <section className="py-24 md:py-32">
        <Container>
          <SectionHead
            index="01"
            label="Carte des sites"
            title="Chaque site, *son statut, son échéance.*"
            lead="Cliquez sur un établissement pour afficher ses contrats, sa consommation et sa prochaine échéance. Démonstration avec des données fictives."
            align="split"
          />
          <div className="mt-14">
            <DeskShowcase initialView="sites" />
          </div>
        </Container>
      </section>

      <section className="border-t border-[var(--line)] py-24 md:py-32">
        <Container>
          <SectionHead index="02" label="Notre accompagnement" title="De l'inventaire *au pilotage.*" align="split" />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[4px] border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="bg-ink-950 p-8" data-reveal style={{ ["--d" as string]: i * 70 }}>
                <span className="font-mono text-[11px] text-volt">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[24px] tracking-tight">{s.t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{s.d}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand title="Plusieurs sites, plusieurs échéances ? *Commençons par l'inventaire.*" lead="Envoyez-nous quelques factures représentatives : nous revenons vers vous avec une première lecture de votre périmètre." />
    </PageWrap>
  );
}
