import type { Metadata } from "next";
import { CardRecto, CardVerso } from "@/components/card/CardFaces";
import { PrintButton } from "@/components/card/PrintButton";
import { fullName, team } from "@/content/team";
import { site } from "@/content/site";
import { qrSvg } from "@/lib/card/qr";

export const metadata: Metadata = {
  title: "Cartes de visite — planche d'impression",
  robots: { index: false, follow: false },
};

/** Trait de coupe : repères placés dans le fond perdu. */
function CropMarks() {
  const c = "absolute bg-black/70";
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {/* coins : traits horizontaux et verticaux à 3 mm (fond perdu) */}
      <span className={`${c} left-[-6mm] top-[3mm] h-px w-[5mm]`} />
      <span className={`${c} right-[-6mm] top-[3mm] h-px w-[5mm]`} />
      <span className={`${c} bottom-[3mm] left-[-6mm] h-px w-[5mm]`} />
      <span className={`${c} bottom-[3mm] right-[-6mm] h-px w-[5mm]`} />
      <span className={`${c} left-[3mm] top-[-6mm] h-[5mm] w-px`} />
      <span className={`${c} right-[3mm] top-[-6mm] h-[5mm] w-px`} />
      <span className={`${c} bottom-[-6mm] left-[3mm] h-[5mm] w-px`} />
      <span className={`${c} bottom-[-6mm] right-[3mm] h-[5mm] w-px`} />
    </span>
  );
}

export default async function ImpressionPage() {
  const qrs = await Promise.all(team.map((m) => qrSvg(`${site.url}/carte/${m.slug}`)));
  return (
    <main className="min-h-dvh bg-[#d8d4cb] py-10 text-ink-text print:bg-white print:py-0">
      <style>{`@page { size: A4; margin: 12mm; } @media print { .sheet { box-shadow: none !important; } }`}</style>
      <div className="no-print mx-auto mb-8 max-w-[210mm] px-4">
        <h1 className="text-[26px] tracking-tight">Cartes de visite — planche d&apos;impression</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-text-2">
          Format 85 × 55 mm, fond perdu de 3 mm inclus (91 × 61 mm), traits de coupe. Imprimez à 100 % (sans mise à l&apos;échelle) ou enregistrez en PDF vectoriel pour l&apos;imprimeur. Le QR code du verso ouvre la carte numérique{" "}
          <code className="rounded bg-black/10 px-1">{site.url.replace(/^https?:\/\//, "")}/carte/…</code>. Idéal aussi pour une carte NFC programmée avec la même adresse.
        </p>
        <div className="mt-4">
          <PrintButton />
        </div>
      </div>

      <div className="sheet mx-auto grid w-[186mm] gap-[12mm] bg-white p-[8mm] shadow-2xl print:w-auto print:p-0">
        {team.map((m, i) => (
          <section key={m.slug} className="break-inside-avoid">
            <p className="mb-[6mm] font-mono text-[8pt] uppercase tracking-[0.14em] text-black/50">
              {fullName(m)} — recto / verso
            </p>
            <div className="flex flex-wrap gap-[14mm]">
              {[<CardRecto key="r" className="h-full w-full" seed={1.7 + i * 0.9} />, <CardVerso key="v" member={m} qr={qrs[i]} className="h-full w-full" />].map((face, k) => (
                <div key={k} className="relative h-[61mm] w-[91mm]">
                  {face}
                  <CropMarks />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
