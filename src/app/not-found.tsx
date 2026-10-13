import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
    <Header />
    <main id="contenu">
    <section className="relative flex min-h-[90svh] items-center overflow-hidden pt-[var(--header-h)]">
      <div className="mx-auto w-full max-w-[1440px] px-[var(--gutter)]">
        <p className="eyebrow mb-6">Erreur 404</p>
        <h1 className="display text-[clamp(3rem,9vw,9rem)]">
          Aucun flux <span className="serif italic text-fg-2">sur cette ligne.</span>
        </h1>
        <svg viewBox="0 0 1200 120" className="mt-10 w-full max-w-4xl" aria-hidden>
          <path d="M0 60 C 100 60 120 10 180 10 S 260 110 320 60 S 400 30 440 60 L 1200 60" fill="none" stroke="var(--color-volt)" strokeWidth="2" className="[stroke-dasharray:1400] [stroke-dashoffset:1400] animate-[dash_2.4s_var(--ease-out-expo)_forwards]" />
        </svg>
        <p className="mt-8 max-w-lg text-[17px] text-fg-2">La page demandée n&apos;existe pas ou a été déplacée.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
          <Link href="/envoyer-une-facture" className="link-u self-center font-mono text-[11px] uppercase tracking-[0.14em] text-volt">
            Analyser ma facture
          </Link>
        </div>
      </div>
    </section>
    </main>
    <Footer />
    </>
  );
}
