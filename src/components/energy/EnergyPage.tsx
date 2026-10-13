import type { ReactNode } from "react";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHead } from "@/components/ui/Section";
import { OfferAnatomy } from "@/components/transparency/OfferAnatomy";
import { CtaBand } from "@/components/ui/CtaBand";
import { ButtonLink } from "@/components/ui/Button";

export type EnergyContent = {
  eyebrow: string;
  title: string;
  lead: string;
  segmentsTitle: string;
  segmentsLead: string;
  segments: { code: string; name: string; who: string; detail: string }[];
  structures: { name: string; pro: string; con: string }[];
  checks: string[];
  marketNote: { title: string; text: ReactNode };
  seed: number;
};

/** Gabarit commun aux pages Électricité et Gaz. */
export function EnergyPage({ c }: { c: EnergyContent }) {
  return (
    <PageWrap>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        seed={c.seed}
        aside={
          <div className="panel rounded-[6px] p-6">
            <p className="eyebrow">Ce que nous vérifions</p>
            <ul className="mt-4 grid gap-2.5">
              {c.checks.map((x) => (
                <li key={x} className="flex gap-3 text-[15px] text-fg-2">
                  <span className="mt-2.5 h-px w-3 shrink-0 bg-volt" />
                  {x}
                </li>
              ))}
            </ul>
            <ButtonLink href="/envoyer-une-facture" className="mt-6 w-full">
              Analyser ma facture
            </ButtonLink>
          </div>
        }
      />

      <section className="py-24 md:py-32">
        <Container>
          <SectionHead index="01" label="Votre profil" title={c.segmentsTitle} lead={c.segmentsLead} align="split" />
          <div className="mt-14 overflow-x-auto thin-scrollbar">
            <table className="w-full min-w-[640px] text-left">
              <thead className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">
                <tr className="border-b border-[var(--line)]">
                  <th className="py-3 pr-6 font-normal">Segment</th>
                  <th className="py-3 pr-6 font-normal">Pour qui</th>
                  <th className="py-3 font-normal">Ce qui change</th>
                </tr>
              </thead>
              <tbody>
                {c.segments.map((s) => (
                  <tr key={s.code} className="border-b border-[var(--line)] align-top" data-reveal>
                    <td className="py-6 pr-6">
                      <span className="display block text-[40px] text-volt">{s.code}</span>
                      <span className="text-[13px] text-fg-3">{s.name}</span>
                    </td>
                    <td className="py-6 pr-6 text-[15px] text-fg">{s.who}</td>
                    <td className="py-6 text-[15px] leading-relaxed text-fg-2">{s.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="border-t border-[var(--line)] py-24 md:py-32">
        <Container>
          <SectionHead index="02" label="Structures de prix" title="Fixe, indexé, mixte : *chacun son risque.*" lead="Il n'y a pas de bonne réponse universelle. La structure dépend de votre tolérance au risque, de votre trésorerie et du moment." align="split" />
          <div className="mt-14 grid gap-px overflow-hidden rounded-[4px] border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
            {c.structures.map((s, i) => (
              <div key={s.name} className="bg-ink-950 p-8" data-reveal style={{ ["--d" as string]: i * 80 }}>
                <p className="font-mono text-[11px] text-volt">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[24px] tracking-tight">{s.name}</h3>
                <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ok">Pour</p>
                <p className="mt-1 text-[15px] leading-relaxed text-fg-2">{s.pro}</p>
                <p className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-warn">Attention</p>
                <p className="mt-1 text-[15px] leading-relaxed text-fg-2">{s.con}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="on-paper py-24 md:py-32">
        <Container>
          <SectionHead index="03" label="Comprendre votre facture" title="Ce que la consultation *peut changer.*" align="split" lead="Seules certaines composantes dépendent du fournisseur. Nos comparaisons les isolent pour comparer ce qui est comparable." />
          <div className="mt-14" data-reveal>
            <OfferAnatomy tone="paper" />
          </div>
        </Container>
      </section>

      <section className="border-t border-[var(--line)] py-20">
        <Container className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3">Repère marché</p>
          <div className="lg:col-span-8">
            <h2 className="text-[24px] tracking-tight">{c.marketNote.title}</h2>
            <div className="mt-3 max-w-3xl text-[16px] leading-relaxed text-fg-2">{c.marketNote.text}</div>
            <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">Information générale, à jour au 13/10/2026</p>
          </div>
        </Container>
      </section>

      <CtaBand />
    </PageWrap>
  );
}
