import type { Metadata } from "next";
import Link from "next/link";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { LegalUpdated, Prose, V } from "@/components/ui/Prose";
import { LegalDraftNotice } from "@/components/ui/LegalDraftNotice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Conditions générales",
  description:
    "Conditions générales d'utilisation du site et conditions générales de service (mandat de courtage) d'INENCO ENERGY, dont le droit de rétractation des petits professionnels.",
  alternates: { canonical: "/conditions-generales" },
};

export default function ConditionsPage() {
  const l = site.legal;
  return (
    <PageWrap>
      <PageHero eyebrow="Conditions générales" title="Conditions *générales.*" lead="Conditions d'utilisation du site et conditions de notre service de courtage." seed={6.6} />
      <Prose>
        <LegalDraftNotice />
        <LegalUpdated date="13 octobre 2026" />

        <h2>Partie A — Conditions générales d&apos;utilisation du site</h2>
        <h3>A.1 Objet</h3>
        <p>
          Les présentes conditions encadrent l&apos;accès et l&apos;utilisation du site édité par {l.companyName} (voir les <Link href="/mentions-legales">mentions légales</Link>). Utiliser le site emporte leur acceptation.
        </p>
        <h3>A.2 Contenus</h3>
        <p>
          Les contenus du site sont fournis à titre d&apos;information générale. Les simulateurs, exemples chiffrés et la démonstration d&apos;INENCO ENERGY DESK reposent sur des données fictives : ils ne constituent ni une offre, ni un engagement sur un résultat.
        </p>
        <h3>A.3 Dépôt de documents</h3>
        <p>
          L&apos;utilisateur s&apos;engage à ne déposer que des documents dont il est titulaire ou qu&apos;il est autorisé à transmettre au nom de l&apos;entreprise concernée, et à fournir des informations exactes. Les fichiers sont contrôlés (format, taille) ; tout usage abusif peut entraîner le blocage des envois.
        </p>
        <h3>A.4 Espace client</h3>
        <p>
          L&apos;espace client INENCO ENERGY DESK fera l&apos;objet de conditions d&apos;utilisation spécifiques (accès, identifiants, sécurité, droits des utilisateurs) communiquées à son ouverture.
        </p>
        <h3>A.5 Disponibilité et responsabilité</h3>
        <p>
          {l.companyName} s&apos;efforce d&apos;assurer l&apos;accès au site en continu mais ne peut garantir l&apos;absence d&apos;interruption. Sa responsabilité ne saurait être engagée du fait d&apos;une utilisation du site non conforme aux présentes.
        </p>
        <h3>A.6 Propriété intellectuelle</h3>
        <p>Les contenus du site sont protégés. Toute reproduction non autorisée est interdite.</p>

        <h2>Partie B — Conditions générales de service (mandat de courtage)</h2>
        <h3>B.1 Objet du service</h3>
        <p>
          {l.companyName} propose aux professionnels un service d&apos;intermédiation en fourniture d&apos;électricité et de gaz naturel : analyse des factures et contrats, consultation de fournisseurs, étude comparative, accompagnement à la souscription et au changement de fournisseur, suivi des échéances et préparation des renouvellements.
        </p>
        <h3>B.2 Mandat et transmission d&apos;informations</h3>
        <p>
          En déposant une facture ou en nous confiant une étude, le client nous autorise à consulter des fournisseurs pour son compte et à leur transmettre les seules informations nécessaires à l&apos;établissement d&apos;une proposition. L&apos;accès aux données de comptage détenues par les gestionnaires de réseau (Enedis, GRDF ou entreprises locales de distribution) fait l&apos;objet d&apos;une autorisation écrite et expresse distincte, conservée par {l.companyName}.
        </p>
        <h3>B.3 Absence d&apos;engagement</h3>
        <p>
          La demande d&apos;étude n&apos;engage pas le client. Il reste libre de donner suite ou non aux propositions présentées. Aucun contrat de fourniture n&apos;est souscrit sans son accord exprès.
        </p>
        <h3>B.4 Rémunération</h3>
        <p>
          Le service n&apos;est pas facturé au client. {l.companyName} est rémunéré par le fournisseur retenu par le client, via une commission incluse dans le prix de l&apos;offre (<Link href="/remuneration">détails</Link>). Les propositions sont comparées commission comprise.
        </p>
        <h3>B.5 Nature du contrat de fourniture</h3>
        <p>
          Le contrat de fourniture d&apos;énergie est conclu directement entre le client et le fournisseur, selon les conditions générales et particulières de ce dernier, que le client reçoit avant signature. {l.companyName} n&apos;est pas partie à ce contrat et n&apos;est pas responsable de son exécution par le fournisseur (facturation, qualité de service), mais accompagne le client dans ses échanges avec lui.
        </p>
        <h3>B.6 Obligations de {l.companyName}</h3>
        <p>
          {l.companyName} est tenu d&apos;une obligation de moyens. Il s&apos;engage à présenter des informations claires et loyales, à indiquer les fournisseurs consultés, à préciser les hypothèses de ses estimations, et à ne présenter une proposition que si, à la date de l&apos;étude et sur une base de comparaison identique, elle améliore la situation du client en prix ou en conditions. Cet engagement ne constitue pas une garantie d&apos;économies : l&apos;évolution des marchés (notamment pour les prix indexés) et de la consommation peut modifier le résultat. Les écarts indiqués sont des estimations.
        </p>
        <h3>B.7 Obligations du client</h3>
        <p>
          Le client fournit des informations exactes et à jour, notamment sur ses contrats en cours (échéance, préavis, éventuelles indemnités de sortie). Il lui appartient de vérifier les conditions de son contrat actuel avant toute résiliation ; {l.companyName} l&apos;y aide sur la base des documents transmis.
        </p>
        <h3>B.8 Copropriétés</h3>
        <p>
          Pour un syndicat de copropriétaires, la décision de souscrire relève de l&apos;assemblée générale ou d&apos;une délégation régulièrement consentie. {l.companyName} prépare une étude présentable au conseil syndical et à l&apos;assemblée.
        </p>
        <h3>B.9 Droit de rétractation des petits professionnels</h3>
        <p>
          Lorsque le contrat est conclu hors établissement, que son objet n&apos;entre pas dans le champ de l&apos;activité principale du client professionnel et que celui-ci emploie au plus cinq salariés, le client dispose d&apos;un délai de quatorze jours pour se rétracter, sans avoir à motiver sa décision (articles L.221-3 et L.221-18 du Code de la consommation). Le délai court à compter de la conclusion du contrat. En cas de contrat conclu hors établissement, ces informations et le formulaire ci-dessous sont remis au client sur papier ou sur un autre support durable lors de la signature. Pour l&apos;exercer, le client adresse une déclaration dénuée d&apos;ambiguïté ou le formulaire ci-dessous à <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> ou par courrier au siège.
        </p>
        <div className="mt-4 rounded-[4px] border border-[var(--line-strong)] p-6 text-[14px] text-fg-2">
          <p className="!mt-0 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">Modèle de formulaire de rétractation</p>
          <p>
            À l&apos;attention de {l.companyName}, <V>{l.headOffice}</V>, {site.contact.email} :
          </p>
          <p>Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la prestation de services ci-dessous :</p>
          <p>Commandé le (*) / conclu le (*) : ……………</p>
          <p>Nom du (des) client(s) et dénomination de l&apos;entreprise : ……………</p>
          <p>Adresse du (des) client(s) : ……………</p>
          <p>Signature du (des) client(s) (uniquement en cas de notification sur papier) : ……………</p>
          <p>Date : ……………</p>
          <p className="text-[12px] text-fg-3">(*) Rayez la mention inutile.</p>
        </div>
        <h3>B.10 Confidentialité et données</h3>
        <p>
          {l.companyName} traite de façon confidentielle les documents et informations du client. Les données personnelles sont traitées conformément à la <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
        <h3>B.11 Durée et fin du mandat</h3>
        <p>
          Le mandat prend effet à la demande d&apos;étude et se poursuit pendant la durée du suivi du contrat de fourniture. Le client peut y mettre fin à tout moment, par écrit, sans frais. La fin du mandat n&apos;a pas d&apos;effet sur le contrat de fourniture en cours, dont le prix inclut la commission jusqu&apos;à son terme.
        </p>
        <h3>B.12 Réclamations et médiation</h3>
        <p>
          Toute réclamation relative à notre service peut être adressée à <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>. Pour un litige avec un fournisseur d&apos;énergie, les microentreprises (moins de 10 personnes et chiffre d&apos;affaires, recettes ou total de bilan annuels n&apos;excédant pas 2 M€) et les non-professionnels peuvent, après réclamation écrite auprès du fournisseur, saisir gratuitement le{" "}
          <a href="https://www.energie-mediateur.fr" target="_blank" rel="noopener noreferrer">
            Médiateur national de l&apos;énergie
          </a>
          . Le service public{" "}
          <a href="https://www.energie-info.fr" target="_blank" rel="noopener noreferrer">
            energie-info.fr
          </a>{" "}
          informe sur les droits des consommateurs d&apos;énergie.
        </p>
        <h3>B.13 Droit applicable et juridiction</h3>
        <p>
          Les présentes conditions sont soumises au droit français. À défaut de résolution amiable, tout litige entre professionnels relève des tribunaux compétents du ressort du siège de {l.companyName}, sous réserve des règles impératives applicables aux non-professionnels.
        </p>
      </Prose>
    </PageWrap>
  );
}
