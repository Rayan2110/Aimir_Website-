import { NextResponse, type NextRequest } from "next/server";
import { CONTACT_SUBJECTS, ENERGIES, contactSchema, invoiceSchema } from "@/lib/dossier/schema";
import { clientIp, deliver, newReference, rateLimited, readFiles, sameOrigin } from "@/lib/dossier/server";
import { LEGAL_VERSION, site } from "@/content/site";

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: NextRequest) {
  if (!sameOrigin(request.headers)) return fail(403, "Origine non autorisée.");

  const now = new Date();
  if (rateLimited(clientIp(request.headers), now.getTime())) {
    return fail(429, "Trop d'envois en peu de temps. Merci de réessayer dans quelques minutes.");
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 22 * 1024 * 1024) return fail(413, "Envoi trop volumineux (20 Mo maximum).");

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "Formulaire illisible.");
  }

  const raw = Object.fromEntries(Array.from(form.entries()).filter(([, v]) => typeof v === "string"));
  const kind = raw.kind;

  // Pot de miel rempli : on répond « OK » sans rien traiter.
  if (typeof raw.website === "string" && raw.website.length > 0) {
    return NextResponse.json({ ok: true, reference: newReference(now) });
  }

  if (kind === "facture") {
    const parsed = invoiceSchema.safeParse(raw);
    if (!parsed.success) return fail(422, parsed.error.issues[0]?.message ?? "Champs invalides.");
    const read = await readFiles(form.getAll("files"), { required: true });
    if ("error" in read) return fail(422, read.error ?? "Fichier invalide.");

    const d = parsed.data;
    const reference = newReference(now);
    const result = await deliver({
      reference,
      subject: `Nouvelle facture — ${d.company}`,
      replyTo: d.email,
      files: read.files,
      fields: [
        ["Type", "Dépôt de facture"],
        ["Reçu le", now.toLocaleString("fr-FR", { timeZone: "Europe/Paris" })],
        ["Entreprise", d.company],
        ["Contact", `${d.firstName} ${d.lastName}`],
        ["Téléphone", d.phone],
        ["E-mail", d.email],
        ["SIREN / SIRET", d.siret],
        ["Énergie", ENERGIES[d.energy]],
        ["Nombre de sites", String(d.sites)],
        ["Échéance du contrat", d.contractEnd],
        ["Fichiers", read.files.map((f) => `${f.name} (${Math.round(f.size / 1024)} Ko)`).join(", ")],
        ["Autorisation étude / transmission fournisseurs", "Oui (case cochée en ligne)"],
        ["Opposition à la prospection", d.noMarketing ? "OUI — ne pas prospecter" : "Non"],
        ["Textes acceptés", `Conditions générales et politique de confidentialité, version ${LEGAL_VERSION}`],
      ],
    });
    if (!result.ok) {
      return fail(503, `Service momentanément indisponible. Écrivez-nous à ${site.contact.email}.`);
    }
    return NextResponse.json({ ok: true, reference });
  }

  if (kind === "contact") {
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) return fail(422, parsed.error.issues[0]?.message ?? "Champs invalides.");
    const read = await readFiles(form.getAll("files"), { required: false });
    if ("error" in read) return fail(422, read.error ?? "Fichier invalide.");

    const d = parsed.data;
    const reference = newReference(now);
    const result = await deliver({
      reference,
      subject: `${CONTACT_SUBJECTS[d.subject]} — ${d.company || `${d.firstName} ${d.lastName}`}`,
      replyTo: d.email,
      files: read.files,
      fields: [
        ["Type", "Message de contact"],
        ["Reçu le", now.toLocaleString("fr-FR", { timeZone: "Europe/Paris" })],
        ["Objet", CONTACT_SUBJECTS[d.subject]],
        ["Entreprise", d.company],
        ["Contact", `${d.firstName} ${d.lastName}`],
        ["Téléphone", d.phone],
        ["E-mail", d.email],
        ["Message", d.message],
        ["Opposition à la prospection", d.noMarketing ? "OUI — ne pas prospecter" : "Non"],
        ["Information fournie", `Politique de confidentialité, version ${LEGAL_VERSION}`],
      ],
    });
    if (!result.ok) {
      return fail(503, `Service momentanément indisponible. Écrivez-nous à ${site.contact.email}.`);
    }
    return NextResponse.json({ ok: true, reference });
  }

  return fail(400, "Type de demande inconnu.");
}
