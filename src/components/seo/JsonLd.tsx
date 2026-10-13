import { site } from "@/content/site";

/** Données structurées schema.org (Organization / ProfessionalService). */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    description: site.description,
    slogan: site.tagline,
    areaServed: { "@type": "Country", name: "France" },
    serviceType: ["Courtage en électricité", "Courtage en gaz naturel", "Optimisation des contrats d'énergie"],
    email: site.contact.email,
    knowsLanguage: "fr",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
