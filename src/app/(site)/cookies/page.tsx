import type { Metadata } from "next";
import Link from "next/link";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { LegalUpdated, Prose } from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Cookies",
  description: "INENCO ENERGY ne dépose aucun cookie de mesure d'audience, publicitaire ou de réseau social.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <PageWrap>
      <PageHero eyebrow="Cookies" title="Pas de traceurs, *pas de bandeau.*" lead="Nous avons fait le choix d'un site sans aucun outil de suivi." seed={7.7} />
      <Prose>
        <LegalUpdated date="13 octobre 2026" />
        <h2>Ce que nous ne faisons pas</h2>
        <p>Ce site ne dépose aucun cookie ni traceur :</p>
        <ul>
          <li>de mesure d&apos;audience ;</li>
          <li>publicitaire ou de reciblage ;</li>
          <li>de réseau social (aucun bouton de partage ni contenu intégré tiers) ;</li>
          <li>de service tiers : polices de caractères hébergées sur nos serveurs, aucune carte, vidéo ou captcha externe.</li>
        </ul>
        <p>C&apos;est pourquoi aucun bandeau de consentement ne vous est présenté.</p>
        <h2>Traceurs strictement nécessaires</h2>
        <p>
          Seuls des mécanismes techniques indispensables au fonctionnement du service peuvent être utilisés, sans consentement préalable conformément aux recommandations de la CNIL : par exemple, à l&apos;ouverture de l&apos;espace client, un cookie de session pour maintenir votre connexion sécurisée. Ils seront listés ici avec leur durée de vie.
        </p>
        <h2>Évolution</h2>
        <p>
          Si nous ajoutions un jour un outil soumis à consentement, un bandeau vous permettrait d&apos;accepter ou de refuser aussi simplement, et cette page serait mise à jour. Pour toute question : voir la <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </Prose>
    </PageWrap>
  );
}
