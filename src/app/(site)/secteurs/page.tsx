import type { Metadata } from "next";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { SectorList } from "@/components/sectors/SectorList";
import { CtaBand } from "@/components/ui/CtaBand";

export const metadata: Metadata = {
  title: "Secteurs",
  description:
    "Restaurants, hôtels, commerces, boulangeries, PME, industrie légère, syndics, copropriétés, groupes multi-sites : INENCO ENERGY adapte l'analyse de vos contrats d'énergie à votre activité.",
  alternates: { canonical: "/secteurs" },
};

export default function SecteursPage() {
  return (
    <PageWrap>
      <PageHero
        eyebrow="Secteurs"
        title="Votre activité, *votre profil d'énergie.*"
        lead="Horaires, saisonnalité, équipements, nombre de sites, mode de décision : chaque secteur a ses contraintes. Nos études partent des vôtres."
        seed={4.4}
      />
      <section className="py-20 md:py-28">
        <Container>
          <SectorList />
        </Container>
      </section>
      <CtaBand />
    </PageWrap>
  );
}
