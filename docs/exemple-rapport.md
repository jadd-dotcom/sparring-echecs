# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 24/11/2026 13:35. Période : toutes les parties (premier rapport) — 5 parties.

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
| n°3 | 24/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 866 |
| n°4 | 24/11/2026 | Maia | Noirs | Maia-3 (916) | Défaite (1-0) | Échec et mat | **sorti au coup 1…** (e5 au lieu de c5) | 831 |
| n°5 | 24/11/2026 | Maia | Blancs | Maia-3 (881) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 797 |

### Résultats

Victoires / nulles / défaites : **1 / 0 / 4**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 0 / 0 / 3 | 67,7 % | 1 | 0,7 |
| Chess.com | 2 | 1 / 0 / 1 | 71,2 % | 0 | 1 |

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
| n°1 | 25 | 72,4 % | 1 | 0 | 1 |
| n°2 | 20 | 70 % | 3 | 0 | 1 |
| n°3 | 25 | 58,2 % | 0 | 2 | 1 |
| n°4 | 21 | 71,4 % | 0 | 0 | 1 |
| n°5 | 18 | 73,7 % | 0 | 1 | 0 |
| **Moyenne par partie** | 21,8 | 69,1 % | 0,8 | 0,6 | 0,8 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 50 | 4 | 2 | 3 | 1 |
| Milieu | 59 | 0 | 1 | 1 | 0,3 |
| Finale | 0 | 0 | 0 | 0 | – |

### Motifs des erreurs et gaffes

Sur 7 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 0 |
| Menace ignorée | 0 |
| Pièce laissée en prise | 2 |
| Gain raté | 1 |
| Autre | 4 |

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (7, tri par chute de win%)

### 1. Partie n°3, coup 15. Qxg4?? — gaffe (−61 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : milieu · motif : **Pièce laissée en prise**
- Dernier coup adverse : 14… Bf4
- FEN avant mon coup : `r1b1k2r/p3n2p/1qpp1p2/4p3/2B1Pbp1/2P5/PP1N1PPP/R1BQ1RK1 w kq - 2 15`

```
  +-----------------+
8 | r . b . k . . r |
7 | p . . . n . . p |
6 | . q p p . p . . |
5 | . . . . p . . . |
4 | . . B . P b p . |
3 | . . P . . . . . |
2 | P P . N . P P P |
1 | R . B Q . R K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **15. Qxg4** → win% 67 → 6
- Meilleur coup : **Be2** — suite : 15. Be2 d5 16. Bxg4 O-O 17. Bxc8 — bilan matériel au bout : +4
- Réfutation de mon coup : 15… Bxg4 16. Bb3 Bxh2+ 17. Kh1 Bf4 — bilan matériel au bout : -9
- Ce que je pensais : (non renseigné)

### 2. Partie n°2, coup 8… a6?? — gaffe (−45 pts)

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

- Mon coup : **8… a6** → win% 88 → 43
- Meilleur coup : **Qa5+** — suite : 8… Qa5+ 9. c3 Qxb5 10. cxd4 Qa5+ — bilan matériel au bout : +3
- Réfutation de mon coup : 9. Bxc6+ bxc6 10. Qxd4 a5 11. Nd3 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 3. Partie n°4, coup 9… Bd4?? — gaffe (−45 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 9. Nd5
- FEN avant mon coup : `r2q1rk1/ppp2ppp/1bnp1n2/3Np3/1P2P1b1/P2P1N2/2P1BPPP/R1BQ1RK1 b - - 2 9`

```
  +-----------------+
1 | . K R . Q B . R |
2 | P P P B . P . . |
3 | . . N . P . . P |
4 | . b . P . . P . |
5 | . . . p N . . . |
6 | . . n . p n b . |
7 | p p p . . p p p |
8 | . k r . q . . r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **9… Bd4** → win% 53 → 8
- Meilleur coup : **Nxd5** — suite : 9… Nxd5 10. exd5 Nd4 11. Nxd4 Bxd4 — bilan matériel au bout : 0
- Réfutation de mon coup : 10. Nxf6+ Qxf6 11. Nxd4 Nxd4 12. Bxg4 — bilan matériel au bout : -3
- Ce que je pensais : « Je pensais que ma pièce était protégée. »

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
- Meilleur coup : **cxd5** — suite : 8. cxd5 cxd5 9. e5 Ne4 10. d4 — bilan matériel au bout : 0
- Réfutation de mon coup : 8… dxe4 9. Nxe4 Nxe4 10. Qb3 Nd7 — bilan matériel au bout : -3
- Ce que je pensais : (non renseigné)

### 5. Partie n°3, coup 14. Nd2? — erreur (−28 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : milieu · motif : **Autre**
- Dernier coup adverse : 13… g4
- FEN avant mon coup : `r1b1k2r/p3n2p/1qpp1p1b/4p3/2B1P1p1/2P2N2/PP3PPP/R1BQ1RK1 w kq - 0 14`

```
  +-----------------+
8 | r . b . k . . r |
7 | p . . . n . . p |
6 | . q p p . p . b |
5 | . . . . p . . . |
4 | . . B . P . p . |
3 | . . P . . N . . |
2 | P P . . . P P P |
1 | R . B Q . R K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **14. Nd2** → win% 90 → 63
- Meilleur coup : **Bxh6** — suite : 14. Bxh6 gxf3 15. Qxf3 d5 16. Qxf6 — bilan matériel au bout : +2
- Réfutation de mon coup : 14… d5 15. Be2 Bg7 16. Bxg4 O-O — bilan matériel au bout : +1
- Ce que je pensais : (non renseigné)

### 6. Partie n°3, coup 7. Nbd2? — erreur (−28 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 6… Bh6
- FEN avant mon coup : `r1bqk2r/ppppn2p/2n2p1b/4p1p1/2BPP3/2P2N2/PP3PPP/RNBQ1RK1 w kq - 1 7`

```
  +-----------------+
8 | r . b q k . . r |
7 | p p p p n . . p |
6 | . . n . . p . b |
5 | . . . . p . p . |
4 | . . B P P . . . |
3 | . . P . . N . . |
2 | P P . . . P P P |
1 | R N B Q . R K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **7. Nbd2** → win% 91 → 63
- Meilleur coup : **Nxe5** — suite : 7. Nxe5 Nxe5 8. dxe5 Ng6 9. Qh5 — bilan matériel au bout : +1
- Réfutation de mon coup : 7… g4 8. Ne1 d6 9. d5 Nb8 — bilan matériel au bout : 0
- Ce que je pensais : « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »

### 7. Partie n°5, coup 5. Qxc5? — erreur (−27 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : ouverture · motif : **Pièce laissée en prise**
- Dernier coup adverse : 4… Nf6
- FEN avant mon coup : `rnbqkb1r/1p1p1ppp/p3pn2/2p4Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 2 5`

```
  +-----------------+
8 | r n b q k b . r |
7 | . p . p . p p p |
6 | p . . . p n . . |
5 | . . p . . . . Q |
4 | . . B . P . . . |
3 | . . . . . . . . |
2 | P P P P . P P P |
1 | R N B . K . N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **5. Qxc5** → win% 31 → 4
- Meilleur coup : **Qh4** — suite : 5. Qh4 d5 6. exd5 exd5 7. Be2 — bilan matériel au bout : 0
- Réfutation de mon coup : 5… Bxc5 6. d4 Bxd4 7. Nf3 Ba7 — bilan matériel au bout : -9
- Menace avant mon coup (si l’adversaire rejouait) : 5… Nxh5 6. d4 cxd4 7. Be2 Nf6
- Ce que je pensais : « Je cherchais à échanger les dames pour simplifier. »

## 3. Mes parties (les 5 : défaites, puis nulles, puis victoires)

Sur la période : 4 défaites, 0 nulle, 1 victoire.

### Partie n°5 — défaite, Maia contre Maia-3 (881) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°5"]
[Date "2026.11.24"]
[White "Moi (831)"]
[Black "Maia-3 (881)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... c5 2. Qh5 {win% 48} 2... e6 3. Bb5 {win% 41} 3... a6 4. Bc4 {win% 33} 4... Nf6 5. Qxc5? {win% 31→4, meilleur : Qh4. Je pensais : Je cherchais à échanger les dames pour simplifier.} 5... Bxc5 6. Nf3 {win% 4} 6... O-O 7. d4 {win% 7} 7... Bxd4 8. Nxd4 {win% 7} 8... Nxe4 9. Bg5 {win% 2} 9... Qxg5 10. Bxe6 {win% 2} 10... Qc1+ 11. Ke2 {win% 2} 11... Qxh1 12. f3 {win% 2} 12... Nc5 13. Nf5 {win% 2} 13... fxe6 14. Nxg7 {win% 2} 14... Kxg7 15. Nc3 {win% 2} 15... Qxa1 16. Nd5 {win% 2} 16... exd5 17. c3 {win% 2} 17... Re8+ 18. Kf2 {win% 2} 18... Qe1# 0-1
```

### Partie n°4 — défaite, Maia contre Maia-3 (916) · répertoire : sorti au coup 1… (e5 au lieu de c5)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.24"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. e4 e5 {win% 47} 2. Nf3 Nf6 {win% 46} 3. d3 Nc6 {win% 52} 4. Be2 Bc5 {win% 50} 5. O-O O-O {win% 50} 6. Nc3 d6 {win% 49} 7. a3 Bg4 {win% 48} 8. b4 Bb6 {win% 49} 9. Nd5 Bd4?? {win% 53→8, meilleur : Nxd5. Je pensais : Je pensais que ma pièce était protégée.} 10. Nxd4 exd4 {win% 8} 11. Bxg4 Nxd5 {win% 9} 12. exd5 Ne5 {win% 9} 13. Bf5 g6 {win% 9} 14. Be4 f5 {win% 12} 15. Bf3 Nxf3+ {win% 10} 16. Qxf3 c6 {win% 9} 17. dxc6 bxc6 {win% 8} 18. Qxc6 Rc8 {win% 8} 19. Qd5+ Kh8 {win% 3} 20. Qxd4+ Kg8 {win% 2} 21. Bh6 Re8 {win% 2} 22. Qg7# 1-0
```

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.24"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... e5 2. Nf3 {win% 53} 2... Nc6 3. Bc4 {win% 51} 3... f6 4. c3 {win% 60} 4... Nge7 5. O-O {win% 61} 5... g5 6. d4 {win% 65} 6... Bh6 7. Nbd2? {win% 91→63, meilleur : Nxe5. Je pensais : Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait.} 7... d6 8. d5 {win% 69} 8... Na5 9. Bb5+ {win% 66} 9... c6 10. dxc6 {win% 56} 10... bxc6 11. Be2 {win% 55} 11... Qb6 12. Nc4 {win% 61} 12... Nxc4 13. Bxc4 {win% 62} 13... g4 14. Nd2? {win% 90→63, meilleur : Bxh6} 14... Bf4 15. Qxg4?? {win% 67→6, meilleur : Be2} 15... Bxg4 16. Nf3 {win% 4} 16... Bxc1 17. Raxc1 {win% 4} 17... Qxb2 18. Ra1 {win% 4} 18... Qxc3 19. Nxe5 {win% 2} 19... fxe5 20. Rac1 {win% 2} 20... Qd2 21. Rfd1 {win% 2} 21... Qf4 22. Rxd6 {win% 2} 22... Qxc1+ 23. Rd1 {win% 2} 23... Qxd1+ 24. Bf1 {win% 2} 24... Be2 25. Kh1 {win% 2} 25... Qxf1# 0-1
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

1. c4 {win% 52} 1... g6 2. Nc3 {win% 53} 2... Bg7 3. g3 {win% 51} 3... Nf6 4. Bg2 {win% 53} 4... O-O 5. e4 {win% 49} 5... c6 6. Nf3 {win% 53} 6... d5 7. O-O?! {win% 54→37, meilleur : cxd5} 7... Bg4 8. d4?? {win% 52→11, meilleur : cxd5} 8... dxe4 9. Ne5 {win% 8} 9... Bxd1 10. Nxd1 {win% 6} 10... Qxd4 11. Bf4 {win% 5} 11... g5 12. Bxg5 {win% 5} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 2} 14... exf3 15. Bxf3 {win% 3} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
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

1. e4 c5 {win% 46} 2. Nf3 Nc6 {win% 49} 3. Nc3 g6 {win% 48} 4. e5 Bg7 {win% 60} 5. d4 cxd4 {win% 59} 6. Nd5 e6?! {win% 89→78, meilleur : Qa5+} 7. Nf4 d5?! {win% 77→64, meilleur : d6} 8. Bb5 a6?? {win% 88→43, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 45} 10. O-O h5?! {win% 52→41, meilleur : Qb6} 11. Nxd4 Bb7 {win% 42} 12. b4 Bxe5 {win% 55} 13. Nde2 g5 {win% 74} 14. Nd3 Bxa1 {win% 76} 15. Bxg5 Qxg5 {win% 85} 16. Qxa1 Nf6 {win% 85} 17. Nc5 O-O {win% 78} 18. Nxb7 Kh7 {win% 76} 19. Nd4 Rg8 {win% 72} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `r1bqk2r/ppppn2p/2n2p1b/4p1p1/2BPP3/2P2N2/PP3PPP/RNBQ1RK1 w kq - 1 7` | Blancs | Nxe5 | 2 / 2 | erreur (j’avais joué Nbd2) |

## 5. Échiquier (mode « Maîtrise de l’échiquier »)

Mode pas encore commencé.
