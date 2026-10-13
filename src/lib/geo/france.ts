/**
 * Contour simplifié de la France métropolitaine (lat, lon) et projection plane.
 * Précision volontairement « schématique » : la carte est rendue en trame de
 * points, ce qui suffit à positionner des établissements à l'échelle nationale.
 */

type LatLon = readonly [number, number];

const MAINLAND: LatLon[] = [
  [51.05, 2.37], [50.95, 2.6], [50.78, 3.1], [50.6, 3.3], [50.48, 3.65], [50.35, 4.05],
  [50.15, 4.2], [50.1, 4.85], [49.8, 4.95], [49.75, 5.4], [49.52, 5.8], [49.47, 6.36],
  [49.2, 6.75], [49.1, 7.4], [48.97, 8.2], [48.6, 7.8], [48.1, 7.6], [47.6, 7.55],
  [47.45, 7.0], [47.0, 6.6], [46.6, 6.1], [46.42, 6.15], [46.2, 6.05], [46.15, 6.8],
  [45.85, 7.0], [45.45, 7.15], [45.1, 6.65], [44.7, 6.95], [44.35, 6.95], [44.1, 7.65],
  [43.78, 7.5], [43.7, 7.27], [43.55, 7.02], [43.42, 6.75], [43.18, 6.6], [43.1, 6.15],
  [43.08, 5.92], [43.2, 5.5], [43.3, 5.35], [43.38, 4.95], [43.45, 4.55], [43.52, 4.15],
  [43.4, 3.65], [43.25, 3.25], [43.0, 3.05], [42.75, 3.04], [42.48, 3.15], [42.43, 2.75],
  [42.38, 2.2], [42.5, 1.75], [42.6, 1.45], [42.7, 0.7], [42.8, 0.0], [42.85, -0.6],
  [43.05, -1.0], [43.2, -1.45], [43.37, -1.78], [43.5, -1.52], [43.9, -1.38], [44.35, -1.27],
  [44.65, -1.25], [45.05, -1.18], [45.55, -1.08], [45.95, -1.12], [46.2, -1.2], [46.4, -1.6],
  [46.75, -2.05], [47.1, -2.2], [47.28, -2.25], [47.45, -2.55], [47.6, -3.1], [47.75, -3.55],
  [47.8, -4.2], [47.85, -4.4], [48.05, -4.72], [48.3, -4.55], [48.36, -4.78], [48.62, -4.6],
  [48.7, -4.0], [48.83, -3.2], [48.65, -2.75], [48.65, -2.0], [48.64, -1.55], [48.85, -1.58],
  [49.25, -1.6], [49.72, -1.94], [49.67, -1.26], [49.4, -1.15], [49.35, -0.5], [49.43, 0.15],
  [49.5, 0.1], [49.76, 0.37], [49.93, 1.08], [50.2, 1.6], [50.5, 1.58], [50.72, 1.6],
  [50.95, 1.85],
];

const CORSICA: LatLon[] = [
  [43.0, 9.42], [42.7, 9.45], [42.1, 9.55], [41.6, 9.32], [41.38, 9.2], [41.6, 8.8],
  [41.92, 8.68], [42.25, 8.58], [42.57, 8.75], [42.72, 9.1], [43.0, 9.42],
];

export const BOUNDS = { minLon: -5.2, maxLon: 9.7, minLat: 41.25, maxLat: 51.2 };
const COS_LAT = Math.cos((46.5 * Math.PI) / 180);

/** Largeur/hauteur de l'espace projeté (unités arbitraires). */
export const PROJ_W = (BOUNDS.maxLon - BOUNDS.minLon) * COS_LAT;
export const PROJ_H = BOUNDS.maxLat - BOUNDS.minLat;

/** Projette (lat, lon) dans [0..1] × [0..1]. */
export function project(lat: number, lon: number): { x: number; y: number } {
  return {
    x: ((lon - BOUNDS.minLon) * COS_LAT) / PROJ_W,
    y: (BOUNDS.maxLat - lat) / PROJ_H,
  };
}

function inside(lat: number, lon: number, poly: LatLon[]) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [yi, xi] = poly[i];
    const [yj, xj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

export function isInFrance(lat: number, lon: number) {
  return inside(lat, lon, MAINLAND) || inside(lat, lon, CORSICA);
}

/**
 * Trame de points couvrant le territoire, en coordonnées normalisées.
 * `step` est l'espacement en degrés de latitude.
 */
export function franceDotGrid(step = 0.22) {
  const dots: { x: number; y: number }[] = [];
  const lonStep = step / COS_LAT;
  for (let lat = BOUNDS.maxLat; lat >= BOUNDS.minLat; lat -= step) {
    for (let lon = BOUNDS.minLon; lon <= BOUNDS.maxLon; lon += lonStep) {
      if (isInFrance(lat, lon)) dots.push(project(lat, lon));
    }
  }
  return dots;
}

export function outlinePath(width: number, height: number) {
  const toPath = (poly: LatLon[]) =>
    poly
      .map(([lat, lon], i) => {
        const p = project(lat, lon);
        return `${i ? "L" : "M"}${(p.x * width).toFixed(1)} ${(p.y * height).toFixed(1)}`;
      })
      .join("") + "Z";
  return toPath(MAINLAND) + toPath(CORSICA);
}
