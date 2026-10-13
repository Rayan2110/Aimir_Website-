import { site, isPlaceholder } from "@/content/site";

/** Bandeau visible tant que des informations société restent à compléter (disparaît automatiquement ensuite). */
export function LegalDraftNotice() {
  const missing = [site.legal.legalForm, site.legal.siren, site.legal.rcs, site.legal.vat, site.legal.publicationDirector, site.legal.host.name].some(isPlaceholder);
  if (!missing) return null;
  return (
    <p className="!mt-0 mb-10 rounded-[3px] border border-warn/40 bg-warn/10 px-4 py-3 text-[13px] !text-warn">
      Document en cours de finalisation : les informations signalées en surbrillance seront complétées avant la mise en ligne définitive.
    </p>
  );
}
