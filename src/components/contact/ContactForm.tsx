"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { CONTACT_SUBJECTS, contactSchema, type ContactInput } from "@/lib/dossier/schema";
import { FormNotice } from "@/components/upload/FormNotice";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";

type Subject = ContactInput["subject"];
const SUBJECTS = Object.keys(CONTACT_SUBJECTS) as Subject[];

export function ContactForm() {
  const uid = useId();
  const params = useSearchParams();
  const initial = params.get("objet");
  const [v, setV] = useState({
    subject: (SUBJECTS.includes(initial as Subject) ? initial : "etude") as Subject,
    company: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
    noMarketing: false,
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { kind: "contact" as const, ...v, noMarketing: v.noMarketing ? "on" : "" };
    const res = contactSchema.safeParse(payload);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => {
        const k = String(i.path[0]);
        if (!errs[k]) errs[k] = i.message;
      });
      setErrors(errs);
      return;
    }
    setState("sending");
    const fd = new FormData();
    Object.entries(payload).forEach(([k, val]) => fd.append(k, String(val)));
    try {
      const r = await fetch("/api/dossier", { method: "POST", body: fd });
      const body = (await r.json()) as { ok?: boolean; reference?: string; error?: string };
      if (r.ok && body.ok) {
        setMsg(body.reference ?? "");
        setState("done");
      } else {
        setMsg(body.error ?? "L'envoi n'a pas abouti.");
        setState("error");
      }
    } catch {
      setMsg("Connexion interrompue.");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="panel-solid rounded-[6px] p-8" role="status">
        <p className="eyebrow !text-ok">Message envoyé</p>
        <p className="mt-4 text-[24px] tracking-tight">Merci, nous revenons vers vous rapidement.</p>
        {msg && <p className="mt-2 font-mono text-[12px] text-fg-3">Référence {msg}</p>}
      </div>
    );
  }

  const field = (k: "company" | "firstName" | "lastName" | "phone" | "email", label: string, opts: { type?: string; optional?: boolean; auto?: string; full?: boolean } = {}) => (
    <div className={opts.full ? "md:col-span-2" : undefined}>
      <label htmlFor={`${uid}-${k}`} className="mb-1.5 block text-[13px] text-fg-2">
        {label} {opts.optional && <span className="text-fg-3">(facultatif)</span>}
      </label>
      <input
        id={`${uid}-${k}`}
        name={k}
        type={opts.type ?? "text"}
        autoComplete={opts.auto}
        value={v[k]}
        onChange={(e) => set(k, e.target.value)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `${uid}-${k}-e` : undefined}
        className={cn("h-11 w-full rounded-[3px] border bg-ink-900/60 px-3 text-[15px] outline-none transition-colors", errors[k] ? "border-crit" : "border-[var(--line-strong)] focus:border-volt")}
      />
      {errors[k] && (
        <p id={`${uid}-${k}-e`} className="mt-1.5 text-[12px] text-crit">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="panel-solid rounded-[6px] p-6 md:p-8">
      <fieldset>
        <legend className="mb-3 text-[13px] text-fg-2">Objet de votre demande</legend>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <label key={s} className={cn("cursor-pointer rounded-[3px] border px-3 py-1.5 text-[13px] transition-colors", v.subject === s ? "border-volt bg-volt/10 text-fg" : "border-[var(--line-strong)] text-fg-2 hover:text-fg")}>
              <input type="radio" name="subject" value={s} checked={v.subject === s} onChange={() => set("subject", s)} className="sr-only" />
              {CONTACT_SUBJECTS[s]}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-5 text-[12px] text-fg-3">Tous les champs sont obligatoires, sauf mention « facultatif ».</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {field("company", "Entreprise", { optional: true, auto: "organization", full: true })}
        {field("firstName", "Prénom", { auto: "given-name" })}
        {field("lastName", "Nom", { auto: "family-name" })}
        {field("phone", "Téléphone", { type: "tel", auto: "tel", optional: true })}
        {field("email", "E-mail professionnel", { type: "email", auto: "email" })}
        <div className="md:col-span-2">
          <label htmlFor={`${uid}-message`} className="mb-1.5 block text-[13px] text-fg-2">
            Message
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={5}
            value={v.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={!!errors.message}
            className={cn("w-full rounded-[3px] border bg-ink-900/60 px-3 py-2.5 text-[15px] outline-none transition-colors", errors.message ? "border-crit" : "border-[var(--line-strong)] focus:border-volt")}
          />
          {errors.message && <p className="mt-1.5 text-[12px] text-crit">{errors.message}</p>}
        </div>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden />
      <label className="mt-5 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-fg-3">
        <input type="checkbox" checked={v.noMarketing} onChange={(e) => set("noMarketing", e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[var(--color-volt)]" />
        <span>Je ne souhaite pas recevoir d&apos;informations commerciales de la part de {site.name}.</span>
      </label>
      {state === "error" && (
        <p role="alert" className="mt-4 text-[13px] text-crit">
          {msg}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-6 inline-flex h-12 items-center gap-3 rounded-[3px] bg-volt px-6 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-volt-2 disabled:opacity-60"
      >
        {state === "sending" ? "Envoi…" : "Envoyer le message"}
      </button>
      <FormNotice kind="contact" />
    </form>
  );
}
