"use client";

import { useRef, useState, type ReactNode } from "react";
import { ActionIcon, actionCls } from "./actions";

/** Carte 3D : s'incline sous le pointeur, se retourne au clic / toucher. */
export function CardTilt({ front, back }: { front: ReactNode; back: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current!.style.setProperty("--rx", `${-y * 14}deg`);
    ref.current!.style.setProperty("--ry", `${x * 18}deg`);
    ref.current!.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    ref.current!.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const reset = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="[perspective:1400px]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        onPointerMove={onMove}
        onPointerLeave={reset}
        aria-label={flipped ? "Afficher le recto de la carte" : "Retourner la carte"}
        className="block w-full"
      >
        <div
          ref={ref}
          className="relative transition-transform duration-[900ms] ease-[var(--ease-out-expo)] [transform-style:preserve-3d]"
          style={{ transform: `rotateX(var(--rx,0deg)) rotateY(calc(var(--ry,0deg) + ${flipped ? 180 : 0}deg))` }}
        >
          <div className="overflow-hidden rounded-[14px] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.08)] [backface-visibility:hidden]">
            {front}
            <span
              className="pointer-events-none absolute inset-0 rounded-[14px] opacity-60 mix-blend-overlay"
              style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,30%), rgb(255 255 255 / 0.35), transparent 45%)" }}
            />
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.9)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            {back}
          </div>
        </div>
      </button>
      <p className="mt-4 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-3">Touchez la carte pour la retourner</p>
    </div>
  );
}

export function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url, title });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* partage annulé */
    }
  };
  return (
    <button type="button" onClick={share} className={actionCls}>
      <ActionIcon d="M12 3v12M7 8l5-5 5 5M5 14v5h14v-5" />
      {copied ? "Lien copié" : "Partager"}
    </button>
  );
}
