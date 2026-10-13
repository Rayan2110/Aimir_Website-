# INENCO ENERGY — site web

Site du cabinet de courtage et d'optimisation énergétique **INENCO ENERGY**.
*Analyse. Consultation. Décision. Suivi.*

- Site vitrine premium : motion design, relief énergétique animé, méthode en défilement scénarisé.
- **Dépôt de facture** : glisser-déposer, formulaire court en deux étapes, envoi chiffré, référence de dossier.
- **Démonstration d'INENCO ENERGY DESK** : carte des sites, échéancier, documents, alertes OMEGA. Toutes les données sont fictives.
- **Cartes de visite** : version numérique (`/carte/[nom]`) avec vCard et QR code, et planche d'impression (`/carte/impression`).
- Pages légales complètes : mentions légales, confidentialité, conditions générales, cookies, accessibilité, rémunération.

Documents de projet :

- [`docs/CADRAGE.md`](docs/CADRAGE.md) : réponse au §24 du brief (compréhension, arborescence, parcours, MVP / phase 2, idées, risques).
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) : architecture technique, modèle de données, back-office, sécurité et RGPD.
- [`docs/A-COMPLETER.md`](docs/A-COMPLETER.md) : informations à fournir par les fondateurs avant la mise en ligne.

## Démarrer

```bash
npm install
cp .env.example .env.local   # facultatif en local
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm start   # build de production
npm run lint
```

En développement, sans SMTP configuré, les dossiers déposés sont écrits dans `.data/dossiers/`. Ce dossier est ignoré par git.

## Stack

| Élément | Choix |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components, Turbopack), React 19.3 |
| Styles | Tailwind CSS v4, design tokens dans `src/app/globals.css` |
| Animations | Canvas 2D maison (relief énergétique), GSAP + ScrollTrigger, Lenis, Motion, View Transitions |
| Formulaires | Zod (schéma partagé client / serveur), route `POST /api/dossier` |
| E-mail | Nodemailer via le SMTP de l'entreprise : aucune API payante |
| QR codes | `qrcode`, généré côté serveur en SVG vectoriel |

Aucune API ni aucun service payant n'est activé (brief §22).

## Arborescence

```
src/
  app/
    (site)/            pages publiques (en-tête + pied de page)
    carte/             cartes de visite numériques + planche d'impression
    api/dossier/       réception des factures et messages
  components/          UI, animations, DESK, simulateur, dépôt de facture
  content/             textes, secteurs, FAQ, équipe, données de démo
  lib/
    desk/types.ts      modèle de données de l'espace client
    omega/engine.ts    règles OMEGA ENERGY (alertes explicables)
    dossier/           schéma de validation + réception serveur
    geo/, terrain.ts   carte de France, relief de marque
docs/                  cadrage, architecture, informations à compléter
```

## Mise en ligne

1. Renseigner les valeurs `TODO` de `src/content/site.ts` et `src/content/team.ts` (voir `docs/A-COMPLETER.md`).
2. Configurer les variables d'environnement (`.env.example`).
3. Faire valider les pages légales par un avocat.
4. Déployer sur un hébergeur Node.js. Un hébergement dans l'UE est recommandé pour les documents.
