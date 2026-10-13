import type { AlertLevel, Portfolio, Site } from "@/lib/desk/types";
import { daysBetween } from "@/lib/omega/engine";

export const nf = (n: number, d = 0) => n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function compactEur(n: number) {
  if (n >= 1_000_000) return `${nf(n / 1_000_000, 2)} M€`;
  if (n >= 10_000) return `${nf(n / 1000, 0)} k€`;
  return `${nf(n)} €`;
}

export const MONTH_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

export function monthLabel(ym: string, withYear = true) {
  const [y, m] = ym.split("-");
  return `${MONTH_SHORT[Number(m) - 1]}${withYear ? ` ${y.slice(2)}` : ""}`;
}

/** Couleurs des niveaux d'alerte — toujours accompagnées d'une icône et d'un libellé. */
export const LEVEL_COLOR: Record<0 | AlertLevel, string> = {
  0: "var(--color-ok)",
  1: "var(--color-info)",
  2: "var(--color-warn)",
  3: "var(--color-crit)",
};

export const STATUS_LABEL: Record<0 | AlertLevel, string> = {
  0: "Sous contrôle",
  1: "Fenêtre de renouvellement",
  2: "Échéance < 120 j",
  3: "Échéance < 60 j",
};

export function last12(site: Site) {
  const pts = site.monthly.slice(-12);
  return {
    elec: pts.reduce((s, p) => s + p.elecMWh, 0),
    gas: pts.reduce((s, p) => s + p.gasMWh, 0),
  };
}

/** Dépense annuelle estimée (part énergie seule) = prix contractuel × consommation 12 mois. */
export function siteSpend(site: Site) {
  const c = last12(site);
  const el = site.contracts.find((x) => x.energy === "electricite");
  const ga = site.contracts.find((x) => x.energy === "gaz");
  return {
    elec: el ? el.priceEurMWh * c.elec : 0,
    gas: ga ? ga.priceEurMWh * c.gas : 0,
  };
}

export function portfolioTotals(p: Portfolio) {
  let elecMWh = 0,
    gasMWh = 0,
    spend = 0,
    contracts = 0;
  for (const s of p.sites) {
    const c = last12(s);
    elecMWh += c.elec;
    gasMWh += c.gas;
    const sp = siteSpend(s);
    spend += sp.elec + sp.gas;
    contracts += s.contracts.length;
  }
  const next = p.sites
    .flatMap((s) => s.contracts.map((c) => ({ s, c, days: daysBetween(p.asOf, c.end) })))
    .filter((x) => x.days >= 0)
    .sort((a, b) => a.days - b.days)[0];
  return { elecMWh, gasMWh, spend, contracts, next };
}
