#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  INENCO ENERGY — génération des cartes de visite (macOS)
#  Double-cliquez sur ce fichier : les fichiers prêts pour
#  VistaPrint (PDF recto / verso, 88 × 58 mm) sont créés puis
#  le dossier s'ouvre dans le Finder.
#  Les informations viennent de src/content/team.ts.
# ─────────────────────────────────────────────────────────────
cd "$(dirname "$0")" || exit 1
clear
echo ""
echo "  INENCO ENERGY — Cartes de visite (gabarit VistaPrint 88 × 58 mm)"
echo "  ─────────────────────────────────────────────────────────────────"
echo ""

pause_and_exit() {
  read -r -p "  Appuyez sur Entrée pour fermer…" _
  exit "${1:-1}"
}

if ! command -v node >/dev/null 2>&1; then
  echo "  Node.js n'est pas installé : https://nodejs.org (version LTS), puis relancez."
  pause_and_exit 1
fi
if [ ! -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ] && [ -z "$CHROME_PATH" ]; then
  echo "  Google Chrome est nécessaire pour produire les PDF : https://www.google.com/chrome"
  pause_and_exit 1
fi

if [ ! -d node_modules ]; then
  echo "  1/3  Installation des dépendances (une seule fois, ~1 min)…"
  npm install --no-fund --no-audit || pause_and_exit 1
fi

# Compilation et serveur dédiés : n'interfèrent pas avec un site déjà lancé sur le port 3000.
export NEXT_DIST_DIR=.next-cartes
PORT=3210

echo "  1/3  Préparation des cartes (~30 s)…"
npx next build >/tmp/inenco-cartes-build.log 2>&1 || {
  echo "  La préparation a échoué. Détails : /tmp/inenco-cartes-build.log"
  pause_and_exit 1
}

echo "  2/3  Génération des fichiers…"
npx next start -p $PORT >/tmp/inenco-cartes-server.log 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
for _ in $(seq 1 60); do
  curl -s -o /dev/null "http://localhost:$PORT/carte/impression" && break
  sleep 1
done

BASE_URL="http://localhost:$PORT" node scripts/export-cards.mjs || {
  echo "  La génération a échoué."
  pause_and_exit 1
}

echo ""
echo "  3/3  Terminé. Fichiers dans : $(pwd)/print/cartes-de-visite/"
echo ""
echo "  Pour VistaPrint : téléversez <nom>-recto.pdf et <nom>-verso.pdf"
echo "  (option « Télécharger un design complet », recto verso)."
echo "  Vérifiez le nom, le téléphone, l'e-mail et scannez le QR code sur l'aperçu."
echo ""
open "print/cartes-de-visite"
pause_and_exit 0
