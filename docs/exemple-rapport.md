# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 23/11/2026 19:53. Période : toutes les parties (premier rapport) — 5 parties.

**Demande :** je suis débutant. À partir de ces données (calculées automatiquement, pas devinées), diagnostique mes lacunes principales, explique-les simplement et propose-moi 3 axes de travail concrets.

## Définitions

- **Sources** : *Maia* = partie dans l’appli contre Maia-3, une IA qui imite le jeu humain (compte pour mon niveau) ; *Chess.com* = partie importée de mon compte Chess.com, contre un humain, analysée de la même façon (ne compte pas pour mon niveau).
- **Niveau** : estimation de type Elo, échelle de l’appli proche de Lichess (bornes 550–2600), mise à jour après chaque partie contre Maia. Maia-3 est réglée 50 points au-dessus de mon niveau.
- **Mon répertoire** : Anglaise (système fermé) (Blancs) ; Système …c5 / …g6 (Dragon accéléré) (Noirs). « Resté dans mon répertoire jusqu’au coup 8 » = je n’ai joué aucun coup hors répertoire avant mon 9e coup (fin de ligne comprise) ; les parties où l’adversaire en sort avant sont comptées à part.
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
  - *Autre* : aucun des cas précédents (souvent positionnel ou stratégique).

## 1. Résumé de la période

### Niveau (parties contre Maia)

Début : **900** → fin : **797** (-103).

Classement Chess.com (pour information) : 346 → 362.

| Partie | Date | Source | Couleur | Adversaire | Résultat | Fin | Répertoire | Niveau après |
|---|---|---|---|---|---|---|---|---|
| n°1 | 05/11/2026 | Chess.com | Blancs | yar100r (845) | Défaite (0-1) | Échec et mat | suivi ; adversaire sorti au coup 1… (g6) | – |
| n°2 | 18/11/2026 | Chess.com | Noirs | smarts00001 (315) | Victoire (0-1) | Échec et mat | suivi ; adversaire sorti au coup 4. (e5) | – |
| n°3 | 23/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (d4 au lieu de c4) | 866 |
| n°4 | 23/11/2026 | Maia | Noirs | Maia-3 (916) | Défaite (1-0) | Échec et mat | **sorti au coup 1…** (d5 au lieu de Nf6) | 831 |
| n°5 | 23/11/2026 | Maia | Blancs | Maia-3 (881) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 797 |

### Résultats

Victoires / nulles / défaites : **1 / 0 / 4**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 0 / 0 / 3 | 61,6 % | 0,3 | 1,7 |
| Chess.com | 2 | 1 / 0 / 1 | 72,2 % | 0 | 1 |

### Par ouverture

| Ouverture | Parties | V / N / D | Resté dans mon répertoire jusqu’au coup 8 | Sorti moi-même avant | Adversaire sorti avant |
|---|---|---|---|---|---|
| Système …c5 / …g6 (Dragon accéléré) | 2 | 1 / 0 / 1 | 0 | 1 | 1 |
| Hors répertoire (Blancs) | 2 | 0 / 0 / 2 | 0 | 2 | 0 |
| Anglaise (système fermé) | 1 | 0 / 0 / 1 | 0 | 0 | 1 |

**Resté dans mon répertoire jusqu’au coup 8 : 0 / 5 parties (0 %)** — sorti moi-même avant : 3 (60 %) ; l’adversaire en est sorti avant : 2 (40 %).

- Contre Maia : 0 / 3 (0 %) · sur Chess.com : 0 / 2 (0 %).

### Imprécisions, erreurs, gaffes par partie

| Partie | Mes coups | Précision | Imprécisions | Erreurs | Gaffes |
|---|---|---|---|---|---|
| n°1 | 25 | 72,3 % | 1 | 0 | 1 |
| n°2 | 20 | 72,1 % | 2 | 0 | 1 |
| n°3 | 34 | 64,7 % | 4 | 1 | 1 |
| n°4 | 32 | 46,6 % | 3 | 0 | 2 |
| n°5 | 34 | 73,4 % | 2 | 0 | 2 |
| **Moyenne par partie** | 29 | 65,8 % | 2,4 | 0,2 | 1,4 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 50 | 7 | 0 | 2 | 0,4 |
| Milieu | 80 | 3 | 1 | 5 | 0,8 |
| Finale | 15 | 2 | 0 | 0 | 0 |

### Motifs des erreurs et gaffes

Sur 8 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 0 |
| Menace ignorée | 1 |
| Pièce laissée en prise | 4 |
| Autre | 3 |

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (8, tri par chute de win%)

### 1. Partie n°4, coup 25… Qxc3?? — gaffe (−78 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Pièce laissée en prise**
- Dernier coup adverse : 25. R1e3
- FEN avant mon coup : `6nr/p1p3kp/5p2/2p5/4RP2/2P1R2P/1q3PP1/6K1 b - - 1 25`

```
  +-----------------+
1 | . K . . . . . . |
2 | . P P . . . q . |
3 | P . . R . P . . |
4 | . . P R . . . . |
5 | . . . . . p . . |
6 | . . p . . . . . |
7 | p k . . . p . p |
8 | r n . . . . . . |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **25… Qxc3** → win% 88 → 11
- Meilleur coup : **Kf7** — suite : 25… Kf7 26. Re8 Qc1+ 27. Kh2 Qd2 — bilan matériel au bout : +7
- Réfutation de mon coup : 26. Rxc3 c6 27. Rxc5 a5 28. Rxc6 — bilan matériel au bout : -3
- Ce que je pensais : « Je pensais que ma pièce était protégée. »

### 2. Partie n°4, coup 26… Kf7?? — gaffe (−76 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Pièce laissée en prise**
- Dernier coup adverse : 26. Rg3+
- FEN avant mon coup : `6nr/p1p3kp/5p2/2p5/4RP2/2q3RP/5PP1/6K1 b - - 1 26`

```
  +-----------------+
1 | . K . . . . . . |
2 | . P P . . . . . |
3 | P R . . . q . . |
4 | . . P R . . . . |
5 | . . . . . p . . |
6 | . . p . . . . . |
7 | p k . . . p . p |
8 | r n . . . . . . |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **26… Kf7** → win% 88 → 12
- Meilleur coup : **Qxg3** — suite : 26… Qxg3 27. fxg3 Kf7 28. Rc4 Ne7 — bilan matériel au bout : +4
- Réfutation de mon coup : 27. Rxc3 Ne7 28. Ra4 c6 29. Rxa7 — bilan matériel au bout : -2
- Ce que je pensais : (non renseigné)

### 3. Partie n°3, coup 19. Bd3?? — gaffe (−62 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : milieu · motif : **Pièce laissée en prise**
- Dernier coup adverse : 18… Bf5
- FEN avant mon coup : `2kr3r/pp3ppp/4qn2/5b2/2N5/2P1B3/PPQ1BPPP/R3R1K1 w - - 9 19`

```
  +-----------------+
8 | . . k r . . . r |
7 | p p . . . p p p |
6 | . . . . q n . . |
5 | . . . . . b . . |
4 | . . N . . . . . |
3 | . . P . B . . . |
2 | P P Q . B P P P |
1 | R . . . R . K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **19. Bd3** → win% 96 → 34
- Meilleur coup : **Qa4** — suite : 19. Qa4 Ng4 20. Qxa7 Nxe3 21. Nxe3 — bilan matériel au bout : +5
- Réfutation de mon coup : 19… Bxd3 20. Qa4 Qxc4 21. Qxa7 Qa6 — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 19… Bxc2 20. Bxa7 Nd5 21. b3 Qh6
- Ce que je pensais : « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »

### 4. Partie n°5, coup 21. g4?? — gaffe (−43 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : milieu · motif : **Autre**
- Dernier coup adverse : 20… Bc1
- FEN avant mon coup : `4k2r/p1p2p2/2pp1p2/4p2p/2q1P3/2P2QP1/P3RP1P/2bN2K1 w k - 1 21`

```
  +-----------------+
8 | . . . . k . . r |
7 | p . p . . p . . |
6 | . . p p . p . . |
5 | . . . . p . . p |
4 | . . q . P . . . |
3 | . . P . . Q P . |
2 | P . . . R P . P |
1 | . . b N . . K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **21. g4** → win% 57 → 14
- Meilleur coup : **Rc2** — suite : 21. Rc2 Bf4 22. Nb2 Qa6 23. c4 — bilan matériel au bout : -2
- Réfutation de mon coup : 21… Rg8 22. h3 hxg4 23. hxg4 Qe6 — bilan matériel au bout : -2
- Ce que je pensais : (non renseigné)

### 5. Partie n°2, coup 8… a6?? — gaffe (−43 pts)

- Source : Chess.com · adversaire : smarts00001 (315)
- Ma couleur : Noirs · phase : ouverture · motif : **Autre**
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

- Mon coup : **8… a6** → win% 87 → 45
- Meilleur coup : **Qa5+** — suite : 8… Qa5+ 9. c3 Qxb5 10. cxd4 Qb6 — bilan matériel au bout : +3
- Réfutation de mon coup : 9. Bxc6+ bxc6 10. Qxd4 a5 11. Nd3 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 6. Partie n°1, coup 8. d4?? — gaffe (−41 pts)

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

- Mon coup : **8. d4** → win% 52 → 10
- Meilleur coup : **cxd5** — suite : 8. cxd5 cxd5 9. e5 Ne4 10. d4 — bilan matériel au bout : 0
- Réfutation de mon coup : 8… dxe4 9. Nxe4 Nxe4 10. Qb3 Nd6 — bilan matériel au bout : -3
- Ce que je pensais : (non renseigné)

### 7. Partie n°5, coup 19. c3?? — gaffe (−39 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : milieu · motif : **Menace ignorée** (aussi : Pièce laissée en prise)
- Dernier coup adverse : 18… Qb4
- FEN avant mon coup : `4k2r/p1p2p2/2pp1p2/4p2p/1qB1Pb2/5Q2/P1P1RPPP/3N2K1 w k - 2 19`

```
  +-----------------+
8 | . . . . k . . r |
7 | p . p . . p . . |
6 | . . p p . p . . |
5 | . . . . p . . p |
4 | . q B . P b . . |
3 | . . . . . Q . . |
2 | P . P . R P P P |
1 | . . . N . . K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **19. c3** → win% 87 → 48
- Meilleur coup : **Qd3** — suite : 19. Qd3 Ke7 20. c3 Qa5 21. g3 — bilan matériel au bout : +1
- Réfutation de mon coup : 19… Qxc4 20. g3 Rg8 21. Qxh5 Ke7 — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 19… Qxc4 20. g3 Bc1 21. h4 Ke7
- Ce que je pensais : « Je cherchais à échanger les dames pour simplifier. »

### 8. Partie n°3, coup 22. Qxd3? — erreur (−26 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : milieu · motif : **Pièce laissée en prise**
- Dernier coup adverse : 21… Qh4
- FEN avant mon coup : `2kr3r/pp3ppp/5n2/8/7q/1PPbB3/P2Q1PPP/R3R1K1 w - - 1 22`

```
  +-----------------+
8 | . . k r . . . r |
7 | p p . . . p p p |
6 | . . . . . n . . |
5 | . . . . . . . . |
4 | . . . . . . . q |
3 | . P P b B . . . |
2 | P . . Q . P P P |
1 | R . . . R . K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **22. Qxd3** → win% 36 → 11
- Meilleur coup : **Bf4** — suite : 22. Bf4 Qg4 23. Qe3 Qf5 24. Bg3 — bilan matériel au bout : -2
- Réfutation de mon coup : 22… Rxd3 23. Bxa7 Nd5 24. Bd4 Nf4 — bilan matériel au bout : -7
- Ce que je pensais : (non renseigné)

## 3. Mes parties (les 5 : défaites, puis nulles, puis victoires)

Sur la période : 4 défaites, 0 nulle, 1 victoire.

### Partie n°5 — défaite, Maia contre Maia-3 (881) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°5"]
[Date "2026.11.23"]
[White "Moi (831)"]
[Black "Maia-3 (881)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 52} 1... e5 2. d4 {win% 50} 2... d6 3. Nf3 {win% 55} 3... Nc6 4. Nc3 {win% 56} 4... Nf6 5. Bc4 {win% 53} 5... Be6 6. d5 {win% 88} 6... Bg4 7. dxc6 {win% 90} 7... Bxf3 8. Qxf3 {win% 91} 8... bxc6 9. O-O {win% 91} 9... Rb8 10. Bg5 {win% 90} 10... h6 11. Bxf6 {win% 91} 11... gxf6 12. Rfe1 {win% 92} 12... h5 13. Rad1 {win% 91} 13... Rxb2 14. Rd2 {win% 90} 14... Bh6 15. Rde2 {win% 88} 15... Bf4 16. Rb1 {win% 87} 16... Qb8 17. Rxb2 {win% 89} 17... Qxb2 18. Nd1 {win% 87} 18... Qb4 19. c3?? {win% 87→48, meilleur : Qd3. Je pensais : Je cherchais à échanger les dames pour simplifier.} 19... Qxc4 20. g3 {win% 47} 20... Bc1 21. g4?? {win% 57→14, meilleur : Rc2} 21... hxg4 22. Qxg4 {win% 17} 22... f5 23. Qxf5 {win% 10} 23... Qxe2 24. Qc8+ {win% 10} 24... Ke7 25. Qxh8 {win% 9} 25... Qxd1+ 26. Kg2 {win% 10} 26... Qg4+ 27. Kf1 {win% 9} 27... Qd1+ 28. Kg2 {win% 9} 28... Qg4+ 29. Kf1 {win% 8} 29... d5 30. exd5 {win% 9} 30... cxd5 31. a4 {win% 9} 31... d4 32. a5?! {win% 18→6, meilleur : Qxe5+} 32... d3 33. a6?! {win% 13→2, meilleur : Qxe5+} 33... d2 34. h3 {win% 2} 34... d1=Q# 0-1
```

### Partie n°4 — défaite, Maia contre Maia-3 (916) · répertoire : sorti au coup 1… (d5 au lieu de Nf6)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.23"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. d4 d5 {win% 48} 2. Nf3 e5?! {win% 49→37, meilleur : Nf6} 3. Nxe5 f6 {win% 33} 4. Nd3 Nc6 {win% 33} 5. Bf4 Bf5?! {win% 46→31, meilleur : Nxd4} 6. Nc5 Bxc5 {win% 46} 7. dxc5 Nb4?! {win% 48→34, meilleur : g5} 8. c3 Nc2+ {win% 70} 9. Qxc2 Bxc2 {win% 90} 10. e3 b6 {win% 86} 11. Bb5+ Kf7 {win% 88} 12. Bc6 Rc8 {win% 90} 13. O-O g5 {win% 90} 14. Nd2 gxf4 {win% 92} 15. exf4 bxc5 {win% 93} 16. Rac1 Be4 {win% 88} 17. Nxe4 dxe4 {win% 87} 18. Rcd1 Qf8 {win% 86} 19. Bd5+ Kg7 {win% 86} 20. Rfe1 Re8 {win% 87} 21. Bxe4 Rxe4 {win% 89} 22. Rxe4 Qf7 {win% 86} 23. Rde1 Qxa2 {win% 89} 24. h3 Qxb2 {win% 86} 25. R1e3 Qxc3?? {win% 88→11, meilleur : Kf7. Je pensais : Je pensais que ma pièce était protégée.} 26. Rg3+ Kf7?? {win% 88→12, meilleur : Qxg3} 27. Rxc3 Ne7 {win% 13} 28. Rxc5 Rb8 {win% 7} 29. Rxc7 Rb1+ {win% 3} 30. Kh2 a5 {win% 2} 31. Rexe7+ Kf8 {win% 2} 32. Rxh7 a4 {win% 2} 33. Rc8# 1-0
```

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : hors répertoire dès le 1er coup (d4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.23"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. d4 {win% 53} 1... d5 2. Nc3 {win% 51} 2... Nc6 3. e4 {win% 53} 3... e5 4. Nf3 {win% 51} 4... Bg4 5. Be2 {win% 52} 5... exd4 6. Nxd5 {win% 57} 6... Bb4+ 7. c3 {win% 62} 7... Ba5 8. O-O {win% 71} 8... Qd6 9. Bf4 {win% 86} 9... Qe6 10. Nxc7+?! {win% 93→76, meilleur : Nxd4} 10... Bxc7 11. Bxc7?! {win% 76→66, meilleur : Nxd4} 11... Qxe4 12. Re1 {win% 87} 12... Ne5 13. Bxe5 {win% 98} 13... O-O-O 14. Bxd4 {win% 94} 14... Nf6 15. Nd2 {win% 93} 15... Qf4 16. Be3 {win% 93} 16... Qe5 17. Nc4?! {win% 98→85, meilleur : Bxg4+} 17... Qe6 18. Qc2 {win% 92} 18... Bf5 19. Bd3?? {win% 96→34, meilleur : Qa4. Je pensais : Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait.} 19... Bxd3 20. Qd2?! {win% 36→20, meilleur : Qa4} 20... Qxc4 21. b3 {win% 21} 21... Qh4 22. Qxd3? {win% 36→11, meilleur : Bf4} 22... Rxd3 23. Bxa7 {win% 10} 23... Rxc3 24. Red1 {win% 11} 24... Ne4 25. g3 {win% 9} 25... Qg5 26. Rd4 {win% 7} 26... Rc1+ 27. Rxc1+ {win% 2} 27... Qxc1+ 28. Kg2 {win% 2} 28... Qc6 29. Rxe4 {win% 2} 29... Qxe4+ 30. Kh3 {win% 2} 30... Qf5+ 31. Kg2 {win% 2} 31... Rd8 32. h3 {win% 2} 32... Rd2 33. g4 {win% 2} 33... Qxf2+ 34. Kh1 {win% 2} 34... Qg2# 0-1
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

1. c4 {win% 51} 1... g6 2. Nc3 {win% 51} 2... Bg7 3. g3 {win% 51} 3... Nf6 4. Bg2 {win% 52} 4... O-O 5. e4 {win% 49} 5... c6 6. Nf3 {win% 53} 6... d5 7. O-O?! {win% 53→36, meilleur : cxd5} 7... Bg4 8. d4?? {win% 52→10, meilleur : cxd5} 8... dxe4 9. Ne5 {win% 9} 9... Bxd1 10. Nxd1 {win% 6} 10... Qxd4 11. Bf4 {win% 5} 11... g5 12. Bxg5 {win% 4} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 2} 14... exf3 15. Bxf3 {win% 2} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
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

1. e4 c5 {win% 47} 2. Nf3 Nc6 {win% 48} 3. Nc3 g6 {win% 45} 4. e5 Bg7 {win% 61} 5. d4 cxd4 {win% 60} 6. Nd5 e6?! {win% 89→77, meilleur : Qa5+} 7. Nf4 d5?! {win% 76→65, meilleur : d6} 8. Bb5 a6?? {win% 87→45, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 46} 10. O-O h5 {win% 42} 11. Nxd4 Bb7 {win% 42} 12. b4 Bxe5 {win% 54} 13. Nde2 g5 {win% 74} 14. Nd3 Bxa1 {win% 75} 15. Bxg5 Qxg5 {win% 85} 16. Qxa1 Nf6 {win% 84} 17. Nc5 O-O {win% 79} 18. Nxb7 Kh7 {win% 75} 19. Nd4 Rg8 {win% 75} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `2kr3r/pp3ppp/4qn2/5b2/2N5/2P1B3/PPQ1BPPP/R3R1K1 w - - 9 19` | Blancs | Qa4 | 2 / 2 | erreur (j’avais joué Bd3) |
