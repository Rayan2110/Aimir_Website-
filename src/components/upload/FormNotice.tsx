import Link from "next/link";
import { site } from "@/content/site";

/** Information RGPD au point de collecte (art. 13) — version courte, renvoie à la politique complète. */
export function FormNotice({ kind = "facture" }: { kind?: "facture" | "contact" }) {
  return (
    <p className="mt-5 text-[11.5px] leading-relaxed text-fg-3">
      {site.name} traite ces données pour {kind === "facture" ? "réaliser l'étude de vos contrats d'énergie et vous présenter des offres" : "répondre à votre demande"} (base légale : mesures précontractuelles prises à votre demande).
      {kind === "facture" && " Destinataires : l'équipe INENCO et, pour les seules données nécessaires, les fournisseurs consultés."}{" "}
      Conservation : 3 ans après notre dernier échange ; une facture sans suite est supprimée au plus tard 12 mois après réception. Vous pouvez exercer vos droits d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition et de limitation auprès de {site.legal.privacyContact}, et saisir la CNIL.{" "}
      <Link href="/confidentialite" className="underline underline-offset-2 hover:text-fg">
        Politique de confidentialité
      </Link>
      .
    </p>
  );
}
