import { LogoMark } from "@/components/brand/Logo";
import { TerrainSvg } from "@/components/brand/TerrainSvg";
import { fullName, type Member } from "@/content/team";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Faces de la carte de visite (format fini 85 × 55 mm).
 *
 * Les tailles sont en unités de conteneur (cqw) : le même composant sert à
 * l'écran et à l'impression. Pour l'impression, le parent définit `--bleed`
 * (ex. 1.5mm, gabarit VistaPrint 88 × 58 mm) : le fond déborde dans le fond
 * perdu et les contenus restent dans la zone de sécurité.
 */
const inset = (cqw: number) => `calc(${cqw}cqw + var(--bleed, 0px))`;

export function CardRecto({ className, seed = 1.7 }: { className?: string; seed?: number }) {
  return (
    <div className={cn("relative aspect-[85/55] overflow-hidden bg-[#06080b] text-[#eceae4] [container-type:inline-size]", className)}>
      <TerrainSvg className="absolute inset-x-0 bottom-0 h-[78%] w-full" width={850} height={430} rows={26} seed={seed} t={4.2} amplitude={0.3} />
      <div className="absolute flex items-center gap-[2.4cqw]" style={{ left: inset(7), top: inset(8) }}>
        <LogoMark className="size-[7.5cqw]" />
        <span className="flex flex-col leading-none">
          <span className="text-[4.2cqw] font-semibold tracking-[0.2em]">INENCO</span>
          <span className="mt-[0.9cqw] font-mono text-[2.2cqw] tracking-[0.42em] opacity-60">ENERGY</span>
        </span>
      </div>
      <p className="absolute font-mono text-[2.1cqw] uppercase tracking-[0.2em] text-[#eceae4]/70" style={{ left: inset(7), bottom: inset(6) }}>
        Analyse · Consultation · Décision · Suivi
      </p>
    </div>
  );
}

export function CardVerso({ member, qr, className }: { member: Member; qr: string; className?: string }) {
  return (
    <div className={cn("relative aspect-[85/55] overflow-hidden bg-[#efece5] text-[#0b0f14] [container-type:inline-size]", className)}>
      <div className="absolute flex flex-col" style={{ top: inset(7), bottom: inset(7), left: inset(7), right: inset(36) }}>
        <p className="text-[6.2cqw] font-medium leading-none tracking-[-0.03em]">{fullName(member)}</p>
        <p className="mt-[1.6cqw] font-mono text-[2.3cqw] uppercase tracking-[0.18em] text-[#b8731a]">{member.role}</p>
        <div className="mt-auto grid gap-[1cqw] font-mono text-[2.45cqw] leading-tight text-[#0b0f14]/80">
          <span>{member.phone}</span>
          <span>{member.email}</span>
          <span>{site.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
      <div className="absolute flex w-[24cqw] flex-col items-center" style={{ right: inset(7), top: inset(7) }}>
        <span className="block w-full [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} />
        <span className="mt-[1.4cqw] text-center font-mono text-[1.7cqw] uppercase tracking-[0.16em] text-[#0b0f14]/60">Carte numérique</span>
      </div>
      {/* Liseré ambre : prolongé dans le fond perdu pour rester visible après coupe */}
      <span className="absolute bottom-0 left-0 w-full bg-[#f0a33b]" style={{ height: inset(1.2) }} />
    </div>
  );
}
