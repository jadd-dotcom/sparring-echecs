# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 27/11/2026 09:49. Période : toutes les parties (premier rapport) — 5 parties.

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

Début : **900** → fin : **877** (-23).

Classement Chess.com (pour information) : 346 → 362.

| Partie | Date | Source | Couleur | Adversaire | Résultat | Fin | Répertoire | Niveau après |
|---|---|---|---|---|---|---|---|---|
| n°1 | 05/11/2026 | Chess.com | Blancs | yar100r (845) | Défaite (0-1) | Échec et mat | suivi ; adversaire sorti au coup 1… (g6) | – |
| n°2 | 18/11/2026 | Chess.com | Noirs | smarts00001 (315) | Victoire (0-1) | Échec et mat | suivi ; adversaire sorti au coup 4. (e5) | – |
| n°3 | 27/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 866 |
| n°4 | 27/11/2026 | Maia | Noirs | Maia-3 (916) | Nulle (1/2-1/2) | Triple répétition | **sorti au coup 1…** (e5 au lieu de c5) | 871 |
| n°5 | 27/11/2026 | Maia | Blancs | Maia-3 (921) | Nulle (1/2-1/2) | Triple répétition | hors répertoire dès le 1er coup (e4 au lieu de c4) | 877 |

### Résultats

Victoires / nulles / défaites : **1 / 2 / 2**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 0 / 2 / 1 | 75 % | 0,7 | 0,7 |
| Chess.com | 2 | 1 / 0 / 1 | 71,9 % | 0 | 1 |

### Par ouverture

| Ouverture | Parties | V / N / D | Resté dans mon répertoire jusqu’au coup 8 | Sorti moi-même avant | Adversaire sorti avant |
|---|---|---|---|---|---|
| Système …c5 / …g6 (Dragon accéléré) | 2 | 1 / 1 / 0 | 0 | 1 | 1 |
| Hors répertoire (Blancs) | 2 | 0 / 1 / 1 | 0 | 2 | 0 |
| Anglaise (système fermé) | 1 | 0 / 0 / 1 | 0 | 0 | 1 |

**Resté dans mon répertoire jusqu’au coup 8 : 0 / 5 parties (0 %)** — sorti moi-même avant : 3 (60 %) ; l’adversaire en est sorti avant : 2 (40 %).

- Contre Maia : 0 / 3 (0 %) · sur Chess.com : 0 / 2 (0 %).

#### Coups par lesquels l’adversaire sort de mon répertoire (vus au moins 2 fois)

Aucun coup vu 2 fois sur la période.

### Imprécisions, erreurs, gaffes par partie

| Partie | Mes coups | Précision | Imprécisions | Erreurs | Gaffes |
|---|---|---|---|---|---|
| n°1 | 25 | 72,8 % | 1 | 0 | 1 |
| n°2 | 20 | 71 % | 3 | 0 | 1 |
| n°3 | 34 | 77,2 % | 0 | 2 | 1 |
| n°4 | 14 | 68,6 % | 4 | 0 | 0 |
| n°5 | 29 | 79,2 % | 1 | 0 | 1 |
| **Moyenne par partie** | 24,4 | 73,8 % | 1,8 | 0,4 | 0,8 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 50 | 9 | 2 | 2 | 0,8 |
| Milieu | 67 | 0 | 0 | 2 | 0,3 |
| Finale | 5 | 0 | 0 | 0 | 0 |

### Motifs des erreurs et gaffes

Sur 6 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 0 |
| Menace ignorée | 1 |
| Pièce laissée en prise | 0 |
| Gain raté | 2 |
| Autre | 3 |

### Ce que je pensais (réponse en un toucher), par motif

Réponses données sur 2 de mes 6 erreurs et gaffes (dans la revue, avant de voir le meilleur coup).

| Motif | Menace pas vue | Mal calculé | Autre cible | Trop vite | Ne sait pas | Sans réponse |
|---|---|---|---|---|---|---|
| Mat raté | 0 | 0 | 0 | 0 | 0 | 0 |
| Mat ouvert | 0 | 0 | 0 | 0 | 0 | 0 |
| Menace ignorée | 0 | 0 | 0 | 0 | 0 | 1 |
| Pièce laissée en prise | 0 | 0 | 0 | 0 | 0 | 0 |
| Gain raté | 1 | 0 | 0 | 0 | 0 | 1 |
| Autre | 0 | 1 | 0 | 0 | 0 | 2 |
| **Total** | **1** | **1** | **0** | **0** | **0** | **4** |

Réponses : Menace pas vue = « Je n’ai pas vu la menace » ; Mal calculé = « J’ai vu, mais mal calculé » ; Autre cible = « Je voulais attaquer autre chose » ; Trop vite = « J’ai joué trop vite » ; Ne sait pas = « Je ne sais pas ».

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (6, tri par chute de win%)

### 1. Partie n°2, coup 8… a6?? — gaffe (−43 pts)

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
- Meilleur coup : **Qa5+** — suite : 8… Qa5+ 9. c3 Qxb5 10. a4 Qb6 — bilan matériel au bout : +4
- Réfutation de mon coup : 9. Bxc6+ bxc6 10. Qxd4 a5 11. O-O — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 2. Partie n°1, coup 8. d4?? — gaffe (−39 pts)

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

- Mon coup : **8. d4** → win% 52 → 12
- Meilleur coup : **e5** — suite : 8. e5 Nfd7 9. d4 dxc4 10. h3 — bilan matériel au bout : -1
- Réfutation de mon coup : 8… dxe4 9. h3 exf3 10. hxg4 fxg2 — bilan matériel au bout : -4
- Ce que je pensais : (non renseigné)

### 3. Partie n°5, coup 13. Rg1?? — gaffe (−38 pts)

- Source : Maia · adversaire : Maia-3 (921)
- Ma couleur : Blancs · phase : milieu · motif : **Autre**
- Dernier coup adverse : 12… Nxf3
- FEN avant mon coup : `r3kb1r/pp3ppp/2p5/8/B7/2P2n1P/P1P2P2/R1BK3R w kq - 0 13`

```
  +-----------------+
8 | r . . . k b . r |
7 | p p . . . p p p |
6 | . . p . . . . . |
5 | . . . . . . . . |
4 | B . . . . . . . |
3 | . . P . . n . P |
2 | P . P . . P . . |
1 | R . B K . . . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **13. Rg1** → win% 42 → 4
- Meilleur coup : **Ke2** — suite : 13. Ke2 Ne5 14. Rd1 a5 15. f4 — bilan matériel au bout : -1
- Réfutation de mon coup : 13… O-O-O+ 14. Ke2 Nxg1+ 15. Ke1 Nxh3 — bilan matériel au bout : -7
- Ce que je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »

### 4. Partie n°3, coup 20. Bg5?? — gaffe (−37 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : milieu · motif : **Menace ignorée** (aussi : Pièce laissée en prise)
- Dernier coup adverse : 19… exd4
- FEN avant mon coup : `rn2kr2/p2n2pp/8/2N5/B1qp4/8/PP3PPP/R1B2RK1 w - - 0 20`

```
  +-----------------+
8 | r n . . k r . . |
7 | p . . n . . p p |
6 | . . . . . . . . |
5 | . . N . . . . . |
4 | B . q p . . . . |
3 | . . . . . . . . |
2 | P P . . . P P P |
1 | R . B . . R K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **20. Bg5** → win% 59 → 21
- Meilleur coup : **Re1+** — suite : 20. Re1+ Kd8 21. Bg5+ Kc7 22. Nxd7 — bilan matériel au bout : -2
- Réfutation de mon coup : 20… Qxc5 21. Rfe1+ Kf7 22. Bb3+ Kg6 — bilan matériel au bout : -8
- Menace avant mon coup (si l’adversaire rejouait) : 20… Qxc5 21. Bd2 Kd8 22. Bb3 Nc6
- Ce que je pensais : (non renseigné)

### 5. Partie n°3, coup 3. Bb5+? — erreur (−25 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 2… Nf6
- FEN avant mon coup : `rnbqkb1r/ppp1pppp/5n2/3p3Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 2 3`

```
  +-----------------+
8 | r n b q k b . r |
7 | p p p . p p p p |
6 | . . . . . n . . |
5 | . . . p . . . Q |
4 | . . . . P . . . |
3 | . . . . . . . . |
2 | P P P P . P P P |
1 | R N B . K B N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **3. Bb5+** → win% 34 → 9
- Meilleur coup : **Qe2** — suite : 3. Qe2 dxe4 4. Nc3 Bg4 5. Qc4 — bilan matériel au bout : -1
- Réfutation de mon coup : 3… c6 4. Qe2 cxb5 5. e5 Ne4 — bilan matériel au bout : -3
- Menace avant mon coup (si l’adversaire rejouait) : 3… Nxh5 4. exd5 Nf4 5. d4 Nxd5
- Ce que je pensais : (non renseigné)

### 6. Partie n°3, coup 2. Qh5? — erreur (−22 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : ouverture · motif : **Gain raté**
- Dernier coup adverse : 1… d5
- FEN avant mon coup : `rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2`

```
  +-----------------+
8 | r n b q k b n r |
7 | p p p . p p p p |
6 | . . . . . . . . |
5 | . . . p . . . . |
4 | . . . . P . . . |
3 | . . . . . . . . |
2 | P P P P . P P P |
1 | R N B Q K B N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **2. Qh5** → win% 56 → 35
- Meilleur coup : **exd5** — suite : 2. exd5 c6 3. dxc6 Nxc6 4. Nf3 — bilan matériel au bout : +1
- Réfutation de mon coup : 2… Nf6 3. Qe2 Nxe4 4. Nc3 Nf6 — bilan matériel au bout : -1
- Ce que je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »

## 3. Mes parties (les 5 : défaites, puis nulles, puis victoires)

Sur la période : 2 défaites, 2 nulles, 1 victoire.

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.27"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... d5 2. Qh5? {win% 56→35, meilleur : exd5. Je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »} 2... Nf6 3. Bb5+? {win% 34→9, meilleur : Qe2} 3... c6 4. Qxf7+ {win% 4} 4... Kxf7 5. Be2 {win% 6} 5... dxe4 6. Bc4+ {win% 4} 6... Ke8 7. Nc3 {win% 5} 7... b5 8. Bb3 {win% 5} 8... b4 9. Na4 {win% 6} 9... e5 10. Ne2 {win% 5} 10... c5 11. c3 {win% 4} 11... Bd7 12. cxb4 {win% 4} 12... Bxa4 13. Bxa4+ {win% 6} 13... Nfd7 14. bxc5 {win% 7} 14... Bxc5 15. Nc3 {win% 7} 15... Qf6 16. O-O {win% 8} 16... Rf8 17. Nxe4 {win% 15} 17... Qf4 18. Nxc5 {win% 16} 18... Qc4 19. d4 {win% 32} 19... exd4 20. Bg5?? {win% 59→21, meilleur : Re1+} 20... Qxc5 21. Rae1+ {win% 21} 21... Kf7 22. Bb3+ {win% 18} 22... Kg6 23. Re6+ {win% 10} 23... Kxg5 24. Bd1 {win% 5} 24... d3 25. h3 {win% 3} 25... d2 26. Bg4 {win% 2} 26... Qc4 27. Re5+ {win% 2} 27... Nxe5 28. f3 {win% 2} 28... Nxg4 29. hxg4 {win% 2} 29... Qd4+ 30. Kh2 {win% 2} 30... d1=Q 31. Rxd1 {win% 2} 31... Qxd1 32. f4+ {win% 2} 32... Rxf4 33. g3 {win% 2} 33... Rxg4 34. Kh3 {win% 2} 34... Qh1# 0-1
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

1. c4 {win% 51} 1... g6 2. Nc3 {win% 52} 2... Bg7 3. g3 {win% 52} 3... Nf6 4. Bg2 {win% 53} 4... O-O 5. e4 {win% 50} 5... c6 6. Nf3 {win% 53} 6... d5 7. O-O?! {win% 54→35, meilleur : cxd5} 7... Bg4 8. d4?? {win% 52→12, meilleur : e5} 8... dxe4 9. Ne5 {win% 9} 9... Bxd1 10. Nxd1 {win% 6} 10... Qxd4 11. Bf4 {win% 5} 11... g5 12. Bxg5 {win% 4} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 2} 14... exf3 15. Bxf3 {win% 3} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
```

### Partie n°5 — nulle, Maia contre Maia-3 (921) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°5"]
[Date "2026.11.27"]
[White "Moi (871)"]
[Black "Maia-3 (921)"]
[Result "1/2-1/2"]
[Termination "Triple répétition"]

1. e4 {win% 53} 1... e5 2. d4 {win% 49} 2... Nc6 3. Nf3 {win% 51} 3... Nf6 4. Nc3 {win% 50} 4... d5 5. exd5 {win% 54} 5... Nxd5 6. dxe5 {win% 53} 6... Nxc3 7. bxc3?! {win% 56→45, meilleur : Qxd8+} 7... Qxd1+ 8. Kxd1 {win% 46} 8... Bg4 9. h3 {win% 43} 9... Bxf3+ 10. gxf3 {win% 44} 10... Nxe5 11. Bb5+ {win% 43} 11... c6 12. Ba4 {win% 38} 12... Nxf3 13. Rg1?? {win% 42→4, meilleur : Ke2. Je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »} 13... Nxg1 14. h4 {win% 5} 14... O-O-O+ 15. Ke1 {win% 4} 15... Nf3+ 16. Ke2 {win% 4} 16... Nxh4 17. f3 {win% 2} 17... b5 18. Bb3 {win% 4} 18... Bd6 19. c4 {win% 4} 19... Rde8+ 20. Be3 {win% 2} 20... Bf4 21. Rh1 {win% 2} 21... Ng2 22. cxb5 {win% 2} 22... Rxe3+ 23. Kf2 {win% 2} 23... Nh4 24. Rxh4 {win% 6} 24... Rhe8 25. Rxf4 {win% 13} 25... Re2+ 26. Kf1 {win% 12} 26... Re1+ 27. Kf2 {win% 11} 27... R1e2+ 28. Kf1 {win% 11} 28... Re1+ 29. Kf2 {win% 11} 29... R1e2+ 1/2-1/2
```

### Partie n°4 — nulle, Maia contre Maia-3 (916) · répertoire : sorti au coup 1… (e5 au lieu de c5)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.27"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1/2-1/2"]
[Termination "Triple répétition"]

1. e4 e5 {win% 47} 2. d4 d5?! {win% 49→37, meilleur : exd4} 3. dxe5 dxe4 {win% 36} 4. Nc3 Bb4?! {win% 51→33, meilleur : Qxd1+} 5. Qxd8+ Kxd8 {win% 33} 6. Bd2 Ne7 {win% 33} 7. Nxe4 Nbc6?! {win% 35→24, meilleur : Bxd2+} 8. Bxb4 Nxb4 {win% 24} 9. O-O-O+ Ke8 {win% 24} 10. Bb5+ Bd7?! {win% 23→6, meilleur : Nbc6} 11. Bxd7+ Kd8 {win% 5} 12. Be6+ Ke8 {win% 5} 13. Bd7+ Kd8 {win% 5} 14. Be6+ Ke8 {win% 5} 15. Bd7+ 1/2-1/2
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

1. e4 c5 {win% 46} 2. Nf3 Nc6 {win% 47} 3. Nc3 g6 {win% 46} 4. e5 Bg7 {win% 61} 5. d4 cxd4 {win% 59} 6. Nd5 e6?! {win% 88→76, meilleur : Qa5+} 7. Nf4 d5?! {win% 77→62, meilleur : d6} 8. Bb5 a6?? {win% 88→45, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 45} 10. O-O h5?! {win% 54→42, meilleur : c5} 11. Nxd4 Bb7 {win% 42} 12. b4 Bxe5 {win% 55} 13. Nde2 g5 {win% 75} 14. Nd3 Bxa1 {win% 73} 15. Bxg5 Qxg5 {win% 84} 16. Qxa1 Nf6 {win% 84} 17. Nc5 O-O {win% 80} 18. Nxb7 Kh7 {win% 75} 19. Nd4 Rg8 {win% 75} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2` | Blancs | exd5 | 2 / 2 | erreur (j’avais joué Qh5) |

## 5. Échiquier (mode « Maîtrise de l’échiquier »)

Mode pas encore commencé.
