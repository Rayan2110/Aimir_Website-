/**
 * Réception des dossiers (factures + contact) — côté serveur uniquement.
 *
 * Aucune API payante : l'acheminement se fait par e-mail via le serveur SMTP de
 * l'entreprise (variables d'environnement). En développement, sans SMTP, les
 * dossiers sont écrits localement dans `.data/dossiers/` (ignoré par git).
 * En production sans SMTP configuré, la réception est refusée explicitement
 * plutôt que de perdre silencieusement une facture.
 */

import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { ACCEPTED_MIME, MAX_FILE_SIZE, MAX_FILES, MAX_TOTAL_SIZE } from "./schema";

export type StoredFile = { name: string; type: string; size: number; data: Buffer };

/* ── Fichiers ──────────────────────────────────────────────────── */

/** Vérifie la signature binaire réelle du fichier (le type MIME déclaré n'est pas fiable). */
export function sniffType(buf: Buffer): (typeof ACCEPTED_MIME)[number] | null {
  if (buf.length < 12) return null;
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return "application/pdf";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP") return "image/webp";
  if (buf.subarray(4, 8).toString("latin1") === "ftyp") {
    const brand = buf.subarray(8, 12).toString("latin1");
    if (["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(brand)) return brand.startsWith("hei") || brand.startsWith("hev") ? "image/heic" : "image/heif";
  }
  return null;
}

function safeName(name: string) {
  const base = name.normalize("NFKD").replace(/[^\w.\- ]+/g, "").trim().slice(0, 80);
  return base || "document";
}

export async function readFiles(entries: FormDataEntryValue[], { required }: { required: boolean }) {
  const files = entries.filter((e): e is File => typeof e !== "string" && e.size > 0);
  if (required && files.length === 0) return { error: "Merci de joindre au moins une facture." } as const;
  if (files.length > MAX_FILES) return { error: `${MAX_FILES} fichiers maximum.` } as const;
  let total = 0;
  const out: StoredFile[] = [];
  for (const f of files) {
    if (f.size > MAX_FILE_SIZE) return { error: "Un fichier dépasse 10 Mo." } as const;
    total += f.size;
    if (total > MAX_TOTAL_SIZE) return { error: "Taille totale maximale : 20 Mo." } as const;
    const data = Buffer.from(await f.arrayBuffer());
    const type = sniffType(data);
    if (!type) return { error: "Format non reconnu. Envoyez un PDF ou une photo." } as const;
    out.push({ name: safeName(f.name), type, size: f.size, data });
  }
  return { files: out } as const;
}

/* ── Anti-abus ─────────────────────────────────────────────────── */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 6;
const hits = new Map<string, number[]>();

/** Limitation simple par IP (mémoire du processus). À remplacer par un store partagé en multi-instance. */
export function rateLimited(ip: string, now: number) {
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_HITS;
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/** Refuse les envois provenant d'une autre origine (protection CSRF basique). */
export function sameOrigin(headers: Headers) {
  const origin = headers.get("origin");
  if (!origin) return true;
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/* ── Référence de dossier ──────────────────────────────────────── */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newReference(now: Date) {
  const bytes = randomBytes(5);
  const code = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, "");
  return `INC-${ymd}-${code}`;
}

/* ── Acheminement ──────────────────────────────────────────────── */

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type DeliveryResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

function smtpConfigured() {
  return !!(process.env.SMTP_HOST && process.env.DOSSIER_INBOX);
}

export async function deliver({
  reference,
  subject,
  fields,
  files,
  replyTo,
}: {
  reference: string;
  subject: string;
  fields: [string, string][];
  files: StoredFile[];
  replyTo: string;
}): Promise<DeliveryResult> {
  if (smtpConfigured()) {
    try {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        requireTLS: process.env.SMTP_SECURE !== "true",
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      });
      const rows = fields.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0">${esc(v || "—")}</td></tr>`).join("");
      await transport.sendMail({
        from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
        to: process.env.DOSSIER_INBOX,
        replyTo,
        subject: `[${reference}] ${subject}`,
        text: fields.map(([k, v]) => `${k} : ${v || "—"}`).join("\n"),
        html: `<p style="font-family:sans-serif">Dossier <strong>${esc(reference)}</strong></p><table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
        attachments: files.map((f) => ({ filename: f.name, content: f.data, contentType: f.type })),
      });
      return { ok: true };
    } catch (err) {
      console.error(`[dossier] échec SMTP pour ${reference}:`, (err as Error).message);
      return { ok: false, reason: "failed" };
    }
  }

  if (process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), ".data", "dossiers", reference);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "dossier.json"), JSON.stringify(Object.fromEntries(fields), null, 2));
    await Promise.all(files.map((f, i) => writeFile(path.join(dir, `${i + 1}-${f.name}`), f.data)));
    console.info(`[dossier] ${reference} enregistré localement (${files.length} fichier(s)) — mode développement`);
    return { ok: true };
  }

  console.error(`[dossier] ${reference} refusé : SMTP non configuré en production`);
  return { ok: false, reason: "not-configured" };
}
