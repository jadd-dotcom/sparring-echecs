# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 27/11/2026 13:02. Période : toutes les parties (premier rapport) — 5 parties.

**Demande :** je suis débutant. À partir de ces données (calculées automatiquement, pas devinées), diagnostique mes lacunes principales, explique-les simplement et propose-moi 3 axes de travail concrets.

## Objectif en cours (« Mon objectif » : une règle à la fois)

**Ne rien donner** — règle : « Avant de lâcher la pièce : après mon coup, quels sont SES échecs, SES prises, SES attaques ? »

- Début : 27/11/2026 ; 3 parties mesurées depuis (analysées, 10 coups au moins).
- **2/10** parties propres sur les 3 dernières : ✗ ✓ ✓ (maîtrisé à 7/10, 10 parties au moins).
- Point de départ : 2/2 parties propres sur les 2 d’avant le début.
- À surveiller (gaffes des autres motifs sur les 10 dernières parties) : Autre ×4, Mat ouvert ×1, Gain raté ×1, sorties du répertoire par moi ×3.

## Définitions

- **Sources** : *Maia* = partie dans l’appli contre Maia-3, une IA qui imite le jeu humain (compte pour mon niveau) ; *Chess.com* = partie importée de mon compte Chess.com, contre un humain, analysée de la même façon (ne compte pas pour mon niveau).
- **Niveau** : estimation de type Elo, échelle de l’appli proche de Lichess (bornes 550–2600), mise à jour après chaque partie contre Maia. Maia-3 est réglée 50 points au-dessus de mon niveau.
- **Mon répertoire** : Anglaise (système fermé) (Blancs) ; Système …c5 / …g6 (Dragon accéléré) (Noirs) ; Système de Londres (Blancs) ; Londres en défense (Noirs). « Resté dans mon répertoire jusqu’au coup 8 » = je n’ai joué aucun coup hors répertoire avant mon 9e coup (fin de ligne comprise) ; les parties où l’adversaire en sort avant sont comptées à part.
- **win%** : mes chances de gain estimées depuis l’évaluation de Stockfish (formule Lichess), de mon point de vue.
- **Précision** : précision de mes coups sur une partie, en %, avec la formule publique de Lichess (100 = aucun coup ne baisse mes chances de gain).
- **Imprécision / erreur / gaffe** : un de mes coups qui fait chuter mon win% d’au moins 10 / 20 / 30 points par rapport au meilleur coup.
- **Phases** : ouverture = coups 1 à 10 ; finale = chaque camp a au plus 13 points de pièces hors pions (cavalier/fou 3, tour 5, dame 9) ; milieu de partie = le reste.
- **Suites Stockfish** : 5 demi-coups, profondeur 12. **Bilan matériel** = mes points − ceux de l’adversaire (pion 1, cavalier 3, fou 3, tour 5, dame 9) au bout de la suite.
- **Motifs** (règles automatiques, un motif principal par erreur, dans cet ordre de priorité) :
  - *Mat raté* : j’avais un mat en 3 coups ou moins et je ne l’ai pas joué.
  - *Mat ouvert* : après mon coup, l’adversaire a un mat en 3 coups ou moins.
  - *Menace ignorée* : si l’adversaire avait pu rejouer avant mon coup, il gagnait au moins 2 points de matériel ou matait, et mon coup ne l’en empêche pas.
  - *Pièce laissée en prise* : dans la réfutation de mon coup, l’adversaire gagne au moins 2 points en 2 demi-coups.
  - *Gain raté* : je pouvais gagner au moins 2 points de matériel (sur les 3 premiers demi-coups de la meilleure suite) ou mater, et mon coup ne le fait pas.
  - *Autre* : aucun des cas précédents (souvent positionnel ou stratégique).

## 1. Résumé de la période

### Niveau (parties contre Maia)

Début : **900** → fin : **797** (-103).

Classement Chess.com (pour information) : 346 → 362.

| Partie | Date | Source | Couleur | Adversaire | Résultat | Fin | Répertoire | Niveau après |
|---|---|---|---|---|---|---|---|---|
| n°1 | 05/11/2026 | Chess.com | Blancs | yar100r (845) | Défaite (0-1) | Échec et mat | suivi ; adversaire sorti au coup 1… (g6) | – |
| n°2 | 18/11/2026 | Chess.com | Noirs | smarts00001 (315) | Victoire (0-1) | Échec et mat | suivi ; adversaire sorti au coup 4. (e5) | – |
| n°3 | 27/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 866 |
| n°4 | 27/11/2026 | Maia | Noirs | Maia-3 (916) | Défaite (1-0) | Échec et mat | **sorti au coup 1…** (e5 au lieu de d5) | 831 |
| n°5 | 27/11/2026 | Maia | Blancs | Maia-3 (881) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 797 |

### Résultats

Victoires / nulles / défaites : **1 / 0 / 4**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 0 / 0 / 3 | 50 % | 0 | 1,7 |
| Chess.com | 2 | 1 / 0 / 1 | 70,8 % | 0 | 1 |

### Par ouverture

| Ouverture | Parties | V / N / D | Resté dans mon répertoire jusqu’au coup 8 | Sorti moi-même avant | Adversaire sorti avant |
|---|---|---|---|---|---|
| Hors répertoire (Blancs) | 2 | 0 / 0 / 2 | 0 | 2 | 0 |
| Anglaise (système fermé) | 1 | 0 / 0 / 1 | 0 | 0 | 1 |
| Système …c5 / …g6 (Dragon accéléré) | 1 | 1 / 0 / 0 | 0 | 0 | 1 |
| Londres en défense | 1 | 0 / 0 / 1 | 0 | 1 | 0 |

**Resté dans mon répertoire jusqu’au coup 8 : 0 / 5 parties (0 %)** — sorti moi-même avant : 3 (60 %) ; l’adversaire en est sorti avant : 2 (40 %).

- Contre Maia : 0 / 3 (0 %) · sur Chess.com : 0 / 2 (0 %).

#### Coups par lesquels l’adversaire sort de mon répertoire (vus au moins 2 fois)

Aucun coup vu 2 fois sur la période.

### Imprécisions, erreurs, gaffes par partie

| Partie | Mes coups | Précision | Imprécisions | Erreurs | Gaffes |
|---|---|---|---|---|---|
| n°1 | 25 | 71 % | 1 | 0 | 1 |
| n°2 | 20 | 70,7 % | 2 | 0 | 1 |
| n°3 | 28 | 67,3 % | 3 | 0 | 2 |
| n°4 | 12 | 42,7 % | 3 | 0 | 2 |
| n°5 | 18 | 40 % | 3 | 0 | 1 |
| **Moyenne par partie** | 20,6 | 58,3 % | 2,4 | 0 | 1,4 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 50 | 10 | 0 | 4 | 0,8 |
| Milieu | 53 | 2 | 0 | 3 | 0,6 |
| Finale | 0 | 0 | 0 | 0 | – |

### Motifs des erreurs et gaffes

Sur 7 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 1 |
| Menace ignorée | 1 |
| Pièce laissée en prise | 0 |
| Gain raté | 1 |
| Autre | 4 |

### Ce que je pensais (réponse en un toucher), par motif

Réponses données sur 3 de mes 7 erreurs et gaffes (dans la revue, avant de voir le meilleur coup).

| Motif | Menace pas vue | Mal calculé | Autre cible | Trop vite | Ne sait pas | Sans réponse |
|---|---|---|---|---|---|---|
| Mat raté | 0 | 0 | 0 | 0 | 0 | 0 |
| Mat ouvert | 0 | 0 | 1 | 0 | 0 | 0 |
| Menace ignorée | 0 | 0 | 0 | 0 | 0 | 1 |
| Pièce laissée en prise | 0 | 0 | 0 | 0 | 0 | 0 |
| Gain raté | 0 | 0 | 0 | 0 | 0 | 1 |
| Autre | 1 | 1 | 0 | 0 | 0 | 2 |
| **Total** | **1** | **1** | **1** | **0** | **0** | **4** |

Réponses : Menace pas vue = « Je n’ai pas vu la menace » ; Mal calculé = « J’ai vu, mais mal calculé » ; Autre cible = « Je voulais attaquer autre chose » ; Trop vite = « J’ai joué trop vite » ; Ne sait pas = « Je ne sais pas ».

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Lis la menace : 0 tentatives, réussite – (détail en section 7).
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (7, tri par chute de win%)

### 1. Partie n°5, coup 18. Rhg1?? — gaffe (−87 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : milieu · motif : **Mat ouvert** (aussi : Menace ignorée)
- Dernier coup adverse : 17… Qa6
- FEN avant mon coup : `3r1rk1/ppp2pp1/q4n1p/4p3/2N1P3/3P1P1B/1PPQ1P1P/2KR3R w - - 1 18`

```
  +-----------------+
8 | . . . r . r k . |
7 | p p p . . p p . |
6 | q . . . . n . p |
5 | . . . . p . . . |
4 | . . N . P . . . |
3 | . . . P . P . B |
2 | . P P Q . P . P |
1 | . . K R . . . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **18. Rhg1** → win% 89 → 2
- Meilleur coup : **Qa5** — suite : 18. Qa5 Qxa5 19. Nxa5 Nh7 20. Nxb7 — bilan matériel au bout : +4
- Réfutation de mon coup : 18… Qa1# — bilan matériel au bout : +3
- Menace avant mon coup (si l’adversaire rejouait) : 18… Qa1#
- Ce que je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »

### 2. Partie n°2, coup 8… a6?? — gaffe (−44 pts)

- Source : Chess.com · adversaire : smarts00001 (315)
- Ma couleur : Noirs · phase : ouverture · motif : **Gain raté**
- Dernier coup adverse : 8. Bb5
- FEN avant mon coup : `r1bqk1nr/pp3pbp/2n1p1p1/1B1pP3/3p1N2/5N2/PPP2PPP/R1BQK2R b KQkq - 1 8`

```
  +-----------------+
1 | R . . K Q B . R |
2 | P P P . . P P P |
3 | . . N . . . . . |
4 | . . N . p . . . |
5 | . . . P p . B . |
6 | . p . p . n . . |
7 | p b p . . . p p |
8 | r n . k q b . r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **8… a6** → win% 88 → 44
- Meilleur coup : **Qa5+** — suite : 8… Qa5+ 9. c3 Qxb5 10. cxd4 Qa6 — bilan matériel au bout : +3
- Réfutation de mon coup : 9. Bxc6+ bxc6 10. Qxd4 a5 11. Nd3 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 3. Partie n°4, coup 11… Ngxe5?? — gaffe (−42 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Autre**
- Dernier coup adverse : 11. dxe5
- FEN avant mon coup : `r1bq1rk1/pppp1p2/2n5/4P1P1/4P1n1/2P5/PP6/RNBQKB1R b KQ - 0 11`

```
  +-----------------+
1 | R . B K Q B N R |
2 | . . . . . . P P |
3 | . . . . . P . . |
4 | . n . P . . . . |
5 | . P . P . . . . |
6 | . . . . . n . . |
7 | . . p . p p p p |
8 | . k r . q b . r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **11… Ngxe5** → win% 44 → 2
- Meilleur coup : **Ncxe5** — suite : 11… Ncxe5 12. Bf4 Kg7 13. Be2 Rh8 — bilan matériel au bout : 0
- Réfutation de mon coup : 12. Qh5 Nf3+ 13. Kd1 Nh2 14. Qxh2 — bilan matériel au bout : -3
- Menace avant mon coup (si l’adversaire rejouait) : 11. Qxg4 Kg7 12. Qf4 Rh8 13. Qf6+
- Ce que je pensais : (non renseigné)

### 4. Partie n°1, coup 8. d4?? — gaffe (−41 pts)

- Source : Chess.com · adversaire : yar100r (845)
- Ma couleur : Blancs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 7… Bg4
- FEN avant mon coup : `rn1q1rk1/pp2ppbp/2p2np1/3p4/2P1P1b1/2N2NP1/PP1P1PBP/R1BQ1RK1 w - - 2 8`

```
  +-----------------+
8 | r n . q . r k . |
7 | p p . . p p b p |
6 | . . p . . n p . |
5 | . . . p . . . . |
4 | . . P . P . b . |
3 | . . N . . N P . |
2 | P P . P . P B P |
1 | R . B Q . R K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **8. d4** → win% 52 → 11
- Meilleur coup : **cxd5** — suite : 8. cxd5 cxd5 9. e5 Nfd7 10. d4 — bilan matériel au bout : 0
- Réfutation de mon coup : 8… dxe4 9. Nxe4 Nxe4 10. Bf4 Nd6 — bilan matériel au bout : -3
- Ce que je pensais : (non renseigné)

### 5. Partie n°4, coup 7… g5?? — gaffe (−40 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 7. h4
- FEN avant mon coup : `r1bq1rk1/pppp1pp1/2nb1n1p/4N3/3P1PPP/2P5/PP2P3/RNBQKB1R b KQ - 0 7`

```
  +-----------------+
1 | R . B K Q B N R |
2 | . . . P . . P P |
3 | . . . . . P . . |
4 | P P P . P . . . |
5 | . . . N . . . . |
6 | p . n . b n . . |
7 | . p p . p p p p |
8 | . k r . q b . r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **7… g5** → win% 54 → 14
- Meilleur coup : **Bxe5** — suite : 7… Bxe5 8. g5 Bd6 9. gxf6 Qxf6 — bilan matériel au bout : 0
- Réfutation de mon coup : 8. hxg5 Bxe5 9. gxf6 Bxf6 10. Qd3 — bilan matériel au bout : -1
- Ce que je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »

### 6. Partie n°3, coup 13. Nxb5?? — gaffe (−39 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : milieu · motif : **Menace ignorée** (aussi : Pièce laissée en prise)
- Dernier coup adverse : 12… axb5
- FEN avant mon coup : `r2qr1k1/2p2ppp/2npbn2/1p2p3/1P2P1P1/2NP1P2/2P4P/R1BQKB1R w KQ - 0 13`

```
  +-----------------+
8 | r . . q r . k . |
7 | . . p . . p p p |
6 | . . n p b n . . |
5 | . p . . p . . . |
4 | . P . . P . P . |
3 | . . N P . P . . |
2 | . . P . . . . P |
1 | R . B Q K B . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **13. Nxb5** → win% 46 → 7
- Meilleur coup : **Rxa8** — suite : 13. Rxa8 Qxa8 14. Nxb5 Qb8 15. c4 — bilan matériel au bout : +1
- Réfutation de mon coup : 13… Rxa1 14. Be2 Nxb4 15. O-O Ra8 — bilan matériel au bout : -5
- Menace avant mon coup (si l’adversaire rejouait) : 13… Rxa1 14. Be2 Nd4 15. O-O Ra8
- Ce que je pensais : (non renseigné)

### 7. Partie n°3, coup 7. b3?? — gaffe (−37 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 6… Be6
- FEN avant mon coup : `r2qk2r/ppp2ppp/2npbn2/4p3/1b2P1P1/2NP1P2/PPP1N2P/R1BQKB1R w KQkq - 1 7`

```
  +-----------------+
8 | r . . q k . . r |
7 | p p p . . p p p |
6 | . . n p b n . . |
5 | . . . . p . . . |
4 | . b . . P . P . |
3 | . . N P . P . . |
2 | P P P . N . . P |
1 | R . B Q K B . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **7. b3** → win% 47 → 10
- Meilleur coup : **a3** — suite : 7. a3 Ba5 8. b4 Bb6 9. Na4 — bilan matériel au bout : 0
- Réfutation de mon coup : 7… Nd4 8. Kf2 Nxg4+ 9. fxg4 Qh4+ — bilan matériel au bout : +2
- Ce que je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »

## 3. Mes parties (les 5 : défaites, puis nulles, puis victoires)

Sur la période : 4 défaites, 0 nulle, 1 victoire.

### Partie n°5 — défaite, Maia contre Maia-3 (881) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°5"]
[Date "2026.11.27"]
[White "Moi (831)"]
[Black "Maia-3 (881)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... e5 2. d3 {win% 49} 2... Nc6 3. Nc3 {win% 49} 3... Bc5 4. Nf3 {win% 51} 4... d6 5. Be3 {win% 49} 5... Nf6 6. Bxc5 {win% 46} 6... dxc5 7. Qd2 {win% 47} 7... Nd4 8. O-O-O?! {win% 64→44, meilleur : Nxe5} 8... Be6 9. Ng5?! {win% 58→45, meilleur : Nxe5} 9... Bxa2 10. Nxa2 {win% 70} 10... h6 11. Nf3 {win% 75} 11... Nxf3 12. gxf3 {win% 82} 12... O-O 13. Bh3?! {win% 88→68, meilleur : Rg1} 13... Qd6 14. Nc3 {win% 76} 14... Rad8 15. Nb5 {win% 74} 15... Qb6 16. Na3 {win% 69} 16... c4 17. Nxc4 {win% 87} 17... Qa6 18. Rhg1?? {win% 89→2, meilleur : Qa5. Je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »} 18... Qa1# 0-1
```

### Partie n°4 — défaite, Maia contre Maia-3 (916) · répertoire : sorti au coup 1… (e5 au lieu de d5)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.27"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. d4 e5 {win% 39} 2. Nf3 Nc6?! {win% 53→37, meilleur : e4} 3. c3 Nf6?! {win% 51→36, meilleur : e4} 4. Nxe5 Bd6 {win% 31} 5. f4 O-O {win% 34} 6. g4 h6?! {win% 53→39, meilleur : Bxe5} 7. h4 g5?? {win% 54→14, meilleur : Bxe5. Je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »} 8. hxg5 hxg5 {win% 8} 9. fxg5 Nxg4 {win% 2} 10. e4 Bxe5 {win% 12} 11. dxe5 Ngxe5?? {win% 44→2, meilleur : Ncxe5} 12. Qh5 d6 {win% 2} 13. Qh7# 1-0
```

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.27"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... e5 2. d3 {win% 50} 2... Nc6 3. f3?! {win% 50→39, meilleur : Nf3} 3... Nf6 4. Nc3 {win% 39} 4... Bb4 5. Ne2 {win% 39} 5... d6 6. g4 {win% 44} 6... Be6 7. b3?? {win% 47→10, meilleur : a3. Je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »} 7... O-O 8. a3 {win% 24} 8... Bxc3+ 9. Nxc3 {win% 45} 9... Re8 10. b4?! {win% 48→38, meilleur : Bg2} 10... a6 11. a4?! {win% 46→30, meilleur : Bg2} 11... b5 12. axb5 {win% 43} 12... axb5 13. Nxb5?? {win% 46→7, meilleur : Rxa8} 13... Rxa1 14. Qd2 {win% 6} 14... Nd4 15. Nc3 {win% 2} 15... Nxf3+ 16. Kd1 {win% 2} 16... Nxd2 17. Kxd2 {win% 2} 17... Bxg4 18. Rg1 {win% 2} 18... Qa8 19. Bg2 {win% 2} 19... c6 20. Rf1 {win% 2} 20... d5 21. Rf5 {win% 2} 21... Bxf5 22. exf5 {win% 2} 22... d4 23. Ne2 {win% 2} 23... Ng4 24. b5 {win% 2} 24... cxb5 25. c4 {win% 2} 25... b4 26. Nxd4 {win% 2} 26... exd4 27. c5 {win% 2} 27... Qxg2+ 28. Kd1 {win% 2} 28... Qe2# 0-1
```

### Partie n°1 — défaite, Chess.com contre yar100r (845) · répertoire : suivi ; adversaire sorti au coup 1… (g6)

```pgn
[Event "Chess.com — partie n°1"]
[Site "https://www.chess.com/game/live/186577292142"]
[Date "2026.11.05"]
[White "Moi (lightning_light, 346)"]
[Black "yar100r (845)"]
[Result "0-1"]
[Termination "Échec et mat"]
[TimeControl "900+10"]

1. c4 {win% 51} 1... g6 2. Nc3 {win% 52} 2... Bg7 3. g3 {win% 51} 3... Nf6 4. Bg2 {win% 53} 4... O-O 5. e4 {win% 50} 5... c6 6. Nf3 {win% 54} 6... d5 7. O-O?! {win% 54→36, meilleur : cxd5} 7... Bg4 8. d4?? {win% 52→11, meilleur : cxd5} 8... dxe4 9. Ne5 {win% 6} 9... Bxd1 10. Nxd1 {win% 6} 10... Qxd4 11. Bf4 {win% 5} 11... g5 12. Bxg5 {win% 4} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 2} 14... exf3 15. Bxf3 {win% 3} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
```

### Partie n°2 — victoire, Chess.com contre smarts00001 (315) · répertoire : suivi ; adversaire sorti au coup 4. (e5)

```pgn
[Event "Chess.com — partie n°2"]
[Site "https://www.chess.com/game/live/187493069154"]
[Date "2026.11.18"]
[White "smarts00001 (315)"]
[Black "Moi (lightning_light, 362)"]
[Result "0-1"]
[Termination "Échec et mat"]
[TimeControl "900+10"]

1. e4 c5 {win% 46} 2. Nf3 Nc6 {win% 47} 3. Nc3 g6 {win% 46} 4. e5 Bg7 {win% 61} 5. d4 cxd4 {win% 59} 6. Nd5 e6?! {win% 89→77, meilleur : Qa5+} 7. Nf4 d5?! {win% 77→61, meilleur : d6} 8. Bb5 a6?? {win% 88→44, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 45} 10. O-O h5 {win% 43} 11. Nxd4 Bb7 {win% 43} 12. b4 Bxe5 {win% 56} 13. Nde2 g5 {win% 75} 14. Nd3 Bxa1 {win% 75} 15. Bxg5 Qxg5 {win% 85} 16. Qxa1 Nf6 {win% 84} 17. Nc5 O-O {win% 78} 18. Nxb7 Kh7 {win% 77} 19. Nd4 Rg8 {win% 74} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `r2qk2r/ppp2ppp/2npbn2/4p3/1b2P1P1/2NP1P2/PPP1N2P/R1BQKB1R w KQkq - 1 7` | Blancs | a3 | 2 / 2 | erreur (j’avais joué b3) |

## 5. Échiquier (mode « Maîtrise de l’échiquier »)

Mode pas encore commencé.

## 6. Lignes du répertoire (« Jouer les lignes »)

Une partie = une ligne du répertoire ; l’adversaire joue exactement la ligne, je dois trouver mes coups. ✓ = ligne jouée sans erreur dans le tour en cours.

| Ouverture | Couleur | Lignes validées (✓) | Tour |
|---|---|---|---|
| Anglaise (système fermé) | Blancs | 0 / 15 | 1 |
| Système …c5 / …g6 (Dragon accéléré) | Noirs | 0 / 30 | 1 |
| Système de Londres | Blancs | 0 / 13 | 1 |
| Londres en défense | Noirs | 0 / 17 | 1 |

### Erreurs (0)

Aucune.

## 7. Lecture des menaces (« Lis la menace »)

Aucune carte « Lis la menace » pour l’instant.

## 8. Pièges d’ouverture

Maîtrisés : **0/13** · en cours : 0 · pas commencés : 13. Maîtrisé = « Défends-toi » et « Punis-le » réussis sans indice, deux jours différents.

| Piège | Chapitre | État | Défends-toi (sans indice / essais) | Punis-le (sans indice / essais) |
|---|---|---|---|---|
| Mat du berger (dame en h5) | Mats rapides | nouveau | 0 / 0 | 0 / 0 |
| Mat du berger (dame en f3) | Mats rapides | nouveau | 0 / 0 | 0 / 0 |
| Mat du fou (pions f et g) | Mats rapides | nouveau | 0 / 0 | 0 / 0 |
| Mat de Légal | Mats rapides | nouveau | 0 / 0 | 0 / 0 |
| Le cavalier g5 sur f7 | Mats rapides | nouveau | 0 / 0 | 0 / 0 |
| Fourchette de cavalier en c2 | Dame perdue | nouveau | 0 / 0 | 0 / 0 |
| Clouage de la dame sur le roi (piège de l’éléphant) | Dame perdue | nouveau | 0 / 0 | 0 / 0 |
| Échec à la découverte (Petrov) | Dame perdue | nouveau | 0 / 0 | 0 / 0 |
| Pion empoisonné en b2 | Dame perdue | nouveau | 0 / 0 | 0 / 0 |
| Gambit Englund : le fou en c3 | Pièges de mes ouvertures | nouveau | 0 / 0 | 0 / 0 |
| Anglaise : reprendre en d5 avec la dame | Pièges de mes ouvertures | nouveau | 0 / 0 | 0 / 0 |
| Mon système …g6 contre le fou c4 et la dame f3 | Pièges de mes ouvertures | nouveau | 0 / 0 | 0 / 0 |
| Londres en défense : le fou g6 enfermé | Pièges de mes ouvertures | nouveau | 0 / 0 | 0 / 0 |

### Pièges où je suis tombé dans mes vraies parties (0)

Aucun.
