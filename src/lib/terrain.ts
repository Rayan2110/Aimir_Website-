/**
 * Champ « énergétique » de la marque : des lignes de relief façon courbes de
 * consommation / de marché. Utilisé par le canvas animé de l'accueil et par
 * les rendus SVG statiques (cartes de visite, visuels).
 */

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

/** Bruit de valeur 2D lissé, sortie dans [0, 1]. */
export function noise2(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  const u = smooth(xf);
  const v = smooth(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Hauteur du relief en (x ∈ [-1, 1], ligne z ∈ [0, 1], temps t). */
export function terrainHeight(x: number, z: number, t: number, seed = 0) {
  const envelope = Math.exp(-x * x * 3.2); // pics concentrés au centre
  const n =
    noise2(x * 3.2 + seed, z * 9 - t * 0.35) * 0.62 +
    noise2(x * 7.5 - t * 0.2 + seed, z * 17 + 3) * 0.28 +
    noise2(x * 16 + seed, z * 31 - t * 0.6) * 0.1;
  return Math.pow(Math.max(0, n - 0.3) / 0.7, 2.2) * envelope;
}

/**
 * Chemins SVG statiques des lignes de relief — pour les supports imprimés.
 * Renvoie une liste de `d` (du plus lointain au plus proche) et le polygone
 * de masquage correspondant.
 */
export function terrainPaths({
  width,
  height,
  rows = 28,
  cols = 90,
  amplitude = 0.22,
  seed = 1.7,
  t = 4.2,
}: {
  width: number;
  height: number;
  rows?: number;
  cols?: number;
  amplitude?: number;
  seed?: number;
  t?: number;
}) {
  const out: { line: string; fill: string; z: number }[] = [];
  const top = height * 0.18;
  const bottom = height * 1.02;
  for (let r = 0; r < rows; r++) {
    const z = r / (rows - 1);
    const baseY = top + (bottom - top) * Math.pow(z, 1.15);
    const spread = 0.62 + 0.5 * z;
    let d = "";
    for (let c = 0; c <= cols; c++) {
      const x = (c / cols) * 2 - 1;
      const h = terrainHeight(x, z, t, seed) * amplitude * height * (0.55 + 0.6 * z);
      const sx = width / 2 + x * (width / 2) * spread * 1.05;
      const sy = baseY - h;
      d += `${c ? "L" : "M"}${sx.toFixed(1)} ${sy.toFixed(1)}`;
    }
    const lastX = width / 2 + (width / 2) * spread * 1.05;
    const firstX = width / 2 - (width / 2) * spread * 1.05;
    out.push({
      line: d,
      fill: `${d}L${lastX.toFixed(1)} ${height + 4}L${firstX.toFixed(1)} ${height + 4}Z`,
      z,
    });
  }
  return out;
}
