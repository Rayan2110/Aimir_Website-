// Export des cartes de visite au gabarit VistaPrint France.
//   Format fini 85 × 55 mm — document 88 × 58 mm (1,5 mm de fond perdu) — zone de sécurité 82 × 52 mm.
// Produit, pour chaque membre de src/content/team.ts : <nom>-recto.pdf, <nom>-verso.pdf
// (vectoriels, polices incorporées) et leurs équivalents PNG en 300 DPI (1039 × 685 px).
//
// Prérequis : le site tourne (npm run dev ou npm start) et Google Chrome est installé.
// Usage : npm run cartes:pdf            (BASE_URL=http://localhost:3000 par défaut)
//         CHROME_PATH=/chemin/vers/chrome BASE_URL=https://… npm run cartes:pdf

import { mkdir, readFile } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME_PATH =
  process.env.CHROME_PATH ??
  (process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : process.platform === "win32"
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : "/usr/bin/google-chrome");
const OUT = new URL("../print/cartes-de-visite/", import.meta.url);

// Les identifiants des cartes sont lus dans le fichier d'équipe (champ slug).
const teamSource = await readFile(new URL("../src/content/team.ts", import.meta.url), "utf8");
const slugs = [...teamSource.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
if (!slugs.length) throw new Error("Aucun membre trouvé dans src/content/team.ts");

await mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
const page = await browser.newPage();
// 88 mm à 96 px/pouce = 332,6 px ; facteur 3,125 → 1039 px de large (300 DPI).
await page.setViewport({ width: 333, height: 220, deviceScaleFactor: 3.125 });

for (const slug of slugs) {
  for (const face of ["recto", "verso"]) {
    const url = `${BASE_URL}/carte/export/${slug}/${face}`;
    const res = await page.goto(url, { waitUntil: "networkidle0" });
    if (!res?.ok()) throw new Error(`${url} → HTTP ${res?.status()}`);
    await page.evaluateHandle("document.fonts.ready");
    // En développement, retire l'indicateur Next.js pour qu'il n'apparaisse pas dans les fichiers.
    await page.evaluate(() => document.querySelectorAll("nextjs-portal").forEach((n) => n.remove()));
    const base = new URL(`${slug}-${face}`, OUT).pathname;
    await page.pdf({ path: `${base}.pdf`, width: "88mm", height: "58mm", printBackground: true, pageRanges: "1", preferCSSPageSize: true });
    const el = await page.$("main > div");
    await el.screenshot({ path: `${base}.png`, type: "png" });
    console.log(`✓ ${slug}-${face}.pdf / .png`);
  }
}

await browser.close();
console.log(`\nFichiers dans ${OUT.pathname}`);
console.log("Rappel : vérifiez nom, téléphone, e-mail et l'adresse du QR code avant de commander.");
