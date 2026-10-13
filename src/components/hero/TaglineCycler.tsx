"use client";

import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const WORDS = ["Analyse.", "Consultation.", "Décision.", "Suivi."];

/** Les quatre temps d'INENCO s'allument tour à tour, soulignés par une ligne d'énergie. */
export function TaglineCycler() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % WORDS.length), 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="block">
      {WORDS.map((w, i) => (
        <Fragment key={w}>
        <span className="rise-mask mr-[0.22em]">
          <span
            style={{ ["--d" as string]: 250 + i * 110 }}
            className={cn(
              "relative transition-colors duration-700",
              i === active ? "text-fg" : "text-fg/50",
            )}
          >
            {w}
            <span
              aria-hidden
              className={cn(
                "absolute -bottom-[0.02em] left-0 h-[0.06em] w-full origin-left bg-volt transition-transform duration-[1400ms] ease-[var(--ease-out-expo)]",
                i === active ? "scale-x-100" : "scale-x-0",
              )}
            />
          </span>
        </span>
        {i === 1 && <br className="hidden sm:block" />}
        </Fragment>
      ))}
    </span>
  );
}
