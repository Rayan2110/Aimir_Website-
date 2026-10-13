"use client";

import { useMemo, useState } from "react";
import { DOCUMENT_TYPE_LABEL, ENERGY_LABEL, type DeskDocument, type DocumentType, type Energy, type Site } from "@/lib/desk/types";
import { formatDateFR } from "@/lib/omega/engine";
import { cn } from "@/lib/cn";

const TYPES = Object.keys(DOCUMENT_TYPE_LABEL) as DocumentType[];
const selectCls = "h-9 rounded-[3px] border border-[var(--line)] bg-ink-900 px-2.5 text-[12.5px] text-fg outline-none focus:border-volt";

/** Centre documentaire : recherche par site, fournisseur, date, énergie et type. */
export function DocumentsCenter({ documents, sites, onOpen }: { documents: DeskDocument[]; sites: Site[]; onOpen?: (d: DeskDocument) => void }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<DocumentType | "">("");
  const [site, setSite] = useState("");
  const [supplier, setSupplier] = useState("");
  const [energy, setEnergy] = useState<Energy | "">("");
  const [year, setYear] = useState("");
  const [shown, setShown] = useState(12);

  const suppliers = useMemo(() => Array.from(new Set(documents.map((d) => d.supplier).filter(Boolean))).sort() as string[], [documents]);
  const years = useMemo(() => Array.from(new Set(documents.map((d) => d.date.slice(0, 4)))).sort().reverse(), [documents]);
  const siteName = (id: string | null) => (id ? (sites.find((s) => s.id === id)?.name ?? id) : "Tous sites");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return documents.filter(
      (d) =>
        (!type || d.type === type) &&
        (!site || d.siteId === site) &&
        (!supplier || d.supplier === supplier) &&
        (!energy || d.energy === energy) &&
        (!year || d.date.startsWith(year)) &&
        (!needle || `${d.title} ${siteName(d.siteId)} ${d.supplier ?? ""} ${d.id}`.toLowerCase().includes(needle)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents, q, type, site, supplier, energy, year]);

  const reset = () => {
    setQ("");
    setType("");
    setSite("");
    setSupplier("");
    setEnergy("");
    setYear("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Type de document">
        <Chip active={!type} onClick={() => setType("")}>
          Tous
        </Chip>
        {TYPES.map((t) => (
          <Chip key={t} active={type === t} onClick={() => setType(t)}>
            {DOCUMENT_TYPE_LABEL[t]}
          </Chip>
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr]">
        <label className="relative">
          <span className="sr-only">Rechercher</span>
          <svg viewBox="0 0 16 16" className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-3" aria-hidden>
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un document…" className={cn(selectCls, "w-full pl-8")} />
        </label>
        <select aria-label="Site" value={site} onChange={(e) => setSite(e.target.value)} className={selectCls}>
          <option value="">Tous les sites</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select aria-label="Fournisseur" value={supplier} onChange={(e) => setSupplier(e.target.value)} className={selectCls}>
          <option value="">Tous fournisseurs</option>
          {suppliers.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select aria-label="Énergie" value={energy} onChange={(e) => setEnergy(e.target.value as Energy | "")} className={selectCls}>
          <option value="">Toutes énergies</option>
          <option value="electricite">{ENERGY_LABEL.electricite}</option>
          <option value="gaz">{ENERGY_LABEL.gaz}</option>
        </select>
        <select aria-label="Année" value={year} onChange={(e) => setYear(e.target.value)} className={selectCls}>
          <option value="">Année</option>
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">
        <span className="num">
          {filtered.length} document{filtered.length > 1 ? "s" : ""}
        </span>
        <button type="button" onClick={reset} className="hover:text-fg">
          Réinitialiser
        </button>
      </div>

      <div className="thin-scrollbar mt-2 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[12.5px]">
          <thead className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
            <tr className="border-b border-[var(--line)]">
              <th className="py-2 font-normal">Date</th>
              <th className="font-normal">Document</th>
              <th className="font-normal">Type</th>
              <th className="font-normal">Site</th>
              <th className="font-normal">Fournisseur</th>
              <th className="text-right font-normal">Taille</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, shown).map((d) => (
              <tr key={d.id} className="group border-b border-[var(--line)] hover:bg-fg/[0.03]">
                <td className="num whitespace-nowrap py-2.5 pr-3 font-mono text-[11px] text-fg-3">{formatDateFR(d.date)}</td>
                <td className="pr-3">
                  <button type="button" onClick={() => onOpen?.(d)} className="flex items-center gap-2 text-left text-fg group-hover:text-volt">
                    <DocIcon type={d.type} />
                    {d.title}
                  </button>
                </td>
                <td className="pr-3 text-fg-2">{DOCUMENT_TYPE_LABEL[d.type]}</td>
                <td className="pr-3 text-fg-2">{siteName(d.siteId)}</td>
                <td className="pr-3 text-fg-2">{d.supplier ?? "—"}</td>
                <td className="num text-right font-mono text-[11px] text-fg-3">{d.sizeKb} Ko</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-fg-3">
                  Aucun document ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > shown && (
        <button type="button" onClick={() => setShown((n) => n + 12)} className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-volt hover:text-volt-2">
          Afficher plus ({filtered.length - shown})
        </button>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn("rounded-[3px] border px-2.5 py-1 text-[12px] transition-colors", active ? "border-volt/60 bg-volt/10 text-fg" : "border-[var(--line)] text-fg-2 hover:text-fg")}
    >
      {children}
    </button>
  );
}

function DocIcon({ type }: { type: DocumentType }) {
  const mark = { facture: "€", contrat: "§", proposition: "↗", etude: "≡", fournisseur: "F", historique: "∿" }[type];
  return (
    <span className="flex h-5 w-4 shrink-0 items-center justify-center rounded-[2px] border border-[var(--line-strong)] font-mono text-[9px] text-fg-3" aria-hidden>
      {mark}
    </span>
  );
}
