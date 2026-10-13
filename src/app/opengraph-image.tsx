import { ImageResponse } from "next/og";
import { terrainPaths } from "@/lib/terrain";

export const alt = "INENCO ENERGY — Analyse. Consultation. Décision. Suivi.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const paths = terrainPaths({ width: 1200, height: 420, rows: 26, cols: 90, seed: 1.7, t: 4.2, amplitude: 0.3 });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#06080b", color: "#eceae4", position: "relative" }}>
        <svg width="1200" height="420" viewBox="0 0 1200 420" style={{ position: "absolute", bottom: 0, left: 0 }}>
          {paths.map((p, i) => (
            <g key={i}>
              <path d={p.fill} fill="#06080b" />
              <path d={p.line} fill="none" stroke={i % 5 === 0 ? "#f0a33b" : "#eceae4"} strokeOpacity={0.1 + 0.6 * p.z} strokeWidth={1.2} />
            </g>
          ))}
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "64px 72px 0" }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="3" fill="none" stroke="#eceae4" strokeOpacity="0.3" strokeWidth="1.5" />
            <path d="M4.5 16c1.6 0 2.1-6.5 4-6.5s2.4 13 4.4 13 2.2-9 3.9-9c1.4 0 1.7 2.5 3.2 2.5H24" fill="none" stroke="#eceae4" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="26.2" cy="16" r="2" fill="#f0a33b" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, letterSpacing: 8, fontWeight: 600 }}>INENCO</span>
            <span style={{ fontSize: 14, letterSpacing: 12, opacity: 0.6 }}>ENERGY</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "56px 72px 0" }}>
          <span style={{ fontSize: 76, letterSpacing: -3, lineHeight: 1 }}>Analyse. Consultation.</span>
          <span style={{ fontSize: 76, letterSpacing: -3, lineHeight: 1.05, opacity: 0.45 }}>Décision. Suivi.</span>
          <span style={{ fontSize: 24, marginTop: 28, opacity: 0.7 }}>Courtage et optimisation énergétique pour les professionnels</span>
        </div>
      </div>
    ),
    size,
  );
}
