"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Paragraphe dont les mots s'allument au fil du scroll.
 * `*mot*` = mot d'accent (ambre une fois allumé).
 */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    let raf = 0;
    let lastLit = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const lit = Math.round(p * words.length);
      if (lit === lastLit) return;
      lastLit = lit;
      words.forEach((w, i) => {
        const on = i < lit;
        w.style.opacity = on ? "1" : "0.16";
        if (w.dataset.accent) w.style.color = on ? "var(--color-volt)" : "";
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <p ref={ref} className={cn(className)}>
      {parts.map((part, pi) => {
        const accent = part.startsWith("*");
        return (accent ? part.slice(1, -1) : part)
          .split(/\s+/)
          .filter(Boolean)
          .map((w, wi) => (
            <span
              key={`${pi}-${wi}`}
              data-w
              data-accent={accent ? "1" : undefined}
              className={cn("transition-[opacity,color] duration-300", accent && "serif italic")}
              style={{ opacity: 0.16 }}
            >
              {w}{" "}
            </span>
          ));
      })}
    </p>
  );
}
