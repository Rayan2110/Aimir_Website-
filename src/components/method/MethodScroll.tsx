"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";
import { METHOD_STEPS } from "@/content/method";

export function MethodScroll() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const path = line.current!;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=260%",
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          gsap.set(path, { strokeDashoffset: len * (1 - self.progress) });
          setActive(Math.min(3, Math.floor(self.progress * 4 * 0.999)));
        },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="relative lg:h-[100svh]">
      {/* Desktop : section épinglée */}
      <div className="mx-auto hidden h-full max-w-[1440px] grid-cols-12 items-center gap-8 px-[var(--gutter)] pt-[calc(var(--header-h)+32px)] lg:grid">
        <div className="col-span-5">
          <p className="eyebrow mb-8 flex items-center gap-3">
            <span className="text-volt">Méthode</span>
            <span className="h-px w-8 bg-current opacity-40" />
            <span>4 étapes, un seul interlocuteur</span>
          </p>
          <div className="relative h-[380px]">
            {METHOD_STEPS.map((s, i) => (
              <div
                key={s.n}
                aria-hidden={i !== active}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-[var(--ease-out-expo)]",
                  i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-8 opacity-0" : "translate-y-8 opacity-0",
                )}
              >
                <div className="flex items-baseline gap-5">
                  <span className="display text-[120px] text-fg/10">{s.n}</span>
                  <h3 className="display text-[64px]">{s.title}</h3>
                </div>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-fg-2">{s.text}</p>
                <ul className="mt-8 grid gap-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-[15px] text-fg-2">
                      <span className="h-px w-4 bg-volt" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-7">
          <div className="panel relative aspect-[16/11] overflow-hidden rounded-[6px]">
            {/* ligne d'énergie qui relie les étapes */}
            <svg viewBox="0 0 800 80" className="absolute inset-x-8 top-6 h-[60px] w-[calc(100%-4rem)]" preserveAspectRatio="none" aria-hidden>
              <path d="M20 40 H780" stroke="rgb(236 234 228 / 0.1)" strokeWidth="1.5" fill="none" />
              <path ref={line} d="M20 40 C120 40 140 14 200 14 S 280 66 340 40 S 440 14 480 40 S 580 66 620 40 S 720 40 780 40" stroke="var(--color-volt)" strokeWidth="2" fill="none" />
            </svg>
            <div className="absolute inset-x-8 top-6 flex h-[60px] items-center justify-between px-[1.5%]">
              {METHOD_STEPS.map((s, i) => (
                <span key={s.n} className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "relative flex size-3 items-center justify-center rounded-full border transition-all duration-500",
                      i <= active ? "border-volt bg-volt shadow-[0_0_20px_rgb(240_163_59/0.8)]" : "border-fg/30 bg-ink-950",
                    )}
                  />
                </span>
              ))}
            </div>
            <div className="absolute inset-x-8 top-[84px] flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-fg-3">
              {METHOD_STEPS.map((s, i) => (
                <span key={s.n} className={cn("transition-colors", i === active && "text-fg")}>
                  {s.n} {s.title}
                </span>
              ))}
            </div>
            <div className="absolute inset-x-8 bottom-8 top-[120px]">
              {[<VisualAnalyse key="a" />, <VisualConsultation key="c" />, <VisualComparaison key="m" />, <VisualMiseEnPlace key="p" />].map((v, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute inset-0 transition-all duration-700 ease-[var(--ease-out-expo)]",
                    i === active ? "scale-100 opacity-100 blur-0" : "pointer-events-none scale-[0.97] opacity-0 blur-sm",
                  )}
                  aria-hidden
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablette / mouvement réduit : liste verticale */}
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] py-24 lg:hidden">
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span className="text-volt">Méthode</span>
          <span className="h-px w-8 bg-current opacity-40" />
          <span>4 étapes</span>
        </p>
        <ol className="relative grid gap-12 border-l border-[var(--line-strong)] pl-6">
          {METHOD_STEPS.map((s, i) => (
            <li key={s.n} className="relative" data-reveal style={{ ["--d" as string]: i * 60 }}>
              <span className="absolute -left-[31px] top-2 size-3 rounded-full border border-volt bg-volt shadow-[0_0_16px_rgb(240_163_59/0.7)]" />
              <span className="font-mono text-[12px] text-volt">{s.n}</span>
              <h3 className="display mt-1 text-[40px]">{s.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-fg-2">{s.text}</p>
              <div className="panel mt-6 aspect-[4/3] overflow-hidden rounded-[4px] p-4" aria-hidden>
                {[<VisualAnalyse key="a" />, <VisualConsultation key="c" />, <VisualComparaison key="m" />, <VisualMiseEnPlace key="p" />][i]}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ── Visuels (illustratifs, sans chiffres) ──────────────────────── */

function VisualAnalyse() {
  const fields = [
    ["Prix de l'énergie", 38],
    ["Abonnement", 52],
    ["Acheminement", 64],
    ["Taxes & contributions", 76],
    ["Échéance", 88],
  ] as const;
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full">
      <rect x="40" y="10" width="250" height="340" rx="4" fill="var(--color-ink-800)" stroke="rgb(236 234 228 / 0.12)" />
      <rect x="62" y="34" width="90" height="10" rx="2" fill="rgb(236 234 228 / 0.3)" />
      <rect x="62" y="54" width="150" height="6" rx="2" fill="rgb(236 234 228 / 0.12)" />
      {fields.map(([, y], i) => (
        <g key={i}>
          <rect x="62" y={(y / 100) * 340} width="180" height="7" rx="2" fill="rgb(236 234 228 / 0.14)" />
          <rect x="62" y={(y / 100) * 340 - 6} width="206" height="19" rx="2" fill="rgb(240 163 59 / 0.08)" stroke="rgb(240 163 59 / 0.5)" className="animate-pulse" style={{ animationDelay: `${i * 0.25}s` }} />
        </g>
      ))}
      <rect x="40" y="10" width="250" height="24" fill="url(#scanG)" className="animate-[scan_2.6s_var(--ease-in-out-quart)_infinite]" />
      <defs>
        <linearGradient id="scanG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(240 163 59)" stopOpacity="0" />
          <stop offset="0.5" stopColor="rgb(240 163 59)" stopOpacity="0.45" />
          <stop offset="1" stopColor="rgb(240 163 59)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {fields.map(([label, y], i) => (
        <g key={label}>
          <path d={`M268 ${(y / 100) * 340 + 3} H360 L380 ${40 + i * 62}`} stroke="rgb(240 163 59 / 0.5)" fill="none" strokeDasharray="4 4" />
          <circle cx="268" cy={(y / 100) * 340 + 3} r="3" fill="var(--color-volt)" />
          <text x="392" y={44 + i * 62} fill="var(--color-fg)" fontSize="17" fontFamily="var(--font-sans)">
            {label}
          </text>
          <text x="392" y={64 + i * 62} fill="var(--color-fg-3)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="1.5">
            RELEVÉ PAR UN ANALYSTE
          </text>
        </g>
      ))}
    </svg>
  );
}

function VisualConsultation() {
  const nodes = [
    [520, 50],
    [560, 130],
    [570, 210],
    [540, 290],
    [480, 340],
  ] as const;
  return (
    <svg viewBox="0 0 640 380" className="h-full w-full">
      <g>
        <circle cx="150" cy="190" r="56" fill="var(--color-ink-800)" stroke="var(--color-volt)" strokeOpacity="0.6" />
        <circle cx="150" cy="190" r="80" fill="none" stroke="rgb(240 163 59 / 0.15)" className="origin-[150px_190px] animate-pulse-ring" />
        <text x="150" y="186" textAnchor="middle" fill="var(--color-fg)" fontSize="16" fontFamily="var(--font-sans)" letterSpacing="3">
          INENCO
        </text>
        <text x="150" y="206" textAnchor="middle" fill="var(--color-fg-3)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="2">
          CAHIER DES CHARGES
        </text>
      </g>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <path d={`M206 190 C 330 190 ${x - 140} ${y} ${x - 36} ${y}`} stroke="rgb(236 234 228 / 0.12)" fill="none" />
          <path
            d={`M206 190 C 330 190 ${x - 140} ${y} ${x - 36} ${y}`}
            stroke="var(--color-volt)"
            strokeWidth="1.6"
            fill="none"
            strokeDasharray="10 190"
            className="animate-[flow_2.2s_linear_infinite]"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
          <rect x={x - 36} y={y - 18} width="112" height="36" rx="3" fill="var(--color-ink-800)" stroke="rgb(236 234 228 / 0.16)" />
          <text x={x + 20} y={y + 5} textAnchor="middle" fill="var(--color-fg-2)" fontSize="12" fontFamily="var(--font-mono)" letterSpacing="1">
            Fournisseur {String.fromCharCode(65 + i)}
          </text>
        </g>
      ))}
    </svg>
  );
}

function VisualComparaison() {
  const rows = [
    { label: "Contrat actuel", w: 0.92, base: true },
    { label: "Proposition 1", w: 0.78 },
    { label: "Proposition 2", w: 0.71, best: true },
    { label: "Proposition 3", w: 0.84 },
  ];
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full">
      <text x="0" y="16" fill="var(--color-fg-3)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="1.5">
        BUDGET ANNUEL ESTIMÉ — ILLUSTRATION
      </text>
      {rows.map((r, i) => (
        <g key={r.label} transform={`translate(0 ${56 + i * 74})`}>
          <text x="0" y="-10" fill={r.best ? "var(--color-fg)" : "var(--color-fg-2)"} fontSize="15" fontFamily="var(--font-sans)">
            {r.label}
          </text>
          <rect x="0" y="0" width="620" height="18" rx="3" fill="rgb(236 234 228 / 0.04)" />
          <rect
            x="0"
            y="0"
            width={620 * r.w}
            height="18"
            rx="3"
            fill={r.base ? "rgb(236 234 228 / 0.28)" : r.best ? "var(--color-volt)" : "rgb(236 234 228 / 0.14)"}
            className="origin-left animate-[grow_1.4s_var(--ease-out-expo)_both]"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
          {r.best && (
            <text x={620 * r.w + 12} y="14" fill="var(--color-volt)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="1.5">
              RETENUE
            </text>
          )}
        </g>
      ))}
      <line x1={620 * 0.92} x2={620 * 0.92} y1="40" y2="340" stroke="rgb(236 234 228 / 0.3)" strokeDasharray="3 5" />
    </svg>
  );
}

function VisualMiseEnPlace() {
  const steps = ["Choix de l'offre", "Souscription", "Activation", "Suivi", "Renouvellement"];
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full">
      <line x1="40" x2="600" y1="180" y2="180" stroke="rgb(236 234 228 / 0.14)" strokeWidth="2" />
      <line x1="40" x2="420" y1="180" y2="180" stroke="var(--color-volt)" strokeWidth="2" className="[stroke-dasharray:380] [stroke-dashoffset:380] animate-[dash_2s_var(--ease-out-expo)_forwards]" />
      {steps.map((s, i) => {
        const x = 40 + i * 140;
        const done = i < 3;
        return (
          <g key={s}>
            <circle cx={x} cy="180" r={done ? 9 : 7} fill={done ? "var(--color-volt)" : "var(--color-ink-950)"} stroke={done ? "var(--color-volt)" : "rgb(236 234 228 / 0.3)"} strokeWidth="1.5" />
            {done && <path d={`M${x - 4} 180 l3 3 l5 -6`} stroke="var(--color-ink-950)" strokeWidth="1.8" fill="none" />}
            <text x={x} y={i % 2 ? 230 : 140} textAnchor="middle" fill={done ? "var(--color-fg)" : "var(--color-fg-3)"} fontSize="14" fontFamily="var(--font-sans)">
              {s}
            </text>
          </g>
        );
      })}
      <text x="40" y="320" fill="var(--color-fg-3)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="1.5">
        AUCUNE COUPURE · AUCUNE INTERVENTION SUR LE COMPTEUR
      </text>
    </svg>
  );
}
