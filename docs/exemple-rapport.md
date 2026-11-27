# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 27/11/2026 11:46. Période : toutes les parties (premier rapport) — 5 parties.

**Demande :** je suis débutant. À partir de ces données (calculées automatiquement, pas devinées), diagnostique mes lacunes principales, explique-les simplement et propose-moi 3 axes de travail concrets.

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
| n°3 | 27/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Abandon | hors répertoire dès le 1er coup (e4 au lieu de c4) | 866 |
| n°4 | 27/11/2026 | Maia | Noirs | Maia-3 (916) | Défaite (1-0) | Échec et mat | **sorti au coup 1…** (d5 au lieu de c5) | 831 |
| n°5 | 27/11/2026 | Maia | Blancs | Maia-3 (881) | Défaite (0-1) | Échec et mat | **sorti au coup 2.** (Bg5 au lieu de Bf4) | 797 |

### Résultats

Victoires / nulles / défaites : **1 / 0 / 4**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 0 / 0 / 3 | 48,3 % | 0,7 | 1,7 |
| Chess.com | 2 | 1 / 0 / 1 | 72,2 % | 0 | 1 |

### Par ouverture

| Ouverture | Parties | V / N / D | Resté dans mon répertoire jusqu’au coup 8 | Sorti moi-même avant | Adversaire sorti avant |
|---|---|---|---|---|---|
| Système …c5 / …g6 (Dragon accéléré) | 2 | 1 / 0 / 1 | 0 | 1 | 1 |
| Anglaise (système fermé) | 1 | 0 / 0 / 1 | 0 | 0 | 1 |
| Hors répertoire (Blancs) | 1 | 0 / 0 / 1 | 0 | 1 | 0 |
| Système de Londres | 1 | 0 / 0 / 1 | 0 | 1 | 0 |

**Resté dans mon répertoire jusqu’au coup 8 : 0 / 5 parties (0 %)** — sorti moi-même avant : 3 (60 %) ; l’adversaire en est sorti avant : 2 (40 %).

- Contre Maia : 0 / 3 (0 %) · sur Chess.com : 0 / 2 (0 %).

#### Coups par lesquels l’adversaire sort de mon répertoire (vus au moins 2 fois)

Aucun coup vu 2 fois sur la période.

### Imprécisions, erreurs, gaffes par partie

| Partie | Mes coups | Précision | Imprécisions | Erreurs | Gaffes |
|---|---|---|---|---|---|
| n°1 | 25 | 73,1 % | 1 | 0 | 1 |
| n°2 | 20 | 71,2 % | 2 | 0 | 1 |
| n°3 | 45 | 55,8 % | 1 | 0 | 2 |
| n°4 | 12 | 33 % | 0 | 0 | 3 |
| n°5 | 12 | 56,1 % | 2 | 2 | 0 |
| **Moyenne par partie** | 22,8 | 57,9 % | 1,2 | 0,4 | 1,4 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 50 | 5 | 2 | 4 | 1,2 |
| Milieu | 42 | 1 | 0 | 1 | 0,2 |
| Finale | 22 | 0 | 0 | 2 | 0,9 |

### Motifs des erreurs et gaffes

Sur 9 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 1 |
| Mat ouvert | 1 |
| Menace ignorée | 1 |
| Pièce laissée en prise | 0 |
| Gain raté | 3 |
| Autre | 3 |

### Ce que je pensais (réponse en un toucher), par motif

Réponses données sur 3 de mes 9 erreurs et gaffes (dans la revue, avant de voir le meilleur coup).

| Motif | Menace pas vue | Mal calculé | Autre cible | Trop vite | Ne sait pas | Sans réponse |
|---|---|---|---|---|---|---|
| Mat raté | 0 | 0 | 0 | 0 | 0 | 1 |
| Mat ouvert | 0 | 0 | 0 | 0 | 0 | 1 |
| Menace ignorée | 1 | 0 | 0 | 0 | 0 | 0 |
| Pièce laissée en prise | 0 | 0 | 0 | 0 | 0 | 0 |
| Gain raté | 0 | 1 | 0 | 0 | 0 | 2 |
| Autre | 0 | 0 | 1 | 0 | 0 | 2 |
| **Total** | **1** | **1** | **1** | **0** | **0** | **6** |

Réponses : Menace pas vue = « Je n’ai pas vu la menace » ; Mal calculé = « J’ai vu, mais mal calculé » ; Autre cible = « Je voulais attaquer autre chose » ; Trop vite = « J’ai joué trop vite » ; Ne sait pas = « Je ne sais pas ».

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (9, tri par chute de win%)

### 1. Partie n°3, coup 27. Rxa7?? — gaffe (−87 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : finale · motif : **Mat raté** (aussi : Pièce laissée en prise, Gain raté)
- Dernier coup adverse : 26… Rf7
- FEN avant mon coup : `6k1/pR2Brpp/8/2b5/8/2P3P1/PP4KP/8 w - - 2 27`

```
  +-----------------+
8 | . . . . . . k . |
7 | p R . . B r p p |
6 | . . . . . . . . |
5 | . . b . . . . . |
4 | . . . . . . . . |
3 | . . P . . . P . |
2 | P P . . . . K P |
1 | . . . . . . . . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **27. Rxa7** → win% 98 → 11
- Meilleur coup : **Rb8+** — suite : 27. Rb8+ Rf8 28. Rxf8# — bilan matériel au bout : +7
- Réfutation de mon coup : 27… Bxa7 28. Ba3 Rf2+ 29. Kh1 Rd2 — bilan matériel au bout : -2
- Ce que je pensais : (non renseigné)

### 2. Partie n°4, coup 11… Qxg5?? — gaffe (−49 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Mat ouvert**
- Dernier coup adverse : 11. Bg5
- FEN avant mon coup : `r3kb1r/1ppbqppp/p7/3pN1B1/3P4/5Q2/PPP2PPP/R3K2R b KQkq - 1 11`

```
  +-----------------+
1 | R . . K . . . R |
2 | P P P . . P P P |
3 | . . Q . . . . . |
4 | . . . . P . . . |
5 | . B . N p . . . |
6 | . . . . . . . p |
7 | p p p q b p p . |
8 | r . b k . . . r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **11… Qxg5** → win% 51 → 2
- Meilleur coup : **f6** — suite : 11… f6 12. O-O fxg5 13. Rae1 O-O-O — bilan matériel au bout : +3
- Réfutation de mon coup : 12. Qxf7+ Kd8 13. Qxd7# — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 11. Bxe7 f6 12. Nxd7 Bxe7 13. O-O-O
- Ce que je pensais : (non renseigné)

### 3. Partie n°4, coup 6… e6?? — gaffe (−48 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : ouverture · motif : **Gain raté**
- Dernier coup adverse : 6. Bb5
- FEN avant mon coup : `r1bqkb1r/pppnpppp/8/1B1Nn3/8/5N2/PPPP1PPP/R1BQK2R b KQkq - 1 6`

```
  +-----------------+
1 | R . . K Q B . R |
2 | P P P . P P P P |
3 | . . N . . . . . |
4 | . . . . . . . . |
5 | . . . n N . B . |
6 | . . . . . . . . |
7 | p p p p n p p p |
8 | r . b k q b . r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **6… e6** → win% 87 → 39
- Meilleur coup : **c6** — suite : 6… c6 7. O-O Nxf3+ 8. Qxf3 cxd5 — bilan matériel au bout : +3
- Réfutation de mon coup : 7. Nxe5 exd5 8. Qf3 Qf6 9. Nxd7 — bilan matériel au bout : -3
- Menace avant mon coup (si l’adversaire rejouait) : 6. Nxe5 c6 7. Bxc6 bxc6 8. Nxc6
- Ce que je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »

### 4. Partie n°3, coup 25. Be7?? — gaffe (−42 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : finale · motif : **Menace ignorée** (aussi : Pièce laissée en prise)
- Dernier coup adverse : 24… Rf8
- FEN avant mon coup : `5rk1/pR4pp/8/2b3B1/8/2P3P1/PP5P/5R1K w - - 1 25`

```
  +-----------------+
8 | . . . . . r k . |
7 | p R . . . . p p |
6 | . . . . . . . . |
5 | . . b . . . B . |
4 | . . . . . . . . |
3 | . . P . . . P . |
2 | P P . . . . . P |
1 | . . . . . R . K |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **25. Be7** → win% 97 → 54
- Meilleur coup : **Rxf8+** — suite : 25. Rxf8+ Kxf8 26. Be3 Bxe3 27. b4 — bilan matériel au bout : +4
- Réfutation de mon coup : 25… Rxf1+ 26. Kg2 Rf2+ 27. Kh3 Bxe7 — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 25… Rxf1+ 26. Kg2 Rf2+ 27. Kh3 h6
- Ce que je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »

### 5. Partie n°2, coup 8… a6?? — gaffe (−42 pts)

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

- Mon coup : **8… a6** → win% 88 → 46
- Meilleur coup : **Qa5+** — suite : 8… Qa5+ 9. c3 Qxb5 10. cxd4 a5 — bilan matériel au bout : +3
- Réfutation de mon coup : 9. Bxc6+ bxc6 10. Qxd4 a5 11. Nd3 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 6. Partie n°1, coup 8. d4?? — gaffe (−40 pts)

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

- Mon coup : **8. d4** → win% 51 → 11
- Meilleur coup : **cxd5** — suite : 8. cxd5 cxd5 9. e5 Nfd7 10. d4 — bilan matériel au bout : 0
- Réfutation de mon coup : 8… dxe4 9. Nxe4 Nxe4 10. Bf4 Nd6 — bilan matériel au bout : -3
- Ce que je pensais : (non renseigné)

### 7. Partie n°4, coup 9… a6?? — gaffe (−34 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : ouverture · motif : **Gain raté**
- Dernier coup adverse : 9. d4
- FEN avant mon coup : `r1b1kb1r/pppnqppp/8/1B1pN3/3P4/5Q2/PPP2PPP/R1B1K2R b KQkq - 0 9`

```
  +-----------------+
1 | R . . K . B . R |
2 | P P P . . P P P |
3 | . . Q . . . . . |
4 | . . . . P . . . |
5 | . . . N p . B . |
6 | . . . . . . . . |
7 | p p p q n p p p |
8 | r . b k . b . r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **9… a6** → win% 80 → 46
- Meilleur coup : **f6** — suite : 9… f6 10. O-O fxe5 11. dxe5 c6 — bilan matériel au bout : +2
- Réfutation de mon coup : 10. Bxd7+ Bxd7 11. O-O Be6 12. c4 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 8. Partie n°5, coup 7. Bc4? — erreur (−24 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 6… fxe5
- FEN avant mon coup : `r1bqkbnr/ppp3pp/2n5/4p3/4p3/6B1/PPP2PPP/RN1QKBNR w KQkq - 0 7`

```
  +-----------------+
8 | r . b q k b n r |
7 | p p p . . . p p |
6 | . . n . . . . . |
5 | . . . . p . . . |
4 | . . . . p . . . |
3 | . . . . . . B . |
2 | P P P . . P P P |
1 | R N . Q K B N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **7. Bc4** → win% 50 → 27
- Meilleur coup : **Qxd8+** — suite : 7. Qxd8+ Kxd8 8. Nd2 Bf5 9. Ne2 — bilan matériel au bout : -1
- Réfutation de mon coup : 7… Qxd1+ 8. Kxd1 Bf5 9. Nd2 O-O-O — bilan matériel au bout : -1
- Ce que je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »

### 9. Partie n°5, coup 8. Ke2? — erreur (−22 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 7… Bb4+
- FEN avant mon coup : `r1bqk1nr/ppp3pp/2n5/4p3/1bB1p3/6B1/PPP2PPP/RN1QK1NR w KQkq - 2 8`

```
  +-----------------+
8 | r . b q k . n r |
7 | p p p . . . p p |
6 | . . n . . . . . |
5 | . . . . p . . . |
4 | . b B . p . . . |
3 | . . . . . . B . |
2 | P P P . . P P P |
1 | R N . Q K . N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **8. Ke2** → win% 41 → 20
- Meilleur coup : **Nd2** — suite : 8. Nd2 Bg4 9. Ne2 Qxd2+ 10. Qxd2 — bilan matériel au bout : +5
- Réfutation de mon coup : 8… Bg4+ 9. f3 Qxd1+ 10. Kxd1 exf3 — bilan matériel au bout : -2
- Ce que je pensais : (non renseigné)

## 3. Mes parties (les 5 : défaites, puis nulles, puis victoires)

Sur la période : 4 défaites, 0 nulle, 1 victoire.

### Partie n°5 — défaite, Maia contre Maia-3 (881) · répertoire : sorti au coup 2. (Bg5 au lieu de Bf4)

```pgn
[Event "Sparring Échecs — partie n°5"]
[Date "2026.11.27"]
[White "Moi (831)"]
[Black "Maia-3 (881)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. d4 {win% 52} 1... d5 2. Bg5 {win% 50} 2... f6 3. Bf4 {win% 49} 3... e5 4. Bg3 {win% 47} 4... Nc6 5. e4?! {win% 49→34, meilleur : dxe5} 5... dxe4 6. dxe5 {win% 27} 6... fxe5 7. Bc4? {win% 50→27, meilleur : Qxd8+. Je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »} 7... Bb4+ 8. Ke2? {win% 41→20, meilleur : Nd2} 8... Qxd1+ 9. Kxd1 {win% 27} 9... Nf6 10. Bh4 {win% 23} 10... Bg4+ 11. Kc1 {win% 23} 11... O-O-O 12. Bf7?! {win% 22→2, meilleur : Ne2} 12... Rd1# 0-1
```

### Partie n°4 — défaite, Maia contre Maia-3 (916) · répertoire : sorti au coup 1… (d5 au lieu de c5)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.27"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. e4 d5 {win% 44} 2. Nc3 Nf6 {win% 47} 3. e5 Nfd7 {win% 47} 4. Nf3 Nc6 {win% 41} 5. Nxd5 Ncxe5 {win% 47} 6. Bb5 e6?? {win% 87→39, meilleur : c6. Je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »} 7. Nxe5 exd5 {win% 37} 8. Qf3 Qe7 {win% 38} 9. d4 a6?? {win% 80→46, meilleur : f6} 10. Bxd7+ Bxd7 {win% 47} 11. Bg5 Qxg5?? {win% 51→2, meilleur : f6} 12. Qxf7+ Kd8 {win% 2} 13. Qxd7# 1-0
```

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.27"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Abandon"]

1. e4 {win% 53} 1... e5 2. Nc3 {win% 51} 2... Nf6 3. Nf3 {win% 51} 3... Bb4 4. Bc4 {win% 50} 4... c6 5. d4?! {win% 59→48, meilleur : Nxe5} 5... d5 6. exd5 {win% 50} 6... Nxd5 7. Bxd5 {win% 54} 7... cxd5 8. Nxe5 {win% 52} 8... Qe7 9. O-O {win% 64} 9... f6 10. Nxd5 {win% 93} 10... fxe5 11. Nxe7 {win% 94} 11... Kxe7 12. c3 {win% 96} 12... Ba5 13. dxe5 {win% 96} 13... Nc6 14. Bf4 {win% 94} 14... Rf8 15. g3 {win% 92} 15... Bh3 16. Re1 {win% 94} 16... Bb6 17. Bg5+ {win% 91} 17... Kf7 18. e6+ {win% 91} 18... Kg8 19. e7 {win% 89} 19... Bxf2+ 20. Kh1 {win% 92} 20... Nxe7 21. Rxe7 {win% 92} 21... Bc5 22. Rxb7 {win% 92} 22... Rf1+ 23. Qxf1 {win% 94} 23... Bxf1 24. Rxf1 {win% 94} 24... Rf8 25. Be7?? {win% 97→54, meilleur : Rxf8+. Je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »} 25... Rxf1+ 26. Kg2 {win% 55} 26... Rf7 27. Rxa7?? {win% 98→11, meilleur : Rb8+} 27... Bxa7 28. Bc5 {win% 6} 28... Bxc5 29. g4 {win% 6} 29... g5 30. h4 {win% 7} 30... Rf4 31. Kg3 {win% 6} 31... Bf2+ 32. Kh3 {win% 6} 32... Bxh4 33. Kg2 {win% 5} 33... Rf2+ 34. Kh3 {win% 5} 34... Rf3+ 35. Kg2 {win% 4} 35... Rf2+ 36. Kh3 {win% 3} 36... Rxb2 37. a4 {win% 2} 37... Rb3 38. Kg2 {win% 2} 38... Rxc3 39. a5 {win% 2} 39... Ra3 40. Kf1 {win% 2} 40... Rxa5 41. Kg1 {win% 2} 41... Ra3 42. Kh1 {win% 2} 42... Rg3 43. Kh2 {win% 2} 43... Rxg4 44. Kh3 {win% 2} 44... Rg3+ 45. Kh2 {win% 2} 45... h5 0-1
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

1. c4 {win% 51} 1... g6 2. Nc3 {win% 51} 2... Bg7 3. g3 {win% 52} 3... Nf6 4. Bg2 {win% 53} 4... O-O 5. e4 {win% 49} 5... c6 6. Nf3 {win% 54} 6... d5 7. O-O?! {win% 53→37, meilleur : cxd5} 7... Bg4 8. d4?? {win% 51→11, meilleur : cxd5} 8... dxe4 9. Ne5 {win% 8} 9... Bxd1 10. Nxd1 {win% 6} 10... Qxd4 11. Bf4 {win% 5} 11... g5 12. Bxg5 {win% 4} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 2} 14... exf3 15. Bxf3 {win% 2} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
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

1. e4 c5 {win% 47} 2. Nf3 Nc6 {win% 47} 3. Nc3 g6 {win% 45} 4. e5 Bg7 {win% 60} 5. d4 cxd4 {win% 62} 6. Nd5 e6?! {win% 88→76, meilleur : Qa5+} 7. Nf4 d5?! {win% 77→62, meilleur : d6} 8. Bb5 a6?? {win% 88→46, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 46} 10. O-O h5 {win% 43} 11. Nxd4 Bb7 {win% 43} 12. b4 Bxe5 {win% 58} 13. Nde2 g5 {win% 75} 14. Nd3 Bxa1 {win% 75} 15. Bxg5 Qxg5 {win% 83} 16. Qxa1 Nf6 {win% 81} 17. Nc5 O-O {win% 80} 18. Nxb7 Kh7 {win% 76} 19. Nd4 Rg8 {win% 72} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `5rk1/pR4pp/8/2b3B1/8/2P3P1/PP5P/5R1K w - - 1 25` | Blancs | Rxf8+ | 2 / 2 | erreur (j’avais joué Be7) |

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
