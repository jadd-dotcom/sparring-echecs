# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 27/11/2026 08:20. Période : toutes les parties (premier rapport) — 5 parties.

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

Début : **900** → fin : **877** (-23).

Classement Chess.com (pour information) : 346 → 362.

| Partie | Date | Source | Couleur | Adversaire | Résultat | Fin | Répertoire | Niveau après |
|---|---|---|---|---|---|---|---|---|
| n°1 | 05/11/2026 | Chess.com | Blancs | yar100r (845) | Défaite (0-1) | Échec et mat | suivi ; adversaire sorti au coup 1… (g6) | – |
| n°2 | 18/11/2026 | Chess.com | Noirs | smarts00001 (315) | Victoire (0-1) | Échec et mat | suivi ; adversaire sorti au coup 4. (e5) | – |
| n°3 | 27/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 866 |
| n°4 | 27/11/2026 | Maia | Noirs | Maia-3 (916) | Défaite (1-0) | Abandon | **sorti au coup 1…** (e5 au lieu de c5) | 831 |
| n°5 | 27/11/2026 | Maia | Blancs | Maia-3 (881) | Victoire (1-0) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 877 |

### Résultats

Victoires / nulles / défaites : **2 / 0 / 3**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 1 / 0 / 2 | 79,3 % | 0,7 | 1 |
| Chess.com | 2 | 1 / 0 / 1 | 72,1 % | 0 | 1 |

### Par ouverture

| Ouverture | Parties | V / N / D | Resté dans mon répertoire jusqu’au coup 8 | Sorti moi-même avant | Adversaire sorti avant |
|---|---|---|---|---|---|
| Système …c5 / …g6 (Dragon accéléré) | 2 | 1 / 0 / 1 | 0 | 1 | 1 |
| Hors répertoire (Blancs) | 2 | 1 / 0 / 1 | 0 | 2 | 0 |
| Anglaise (système fermé) | 1 | 0 / 0 / 1 | 0 | 0 | 1 |

**Resté dans mon répertoire jusqu’au coup 8 : 0 / 5 parties (0 %)** — sorti moi-même avant : 3 (60 %) ; l’adversaire en est sorti avant : 2 (40 %).

- Contre Maia : 0 / 3 (0 %) · sur Chess.com : 0 / 2 (0 %).

#### Coups par lesquels l’adversaire sort de mon répertoire (vus au moins 2 fois)

Aucun coup vu 2 fois sur la période.

### Imprécisions, erreurs, gaffes par partie

| Partie | Mes coups | Précision | Imprécisions | Erreurs | Gaffes |
|---|---|---|---|---|---|
| n°1 | 25 | 73,3 % | 1 | 0 | 1 |
| n°2 | 20 | 71 % | 3 | 0 | 1 |
| n°3 | 34 | 76,7 % | 0 | 0 | 1 |
| n°4 | 45 | 69,6 % | 5 | 2 | 2 |
| n°5 | 4 | 91,6 % | 0 | 0 | 0 |
| **Moyenne par partie** | 25,6 | 76,4 % | 1,8 | 0,4 | 1 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 44 | 4 | 2 | 3 | 1,1 |
| Milieu | 84 | 5 | 0 | 2 | 0,2 |
| Finale | 0 | 0 | 0 | 0 | – |

### Motifs des erreurs et gaffes

Sur 7 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 0 |
| Menace ignorée | 1 |
| Pièce laissée en prise | 1 |
| Gain raté | 1 |
| Autre | 4 |

### Ce que je pensais (réponse en un toucher), par motif

Réponses données sur 2 de mes 7 erreurs et gaffes (dans la revue, avant de voir le meilleur coup).

| Motif | Menace pas vue | Mal calculé | Autre cible | Trop vite | Ne sait pas | Sans réponse |
|---|---|---|---|---|---|---|
| Mat raté | 0 | 0 | 0 | 0 | 0 | 0 |
| Mat ouvert | 0 | 0 | 0 | 0 | 0 | 0 |
| Menace ignorée | 0 | 0 | 0 | 0 | 0 | 1 |
| Pièce laissée en prise | 1 | 0 | 0 | 0 | 0 | 0 |
| Gain raté | 0 | 0 | 0 | 0 | 0 | 1 |
| Autre | 0 | 1 | 0 | 0 | 0 | 3 |
| **Total** | **1** | **1** | **0** | **0** | **0** | **5** |

Réponses : Menace pas vue = « Je n’ai pas vu la menace » ; Mal calculé = « J’ai vu, mais mal calculé » ; Autre cible = « Je voulais attaquer autre chose » ; Trop vite = « J’ai joué trop vite » ; Ne sait pas = « Je ne sais pas ».

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (7, tri par chute de win%)

### 1. Partie n°4, coup 19… Kg2?? — gaffe (−52 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Menace ignorée** (aussi : Pièce laissée en prise, Gain raté)
- Dernier coup adverse : 19. Nf7
- FEN avant mon coup : `rn1q1bnr/ppp2Npp/8/8/8/6Nk/PPP2P1P/R1B1K2R b KQ - 7 19`

```
  +-----------------+
1 | R . . K . B . R |
2 | P . P . . P P P |
3 | k N . . . . . . |
4 | . . . . . . . . |
5 | . . . . . . . . |
6 | . . . . . . . . |
7 | p p N . . p p p |
8 | r n b . q . n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **19… Kg2** → win% 92 → 40
- Meilleur coup : **Qe8+** — suite : 19… Qe8+ 20. Ne2 Qxf7 21. Nf4+ Kh4 — bilan matériel au bout : +12
- Réfutation de mon coup : 20. Nxd8 Nf6 21. Be3 Bd6 22. Nf7 — bilan matériel au bout : 0
- Menace avant mon coup (si l’adversaire rejouait) : 19. Nxd8 Nf6 20. Nf7 Rg8 21. Kf1
- Ce que je pensais : (non renseigné)

### 2. Partie n°3, coup 8. Qxa8?? — gaffe (−49 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : ouverture · motif : **Pièce laissée en prise**
- Dernier coup adverse : 7… Rxg8
- FEN avant mon coup : `r2qkbr1/pQpn3p/3p2p1/4pb2/8/8/PPPP1PPP/RNB1K1NR w KQq - 0 8`

```
  +-----------------+
8 | r . . q k b r . |
7 | p Q p n . . . p |
6 | . . . p . . p . |
5 | . . . . p b . . |
4 | . . . . . . . . |
3 | . . . . . . . . |
2 | P P P P . P P P |
1 | R N B . K . N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **8. Qxa8** → win% 54 → 5
- Meilleur coup : **Qc6** — suite : 8. Qc6 Rb8 9. d3 Rb6 10. Qf3 — bilan matériel au bout : +1
- Réfutation de mon coup : 8… Qxa8 9. f3 Bxc2 10. Nh3 Bxb1 — bilan matériel au bout : -7
- Ce que je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »

### 3. Partie n°2, coup 8… a6?? — gaffe (−44 pts)

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
- Meilleur coup : **Qa5+** — suite : 8… Qa5+ 9. c3 Qxb5 10. cxd4 Nge7 — bilan matériel au bout : +3
- Réfutation de mon coup : 9. Bxc6+ bxc6 10. Qxd4 a5 11. Nd3 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 4. Partie n°1, coup 8. d4?? — gaffe (−40 pts)

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
- Meilleur coup : **cxd5** — suite : 8. cxd5 cxd5 9. e5 Ne4 10. d4 — bilan matériel au bout : 0
- Réfutation de mon coup : 8… dxe4 9. Nxe4 Nxe4 10. Re1 Nd6 — bilan matériel au bout : -3
- Ce que je pensais : (non renseigné)

### 5. Partie n°4, coup 21… Re8+?? — gaffe (−31 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Autre**
- Dernier coup adverse : 21. Nxb7
- FEN avant mon coup : `r4bnr/pNp3pp/2n5/8/8/6N1/PPP2PkP/R1B1K2R b KQ - 0 21`

```
  +-----------------+
1 | R . . K . B . R |
2 | P k P . . P P P |
3 | . N . . . . . . |
4 | . . . . . . . . |
5 | . . . . . . . . |
6 | . . . . . n . . |
7 | p p . . . p N p |
8 | r n b . . . . r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **21… Re8+** → win% 58 → 27
- Meilleur coup : **Nd4** — suite : 21… Nd4 22. Kd1 Nf3 23. Na5 Nf6 — bilan matériel au bout : -1
- Réfutation de mon coup : 22. Be3 Ne5 23. O-O-O Nf3 24. Nd8 — bilan matériel au bout : -1
- Ce que je pensais : (non renseigné)

### 6. Partie n°4, coup 5… Kd7? — erreur (−28 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 5. Qxe4+
- FEN avant mon coup : `rnbqkbnr/ppp2ppp/8/8/4Q3/2N5/PPP2PPP/R1B1KBNR b KQkq - 0 5`

```
  +-----------------+
1 | R N B K . B . R |
2 | P P P . . P P P |
3 | . . . . . N . . |
4 | . . . Q . . . . |
5 | . . . . . . . . |
6 | . . . . . . . . |
7 | p p p . . p p p |
8 | r n b k q b n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **5… Kd7** → win% 44 → 16
- Meilleur coup : **Be7** — suite : 5… Be7 6. Bg5 h6 7. Bxe7 Qxe7 — bilan matériel au bout : 0
- Réfutation de mon coup : 6. Bf4 Bd6 7. Bb5+ Nc6 8. O-O-O — bilan matériel au bout : 0
- Ce que je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »

### 7. Partie n°4, coup 6… Ke7? — erreur (−21 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 6. Qd4+
- FEN avant mon coup : `rnbq1bnr/pppk1ppp/8/8/3Q4/2N5/PPP2PPP/R1B1KBNR b KQ - 2 6`

```
  +-----------------+
1 | R N B K . B . R |
2 | P P P . . P P P |
3 | . . . . . N . . |
4 | . . . . Q . . . |
5 | . . . . . . . . |
6 | . . . . . . . . |
7 | p p p . k p p p |
8 | r n b . q b n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **6… Ke7** → win% 30 → 9
- Meilleur coup : **Ke8** — suite : 6… Ke8 7. Qxd8+ Kxd8 8. Bf4 Bg4 — bilan matériel au bout : 0
- Réfutation de mon coup : 7. Bg5+ f6 8. Qe4+ Be6 9. Bc4 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

## 3. Mes parties (les 5 : défaites, puis nulles, puis victoires)

Sur la période : 3 défaites, 0 nulle, 2 victoires.

### Partie n°4 — défaite, Maia contre Maia-3 (916) · répertoire : sorti au coup 1… (e5 au lieu de c5)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.27"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Abandon"]

1. e4 e5 {win% 47} 2. Nc3 d5 {win% 40} 3. d4 exd4?! {win% 52→40, meilleur : dxe4} 4. Qxd4 dxe4 {win% 41} 5. Qxe4+ Kd7? {win% 44→16, meilleur : Be7. Je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »} 6. Qd4+ Ke7? {win% 30→9, meilleur : Ke8} 7. Nd5+ Ke6 {win% 5} 8. Bc4 Kf5 {win% 2} 9. Qf4+ Kg6 {win% 2} 10. Bd3+ f5 {win% 8} 11. Qxf5+ Bxf5 {win% 81} 12. Nf4+ Kf6 {win% 83} 13. Nh5+ Ke6 {win% 84} 14. Bxf5+ Kxf5 {win% 87} 15. g4+ Kxg4?! {win% 89→76, meilleur : Ke6} 16. Ng3 Kh4?! {win% 76→65, meilleur : Qd5} 17. Nf3+ Kg4 {win% 68} 18. Ne5+ Kh3 {win% 70} 19. Nf7 Kg2?? {win% 92→40, meilleur : Qe8+} 20. Nxd8 Nc6 {win% 28} 21. Nxb7 Re8+?? {win% 58→27, meilleur : Nd4} 22. Be3 Bb4+ {win% 19} 23. c3 Ba5 {win% 11} 24. O-O-O Rb8?! {win% 20→3, meilleur : Bb6} 25. Nxa5 Nxa5 {win% 2} 26. Rdg1+ Kf3 {win% 11} 27. Bxa7 Rb7 {win% 16} 28. Bd4 Kf4?! {win% 13→2, meilleur : Nf6} 29. Bxg7 Kg5 {win% 2} 30. Bxh8 Kg6 {win% 2} 31. Ne4+ Kh6 {win% 2} 32. Rxg8 Rb5 {win% 2} 33. Bg7+ Kg6 {win% 2} 34. Bd4+ Kf5 {win% 2} 35. Ng3+ Kf4 {win% 2} 36. Be3+ Kf3 {win% 2} 37. Rf8+ Kg2 {win% 2} 38. Rh8 Nc4 {win% 2} 39. Rxh7 Kf3 {win% 2} 40. Rxc7 Kg2 {win% 2} 41. Rxc4 Kf3 {win% 2} 42. Rf4+ Kg2 {win% 2} 43. Re1 Kxh2 {win% 2} 44. Rh4+ Kg2 {win% 2} 45. f4 Kxg3 {win% 2} 46. Reh1 1-0
```

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.27"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... e5 2. Qh5 {win% 47} 2... d6 3. Bc4 {win% 48} 3... g6 4. Qf3 {win% 46} 4... f5 5. exf5 {win% 55} 5... Bxf5 6. Qxb7 {win% 61} 6... Nd7 7. Bxg8 {win% 53} 7... Rxg8 8. Qxa8?? {win% 54→5, meilleur : Qc6. Je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »} 8... Qxa8 9. Nc3 {win% 2} 9... Qxg2 10. Nf3 {win% 2} 10... Qxh1+ 11. Ng1 {win% 2} 11... Qxg1+ 12. Ke2 {win% 2} 12... Bg4+ 13. Ke3 {win% 2} 13... Nc5 14. Ne2 {win% 2} 14... Qxh2 15. d4 {win% 2} 15... exd4+ 16. Kxd4 {win% 2} 16... Bxe2 17. Bh6 {win% 2} 17... Qxh6 18. Kd5 {win% 2} 18... Bf3+ 19. Kd4 {win% 2} 19... Qd2+ 20. Kc4 {win% 2} 20... Qxc2+ 21. Kd4 {win% 2} 21... Qxb2+ 22. Ke3 {win% 2} 22... Qxa1 23. Kxf3 {win% 2} 23... Qxa2 24. Kf4 {win% 2} 24... Qxf2+ 25. Kg5 {win% 2} 25... h6+ 26. Kg4 {win% 2} 26... Qf5+ 27. Kg3 {win% 2} 27... g5 28. Kh2 {win% 2} 28... h5 29. Kg2 {win% 2} 29... g4 30. Kg3 {win% 2} 30... d5 31. Kg2 {win% 2} 31... Bd6 32. Kg1 {win% 2} 32... g3 33. Kg2 {win% 2} 33... Qf2+ 34. Kh1 {win% 2} 34... g2# 0-1
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

1. c4 {win% 51} 1... g6 2. Nc3 {win% 53} 2... Bg7 3. g3 {win% 52} 3... Nf6 4. Bg2 {win% 53} 4... O-O 5. e4 {win% 49} 5... c6 6. Nf3 {win% 53} 6... d5 7. O-O?! {win% 53→36, meilleur : cxd5} 7... Bg4 8. d4?? {win% 51→11, meilleur : cxd5} 8... dxe4 9. Ne5 {win% 8} 9... Bxd1 10. Nxd1 {win% 5} 10... Qxd4 11. Bf4 {win% 5} 11... g5 12. Bxg5 {win% 4} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 3} 14... exf3 15. Bxf3 {win% 2} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
```

### Partie n°5 — victoire, Maia contre Maia-3 (881) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°5"]
[Date "2026.11.27"]
[White "Moi (831)"]
[Black "Maia-3 (881)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... e5 2. Bc4 {win% 51} 2... Nc6 3. Qf3 {win% 48} 3... Bc5 4. Qxf7# {win% 98} 1-0
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

1. e4 c5 {win% 46} 2. Nf3 Nc6 {win% 47} 3. Nc3 g6 {win% 47} 4. e5 Bg7 {win% 60} 5. d4 cxd4 {win% 60} 6. Nd5 e6?! {win% 89→76, meilleur : Qa5+} 7. Nf4 d5 {win% 66} 8. Bb5 a6?? {win% 88→44, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 45} 10. O-O h5?! {win% 53→42, meilleur : c5} 11. Nxd4 Bb7?! {win% 51→40, meilleur : c5} 12. b4 Bxe5 {win% 54} 13. Nde2 g5 {win% 74} 14. Nd3 Bxa1 {win% 74} 15. Bxg5 Qxg5 {win% 84} 16. Qxa1 Nf6 {win% 82} 17. Nc5 O-O {win% 81} 18. Nxb7 Kh7 {win% 77} 19. Nd4 Rg8 {win% 74} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `r2qkbr1/pQpn3p/3p2p1/4pb2/8/8/PPPP1PPP/RNB1K1NR w KQq - 0 8` | Blancs | Qc6 | 2 / 2 | erreur (j’avais joué Qxa8) |

## 5. Échiquier (mode « Maîtrise de l’échiquier »)

Mode pas encore commencé.
