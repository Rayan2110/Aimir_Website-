/**
 * Back-office interne — modèle du pipeline commercial (brief §19).
 *
 * Non branché pour l'instant : ce fichier fixe le vocabulaire commun entre
 * l'API de dépôt (qui crée un dossier « Facture reçue »), le futur back-office
 * et l'espace client. Voir docs/ARCHITECTURE.md.
 */

import type { DeskDocument, Energy, EnergyContract, MonthlyPoint } from "@/lib/desk/types";

export const PIPELINE_STAGES = [
  { id: "prospect", label: "Nouveau prospect" },
  { id: "facture-recue", label: "Facture reçue" },
  { id: "qualifie", label: "Dossier qualifié" },
  { id: "analyse", label: "Analyse" },
  { id: "consultation", label: "Consultation fournisseurs" },
  { id: "offres-recues", label: "Offres reçues" },
  { id: "presentation", label: "Présentation client" },
  { id: "offre-choisie", label: "Offre choisie" },
  { id: "contrat-signe", label: "Contrat signé" },
  { id: "activation", label: "Activation" },
  { id: "suivi", label: "Suivi" },
  { id: "renouvellement", label: "Renouvellement" },
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number]["id"];

export type Role = "admin" | "analyste" | "commercial" | "lecture";

export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
  /** Opposition à la prospection (RGPD) */
  noMarketing: boolean;
}

export interface SupplierOffer {
  id: string;
  supplier: string;
  energy: Energy;
  receivedAt: string;
  validUntil: string;
  structure: EnergyContract["structure"];
  durationMonths: number;
  priceEurMWh: number;
  conditions: string[];
  documentId?: string;
}

export interface InternalNote {
  id: string;
  authorId: string;
  createdAt: string;
  body: string;
}

export interface HistoryEvent {
  id: string;
  at: string;
  actorId: string | "system";
  type: "stage-change" | "document-added" | "email-sent" | "call" | "note" | "alert";
  summary: string;
}

/** Un dossier client tel que manipulé par le back-office. */
export interface Dossier {
  id: string;
  reference: string; // ex. INC-261013-K7M2Q
  stage: PipelineStage;
  ownerId: string; // interlocuteur unique
  company: { name: string; siren?: string; siret?: string; sector?: string };
  contacts: Contact[];
  siteIds: string[];
  contracts: EnergyContract[];
  consumptions: Record<string, MonthlyPoint[]>; // par site
  documents: DeskDocument[];
  offers: SupplierOffer[];
  notes: InternalNote[];
  history: HistoryEvent[];
  createdAt: string;
  updatedAt: string;
  /** Date de purge prévue si le dossier reste sans suite (politique de conservation). */
  purgeAt?: string;
}
