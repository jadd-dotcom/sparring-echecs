# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 24/11/2026 19:26. Période : toutes les parties (premier rapport) — 5 parties.

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
| n°3 | 24/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Abandon | hors répertoire dès le 1er coup (e4 au lieu de c4) | 866 |
| n°4 | 24/11/2026 | Maia | Noirs | Maia-3 (916) | Défaite (1-0) | Abandon | **sorti au coup 1…** (d5 au lieu de Nf6) | 831 |
| n°5 | 24/11/2026 | Maia | Blancs | Maia-3 (881) | Victoire (1-0) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 877 |

### Résultats

Victoires / nulles / défaites : **2 / 0 / 3**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 1 / 0 / 2 | 59,7 % | 1,3 | 2,3 |
| Chess.com | 2 | 1 / 0 / 1 | 71,2 % | 0 | 1 |

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
| n°1 | 25 | 72,4 % | 1 | 0 | 1 |
| n°2 | 20 | 70,1 % | 2 | 0 | 1 |
| n°3 | 45 | 48,2 % | 3 | 1 | 3 |
| n°4 | 45 | 85,4 % | 2 | 1 | 0 |
| n°5 | 33 | 45,5 % | 1 | 2 | 4 |
| **Moyenne par partie** | 33,6 | 64,3 % | 1,8 | 0,8 | 1,8 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 50 | 7 | 1 | 3 | 0,8 |
| Milieu | 74 | 1 | 3 | 5 | 1,1 |
| Finale | 44 | 1 | 0 | 1 | 0,2 |

### Motifs des erreurs et gaffes

Sur 13 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 0 |
| Menace ignorée | 0 |
| Pièce laissée en prise | 2 |
| Gain raté | 5 |
| Autre | 6 |

### Ce que je pensais (réponse en un toucher), par motif

Réponses données sur 3 de mes 13 erreurs et gaffes (dans la revue, avant de voir le meilleur coup).

| Motif | Menace pas vue | Mal calculé | Autre cible | Trop vite | Ne sait pas | Sans réponse |
|---|---|---|---|---|---|---|
| Mat raté | 0 | 0 | 0 | 0 | 0 | 0 |
| Mat ouvert | 0 | 0 | 0 | 0 | 0 | 0 |
| Menace ignorée | 0 | 0 | 0 | 0 | 0 | 0 |
| Pièce laissée en prise | 0 | 0 | 0 | 0 | 0 | 2 |
| Gain raté | 1 | 0 | 0 | 0 | 0 | 4 |
| Autre | 0 | 1 | 1 | 0 | 0 | 4 |
| **Total** | **1** | **1** | **1** | **0** | **0** | **10** |

Réponses : Menace pas vue = « Je n’ai pas vu la menace » ; Mal calculé = « J’ai vu, mais mal calculé » ; Autre cible = « Je voulais attaquer autre chose » ; Trop vite = « J’ai joué trop vite » ; Ne sait pas = « Je ne sais pas ».

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (10, tri par chute de win%)

### 1. Partie n°5, coup 29. Qxh4?? — gaffe (−91 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : milieu · motif : **Gain raté**
- Dernier coup adverse : 28… Kf5
- FEN avant mon coup : `r3Q3/pbp1Q1pp/3p4/2b2k2/7q/7P/P5r1/3RR2K w - - 3 29`

```
  +-----------------+
8 | r . . . Q . . . |
7 | p b p . Q . p p |
6 | . . . p . . . . |
5 | . . b . . k . . |
4 | . . . . . . . q |
3 | . . . . . . . P |
2 | P . . . . . r . |
1 | . . . R R . . K |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **29. Qxh4** → win% 98 → 6
- Meilleur coup : **Re5+** — suite : 29. Re5+ Kf4 30. Qa4+ Bb4 31. Qxb4+ — bilan matériel au bout : +3
- Réfutation de mon coup : 29… Re2+ 30. Qee4+ Bxe4+ 31. Qxe4+ Rxe4 — bilan matériel au bout : -6
- Menace avant mon coup (si l’adversaire rejouait) : 29… Qxh3#
- Ce que je pensais : (non renseigné)

### 2. Partie n°3, coup 19. Kd2?? — gaffe (−81 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : milieu · motif : **Gain raté**
- Dernier coup adverse : 18… Qxa1+
- FEN avant mon coup : `r4rk1/ppp2ppp/4p3/4Q3/5P1P/3P4/P1P5/q2K1B1R w - - 0 19`

```
  +-----------------+
8 | r . . . . r k . |
7 | p p p . . p p p |
6 | . . . . p . . . |
5 | . . . . Q . . . |
4 | . . . . . P . P |
3 | . . . P . . . . |
2 | P . P . . . . . |
1 | q . . K . B . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **19. Kd2** → win% 93 → 13
- Meilleur coup : **Qxa1** — suite : 19. Qxa1 Rad8 20. Rg1 f6 21. Qc1 — bilan matériel au bout : +5
- Réfutation de mon coup : 19… Qxe5 20. fxe5 Rfd8 — bilan matériel au bout : -4
- Ce que je pensais : (non renseigné)

### 3. Partie n°3, coup 12. Ng5?? — gaffe (−76 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : milieu · motif : **Gain raté**
- Dernier coup adverse : 11… Nc6
- FEN avant mon coup : `r2q1rk1/ppp2ppp/2n1p3/4P3/4n3/3P1N2/PPP3PP/R2QKB1R w - - 5 12`

```
  +-----------------+
8 | r . . q . r k . |
7 | p p p . . p p p |
6 | . . n . p . . . |
5 | . . . . P . . . |
4 | . . . . n . . . |
3 | . . . P . N . . |
2 | P P P . . . P P |
1 | R . . Q K B . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **12. Ng5** → win% 84 → 8
- Meilleur coup : **dxe4** — suite : 12. dxe4 Nxe5 13. Qxd8 Nxf3+ 14. gxf3 — bilan matériel au bout : +11
- Réfutation de mon coup : 12… Qxg5 13. dxe4 Qh4+ 14. g3 Qxe4+ — bilan matériel au bout : -1
- Ce que je pensais : (non renseigné)

### 4. Partie n°5, coup 13. Qd5?? — gaffe (−50 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : milieu · motif : **Pièce laissée en prise** (aussi : Gain raté)
- Dernier coup adverse : 12… Kh8
- FEN avant mon coup : `r1b2r1k/pppqNppp/2np4/1Bb1n1B1/4P3/5N1P/PPP2PP1/R2Q1RK1 w - - 7 13`

```
  +-----------------+
8 | r . b . . r . k |
7 | p p p q N p p p |
6 | . . n p . . . . |
5 | . B b . n . B . |
4 | . . . . P . . . |
3 | . . . . . N . P |
2 | P P P . . P P . |
1 | R . . Q . R K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **13. Qd5** → win% 59 → 9
- Meilleur coup : **Nxe5** — suite : 13. Nxe5 dxe5 14. Nxc8 Qxc8 15. Qd5 — bilan matériel au bout : 0
- Réfutation de mon coup : 13… Nxf3+ 14. Kh1 Nxe7 15. Bxd7 Nxd5 — bilan matériel au bout : -6
- Ce que je pensais : (non renseigné)

### 5. Partie n°5, coup 15. Bxc6?? — gaffe (−44 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : milieu · motif : **Pièce laissée en prise** (aussi : Gain raté)
- Dernier coup adverse : 14… bxc6
- FEN avant mon coup : `r1b2r1k/p1pq2pp/2pp1p2/1BbQn1B1/4P3/5N1P/PPP2PP1/R4RK1 w - - 0 15`

```
  +-----------------+
8 | r . b . . r . k |
7 | p . p q . . p p |
6 | . . p p . p . . |
5 | . B b Q n . B . |
4 | . . . . P . . . |
3 | . . . . . N . P |
2 | P P P . . P P . |
1 | R . . . . R K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **15. Bxc6** → win% 54 → 10
- Meilleur coup : **Nxe5** — suite : 15. Nxe5 cxd5 16. Nxd7 Bxd7 17. Bxd7 — bilan matériel au bout : +3
- Réfutation de mon coup : 15… Nxc6 16. e5 fxg5 17. b4 Bxb4 — bilan matériel au bout : -6
- Ce que je pensais : (non renseigné)

### 6. Partie n°2, coup 8… a6?? — gaffe (−43 pts)

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
- Meilleur coup : **Qa5+** — suite : 8… Qa5+ 9. Bd2 Qxb5 10. Nd3 Qb6 — bilan matériel au bout : +4
- Réfutation de mon coup : 9. Bxc6+ bxc6 10. Qxd4 Ne7 11. Nd3 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 7. Partie n°5, coup 10. Bg5?? — gaffe (−43 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 9… Nge5
- FEN avant mon coup : `r1bq1rk1/ppp2ppp/2np4/1Bb1n3/4P3/2N2N1P/PPP2PP1/R1BQ1RK1 w - - 1 10`

```
  +-----------------+
8 | r . b q . r k . |
7 | p p p . . p p p |
6 | . . n p . . . . |
5 | . B b . n . . . |
4 | . . . . P . . . |
3 | . . N . . N . P |
2 | P P P . . P P . |
1 | R . B Q . R K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **10. Bg5** → win% 52 → 9
- Meilleur coup : **Bxc6** — suite : 10. Bxc6 Nxc6 11. Bf4 f6 12. Nd5 — bilan matériel au bout : 0
- Réfutation de mon coup : 10… Nxf3+ 11. Qxf3 Qxg5 12. Bxc6 bxc6 — bilan matériel au bout : -3
- Ce que je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »

### 8. Partie n°1, coup 8. d4?? — gaffe (−42 pts)

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

- Mon coup : **8. d4** → win% 53 → 11
- Meilleur coup : **cxd5** — suite : 8. cxd5 cxd5 9. e5 Ne8 10. d4 — bilan matériel au bout : 0
- Réfutation de mon coup : 8… dxe4 9. Nxe4 Nxe4 10. Qb3 Nd6 — bilan matériel au bout : -3
- Ce que je pensais : (non renseigné)

### 9. Partie n°3, coup 41. Rh7+?? — gaffe (−39 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : finale · motif : **Autre**
- Dernier coup adverse : 40… f3
- FEN avant mon coup : `5r2/p3K1k1/1p6/1B6/8/5pp1/8/7R w - - 0 41`

```
  +-----------------+
8 | . . . . . r . . |
7 | p . . . K . k . |
6 | . p . . . . . . |
5 | . B . . . . . . |
4 | . . . . . . . . |
3 | . . . . . p p . |
2 | . . . . . . . . |
1 | . . . . . . . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **41. Rh7+** → win% 45 → 6
- Meilleur coup : **Rh3** — suite : 41. Rh3 Rf7+ 42. Ke8 Rf5 43. Rxg3+ — bilan matériel au bout : 0
- Réfutation de mon coup : 41… Kxh7 42. Kxf8 Kh6 43. Ke8 g2 — bilan matériel au bout : -1
- Ce que je pensais : (non renseigné)

### 10. Partie n°4, coup 8… Bb6? — erreur (−26 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 8. b4
- FEN avant mon coup : `rnbqk1nr/pp3ppp/4p3/b1p5/1PBP4/P1N1P3/3B1PPP/R2QK1NR b KQkq - 0 8`

```
  +-----------------+
1 | R N . K Q . . R |
2 | P P P . B . . . |
3 | . . . P . N . P |
4 | . . . . P B P . |
5 | . . . . . p . b |
6 | . . . p . . . . |
7 | p p p . . . p p |
8 | r n . k q b n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **8… Bb6** → win% 49 → 23
- Meilleur coup : **cxb4** — suite : 8… cxb4 9. Bb5+ Bd7 10. Bxd7+ Qxd7 — bilan matériel au bout : +1
- Réfutation de mon coup : 9. dxc5 Bc7 10. Nb5 Nf6 11. Bc3 — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 8. bxa5 Nf6 9. Bb5+ Bd7 10. Bd3
- Ce que je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »

## 3. Mes parties (les 5 : défaites, puis nulles, puis victoires)

Sur la période : 3 défaites, 0 nulle, 2 victoires.

### Partie n°4 — défaite, Maia contre Maia-3 (916) · répertoire : sorti au coup 1… (d5 au lieu de Nf6)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.24"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Abandon"]

1. d4 d5 {win% 48} 2. c4 dxc4 {win% 47} 3. e3 e6 {win% 47} 4. Bxc4 c6 {win% 42} 5. Nc3 Bb4 {win% 39} 6. Bd2 c5 {win% 42} 7. a3 Ba5?! {win% 43→26, meilleur : Bxc3} 8. b4 Bb6? {win% 49→23, meilleur : cxb4. Je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »} 9. bxc5 Bc7 {win% 24} 10. Nf3 Ba5?! {win% 24→13, meilleur : Nf6} 11. O-O Bxc3 {win% 18} 12. Bxc3 Nc6 {win% 13} 13. d5 Nce7 {win% 6} 14. dxe6 fxe6 {win% 4} 15. Bxg7 Ng6 {win% 5} 16. Bxh8 Nxh8 {win% 5} 17. Nd4 e5 {win% 2} 18. Ne6 Bxe6 {win% 7} 19. Bxe6 Ne7 {win% 3} 20. Qxd8+ Kxd8 {win% 7} 21. Rfd1+ Ke8 {win% 7} 22. Bd7+ Kf8 {win% 7} 23. Rd6 Nf7 {win% 9} 24. Rf6 Ng8 {win% 9} 25. Rf3 Rd8 {win% 8} 26. Be6 Rd2 {win% 2} 27. Bxf7 Nh6 {win% 4} 28. h3 Rd7 {win% 2} 29. Be6+ Ke7 {win% 2} 30. Bxd7 Kxd7 {win% 2} 31. Rd1+ Kc6 {win% 2} 32. Rf6+ Kxc5 {win% 2} 33. Rxh6 e4 {win% 2} 34. Rc1+ Kd5 {win% 2} 35. Rh5+ Ke6 {win% 2} 36. Rcc5 Kd6 {win% 2} 37. Rcg5 Kc6 {win% 2} 38. Rxh7 Kb6 {win% 2} 39. Rh4 Kc7 {win% 2} 40. Rxe4 b5 {win% 2} 41. Rxb5 a6 {win% 2} 42. Rb1 a5 {win% 2} 43. Rc1+ Kb6 {win% 2} 44. Re5 Ka6 {win% 2} 45. Rc6+ Kb7 {win% 2} 46. Rce6 1-0
```

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.24"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Abandon"]

1. e4 {win% 53} 1... d5 2. Nc3 {win% 47} 2... dxe4 3. Nxe4 {win% 51} 3... Bf5 4. f3 {win% 43} 4... e6 5. d3 {win% 44} 5... Bb4+ 6. Bd2 {win% 49} 6... Bxe4 7. fxe4 {win% 51} 7... Bxd2+ 8. Kxd2?! {win% 52→40, meilleur : Qxd2} 8... Nf6 9. e5 {win% 38} 9... Ne4+ 10. Ke1?! {win% 46→31, meilleur : Ke2} 10... O-O 11. Nf3? {win% 64→41, meilleur : dxe4. Je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »} 11... Nc6 12. Ng5?? {win% 84→8, meilleur : dxe4} 12... Nxg5 13. h4 {win% 13} 13... Nf3+ 14. gxf3 {win% 17} 14... Nxe5 15. Qe2 {win% 16} 15... Qd6 16. f4 {win% 12} 16... Qb4+ 17. Kd1 {win% 14} 17... Qxb2 18. Qxe5 {win% 72} 18... Qxa1+ 19. Kd2?? {win% 93→13, meilleur : Qxa1} 19... Qxa2 20. Qxc7 {win% 6} 20... b6 21. Rg1 {win% 7} 21... Rac8 22. Qe5 {win% 7} 22... Qxc2+ 23. Ke3 {win% 9} 23... Qc5+ 24. d4 {win% 9} 24... Qxe5+ 25. dxe5 {win% 8} 25... Rc3+ 26. Kd4 {win% 7} 26... Rc1 27. h5 {win% 6} 27... g6 28. hxg6 {win% 5} 28... hxg6 29. f5 {win% 4} 29... exf5 30. e6 {win% 4} 30... Rd8+ 31. Ke5 {win% 3} 31... fxe6 32. Kxe6 {win% 4} 32... Re8+ 33. Kf6 {win% 8} 33... Kh7 34. Bb5 {win% 3} 34... Rf8+ 35. Ke7 {win% 3} 35... Kg7 36. Rxc1 {win% 37} 36... g5 37. Rg1 {win% 46} 37... g4 38. Rf1?! {win% 48→32, meilleur : Bd3} 38... f4 39. Rg1 {win% 31} 39... g3 40. Rh1 {win% 20} 40... f3 41. Rh7+?? {win% 45→6, meilleur : Rh3} 41... Kxh7 42. Bd3+ {win% 2} 42... Kg7 43. Kd7 {win% 2} 43... g2 44. Kc7 {win% 2} 44... g1=Q 45. Kb7 {win% 2} 45... Qa1 0-1
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

1. c4 {win% 51} 1... g6 2. Nc3 {win% 51} 2... Bg7 3. g3 {win% 51} 3... Nf6 4. Bg2 {win% 53} 4... O-O 5. e4 {win% 49} 5... c6 6. Nf3 {win% 53} 6... d5 7. O-O?! {win% 53→36, meilleur : cxd5} 7... Bg4 8. d4?? {win% 53→11, meilleur : cxd5} 8... dxe4 9. Ne5 {win% 9} 9... Bxd1 10. Nxd1 {win% 6} 10... Qxd4 11. Bf4 {win% 5} 11... g5 12. Bxg5 {win% 5} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 2} 14... exf3 15. Bxf3 {win% 2} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
```

### Partie n°5 — victoire, Maia contre Maia-3 (881) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°5"]
[Date "2026.11.24"]
[White "Moi (831)"]
[Black "Maia-3 (881)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... e5 2. d4 {win% 50} 2... exd4 3. Qxd4 {win% 48} 3... Nc6 4. Qd1 {win% 44} 4... Bc5 5. Nc3 {win% 47} 5... Nf6 6. Bb5 {win% 46} 6... O-O 7. Nf3 {win% 46} 7... Ng4 8. O-O {win% 53} 8... d6 9. h3 {win% 51} 9... Nge5 10. Bg5?? {win% 52→9, meilleur : Bxc6. Je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »} 10... Qe8 11. Nd5 {win% 58} 11... Qd7 12. Ne7+? {win% 82→60, meilleur : Be7} 12... Kh8 13. Qd5?? {win% 59→9, meilleur : Nxe5} 13... f6 14. Nxc6 {win% 12} 14... bxc6 15. Bxc6?? {win% 54→10, meilleur : Nxe5} 15... Nxc6 16. Rad1 {win% 8} 16... fxg5 17. Nxg5 {win% 6} 17... Ba6 18. Rfe1 {win% 4} 18... Rxf2 19. e5?! {win% 20→3, meilleur : Qxc5} 19... Rxc2+ 20. Kh2 {win% 13} 20... Rxb2 21. Nf7+ {win% 15} 21... Kg8 22. e6? {win% 33→11, meilleur : Nxd6+} 22... Qe7 23. Qxc6 {win% 6} 23... Bb7 24. Qd7 {win% 2} 24... Qh4 25. e7 {win% 2} 25... Rxg2+ 26. Kh1 {win% 2} 26... Kxf7 27. e8=Q+ {win% 98} 27... Kf6 28. Qde7+ {win% 98} 28... Kf5 29. Qxh4?? {win% 98→6, meilleur : Re5+} 29... Rg1+ 30. Kh2 {win% 6} 30... Rh1+ 31. Rxh1 {win% 98} 31... Bxh1 32. Rf1+ {win% 98} 32... Bf3 33. Rxf3# {win% 98} 1-0
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

1. e4 c5 {win% 46} 2. Nf3 Nc6 {win% 46} 3. Nc3 g6 {win% 48} 4. e5 Bg7 {win% 61} 5. d4 cxd4 {win% 60} 6. Nd5 e6?! {win% 89→75, meilleur : Qa5+} 7. Nf4 d5?! {win% 77→60, meilleur : d6} 8. Bb5 a6?? {win% 88→45, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 45} 10. O-O h5 {win% 43} 11. Nxd4 Bb7 {win% 43} 12. b4 Bxe5 {win% 55} 13. Nde2 g5 {win% 73} 14. Nd3 Bxa1 {win% 75} 15. Bxg5 Qxg5 {win% 83} 16. Qxa1 Nf6 {win% 84} 17. Nc5 O-O {win% 79} 18. Nxb7 Kh7 {win% 77} 19. Nd4 Rg8 {win% 74} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `rn1q1rk1/ppp2ppp/4p3/4P3/4n3/3P4/PPP3PP/R2QKBNR w - - 3 11` | Blancs | dxe4 | 2 / 2 | erreur (j’avais joué Nf3) |

## 5. Échiquier (mode « Maîtrise de l’échiquier »)

Mode pas encore commencé.
