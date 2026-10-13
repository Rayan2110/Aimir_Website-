# Architecture technique

## 1. Aujourd'hui (phase 1, dans ce dépôt)

```
Navigateur ──HTTPS──▶ Next.js 16 (Node)
                        ├─ Pages statiques prérendues (Cache Components)
                        ├─ POST /api/dossier ──▶ validation Zod + contrôle des fichiers
                        │                        └─▶ SMTP de l'entreprise (TLS) ──▶ boîte « dossiers »
                        │                        (dév. : écriture dans .data/dossiers/)
                        ├─ /carte/[nom]/vcard   (vCard générée)
                        └─ sitemap, robots, manifest, image Open Graph
```

- **Aucune donnée confidentielle n'est envoyée au navigateur.** La démo du DESK utilise des données fictives générées de façon déterministe.
- **Aucun service tiers côté visiteur** : polices auto-hébergées, aucun traceur, aucun CDN externe.
- **En-têtes de sécurité** (`next.config.ts`) : HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP.
- **Dépôt de fichiers** :
  - 4 fichiers au maximum, 10 Mo par fichier, 20 Mo au total ;
  - **contrôle de la signature binaire** (PDF, JPEG, PNG, WEBP, HEIC) ;
  - noms de fichiers assainis ;
  - pot de miel anti-robots ;
  - limitation à 6 envois par IP toutes les 10 minutes ;
  - contrôle d'origine (même origine).

## 2. Cible (phase 2)

```
Next.js (même dépôt)
  ├─ site public            (inchangé)
  ├─ /desk/*                espace client — authentification MFA, droits par site
  ├─ /interne/*             back-office — rôles admin / analyste / commercial / lecture
  ├─ /api/*                 routes serveur (dossiers, documents, alertes)
  └─ tâche planifiée        OMEGA (quotidienne) + purges RGPD
        │
        ├─ PostgreSQL (UE)              données métier + journal d'audit
        ├─ Stockage objet S3 (UE)       documents chiffrés, URL signées courtes
        ├─ Antivirus (ClamAV)           analyse à la réception
        └─ SMTP / e-mail transactionnel notifications (accord des fondateurs si payant)
```

## 3. Modèle de données

Les types sont déjà posés dans le code :

- `src/lib/desk/types.ts` : espace client ;
- `src/lib/backoffice/pipeline.ts` : back-office.

| Entité | Champs clés |
|---|---|
| **Organisation** (client) | raison sociale, SIREN, secteur, groupe parent éventuel |
| **Utilisateur** | identité, rôle, sites autorisés, MFA |
| **Site** | nom, adresse, type, coordonnées, PDL / PCE |
| **Contrat** | énergie, fournisseur, statut, début, échéance, structure, segment, prix |
| **Consommation** | site, mois, MWh électricité / gaz, source (facture, Enedis, GRDF) |
| **Document** | type (facture, contrat, proposition, étude, document fournisseur, historique), site, fournisseur, énergie, date, empreinte, emplacement de stockage |
| **Dossier** | référence, étape du pipeline, interlocuteur, contacts, sites, offres, notes, historique, date de purge |
| **Offre fournisseur** | fournisseur, structure, durée, prix, validité, conditions |
| **Étude** | date, hypothèses, offres comparées, écart estimé |
| **Alerte** | niveau 1 à 3, règle, site, ce qui se passe / pourquoi / action, preuve |
| **Événement d'audit** | qui, quoi, quand, sur quelle ressource |

Cette structure tient pour des **groupes de centaines de sites** : la relation organisation → sites → contrats est paginée, et la carte s'appuie sur une agrégation.

## 4. Pipeline du back-office (brief §19)

```
Nouveau prospect → Facture reçue → Dossier qualifié → Analyse → Consultation fournisseurs
→ Offres reçues → Présentation client → Offre choisie → Contrat signé → Activation
→ Suivi → Renouvellement
```

- Chaque dépôt sur le site crée un dossier au stade **« Facture reçue »**, avec sa référence `INC-AAMMJJ-XXXXX`, déjà générée aujourd'hui.
- Chaque changement d'étape est enregistré dans l'historique.

## 5. OMEGA ENERGY

`src/lib/omega/engine.ts` contient des **règles explicites, paramétrables et vérifiables** :

| Règle | Seuil par défaut | Niveau |
|---|---|---|
| Échéance de contrat | ≤ 240 j / ≤ 120 j / ≤ 60 j | 1 / 2 / 3 |
| Dérive de consommation | +15 % sur 3 mois vs N-1 | 2 |
| Document manquant | dernière facture > 75 j (> 120 j) | 1 (2) |
| Document ajouté | ≤ 7 j | 1 |

Chaque alerte porte :

- `what` : ce qui se passe ;
- `why` : pourquoi c'est important ;
- `action` : l'action disponible ;
- `evidence` : la donnée source.

**Aucune alerte n'est produite sans donnée.** Une couche statistique ou d'IA pourra s'ajouter plus tard, en gardant ce principe de traçabilité.

## 6. Sécurité et RGPD (brief §20)

| Exigence | Phase 1 (fait) | Phase 2 (prévu) |
|---|---|---|
| HTTPS | HSTS, à activer chez l'hébergeur | — |
| Contrôle d'accès | pas de données exposées | RBAC par rôle et par site, côté serveur uniquement |
| Authentification sécurisée | page inactive | MFA / passkeys, sessions courtes, cookie `HttpOnly` / `Secure` / `SameSite` |
| Stockage des documents | e-mail TLS vers une boîte dédiée | S3 UE chiffré, URL signées, antivirus |
| Journalisation | logs serveur sans donnée personnelle | journal d'audit des accès et des actions |
| Permissions | — | droits paramétrables par utilisateur |
| Politique de conservation | définie et publiée | purge automatique (facture sans suite : 12 mois ; prospect : 3 ans) |
| Suppression | sur demande (contact RGPD) | suppression en un clic dans le back-office |
| Sauvegardes | — | quotidiennes, 30 jours, UE, test de restauration |
| Conformité RGPD | information art. 13, politique, opposition à la prospection | registre, contrats art. 28, mini-analyse de risques avant l'ouverture du DESK |

## 7. Évolutivité (brief §22)

| Ajout futur | Point d'ancrage |
|---|---|
| CRM | `Dossier` / `HistoryEvent`, ou export vers un CRM existant |
| API fournisseurs | `SupplierOffer` alimenté manuellement aujourd'hui, automatisable ensuite |
| OCR / analyse de documents | à la réception (`/api/dossier`), avec validation humaine |
| Signature électronique | mandats et propositions (prestataire eIDAS) |
| Notifications e-mail / SMS | déclenchées par OMEGA |
| Applications mobiles | PWA (manifeste présent), puis API commune |
| Multi-utilisateurs, groupes de centaines de sites | `Organisation` → `Site[]`, droits par site |

**Rappel** : aucune API ni technologie payante n'est activée sans validation des fondateurs.

## 8. Performance (brief §21)

- **Pages prérendues** (statiques), aucune image matricielle : tout est en SVG ou Canvas.
- **Animations** :
  - relief énergétique en Canvas 2D, densité adaptée à l'écran, **mis en pause hors écran et onglet masqué** ;
  - images fixes en mouvement réduit.
- **Démo DESK** chargée à la demande (`next/dynamic`), uniquement là où elle est affichée.
- **Polices** auto-hébergées avec `font-display: swap`.
- **Révélations au défilement** en CSS, sur un seul IntersectionObserver.
