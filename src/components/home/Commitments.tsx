import Link from "next/link";
import { Container, SectionHead } from "@/components/ui/Section";

const ITEMS = [
  {
    k: "0 €",
    title: "Aucun frais facturé",
    text: "Vous ne payez rien à INENCO. Notre rémunération est une commission versée par le fournisseur retenu, incluse dans le prix de son offre.",
    link: { href: "/remuneration", label: "Comment sommes-nous rémunérés ?" },
  },
  {
    k: "+",
    title: "Une offre seulement si elle vous fait gagner",
    text: "Nous ne vous présentons une proposition que si elle améliore votre situation actuelle, en prix ou en conditions. Sinon, nous vous le disons.",
  },
  {
    k: "1",
    title: "Un interlocuteur unique",
    text: "Une personne suit votre dossier de l'analyse au renouvellement. Elle connaît vos sites, vos contraintes et vos échéances.",
  },
  {
    k: "0",
    title: "Aucune démarche de votre côté",
    text: "Nous préparons la souscription et suivons le changement de fournisseur. Aucune coupure, aucune intervention sur le compteur.",
  },
];

export function Commitments() {
  return (
    <section className="relative border-t border-[var(--line)] py-28 md:py-36">
      <Container>
        <SectionHead index="09" label="Nos engagements" title="Un conseil, *pas une vente.*" align="split" lead="Le courtage en énergie n'a pas toujours bonne presse. Nous avons choisi des règles simples, et nous les tenons." />
        <ul className="mt-16 grid border-t border-[var(--line)] md:grid-cols-2 xl:grid-cols-4">
          {ITEMS.map((it, i) => (
            <li
              key={it.title}
              data-reveal
              style={{ ["--d" as string]: i * 80 }}
              className="group relative border-b border-[var(--line)] py-10 md:px-8 md:[&:nth-child(odd)]:pl-0 md:[&:nth-child(even)]:border-l xl:border-b-0 xl:[&:nth-child(3)]:border-l xl:[&:nth-child(3)]:pl-8"
            >
              <span className="display block text-[88px] leading-none text-fg/90 transition-colors duration-500 group-hover:text-volt">{it.k}</span>
              <h3 className="mt-8 text-[20px] tracking-tight">{it.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{it.text}</p>
              {it.link && (
                <Link href={it.link.href} className="link-u mt-5 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-volt">
                  {it.link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
