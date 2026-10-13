import type { SectorIcon as Icon } from "@/content/sectors";

const PATHS: Record<Icon, React.ReactNode> = {
  restaurant: (
    <>
      <path d="M10 6v10a3 3 0 006 0V6M13 6v34" />
      <path d="M30 40V6c4 2 6 8 6 14h-6" />
    </>
  ),
  hotel: (
    <>
      <path d="M6 40V12l18-6 18 6v28" />
      <path d="M14 18h4M22 18h4M30 18h4M14 26h4M22 26h4M30 26h4M20 40v-7h8v7" />
    </>
  ),
  shop: (
    <>
      <path d="M6 16l3-9h30l3 9M6 16v24h36V16M6 16c0 3 3 5 6 5s6-2 6-5c0 3 3 5 6 5s6-2 6-5c0 3 3 5 6 5s6-2 6-5" />
      <path d="M18 40V29h12v11" />
    </>
  ),
  bakery: (
    <>
      <path d="M6 30c0-9 8-16 18-16s18 7 18 16v4H6z" />
      <path d="M16 18l4 8M24 16v10M32 18l-4 8" />
    </>
  ),
  office: (
    <>
      <path d="M8 40V8h20v32M28 18h12v22M4 40h40" />
      <path d="M14 14h2M20 14h2M14 21h2M20 21h2M14 28h2M20 28h2M33 25h2M33 32h2" />
    </>
  ),
  factory: (
    <>
      <path d="M4 40V22l10 6v-6l10 6v-6l10 6V8h6v32z" />
      <path d="M12 34h4M22 34h4" />
    </>
  ),
  syndic: (
    <>
      <path d="M4 40V18h12v22M16 40V10h16v30M32 40V22h12v18" />
      <path d="M21 16h2M25 16h2M21 23h2M25 23h2M21 30h2M25 30h2" />
    </>
  ),
  building: (
    <>
      <path d="M10 40V6h28v34M4 40h40" />
      <path d="M16 12h4M28 12h4M16 19h4M28 19h4M16 26h4M28 26h4M21 40v-6h6v6" />
    </>
  ),
  network: (
    <>
      <circle cx="24" cy="24" r="4" />
      <circle cx="8" cy="10" r="3" />
      <circle cx="40" cy="10" r="3" />
      <circle cx="8" cy="38" r="3" />
      <circle cx="40" cy="38" r="3" />
      <path d="M10.5 12l10 9M37.5 12l-10 9M10.5 36l10-9M37.5 36l-10-9" />
    </>
  ),
};

export function SectorIcon({ icon, className }: { icon: Icon; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[icon]}
    </svg>
  );
}
