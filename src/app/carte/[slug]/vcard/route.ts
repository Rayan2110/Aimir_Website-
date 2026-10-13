import { getMember, team } from "@/content/team";
import { buildVCard } from "@/lib/card/vcard";
import { site } from "@/content/site";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMember(slug);
  if (!m) return new Response("Introuvable", { status: 404 });
  const body = buildVCard(m, `${site.url}/carte/${m.slug}`);
  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${m.slug}-inenco-energy.vcf"`,
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
