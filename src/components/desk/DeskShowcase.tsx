"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DeskDemo = dynamic(() => import("./DeskDemo").then((m) => m.DeskDemo), {
  ssr: false,
  loading: () => <div className="h-[820px] max-lg:h-[640px] animate-pulse rounded-[8px] border border-[var(--line)] bg-ink-900" />,
});

/** L'interface DESK, inclinée en perspective, se redresse au scroll. */
export function DeskShowcase({ initialView }: { initialView?: "overview" | "sites" | "timeline" | "documents" | "alerts" }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        inner.current,
        { rotateX: 24, scale: 0.86, y: 40, opacity: 0.4 },
        {
          rotateX: 0,
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top 95%", end: "top 20%", scrub: 0.8 },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={wrap} className="relative [perspective:1600px]">
      <div className="pointer-events-none absolute inset-x-0 -top-20 bottom-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgb(240_163_59/0.12),transparent_70%)]" />
      <div ref={inner} className="relative origin-top will-change-transform [transform-style:preserve-3d]">
        <DeskDemo initialView={initialView} />
      </div>
    </div>
  );
}
