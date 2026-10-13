/**
 * DONNÉES FICTIVES — démonstration d'INENCO ENERGY DESK.
 *
 * Société, sites, fournisseurs, prix et consommations sont inventés et générés
 * de façon déterministe (graine fixe) pour que le rendu serveur et le rendu
 * client soient identiques. Aucune donnée réelle de client n'est utilisée.
 */

import type {
  DeskDocument,
  DocumentType,
  Energy,
  EnergyContract,
  MonthlyPoint,
  Portfolio,
  PriceStructure,
  Site,
  SiteType,
} from "@/lib/desk/types";

export const DEMO_AS_OF = "2026-10-13";
export const DEMO_COMPANY = "Groupe Maison Lumen";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20261013);
const between = (min: number, max: number) => min + (max - min) * rand();
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];

const SUPPLIERS = ["Fournisseur A", "Fournisseur B", "Fournisseur C", "Fournisseur D", "Fournisseur E"] as const;

type SiteSeed = {
  id: string;
  name: string;
  city: string;
  type: SiteType;
  lat: number;
  lon: number;
  gas: boolean;
  /** Échéances imposées pour raconter la démo (sinon tirées au sort) */
  elecEnd?: string;
  gasEnd?: string;
  lastInvoice?: string;
  drift?: number;
};

const SEEDS: SiteSeed[] = [
  { id: "par-ope", name: "Paris Opéra", city: "Paris", type: "Restaurant", lat: 48.871, lon: 2.332, gas: true, elecEnd: "2027-03-18" },
  { id: "par-bas", name: "Paris Bastille", city: "Paris", type: "Restaurant", lat: 48.853, lon: 2.369, gas: true },
  { id: "par-def", name: "Siège La Défense", city: "Puteaux", type: "Bureaux", lat: 48.892, lon: 2.236, gas: false },
  { id: "lyo-pre", name: "Lyon Presqu'île", city: "Lyon", type: "Restaurant", lat: 45.764, lon: 4.836, gas: true, elecEnd: "2027-02-10" },
  { id: "lyo-pdi", name: "Lyon Part-Dieu", city: "Lyon", type: "Hôtel", lat: 45.76, lon: 4.859, gas: true },
  { id: "mar-vpo", name: "Marseille Vieux-Port", city: "Marseille", type: "Restaurant", lat: 43.295, lon: 5.374, gas: true, gasEnd: "2026-11-28" },
  { id: "bdx-cha", name: "Bordeaux Chartrons", city: "Bordeaux", type: "Restaurant", lat: 44.855, lon: -0.57, gas: true, drift: 0.19 },
  { id: "bdx-mer", name: "Bordeaux Mériadeck", city: "Bordeaux", type: "Hôtel", lat: 44.838, lon: -0.588, gas: true },
  { id: "lil-vie", name: "Lille Vieux-Lille", city: "Lille", type: "Boulangerie", lat: 50.641, lon: 3.063, gas: false },
  { id: "nan-gra", name: "Nantes Graslin", city: "Nantes", type: "Restaurant", lat: 47.213, lon: -1.562, gas: true },
  { id: "tls-cap", name: "Toulouse Capitole", city: "Toulouse", type: "Hôtel", lat: 43.604, lon: 1.444, gas: true, gasEnd: "2027-01-20" },
  { id: "nic-pro", name: "Nice Promenade", city: "Nice", type: "Hôtel", lat: 43.695, lon: 7.265, gas: true, elecEnd: "2026-12-05" },
  { id: "str-pfr", name: "Strasbourg Petite France", city: "Strasbourg", type: "Restaurant", lat: 48.581, lon: 7.743, gas: true, elecEnd: "2027-05-30" },
  { id: "ren-tha", name: "Rennes Thabor", city: "Rennes", type: "Boulangerie", lat: 48.114, lon: -1.672, gas: false, lastInvoice: "2026-06-02" },
  { id: "mtp-ant", name: "Montpellier Antigone", city: "Montpellier", type: "Restaurant", lat: 43.608, lon: 3.889, gas: false },
  { id: "gre-cen", name: "Grenoble Centre", city: "Grenoble", type: "Boulangerie", lat: 45.188, lon: 5.724, gas: true },
  { id: "dij-dar", name: "Dijon Darcy", city: "Dijon", type: "Restaurant", lat: 47.322, lon: 5.041, gas: true },
  { id: "ann-vie", name: "Annecy Vieille Ville", city: "Annecy", type: "Hôtel", lat: 45.899, lon: 6.129, gas: true },
  { id: "rou-hor", name: "Rouen Gros-Horloge", city: "Rouen", type: "Commerce", lat: 49.442, lon: 1.091, gas: false },
  { id: "bia-cdb", name: "Biarritz Côte des Basques", city: "Biarritz", type: "Hôtel", lat: 43.48, lon: -1.56, gas: true },
];

/** Consommation annuelle de base (MWh) par type de site — ordres de grandeur fictifs. */
const BASE: Record<SiteType, { elec: [number, number]; gas: [number, number] }> = {
  Restaurant: { elec: [70, 150], gas: [40, 110] },
  Hôtel: { elec: [260, 520], gas: [300, 680] },
  Boulangerie: { elec: [60, 120], gas: [30, 80] },
  Commerce: { elec: [35, 80], gas: [0, 0] },
  Bureaux: { elec: [140, 220], gas: [0, 0] },
};

const MONTHS: string[] = (() => {
  const out: string[] = [];
  for (let i = 0; i < 24; i++) {
    const d = new Date(Date.UTC(2024, 9 + i, 1)); // 2024-10 → 2026-09
    out.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return out;
})();

function addDays(iso: string, days: number) {
  const d = new Date(Date.parse(iso) + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

function monthly(seed: SiteSeed): MonthlyPoint[] {
  const b = BASE[seed.type];
  const elecYear = between(...b.elec);
  const gasYear = seed.gas ? Math.max(between(...b.gas), 25) : 0;
  const south = seed.lat < 44.5;
  return MONTHS.map((month, i) => {
    const m = Number(month.slice(5)) - 1; // 0 = janvier
    const winter = Math.cos(((m - 0.5) / 12) * Math.PI * 2); // +1 en janvier, -1 en juillet
    const summer = Math.max(0, -winter);
    const elecSeason = 1 + 0.12 * winter + (south && seed.type === "Hôtel" ? 0.35 * summer : 0);
    const gasSeason = seed.type === "Hôtel" || seed.type === "Bureaux" ? 1 + 0.75 * winter : 1 + 0.25 * winter;
    // dérive volontaire sur les 3 derniers mois pour illustrer OMEGA
    const drift = seed.drift && i >= MONTHS.length - 3 ? 1 + seed.drift : 1;
    const noise = () => 1 + (rand() - 0.5) * 0.08;
    return {
      month,
      elecMWh: Math.round(((elecYear / 12) * elecSeason * noise() * drift) * 10) / 10,
      gasMWh: seed.gas ? Math.round(((gasYear / 12) * gasSeason * noise()) * 10) / 10 : 0,
    };
  });
}

function contract(seed: SiteSeed, energy: Energy, annualMWh: number, forcedEnd?: string): EnergyContract {
  const end =
    forcedEnd ??
    addDays(DEMO_AS_OF, Math.round(between(260, 1100))); // au-delà des fenêtres d'alerte
  const durationYears = pick([1, 2, 3] as const);
  const start = addDays(end, -365 * durationYears);
  const structure: PriceStructure = pick(["Prix fixe", "Prix fixe", "Prix indexé", "Prix fixe + part indexée"] as const);
  const segment =
    energy === "electricite"
      ? annualMWh > 250
        ? "C4"
        : "C5"
      : annualMWh > 300
        ? "T3"
        : "T2";
  return {
    id: `${seed.id}-${energy === "electricite" ? "el" : "ga"}`,
    energy,
    supplier: pick(SUPPLIERS),
    status: "actif",
    start,
    end,
    structure,
    segment,
    meterRef: `${energy === "electricite" ? "PDL" : "PCE"} ••• ${String(Math.floor(between(1000, 9999)))}`,
    priceEurMWh: Math.round(energy === "electricite" ? between(118, 172) : between(46, 72)),
  };
}

const sites: Site[] = SEEDS.map((seed) => {
  const series = monthly(seed);
  const last12 = series.slice(-12);
  const elecYear = last12.reduce((s, p) => s + p.elecMWh, 0);
  const gasYear = last12.reduce((s, p) => s + p.gasMWh, 0);
  const contracts = [contract(seed, "electricite", elecYear, seed.elecEnd)];
  if (seed.gas) contracts.push(contract(seed, "gaz", gasYear, seed.gasEnd));
  const lastInvoice = seed.lastInvoice ?? addDays(DEMO_AS_OF, -Math.round(between(6, 38)));
  return {
    id: seed.id,
    name: seed.name,
    city: seed.city,
    type: seed.type,
    lat: seed.lat,
    lon: seed.lon,
    contracts,
    monthly: series,
    lastInvoice,
    lastAnalysis: addDays(DEMO_AS_OF, -Math.round(between(20, 210))),
  };
});

function documents(): DeskDocument[] {
  const docs: DeskDocument[] = [];
  let n = 0;
  const push = (d: Omit<DeskDocument, "id" | "sizeKb">) =>
    docs.push({ ...d, id: `DOC-${String(++n).padStart(4, "0")}`, sizeKb: Math.round(between(80, 900)) });

  for (const s of sites) {
    for (const c of s.contracts) {
      const label = c.energy === "electricite" ? "électricité" : "gaz";
      // 4 dernières factures mensuelles, la plus récente = lastInvoice du site
      for (let k = 0; k < 4; k++) {
        const date = addDays(s.lastInvoice, -30 * k);
        const [y, m] = date.split("-");
        push({ siteId: s.id, type: "facture", title: `Facture ${label} ${m}/${y}`, supplier: c.supplier, energy: c.energy, date });
      }
      push({ siteId: s.id, type: "contrat", title: `Contrat ${label} — ${c.structure.toLowerCase()}`, supplier: c.supplier, energy: c.energy, date: c.start });
    }
    push({ siteId: s.id, type: "etude", title: `Étude comparative — ${s.name}`, supplier: null, energy: null, date: s.lastAnalysis });
    push({ siteId: s.id, type: "historique", title: `Historique de consommation 24 mois — ${s.name}`, supplier: null, energy: null, date: addDays(s.lastAnalysis, -3) });
  }
  // Propositions en cours pour les échéances proches
  for (const id of ["mar-vpo", "nic-pro", "tls-cap"]) {
    const s = sites.find((x) => x.id === id)!;
    for (const sup of ["Fournisseur B", "Fournisseur D"]) {
      push({ siteId: s.id, type: "proposition", title: `Proposition ${sup} — ${s.name}`, supplier: sup, energy: null, date: addDays(DEMO_AS_OF, -Math.round(between(2, 9))) });
    }
  }
  for (const sup of SUPPLIERS) {
    push({ siteId: null, type: "fournisseur", title: `Conditions générales de vente — ${sup}`, supplier: sup, energy: null, date: "2026-01-15" });
  }
  return docs.sort((a, b) => b.date.localeCompare(a.date));
}

export const demoPortfolio: Portfolio = {
  company: DEMO_COMPANY,
  asOf: DEMO_AS_OF,
  sites,
  documents: documents(),
};

export const DEMO_DOC_TYPES: DocumentType[] = ["facture", "contrat", "proposition", "etude", "fournisseur", "historique"];
export const DEMO_SUPPLIERS = SUPPLIERS;
