"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ACCEPTED_MIME,
  ENERGIES,
  MAX_FILE_SIZE,
  MAX_FILES,
  MAX_TOTAL_SIZE,
  formatSiret,
  invoiceSchema,
  isValidSirenOrSiret,
  normalizeSiret,
} from "@/lib/dossier/schema";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { FormNotice } from "@/components/upload/FormNotice";

type Step = "drop" | "you" | "energy" | "sending" | "done" | "error";
type Picked = { id: string; file: File; preview: string | null };
type Errors = Partial<Record<string, string>>;

const EXT_OK = /\.(pdf|jpe?g|png|webp|heic|heif)$/i;
const ease = [0.16, 1, 0.3, 1] as const;

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function fileSize(n: number) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1).replace(".", ",")} Mo` : `${Math.max(1, Math.round(n / 1024))} Ko`;
}

export function InvoiceFlow({ variant = "full", className }: { variant?: "hero" | "full"; className?: string }) {
  const compact = variant === "hero";
  const uid = useId();
  const [step, setStep] = useState<Step>("drop");
  const [files, setFiles] = useState<Picked[]>([]);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [progress, setProgress] = useState(0);
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [values, setValues] = useState({
    company: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    siret: "",
    energy: "" as "" | keyof typeof ENERGIES,
    sites: 1,
    endMonth: "",
    endYear: "",
    consent: false,
    noMarketing: false,
    website: "",
  });
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const dragDepth = useRef(0);

  // Empêche le navigateur d'ouvrir un fichier lâché à côté de la zone.
  useEffect(() => {
    const stop = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) e.preventDefault();
    };
    window.addEventListener("dragover", stop);
    window.addEventListener("drop", stop);
    return () => {
      window.removeEventListener("dragover", stop);
      window.removeEventListener("drop", stop);
    };
  }, []);

  // Libère les aperçus d'images à la fermeture.
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);
  useEffect(() => () => filesRef.current.forEach((f) => f.preview && URL.revokeObjectURL(f.preview)), []);

  // Focus sur le titre de chaque étape (lecteurs d'écran / clavier).
  useEffect(() => {
    if (step === "drop") return;
    panel.current?.querySelector<HTMLElement>("[data-step-title]")?.focus({ preventScroll: true });
  }, [step]);

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      setFileError(null);
      const incoming = Array.from(list);
      const next = [...files];
      for (const file of incoming) {
        if (next.length >= MAX_FILES) {
          setFileError(`${MAX_FILES} fichiers maximum.`);
          break;
        }
        const typeOk = (ACCEPTED_MIME as readonly string[]).includes(file.type) || EXT_OK.test(file.name);
        if (!typeOk) {
          setFileError("Format non accepté. Envoyez un PDF ou une photo (JPG, PNG, WEBP, HEIC).");
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          setFileError(`« ${file.name} » dépasse 10 Mo.`);
          continue;
        }
        if (next.reduce((s, f) => s + f.file.size, 0) + file.size > MAX_TOTAL_SIZE) {
          setFileError("Taille totale maximale : 20 Mo.");
          break;
        }
        if (next.some((f) => f.file.name === file.name && f.file.size === file.size)) continue;
        const isImg = file.type.startsWith("image/") && !/hei[cf]/i.test(file.type);
        next.push({ id: `${file.name}-${file.size}-${next.length}`, file, preview: isImg ? URL.createObjectURL(file) : null });
      }
      setFiles(next);
      if (next.length && step === "drop") setStep("you");
    },
    [files, step],
  );

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      const rest = prev.filter((x) => x.id !== id);
      if (!rest.length) setStep("drop");
      return rest;
    });
  };

  const set = <K extends keyof typeof values>(k: K, v: (typeof values)[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const payload = useMemo(
    () => ({
      kind: "facture" as const,
      company: values.company,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      email: values.email,
      siret: normalizeSiret(values.siret),
      energy: values.energy,
      sites: values.sites,
      contractEnd: values.endYear && values.endMonth ? `${values.endYear}-${values.endMonth}` : "",
      message: "",
      consent: values.consent ? "on" : "",
      noMarketing: values.noMarketing ? "on" : "",
      website: values.website,
    }),
    [values],
  );

  const validate = (fields: string[]) => {
    const res = invoiceSchema.safeParse(payload);
    if (res.success) return true;
    const errs: Errors = {};
    for (const issue of res.error.issues) {
      const k = String(issue.path[0]);
      if (fields.includes(k) && !errs[k]) errs[k] = issue.message;
    }
    if (values.endMonth && !values.endYear && fields.includes("contractEnd")) errs.contractEnd = "Précisez l'année";
    setErrors(errs);
    const firstKey = fields.find((f) => errs[f]);
    if (firstKey) panel.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
    return !firstKey;
  };

  const submit = () => {
    if (!validate(["energy", "sites", "siret", "contractEnd", "consent"])) return;
    setStep("sending");
    setProgress(0);
    setServerError(null);

    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v)));
    files.forEach((f) => fd.append("files", f.file, f.file.name));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/dossier");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(e.loaded / e.total);
    xhr.onload = () => {
      const body = xhr.response as { ok?: boolean; reference?: string; error?: string } | null;
      if (xhr.status >= 200 && xhr.status < 300 && body?.ok) {
        setProgress(1);
        setReference(body.reference ?? null);
        window.setTimeout(() => setStep("done"), 900);
      } else {
        setServerError(body?.error ?? "L'envoi n'a pas abouti.");
        setStep("error");
      }
    };
    xhr.onerror = () => {
      setServerError("Connexion interrompue.");
      setStep("error");
    };
    xhr.send(fd);
  };

  const reset = () => {
    files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    setFiles([]);
    setValues((v) => ({ ...v, siret: "", energy: "", sites: 1, endMonth: "", endYear: "" }));
    setReference(null);
    setStep("drop");
  };

  const stepIndex = { drop: 0, you: 1, energy: 2, sending: 3, done: 3, error: 3 }[step];
  const years = Array.from({ length: 6 }, (_, i) => String(2026 + i));

  return (
    <div
      ref={panel}
      className={cn(
        "relative overflow-hidden rounded-[6px] text-fg",
        compact ? "panel bg-ink-950/70" : "panel-solid",
        className,
      )}
    >
      {/* En-tête du module */}
      <div className={cn("flex items-center justify-between border-b border-[var(--line)]", compact ? "px-5 py-3.5" : "px-6 py-4 md:px-8")}>
        <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-3">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-volt" />
            <span className="relative size-2 rounded-full bg-volt" />
          </span>
          Dépôt de facture
        </div>
        <ol className="flex items-center gap-1.5" aria-label="Progression">
          {["Facture", "Vous", "Énergie", "Envoi"].map((label, i) => (
            <li key={label} className="flex items-center gap-1.5">
              <span className="sr-only">
                {label} {i < stepIndex ? "(terminé)" : i === stepIndex ? "(en cours)" : ""}
              </span>
              <span
                aria-hidden
                className={cn(
                  "h-[3px] rounded-full transition-all duration-700 ease-[var(--ease-out-expo)]",
                  i < stepIndex ? "w-5 bg-volt" : i === stepIndex ? "w-8 bg-fg" : "w-3 bg-fg/15",
                )}
              />
            </li>
          ))}
        </ol>
      </div>

      <div className={cn("relative", compact ? "p-5" : "p-6 md:p-8")} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {step === "drop" && (
            <motion.div key="drop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease }}>
              <label
                htmlFor={`${uid}-file`}
                data-cursor="Déposer"
                onDragEnter={(e) => {
                  e.preventDefault();
                  dragDepth.current++;
                  setDragging(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={() => {
                  dragDepth.current--;
                  if (dragDepth.current <= 0) setDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  dragDepth.current = 0;
                  setDragging(false);
                  if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
                }}
                className={cn(
                  "conic-border group relative flex cursor-pointer flex-col items-center justify-center rounded-[4px] border border-dashed text-center transition-all duration-500",
                  compact ? "min-h-[220px] px-5 py-8" : "min-h-[300px] px-8 py-12",
                  dragging ? "scale-[1.015] border-volt bg-volt/[0.07]" : "border-[var(--line-strong)] bg-ink-900/40 hover:bg-ink-900/70",
                )}
              >
                <DocGlyph active={dragging} />
                <span className={cn("mt-6 tracking-tight", compact ? "text-xl" : "text-2xl md:text-[28px]")}>
                  {dragging ? "Relâchez pour déposer" : "Déposez votre facture"}
                </span>
                <span className="mt-2 max-w-xs text-sm text-fg-2">
                  Glissez un PDF ou une photo ici, ou{" "}
                  <span className="text-volt underline decoration-volt/40 underline-offset-4">choisissez un fichier</span>
                </span>
                <span className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-3">PDF · JPG · PNG · HEIC — 10 Mo max</span>
                <input
                  ref={input}
                  id={`${uid}-file`}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,image/*"
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files?.length) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              {fileError && (
                <p role="alert" className="mt-3 text-sm text-crit">
                  {fileError}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12px] text-fg-3">
                <span className="flex items-center gap-2">
                  <LockIcon /> Transmission chiffrée · accès restreint à l&apos;équipe INENCO
                </span>
                <span className="w-full text-fg-3/80">Vous pouvez masquer votre IBAN avant l&apos;envoi : il ne nous est pas utile.</span>
                <Link href="/contact" className="link-u text-fg-2">
                  Pas de facture sous la main ?
                </Link>
              </div>
            </motion.div>
          )}

          {step === "you" && (
            <motion.div key="you" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.55, ease }}>
              <FileList files={files} onRemove={removeFile} onAdd={() => input.current?.click()} compact={compact} />
              <input
                ref={input}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,image/*"
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={(e) => {
                  if (e.target.files?.length) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              {fileError && <p role="alert" className="mt-2 text-sm text-crit">{fileError}</p>}
              <h3 data-step-title tabIndex={-1} className="mt-6 text-lg tracking-tight outline-none">
                Qui devons-nous recontacter ?
              </h3>
              <p className="mt-1 text-[12px] text-fg-3">Tous les champs sont obligatoires, sauf mention « facultatif ».</p>
              <div className={cn("mt-4 grid gap-3", !compact && "md:grid-cols-2")}>
                <Field id={`${uid}-company`} name="company" label="Entreprise" value={values.company} onChange={(v) => set("company", v)} error={errors.company} autoComplete="organization" className={!compact ? "md:col-span-2" : undefined} />
                <Field id={`${uid}-firstName`} name="firstName" label="Prénom" value={values.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName} autoComplete="given-name" />
                <Field id={`${uid}-lastName`} name="lastName" label="Nom" value={values.lastName} onChange={(v) => set("lastName", v)} error={errors.lastName} autoComplete="family-name" />
                <Field id={`${uid}-phone`} name="phone" label="Téléphone" type="tel" value={values.phone} onChange={(v) => set("phone", v)} error={errors.phone} autoComplete="tel" inputMode="tel" />
                <Field id={`${uid}-email`} name="email" label="E-mail professionnel" type="email" value={values.email} onChange={(v) => set("email", v)} error={errors.email} autoComplete="email" inputMode="email" />
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <button type="button" onClick={() => setStep("drop")} className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3 hover:text-fg">
                  ← Retour
                </button>
                <PrimaryAction onClick={() => validate(["company", "firstName", "lastName", "phone", "email"]) && setStep("energy")}>Continuer</PrimaryAction>
              </div>
            </motion.div>
          )}

          {step === "energy" && (
            <motion.div key="energy" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.55, ease }}>
              <h3 data-step-title tabIndex={-1} className="text-lg tracking-tight outline-none">
                Votre énergie
              </h3>
              <fieldset className="mt-4">
                <legend className="mb-2 text-[13px] text-fg-2">Type d&apos;énergie</legend>
                <div className="grid grid-cols-3 gap-2" role="radiogroup">
                  {(Object.keys(ENERGIES) as (keyof typeof ENERGIES)[]).map((k) => (
                    <label
                      key={k}
                      className={cn(
                        "flex cursor-pointer flex-col items-center gap-2 rounded-[3px] border px-2 py-3 text-center text-[13px] transition-colors",
                        values.energy === k ? "border-volt bg-volt/10 text-fg" : "border-[var(--line-strong)] text-fg-2 hover:border-fg/40",
                      )}
                    >
                      <input type="radio" name="energy" value={k} checked={values.energy === k} onChange={() => set("energy", k)} className="sr-only" />
                      <EnergyIcon kind={k} />
                      {k === "les-deux" ? "Les deux" : ENERGIES[k]}
                    </label>
                  ))}
                </div>
                {errors.energy && <p className="mt-1.5 text-[12px] text-crit">{errors.energy}</p>}
              </fieldset>

              <div className={cn("mt-4 grid gap-3", !compact && "md:grid-cols-2")}>
                <div>
                  <label htmlFor={`${uid}-sites`} className="mb-1.5 block text-[13px] text-fg-2">
                    Nombre de sites
                  </label>
                  <div className="flex h-11 items-stretch rounded-[3px] border border-[var(--line-strong)] focus-within:border-volt">
                    <button type="button" aria-label="Retirer un site" className="w-11 text-fg-2 hover:text-fg" onClick={() => set("sites", Math.max(1, values.sites - 1))}>
                      −
                    </button>
                    <input
                      id={`${uid}-sites`}
                      name="sites"
                      type="number"
                      min={1}
                      max={5000}
                      value={values.sites}
                      onChange={(e) => set("sites", Math.max(1, Number(e.target.value) || 1))}
                      className="num w-full min-w-0 bg-transparent text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button type="button" aria-label="Ajouter un site" className="w-11 text-fg-2 hover:text-fg" onClick={() => set("sites", values.sites + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <span id={`${uid}-end-label`} className="mb-1.5 block text-[13px] text-fg-2">
                    Échéance du contrat <span className="text-fg-3">(si connue)</span>
                  </span>
                  <div className="grid grid-cols-[1fr_92px] gap-2" role="group" aria-labelledby={`${uid}-end-label`}>
                    <select name="contractEnd" aria-label="Mois d'échéance" value={values.endMonth} onChange={(e) => set("endMonth", e.target.value)} className={selectCls}>
                      <option value="">Je ne sais pas</option>
                      {MONTHS.map((m, i) => (
                        <option key={m} value={String(i + 1).padStart(2, "0")}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select aria-label="Année d'échéance" value={values.endYear} onChange={(e) => set("endYear", e.target.value)} className={selectCls} disabled={!values.endMonth}>
                      <option value="">Année</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.contractEnd && <p className="mt-1.5 text-[12px] text-crit">{errors.contractEnd}</p>}
                </div>
                <div className={!compact ? "md:col-span-2" : undefined}>
                  <Field
                    id={`${uid}-siret`}
                    name="siret"
                    label="SIREN / SIRET"
                    optional
                    value={formatSiret(values.siret)}
                    onChange={(v) => set("siret", normalizeSiret(v))}
                    error={errors.siret}
                    inputMode="numeric"
                    placeholder="123 456 789 00012"
                    adornment={
                      values.siret.length === 9 || values.siret.length === 14 ? (
                        isValidSirenOrSiret(values.siret) ? (
                          <span className="text-ok" title="Numéro valide">✓</span>
                        ) : (
                          <span className="text-crit" title="Numéro invalide">✕</span>
                        )
                      ) : null
                    }
                  />
                </div>
              </div>

              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(e) => set("website", e.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden
              />

              <label className="mt-5 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-fg-2">
                <input
                  type="checkbox"
                  name="consent"
                  checked={values.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--color-volt)]"
                />
                <span>
                  J&apos;autorise {site.name} à utiliser ma facture et ces informations pour réaliser mon étude, et à transmettre aux fournisseurs consultés les seules données nécessaires à leur proposition.
                </span>
              </label>
              {errors.consent && <p className="mt-1.5 text-[12px] text-crit">{errors.consent}</p>}
              <label className="mt-3 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-fg-3">
                <input
                  type="checkbox"
                  name="noMarketing"
                  checked={values.noMarketing}
                  onChange={(e) => set("noMarketing", e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--color-volt)]"
                />
                <span>Je ne souhaite pas recevoir d&apos;informations commerciales de la part de {site.name}.</span>
              </label>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button type="button" onClick={() => setStep("you")} className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3 hover:text-fg">
                  ← Retour
                </button>
                <PrimaryAction onClick={submit}>Envoyer mon dossier</PrimaryAction>
              </div>
              <FormNotice />
            </motion.div>
          )}

          {(step === "sending" || step === "done") && (
            <motion.div key="sending" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.55, ease }}>
              <h3 data-step-title tabIndex={-1} className="text-lg tracking-tight outline-none">
                {step === "done" ? "Dossier transmis" : "Transmission de votre dossier"}
              </h3>
              <ol className="mt-5 grid gap-0">
                {[
                  { label: "Document reçu", sub: `${files.length} fichier${files.length > 1 ? "s" : ""} · ${fileSize(files.reduce((s, f) => s + f.file.size, 0))}`, done: true },
                  { label: "Format vérifié", sub: "Type et taille contrôlés", done: true },
                  { label: "Transmission chiffrée", sub: progress < 1 ? `${Math.round(progress * 100)} %` : "Terminée", done: progress >= 1, active: progress < 1 },
                  { label: "Dossier créé", sub: reference ? `Référence ${reference}` : "En attente", done: step === "done", active: progress >= 1 && step !== "done" },
                ].map((s, i) => (
                  <li key={s.label} className="relative flex gap-4 pb-5 last:pb-0">
                    {i < 3 && <span className="absolute left-[9px] top-6 h-[calc(100%-18px)] w-px bg-[var(--line-strong)]" aria-hidden />}
                    <span
                      className={cn(
                        "relative z-10 mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors duration-500",
                        s.done ? "border-volt bg-volt text-ink-950" : s.active ? "border-volt text-volt" : "border-[var(--line-strong)] text-fg-3",
                      )}
                    >
                      {s.done ? "✓" : s.active ? <span className="size-1.5 animate-pulse rounded-full bg-volt" /> : i + 1}
                    </span>
                    <span>
                      <span className={cn("block text-[15px]", s.done || s.active ? "text-fg" : "text-fg-3")}>{s.label}</span>
                      <span className="num block font-mono text-[11px] tracking-wide text-fg-3">{s.sub}</span>
                      {s.label === "Transmission chiffrée" && s.active && (
                        <span className="mt-2 block h-[2px] w-40 overflow-hidden rounded-full bg-fg/10">
                          <span className="block h-full bg-volt transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
              {step === "done" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.1 }} className="mt-6 border-t border-[var(--line)] pt-5">
                  <p className="text-[15px] leading-relaxed text-fg-2">
                    Merci. Un analyste INENCO étudie votre facture et vous recontacte rapidement pour préciser vos besoins et lancer la consultation des fournisseurs.
                  </p>
                  <p className="mt-2 text-[12px] text-fg-3">Aucune analyse automatique : votre dossier est traité par notre équipe.</p>
                  <button type="button" onClick={reset} className="link-u mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-volt">
                    Envoyer une autre facture
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === "error" && (
            <motion.div key="error" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}>
              <h3 data-step-title tabIndex={-1} className="text-lg tracking-tight text-crit outline-none">
                L&apos;envoi n&apos;a pas abouti
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-2">
                {serverError} Vos informations sont conservées dans ce formulaire : vous pouvez réessayer, ou nous écrire à{" "}
                <a className="text-fg underline" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
                .
              </p>
              <div className="mt-6 flex gap-3">
                <PrimaryAction onClick={submit}>Réessayer</PrimaryAction>
                <button type="button" onClick={() => setStep("energy")} className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3 hover:text-fg">
                  Modifier
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const selectCls =
  "h-11 w-full rounded-[3px] border border-[var(--line-strong)] bg-ink-900 px-3 text-[14px] text-fg outline-none transition-colors focus:border-volt disabled:opacity-40";

function Field({
  id,
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  optional,
  className,
  adornment,
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  optional?: boolean;
  className?: string;
  adornment?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] text-fg-2">
        {label} {optional && <span className="text-fg-3">(facultatif)</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(
            "h-11 w-full rounded-[3px] border bg-ink-900/60 px-3 text-[15px] text-fg outline-none transition-colors placeholder:text-fg-3/60",
            error ? "border-crit" : "border-[var(--line-strong)] focus:border-volt",
          )}
          {...rest}
        />
        {adornment && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">{adornment}</span>}
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[12px] text-crit">
          {error}
        </p>
      )}
    </div>
  );
}

function PrimaryAction({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex h-11 items-center gap-3 rounded-[3px] bg-volt px-5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-volt-2"
    >
      {children}
      <svg viewBox="0 0 16 12" className="h-3 w-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
        <path d="M0 6h14M9 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </button>
  );
}

function FileList({ files, onRemove, onAdd, compact }: { files: Picked[]; onRemove: (id: string) => void; onAdd: () => void; compact: boolean }) {
  return (
    <div>
      <ul className="grid gap-2">
        {files.map((f) => (
          <li key={f.id} className="relative flex items-center gap-3 overflow-hidden rounded-[3px] border border-[var(--line)] bg-ink-900/60 p-2.5 pr-3">
            <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-[2px] border border-[var(--line)] bg-ink-800">
              {f.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.preview} alt="" className="h-full w-full object-cover opacity-80" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-volt">{f.file.name.split(".").pop()?.toUpperCase()}</span>
              )}
              {/* faisceau de lecture — purement visuel */}
              <span className="absolute inset-x-0 top-0 h-[10%] bg-gradient-to-b from-transparent via-volt/70 to-transparent animate-[scan_1.6s_var(--ease-in-out-quart)_2]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px]">{f.file.name}</p>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ok">✓ Reçu · {fileSize(f.file.size)}</p>
            </div>
            <button type="button" onClick={() => onRemove(f.id)} className="p-1 text-fg-3 hover:text-crit" aria-label={`Retirer ${f.file.name}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      {files.length < MAX_FILES && (
        <button type="button" onClick={onAdd} className={cn("mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-3 hover:text-volt", compact && "text-[10px]")}>
          + Ajouter une autre facture (gaz, autre site…)
        </button>
      )}
    </div>
  );
}

function DocGlyph({ active }: { active: boolean }) {
  return (
    <span className="relative block h-[74px] w-[60px]" aria-hidden>
      <svg viewBox="0 0 60 74" className={cn("absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-expo)]", active ? "-translate-y-2 rotate-[-4deg]" : "group-hover:-translate-y-1")}>
        <path d="M1 1h40l18 18v54H1z" fill="var(--color-ink-800)" stroke="var(--line-strong)" />
        <path d="M41 1v18h18" fill="none" stroke="var(--line-strong)" />
        <path d="M10 32h30M10 40h40M10 48h22" stroke="rgb(236 234 228 / 0.22)" strokeWidth="2" />
        <path d="M10 62c4 0 5-6 8-6s4 8 7 8 4-5 7-5 3 3 6 3h12" fill="none" stroke="var(--color-volt)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="absolute inset-x-0 top-0 h-3 overflow-hidden">
        <span className="block h-full bg-gradient-to-b from-transparent via-volt/60 to-transparent opacity-0 transition-opacity group-hover:animate-[scan_1.8s_linear_infinite] group-hover:opacity-100" />
      </span>
    </span>
  );
}

function EnergyIcon({ kind }: { kind: keyof typeof ENERGIES }) {
  const bolt = <path d="M13 2L5 13h6l-1 9 8-11h-6z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />;
  const flame = (
    <path d="M12 22c-4 0-7-3-7-7 0-4 4-6 4-10 2 1 4 3 4 6 1-1 2-2 2-4 2 2 4 5 4 8 0 4-3 7-7 7z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  );
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      {kind === "electricite" ? bolt : kind === "gaz" ? flame : (
        <g transform="scale(0.8) translate(3 3)">
          {bolt}
          <g transform="translate(9 2)">{flame}</g>
        </g>
      )}
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 12 14" className="h-3.5 w-3" aria-hidden>
      <rect x="1" y="6" width="10" height="7" rx="1" fill="none" stroke="currentColor" />
      <path d="M3.5 6V4a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" />
    </svg>
  );
}
