/**
 * Modèle de données d'INENCO ENERGY DESK (espace client).
 *
 * Ces types décrivent le contrat entre le futur backend et l'interface. La
 * démonstration publique s'appuie sur les mêmes types avec des données fictives
 * (voir `src/content/demo/desk-demo.ts`).
 */

export type Energy = "electricite" | "gaz";

export const ENERGY_LABEL: Record<Energy, string> = {
  electricite: "Électricité",
  gaz: "Gaz",
};

export type SiteType = "Restaurant" | "Hôtel" | "Boulangerie" | "Commerce" | "Bureaux";

export type PriceStructure = "Prix fixe" | "Prix indexé" | "Prix fixe + part indexée";

export type ContractStatus = "actif" | "renouvellement-en-cours" | "a-souscrire";

export interface EnergyContract {
  id: string;
  energy: Energy;
  supplier: string;
  status: ContractStatus;
  /** ISO yyyy-mm-dd */
  start: string;
  /** ISO yyyy-mm-dd */
  end: string;
  structure: PriceStructure;
  /** Segment d'acheminement : C5 / C4 (électricité), T1–T4 (gaz) */
  segment: string;
  /** Identifiant de comptage masqué (PDL / PCE) */
  meterRef: string;
  /** Prix moyen de l'énergie, € HT / MWh */
  priceEurMWh: number;
}

export interface MonthlyPoint {
  /** yyyy-mm */
  month: string;
  elecMWh: number;
  gasMWh: number;
}

export interface Site {
  id: string;
  name: string;
  city: string;
  type: SiteType;
  lat: number;
  lon: number;
  contracts: EnergyContract[];
  monthly: MonthlyPoint[];
  /** Date de la dernière facture reçue (ISO) */
  lastInvoice: string;
  /** Date de la dernière analyse INENCO (ISO) */
  lastAnalysis: string;
}

export type DocumentType = "facture" | "contrat" | "proposition" | "etude" | "fournisseur" | "historique";

export const DOCUMENT_TYPE_LABEL: Record<DocumentType, string> = {
  facture: "Facture",
  contrat: "Contrat",
  proposition: "Proposition",
  etude: "Étude comparative",
  fournisseur: "Document fournisseur",
  historique: "Historique",
};

export interface DeskDocument {
  id: string;
  siteId: string | null;
  type: DocumentType;
  title: string;
  supplier: string | null;
  energy: Energy | null;
  /** ISO yyyy-mm-dd */
  date: string;
  sizeKb: number;
}

export type AlertLevel = 1 | 2 | 3;

export const ALERT_LEVEL_LABEL: Record<AlertLevel, string> = {
  1: "Information",
  2: "Action recommandée",
  3: "Prioritaire",
};

export type AlertRule = "CONTRACT_EXPIRY" | "RENEWAL_WINDOW" | "CONSUMPTION_DRIFT" | "MISSING_DOCUMENT" | "DOCUMENT_ADDED";

export interface DeskAlert {
  id: string;
  level: AlertLevel;
  rule: AlertRule;
  siteId: string;
  title: string;
  /** Ce qui se passe */
  what: string;
  /** Pourquoi c'est important */
  why: string;
  /** Action disponible */
  action: string;
  /** Donnée(s) ayant déclenché l'alerte — traçabilité */
  evidence: string;
  /** Tri secondaire : plus petit = plus urgent */
  urgency: number;
}

export interface Portfolio {
  company: string;
  /** Date de référence des données (ISO) */
  asOf: string;
  sites: Site[];
  documents: DeskDocument[];
}
