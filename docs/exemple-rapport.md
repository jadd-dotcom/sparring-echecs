# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 23/11/2026 23:01. Période : toutes les parties (premier rapport) — 5 parties.

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
| n°3 | 23/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 866 |
| n°4 | 23/11/2026 | Maia | Noirs | Maia-3 (916) | Défaite (1-0) | Échec et mat | **sorti au coup 1…** (e5 au lieu de c5) | 831 |
| n°5 | 23/11/2026 | Maia | Blancs | Maia-3 (881) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 797 |

### Résultats

Victoires / nulles / défaites : **1 / 0 / 4**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 0 / 0 / 3 | 75,9 % | 0,3 | 1 |
| Chess.com | 2 | 1 / 0 / 1 | 72,5 % | 0 | 1 |

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
| n°1 | 25 | 72,7 % | 1 | 0 | 1 |
| n°2 | 20 | 72,3 % | 1 | 0 | 1 |
| n°3 | 15 | 66,2 % | 0 | 0 | 1 |
| n°4 | 39 | 76,9 % | 1 | 0 | 2 |
| n°5 | 37 | 84,5 % | 1 | 1 | 0 |
| **Moyenne par partie** | 27,2 | 74,5 % | 0,8 | 0,2 | 1 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 50 | 4 | 1 | 5 | 1,2 |
| Milieu | 64 | 0 | 0 | 0 | 0 |
| Finale | 22 | 0 | 0 | 0 | 0 |

### Motifs des erreurs et gaffes

Sur 6 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 0 |
| Menace ignorée | 0 |
| Pièce laissée en prise | 2 |
| Autre | 4 |

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (6, tri par chute de win%)

### 1. Partie n°2, coup 8… a6?? — gaffe (−42 pts)

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

- Mon coup : **8… a6** → win% 88 → 45
- Meilleur coup : **Qa5+** — suite : 8… Qa5+ 9. c3 Qxb5 10. cxd4 b6 — bilan matériel au bout : +3
- Réfutation de mon coup : 9. Bxc6+ bxc6 10. Qxd4 a5 11. Nd3 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 2. Partie n°1, coup 8. d4?? — gaffe (−40 pts)

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
- Réfutation de mon coup : 8… dxe4 9. Nxe4 Nxe4 10. Qb3 Nd6 — bilan matériel au bout : -3
- Ce que je pensais : (non renseigné)

### 3. Partie n°4, coup 5… d5?? — gaffe (−32 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 5. Nc3
- FEN avant mon coup : `rnb1kbnr/pppp1ppp/2q5/4P3/3Q4/2N5/PPP2PPP/R1B1KBNR b KQkq - 2 5`

```
  +-----------------+
1 | R N B K . B . R |
2 | P P P . . P P P |
3 | . . . . . N . . |
4 | . . . . Q . . . |
5 | . . . P . . . . |
6 | . . . . . q . . |
7 | p p p . p p p p |
8 | r n b k . b n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **5… d5** → win% 42 → 10
- Meilleur coup : **Bc5** — suite : 5… Bc5 6. Qg4 Qg6 7. Qf4 d6 — bilan matériel au bout : 0
- Réfutation de mon coup : 6. Bb5 Ne7 7. Bxc6+ Nbxc6 8. Qd3 — bilan matériel au bout : -6
- Ce que je pensais : « Je pensais que ma pièce était protégée. »

### 4. Partie n°3, coup 7. Nxe5?? — gaffe (−31 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : ouverture · motif : **Pièce laissée en prise**
- Dernier coup adverse : 6… Qxd7
- FEN avant mon coup : `rn2kbnr/pppq2pp/3p4/4p3/4P3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 7`

```
  +-----------------+
8 | r n . . k b n r |
7 | p p p q . . p p |
6 | . . . p . . . . |
5 | . . . . p . . . |
4 | . . . . P . . . |
3 | . . . . . N . . |
2 | P P P . . P P P |
1 | R N B Q K . . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **7. Nxe5** → win% 54 → 23
- Meilleur coup : **Nc3** — suite : 7. Nc3 Nf6 8. h3 Nc6 9. Qd3 — bilan matériel au bout : 0
- Réfutation de mon coup : 7… dxe5 8. Qh5+ Kd8 9. Qxe5 Bb4+ — bilan matériel au bout : -1
- Ce que je pensais : « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »

### 5. Partie n°4, coup 6… cxd6?? — gaffe (−31 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 6. exd6
- FEN avant mon coup : `rnb1kbnr/ppp2ppp/2qP4/8/3Q4/2N5/PPP2PPP/R1B1KBNR b KQkq - 0 6`

```
  +-----------------+
1 | R N B K . B . R |
2 | P P P . . P P P |
3 | . . . . . N . . |
4 | . . . . Q . . . |
5 | . . . . . . . . |
6 | . . . . P q . . |
7 | p p p . . p p p |
8 | r n b k . b n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **6… cxd6** → win% 40 → 9
- Meilleur coup : **Qxd6** — suite : 6… Qxd6 7. Qxd6 Bxd6 8. Nb5 Nc6 — bilan matériel au bout : 0
- Réfutation de mon coup : 7. Bb5 Be6 8. Bxc6+ Nxc6 9. Qa4 — bilan matériel au bout : -6
- Ce que je pensais : (non renseigné)

### 6. Partie n°5, coup 10. Bxe6? — erreur (−23 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : ouverture · motif : **Pièce laissée en prise**
- Dernier coup adverse : 9… Bxf2
- FEN avant mon coup : `1rb1k2r/pp3ppp/2p1pn2/8/2B1P3/2N2N2/PPP2bPP/R2K3R w k - 0 10`

```
  +-----------------+
8 | . r b . k . . r |
7 | p p . . . p p p |
6 | . . p . p n . . |
5 | . . . . . . . . |
4 | . . B . P . . . |
3 | . . N . . N . . |
2 | P P P . . b P P |
1 | R . . K . . . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **10. Bxe6** → win% 32 → 9
- Meilleur coup : **e5** — suite : 10. e5 Nd5 11. Ne4 Bb6 12. Kd2 — bilan matériel au bout : -1
- Réfutation de mon coup : 10… Bxe6 11. e5 Nh5 12. a4 Rd8+ — bilan matériel au bout : -3
- Ce que je pensais : « Je cherchais à échanger les dames pour simplifier. »

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

1. e4 {win% 53} 1... c6 2. Nf3 {win% 52} 2... d5 3. d3 {win% 53} 3... dxe4 4. dxe4 {win% 53} 4... Qxd1+ 5. Kxd1 {win% 53} 5... Nf6 6. Nc3 {win% 51} 6... e6 7. Bf4 {win% 51} 7... Bc5 8. Bxb8 {win% 45} 8... Rxb8 9. Bc4?! {win% 45→32, meilleur : Ke1} 9... Bxf2 10. Bxe6? {win% 32→9, meilleur : e5. Je pensais : Je cherchais à échanger les dames pour simplifier.} 10... Bxe6 11. Ne5 {win% 6} 11... Bd4 12. Ne2 {win% 2} 12... Bxe5 13. Rf1 {win% 2} 13... Rd8+ 14. Ke1 {win% 2} 14... Bxb2 15. Rb1 {win% 2} 15... Bd4 16. Rxb7 {win% 3} 16... Nxe4 17. Nxd4 {win% 4} 17... Rxd4 18. Rxa7 {win% 3} 18... O-O 19. Raxf7 {win% 2} 19... Rxf7 20. Rxf7 {win% 2} 20... Kxf7 21. c3 {win% 2} 21... Rd2 22. c4 {win% 2} 22... Rxa2 23. c5 {win% 2} 23... Rxg2 24. h4 {win% 2} 24... Bg4 25. h5 {win% 2} 25... Rh2 26. h6 {win% 2} 26... Rxh6 27. Kf1 {win% 2} 27... Rh2 28. Kg1 {win% 2} 28... Rc2 29. Kf1 {win% 2} 29... Rxc5 30. Ke1 {win% 2} 30... Rd5 31. Kf1 {win% 2} 31... c5 32. Kg2 {win% 2} 32... c4 33. Kh2 {win% 2} 33... c3 34. Kg2 {win% 2} 34... c2 35. Kh2 {win% 2} 35... c1=Q 36. Kg2 {win% 2} 36... Qc2+ 37. Kh1 {win% 2} 37... Rd1# 0-1
```

### Partie n°4 — défaite, Maia contre Maia-3 (916) · répertoire : sorti au coup 1… (e5 au lieu de c5)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.23"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. e4 e5 {win% 47} 2. d4 exd4 {win% 51} 3. Qxd4 Qf6 {win% 45} 4. e5 Qc6?! {win% 52→39, meilleur : Nc6} 5. Nc3 d5?? {win% 42→10, meilleur : Bc5. Je pensais : Je pensais que ma pièce était protégée.} 6. exd6 cxd6?? {win% 40→9, meilleur : Qxd6} 7. Bb5 Qxb5 {win% 5} 8. Nxb5 Bd7 {win% 3} 9. Nc7+ Kd8 {win% 5} 10. Nxa8 Nc6 {win% 4} 11. Bg5+ Be7 {win% 2} 12. Bxe7+ Kxe7 {win% 2} 13. Qxg7 Nh6 {win% 2} 14. Qxh8 Ke6 {win% 2} 15. Qxh7 Nf5 {win% 2} 16. O-O-O Ncd4 {win% 2} 17. Nf3 Nxf3 {win% 2} 18. gxf3 Ke5 {win% 2} 19. Rhe1+ Kf4 {win% 2} 20. Qxf7 Kxf3 {win% 2} 21. Qxd7 Nh4 {win% 2} 22. Qxb7+ Kxf2 {win% 2} 23. Qf7+ Nf3 {win% 2} 24. Nc7 Kg2 {win% 2} 25. Qg7+ Kf2 {win% 2} 26. Qg1+ Nxg1 {win% 2} 27. Rxg1 d5 {win% 2} 28. Rgf1+ Ke2 {win% 2} 29. h4 d4 {win% 2} 30. h5 d3 {win% 2} 31. Rxd3 Kxf1 {win% 2} 32. h6 Kg1 {win% 2} 33. h7 Kg2 {win% 2} 34. h8=Q Kf2 {win% 2} 35. Qf8+ Ke2 {win% 2} 36. Qe7+ Kf2 {win% 2} 37. Qf7+ Kg2 {win% 2} 38. Qf3+ Kh2 {win% 2} 39. Rd2+ Kg1 {win% 2} 40. Qd1# 1-0
```

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.23"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... e5 2. Nf3 {win% 54} 2... d6 3. d4 {win% 54} 3... f6 4. dxe5 {win% 54} 4... fxe5 5. Bb5+ {win% 57} 5... Bd7 6. Bxd7+ {win% 53} 6... Qxd7 7. Nxe5?? {win% 54→23, meilleur : Nc3. Je pensais : Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait.} 7... dxe5 8. Qxd7+ {win% 13} 8... Nxd7 9. Nc3 {win% 13} 9... Bb4 10. a3 {win% 10} 10... Bxc3+ 11. bxc3 {win% 11} 11... O-O-O 12. a4 {win% 11} 12... Nc5 13. Rb1 {win% 7} 13... Nxe4 14. Rb5 {win% 8} 14... Nxc3 15. Rxe5 {win% 2} 15... Rd1# 0-1
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

1. c4 {win% 51} 1... g6 2. Nc3 {win% 51} 2... Bg7 3. g3 {win% 51} 3... Nf6 4. Bg2 {win% 53} 4... O-O 5. e4 {win% 49} 5... c6 6. Nf3 {win% 54} 6... d5 7. O-O?! {win% 54→36, meilleur : cxd5} 7... Bg4 8. d4?? {win% 51→11, meilleur : cxd5} 8... dxe4 9. Ne5 {win% 9} 9... Bxd1 10. Nxd1 {win% 5} 10... Qxd4 11. Bf4 {win% 5} 11... g5 12. Bxg5 {win% 4} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 2} 14... exf3 15. Bxf3 {win% 3} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
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

1. e4 c5 {win% 46} 2. Nf3 Nc6 {win% 46} 3. Nc3 g6 {win% 49} 4. e5 Bg7 {win% 61} 5. d4 cxd4 {win% 60} 6. Nd5 e6 {win% 78} 7. Nf4 d5?! {win% 77→61, meilleur : d6} 8. Bb5 a6?? {win% 88→45, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 45} 10. O-O h5 {win% 42} 11. Nxd4 Bb7 {win% 43} 12. b4 Bxe5 {win% 54} 13. Nde2 g5 {win% 75} 14. Nd3 Bxa1 {win% 75} 15. Bxg5 Qxg5 {win% 85} 16. Qxa1 Nf6 {win% 83} 17. Nc5 O-O {win% 79} 18. Nxb7 Kh7 {win% 77} 19. Nd4 Rg8 {win% 73} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `rn2kbnr/pppq2pp/3p4/4p3/4P3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 7` | Blancs | Nc3 | 2 / 2 | erreur (j’avais joué Nxe5) |

## 5. Échiquier (mode « Maîtrise de l’échiquier »)

Mode pas encore commencé.
