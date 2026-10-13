"use client";

import { useEffect, useRef } from "react";

/**
 * Curseur discret : un point + un anneau en retard qui grossit sur les éléments
 * interactifs. Un attribut `data-cursor="Déposer"` affiche un libellé.
 * Désactivé sur écrans tactiles et en mouvement réduit (CSS).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      raf = 0,
      visible = false;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        dot.current!.style.opacity = "1";
        ring.current!.style.opacity = "1";
      }
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "a, button, [role='button'], input, select, textarea, label, [data-cursor]",
      );
      const text = target?.dataset.cursor;
      ring.current!.classList.toggle("is-hover", !!target && !text);
      ring.current!.classList.toggle("has-label", !!text);
      if (text && label.current) label.current.textContent = text;
    };
    const leave = () => {
      visible = false;
      dot.current!.style.opacity = "0";
      ring.current!.style.opacity = "0";
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.current!.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot opacity-0" aria-hidden />
      <div ref={ring} className="cursor-ring opacity-0" aria-hidden>
        <span ref={label} className="cursor-label" />
      </div>
    </>
  );
}
