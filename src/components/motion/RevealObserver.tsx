"use client";

import { useEffect } from "react";

const READY = "inenco:page-ready";

/**
 * Observe les éléments `[data-reveal]` et leur ajoute `data-in` à l'entrée
 * dans le viewport. Les animations sont en CSS (globals.css).
 *
 * Le marquage ne commence qu'une fois la page hydratée (signal émis par
 * <PageReady />) : modifier le DOM serveur avant l'hydratation provoquerait
 * des écarts d'hydratation React.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    const scan = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));

    window.addEventListener(READY, scan);
    // La page a pu signaler qu'elle était prête avant le montage de cet observateur.
    if ((window as unknown as Record<string, boolean>).__inencoPageReady) scan();
    return () => {
      window.removeEventListener(READY, scan);
      io.disconnect();
    };
  }, []);

  return null;
}

/** À placer dans chaque page : signale la fin de l'hydratation de la page. */
export function PageReady() {
  useEffect(() => {
    (window as unknown as Record<string, boolean>).__inencoPageReady = true;
    // Laisse le temps aux composants enfants montés dans le même commit de se stabiliser.
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event(READY)));
    return () => {
      cancelAnimationFrame(id);
      (window as unknown as Record<string, boolean>).__inencoPageReady = false;
    };
  }, []);
  return null;
}
