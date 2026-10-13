/** Les 4 étapes de la méthode INENCO (brief §6). */
export const METHOD_STEPS = [
  {
    n: "01",
    title: "Analyse",
    text: "Nous étudions votre contrat actuel, votre consommation et les caractéristiques de votre site.",
    points: ["Prix de l'énergie et structure tarifaire", "Abonnement, puissance, acheminement", "Échéance et conditions de sortie", "Profil de consommation"],
  },
  {
    n: "02",
    title: "Consultation",
    text: "Nous consultons différents fournisseurs selon votre profil, sur la base d'un cahier des charges commun.",
    points: ["Fournisseurs sélectionnés selon votre segment", "Même volume, mêmes dates pour tous", "Prix fixes, indexés ou mixtes", "Durées comparables"],
  },
  {
    n: "03",
    title: "Comparaison",
    text: "Les propositions retenues vous sont présentées de façon claire : prix, structure, durée, conditions.",
    points: ["Lecture ligne à ligne vs votre contrat", "Budget annuel estimé sur votre consommation", "Risques de chaque structure expliqués", "Pas de proposition si elle n'améliore pas votre situation"],
  },
  {
    n: "04",
    title: "Mise en place",
    text: "Vous choisissez. INENCO ENERGY accompagne la contractualisation, l'activation et le suivi jusqu'à l'échéance.",
    points: ["Dossier de souscription préparé", "Pas de coupure liée au changement", "Suivi du contrat dans le temps", "Anticipation du renouvellement"],
  },
] as const;
