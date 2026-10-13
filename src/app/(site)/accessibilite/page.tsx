import type { Metadata } from "next";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { LegalUpdated, Prose } from "@/components/ui/Prose";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Accessibilité",
  description: "Engagement d'INENCO ENERGY en matière d'accessibilité numérique : objectif WCAG 2.1 niveau AA.",
  alternates: { canonical: "/accessibilite" },
};

export default function AccessibilitePage() {
  return (
    <PageWrap>
      <PageHero eyebrow="Accessibilité" title="Un site *pour tous.*" seed={8.8} />
      <Prose>
        <LegalUpdated date="13 octobre 2026" />
        <h2>Notre engagement</h2>
        <p>
          {site.name} vise la conformité aux règles d&apos;accessibilité WCAG 2.1, niveau AA. Le site n&apos;a pas encore fait l&apos;objet d&apos;un audit externe : son état de conformité n&apos;est donc pas encore évalué.
        </p>
        <h2>Ce que nous avons mis en place</h2>
        <ul>
          <li>Navigation complète au clavier, lien d&apos;accès direct au contenu, focus visible.</li>
          <li>Respect du réglage « réduire les animations » du système : les animations sont alors désactivées.</li>
          <li>Contrastes de couleurs vérifiés pour les textes et les graphiques.</li>
          <li>Graphiques accompagnés d&apos;une vue en tableau ; statuts toujours signalés par une icône et un libellé, jamais par la couleur seule.</li>
          <li>Formulaires avec libellés explicites, messages d&apos;erreur associés aux champs et indication des champs facultatifs.</li>
          <li>Contenus décoratifs (animations de fond, reliefs) masqués aux technologies d&apos;assistance.</li>
        </ul>
        <h2>Limites connues</h2>
        <ul>
          <li>La carte interactive de la démonstration du Desk est doublée d&apos;une liste des sites, plus confortable avec un lecteur d&apos;écran.</li>
          <li>Certaines visualisations illustratives de la page d&apos;accueil sont décoratives : leur contenu est repris dans le texte.</li>
        </ul>
        <h2>Nous signaler un problème</h2>
        <p>
          Si vous rencontrez une difficulté pour accéder à un contenu ou à un service, écrivez-nous à <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : nous vous apporterons une réponse ou une alternative.
        </p>
      </Prose>
    </PageWrap>
  );
}
