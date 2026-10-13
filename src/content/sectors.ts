export type SectorIcon =
  | "restaurant"
  | "hotel"
  | "shop"
  | "bakery"
  | "office"
  | "factory"
  | "syndic"
  | "building"
  | "network";

export type Sector = {
  slug: string;
  name: string;
  short: string;
  icon: SectorIcon;
  energies: ("Électricité" | "Gaz")[];
  intro: string;
  /** Problématiques propres au secteur */
  issues: { title: string; text: string }[];
  /** Ce que nous regardons en priorité lors de l'analyse */
  focus: string[];
};

export const sectors: Sector[] = [
  {
    slug: "restaurants",
    name: "Restaurants & cafés",
    short: "Cuisson, froid, amplitude horaire",
    icon: "restaurant",
    energies: ["Électricité", "Gaz"],
    intro:
      "Chambres froides allumées en continu, cuisson au gaz ou à l'induction, services du midi et du soir : un restaurant consomme beaucoup et à des heures précises. Son contrat doit être choisi en fonction de ces horaires.",
    issues: [
      {
        title: "Une consommation qui ne s'arrête jamais",
        text: "Le froid tourne 24 h/24. La part de consommation de nuit pèse donc sur le choix entre prix unique et heures pleines / heures creuses.",
      },
      {
        title: "Deux énergies, deux échéances",
        text: "Électricité et gaz sont souvent souscrits à des dates différentes. Les aligner simplifie le suivi et les renouvellements.",
      },
      {
        title: "Une puissance souscrite rarement revue",
        text: "Un changement d'équipement en cuisine modifie les besoins. Une puissance surdimensionnée se paie toute l'année dans l'abonnement.",
      },
    ],
    focus: [
      "Répartition heures pleines / heures creuses",
      "Puissance souscrite (kVA) vs pointes réelles",
      "Part fixe et part variable du gaz de cuisson",
      "Dates d'échéance électricité et gaz",
    ],
  },
  {
    slug: "hotels",
    name: "Hôtels",
    short: "Chauffage, eau chaude, saisonnalité",
    icon: "hotel",
    energies: ["Électricité", "Gaz"],
    intro:
      "Le chauffage, l'eau chaude sanitaire et la climatisation font varier la consommation d'un hôtel avec le taux d'occupation et les saisons. Le contrat doit pouvoir absorber ces écarts.",
    issues: [
      {
        title: "Une forte saisonnalité",
        text: "Les volumes changent beaucoup d'un mois à l'autre. Les clauses de tolérance de volume prennent alors toute leur importance.",
      },
      {
        title: "L'eau chaude sanitaire",
        text: "Souvent produite au gaz, elle représente une part importante de la facture. Le choix entre prix fixe et prix indexé y est déterminant.",
      },
      {
        title: "Plusieurs compteurs par établissement",
        text: "Parties communes, restaurant, spa : un même hôtel peut avoir plusieurs points de livraison à suivre séparément.",
      },
    ],
    focus: [
      "Profil mensuel et saisonnalité",
      "Clauses de tolérance de volume",
      "Gaz : chauffage et eau chaude sanitaire",
      "Regroupement des points de livraison",
    ],
  },
  {
    slug: "commerces",
    name: "Commerces",
    short: "Éclairage, froid, horaires d'ouverture",
    icon: "shop",
    energies: ["Électricité"],
    intro:
      "Éclairage, vitrines réfrigérées, climatisation : les commerces de proximité ont des besoins simples, mais leurs contrats sont souvent restés tels qu'ils ont été signés à l'ouverture.",
    issues: [
      {
        title: "Des contrats jamais renégociés",
        text: "Beaucoup de commerces restent sur l'offre souscrite à l'ouverture, sans comparaison depuis.",
      },
      {
        title: "Tarif réglementé ou offre de marché",
        text: "Selon votre taille, vous pouvez être éligible au tarif réglementé de l'électricité. Nous le comparons aux offres de marché.",
      },
      {
        title: "Des horaires réguliers",
        text: "Une consommation prévisible permet de négocier une structure tarifaire adaptée à vos heures d'ouverture.",
      },
    ],
    focus: [
      "Éligibilité au tarif réglementé (TRVE)",
      "Option tarifaire et puissance",
      "Durée d'engagement et conditions de sortie",
      "Offres avec garanties d'origine",
    ],
  },
  {
    slug: "boulangeries",
    name: "Boulangeries",
    short: "Fours, pointe matinale, gaz ou électrique",
    icon: "bakery",
    energies: ["Électricité", "Gaz"],
    intro:
      "Les fours démarrent avant l'aube et tirent de fortes puissances sur quelques heures. Le profil d'une boulangerie est très particulier et l'énergie pèse lourd dans ses coûts.",
    issues: [
      {
        title: "Une pointe très matinale",
        text: "La cuisson se fait souvent en heures creuses. Votre contrat doit en tenir compte.",
      },
      {
        title: "Four gaz ou four électrique",
        text: "L'énergie principale change entièrement la façon de lire et de comparer les offres.",
      },
      {
        title: "Une puissance élevée",
        text: "Pétrins, fours, chambres de pousse : une puissance souscrite mal calibrée peut entraîner des dépassements.",
      },
    ],
    focus: [
      "Consommation en heures creuses",
      "Puissance souscrite et dépassements",
      "Prix fixe : sécuriser le budget",
      "Comparaison gaz / électricité selon l'équipement",
    ],
  },
  {
    slug: "pme",
    name: "PME",
    short: "Bureaux, ateliers, budget à sécuriser",
    icon: "office",
    energies: ["Électricité", "Gaz"],
    intro:
      "Pour une PME, l'énergie est un poste de charges à sécuriser. Il faut une vision claire du budget, des échéances et des risques de chaque structure tarifaire.",
    issues: [
      {
        title: "Visibilité budgétaire",
        text: "Prix fixe, indexé ou mixte : chaque structure expose différemment votre budget aux variations du marché.",
      },
      {
        title: "Des échéances dispersées",
        text: "Contrats souscrits à des dates différentes, renouvellements tacites : le suivi se perd facilement.",
      },
      {
        title: "Un temps de gestion limité",
        text: "La comparaison des offres demande du temps et de l'expertise. Nous préparons tout pour que vous n'ayez qu'à décider.",
      },
    ],
    focus: [
      "Structure tarifaire et exposition au marché",
      "Calendrier des échéances",
      "Segments C5 / C4 et acheminement",
      "Clauses contractuelles (résiliation, volume)",
    ],
  },
  {
    slug: "industrie-legere",
    name: "Industrie légère",
    short: "Process, puissance, profil de charge",
    icon: "factory",
    energies: ["Électricité", "Gaz"],
    intro:
      "Ateliers, petites unités de production, sites logistiques : la puissance et le profil de charge pèsent fortement sur le coût final, au-delà du seul prix du kWh.",
    issues: [
      {
        title: "Le profil de charge",
        text: "Les horaires de production et la régularité de la consommation pèsent sur le prix proposé par les fournisseurs.",
      },
      {
        title: "Acheminement et puissance",
        text: "Sur les segments C4 et au-delà, l'acheminement et la puissance souscrite représentent une part importante de la facture.",
      },
      {
        title: "Plusieurs options d'achat",
        text: "Prix fixe, indexé, achat en plusieurs fois : les options sont plus nombreuses, et les risques aussi.",
      },
    ],
    focus: [
      "Courbe de charge et horaires de production",
      "Puissances souscrites par poste horaire",
      "Options d'achat et exposition au marché",
      "Composante d'acheminement (TURPE)",
    ],
  },
  {
    slug: "syndics",
    name: "Syndics",
    short: "Portefeuille d'immeubles, échéances multiples",
    icon: "syndic",
    energies: ["Électricité", "Gaz"],
    intro:
      "Un syndic gère des dizaines de contrats, pour des copropriétés différentes, avec des échéances et des décisions d'assemblée générale propres à chacune.",
    issues: [
      {
        title: "Un portefeuille à suivre",
        text: "Chaque immeuble a ses contrats et ses échéances. Une vue d'ensemble évite les reconductions subies.",
      },
      {
        title: "Le calendrier des AG",
        text: "La décision passe souvent par l'assemblée générale. L'étude doit donc être prête au bon moment.",
      },
      {
        title: "Rendre compte aux copropriétaires",
        text: "Une étude comparative claire facilite la présentation et la justification du choix.",
      },
    ],
    focus: [
      "Inventaire des contrats par immeuble",
      "Alignement sur le calendrier des AG",
      "Chaufferies collectives au gaz",
      "Études présentables aux conseils syndicaux",
    ],
  },
  {
    slug: "coproprietes",
    name: "Copropriétés",
    short: "Parties communes, chauffage collectif",
    icon: "building",
    energies: ["Électricité", "Gaz"],
    intro:
      "Éclairage des parties communes, ascenseurs, chauffage collectif : l'énergie d'une copropriété se répercute directement dans les charges de chaque copropriétaire.",
    issues: [
      {
        title: "Des charges partagées",
        text: "Chaque euro économisé sur les contrats se retrouve dans les charges de chaque lot.",
      },
      {
        title: "Le chauffage collectif",
        text: "Le contrat gaz d'une chaufferie collective représente souvent le premier poste d'énergie de l'immeuble.",
      },
      {
        title: "Une décision collective",
        text: "Conseil syndical, syndic, AG : nous préparons une étude lisible par tous.",
      },
    ],
    focus: [
      "Contrat gaz de la chaufferie",
      "Électricité des parties communes",
      "Échéances et préavis",
      "Support de présentation pour l'AG",
    ],
  },
  {
    slug: "groupes-multi-sites",
    name: "Groupes multi-sites",
    short: "Dizaines d'établissements, une seule lecture",
    icon: "network",
    energies: ["Électricité", "Gaz"],
    intro:
      "Franchises, réseaux d'agences, groupes de restauration ou d'hôtellerie : au-delà de quelques sites, piloter l'énergie site par site ne fonctionne plus.",
    issues: [
      {
        title: "Une vision consolidée",
        text: "Dépenses, consommations, contrats et échéances de tous vos sites, réunis dans une seule lecture.",
      },
      {
        title: "Des consultations groupées",
        text: "Consulter les fournisseurs pour l'ensemble du périmètre peut améliorer les conditions obtenues. Cela dépend des profils.",
      },
      {
        title: "Des renouvellements échelonnés",
        text: "Chaque site a son calendrier. Les anticiper permet de les regrouper progressivement.",
      },
    ],
    focus: [
      "Cartographie de tous les sites",
      "Consolidation des échéances",
      "Stratégie d'achat groupée ou site par site",
      "Suivi dans INENCO ENERGY DESK",
    ],
  },
];

export const getSector = (slug: string) => sectors.find((s) => s.slug === slug);
