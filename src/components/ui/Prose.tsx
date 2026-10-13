import type { ReactNode } from "react";
import { isPlaceholder } from "@/content/site";

/** Mise en forme des pages de texte (juridique, conditions…). */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-[var(--gutter)] py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12">
        <div
          className="lg:col-span-8 lg:col-start-3 [&_a]:text-volt [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:border-t [&_h2]:border-[var(--line)] [&_h2]:pt-8 [&_h2]:text-[26px] [&_h2]:tracking-tight [&_h2:first-child]:mt-0 [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-[18px] [&_h3]:tracking-tight [&_li]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-fg-2 [&_table]:mt-4 [&_table]:w-full [&_table]:text-[14px] [&_td]:border-t [&_td]:border-[var(--line)] [&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top [&_td]:text-fg-2 [&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_th]:font-mono [&_th]:text-[10.5px] [&_th]:font-normal [&_th]:uppercase [&_th]:tracking-[0.12em] [&_th]:text-fg-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-fg-2"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** Valeur société : signale visuellement une donnée à compléter avant mise en ligne. */
export function V({ children }: { children: string }) {
  if (isPlaceholder(children)) {
    return <mark className="rounded-[2px] bg-warn/15 px-1 text-warn">{children}</mark>;
  }
  return <>{children}</>;
}

export function LegalUpdated({ date }: { date: string }) {
  return <p className="!mt-0 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">Dernière mise à jour : {date}</p>;
}
