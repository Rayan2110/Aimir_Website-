import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardRecto, CardVerso } from "@/components/card/CardFaces";
import { getMember, team } from "@/content/team";
import { site } from "@/content/site";
import { qrSvg } from "@/lib/card/qr";

/**
 * Une face de carte au format d'impression VistaPrint : 88 × 58 mm
 * (85 × 55 mm fini + 1,5 mm de fond perdu de chaque côté).
 * Utilisée par `npm run cartes:pdf` pour produire les fichiers à téléverser.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

// Pages prérendues pour chaque fondateur ; un paramètre inconnu mène à une 404.
export const instant = false;

const FACES = ["recto", "verso"] as const;

export function generateStaticParams() {
  return team.flatMap((m) => FACES.map((face) => ({ slug: m.slug, face })));
}

export default async function ExportFacePage({ params }: { params: Promise<{ slug: string; face: string }> }) {
  const { slug, face } = await params;
  const m = getMember(slug);
  if (!m || !(FACES as readonly string[]).includes(face)) notFound();
  const index = team.indexOf(m);
  const qr = face === "verso" ? await qrSvg(`${site.url}/carte/${m.slug}`) : "";

  return (
    <main className="bg-white">
      <style>{`@page { size: 88mm 58mm; margin: 0; } html, body { margin: 0; background: #fff !important; } .grain::after { display: none !important; }`}</style>
      <div className="h-[58mm] w-[88mm] overflow-hidden" style={{ ["--bleed" as string]: "1.5mm" }}>
        {face === "recto" ? <CardRecto className="h-full w-full" seed={1.7 + index * 0.9} /> : <CardVerso member={m} qr={qr} className="h-full w-full" />}
      </div>
    </main>
  );
}
