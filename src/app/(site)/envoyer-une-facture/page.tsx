import type { Metadata } from "next";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { InvoiceFlow } from "@/components/upload/InvoiceFlow";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Envoyer une facture",
  description:
    "Déposez votre facture d'électricité ou de gaz (PDF ou photo) : un analyste INENCO ENERGY étudie votre contrat et consulte les fournisseurs. Sans frais facturés, sans engagement.",
  alternates: { canonical: "/envoyer-une-facture" },
};

const NEXT = [
  ["01", "Réception", "Votre facture est transmise de façon chiffrée à l'équipe INENCO. Vous recevez une référence de dossier."],
  ["02", "Prise de contact", "Un analyste vous appelle pour préciser vos besoins : sites, échéances, préférences de prix."],
  ["03", "Consultation", "Nous consultons les fournisseurs adaptés à votre profil sur une base commune."],
  ["04", "Étude", "Vous recevez une étude comparative claire. Vous décidez, sans engagement."],
];

export default function EnvoyerFacturePage() {
  return (
    <PageWrap>
      <PageHero
        eyebrow="Envoyer une facture"
        title="Déposez votre facture. *Nous nous occupons du reste.*"
        lead="Une facture récente d'électricité ou de gaz suffit pour commencer : PDF ou simple photo lisible. Le formulaire prend moins d'une minute."
        seed={0.8}
      />
      <section className="py-16 md:py-24">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <InvoiceFlow />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <p className="eyebrow mb-6">Ce qui se passe ensuite</p>
            <ol className="grid gap-0">
              {NEXT.map(([n, t, d]) => (
                <li key={n} className="border-t border-[var(--line)] py-5">
                  <span className="font-mono text-[11px] text-volt">{n}</span>
                  <p className="mt-1 text-[17px] tracking-tight">{t}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-fg-2">{d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-[4px] border border-[var(--line)] p-5 text-[13px] leading-relaxed text-fg-2">
              <p className="eyebrow mb-2">Vos documents</p>
              Transmission chiffrée, accès réservé à l&apos;équipe chargée de votre dossier, aucune revente de données. Vous pouvez masquer votre IBAN avant l&apos;envoi.
            </div>
          </aside>
        </Container>
      </section>
    </PageWrap>
  );
}
