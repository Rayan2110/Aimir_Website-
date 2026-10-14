"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const HIDDEN_ON = ["/envoyer-une-facture", "/contact", "/connexion"];

/** Barre d'action fixe sur mobile : apparaît après le premier écran, s'efface près du pied de page. */
export function MobileCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 900;
      setShow(y > window.innerHeight * 0.8 && !nearEnd);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-3 z-40 transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] lg:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[140%] opacity-0",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!show}
      inert={!show}
    >
      <Link
        href="/envoyer-une-facture"
        className="flex h-14 items-center justify-between rounded-[6px] border border-volt/50 bg-ink-900 px-5 shadow-[0_20px_60px_-10px_rgb(0_0_0/0.8)]"
      >
        <span className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-volt" />
            <span className="relative size-2 rounded-full bg-volt" />
          </span>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-fg">Analyser ma facture</span>
        </span>
        <svg viewBox="0 0 16 12" className="h-3 w-4 text-volt" aria-hidden>
          <path d="M0 6h14M9 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </Link>
    </div>
  );
}
