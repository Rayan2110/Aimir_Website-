import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHead } from "@/components/ui/Section";
import { SectorIcon } from "@/components/sectors/SectorIcon";
import { CtaBand } from "@/components/ui/CtaBand";
import { getSector, sectors } from "@/content/sectors";

// Toutes les pages valides sont prérendues via generateStaticParams ; un paramètre
// inconnu mène à une 404. La navigation peut donc bloquer sur ce cas marginal.
export const instant = false;

export function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSector(slug);
  if (!s) return {};
  return {
    title: `Énergie — ${s.name}`,
    description: `${s.name} : ${s.intro.slice(0, 140)}…`,
    alternates: { canonical: `/secteurs/${s.slug}` },
  };
}

export default async function SectorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSector(slug);
  if (!s) notFound();
  const others = sectors.filter((x) => x.slug !== s.slug);

  return (
    <PageWrap>
      <PageHero
        eyebrow={s.name}
        crumbs={[{ href: "/secteurs", label: "Secteurs" }]}
        title={`${s.name} : *${s.short.toLowerCase()}.*`}
        lead={s.intro}
        seed={2 + sectors.indexOf(s) * 0.7}
        aside={
          <div className="panel flex items-center gap-6 rounded-[6px] p-6">
            <SectorIcon icon={s.icon} className="size-20 shrink-0 text-volt" />
            <div>
              <p className="eyebrow">Énergies concernées</p>
              <p className="mt-2 text-[18px] tracking-tight">{s.energies.join(" · ")}</p>
            </div>
          </div>
        }
      />

      <section className="py-24 md:py-32">
        <Container>
          <SectionHead index="01" label="Vos enjeux" title="Ce qui compte *dans votre secteur.*" align="split" />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[4px] border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
            {s.issues.map((it, i) => (
              <li key={it.title} className="bg-ink-950 p-8" data-reveal style={{ ["--d" as string]: i * 70 }}>
                <span className="font-mono text-[11px] text-volt">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-6 text-[22px] tracking-tight">{it.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{it.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="on-paper py-24 md:py-32">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">
              <span className="text-volt-deep">02</span> — Notre analyse
            </p>
            <h2 className="display text-[clamp(2.2rem,4vw,3.6rem)]">Ce que nous regardons en priorité</h2>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {s.focus.map((f, i) => (
              <li key={f} className="flex items-baseline gap-6 border-t border-[var(--line)] py-5 text-[18px] tracking-tight" data-reveal style={{ ["--d" as string]: i * 60 }}>
                <span className="font-mono text-[11px] text-ink-text-2">{String(i + 1).padStart(2, "0")}</span>
                {f}
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-[var(--line)] py-20">
        <Container>
          <p className="eyebrow mb-6">Autres secteurs</p>
          <ul className="flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/secteurs/${o.slug}`} className="inline-flex items-center gap-2 rounded-[3px] border border-[var(--line)] px-3 py-2 text-[14px] text-fg-2 transition-colors hover:border-volt/60 hover:text-fg">
                  <SectorIcon icon={o.icon} className="size-4" />
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </PageWrap>
  );
}
