/**
 * Équipe et cartes de visite numériques.
 * TODO fondateurs : noms complets, fonctions, téléphones, e-mails, LinkedIn,
 * photos — et accord écrit de chacun pour la publication (droit à l'image).
 */

export type Member = {
  slug: string;
  firstName: string;
  lastName: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  phoneHref: string;
  linkedin?: string;
  initials: string;
};

export const team: Member[] = [
  {
    slug: "aimir",
    firstName: "Aimir",
    lastName: "", // TODO
    role: "Co-fondateur", // TODO fonction exacte
    bio: "Accompagne les professionnels dans l'analyse de leurs contrats et la consultation des fournisseurs, de la première facture au renouvellement.", // TODO
    email: "aimir@inenco-energy.fr", // TODO
    phone: "+33 6 00 00 00 00", // TODO
    phoneHref: "+33600000000",
    initials: "A",
  },
  {
    slug: "seiffedine",
    firstName: "Seiffedine",
    lastName: "", // TODO
    role: "Co-fondateur", // TODO fonction exacte
    bio: "Pilote la relation client et le suivi des contrats, avec une attention particulière aux groupes multi-sites et aux échéances.", // TODO
    email: "seiffedine@inenco-energy.fr", // TODO
    phone: "+33 6 00 00 00 00", // TODO
    phoneHref: "+33600000000",
    initials: "S",
  },
];

export const getMember = (slug: string) => team.find((m) => m.slug === slug);
export const fullName = (m: Member) => [m.firstName, m.lastName].filter(Boolean).join(" ");
