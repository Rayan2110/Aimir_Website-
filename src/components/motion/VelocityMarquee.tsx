"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Bandeau typographique infini dont la vitesse et l'inclinaison réagissent
 * à la vélocité du scroll (Lenis). Décoratif : masqué aux lecteurs d'écran.
 */
export function VelocityMarquee({ items, className }: { items: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let skew = 0;
    let raf = 0;
    let visible = false;
    let last = performance.now();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else cancelAnimationFrame(raf);
    });
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const v = window.__lenis?.velocity ?? 0;
      const speed = 40 + Math.min(600, Math.abs(v) * 28);
      x -= speed * dt * (v < -0.5 ? -1 : 1);
      const half = el.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      skew += (Math.max(-8, Math.min(8, v * 0.6)) - skew) * 0.1;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${-skew}deg)`;
      if (visible) raf = requestAnimationFrame(loop);
    };
    io.observe(el.parentElement!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const row = (
    <>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-[4vw] pr-[4vw]">
          <span className={i % 2 ? "serif italic text-fg" : "text-transparent [-webkit-text-stroke:1px_rgb(236_234_228/0.45)]"}>{it}</span>
          <svg viewBox="0 0 24 24" className="size-[3vw] min-h-5 min-w-5 text-volt" aria-hidden>
            <path d="M2 12c2.5 0 3-7 6-7s3.5 14 6.5 14S17 9 19.5 9c1.6 0 1.6 3 2.5 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      ))}
    </>
  );

  return (
    <div className={cn("relative overflow-hidden py-8 select-none", className)} aria-hidden>
      <div ref={track} className="flex w-max whitespace-nowrap text-[clamp(3rem,9vw,9rem)] leading-none tracking-[-0.04em] will-change-transform">
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
}
