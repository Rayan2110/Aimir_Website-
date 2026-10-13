# Informations à fournir avant la mise en ligne

Tant qu'une valeur vaut `[À compléter]`, elle est **surlignée** sur les pages légales et un bandeau « Document en cours de finalisation » s'affiche.

## `src/content/site.ts`

| Champ | Utilisé sur | Statut |
|---|---|---|
| `url` (domaine définitif) | canonique, sitemap, QR codes | provisoire : `www.inenco-energy.fr` |
| `contact.email` | partout | provisoire |
| `contact.phone` / `phoneHref` | partout | provisoire |
| `contact.address` | contact | à compléter |
| `legal.legalForm` (ex. SAS) | mentions, confidentialité, CG | à compléter |
| `legal.capital` | mentions | à compléter |
| `legal.siren`, `legal.siret`, `legal.rcs` | mentions, confidentialité | à compléter |
| `legal.vat` (TVA intracommunautaire) | mentions | à compléter |
| `legal.naf` | mentions | à compléter |
| `legal.headOffice` | mentions, CG (formulaire de rétractation) | à compléter |
| `legal.publicationDirector` | mentions | à compléter |
| `legal.privacyContact` | formulaires, RGPD | provisoire |
| `legal.host` (nom, adresse, téléphone) | mentions, RGPD | à compléter |
| `social.linkedin` | (facultatif) | vide |

Sur la page Confidentialité, le **service de messagerie** (sous-traitant) est également à compléter.

## `src/content/team.ts` (cartes de visite et page À propos)

Pour chaque fondateur :

- nom de famille ;
- fonction exacte ;
- téléphone et e-mail professionnels ;
- LinkedIn (facultatif) ;
- courte biographie ;
- **photo** : à défaut, un monogramme sur fond de relief est affiché ;
- **accord écrit** de publication (droit à l'image, données personnelles).

## Variables d'environnement (`.env.example`)

`NEXT_PUBLIC_SITE_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `DOSSIER_INBOX`.

## Validations

- [ ] Relecture des pages légales par un avocat (mentions, RGPD, CG, rétractation, rémunération).
- [ ] Logo définitif (le logo actuel est une proposition).
- [ ] Engagements commerciaux affichés.
- [ ] Choix de l'hébergeur et contrats de sous-traitance (art. 28 RGPD).
- [ ] Registre des traitements (art. 30 RGPD).
