import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { sectors } from "@/content/sectors";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["", 1],
    ["/methode", 0.9],
    ["/envoyer-une-facture", 0.9],
    ["/electricite", 0.8],
    ["/gaz", 0.8],
    ["/multi-sites", 0.8],
    ["/secteurs", 0.8],
    ["/desk", 0.7],
    ["/etudes-de-cas", 0.6],
    ["/a-propos", 0.6],
    ["/faq", 0.6],
    ["/contact", 0.6],
    ["/remuneration", 0.5],
    ["/mentions-legales", 0.2],
    ["/confidentialite", 0.2],
    ["/conditions-generales", 0.2],
    ["/cookies", 0.2],
    ["/accessibilite", 0.2],
  ];
  return [
    ...pages.map(([path, priority]) => ({ url: `${site.url}${path}`, changeFrequency: "monthly" as const, priority })),
    ...sectors.map((s) => ({ url: `${site.url}/secteurs/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
