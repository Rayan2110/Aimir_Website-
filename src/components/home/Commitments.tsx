import Link from "next/link";
import { Container, SectionHead } from "@/components/ui/Section";

const ITEMS = [
  {
    k: "%",
    title: "Une rémunération transparente",
    text: "INENCO ne vous adresse aucune facture : nous sommes rémunérés par une commission versée par le fournisseur retenu et incluse dans le prix que vous payez. Les offres sont comparées commission comprise.",
    link: { href: "/remuneration", label: "Comment sommes-nous rémunérés ?" },
  },
  {
    k: "+",
    title: "Une proposition seulement si elle améliore votre situation",
    text: "À la date de l'étude et sur une base identique, en prix ou en conditions. Sinon, nous vous le disons. Ce n'est pas une garantie d'économies : le marché et votre consommation peuvent évoluer.",
  },
  {
    k: "1",
    title: "Un interlocuteur unique",
    text: "Une personne suit votre dossier de l'analyse au renouvellement. Elle connaît vos sites, vos contraintes et vos échéances.",
  },
  {
    k: "→",
    title: "Des démarches simplifiées",
    text: "Nous préparons la souscription et suivons le changement de fournisseur : vous vérifiez et vous signez. Le changement de fournisseur, à lui seul, n'entraîne pas de coupure.",
  },
];

export function Commitments() {
  return (
    <section className="relative border-t border-[var(--line)] py-28 md:py-36">
      <Container>
        <SectionHead index="09" label="Nos engagements" title="Un accompagnement *transparent.*" align="split" lead="Le courtage en énergie n'a pas toujours bonne presse. Nous avons choisi des règles simples, et nous les tenons." />
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
