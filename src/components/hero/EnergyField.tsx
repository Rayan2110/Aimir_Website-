"use client";

import { useEffect, useRef } from "react";
import { terrainHeight } from "@/lib/terrain";
import { cn } from "@/lib/cn";

const BG = "#06080b";

type Packet = { row: number; x: number; speed: number };

/**
 * Relief énergétique animé (Canvas 2D, sans dépendance).
 * - lignes de « consommation » qui ondulent, pics concentrés au centre ;
 * - le pointeur soulève le relief localement ;
 * - au scroll, le relief se calme : de la volatilité à la décision.
 * Arrêté hors écran / onglet masqué ; image fixe en mouvement réduit.
 */
export function EnergyField({ className, calmOnScroll = true, intensity = 1 }: { className?: string; calmOnScroll?: boolean; intensity?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const host = wrap.current!;
    const ctx = el.getContext("2d", { alpha: false })!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let w = 0,
      h = 0,
      dpr = 1,
      rows = 44,
      cols = 120,
      raf = 0,
      running = false,
      t = 3.1,
      last = performance.now();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, amp: 0, target: 0 };
    let packets: Packet[] = [];
    let xs: Float32Array = new Float32Array(0);
    let ys: Float32Array = new Float32Array(0);

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? 1.5 : 1.75);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      rows = w < 700 ? 30 : 46;
      cols = w < 700 ? 64 : 128;
      xs = new Float32Array(cols + 1);
      ys = new Float32Array(cols + 1);
      packets = Array.from({ length: w < 700 ? 3 : 7 }, (_, i) => ({
        row: Math.floor(rows * (0.45 + 0.5 * ((i * 0.618) % 1))),
        x: -1 + ((i * 0.37) % 1) * 2,
        speed: 0.06 + ((i * 0.29) % 1) * 0.08,
      }));
    };

    const draw = (dt: number) => {
      t += dt * 0.55;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      pointer.amp += (pointer.target - pointer.amp) * 0.05;

      const scroll = calmOnScroll ? Math.min(1, Math.max(0, window.scrollY / (h * 0.9))) : 0;
      const calm = 1 - 0.82 * scroll;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      const top = h * 0.28;
      const bottom = h * 1.06;
      const pz = Math.pow(Math.min(1, Math.max(0, (pointer.y - top) / (bottom - top))), 1 / 1.15);
      const px = pointer.x;

      for (let r = 0; r < rows; r++) {
        const z = r / (rows - 1);
        const baseY = top + (bottom - top) * Math.pow(z, 1.15);
        const spread = 0.62 + 0.5 * z;
        const amp = h * 0.21 * (0.5 + 0.62 * z) * calm * intensity;
        const half = (w / 2) * spread * 1.06;

        for (let c = 0; c <= cols; c++) {
          const x = (c / cols) * 2 - 1;
          let hgt = terrainHeight(x, z, t);
          if (pointer.amp > 0.01) {
            const dx = x - px;
            const dz = z - pz;
            hgt += Math.exp(-(dx * dx) / 0.018 - (dz * dz) / 0.012) * 0.75 * pointer.amp;
          }
          xs[c] = w / 2 + x * half;
          ys[c] = baseY - hgt * amp;
        }

        // occlusion : on remplit sous la ligne avec le fond
        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (let c = 1; c <= cols; c++) ctx.lineTo(xs[c], ys[c]);
        ctx.lineTo(xs[cols], h + 4);
        ctx.lineTo(xs[0], h + 4);
        ctx.closePath();
        ctx.fillStyle = BG;
        ctx.fill();

        const a = (0.07 + 0.6 * Math.pow(z, 1.6)) * (0.55 + 0.45 * calm);
        const g = ctx.createLinearGradient(w / 2 - half, 0, w / 2 + half, 0);
        const center = 0.5 + (pointer.amp > 0.01 ? px * 0.5 * pointer.amp : 0);
        g.addColorStop(0, `rgba(236,234,228,0)`);
        g.addColorStop(Math.max(0.05, center - 0.32), `rgba(236,234,228,${a * 0.55})`);
        g.addColorStop(center, `rgba(240,163,59,${Math.min(1, a * 1.35)})`);
        g.addColorStop(Math.min(0.95, center + 0.32), `rgba(236,234,228,${a * 0.55})`);
        g.addColorStop(1, `rgba(236,234,228,0)`);

        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (let c = 1; c <= cols; c++) ctx.lineTo(xs[c], ys[c]);
        ctx.strokeStyle = g;
        ctx.lineWidth = z > 0.7 ? 1.15 : 1;
        ctx.stroke();

        // paquets d'énergie qui circulent sur certaines lignes
        for (const p of packets) {
          if (p.row !== r) continue;
          p.x += p.speed * dt * (0.6 + 0.4 * calm);
          if (p.x > 1.05) p.x = -1.05;
          const ci = Math.round(((p.x + 1) / 2) * cols);
          if (ci < 0 || ci > cols) continue;
          const fx = xs[ci];
          const fy = ys[ci];
          const rad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 14);
          rad.addColorStop(0, "rgba(255,191,102,0.9)");
          rad.addColorStop(0.25, "rgba(240,163,59,0.35)");
          rad.addColorStop(1, "rgba(240,163,59,0)");
          ctx.fillStyle = rad;
          ctx.fillRect(fx - 14, fy - 14, 28, 28);
          ctx.fillStyle = "#fff4e0";
          ctx.fillRect(fx - 1, fy - 1, 2, 2);
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(0);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(0);
    });
    ro.observe(host);

    let inView = false;
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(host);

    const onVis = () => (document.hidden || !inView ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const half = (r.width / 2) * 1.0;
      pointer.tx = (e.clientX - r.left - r.width / 2) / half;
      pointer.ty = e.clientY - r.top;
      pointer.target = e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0;
    };
    const onLeave = () => (pointer.target = 0);
    if (fine && !reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    // Sur écran tactile : une « onde » lente balaie le relief.
    let autoId: number | undefined;
    if (!fine && !reduced) {
      autoId = window.setInterval(() => {
        const s = performance.now() / 1000;
        pointer.tx = Math.sin(s * 0.35) * 0.6;
        pointer.ty = h * (0.62 + 0.12 * Math.sin(s * 0.21));
        pointer.target = 0.7;
      }, 50);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (autoId) window.clearInterval(autoId);
    };
  }, [calmOnScroll, intensity]);

  return (
    <div ref={wrap} className={cn("absolute inset-0", className)} aria-hidden>
      <canvas ref={canvas} className="block" />
    </div>
  );
}
