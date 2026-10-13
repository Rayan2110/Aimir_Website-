"use client";

import { useEffect, useRef } from "react";

/** Fil d'énergie : progression de lecture le long du bord droit, avec une tête lumineuse (desktop). */
export function ScrollEnergyLine() {
  const fill = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.current!.style.transform = `scaleY(${p})`;
      head.current!.style.top = `${p * 100}%`;
      head.current!.style.opacity = p > 0.005 ? "1" : "0";
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

  return (
    <div className="pointer-events-none fixed bottom-6 right-3 top-[calc(var(--header-h)+48px)] z-30 hidden w-px bg-fg/[0.06] lg:block" aria-hidden>
      <div ref={fill} className="absolute inset-0 origin-top bg-gradient-to-b from-volt/0 via-volt/60 to-volt" style={{ transform: "scaleY(0)" }} />
      <div ref={head} className="absolute left-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt opacity-0 shadow-[0_0_14px_3px_rgb(240_163_59/0.7)] transition-opacity" />
    </div>
  );
}
