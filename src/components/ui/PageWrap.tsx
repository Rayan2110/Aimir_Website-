import { ViewTransition, type ReactNode } from "react";
import { PageReady } from "@/components/motion/RevealObserver";

/** Enveloppe de page : transition d'entrée/sortie entre les routes (React View Transitions). */
export function PageWrap({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>
        {children}
        <PageReady />
      </div>
    </ViewTransition>
  );
}
