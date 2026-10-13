import type { Metadata } from "next";
import { EnergyPage, type EnergyContent } from "@/components/energy/EnergyPage";

export const metadata: Metadata = {
  title: "Électricité professionnelle",
  description:
    "Courtage en électricité pour les professionnels : analyse de votre contrat (C5, C4, C3/C2), consultation des fournisseurs, prix fixe ou indexé, puissance souscrite et échéances.",
  alternates: { canonical: "/electricite" },
};

const content: EnergyContent = {
  eyebrow: "Électricité",
  title: "Électricité : *le bon contrat* pour votre puissance.",
  lead: "Le prix du kWh ne dit pas tout. Puissance souscrite, options horaires, acheminement et durée pèsent autant sur votre budget. Nous analysons l'ensemble avant de consulter les fournisseurs.",
  segmentsTitle: "Votre segment *détermine vos options.*",
  segmentsLead: "Le segment d'acheminement dépend de votre puissance de raccordement. Il conditionne la structure de votre facture et les offres disponibles.",
  segments: [
    {
      code: "C5",
      name: "Basse tension ≤ 36 kVA",
      who: "Commerces, restaurants, boulangeries, petits bureaux, cabinets.",
      detail: "Option base ou heures pleines / heures creuses. Selon votre taille, éligibilité possible au tarif réglementé, que nous comparons aux offres de marché. Protections spécifiques des petits professionnels.",
    },
    {
      code: "C4",
      name: "Basse tension > 36 kVA",
      who: "Hôtels, moyennes surfaces, PME, ateliers, sites logistiques.",
      detail: "Puissances souscrites par poste horaire, risque de dépassements, acheminement plus important. La structure de prix et la durée deviennent des leviers majeurs. Une entreprise de moins de 10 personnes (chiffre d'affaires ou bilan ≤ 2 M€) peut être éligible au tarif réglementé quelle que soit sa puissance.",
    },
    {
      code: "C3 / C2",
      name: "Haute tension (HTA)",
      who: "Industrie légère, gros sites tertiaires.",
      detail: "Courbe de charge, achat en plusieurs fois, clauses de volume. Les options d'achat sont plus nombreuses, et les risques aussi : chaque scénario est expliqué.",
    },
  ],
  structures: [
    {
      name: "Prix fixe",
      pro: "Budget connu à l'avance sur toute la durée du contrat. Lisibilité maximale.",
      con: "Le prix est figé au moment de la signature : si le marché baisse ensuite, vous n'en profitez pas.",
    },
    {
      name: "Prix indexé",
      pro: "Suit le marché : vous bénéficiez directement des baisses.",
      con: "Vous subissez aussi les hausses. Budget variable, à réserver aux entreprises qui peuvent l'absorber.",
    },
    {
      name: "Mixte / achat fractionné",
      pro: "Une partie fixée, une partie indexée, ou des achats en plusieurs fois pour lisser le risque.",
      con: "Plus complexe à suivre. Pertinent surtout à partir de volumes significatifs.",
    },
  ],
  checks: [
    "Prix du kWh par poste horaire",
    "Puissance souscrite vs pointes réelles",
    "Segment et acheminement (TURPE)",
    "Échéance, reconduction, préavis",
    "Éligibilité au tarif réglementé",
  ],
  marketNote: {
    title: "Fin de l'ARENH au 31 décembre 2025",
    text: (
      <>
        Le dispositif ARENH, qui permettait aux fournisseurs d&apos;acheter une partie de l&apos;électricité nucléaire à prix régulé, a pris fin le 31 décembre 2025. Depuis 2026, un nouveau mécanisme, le versement nucléaire universel, prévoit une redistribution aux consommateurs lorsque les prix de marché dépassent certains seuils. Les offres des fournisseurs ont évolué en conséquence : nous expliquons dans chaque étude ce que cela change pour vous.
      </>
    ),
  },
  seed: 3.4,
};

export default function ElectricitePage() {
  return <EnergyPage c={content} />;
}
