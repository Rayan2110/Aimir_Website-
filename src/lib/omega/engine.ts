/**
 * OMEGA ENERGY — couche de détection d'événements (prototype).
 *
 * Principe (brief §9) : chaque alerte découle de règles explicites appliquées
 * à des données réellement disponibles. Aucune prédiction opaque. Chaque alerte
 * conserve la donnée qui l'a déclenchée (`evidence`) pour être vérifiable.
 *
 * Les seuils sont centralisés ici et pourront être rendus paramétrables par
 * client lorsque le backend existera.
 */

import {
  ENERGY_LABEL,
  type DeskAlert,
  type DeskDocument,
  type EnergyContract,
  type Portfolio,
  type Site,
} from "@/lib/desk/types";

export const OMEGA_THRESHOLDS = {
  /** Échéance ≤ N jours → niveau 3 (prioritaire) */
  expiryCriticalDays: 60,
  /** Échéance ≤ N jours → niveau 2 (action recommandée) */
  expiryActionDays: 120,
  /** Échéance ≤ N jours → niveau 1 (fenêtre de préparation) */
  renewalWindowDays: 240,
  /** Hausse ≥ N % sur 3 mois vs même période N-1 → niveau 2 */
  consumptionDriftPct: 15,
  /** Dernière facture plus ancienne que N jours → niveau 1 */
  missingInvoiceDays: 75,
  /** Dernière facture plus ancienne que N jours → niveau 2 */
  missingInvoiceActionDays: 120,
  /** Document ajouté depuis moins de N jours → niveau 1 */
  recentDocumentDays: 7,
} as const;

const DAY = 86_400_000;

export function daysBetween(fromIso: string, toIso: string) {
  return Math.round((Date.parse(toIso) - Date.parse(fromIso)) / DAY);
}

export function formatDateFR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function energyLower(c: EnergyContract) {
  return ENERGY_LABEL[c.energy].toLowerCase();
}

function contractRules(site: Site, asOf: string): DeskAlert[] {
  const alerts: DeskAlert[] = [];
  for (const c of site.contracts) {
    const days = daysBetween(asOf, c.end);
    if (days < 0) continue;
    const evidence = `Contrat ${c.id} · échéance ${formatDateFR(c.end)} · ${days} j`;
    const base = { siteId: site.id, evidence, urgency: days };

    if (days <= OMEGA_THRESHOLDS.expiryCriticalDays) {
      alerts.push({
        ...base,
        id: `exp3-${c.id}`,
        level: 3,
        rule: "CONTRACT_EXPIRY",
        title: "Échéance contractuelle très proche",
        what: `Le contrat ${energyLower(c)} du site ${site.name} arrive à échéance dans ${days} jours (le ${formatDateFR(c.end)}).`,
        why: "Sans décision avant l'échéance, le contrat peut être reconduit ou basculer sur une offre de continuité, souvent moins avantageuse.",
        action: "Lancer la consultation",
      });
    } else if (days <= OMEGA_THRESHOLDS.expiryActionDays) {
      alerts.push({
        ...base,
        id: `exp2-${c.id}`,
        level: 2,
        rule: "CONTRACT_EXPIRY",
        title: "Contrat bientôt à échéance",
        what: `Le contrat ${energyLower(c)} du site ${site.name} arrive à échéance dans ${days} jours.`,
        why: "C'est le bon moment pour consulter les fournisseurs et comparer les offres sans contrainte de délai.",
        action: "Préparer le renouvellement",
      });
    } else if (days <= OMEGA_THRESHOLDS.renewalWindowDays) {
      alerts.push({
        ...base,
        id: `win-${c.id}`,
        level: 1,
        rule: "RENEWAL_WINDOW",
        title: "Fenêtre de renouvellement",
        what: `La fenêtre de préparation du renouvellement du contrat ${energyLower(c)} du site ${site.name} approche.`,
        why: "Anticiper laisse le temps de choisir le moment de la consultation selon l'évolution du marché.",
        action: "Planifier l'étude",
      });
    }
  }
  return alerts;
}

function sumWindow(site: Site, key: "elecMWh" | "gasMWh", endIndex: number, length: number) {
  let s = 0;
  for (let i = endIndex - length + 1; i <= endIndex; i++) s += site.monthly[i]?.[key] ?? 0;
  return s;
}

function consumptionRules(site: Site): DeskAlert[] {
  const alerts: DeskAlert[] = [];
  const last = site.monthly.length - 1;
  if (last < 14) return alerts;
  for (const [key, energy] of [
    ["elecMWh", "electricite"],
    ["gasMWh", "gaz"],
  ] as const) {
    const recent = sumWindow(site, key, last, 3);
    const previous = sumWindow(site, key, last - 12, 3);
    if (previous <= 0) continue;
    const pct = ((recent - previous) / previous) * 100;
    if (pct >= OMEGA_THRESHOLDS.consumptionDriftPct) {
      alerts.push({
        id: `drift-${site.id}-${energy}`,
        level: 2,
        rule: "CONSUMPTION_DRIFT",
        siteId: site.id,
        title: "Évolution de consommation",
        what: `La consommation ${energy === "gaz" ? "de gaz" : "d'électricité"} du site ${site.name} présente une hausse notable (+${Math.round(pct)} %) par rapport à la même période l'an dernier.`,
        why: "Une hausse durable peut révéler un équipement défaillant, un changement d'usage ou une puissance à revoir. Elle modifie aussi le volume à présenter aux fournisseurs.",
        action: "Analyser la consommation",
        evidence: `3 derniers mois : ${recent.toFixed(1)} MWh · même période N-1 : ${previous.toFixed(1)} MWh`,
        urgency: 200 - pct,
      });
    }
  }
  return alerts;
}

function documentRules(site: Site, docs: DeskDocument[], asOf: string): DeskAlert[] {
  const alerts: DeskAlert[] = [];
  const age = daysBetween(site.lastInvoice, asOf);
  if (age > OMEGA_THRESHOLDS.missingInvoiceDays) {
    alerts.push({
      id: `doc-missing-${site.id}`,
      level: age > OMEGA_THRESHOLDS.missingInvoiceActionDays ? 2 : 1,
      rule: "MISSING_DOCUMENT",
      siteId: site.id,
      title: "Document manquant",
      what: `Une facture récente est nécessaire pour actualiser l'analyse du site ${site.name}.`,
      why: `La dernière facture reçue date du ${formatDateFR(site.lastInvoice)}. Sans données récentes, le suivi des consommations et des échéances est moins fiable.`,
      action: "Déposer une facture",
      evidence: `Dernière facture : ${formatDateFR(site.lastInvoice)} (${age} j)`,
      urgency: 300 - age,
    });
  }
  for (const d of docs) {
    if (d.siteId !== site.id) continue;
    const since = daysBetween(d.date, asOf);
    if (since >= 0 && since <= OMEGA_THRESHOLDS.recentDocumentDays) {
      alerts.push({
        id: `doc-new-${d.id}`,
        level: 1,
        rule: "DOCUMENT_ADDED",
        siteId: site.id,
        title: "Document ajouté",
        what: `${d.title} a été ajouté au dossier du site ${site.name}.`,
        why: "Votre historique est à jour. Le document est disponible dans le centre documentaire.",
        action: "Consulter le document",
        evidence: `Document ${d.id} · ${formatDateFR(d.date)}`,
        urgency: 500 + since,
      });
    }
  }
  return alerts;
}

/** Exécute l'ensemble des règles OMEGA sur un portefeuille. */
export function runOmega(portfolio: Portfolio): DeskAlert[] {
  const { sites, documents, asOf } = portfolio;
  const alerts = sites.flatMap((site) => [
    ...contractRules(site, asOf),
    ...consumptionRules(site),
    ...documentRules(site, documents, asOf),
  ]);
  return alerts.sort((a, b) => b.level - a.level || a.urgency - b.urgency);
}

/** Statut synthétique d'un site pour la cartographie. */
export function siteStatus(site: Site, asOf: string): { level: 0 | 1 | 2 | 3; nextEnd: EnergyContract | null; days: number | null } {
  const upcoming = site.contracts
    .map((c) => ({ c, days: daysBetween(asOf, c.end) }))
    .filter((x) => x.days >= 0)
    .sort((a, b) => a.days - b.days)[0];
  if (!upcoming) return { level: 0, nextEnd: null, days: null };
  const level =
    upcoming.days <= OMEGA_THRESHOLDS.expiryCriticalDays
      ? 3
      : upcoming.days <= OMEGA_THRESHOLDS.expiryActionDays
        ? 2
        : upcoming.days <= OMEGA_THRESHOLDS.renewalWindowDays
          ? 1
          : 0;
  return { level, nextEnd: upcoming.c, days: upcoming.days };
}
