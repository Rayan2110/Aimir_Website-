import type { Metadata } from "next";
import { EnergyPage, type EnergyContent } from "@/components/energy/EnergyPage";

export const metadata: Metadata = {
  title: "Gaz naturel professionnel",
  description:
    "Courtage en gaz naturel pour les professionnels et copropriétés : analyse de votre contrat (T1 à T4), consultation des fournisseurs, prix fixe ou indexé, tolérance de volume et échéances.",
  alternates: { canonical: "/gaz" },
};

const content: EnergyContent = {
  eyebrow: "Gaz naturel",
  title: "Gaz naturel : *sécuriser* un poste qui pèse lourd.",
  lead: "Cuisson, chauffage, eau chaude, chaufferie collective : le gaz est souvent le premier poste d'énergie des hôtels, restaurants et copropriétés. Volume, saisonnalité et indexation font toute la différence.",
  segmentsTitle: "Votre profil *de consommation.*",
  segmentsLead: "L'option tarifaire d'acheminement dépend de votre consommation annuelle. Elle structure l'abonnement et le coût de distribution.",
  segments: [
    {
      code: "T1",
      name: "Moins de 6 MWh / an",
      who: "Petits usages : cuisson d'appoint, petits locaux.",
      detail: "Part fixe proportionnellement importante. L'enjeu porte autant sur l'abonnement que sur le prix du MWh.",
    },
    {
      code: "T2",
      name: "6 à 300 MWh / an",
      who: "Restaurants, boulangeries, commerces chauffés au gaz, petits immeubles.",
      detail: "Le profil le plus courant chez les professionnels. Prix fixe ou indexé, durée et tolérance de volume sont les principaux leviers.",
    },
    {
      code: "T3 / T4",
      name: "Plus de 300 MWh / an",
      who: "Hôtels, copropriétés avec chaufferie, sites industriels.",
      detail: "Saisonnalité marquée, clauses de volume, stratégies d'achat. Pour les copropriétés, l'étude doit être prête pour l'assemblée générale.",
    },
  ],
  structures: [
    {
      name: "Prix fixe",
      pro: "Budget connu sur toute la durée, précieux pour les copropriétés et les hôtels.",
      con: "Figé à la signature : le moment de la consultation compte.",
    },
    {
      name: "Prix indexé",
      pro: "Suit un indice de marché de référence et profite des baisses.",
      con: "Exposé aux hausses, avec un budget qui varie d'un mois à l'autre.",
    },
    {
      name: "Fixe + part indexée",
      pro: "Sécurise une partie du volume tout en gardant de la souplesse.",
      con: "Demande un suivi régulier pour être pertinent.",
    },
  ],
  checks: [
    "Prix du MWh et indexation",
    "Option d'acheminement (T1 à T4)",
    "Tolérance de volume et saisonnalité",
    "Échéance, reconduction, préavis",
    "Calendrier d'AG pour les copropriétés",
  ],
  marketNote: {
    title: "Fin des tarifs réglementés du gaz",
    text: (
      <>
        Depuis le 1er juillet 2023, les tarifs réglementés de vente de gaz ont disparu pour tous les consommateurs : chaque professionnel et chaque copropriété est désormais en offre de marché. Sans comparaison régulière, un contrat arrivé à échéance peut basculer sur des conditions moins favorables.
      </>
    ),
  },
  seed: 6.2,
};

export default function GazPage() {
  return <EnergyPage c={content} />;
}
