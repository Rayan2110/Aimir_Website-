# INENCO ENERGY — Document de cadrage

> Réponse au §24 du brief de conception web.
> À valider par **Aimir et Seiffedine** (décision finale, §23).
> Rédigé le 13/10/2026 en même temps que la première version du site, présente dans ce dépôt.

---

## 1. Compréhension du projet

INENCO ENERGY est un **cabinet de courtage et d'optimisation énergétique pour les professionnels**. Il s'adresse aux restaurants, hôtels, commerces, boulangeries, PME, à l'industrie légère, aux syndics, aux copropriétés et aux groupes multi-sites.

Le métier se résume en une chaîne :

**Facture → Analyse → Consultation des fournisseurs → Comparaison → Choix du client → Nouveau contrat → Suivi → Renouvellement**

Le modèle économique : **aucune facture INENCO pour le client**, INENCO est rémunéré par une commission du fournisseur retenu, incluse dans le prix de l'offre. Le site le dit clairement, sans jamais afficher le montant ni les conditions (§9 du brief 1).

**Ce que le site doit accomplir** :

1. **Faire comprendre l'activité en moins de 10 secondes.** Le bandeau d'accueil affiche « Courtier en énergie · Professionnels · France », la signature « Analyse. Consultation. Décision. Suivi. » et le message principal du brief.
2. **Convertir.** Le dépôt de facture est présent dès l'écran d'accueil, dans un formulaire de deux étapes.
3. **Inspirer confiance par la forme et par les faits**, pas par des slogans. Concrètement :
   - pas de promesse d'économies ;
   - exemples marqués comme fictifs ;
   - méthodologie visible ;
   - transparence sur la rémunération.
4. **Préparer la suite.** Le site doit être conçu dès maintenant comme le socle d'une **plateforme de suivi** : INENCO ENERGY DESK, les alertes OMEGA ENERGY et le back-office. L'objectif est de transformer une analyse ponctuelle en relation de long terme.

**Direction artistique retenue** : « banque privée × terminal financier × énergie ».

- **Fond et couleur** : fond encre, une seule couleur d'accent (ambre « filament »), sections « papier » pour le rythme.
- **Typographie** : Geist pour le texte, Geist Mono pour les données, Instrument Serif en italique pour les mots-clés.
- **Signature visuelle** : un **relief énergétique animé**, des lignes de consommation qui réagissent au curseur. Il se calme au défilement, ce qui raconte le passage d'un marché volatil à une décision maîtrisée.
- **Ce qui est exclu** : photos d'illustration, cartes arrondies répétées, couleurs fluo.

---

## 2. Arborescence définitive

Toutes les pages ci-dessous sont **livrées** dans cette version, sauf mention contraire.

```
/                              Accueil (dépôt de facture dès le bandeau d'accueil)
├── /methode                   Notre méthode + « Comprendre votre offre » (#comprendre-votre-offre)
├── /electricite               Électricité (segments C5 / C4 / C3-C2, structures de prix)
├── /gaz                       Gaz naturel (profils T1 à T4)
├── /multi-sites               Groupes multi-sites (carte interactive)
├── /secteurs                  Secteurs
│   └── /secteurs/[secteur]    9 pages : restaurants, hôtels, commerces, boulangeries, PME,
│                              industrie légère, syndics, copropriétés, groupes multi-sites
├── /etudes-de-cas             Format des études + méthodologie (études réelles à venir)
├── /desk                      INENCO ENERGY DESK (démo interactive, données fictives) + OMEGA
├── /a-propos                  À propos / équipe
├── /faq                       FAQ (22 questions, dont rétractation, TRVE, ARENH, médiation)
├── /contact                   Contact (formulaire avec objet)
├── /envoyer-une-facture       Dépôt de facture
├── /connexion                 Connexion client (inactive pour l'instant, sur invitation)
├── /remuneration              Comment sommes-nous rémunérés ? (transparence)
├── /mentions-legales
├── /confidentialite           Politique de confidentialité / RGPD
├── /conditions-generales      CGU du site + conditions de service (mandat) + rétractation
├── /cookies
├── /accessibilite
└── /carte/[nom]               Cartes de visite numériques (non indexées)
    └── /carte/impression      Planche d'impression recto / verso 85 × 55 mm
```

**À venir (phase 2)** :

- `/desk/*` : espace client authentifié.
- `/interne/*` : back-office, avec accès restreint.

---

## 3. Parcours utilisateur complet

### 3.1 Prospect (cas principal)

1. **Arrivée** : par une recherche, une recommandation ou le QR code d'une carte de visite. Le bandeau d'accueil explique l'activité et propose de déposer une facture.
2. **Dépôt** : le prospect glisse un PDF ou une photo. Le fichier est contrôlé dans le navigateur (format, taille), puis un aperçu s'affiche.
3. **Étape « Vous »** : entreprise, prénom, nom, téléphone, e-mail professionnel.
4. **Étape « Énergie »** :
   - type d'énergie, nombre de sites, échéance si connue, SIREN/SIRET (facultatif, vérifié par l'algorithme de Luhn) ;
   - autorisation de traitement et de transmission aux fournisseurs consultés ;
   - case de refus de la prospection.
5. **Envoi** : progression réelle de l'envoi, contrôle de la signature binaire du fichier côté serveur, puis **référence de dossier** (ex. `INC-261013-K7M2Q`). Le message est honnête : « Aucune analyse automatique, un analyste prend le relais ».
6. **Équipe INENCO** : le dossier arrive par e-mail avec les fichiers joints, en attendant le back-office. L'équipe rappelle le prospect, qualifie le dossier et lance la consultation.
7. **Étude** : contrat actuel, propositions, écart estimé et hypothèses, au format décrit sur `/etudes-de-cas`.
8. **Choix** : l'équipe prépare la souscription. Le changement de fournisseur se fait sans coupure.
9. **Suivi** : le client a accès à INENCO ENERGY DESK (phase 2). Les alertes OMEGA déclenchent la préparation du renouvellement au bon moment.

### 3.2 Groupe multi-sites

Parcours : `/multi-sites` → démo de la carte → contact avec l'objet « Groupe multi-sites » → inventaire à partir de factures représentatives → consolidation dans le DESK → stratégie d'achat (groupée ou site par site).

### 3.3 Syndic / copropriété

Parcours : page secteur → étude préparée selon le calendrier de l'assemblée générale → présentation au conseil syndical → décision en AG → souscription.

### 3.4 Carte de visite (rencontre physique)

Parcours : la carte papier porte un QR code (ou une puce NFC) → la page `/carte/[nom]` s'ouvre. Elle permet de :

- enregistrer le contact (vCard) ;
- appeler ou écrire un e-mail ;
- envoyer une facture ;
- partager la carte ;
- afficher le QR code pour le faire scanner à quelqu'un d'autre.

---

## 4. Fonctionnalités MVP (livrées dans ce dépôt)

| # | Fonctionnalité | État |
|---|---|---|
| 1 | Site vitrine complet : 19 pages + 9 pages secteurs, responsive | ✅ |
| 2 | Bandeau d'accueil animé (relief énergétique Canvas, réaction au curseur, apaisement au défilement) | ✅ |
| 3 | Dépôt de facture : glisser-déposer / sélection / photo, formulaire en 2 étapes, progression réelle | ✅ |
| 4 | Réception serveur : validation Zod, contrôle du type réel des fichiers, anti-spam, limitation de débit, envoi SMTP | ✅ |
| 5 | « Comment ça marche » : 4 étapes, ligne d'énergie au défilement (section épinglée) | ✅ |
| 6 | Simulateur avant / après : 3 profils fictifs, curseur de consommation, hypothèses affichées | ✅ |
| 7 | « Comprendre votre offre » : décomposition interactive d'une facture | ✅ |
| 8 | Démo INENCO ENERGY DESK : vue d'ensemble, carte des sites, échéancier, documents, alertes | ✅ |
| 9 | OMEGA ENERGY : moteur de règles explicables (données → alertes avec preuve) | ✅ (prototype) |
| 10 | Pages légales : mentions, RGPD, CG (avec rétractation), cookies, accessibilité, rémunération | ✅ (validation par un avocat requise) |
| 11 | SEO technique : métadonnées, sitemap, robots, données structurées, image Open Graph | ✅ |
| 12 | Cartes de visite numériques + vCard + planche d'impression | ✅ |
| 13 | Sécurité : en-têtes HSTS / nosniff / anti-iframe, aucun traceur, polices auto-hébergées | ✅ |

---

## 5. Fonctionnalités phase 2

| Priorité | Fonctionnalité |
|---|---|
| P1 | **Stockage sécurisé des documents** dans un stockage objet UE chiffré, à la place de l'e-mail, avec antivirus à la réception |
| P1 | **Back-office** (`/interne`) : pipeline en 12 étapes, fiche dossier, notes, historique, rôles |
| P1 | **Base de données** (PostgreSQL UE) : clients, sites, PDL / PCE, contrats, documents, offres, études |
| P1 | **Espace client DESK** : authentification forte (MFA / passkeys), multi-utilisateurs, droits par site |
| P2 | **OMEGA en production** : exécution planifiée des règles, notifications e-mail, seuils paramétrables par client |
| P2 | Mandat Enedis / GRDF signé électroniquement + récupération des consommations (voir idée 1) |
| P2 | Signature électronique des mandats et propositions (prestataire qualifié eIDAS) |
| P3 | Lecture assistée des factures (OCR), **toujours validée par un analyste** |
| P3 | CRM (connecteur ou CRM intégré au back-office) |
| P3 | Application mobile : d'abord une PWA (le site est déjà installable via le manifeste) |

---

## 6. Fonctionnalités jugées inutiles ou trop coûteuses à ce stade

| Idée | Pourquoi l'écarter ou la reporter |
|---|---|
| 3D lourde (Three.js / WebGL plein écran) | Coût en performance et en batterie. L'effet « waouh » est obtenu en Canvas 2D (aucune dépendance, environ 5 Ko) et mis en pause hors écran. |
| Vidéos de fond, photos d'illustration | Contraire à la direction artistique, et pénalisant pour les Core Web Vitals. |
| IA générative qui « recommande » une offre | Risque d'allégations trompeuses, et contraire au brief (§4, §9). OMEGA reste à base de règles explicables. |
| Prix de marché en temps réel (EPEX / EEX) | Licences de données payantes. Valeur faible pour une TPE, et risque de fausse précision. |
| Google Maps / Mapbox | Coût, cookies tiers donc bandeau de consentement, transfert hors UE. La carte en trame de points est maison. |
| reCAPTCHA | Traceur soumis à consentement, transfert vers les États-Unis. Remplacé par un pot de miel et une limitation de débit. |
| Application native iOS / Android | Coût élevé. Une PWA couvre le besoin tant que le DESK n'est pas mûr. |
| Chatbot | Peu de valeur face à un interlocuteur unique, et risque de réponses inexactes. |
| API fournisseurs | Rares et soumises à accords commerciaux. La consultation reste humaine en phase 1-2. |

---

## 7. Architecture technique recommandée

Le détail figure dans [`ARCHITECTURE.md`](ARCHITECTURE.md). En résumé :

- **Aujourd'hui** : Next.js 16 (pages statiques prérendues, API Node pour les dossiers) ; e-mail SMTP de l'entreprise ; aucun service payant.
- **Cible** :
  - même application Next.js (site, `/desk`, `/interne`) ;
  - PostgreSQL et stockage objet S3 compatible hébergés dans l'UE (OVHcloud, Scaleway, Clever Cloud…), avec documents chiffrés et URL signées de courte durée ;
  - authentification avec MFA ;
  - tâche planifiée pour OMEGA ;
  - journal d'audit ;
  - sauvegardes quotidiennes.
- **Hébergement** : un hébergeur UE est préférable, en particulier pour les documents (voir les risques RGPD). Vercel convient pour le site vitrine si les documents sont stockés ailleurs. **Ce choix revient aux fondateurs.**

---

## 8. Trois idées pour différencier réellement INENCO ENERGY

### Idée 1 — Mandat numérique Enedis / GRDF et consommations réelles automatiques

Le client signe en ligne une autorisation d'accès à ses données de comptage. INENCO récupère alors l'historique et la courbe de charge, au lieu de les déduire de factures.

- **Valeur client** : ★★★★★. Études plus justes, aucun document à chercher, alertes OMEGA fondées sur des données réelles (dérive de consommation, puissance surdimensionnée).
- **Difficulté** : moyenne à élevée (habilitations, formats, gestion des consentements).
- **Coût potentiel** : faible en argent (les accès aux données sont en général gratuits ou peu coûteux), élevé en temps administratif. À valider.
- **Priorité** : haute (phase 2).

### Idée 2 — « Bilan énergie annuel » prêt pour le dirigeant ou l'AG

Chaque année, un PDF sobre par client :

- dépenses et consommations par site ;
- contrats et échéances à venir ;
- événements détectés ;
- comparaison avec l'année précédente.

Pour les syndics, il prend la forme d'un **kit AG** (étude et projet de résolution).

- **Valeur client** : ★★★★☆. Un livrable concret qui justifie la relation dans la durée et que l'on partage en interne, ce qui en fait aussi un vecteur de recommandation.
- **Difficulté** : faible à moyenne (génération de PDF à partir des données du DESK).
- **Coût potentiel** : quasi nul.
- **Priorité** : moyenne à haute (dès que le DESK a des données).

### Idée 3 — Repères sectoriels anonymisés

Exemple : « Votre restaurant consomme X MWh par an pour Y m² ; la médiane des restaurants suivis par INENCO est Z. » Les repères ne sont calculés qu'à partir d'un échantillon suffisant et sur données agrégées.

- **Valeur client** : ★★★★☆. Un client ne sait jamais s'il « consomme trop ». Cette information est rare et différenciante.
- **Difficulté** : moyenne (volume de données, anonymisation, méthodologie publiée).
- **Coût potentiel** : faible.
- **Priorité** : phase 3, une fois le volume de dossiers suffisant. Le brief impose de ne pas inventer de chiffres (§15).

*Déjà livré, et différenciant dès aujourd'hui* : la **carte de visite numérique**, reliée au dépôt de facture (QR / NFC → carte → facture).

---

## 9. Améliorations UX proposées et implémentées

| Amélioration | Détail |
|---|---|
| Dépôt dès l'écran d'accueil | Le premier écran sert à convertir. |
| Formulaire en 2 étapes | Chaque écran reste court. Seul le SIRET est facultatif. Le reste est complété par téléphone (§5). |
| Validation en direct | SIRET vérifié par Luhn avec formatage automatique, erreurs liées aux champs, focus géré. |
| Envoi honnête | Les étapes affichées sont réelles (reçu, vérifié, transmis, dossier créé), sans fausse « analyse IA ». |
| Référence de dossier | Facilite le suivi et le rappel. |
| « Pas de facture sous la main ? » | Renvoie au contact. |
| Conseil sur l'IBAN | Le client peut le masquer avant l'envoi. |
| Tableaux de données | Les graphiques du DESK ont une vue en tableau. Les statuts portent icône et libellé, jamais la couleur seule. |
| Mouvement réduit | Respect du réglage système : les animations sont désactivées. |
| Fluidité | Défilement inertiel, transitions de page (View Transitions), en-tête qui se masque au défilement. |
| Mobile | Menu plein écran, actions principales en pleine largeur, aucun débordement horizontal (vérifié à 375, 768, 1024 et 1440 px). |

**Pistes suivantes** :

- prise de rendez-vous téléphonique au dernier écran ;
- bouton « Analyser ma facture » fixe sur mobile ;
- envoi de facture par e-mail à une adresse dédiée.

---

## 10. Risques identifiés

### Juridiques / commerciaux

- **Statut de courtier** : aucun statut spécifique aujourd'hui. Deux propositions de loi (AN n° 1845, Sénat n° 897) pourraient imposer un registre et l'affichage du coût du courtage. **À surveiller.**
- **Allégations** : interdiction des « économies garanties » et de tout chiffre non prouvé. Chaque exemple est marqué fictif, avec ses hypothèses.
- **Rétractation de 14 jours** pour les entreprises de 5 salariés ou moins en contrat conclu hors établissement (C. conso L.221-3). Elle figure dans les conditions générales, avec son formulaire. Application au mandat gratuit : **à valider par un avocat.**
- **Copropriétés** : les syndicats sont des non-professionnels (clauses abusives). Ne jamais rétrocéder de commission au syndic.
- **Démarchage téléphonique** : consentement préalable obligatoire depuis le 11/08/2026 pour appeler des consommateurs (par exemple des copropriétaires). Entre professionnels, régime d'opposition.

### RGPD / sécurité

- **Factures par e-mail (phase 1)** : acceptable au démarrage avec un SMTP en TLS et une boîte dédiée, mais à remplacer en priorité par un stockage chiffré UE (phase 2, P1).
- **Hébergeur américain** : transfert hors UE (Data Privacy Framework, recours en cours devant la CJUE). Préférer un hébergeur UE pour les documents.
- **Fichiers malveillants** : la signature binaire est contrôlée. L'antivirus est à ajouter avant tout stockage durable.
- **Limitation de débit en mémoire** : suffisante sur une instance unique, à remplacer par un store partagé (Redis / BDD) en multi-instance.
- **Purges** : la durée de conservation est définie (facture sans suite : 12 mois) mais doit être automatisée dès qu'il y a une base de données.
- **DESK** : à son ouverture, il faudra des CGU spécifiques, une MFA, un journal d'audit et une mini-analyse de risques à mettre à jour.

### Techniques

- **Performance des animations** sur les appareils modestes : densité adaptée, pause hors écran, désactivation en mouvement réduit.
- **Confusion démo / réel** : badges « données fictives » omniprésents, et page de connexion qui ne collecte rien.
- **Contenus à compléter** : SIRET, hébergeur, contacts, etc. Ils sont surlignés automatiquement sur les pages légales tant qu'ils manquent (voir [`A-COMPLETER.md`](A-COMPLETER.md)).

---

## 11. Décisions à prendre par les fondateurs

1. Nom de domaine, adresses e-mail et téléphone définitifs.
2. Hébergeur (UE recommandé) et serveur SMTP.
3. Logo définitif. Le logo actuel est une proposition : onde qui se stabilise, puis point de décision.
4. Validation de la direction artistique (ambre / encre / papier) et des engagements affichés, en particulier « une proposition seulement si elle améliore votre situation » (formulée sans garantie d'économies).
5. Relecture des pages légales par un avocat.
6. Accord écrit des fondateurs pour les cartes de visite et les photos de l'équipe.
7. Ordre de priorité de la phase 2.
