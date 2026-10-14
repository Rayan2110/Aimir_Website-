# Présenter le site INENCO ENERGY

## 1. Lancer le site sur ton Mac

**Méthode simple** : dans le Finder, double-clique sur **`Lancer-INENCO.command`** à la racine du projet.

Une fenêtre Terminal s'ouvre. Le site se compile (environ 30 secondes), puis s'ouvre tout seul dans ton navigateur sur **http://localhost:3000**.

- Pour **arrêter** le site : ferme la fenêtre Terminal.
- La première fois, macOS peut demander une confirmation : clic droit sur le fichier → **Ouvrir** → **Ouvrir**.

**Méthode Terminal** (équivalente) :

```bash
cd ~/Aimir_Website
npm run demo
```

**Prérequis** : Node.js installé ([nodejs.org](https://nodejs.org), version LTS). Les dépendances s'installent automatiquement au premier lancement.

> En démonstration, les factures déposées sont **enregistrées sur le Mac**, dans `.data/dossiers/` (un dossier par référence `INC-…`). Aucun e-mail n'est envoyé.

## 2. Déroulé de la présentation (≈ 10 minutes)

| # | Où | Ce qu'on montre |
|---|---|---|
| 1 | **Accueil**, en haut | Le relief d'énergie qui réagit à la souris. Les 4 mots « Analyse. Consultation. Décision. Suivi. ». Le message principal. |
| 2 | **Accueil**, module « Déposez votre facture » | Glisser n'importe quel PDF → formulaire en 2 étapes → envoi → **référence de dossier**. Ouvrir ensuite `.data/dossiers/` dans le Finder pour montrer le dossier reçu. |
| 3 | **Accueil**, en descendant | Le bandeau qui accélère avec le défilement. La méthode en 4 étapes qui reste épinglée. Le simulateur avant / après (changer de profil, bouger le curseur). |
| 4 | **Accueil**, section Desk | L'interface qui se redresse en 3D au défilement. |
| 5 | **/desk** | Démo interactive : carte des 20 sites (cliquer sur Nice ou Marseille), échéancier, documents (rechercher « contrat »), **alertes OMEGA**, études, fournisseurs. Puis la **frise du contrat** qui avance au défilement. |
| 6 | **/secteurs/restaurants** | Contenu adapté au secteur et courbe de charge sur 24 h. |
| 7 | **/etudes-de-cas** | L'étude comparative type, telle que la recevra un client. |
| 8 | **/methode** → « Comprendre votre offre » | Ce qui se négocie et ce qui est réglementé. |
| 9 | **/carte/aimir** | Carte de visite numérique : cliquer pour la retourner, « Enregistrer le contact ». |
| 10 | **/carte/impression** | La planche des cartes au format VistaPrint (88 × 58 mm). Double-cliquer sur **`Cartes-de-visite.command`** pour générer les PDF à envoyer à VistaPrint. |
| 11 | Pages légales (pied de page) | Mentions, confidentialité, conditions générales, rémunération. |

**Astuce** : sur l'accueil, faire défiler lentement. Les animations sont pilotées par le défilement.

**Version mobile** : dans Chrome, `Cmd + Option + I`, puis l'icône téléphone (ou `Cmd + Shift + M`).

## 3. Les documents à présenter

| Fichier | Contenu |
|---|---|
| [`docs/CADRAGE.md`](docs/CADRAGE.md) | Réponse au §24 du brief : compréhension, arborescence, parcours, MVP / phase 2, 3 idées, risques |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Architecture technique, modèle de données, back-office, sécurité, RGPD |
| [`docs/CARTES-DE-VISITE.md`](docs/CARTES-DE-VISITE.md) | Cartes de visite et commande VistaPrint |
| [`docs/A-COMPLETER.md`](docs/A-COMPLETER.md) | Ce que les fondateurs doivent fournir avant la mise en ligne |

Sur GitHub, ces fichiers s'affichent mis en forme.

## 4. Ce qu'il faut dire (honnêtement)

- **Données** : les données du Desk, du simulateur et de l'étude-type sont **fictives**, et c'est indiqué partout.
- **Informations provisoires** : téléphones, SIRET, hébergeur, etc. Elles sont surlignées sur les pages légales (voir `docs/A-COMPLETER.md`).
- **Logo** : c'est une proposition (une onde qui se stabilise, puis un point de décision).
- **Pages légales** : elles sont rédigées, mais doivent être relues par un avocat avant la mise en ligne.

## 5. En cas de souci

| Problème | Solution |
|---|---|
| « Le port 3000 est déjà utilisé » | Le site tourne déjà : ouvre http://localhost:3000. Sinon, redémarre le Mac. |
| La compilation échoue | Lire `/tmp/inenco-build.log`. Supprimer le dossier `.next` puis relancer. |
| Le navigateur ne s'ouvre pas | Ouvrir http://localhost:3000 à la main. |
