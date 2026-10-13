/**
 * Informations société — source unique.
 *
 * Tout ce qui est marqué `TODO` doit être fourni et validé par les fondateurs
 * (brief §8) avant la mise en ligne. `isPlaceholder()` permet d'afficher un
 * avertissement visible tant qu'une valeur n'est pas renseignée.
 */

export const PLACEHOLDER = "[À compléter]";

/** Version des conditions générales et de la politique de confidentialité (enregistrée avec chaque dossier). */
export const LEGAL_VERSION = "2026-10-13";

export const site = {
  name: "INENCO ENERGY",
  shortName: "INENCO",
  tagline: "Analyse. Consultation. Décision. Suivi.",
  baseline:
    "INENCO analyse vos contrats d'électricité et de gaz, consulte les fournisseurs et vous accompagne dans chaque étape de votre décision.",
  description:
    "INENCO ENERGY, cabinet de courtage et d'optimisation énergétique pour les professionnels : analyse de factures d'électricité et de gaz, consultation des fournisseurs, comparaison et suivi de vos contrats.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inenco-energy.fr", // TODO domaine définitif
  zone: "France métropolitaine",

  contact: {
    email: "contact@inenco-energy.fr", // TODO adresse définitive
    phone: "+33 1 00 00 00 00", // TODO numéro définitif
    phoneHref: "+33100000000",
    hours: "Du lundi au vendredi, 9h – 18h",
    address: PLACEHOLDER, // TODO adresse du siège
  },

  legal: {
    companyName: "INENCO ENERGY",
    legalForm: PLACEHOLDER, // TODO ex. SAS
    capital: PLACEHOLDER, // TODO ex. 1 000 €
    siren: PLACEHOLDER, // TODO
    siret: PLACEHOLDER, // TODO
    rcs: PLACEHOLDER, // TODO ex. RCS Paris 000 000 000
    vat: PLACEHOLDER, // TODO n° TVA intracommunautaire
    naf: PLACEHOLDER, // TODO code APE
    headOffice: PLACEHOLDER, // TODO
    publicationDirector: PLACEHOLDER, // TODO nom du directeur de la publication
    privacyContact: "rgpd@inenco-energy.fr", // TODO adresse dédiée aux demandes RGPD
    host: {
      name: PLACEHOLDER, // TODO ex. Vercel Inc. / OVH SAS
      address: PLACEHOLDER,
      phone: PLACEHOLDER,
    },
  },

  social: {
    linkedin: "", // TODO URL LinkedIn de la société
  },
} as const;

export const isPlaceholder = (value: string) => value === PLACEHOLDER;

export type NavLink = { href: string; label: string; hint?: string };

export const nav = {
  primary: [
    { href: "/methode", label: "Méthode" },
    { href: "/multi-sites", label: "Multi-sites" },
    { href: "/desk", label: "Desk" },
    { href: "/a-propos", label: "À propos" },
  ] satisfies NavLink[],
  expertise: [
    { href: "/electricite", label: "Électricité", hint: "Contrats C5, C4, C3 / C2 — prix fixe ou indexé" },
    { href: "/gaz", label: "Gaz naturel", hint: "Profils, volumes, indexation et échéances" },
    { href: "/multi-sites", label: "Groupes multi-sites", hint: "Tous vos établissements, une seule lecture" },
    { href: "/methode#comprendre-votre-offre", label: "Comprendre votre offre", hint: "Ce que contient réellement une facture" },
    { href: "/etudes-de-cas", label: "Études de cas", hint: "Format et méthodologie de nos études" },
  ] satisfies NavLink[],
  footer: {
    Expertise: [
      { href: "/methode", label: "Notre méthode" },
      { href: "/electricite", label: "Électricité" },
      { href: "/gaz", label: "Gaz naturel" },
      { href: "/multi-sites", label: "Multi-sites" },
      { href: "/etudes-de-cas", label: "Études de cas" },
      { href: "/methode#comprendre-votre-offre", label: "Comprendre votre offre" },
    ],
    INENCO: [
      { href: "/a-propos", label: "À propos" },
      { href: "/desk", label: "INENCO ENERGY DESK" },
      { href: "/faq", label: "Questions fréquentes" },
      { href: "/contact", label: "Contact" },
      { href: "/envoyer-une-facture", label: "Envoyer une facture" },
      { href: "/connexion", label: "Connexion client" },
    ],
    Légal: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/remuneration", label: "Notre rémunération" },
      { href: "/confidentialite", label: "Confidentialité & RGPD" },
      { href: "/conditions-generales", label: "Conditions générales" },
      { href: "/cookies", label: "Cookies" },
      { href: "/accessibilite", label: "Accessibilité" },
    ],
  } satisfies Record<string, NavLink[]>,
};
