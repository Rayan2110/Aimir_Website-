import Link from "next/link";
import { site } from "@/content/site";

/** Information RGPD au point de collecte (art. 13) — version courte, renvoie à la politique complète. */
export function FormNotice({ kind = "facture" }: { kind?: "facture" | "contact" }) {
  return (
    <p className="mt-5 text-[11.5px] leading-relaxed text-fg-3">
      {site.name} utilise ces données pour {kind === "facture" ? "réaliser votre étude et vous présenter des offres" : "répondre à votre demande"} (mesures précontractuelles) et, sauf opposition (case ci-dessus), pour vous informer de ses services (intérêt légitime). Destinataires : l&apos;équipe {site.shortName}, ses prestataires techniques
      {kind === "facture" ? " et, pour les seules données nécessaires à leur proposition, les fournisseurs consultés" : ""}. Conservation : 3 ans après votre dernier contact (durée du contrat + 5 ans si vous devenez client)
      {kind === "facture" ? " ; facture sans suite supprimée au plus tard 12 mois après réception" : ""}. Droits d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de portabilité, directives post-mortem : {site.legal.privacyContact} ; réclamation auprès de la CNIL.{" "}
      <Link href="/confidentialite" className="underline underline-offset-2 hover:text-fg">
        Politique de confidentialité
      </Link>
      .
    </p>
  );
}
