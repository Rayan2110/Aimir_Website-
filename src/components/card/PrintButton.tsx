"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center gap-3 rounded-[3px] bg-volt px-5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-950 hover:bg-volt-2"
    >
      Imprimer / enregistrer en PDF
    </button>
  );
}
