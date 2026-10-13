import type { Metadata } from "next";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { LegalUpdated, Prose } from "@/components/ui/Prose";
import { CtaBand } from "@/components/ui/CtaBand";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Comment sommes-nous rémunérés ?",
  description:
    "Transparence : INENCO ENERGY n'adresse aucune facture à ses clients. Nous sommes rémunérés par le fournisseur retenu, via une commission incluse dans le prix de son offre.",
  alternates: { canonical: "/remuneration" },
};

export default function RemunerationPage() {
  return (
    <PageWrap>
      <PageHero eyebrow="Notre rémunération" title="Comment sommes-nous *rémunérés ?*" lead="Une question légitime, à laquelle nous répondons clairement." seed={4.9} />
      <Prose>
        <LegalUpdated date="13 octobre 2026" />
        <h2>Pas de facture INENCO</h2>
        <p>
          {site.name} ne vous adresse aucune facture, que vous donniez suite ou non à nos études. L&apos;analyse de votre contrat, la consultation des fournisseurs, l&apos;étude comparative, l&apos;accompagnement à la souscription et le suivi ne vous sont pas facturés.
        </p>
        <h2>Une commission versée par le fournisseur retenu</h2>
        <p>
          Lorsque vous signez une offre que nous vous avons présentée, le fournisseur concerné nous verse une commission. Elle est <strong>incluse dans le prix de son offre</strong> : c&apos;est donc ce prix, commission comprise, que nous comparons à votre contrat actuel et que vous payez. Si vous ne signez pas, nous ne sommes pas rémunérés.
        </p>
        <p>
          Son niveau peut varier d&apos;un fournisseur et d&apos;une offre à l&apos;autre. Elle est en général intégrée au prix de l&apos;énergie pendant toute la durée du contrat de fourniture, y compris si vous mettez fin à notre mandat. Votre conseiller vous indique, sur demande, le montant attaché à chaque proposition.
        </p>
        <h2>Un panel de fournisseurs, pas tout le marché</h2>
        <p>
          Nous consultons un panel de fournisseurs d&apos;électricité et de gaz avec lesquels nous travaillons. Nous ne prétendons pas couvrir l&apos;ensemble du marché. Chaque étude indique la liste des fournisseurs consultés et les propositions reçues.
        </p>
        <h2>Ce que nous ne sommes pas</h2>
        <ul>
          <li>Nous ne sommes pas fournisseur d&apos;électricité ni de gaz.</li>
          <li>Nous ne sommes pas gestionnaire de réseau (Enedis, GRDF ou entreprises locales de distribution).</li>
          <li>Nous ne sommes affiliés à aucun organisme public ni à la Commission de régulation de l&apos;énergie.</li>
        </ul>
        <h2>Notre engagement</h2>
        <p>
          Nous ne vous présentons une proposition que si elle améliore votre situation actuelle, en prix ou en conditions, sur une base de comparaison identique. Les écarts que nous indiquons sont des estimations calculées sur votre consommation : ils ne constituent pas une garantie d&apos;économies.
        </p>
        <p>Pour toute question sur notre rémunération dans le cadre de votre dossier, votre conseiller vous répond.</p>
      </Prose>
      <CtaBand />
    </PageWrap>
  );
}
