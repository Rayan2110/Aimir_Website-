import type { Metadata } from "next";
import Link from "next/link";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { LegalUpdated, Prose, V } from "@/components/ui/Prose";
import { LegalDraftNotice } from "@/components/ui/LegalDraftNotice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site INENCO ENERGY : éditeur, hébergeur, propriété intellectuelle, responsabilité.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  const l = site.legal;
  return (
    <PageWrap>
      <PageHero eyebrow="Mentions légales" title="Mentions *légales.*" seed={1.1} />
      <Prose>
        <LegalDraftNotice />
        <LegalUpdated date="13 octobre 2026" />

        <h2>Éditeur du site</h2>
        <p>
          Le site {site.url.replace(/^https?:\/\//, "")} est édité par <strong>{l.companyName}</strong>, <V>{l.legalForm}</V> au capital de <V>{l.capital}</V>.
        </p>
        <ul>
          <li>Siège social : <V>{l.headOffice}</V></li>
          <li>SIREN : <V>{l.siren}</V> — <V>{l.rcs}</V></li>
          <li>Numéro de TVA intracommunautaire : <V>{l.vat}</V></li>
          <li>Code APE / NAF : <V>{l.naf}</V></li>
          <li>
            Contact : <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> — {site.contact.phone}
          </li>
          <li>Directeur de la publication : <V>{l.publicationDirector}</V></li>
        </ul>

        <h2>Hébergeur</h2>
        <ul>
          <li>Hébergeur : <V>{l.host.name}</V></li>
          <li>Adresse : <V>{l.host.address}</V></li>
          <li>Téléphone : <V>{l.host.phone}</V></li>
        </ul>

        <h2>Activité</h2>
        <p>
          {l.companyName} exerce une activité d&apos;intermédiaire en fourniture d&apos;énergie (courtage) auprès des professionnels. {l.companyName} n&apos;est ni fournisseur d&apos;électricité ou de gaz, ni gestionnaire de réseau, et n&apos;est affilié à aucun organisme public. Les contrats de fourniture sont conclus directement entre le client et le fournisseur de son choix. Aucun frais n&apos;est facturé au client : {l.companyName} est rémunéré par le fournisseur retenu, via une commission incluse dans le prix de son offre (<Link href="/remuneration">en savoir plus</Link>).
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des éléments du site (textes, graphismes, logo, illustrations, animations, code, base de données de démonstration) est la propriété de {l.companyName} ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation. Toute reproduction, représentation ou adaptation, totale ou partielle, sans autorisation écrite préalable, est interdite. Les dénominations « INENCO ENERGY », « INENCO ENERGY DESK » et « OMEGA ENERGY » sont utilisées par {l.companyName}.
        </p>
        <p>
          Polices de caractères : Geist et Geist Mono (Vercel, licence SIL Open Font License 1.1), Instrument Serif (licence SIL Open Font License 1.1), hébergées sur nos propres serveurs.
        </p>

        <h2>Responsabilité</h2>
        <p>
          Les informations publiées sur ce site sont fournies à titre d&apos;information générale et ne constituent ni une offre de fourniture d&apos;énergie, ni un conseil personnalisé. Les exemples chiffrés, simulateurs et démonstrations (dont la démonstration d&apos;INENCO ENERGY DESK) reposent sur des données fictives et ne préjugent pas des résultats d&apos;une étude réelle, qui dépendent du profil de consommation, de la date de consultation et de l&apos;état du marché. {l.companyName} s&apos;efforce d&apos;assurer l&apos;exactitude des informations publiées sans pouvoir en garantir l&apos;exhaustivité ; les repères de marché sont datés.
        </p>
        <p>
          Le site peut contenir des liens vers des sites tiers (par exemple des sites d&apos;information publique) dont {l.companyName} ne maîtrise pas le contenu.
        </p>

        <h2>Données personnelles et cookies</h2>
        <p>
          Le traitement de vos données personnelles est décrit dans notre <Link href="/confidentialite">politique de confidentialité</Link>. Le site ne dépose aucun cookie de mesure d&apos;audience ni publicitaire (<Link href="/cookies">en savoir plus</Link>).
        </p>

        <h2>Droit applicable</h2>
        <p>Les présentes mentions légales sont régies par le droit français.</p>
      </Prose>
    </PageWrap>
  );
}
