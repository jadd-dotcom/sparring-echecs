# Refonte visuelle — captures avant / après

Captures prises par `node tests/screens.cjs <dossier> [url]` (Playwright, deviceScaleFactor 2, JPEG qualité 82) :
accueil, partie (3 coups), revue (1.e4 d5 2.♕g4?? ♗xg4) et exercice de Mats, sur **iPhone 13 portrait** et
**iPad paysage**, en thème **sombre** et **clair**.

- `avant/` : l'appli avant la refonte (le thème suivait le réglage de l'appareil).
- `apres/` : l'appli après la refonte (thème choisi dans Réglages → Apparence ; sombre par défaut).

Noms : `{accueil,partie,revue,mats}-{iphone,ipad}-{dark,light}.jpg` ; en plus, dans `apres/`,
`glisser-ipad-{dark,light}.jpg` : une pièce saisie pendant le glisser (agrandie, avec ombre).

## Ce qui change
1. **Thème sombre par défaut** : fond anthracite, cartes un peu plus claires sans bordure fine, avec ombre ; réglage
   Sombre / Clair / Auto (Auto suit l'appareil), appliqué dès le chargement de la page.
2. **Pièces** : trois jeux au choix dans Réglages → Apparence — *Relief* (par défaut : cburnett avec dégradés et ombre
   portée, créé par `scripts/make-relief.py`, GPLv2+), *Merida* (GPLv2+), *Maestro* (CC BY-NC-SA 4.0, non commercial).
   Fichiers dans `public/pieces/`, crédits dans le README. Captures des trois jeux dans `pieces/` (voir plus bas).
3. **Échiquier** : bords arrondis (6 px), ombre, coordonnées discrètes tout au coin des cases du bord, jamais sous les
   pièces (pièces à 88 % de la case, un peu moins sur les petits écrans ; vérifié au pixel par `tests/coords.cjs`) ;
   pièce saisie agrandie (×1,22) avec une ombre portée pendant le glisser.
4. **Boutons** pleins et gras, avec une épaisseur en bas et un effet d'enfoncement au toucher ; bouton « Jouer » vert et grand.
5. **Icônes** : tous les emojis remplacés par des icônes SVG Lucide (ISC) ; pastilles de classement des coups dessinées
   pour l'appli (cercle de couleur + étoile, !, coche, livre, ?!, ?, ??).
6. **Police** Inter (OFL), sous-ensemble latin servi localement (hors ligne) ; chiffres importants grands et gras.
7. Zones tactiles ≥ 48 px partout (vérifié par `tests/appearance.cjs` sur 8 écrans, iPhone et iPad).

Aucune pièce, icône, image, son ni logo de Chess.com n'est utilisé.

## Les trois jeux de pièces (24/11)
Captures prises par `node tests/pieces-shots.cjs docs/design/pieces [url]` : la même position (partie italienne après
8 coups) avec chaque jeu, sur iPad paysage et iPhone, en thème sombre et clair, et le choix dans les Réglages.
- `pieces/{relief,merida,maestro}-{ipad,iphone}-{dark,light}.jpg`
- `pieces/reglages-{dark,light}.jpg`

Les captures de `apres/` ont été refaites avec *Relief*, le jeu par défaut. Les pièces sont affichées en `<img>` : chaque
SVG est un document à part, les identifiants internes de Relief (`L`, `D`, `sh`) ne peuvent donc pas entrer en conflit.

## Poids ajouté
| Élément | Brut | Compressé (gzip) |
|---|---|---|
| Police Inter (latin, variable, woff2) | 48 Ko | 48 Ko (déjà compressée) |
| 3 jeux de pièces SVG (36 fichiers) | 69 Ko | 15 Ko |
| JavaScript (icônes Lucide + code) | +27 Ko | +7 Ko |
| CSS | +5 Ko | +1 Ko |
| **Total** | **≈ 149 Ko** | **≈ 71 Ko** |

Le précache hors ligne passe de 25 à 62 entrées (≈ 39,9 Mo → 40,1 Mo, surtout le modèle Maia).

Mise à jour du 24/11 (jeux de pièces remplacés) : Relief 17 Ko, Merida 34 Ko, Maestro 53 Ko, soit ≈ 102 Ko bruts
(≈ 44 Ko gzip, fichier par fichier) pour les 36 fichiers proposés ; le dossier source `cburnett/` n'est pas précaché.
Le précache reste à 62 entrées (≈ 40,2 Mo).
