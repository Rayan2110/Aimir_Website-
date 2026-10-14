#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  INENCO ENERGY — lancement du site en local (macOS)
#  Double-cliquez sur ce fichier : le site se compile, démarre
#  et s'ouvre dans votre navigateur sur http://localhost:3000
#  Pour arrêter : fermez cette fenêtre (ou Ctrl + C).
# ─────────────────────────────────────────────────────────────
cd "$(dirname "$0")" || exit 1
clear
echo ""
echo "  INENCO ENERGY — Analyse. Consultation. Décision. Suivi."
echo "  ───────────────────────────────────────────────────────"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "  Node.js n'est pas installé."
  echo "  Installez la version LTS depuis https://nodejs.org puis relancez ce fichier."
  read -r -p "  Appuyez sur Entrée pour fermer…" _
  exit 1
fi

PORT=3000
if lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  echo "  Le port $PORT est déjà utilisé : le site tourne peut-être déjà."
  echo "  Ouverture de http://localhost:$PORT …"
  open "http://localhost:$PORT"
  read -r -p "  Appuyez sur Entrée pour fermer…" _
  exit 0
fi

if [ ! -d node_modules ]; then
  echo "  1/3  Installation des dépendances (une seule fois, ~1 min)…"
  npm install --no-fund --no-audit || { read -r -p "  Échec de l'installation. Entrée pour fermer…" _; exit 1; }
else
  echo "  1/3  Dépendances déjà installées."
fi

echo "  2/3  Compilation du site (~30 s)…"
npx next build >/tmp/inenco-build.log 2>&1 || {
  echo "  La compilation a échoué. Détails : /tmp/inenco-build.log"
  read -r -p "  Appuyez sur Entrée pour fermer…" _
  exit 1
}

echo "  3/3  Démarrage sur http://localhost:$PORT"
echo ""
echo "  Les factures déposées en démonstration sont enregistrées dans :"
echo "  $(pwd)/.data/dossiers/"
echo ""
echo "  Pour arrêter le site : fermez cette fenêtre."
echo ""
( sleep 2; open "http://localhost:$PORT" ) &
DOSSIER_LOCAL=true PORT=$PORT npx next start
