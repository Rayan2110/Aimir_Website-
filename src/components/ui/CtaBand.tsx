import { ButtonLink } from "@/components/ui/Button";
import { Split } from "@/components/motion/Split";
import { TerrainSvg } from "@/components/brand/TerrainSvg";

/** Bandeau d'appel à l'action de fin de page. */
export function CtaBand({
  title = "Envoyez votre facture. *Nous vous disons ce que les fournisseurs consultés peuvent vous proposer.*",
  lead = "Sans engagement. INENCO est rémunéré par le fournisseur retenu, commission incluse dans son prix. Un analyste vous recontacte rapidement.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-[var(--line)] py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:linear-gradient(to_top,black_30%,transparent)]">
        <TerrainSvg className="h-full w-full" seed={5.1} t={2.2} amplitude={0.3} />
      </div>
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
        <div className="max-w-4xl">
          <Split className="display text-[clamp(2.2rem,4.8vw,4.4rem)]" text={title} />
          <p className="mt-6 max-w-xl text-[17px] text-fg-2" data-reveal>
            {lead}
          </p>
          <div className="mt-10 flex flex-wrap gap-4" data-reveal style={{ ["--d" as string]: 120 }}>
            <ButtonLink href="/envoyer-une-facture" magnetic>
              Analyser ma facture
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" arrow={false}>
              Parler à un conseiller
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
