import QRCode from "qrcode";

/** QR code en SVG (vectoriel, net à l'impression). Généré au rendu serveur et mis en cache. */
export async function qrSvg(text: string, { dark = "#0b0f14", light = "#00000000" }: { dark?: string; light?: string } = {}) {
  "use cache";
  return QRCode.toString(text, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark, light } });
}
