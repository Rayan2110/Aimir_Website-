import { z } from "zod";

/** Algorithme de Luhn — utilisé par l'INSEE pour SIREN (9) et SIRET (14). */
export function luhnValid(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

export function normalizeSiret(value: string) {
  return value.replace(/\D/g, "");
}

/** SIREN (9 chiffres) ou SIRET (14 chiffres) valide. La Poste fait exception à Luhn sur ses SIRET. */
export function isValidSirenOrSiret(value: string) {
  const d = normalizeSiret(value);
  if (d.length !== 9 && d.length !== 14) return false;
  if (d.length === 14 && d.startsWith("356000000")) return true;
  return luhnValid(d);
}

export function formatSiret(value: string) {
  const d = normalizeSiret(value).slice(0, 14);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9), d.slice(9, 14)].filter(Boolean).join(" ");
}

export const ENERGIES = {
  electricite: "Électricité",
  gaz: "Gaz",
  "les-deux": "Électricité et gaz",
} as const;

export const ACCEPTED_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const MAX_FILES = 4;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo par fichier
export const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 Mo au total

const phone = z
  .string()
  .trim()
  .refine((v) => v.replace(/\D/g, "").length >= 9 && /^[+\d\s().-]+$/.test(v), "Numéro de téléphone invalide");

const identity = {
  firstName: z.string().trim().min(1, "Prénom requis").max(80),
  lastName: z.string().trim().min(1, "Nom requis").max(80),
  email: z.email("Adresse e-mail invalide").max(160),
  /** Opposition à la prospection commerciale (case décochée par défaut). */
  noMarketing: z
    .string()
    .optional()
    .transform((v) => v === "on"),
  /** Pot de miel anti-robots : doit rester vide. */
  website: z.string().max(0).optional().default(""),
};

export const invoiceSchema = z.object({
  kind: z.literal("facture"),
  company: z.string().trim().min(2, "Raison sociale requise").max(160),
  ...identity,
  phone,
  /** Mandat : autorisation de réaliser l'étude et de transmettre les données nécessaires aux fournisseurs. */
  consent: z.literal("on", "Cette autorisation est nécessaire pour réaliser votre étude"),
  siret: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => v === "" || isValidSirenOrSiret(v), "SIREN / SIRET invalide (9 ou 14 chiffres)"),
  energy: z.enum(["electricite", "gaz", "les-deux"], "Choisissez une énergie"),
  sites: z.coerce.number().int().min(1, "Au moins 1 site").max(5000),
  contractEnd: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => v === "" || /^\d{4}-(0[1-9]|1[0-2])$/.test(v), "Format attendu : mois/année"),
  message: z.string().trim().max(2000).optional().default(""),
});

export const contactSchema = z.object({
  kind: z.literal("contact"),
  company: z.string().trim().max(160).optional().default(""),
  ...identity,
  phone: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => v === "" || (v.replace(/\D/g, "").length >= 9 && /^[+\d\s().-]+$/.test(v)), "Numéro de téléphone invalide"),
  subject: z.enum(["etude", "multi-sites", "desk", "partenariat", "autre"]).default("autre"),
  message: z.string().trim().min(10, "Votre message est un peu court").max(4000),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export const CONTACT_SUBJECTS: Record<ContactInput["subject"], string> = {
  etude: "Demande d'étude",
  "multi-sites": "Groupe multi-sites",
  desk: "INENCO ENERGY DESK",
  partenariat: "Partenariat",
  autre: "Autre demande",
};
