# Cartes de visite

Chaque fondateur a deux versions de sa carte : une carte papier imprimée par VistaPrint et une carte numérique sur le site.

```
Carte papier (VistaPrint)            Carte numérique  /carte/<nom>
┌──────────────┐  ┌──────────────┐    • Enregistrer le contact (vCard)
│ INENCO       │  │ Nom      ▓▓▓ │───▶ • Appeler / E-mail
│ ≈≈≈ relief   │  │ Fonction ▓▓▓ │ QR  • Envoyer une facture pour étude
│ Analyse · …  │  │ tél / mail   │     • Partager la carte, afficher le QR
└──────────────┘  └──────────────┘
     recto              verso
```

Le QR code du verso (ou une puce NFC programmée avec la même adresse) ouvre la carte numérique. De là, le contact peut enregistrer les coordonnées en un geste ou déposer directement une facture.

## Gabarit VistaPrint France

| | Dimension |
|---|---|
| Format fini (après coupe) | 85 × 55 mm |
| Document à téléverser (avec fond perdu) | **88 × 58 mm**, soit 1039 × 685 px en 300 DPI |
| Zone de sécurité (textes, QR) | 82 × 52 mm |

Les fonds débordent dans le fond perdu. Tous les textes et le QR code restent à plus de 4 mm du bord fini.

Source : [VistaPrint — Format cartes de visite](https://www.vistaprint.fr/hub/format-cartes-de-visite).

## Générer les fichiers

1. Compléter `src/content/team.ts` : nom, fonction, téléphone, e-mail.
2. Vérifier `NEXT_PUBLIC_SITE_URL` : le QR code pointe vers `<domaine>/carte/<nom>`. **Le domaine doit être en ligne avant l'impression.**
3. Lancer le site (`npm run dev`), puis :

   ```bash
   npm run cartes:pdf
   ```

4. Les fichiers sont créés dans `print/cartes-de-visite/` (dossier ignoré par git) :
   - `<nom>-recto.pdf`, `<nom>-verso.pdf` : PDF vectoriels, polices incorporées, format recommandé ;
   - `<nom>-recto.png`, `<nom>-verso.png` : PNG en 300 DPI, en secours.

## Commander chez VistaPrint

1. Cartes de visite standard 85 × 55 mm, impression recto verso.
2. Choisir l'option « Télécharger un design complet ».
3. Téléverser `<nom>-recto.pdf` en recto et `<nom>-verso.pdf` en verso.
4. Dans l'aperçu, vérifier que rien d'important ne dépasse la ligne de sécurité.
5. **Scanner le QR code sur l'aperçu** avec un téléphone avant de valider.

Papier conseillé : mat épais (350 g ou plus). Le recto sombre rend mieux en mat. Une finition « toucher doux » renforce l'effet haut de gamme.

## Planche d'essai

`/carte/impression` affiche toutes les cartes sur une feuille A4 avec traits de coupe, pour une impression d'essai au bureau (à 100 %, sans mise à l'échelle).
