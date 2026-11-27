# Pièges d’ouverture — vérification Stockfish

Moteur : Stockfish natif (/usr/games/stockfish), 1000 ms par position. Chances de gain (win%) avec la formule de Lichess, du point de vue du camp indiqué.
Critères : une bonne défense perd au plus 10 points de win% par rapport au meilleur coup ; le coup fautif en perd au moins 20 ;
le coup clé de la punition est un mat, ou au plus 10 points sous le meilleur coup et au moins 75 % de gain ; chaque coup suivant du punisseur, au plus 10 points sous le meilleur.
Dans l’appli, un autre coup est aussi accepté si Stockfish le juge dans les mêmes tolérances.
**Tous les pièges sont vérifiés.** (13 pièges, 208 s)


## Mats rapides

### ✅ Mat du berger (dame en h5)

Suite (éval Blancs après chaque coup) : 1. e4 (0.25) e5 (0.40) 2. Bc4 (0.00) Nc6 (0.17) 3. Qh5 (-0.29)

Faute : **Nf6** · Punition : **Qxf7#** (gagne le mat) · Bonnes défenses : g6, Qe7, Qf6

- Moment critique (Noirs au trait) : meilleur coup g6, 52 % pour la victime.
- ✅ Défense g6 : 52 % (−0 pts) — elle tient.
- ✅ Défense Qe7 : 50 % (−2 pts) — elle tient.
- ✅ Défense Qf6 : 48 % (−4 pts) — elle tient.
- ✅ Faute Nf6 : 2 % (−50 pts) — c’est bien un piège.
- ✅ Punition Qxf7# : mat (meilleur coup : Qxf7#, 98 %).
- Position finale : échec et mat.

### ✅ Mat du berger (dame en f3)

Suite (éval Blancs après chaque coup) : 1. e4 (0.34) e5 (0.46) 2. Bc4 (0.12) Nc6 (0.15) 3. Qf3 (-0.11)

Faute : **Nd4** · Punition : **Qxf7#** (gagne le mat) · Bonnes défenses : Nf6

- Moment critique (Noirs au trait) : meilleur coup Nf6, 50 % pour la victime.
- ✅ Défense Nf6 : 50 % (−0 pts) — elle tient.
- ✅ Faute Nd4 : 2 % (−48 pts) — c’est bien un piège.
- ✅ Punition Qxf7# : mat (meilleur coup : Qxf7#, 98 %).
- Position finale : échec et mat.

### ✅ Mat du fou (pions f et g)

Suite (éval Blancs après chaque coup) : 1. f3 (-0.69) e5 (-0.73)

Faute : **g4** · Punition : **Qh4#** (gagne le mat) · Bonnes défenses : Nc3, e3, e4

- Moment critique (Blancs au trait) : meilleur coup Nc3, 44 % pour la victime.
- ✅ Défense Nc3 : 44 % (−0 pts) — elle tient.
- ✅ Défense e3 : 43 % (−1 pts) — elle tient.
- ✅ Défense e4 : 42 % (−2 pts) — elle tient.
- ✅ Faute g4 : 2 % (−41 pts) — c’est bien un piège.
- ✅ Punition Qh4# : mat (meilleur coup : Qh4#, 98 %).
- Position finale : échec et mat.

### ✅ Mat de Légal

Suite (éval Blancs après chaque coup) : 1. e4 (0.34) e5 (0.36) 2. Nf3 (0.25) d6 (0.55) 3. Bc4 (0.44) Bg4 (0.82) 4. Nc3 (0.57) g6 (2.01) 5. Nxe5 (1.91)

Faute : **Bxd1** · Punition : **Bxf7+ Ke7 Nd5#** (gagne le mat) · Bonnes défenses : dxe5, Be6

- Moment critique (Noirs au trait) : meilleur coup dxe5, 33 % pour la victime.
- ✅ Défense dxe5 : 34 % (−0 pts) — elle tient.
- ✅ Défense Be6 : 31 % (−2 pts) — elle tient.
- ✅ Faute Bxd1 : 2 % (−31 pts) — c’est bien un piège.
- ✅ Punition Bxf7+ : 98 % pour le punisseur (meilleur coup : Bxf7+, 98 %).
- Réponse Ke7 : meilleure défense.
- ✅ Puis Nd5# : mat (meilleur : Nd5#, 98 %).
- Position finale : échec et mat.

### ✅ Le cavalier g5 sur f7

Suite (éval Blancs après chaque coup) : 1. e4 (0.39) e5 (0.46) 2. Nf3 (0.40) Nc6 (0.41) 3. Bc4 (0.16) Nf6 (0.20) 4. Ng5 (0.20)

Faute : **h6** · Punition : **Nxf7 Qe7 Nxh8** (gagne la tour) · Bonnes défenses : d5

- Moment critique (Noirs au trait) : meilleur coup d5, 50 % pour la victime.
- ✅ Défense d5 : 48 % (−2 pts) — elle tient.
- ✅ Faute h6 : 13 % (−36 pts) — c’est bien un piège.
- ✅ Punition Nxf7 : 87 % pour le punisseur (meilleur coup : Nxf7, 88 %).
- Réponse Qe7 : meilleure défense.
- ✅ Puis Nxh8 : 88 % (meilleur : Nxh8, 87 %).
- Position finale : 5.42 (Blancs).

## Dame perdue

### ✅ Fourchette de cavalier en c2

Suite (éval Blancs après chaque coup) : 1. e4 (0.32) e5 (0.25) 2. d4 (-0.09) exd4 (-0.19) 3. Qxd4 (-0.23) Nc6 (-0.22) 4. Qe3 (-0.12) Nb4 (0.89)

Faute : **Nf3** · Punition : **Nxc2+ Ke2 Nxe3** (gagne la dame) · Bonnes défenses : Qe2, Na3, Qb3

- Moment critique (Blancs au trait) : meilleur coup Qe2, 59 % pour la victime.
- ✅ Défense Qe2 : 58 % (−1 pts) — elle tient.
- ✅ Défense Na3 : 53 % (−6 pts) — elle tient.
- ✅ Défense Qb3 : 52 % (−7 pts) — elle tient.
- ✅ Faute Nf3 : 8 % (−51 pts) — c’est bien un piège.
- ✅ Punition Nxc2+ : 92 % pour le punisseur (meilleur coup : Nxc2+, 92 %).
- Réponse Ke2 : défense naturelle (meilleure : Kd1, 8 % pour la victime contre 8 %).
- ✅ Puis Nxe3 : 92 % (meilleur : Nxe3, 92 %).
- Position finale : -6.62 (Blancs).

### ✅ Clouage de la dame sur le roi (piège de l’éléphant)

Suite (éval Blancs après chaque coup) : 1. d4 (0.22) d5 (0.32) 2. c4 (0.34) e6 (0.26) 3. Nc3 (0.32) Nf6 (0.28) 4. Bg5 (0.22) Nbd7 (0.31) 5. cxd5 (0.39) exd5 (0.34)

Faute : **Nxd5** · Punition : **Nxd5 Bxd8 Bb4+ Qd2 Bxd2+ Kxd2 Kxd8** (gagne une pièce) · Bonnes défenses : e3, Nf3, Qc2

- Moment critique (Blancs au trait) : meilleur coup e3, 53 % pour la victime.
- ✅ Défense e3 : 53 % (−0 pts) — elle tient.
- ✅ Défense Nf3 : 53 % (−0 pts) — elle tient.
- ✅ Défense Qc2 : 52 % (−1 pts) — elle tient.
- ✅ Faute Nxd5 : 22 % (−31 pts) — c’est bien un piège.
- ✅ Punition Nxd5 : 81 % pour le punisseur (meilleur coup : Nxd5, 81 %).
- Réponse Bxd8 : meilleure défense.
- ✅ Puis Bb4+ : 81 % (meilleur : Bb4+, 81 %).
- Réponse Qd2 : meilleure défense.
- ✅ Puis Bxd2+ : 78 % (meilleur : Kxd8, 80 %).
- Réponse Kxd2 : meilleure défense.
- ✅ Puis Kxd8 : 77 % (meilleur : Kxd8, 77 %).
- Position finale : -3.33 (Blancs).

### ✅ Échec à la découverte (Petrov)

Suite (éval Blancs après chaque coup) : 1. e4 (0.21) e5 (0.25) 2. Nf3 (0.19) Nf6 (0.45) 3. Nxe5 (0.39) Nxe4 (0.62) 4. Qe2 (0.51)

Faute : **Nf6** · Punition : **Nc6+ Be7 Nxd8** (gagne la dame) · Bonnes défenses : Qe7

- Moment critique (Noirs au trait) : meilleur coup Qe7, 45 % pour la victime.
- ✅ Défense Qe7 : 44 % (−1 pts) — elle tient.
- ✅ Faute Nf6 : 10 % (−35 pts) — c’est bien un piège.
- ✅ Punition Nc6+ : 90 % pour le punisseur (meilleur coup : Nc6+, 90 %).
- Réponse Be7 : défense naturelle (meilleure : Qe7, 10 % pour la victime contre 9 %).
- ✅ Puis Nxd8 : 91 % (meilleur : Nxd8, 91 %).
- Position finale : 6.25 (Blancs).

### ✅ Pion empoisonné en b2

Suite (éval Blancs après chaque coup) : 1. d4 (0.32) d5 (0.33) 2. Bf4 (0.14) c5 (0.07) 3. e3 (0.04) Qb6 (0.82) 4. Nc3 (0.84)

Faute : **Qxb2** · Punition : **Nxd5 Bf5 Rb1 Qxa2 Nc7+** (gagne du matériel) · Bonnes défenses : Nf6, e6

- Moment critique (Noirs au trait) : meilleur coup Nf6, 43 % pour la victime.
- ✅ Défense Nf6 : 43 % (−0 pts) — elle tient.
- ✅ Défense e6 : 43 % (−0 pts) — elle tient.
- ✅ Faute Qxb2 : 21 % (−23 pts) — c’est bien un piège.
- ✅ Punition Nxd5 : 81 % pour le punisseur (meilleur coup : Nxd5, 81 %).
- Réponse Bf5 : meilleure défense.
- ✅ Puis Rb1 : 81 % (meilleur : Nc7+, 82 %).
- Réponse Qxa2 : meilleure défense.
- ✅ Puis Nc7+ : 82 % (meilleur : Nc7+, 83 %).
- Position finale : 4.11 (Blancs).

## Pièges de mes ouvertures

### ✅ Gambit Englund : le fou en c3 — Londres (contre 1…e5, gambit Englund)

Suite (éval Blancs après chaque coup) : 1. d4 (0.25) e5 (1.23) 2. dxe5 (1.25) Nc6 (1.36) 3. Nf3 (1.31) Qe7 (1.66) 4. Bf4 (1.38) Qb4+ (1.62) 5. Bd2 (1.63) Qxb2 (2.07)

Faute : **Bc3** · Punition : **Bb4 Bd2 Qxa1** (gagne la tour (et le mat si sa dame vient en d2)) · Bonnes défenses : Nc3

- Moment critique (Blancs au trait) : meilleur coup Nc3, 68 % pour la victime.
- ✅ Défense Nc3 : 67 % (−1 pts) — elle tient.
- ✅ Faute Bc3 : 20 % (−47 pts) — c’est bien un piège.
- ✅ Punition Bb4 : 80 % pour le punisseur (meilleur coup : Bb4, 80 %).
- Réponse Bd2 : meilleure défense.
- ✅ Puis Qxa1 : 81 % (meilleur : Qxa1, 81 %).
- Position finale : -4.00 (Blancs).

### ✅ Anglaise : reprendre en d5 avec la dame — Anglaise

Suite (éval Blancs après chaque coup) : 1. c4 (0.00) e5 (0.07) 2. Nc3 (0.17) Nf6 (0.18) 3. g3 (0.16) d5 (0.22) 4. cxd5 (0.27)

Faute : **Qxd5** · Punition : **Nxd5 Nxd5** (gagne la dame) · Bonnes défenses : Nxd5

- Moment critique (Noirs au trait) : meilleur coup Nxd5, 49 % pour la victime.
- ✅ Défense Nxd5 : 49 % (−0 pts) — elle tient.
- ✅ Faute Qxd5 : 11 % (−38 pts) — c’est bien un piège.
- ✅ Punition Nxd5 : 90 % pour le punisseur (meilleur coup : Nxd5, 90 %).
- Réponse Nxd5 : meilleure défense.
- Position finale : 5.96 (Blancs).

### ✅ Mon système …g6 contre le fou c4 et la dame f3 — Système …c5 / …g6

Suite (éval Blancs après chaque coup) : 1. e4 (0.29) c5 (0.33) 2. Bc4 (0.08) Nc6 (0.00) 3. Qf3 (-0.76)

Faute : **g6** · Punition : **Qxf7#** (gagne le mat) · Bonnes défenses : Nf6, e6

- Moment critique (Noirs au trait) : meilleur coup Nf6, 57 % pour la victime.
- ✅ Défense Nf6 : 56 % (−1 pts) — elle tient.
- ✅ Défense e6 : 56 % (−1 pts) — elle tient.
- ✅ Faute g6 : 2 % (−54 pts) — c’est bien un piège.
- ✅ Punition Qxf7# : mat (meilleur coup : Bxf7#, 98 %).
- Position finale : échec et mat.

### ✅ Londres en défense : le fou g6 enfermé — Londres en défense (contre cavalier c3, pions f3, g4, h4)

Suite (éval Blancs après chaque coup) : 1. d4 (0.30) d5 (0.32) 2. Nc3 (-0.03) Nf6 (0.11) 3. Bf4 (0.00) c6 (0.10) 4. e3 (0.10) Bf5 (0.30) 5. f3 (0.08) e6 (0.21) 6. g4 (0.12) Bg6 (0.19) 7. h4 (0.23)

Faute : **Nbd7** · Punition : **h5 Bxh5 gxh5** (gagne une pièce) · Bonnes défenses : h5, h6

- Moment critique (Noirs au trait) : meilleur coup h5, 48 % pour la victime.
- ✅ Défense h5 : 49 % (−0 pts) — elle tient.
- ✅ Défense h6 : 47 % (−2 pts) — elle tient.
- ✅ Faute Nbd7 : 24 % (−24 pts) — c’est bien un piège.
- ✅ Punition h5 : 77 % pour le punisseur (meilleur coup : h5, 77 %).
- Réponse Bxh5 : meilleure défense.
- ✅ Puis gxh5 : 76 % (meilleur : gxh5, 77 %).
- Position finale : 3.23 (Blancs).
