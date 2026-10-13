import type { Metadata } from "next";
import Link from "next/link";
import { PageWrap } from "@/components/ui/PageWrap";
import { LogoMark } from "@/components/brand/Logo";
import { TerrainSvg } from "@/components/brand/TerrainSvg";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Connexion client",
  description: "Accès à INENCO ENERGY DESK, l'espace client d'INENCO ENERGY. Ouverture progressive, sur invitation.",
  alternates: { canonical: "/connexion" },
  robots: { index: false, follow: true },
};

/**
 * Page de connexion — volontairement inactive tant que l'authentification
 * n'est pas en place : aucun champ de saisie actif, aucune donnée collectée.
 */
export default function ConnexionPage() {
  return (
    <PageWrap>
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-[var(--header-h)]">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
          <TerrainSvg className="h-full w-full" seed={9.9} t={3.3} amplitude={0.3} />
        </div>
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-[var(--gutter)] py-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow rise mb-6">Espace client</p>
            <h1 className="display rise text-[clamp(2.6rem,5vw,4.6rem)]" style={{ ["--d" as string]: 100 }}>
              INENCO ENERGY <span className="text-volt">DESK</span>
            </h1>
            <p className="rise mt-6 max-w-md text-[17px] leading-relaxed text-fg-2" style={{ ["--d" as string]: 250 }}>
              L&apos;espace client ouvre progressivement, sur invitation. Vos identifiants vous seront transmis par votre conseiller INENCO.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ ["--d" as string]: 400 }}>
              <ButtonLink href="/desk#demo">Voir la démonstration</ButtonLink>
              <ButtonLink href="/contact?objet=desk" variant="ghost" arrow={false}>
                Demander un accès
              </ButtonLink>
            </div>
          </div>
          <div className="rise lg:col-span-5 lg:col-start-8" style={{ ["--d" as string]: 300 }}>
            <div className="panel relative rounded-[6px] p-8" aria-label="Formulaire de connexion (bientôt disponible)">
              <div className="flex items-center gap-3">
                <LogoMark className="size-7" />
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-2">Connexion</span>
                <span className="ml-auto rounded-[2px] border border-warn/40 bg-warn/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-warn">Bientôt</span>
              </div>
              <div className="mt-8 grid gap-4 opacity-50" aria-hidden>
                <div>
                  <span className="mb-1.5 block text-[13px] text-fg-2">E-mail professionnel</span>
                  <span className="block h-11 rounded-[3px] border border-[var(--line-strong)]" />
                </div>
                <div>
                  <span className="mb-1.5 block text-[13px] text-fg-2">Mot de passe</span>
                  <span className="block h-11 rounded-[3px] border border-[var(--line-strong)]" />
                </div>
                <span className="mt-2 flex h-11 items-center justify-center rounded-[3px] bg-fg/10 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">Se connecter</span>
              </div>
              <p className="mt-6 text-[13px] text-fg-3">
                La connexion n&apos;est pas encore active : aucune information n&apos;est collectée sur cette page.{" "}
                <Link href="/desk" className="text-fg-2 underline underline-offset-2">
                  Découvrir le Desk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageWrap>
  );
}
