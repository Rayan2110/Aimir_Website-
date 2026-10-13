import type { Member } from "@/content/team";
import { site } from "@/content/site";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

/** Fiche contact vCard 3.0 (compatible iOS, Android, Outlook). */
export function buildVCard(m: Member, cardUrl: string) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(m.lastName)};${esc(m.firstName)};;;`,
    `FN:${esc([m.firstName, m.lastName].filter(Boolean).join(" "))}`,
    `ORG:${esc(site.name)}`,
    `TITLE:${esc(m.role)}`,
    `TEL;TYPE=CELL,VOICE:${m.phoneHref}`,
    `TEL;TYPE=WORK,VOICE:${site.contact.phoneHref}`,
    `EMAIL;TYPE=INTERNET,WORK:${m.email}`,
    `URL:${site.url}`,
    `URL;TYPE=card:${cardUrl}`,
    `NOTE:${esc(`${site.name} — courtage et optimisation énergétique pour les professionnels. ${site.tagline}`)}`,
    "END:VCARD",
  ];
  return lines.join("\r\n") + "\r\n";
}
