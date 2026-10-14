import type { NextConfig } from "next";

/** En-têtes de sécurité appliqués à toutes les réponses (brief §20). */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/**
 * Content-Security-Policy (production) : uniquement des ressources du site lui-même.
 * Les scripts en ligne de Next.js (flux RSC) imposent 'unsafe-inline' tant que les pages
 * restent statiques (un nonce imposerait un rendu dynamique de chaque page).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

if (process.env.NODE_ENV === "production") securityHeaders.push({ key: "Content-Security-Policy", value: csp });

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Dossier de compilation : `.next` par défaut ; le générateur de cartes de visite
  // compile dans un dossier séparé pour ne pas perturber un site déjà lancé.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // Développement : autorise l'aperçu depuis un téléphone sur le même réseau local.
  allowedDevOrigins: ["192.168.*.*", "*.local"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
