import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardTilt, ShareButton } from "@/components/card/CardTilt";
import { ActionIcon, actionCls } from "@/components/card/actions";
import { CardRecto, CardVerso } from "@/components/card/CardFaces";
import { TerrainSvg } from "@/components/brand/TerrainSvg";
import { fullName, getMember, team } from "@/content/team";
import { site } from "@/content/site";
import { qrSvg } from "@/lib/card/qr";

// Toutes les pages valides sont prérendues via generateStaticParams ; un paramètre
// inconnu mène à une 404. La navigation peut donc bloquer sur ce cas marginal.
export const instant = false;

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMember(slug);
  if (!m) return {};
  return {
    title: `${fullName(m)} — ${site.name}`,
    description: `${fullName(m)}, ${m.role} chez ${site.name}. ${site.tagline}`,
    robots: { index: false, follow: false },
  };
}

export default async function CartePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMember(slug);
  if (!m) notFound();
  const url = `${site.url}/carte/${m.slug}`;
  const [qrPaper, qrLarge] = await Promise.all([qrSvg(url), qrSvg(url)]);

  return (
    <main className="relative isolate min-h-dvh overflow-hidden px-5 pb-16 pt-10">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black)]">
        <TerrainSvg className="h-full w-full" seed={2.9} t={3.7} amplitude={0.3} />
      </div>
      <div className="mx-auto max-w-[440px]">
        <div className="rise" style={{ ["--d" as string]: 50 }}>
          <CardTilt front={<CardRecto />} back={<CardVerso member={m} qr={qrPaper} />} />
        </div>

        <header className="rise mt-10" style={{ ["--d" as string]: 200 }}>
          <h1 className="display text-[44px]">{fullName(m)}</h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-volt">
            {m.role} · {site.name}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-fg-2">{m.bio}</p>
        </header>

        <nav className="rise mt-8 grid gap-2.5" style={{ ["--d" as string]: 320 }} aria-label="Actions">
          <a href={`/carte/${m.slug}/vcard`} download className={`${actionCls} !border-volt !bg-volt !text-ink-950 [&_svg]:!text-ink-950`}>
            <ActionIcon d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" />
            Enregistrer le contact
          </a>
          <div className="grid grid-cols-2 gap-2.5">
            <a href={`tel:${m.phoneHref}`} className={actionCls}>
              <ActionIcon d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" />
              Appeler
            </a>
            <a href={`mailto:${m.email}`} className={actionCls}>
              <ActionIcon d="M4 4h16v16H4zM4 6l8 7 8-7" />
              E-mail
            </a>
          </div>
          <Link href="/envoyer-une-facture" className={actionCls}>
            <ActionIcon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M12 18v-6M9 15l3-3 3 3" />
            Envoyer une facture pour étude
          </Link>
          <div className="grid grid-cols-2 gap-2.5">
            <Link href="/" className={actionCls}>
              <ActionIcon d="M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
              Le site
            </Link>
            <ShareButton url={url} title={`${fullName(m)} — ${site.name}`} />
          </div>
        </nav>

        <section className="rise mt-10 rounded-[10px] bg-paper p-6 text-ink-text" style={{ ["--d" as string]: 440 }}>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-text-2">À scanner</p>
          <div className="mx-auto mt-4 w-[70%] [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: qrLarge }} />
          <p className="mt-4 text-center text-[13px] text-ink-text-2">Montrez ce code pour partager cette carte.</p>
        </section>

        <footer className="mt-10 flex flex-wrap justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-3">
          <span>{site.tagline}</span>
          <span className="flex gap-3">
            <Link href="/mentions-legales" className="hover:text-fg">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-fg">
              Confidentialité
            </Link>
          </span>
        </footer>
      </div>
    </main>
  );
}
