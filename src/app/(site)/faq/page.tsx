import type { Metadata } from "next";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { CtaBand } from "@/components/ui/CtaBand";
import { faq } from "@/content/faq";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Coût, rémunération, changement de fournisseur, coupure, résiliation, rétractation, tarifs réglementés, données : les réponses aux questions fréquentes sur le courtage en énergie INENCO ENERGY.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))),
  };
  return (
    <PageWrap>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero eyebrow="FAQ" title="Questions *fréquentes.*" lead="Ce que nos clients nous demandent le plus souvent avant de nous confier leur facture." seed={5.6} />
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-16">
            {faq.map((g, gi) => (
              <div key={g.title} className="grid gap-8 lg:grid-cols-12">
                <h2 className="eyebrow lg:col-span-3 lg:pt-6" data-reveal>
                  <span className="text-volt">{String(gi + 1).padStart(2, "0")}</span> — {g.title}
                </h2>
                <div className="border-t border-[var(--line)] lg:col-span-9">
                  {g.items.map((it) => (
                    <details key={it.q} className="group border-b border-[var(--line)]" data-reveal>
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[clamp(1.1rem,1.6vw,1.35rem)] tracking-tight transition-colors hover:text-volt [&::-webkit-details-marker]:hidden">
                        {it.q}
                        <span className="relative mt-2 size-3 shrink-0" aria-hidden>
                          <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                          <span className="absolute inset-y-0 left-1/2 w-px bg-current transition-transform duration-500 group-open:rotate-90 group-open:opacity-0" />
                        </span>
                      </summary>
                      <p className="max-w-3xl pb-7 text-[16px] leading-relaxed text-fg-2">{it.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand title="Votre question n'y figure pas ? *Écrivez-nous.*" lead="Un conseiller vous répond, sans engagement." />
    </PageWrap>
  );
}
