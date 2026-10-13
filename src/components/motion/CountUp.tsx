"use client";

import { useEffect, useRef, useState } from "react";

const fmt = (n: number, decimals: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Compteur animé à l'entrée dans le viewport (valeur finale rendue côté serveur). */
export function CountUp({
  value,
  decimals = 0,
  duration = 1600,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(fmt(value, decimals));
  const from = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = from.current ?? 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          setDisplay(fmt(start + (value - start) * eased, decimals));
          if (p < 1) raf = requestAnimationFrame(step);
          else from.current = value;
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
