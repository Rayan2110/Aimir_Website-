import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { V } from "@/components/ui/Prose";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez INENCO ENERGY : demande d'étude, groupe multi-sites, espace client DESK. Réponse rapide par un conseiller.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageWrap>
      <PageHero eyebrow="Contact" title="Parlons de *vos contrats.*" lead="Une question, un périmètre multi-sites, une demande d'accès au Desk : écrivez-nous, un conseiller vous répond." seed={3.9} />
      <section className="py-16 md:py-24">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="h-[640px] animate-pulse rounded-[6px] bg-ink-900" />}>
              <ContactForm />
            </Suspense>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <dl className="grid gap-0 text-[15px]">
              {[
                ["E-mail", <a key="e" className="link-u" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>],
                ["Téléphone", <a key="t" className="link-u" href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>],
                ["Horaires", site.contact.hours],
                ["Adresse", <V key="a">{site.contact.address}</V>],
                ["Zone", site.zone],
              ].map(([k, val]) => (
                <div key={k as string} className="grid grid-cols-[110px_1fr] gap-4 border-t border-[var(--line)] py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-3">{k}</dt>
                  <dd className="text-fg-2">{val}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 rounded-[4px] border border-volt/30 bg-volt/[0.05] p-5">
              <p className="text-[15px] tracking-tight">Vous avez une facture sous la main ?</p>
              <p className="mt-1 text-[13px] text-fg-2">C&apos;est le moyen le plus rapide d&apos;obtenir une étude.</p>
              <Link href="/envoyer-une-facture" className="link-u mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-volt">
                Déposer ma facture →
              </Link>
            </div>
          </aside>
        </Container>
      </section>
    </PageWrap>
  );
}
