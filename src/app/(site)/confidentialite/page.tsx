import type { Metadata } from "next";
import Link from "next/link";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { LegalUpdated, Prose, V } from "@/components/ui/Prose";
import { LegalDraftNotice } from "@/components/ui/LegalDraftNotice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et RGPD d'INENCO ENERGY : données collectées, finalités, bases légales, destinataires, durées de conservation, sécurité et droits.",
  alternates: { canonical: "/confidentialite" },
};

const TREATMENTS = [
  {
    name: "Étude de vos contrats d'énergie (dépôt de facture)",
    data: "Identité et coordonnées professionnelles, entreprise, SIREN/SIRET, factures et informations qu'elles contiennent (adresse du site, PDL/PCE, consommations, prix, titulaire), énergie, nombre de sites, échéance.",
    purpose: "Analyser votre contrat, consulter des fournisseurs, vous présenter une étude comparative et vous recontacter.",
    basis: "Mesures précontractuelles prises à votre demande (art. 6.1.b RGPD).",
    retention: "3 ans à compter de votre dernier contact. Une facture déposée sans suite est supprimée au plus tard 12 mois après sa réception.",
  },
  {
    name: "Demandes de contact",
    data: "Identité, coordonnées, entreprise, message.",
    purpose: "Répondre à votre demande.",
    basis: "Mesures précontractuelles ou intérêt légitime à répondre aux demandes (art. 6.1.b et 6.1.f).",
    retention: "3 ans à compter de votre dernier contact.",
  },
  {
    name: "Suivi des clients et des contrats",
    data: "Données du dossier, contrats, propositions, échéances, échanges.",
    purpose: "Accompagner la souscription, suivre le contrat, préparer le renouvellement.",
    basis: "Exécution du mandat confié (art. 6.1.b).",
    retention: "Durée de la relation, puis 5 ans (prescription commerciale) en archivage intermédiaire.",
  },
  {
    name: "Prospection commerciale entre professionnels",
    data: "Coordonnées professionnelles.",
    purpose: "Vous informer de nos services en lien avec votre activité professionnelle.",
    basis: "Intérêt légitime (art. 6.1.f). Vous pouvez vous y opposer à tout moment, gratuitement, et dès la collecte (case dédiée).",
    retention: "3 ans à compter du dernier contact émanant de vous. Liste d'opposition : 3 ans.",
  },
  {
    name: "Obligations comptables et fiscales",
    data: "Pièces comptables liées à notre rémunération.",
    purpose: "Respecter nos obligations légales.",
    basis: "Obligation légale (art. 6.1.c).",
    retention: "10 ans (article L.123-22 du Code de commerce).",
  },
  {
    name: "Sécurité du site",
    data: "Données techniques de connexion (adresse IP, date, page, navigateur).",
    purpose: "Prévenir les abus (envois massifs, attaques) et assurer la sécurité du service.",
    basis: "Intérêt légitime (art. 6.1.f).",
    retention: "12 mois au plus.",
  },
];

export default function ConfidentialitePage() {
  const l = site.legal;
  return (
    <PageWrap>
      <PageHero eyebrow="Confidentialité & RGPD" title="Vos données, *vos droits.*" lead="Vos factures et contrats contiennent des informations sensibles pour votre entreprise. Voici, sans jargon, ce que nous en faisons." seed={2.6} />
      <Prose>
        <LegalDraftNotice />
        <LegalUpdated date="13 octobre 2026" />

        <h2>Responsable du traitement</h2>
        <p>
          {l.companyName}, <V>{l.legalForm}</V>, dont le siège est situé <V>{l.headOffice}</V>, immatriculée sous le numéro <V>{l.siren}</V>. Pour toute question relative à vos données : <a href={`mailto:${l.privacyContact}`}>{l.privacyContact}</a>.
        </p>

        <h2>Traitements, finalités et durées</h2>
        <div className="thin-scrollbar overflow-x-auto">
          <table className="min-w-[760px]">
            <thead>
              <tr>
                <th>Traitement</th>
                <th>Données</th>
                <th>Finalité</th>
                <th>Base légale</th>
                <th>Conservation</th>
              </tr>
            </thead>
            <tbody>
              {TREATMENTS.map((t) => (
                <tr key={t.name}>
                  <td className="!text-fg">{t.name}</td>
                  <td>{t.data}</td>
                  <td>{t.purpose}</td>
                  <td>{t.basis}</td>
                  <td>{t.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Les champs obligatoires des formulaires sont signalés : sans eux, nous ne pouvons pas traiter votre demande. Les autres sont facultatifs. Les données relatives à une personne morale (par exemple la consommation d&apos;un établissement) ne sont pas en elles-mêmes des données personnelles, mais nous leur appliquons le même niveau de protection. Celles d&apos;un entrepreneur individuel sont, elles, des données personnelles.
        </p>
        <p>
          Lors du dépôt d&apos;une facture, vous pouvez masquer votre IBAN : il ne nous est pas utile.
        </p>

        <h2>Données que nous ne collectons pas directement auprès de vous</h2>
        <ul>
          <li>
            <strong>Factures déposées par un tiers</strong> (syndic, gestionnaire, collaborateur) : elles peuvent mentionner le titulaire du contrat. Celui-ci peut exercer ses droits auprès de nous dans les mêmes conditions.
          </li>
          <li>
            <strong>Données de comptage</strong> des gestionnaires de réseau (Enedis, GRDF ou entreprises locales de distribution) : uniquement si vous signez une autorisation écrite et expresse, pour la durée de l&apos;étude et du suivi ; l&apos;autorisation est conservée pendant sa durée de validité puis 5 ans à titre de preuve.
          </li>
          <li>
            <strong>Données publiques des entreprises</strong> (répertoire SIRENE) : pour vérifier l&apos;identité et l&apos;activité de l&apos;entreprise à partir du SIREN / SIRET.
          </li>
        </ul>

        <h2>Destinataires</h2>
        <ul>
          <li>L&apos;équipe {l.companyName} chargée de votre dossier, dans la limite de ses attributions.</li>
          <li>
            Les fournisseurs d&apos;énergie consultés, pour les seules données nécessaires à l&apos;établissement de leur proposition (caractéristiques du site, consommation, échéance, identification de l&apos;entreprise), avec votre autorisation donnée lors du dépôt.
          </li>
          <li>
            Nos sous-traitants techniques, liés par contrat (article 28 RGPD) : hébergeur du site (<V>{l.host.name}</V>), service de messagerie <V>[À compléter]</V>, et à terme les outils de stockage documentaire et de signature électronique.
          </li>
          <li>Les autorités, uniquement sur demande légalement fondée.</li>
        </ul>
        <p>Vos données ne sont jamais vendues ni louées.</p>

        <h2>Transferts hors de l&apos;Union européenne</h2>
        <p>
          Nous privilégions des prestataires qui hébergent les données dans l&apos;Union européenne. Si un prestataire est établi hors de l&apos;Union européenne ou peut y accéder, le transfert est encadré par une décision d&apos;adéquation (par exemple le Data Privacy Framework UE–États-Unis pour les entreprises certifiées) ou par les clauses contractuelles types de la Commission européenne.
        </p>
        <p>
          Prestataires et garanties : <V>[À compléter]</V>. Vous pouvez obtenir une copie des garanties applicables auprès de {l.privacyContact}.
        </p>

        <h2>Sécurité</h2>
        <p>
          Connexion chiffrée (HTTPS), transmission chiffrée des documents, contrôle du type réel des fichiers déposés, limitation des envois, accès restreint et nominatif, journalisation, sauvegardes. En cas de violation de données susceptible d&apos;engendrer un risque pour vos droits, nous notifions la CNIL dans les 72 heures et vous informons lorsque la loi l&apos;exige.
        </p>

        <h2>Alertes du futur espace client</h2>
        <p>
          Les alertes de l&apos;espace client INENCO ENERGY DESK (couche « OMEGA ENERGY ») sont produites par des règles explicites appliquées à vos données (dates d&apos;échéance, dates de factures, consommations). Elles ont une valeur d&apos;information et ne produisent aucun effet juridique : aucune décision n&apos;est prise de manière exclusivement automatisée.
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, de portabilité et d&apos;opposition (notamment à la prospection, sans avoir à vous justifier), ainsi que du droit de définir des directives relatives au sort de vos données après votre décès. Pour les exercer : <a href={`mailto:${l.privacyContact}`}>{l.privacyContact}</a>. Nous répondons dans un délai d&apos;un mois, prolongeable de deux mois si la demande est complexe. Une pièce justificative peut être demandée en cas de doute raisonnable sur votre identité.
        </p>
        <p>
          Vous pouvez introduire une réclamation auprès de la Commission nationale de l&apos;informatique et des libertés (CNIL), 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 —{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            www.cnil.fr
          </a>
          .
        </p>

        <h2>Cookies et traceurs</h2>
        <p>
          Ce site ne dépose aucun cookie de mesure d&apos;audience, publicitaire ou de réseau social, et n&apos;utilise aucun service tiers de suivi. Les polices de caractères sont hébergées sur nos propres serveurs. Voir la page <Link href="/cookies">Cookies</Link>.
        </p>

        <h2>Cartes de visite numériques</h2>
        <p>
          Les pages de cartes de visite numériques de nos collaborateurs ne collectent aucune donnée sur les visiteurs. Le téléchargement d&apos;une fiche contact (vCard) ne fait l&apos;objet d&apos;aucun suivi.
        </p>

        <h2>Modifications</h2>
        <p>Cette politique peut évoluer, notamment à l&apos;ouverture de l&apos;espace client. La date de dernière mise à jour figure en haut de cette page.</p>
      </Prose>
    </PageWrap>
  );
}
