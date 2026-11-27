# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 27/11/2026 17:29. Période : toutes les parties (premier rapport) — 5 parties.

**Demande :** je suis débutant. À partir de ces données (calculées automatiquement, pas devinées), diagnostique mes lacunes principales, explique-les simplement et propose-moi 3 axes de travail concrets.

## Objectif en cours (« Mon objectif » : une règle à la fois)

**Ne rien donner** — règle : « Avant de lâcher la pièce : après mon coup, quels sont SES échecs, SES prises, SES attaques ? »

- Début : 27/11/2026 ; 3 parties mesurées depuis (analysées, 10 coups au moins).
- **1/10** parties propres sur les 3 dernières : ✗ ✓ ✗ (maîtrisé à 7/10, 10 parties au moins).
- Point de départ : 1/2 parties propres sur les 2 d’avant le début.
- À surveiller (gaffes des autres motifs sur les 10 dernières parties) : Erreur de position (pas de perte de matériel tout de suite) ×2, Mat ouvert ×1, Gain raté ×1, sorties du répertoire par moi ×3.

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
  - *Menace ignorée* : si l’adversaire avait pu rejouer avant mon coup, il gagnait au moins 2 points de matériel (mesuré sur 4 demi-coups : lui, moi, lui, moi) ou matait, et mon coup ne l’en empêche pas.
  - *Pièce laissée en prise* : dans la réfutation de mon coup, l’adversaire gagne au moins 2 points sur 4 demi-coups (lui, moi, lui, moi) : une fourchette avec échec compte.
  - *Gain raté* : je pouvais gagner au moins 2 points de matériel (sur les 3 premiers demi-coups de la meilleure suite) ou mater, et mon coup ne le fait pas.
  - *Erreur de position (pas de perte de matériel tout de suite)* : aucun des cas précédents (souvent positionnel ou stratégique).

## 1. Résumé de la période

### Niveau (parties contre Maia)

Début : **900** → fin : **797** (-103).

Classement Chess.com (pour information) : 346 → 362.

| Partie | Date | Source | Couleur | Adversaire | Résultat | Fin | Répertoire | Niveau après |
|---|---|---|---|---|---|---|---|---|
| n°1 | 05/11/2026 | Chess.com | Blancs | yar100r (845) | Défaite (0-1) | Échec et mat | suivi ; adversaire sorti au coup 1… (g6) | – |
| n°2 | 18/11/2026 | Chess.com | Noirs | smarts00001 (315) | Victoire (0-1) | Échec et mat | suivi ; adversaire sorti au coup 4. (e5) | – |
| n°3 | 27/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 866 |
| n°4 | 27/11/2026 | Maia | Noirs | Maia-3 (916) | Défaite (1-0) | Échec et mat | **sorti au coup 1…** (e5 au lieu de c5) | 831 |
| n°5 | 27/11/2026 | Maia | Blancs | Maia-3 (881) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 797 |

### Résultats

Victoires / nulles / défaites : **1 / 0 / 4**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 0 / 0 / 3 | 52,5 % | 0,7 | 1,7 |
| Chess.com | 2 | 1 / 0 / 1 | 71,4 % | 0 | 1 |

### Par ouverture

| Ouverture | Parties | V / N / D | Resté dans mon répertoire jusqu’au coup 8 | Sorti moi-même avant | Adversaire sorti avant |
|---|---|---|---|---|---|
| Système …c5 / …g6 (Dragon accéléré) | 2 | 1 / 0 / 1 | 0 | 1 | 1 |
| Hors répertoire (Blancs) | 2 | 0 / 0 / 2 | 0 | 2 | 0 |
| Anglaise (système fermé) | 1 | 0 / 0 / 1 | 0 | 0 | 1 |

**Resté dans mon répertoire jusqu’au coup 8 : 0 / 5 parties (0 %)** — sorti moi-même avant : 3 (60 %) ; l’adversaire en est sorti avant : 2 (40 %).

- Contre Maia : 0 / 3 (0 %) · sur Chess.com : 0 / 2 (0 %).

#### Coups par lesquels l’adversaire sort de mon répertoire (vus au moins 2 fois)

Aucun coup vu 2 fois sur la période.

### Imprécisions, erreurs, gaffes par partie

| Partie | Mes coups | Précision | Imprécisions | Erreurs | Gaffes |
|---|---|---|---|---|---|
| n°1 | 25 | 72 % | 1 | 0 | 1 |
| n°2 | 20 | 70,8 % | 4 | 0 | 1 |
| n°3 | 18 | 56,4 % | 2 | 0 | 2 |
| n°4 | 20 | 39,9 % | 2 | 2 | 2 |
| n°5 | 16 | 61,1 % | 0 | 0 | 1 |
| **Moyenne par partie** | 19,8 | 60 % | 1,8 | 0,4 | 1,4 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 50 | 7 | 0 | 3 | 0,6 |
| Milieu | 47 | 2 | 2 | 4 | 1,3 |
| Finale | 2 | 0 | 0 | 0 | 0 |

### Motifs des erreurs et gaffes

Sur 9 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 1 |
| Menace ignorée | 2 |
| Pièce laissée en prise | 1 |
| Gain raté | 2 |
| Erreur de position (pas de perte de matériel tout de suite) | 3 |

### Ce que je pensais (réponse en un toucher), par motif

Réponses données sur 3 de mes 9 erreurs et gaffes (dans la revue, avant de voir le meilleur coup).

| Motif | Menace pas vue | Mal calculé | Autre cible | Trop vite | Ne sait pas | Sans réponse |
|---|---|---|---|---|---|---|
| Mat raté | 0 | 0 | 0 | 0 | 0 | 0 |
| Mat ouvert | 0 | 0 | 0 | 0 | 0 | 1 |
| Menace ignorée | 1 | 0 | 0 | 0 | 0 | 1 |
| Pièce laissée en prise | 0 | 0 | 1 | 0 | 0 | 0 |
| Gain raté | 0 | 0 | 0 | 0 | 0 | 2 |
| Erreur de position (pas de perte de matériel tout de suite) | 0 | 1 | 0 | 0 | 0 | 2 |
| **Total** | **1** | **1** | **1** | **0** | **0** | **6** |

Réponses : Menace pas vue = « Je n’ai pas vu la menace » ; Mal calculé = « J’ai vu, mais mal calculé » ; Autre cible = « Je voulais attaquer autre chose » ; Trop vite = « J’ai joué trop vite » ; Ne sait pas = « Je ne sais pas ».

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Lis la menace : 0 tentatives, réussite – (détail en section 7).
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (9, tri par chute de win%)

### 1. Partie n°4, coup 16… Bxd5?? — gaffe (−89 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Mat ouvert** (aussi : Menace ignorée, Pièce laissée en prise, Gain raté)
- Dernier coup adverse : 16. Nd5
- FEN avant mon coup : `rn2r1k1/ppp2ppp/4b3/q2N4/3b4/8/PPPBQ1PP/2KR1B1R b - - 1 16`

```
  +-----------------+
1 | R . B . R K . . |
2 | P P . Q B P P P |
3 | . . . . . . . . |
4 | . . . . b . . . |
5 | . . . . N . . q |
6 | . . . b . . . . |
7 | p p p . . p p p |
8 | . k . r . . n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **16… Bxd5** → win% 92 → 2
- Meilleur coup : **Qxd5** — suite : 16… Qxd5 17. Bc3 Qg5+ 18. Bd2 Qf6 — bilan matériel au bout : +4
- Réfutation de mon coup : 17. Qxe8# — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 16. Bxa5 c5 17. Rxd4 cxd4 18. Qf2
- Ce que je pensais : (non renseigné)

### 2. Partie n°3, coup 13. Bxd5?? — gaffe (−47 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : milieu · motif : **Menace ignorée** (aussi : Pièce laissée en prise)
- Dernier coup adverse : 12… d5
- FEN avant mon coup : `r1b2rk1/pp3ppp/5q2/2pp4/2B1P1Q1/2NPB3/PPP2PPP/R3K2R w KQ - 0 13`

```
  +-----------------+
8 | r . b . . r k . |
7 | p p . . . p p p |
6 | . . . . . q . . |
5 | . . p p . . . . |
4 | . . B . P . Q . |
3 | . . N P B . . . |
2 | P P P . . P P P |
1 | R . . . K . . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **13. Bxd5** → win% 95 → 48
- Meilleur coup : **Nxd5** — suite : 13. Nxd5 Bxg4 14. Nxf6+ gxf6 15. Bxc5 — bilan matériel au bout : +6
- Réfutation de mon coup : 13… Bxg4 14. O-O Rac8 15. Rab1 Qa6 — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 13… Bxg4 14. Nxd5 Qxb2 15. O-O b6
- Ce que je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »

### 3. Partie n°5, coup 3. Qh5?? — gaffe (−46 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : ouverture · motif : **Pièce laissée en prise**
- Dernier coup adverse : 2… Nf6
- FEN avant mon coup : `rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3`

```
  +-----------------+
8 | r n b q k b . r |
7 | p p p p . p p p |
6 | . . . . . n . . |
5 | . . . . p . . . |
4 | . . B . P . . . |
3 | . . . . . . . . |
2 | P P P P . P P P |
1 | R N B Q K . N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **3. Qh5** → win% 50 → 4
- Meilleur coup : **Nc3** — suite : 3. Nc3 Nc6 4. d3 Na5 5. Nge2 — bilan matériel au bout : 0
- Réfutation de mon coup : 3… Nxh5 4. d4 Nf4 5. Nf3 Nxg2+ — bilan matériel au bout : -10
- Ce que je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »

### 4. Partie n°2, coup 8… a6?? — gaffe (−43 pts)

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

- Mon coup : **8… a6** → win% 88 → 45
- Meilleur coup : **Qa5+** — suite : 8… Qa5+ 9. c3 Qxb5 10. cxd4 Nge7 — bilan matériel au bout : +3
- Réfutation de mon coup : 9. Bxc6+ bxc6 10. Qxd4 a5 11. Nd3 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 5. Partie n°1, coup 8. d4?? — gaffe (−42 pts)

- Source : Chess.com · adversaire : yar100r (845)
- Ma couleur : Blancs · phase : ouverture · motif : **Menace ignorée** (aussi : Pièce laissée en prise)
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
- Meilleur coup : **cxd5** — suite : 8. cxd5 cxd5 9. e5 Ne4 10. d4 — bilan matériel au bout : 0
- Réfutation de mon coup : 8… dxe4 9. Nxe4 Nxe4 10. Qb3 Nd6 — bilan matériel au bout : -3
- Menace avant mon coup (si l’adversaire rejouait) : 8… dxe4 9. Nxe4 Nxe4 10. d4 Nd6
- Ce que je pensais : (non renseigné)

### 6. Partie n°4, coup 11… Be6?? — gaffe (−35 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Erreur de position (pas de perte de matériel tout de suite)**
- Dernier coup adverse : 11. O-O-O
- FEN avant mon coup : `rnb1r1k1/ppp2ppp/3q4/4b3/8/2NPB3/PPP1Q1PP/2KR1B1R b - - 4 11`

```
  +-----------------+
1 | R . B . R K . . |
2 | P P . Q . P P P |
3 | . . . B P N . . |
4 | . . . . . . . . |
5 | . . . b . . . . |
6 | . . . . q . . . |
7 | p p p . . p p p |
8 | . k . r . b n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **11… Be6** → win% 80 → 46
- Meilleur coup : **Bxc3** — suite : 11… Bxc3 12. bxc3 Qe5 13. Re1 Qxc3 — bilan matériel au bout : +1
- Réfutation de mon coup : 12. d4 Bf4 13. Nb5 Bxe3+ 14. Qxe3 — bilan matériel au bout : 0
- Ce que je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »

### 7. Partie n°3, coup 15. Bxb7?? — gaffe (−33 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : milieu · motif : **Erreur de position (pas de perte de matériel tout de suite)**
- Dernier coup adverse : 14… Rfc8
- FEN avant mon coup : `r1r3k1/pp3ppp/5q2/2BB4/4P1b1/2NP4/PPP2PPP/R3K2R w KQ - 1 15`

```
  +-----------------+
8 | r . r . . . k . |
7 | p p . . . p p p |
6 | . . . . . q . . |
5 | . . B B . . . . |
4 | . . . . P . b . |
3 | . . N P . . . . |
2 | P P P . . P P P |
1 | R . . . K . . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **15. Bxb7** → win% 49 → 16
- Meilleur coup : **d4** — suite : 15. d4 Qa6 16. f3 Be6 17. O-O-O — bilan matériel au bout : 0
- Réfutation de mon coup : 15… Rxc5 16. Bxa8 Rxc3 17. O-O Rxc2 — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 15… Rxc5 16. d4 Rc7 17. Bb3 Qd8
- Ce que je pensais : (non renseigné)

### 8. Partie n°4, coup 13… Qa5? — erreur (−29 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Erreur de position (pas de perte de matériel tout de suite)**
- Dernier coup adverse : 13. Nc3
- FEN avant mon coup : `rn2r1k1/ppp2ppp/4b3/3qb3/8/2NPB3/PPP1Q1PP/2KR1B1R b - - 8 13`

```
  +-----------------+
1 | R . B . R K . . |
2 | P P . Q . P P P |
3 | . . . B P N . . |
4 | . . . . . . . . |
5 | . . . b q . . . |
6 | . . . b . . . . |
7 | p p p . . p p p |
8 | . k . r . . n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **13… Qa5** → win% 80 → 51
- Meilleur coup : **Bxc3** — suite : 13… Bxc3 14. bxc3 Nc6 15. Re1 Qa5 — bilan matériel au bout : 0
- Réfutation de mon coup : 14. d4 Bf6 15. Qb5 Qxb5 16. Bxb5 — bilan matériel au bout : 0
- Menace avant mon coup (si l’adversaire rejouait) : 13. Nxd5 Bxd5 14. c4 Bc6 15. Qf2
- Ce que je pensais : (non renseigné)

### 9. Partie n°4, coup 18… Be3+? — erreur (−24 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Gain raté**
- Dernier coup adverse : 18. Bxe2
- FEN avant mon coup : `rn4k1/ppp2ppp/8/B2b4/3b4/8/PPP1B1PP/2KR3R b - - 0 18`

```
  +-----------------+
1 | R . . . R K . . |
2 | P P . B . P P P |
3 | . . . . . . . . |
4 | . . . . b . . . |
5 | . . . . b . . B |
6 | . . . . . . . . |
7 | p p p . . p p p |
8 | . k . . . . n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **18… Be3+** → win% 36 → 12
- Meilleur coup : **Nc6** — suite : 18… Nc6 19. Bf3 Bxf3 20. gxf3 Be5 — bilan matériel au bout : -1
- Réfutation de mon coup : 19. Kb1 c6 20. Bf3 Nd7 21. Bxd5 — bilan matériel au bout : -4
- Menace avant mon coup (si l’adversaire rejouait) : 18. Rxd4 c6 19. c4 b6 20. Bc3
- Ce que je pensais : (non renseigné)

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

1. e4 {win% 53} 1... e5 2. Bc4 {win% 50} 2... Nf6 3. Qh5?? {win% 50→4, meilleur : Nc3. Je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »} 3... Nxh5 4. d3 {win% 4} 4... Nf4 5. Nf3 {win% 4} 5... Nxg2+ 6. Kf1 {win% 4} 6... Nf4 7. Nxe5 {win% 4} 7... Qf6 8. Nxf7 {win% 2} 8... Rg8 9. Bxf4 {win% 6} 9... Qxf4 10. Nc3 {win% 2} 10... Nc6 11. Re1 {win% 4} 11... Nd4 12. Ne2 {win% 3} 12... Qf3 13. Rg1 {win% 4} 13... Bc5 14. Rg3 {win% 7} 14... Qf6 15. c3 {win% 3} 15... Nc2 16. Rc1 {win% 2} 16... Qxf2# 0-1
```

### Partie n°4 — défaite, Maia contre Maia-3 (916) · répertoire : sorti au coup 1… (e5 au lieu de c5)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.27"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. e4 e5 {win% 47} 2. Nf3 Nf6 {win% 46} 3. Nxe5 Nxe4 {win% 44} 4. Qe2 d5 {win% 36} 5. f3 Bd6?! {win% 71→52, meilleur : Qh4+} 6. fxe4 Bxe5 {win% 52} 7. exd5 Qxd5 {win% 56} 8. Nc3 Qd6?! {win% 57→42, meilleur : Qe6} 9. d3 O-O {win% 65} 10. Be3 Re8 {win% 65} 11. O-O-O Be6?? {win% 80→46, meilleur : Bxc3. Je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »} 12. Ne4 Qd5 {win% 58} 13. Nc3 Qa5? {win% 80→51, meilleur : Bxc3} 14. d4 Bf6 {win% 52} 15. Bd2 Bxd4 {win% 66} 16. Nd5 Bxd5?? {win% 92→2, meilleur : Qxd5} 17. Bxa5 Rxe2 {win% 19} 18. Bxe2 Be3+? {win% 36→12, meilleur : Nc6} 19. Bd2 Bxd2+ {win% 11} 20. Rxd2 Bxg2 {win% 2} 21. Rd8# 1-0
```

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.27"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... e5 2. Nf3 {win% 53} 2... Nc6 3. Nc3 {win% 52} 3... Nf6 4. Bc4 {win% 49} 4... Bc5 5. d3 {win% 52} 5... Nd4 6. Nxe5 {win% 61} 6... Qe7 7. Nf3 {win% 66} 7... Ng4 8. Be3?! {win% 87→67, meilleur : Nxd4} 8... O-O 9. Nxd4 {win% 91} 9... Bxd4 10. Bxd4 {win% 93} 10... c5 11. Be3 {win% 93} 11... Qf6 12. Qxg4 {win% 96} 12... d5 13. Bxd5?? {win% 95→48, meilleur : Nxd5. Je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »} 13... Bxg4 14. Bxc5 {win% 48} 14... Rfc8 15. Bxb7?? {win% 49→16, meilleur : d4} 15... Rxc5 16. Bxa8 {win% 14} 16... Rxc3 17. bxc3?! {win% 15→2, meilleur : O-O} 17... Qxc3+ 18. Kf1 {win% 2} 18... Qxa1# 0-1
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

1. c4 {win% 51} 1... g6 2. Nc3 {win% 52} 2... Bg7 3. g3 {win% 52} 3... Nf6 4. Bg2 {win% 52} 4... O-O 5. e4 {win% 49} 5... c6 6. Nf3 {win% 54} 6... d5 7. O-O?! {win% 53→35, meilleur : cxd5} 7... Bg4 8. d4?? {win% 52→11, meilleur : cxd5} 8... dxe4 9. Ne5 {win% 9} 9... Bxd1 10. Nxd1 {win% 7} 10... Qxd4 11. Bf4 {win% 6} 11... g5 12. Bxg5 {win% 4} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 2} 14... exf3 15. Bxf3 {win% 3} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
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

1. e4 c5 {win% 46} 2. Nf3 Nc6 {win% 46} 3. Nc3 g6 {win% 48} 4. e5 Bg7 {win% 60} 5. d4 cxd4 {win% 59} 6. Nd5 e6?! {win% 89→77, meilleur : Qa5+} 7. Nf4 d5?! {win% 76→63, meilleur : d6} 8. Bb5 a6?? {win% 88→45, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 46} 10. O-O h5?! {win% 52→41, meilleur : c5} 11. Nxd4 Bb7?! {win% 51→41, meilleur : c5} 12. b4 Bxe5 {win% 54} 13. Nde2 g5 {win% 74} 14. Nd3 Bxa1 {win% 74} 15. Bxg5 Qxg5 {win% 84} 16. Qxa1 Nf6 {win% 82} 17. Nc5 O-O {win% 78} 18. Nxb7 Kh7 {win% 74} 19. Nd4 Rg8 {win% 75} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `r1b2rk1/pp3ppp/5q2/2pp4/2B1P1Q1/2NPB3/PPP2PPP/R3K2R w KQ - 0 13` | Blancs | Nxd5 | 2 / 2 | erreur (j’avais joué Bxd5) |

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
