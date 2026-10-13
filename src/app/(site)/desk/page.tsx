import type { Metadata } from "next";
import { PageWrap } from "@/components/ui/PageWrap";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHead } from "@/components/ui/Section";
import { DeskShowcase } from "@/components/desk/DeskShowcase";
import { ContractJourney } from "@/components/desk/ContractJourney";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { OMEGA_THRESHOLDS } from "@/lib/omega/engine";

export const metadata: Metadata = {
  title: "INENCO ENERGY DESK — espace client",
  description:
    "INENCO ENERGY DESK : dépenses, consommations, contrats, sites, échéances, documents et alertes réunis dans un espace client. Démonstration interactive avec données fictives.",
  alternates: { canonical: "/desk" },
};

const MODULES = [
  ["Tableau de bord", "Dépenses, consommations, contrats actifs, fournisseurs et prochaine échéance, en un coup d'œil."],
  ["Carte multi-sites", "Tous vos établissements sur une carte de France, chacun avec son statut et ses contrats."],
  ["Energy timeline", "Signature, suivi, fenêtre d'anticipation, échéance : chaque contrat situé dans son cycle."],
  ["Centre documentaire", "Factures, contrats, propositions, études, documents fournisseurs, historique. Recherche par site, fournisseur, date, énergie, type."],
  ["Centre d'alertes", "Trois niveaux (information, action recommandée, prioritaire), chacun expliqué : ce qui se passe, pourquoi c'est important, quelle action est disponible."],
  ["Études réalisées", "Chaque étude comparative archivée et consultable, avec sa date et ses hypothèses."],
];

const RULES = [
  ["Contrat bientôt à échéance", `Échéance à moins de ${OMEGA_THRESHOLDS.expiryActionDays} jours`, "Niveau 2"],
  ["Échéance très proche", `Échéance à moins de ${OMEGA_THRESHOLDS.expiryCriticalDays} jours`, "Niveau 3"],
  ["Fenêtre de renouvellement", `Échéance à moins de ${OMEGA_THRESHOLDS.renewalWindowDays} jours`, "Niveau 1"],
  ["Évolution de consommation", `Hausse ≥ ${OMEGA_THRESHOLDS.consumptionDriftPct} % sur 3 mois vs même période N-1`, "Niveau 2"],
  ["Document manquant", `Aucune facture depuis plus de ${OMEGA_THRESHOLDS.missingInvoiceDays} jours`, "Niveau 1 → 2"],
  ["Document ajouté", "Nouveau document dans le dossier", "Niveau 1"],
];

export default function DeskPage() {
  return (
    <PageWrap>
      <PageHero
        eyebrow="INENCO ENERGY DESK"
        title="L'énergie de vos sites, *sur un seul écran.*"
        lead="INENCO ENERGY DESK est l'espace client que nous préparons pour nos clients. Il ouvrira progressivement, sur invitation. Explorez dès maintenant la démonstration interactive, avec des données fictives."
        seed={9.2}
      >
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="#demo">Explorer la démo</ButtonLink>
          <ButtonLink href="/contact?objet=desk" variant="ghost" arrow={false}>
            Demander un accès
          </ButtonLink>
        </div>
      </PageHero>

      <section id="demo" className="scroll-mt-24 py-24 md:py-32">
        <Container>
          <DeskShowcase />
          <p className="mt-6 text-[12px] text-fg-3">
            Démonstration : société, sites, fournisseurs, prix et consommations sont fictifs. Les actions sont simulées. Aucune donnée n&apos;est enregistrée.
          </p>
        </Container>
      </section>

      <section className="border-t border-[var(--line)]" aria-label="Cycle d'un contrat et alertes OMEGA">
        <ContractJourney />
      </section>

      <section className="border-t border-[var(--line)] py-24 md:py-32">
        <Container>
          <SectionHead index="01" label="Modules" title="Tout ce qui fait *un contrat bien suivi.*" align="split" />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[4px] border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 xl:grid-cols-3">
            {MODULES.map(([t, d], i) => (
              <li key={t} className="bg-ink-950 p-8" data-reveal style={{ ["--d" as string]: i * 50 }}>
                <span className="font-mono text-[11px] text-volt">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[22px] tracking-tight">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-[var(--line)] py-24 md:py-32">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">
              <span className="text-volt">Ω</span> — OMEGA ENERGY
            </p>
            <h2 className="display text-[clamp(2.2rem,4.4vw,4rem)]">
              Une couche intelligente, <span className="serif italic">mais jamais opaque.</span>
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-fg-2">
              OMEGA ENERGY détecte les événements utiles à partir des données réellement disponibles dans votre dossier : échéances, factures, consommations. Chaque alerte indique la règle et la donnée qui l&apos;ont déclenchée. Aucune recommandation ne repose sur une donnée absente.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="thin-scrollbar overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-[14px]">
                <thead className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">
                  <tr className="border-b border-[var(--line)]">
                    <th className="py-3 pr-4 font-normal">Événement</th>
                    <th className="py-3 pr-4 font-normal">Règle</th>
                    <th className="py-3 font-normal">Niveau</th>
                  </tr>
                </thead>
                <tbody>
                  {RULES.map(([e, r, l]) => (
                    <tr key={e} className="border-b border-[var(--line)]" data-reveal>
                      <td className="py-4 pr-4 text-fg">{e}</td>
                      <td className="py-4 pr-4 text-fg-2">{r}</td>
                      <td className="py-4 font-mono text-[12px] text-fg-2">{l}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12px] text-fg-3">Seuils indicatifs, paramétrables par client à l&apos;ouverture de l&apos;espace.</p>
          </div>
        </Container>
      </section>

      <section className="on-paper py-24 md:py-32">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">Sécurité</p>
            <h2 className="display text-[clamp(2.2rem,4vw,3.6rem)]">Vos documents sont des données sensibles.</h2>
          </div>
          <ul className="grid gap-0 lg:col-span-6 lg:col-start-7">
            {[
              "Connexion chiffrée (HTTPS) et authentification renforcée",
              "Accès par utilisateur et par site, droits paramétrables",
              "Documents stockés chiffrés, hébergement dans l'Union européenne visé",
              "Journalisation des accès et des actions",
              "Durées de conservation définies, suppression sur demande",
              "Aucune donnée confidentielle exposée dans le navigateur",
            ].map((x, i) => (
              <li key={x} className="flex gap-4 border-t border-[var(--line)] py-4 text-[16px]" data-reveal style={{ ["--d" as string]: i * 50 }}>
                <span className="font-mono text-[11px] text-ink-text-2">{String(i + 1).padStart(2, "0")}</span>
                {x}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand title="Envie de piloter vos sites *dans le Desk ?*" lead="L'espace client ouvre progressivement à nos clients. Commencez par une étude : votre dossier y sera repris." />
    </PageWrap>
  );
}
