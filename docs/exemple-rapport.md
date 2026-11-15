# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 15/11/2026 23:13. Période : toutes les parties (premier rapport) — 3 parties.

**Demande :** je suis débutant. À partir de ces données (calculées automatiquement, pas devinées), diagnostique mes lacunes principales, explique-les simplement et propose-moi 3 axes de travail concrets.

## Définitions

- **Niveau** : estimation de type Elo, échelle Lichess (bornes 600–2600), mise à jour après chaque partie. Mon adversaire est Maia-3, une IA qui imite le jeu humain, réglée 50 points au-dessus de mon niveau.
- **win%** : mes chances de gain estimées depuis l’évaluation de Stockfish (formule Lichess), de mon point de vue.
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

### Niveau

Début : **900** → fin : **797** (-103).

| Partie | Date | Couleur | Résultat | Fin | Niveau après |
|---|---|---|---|---|---|
| n°1 | 15/11/2026 | Blancs | Défaite (0-1) | Échec et mat | 866 |
| n°2 | 15/11/2026 | Noirs | Défaite (1-0) | Échec et mat | 831 |
| n°3 | 15/11/2026 | Blancs | Défaite (0-1) | Abandon | 797 |

### Résultats

Victoires / nulles / défaites : **0 / 0 / 3**.

### Imprécisions, erreurs, gaffes par partie

| Partie | Mes coups | Imprécisions | Erreurs | Gaffes |
|---|---|---|---|---|
| n°1 | 19 | 1 | 0 | 2 |
| n°2 | 31 | 9 | 1 | 0 |
| n°3 | 45 | 1 | 1 | 7 |
| **Moyenne par partie** | 31,7 | 3,7 | 0,7 | 3 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 30 | 4 | 1 | 5 | 2 |
| Milieu | 42 | 3 | 0 | 2 | 0,5 |
| Finale | 23 | 4 | 1 | 2 | 1,3 |

### Motifs des erreurs et gaffes

Sur 11 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 0 |
| Menace ignorée | 2 |
| Pièce laissée en prise | 6 |
| Autre | 3 |

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes 10 pires erreurs (tri par chute de win%)

### 1. Partie n°3, coup 25. Ka2?? — gaffe (−86 pts)

- Ma couleur : Blancs · phase : milieu · motif : **Autre**
- Dernier coup adverse : 24… Qxc3+
- FEN avant mon coup : `3rk1B1/p7/6p1/5p2/P3p3/R1qb4/5PPP/K6R w - - 0 25`

```
  +-----------------+
8 | . . . r k . B . |
7 | p . . . . . . . |
6 | . . . . . . p . |
5 | . . . . . p . . |
4 | P . . . p . . . |
3 | R . q b . . . . |
2 | . . . . . P P P |
1 | K . . . . . . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **25. Ka2** → win% 88 → 2
- Meilleur coup : **Rxc3** — suite : 25. Rxc3 e3 26. fxe3 a5 27. Rc7 — bilan matériel au bout : +6
- Réfutation de mon coup : 25… Bc4+ 26. Kb1 Rb8+ 27. Rb3 Rxb3+ — bilan matériel au bout : -9
- Ce que je pensais : (non renseigné)

### 2. Partie n°3, coup 11. Qh6?? — gaffe (−82 pts)

- Ma couleur : Blancs · phase : milieu · motif : **Pièce laissée en prise**
- Dernier coup adverse : 10… Nd7
- FEN avant mon coup : `r1bqkbB1/p2n4/2p3p1/1p3p2/4p2Q/8/PPPP1PPP/RNB1K1NR w KQq - 2 11`

```
  +-----------------+
8 | r . b q k b B . |
7 | p . . n . . . . |
6 | . . p . . . p . |
5 | . p . . . p . . |
4 | . . . . p . . Q |
3 | . . . . . . . . |
2 | P P P P . P P P |
1 | R N B . K . N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **11. Qh6** → win% 98 → 15
- Meilleur coup : **Bf7+** — suite : 11. Bf7+ Kxf7 12. Qxd8 Nb6 13. Qc7+ — bilan matériel au bout : +15
- Réfutation de mon coup : 11… Bxh6 12. h4 Qf6 13. Nc3 b4 — bilan matériel au bout : 0
- Menace avant mon coup (si l’adversaire rejouait) : 11… Qxh4 12. a4 bxa4 13. d4 exd3
- Ce que je pensais : (non renseigné)

### 3. Partie n°3, coup 7. Qh4?? — gaffe (−77 pts)

- Ma couleur : Blancs · phase : ouverture · motif : **Pièce laissée en prise**
- Dernier coup adverse : 6… dxe4
- FEN avant mon coup : `rnbqkb2/ppp2p1Q/6p1/8/4p3/8/PPPP1PPP/RNB1KBNR w KQq - 0 7`

```
  +-----------------+
8 | r n b q k b . . |
7 | p p p . . p . Q |
6 | . . . . . . p . |
5 | . . . . . . . . |
4 | . . . . p . . . |
3 | . . . . . . . . |
2 | P P P P . P P P |
1 | R N B . K B N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **7. Qh4** → win% 94 → 17
- Meilleur coup : **Bc4** — suite : 7. Bc4 Qf6 8. Bxf7+ Qxf7 9. Qxf7+ — bilan matériel au bout : +16
- Réfutation de mon coup : 7… Qxh4 8. g3 Qe7 9. Nc3 Nc6 — bilan matériel au bout : 0
- Ce que je pensais : « Je cherchais à échanger les dames pour simplifier. »

### 4. Partie n°3, coup 10. Bg8?? — gaffe (−76 pts)

- Ma couleur : Blancs · phase : ouverture · motif : **Menace ignorée** (aussi : Pièce laissée en prise)
- Dernier coup adverse : 9… b5
- FEN avant mon coup : `rnbqkb2/p7/2p3p1/1p3p2/2B1p2Q/8/PPPP1PPP/RNB1K1NR w KQq - 0 10`

```
  +-----------------+
8 | r n b q k b . . |
7 | p . . . . . . . |
6 | . . p . . . p . |
5 | . p . . . p . . |
4 | . . B . p . . Q |
3 | . . . . . . . . |
2 | P P P P . P P P |
1 | R N B . K . N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **10. Bg8** → win% 96 → 19
- Meilleur coup : **Bf7+** — suite : 10. Bf7+ Kd7 11. Qh7 Kc7 12. d4 — bilan matériel au bout : +9
- Réfutation de mon coup : 10… Qxh4 11. Ne2 Nd7 12. d4 exd3 — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 10… Qxh4 11. Be2 Na6 12. g3 Qf6
- Ce que je pensais : (non renseigné)

### 5. Partie n°3, coup 9. Bc4?? — gaffe (−68 pts)

- Ma couleur : Blancs · phase : ouverture · motif : **Menace ignorée** (aussi : Pièce laissée en prise)
- Dernier coup adverse : 8… c6
- FEN avant mon coup : `rnbqkb2/pp6/2p3p1/1B3p2/4p2Q/8/PPPP1PPP/RNB1K1NR w KQq - 0 9`

```
  +-----------------+
8 | r n b q k b . . |
7 | p p . . . . . . |
6 | . . p . . . p . |
5 | . B . . . p . . |
4 | . . . . p . . Q |
3 | . . . . . . . . |
2 | P P P P . P P P |
1 | R N B . K . N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **9. Bc4** → win% 96 → 29
- Meilleur coup : **Qxd8+** — suite : 9. Qxd8+ Kxd8 10. Be2 Ke8 11. Nc3 — bilan matériel au bout : +9
- Réfutation de mon coup : 9… Qxh4 10. d4 b5 11. Bb3 Bh6 — bilan matériel au bout : 0
- Menace avant mon coup (si l’adversaire rejouait) : 9… Qxh4 10. Be2 Be6 11. g3 Qf6
- Ce que je pensais : (non renseigné)

### 6. Partie n°1, coup 5. Qh5?? — gaffe (−45 pts)

- Ma couleur : Blancs · phase : ouverture · motif : **Pièce laissée en prise**
- Dernier coup adverse : 4… Nf6
- FEN avant mon coup : `r1bqkb1r/ppp1pppp/2n2n2/8/2B1P3/8/PPPP2PP/RNBQK1NR w KQkq - 3 5`

```
  +-----------------+
8 | r . b q k b . r |
7 | p p p . p p p p |
6 | . . n . . n . . |
5 | . . . . . . . . |
4 | . . B . P . . . |
3 | . . . . . . . . |
2 | P P P P . . P P |
1 | R N B Q K . N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **5. Qh5** → win% 50 → 4
- Meilleur coup : **d3** — suite : 5. d3 Ne5 6. Bb3 Bg4 7. Qd2 — bilan matériel au bout : 0
- Réfutation de mon coup : 5… Nxh5 6. Bb5 Nf4 7. Bxc6+ bxc6 — bilan matériel au bout : -9
- Ce que je pensais : « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »

### 7. Partie n°1, coup 6. Qh3?? — gaffe (−38 pts)

- Ma couleur : Blancs · phase : ouverture · motif : **Pièce laissée en prise**
- Dernier coup adverse : 5… g6
- FEN avant mon coup : `r1bqkb1r/ppp1pp1p/2n2np1/7Q/2B1P3/8/PPPP2PP/RNB1K1NR w KQkq - 0 6`

```
  +-----------------+
8 | r . b q k b . r |
7 | p p p . p p . p |
6 | . . n . . n p . |
5 | . . . . . . . Q |
4 | . . B . P . . . |
3 | . . . . . . . . |
2 | P P P P . . P P |
1 | R N B . K . N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **6. Qh3** → win% 45 → 7
- Meilleur coup : **Qh4** — suite : 6. Qh4 Bg7 7. Nf3 Bg4 8. Bb5 — bilan matériel au bout : 0
- Réfutation de mon coup : 6… Bxh3 7. Nxh3 Bh6 8. Nc3 Na5 — bilan matériel au bout : -6
- Menace avant mon coup (si l’adversaire rejouait) : 6… gxh5 7. d4 Rg8 8. Nf3 Na5
- Ce que je pensais : (non renseigné)

### 8. Partie n°3, coup 39. Bg8?? — gaffe (−33 pts)

- Ma couleur : Blancs · phase : finale · motif : **Autre**
- Dernier coup adverse : 38… Ke7
- FEN avant mon coup : `7R/4k3/K5p1/8/PqB1pp2/8/5PPP/8 w - - 4 39`

```
  +-----------------+
8 | . . . . . . . R |
7 | . . . . k . . . |
6 | K . . . . . p . |
5 | . . . . . . . . |
4 | P q B . p p . . |
3 | . . . . . . . . |
2 | . . . . . P P P |
1 | . . . . . . . . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **39. Bg8** → win% 40 → 7
- Meilleur coup : **Bb5** — suite : 39. Bb5 Kf7 40. Rc8 Qd4 41. Rc4 — bilan matériel au bout : 0
- Réfutation de mon coup : 39… Qxa4+ 40. Kb7 Qb4+ 41. Ka6 Qa3+ — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 39… Qxc4+ 40. Kb6 Qd4+ 41. Kc6 Qxh8
- Ce que je pensais : (non renseigné)

### 9. Partie n°3, coup 36. Rxb1?? — gaffe (−31 pts)

- Ma couleur : Blancs · phase : finale · motif : **Pièce laissée en prise**
- Dernier coup adverse : 35… f4
- FEN avant mon coup : `4k3/8/K5p1/8/P1B1pp2/R7/1R3PPP/1b2q3 w - - 0 36`

```
  +-----------------+
8 | . . . . k . . . |
7 | . . . . . . . . |
6 | K . . . . . p . |
5 | . . . . . . . . |
4 | P . B . p p . . |
3 | R . . . . . . . |
2 | . R . . . P P P |
1 | . b . . q . . . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **36. Rxb1** → win% 65 → 34
- Meilleur coup : **Bb5+** — suite : 36. Bb5+ Kd8 37. Rab3 Bd3 38. Bxd3 — bilan matériel au bout : +5
- Réfutation de mon coup : 36… Qxb1 37. Ra2 Ke7 38. Re2 Kd6 — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 10. Partie n°3, coup 33. Kb4? — erreur (−26 pts)

- Ma couleur : Blancs · phase : finale · motif : **Pièce laissée en prise**
- Dernier coup adverse : 32… Qc1+
- FEN avant mon coup : `4k3/p7/6p1/5p2/P1B1p3/R1K5/1R3PPP/1bq5 w - - 5 33`

```
  +-----------------+
8 | . . . . k . . . |
7 | p . . . . . . . |
6 | . . . . . . p . |
5 | . . . . . p . . |
4 | P . B . p . . . |
3 | R . K . . . . . |
2 | . R . . . P P P |
1 | . b q . . . . . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **33. Kb4** → win% 32 → 6
- Meilleur coup : **Kb3** — suite : 33. Kb3 f4 34. Ra1 Bc2+ 35. Ka2 — bilan matériel au bout : +1
- Réfutation de mon coup : 33… Qxb2+ 34. Rb3 Qxf2 35. Rxb1 Ke7 — bilan matériel au bout : -2
- Ce que je pensais : (non renseigné)

## 3. Parties perdues (3)

### Partie n°1

```pgn
[Event "Sparring Échecs — partie n°1"]
[Date "2026.11.15"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... d5 2. f3?! {win% 56→43, meilleur : exd5} 2... dxe4 3. fxe4 {win% 48} 3... Nc6 4. Bc4 {win% 48} 4... Nf6 5. Qh5?? {win% 50→4, meilleur : d3. Je pensais : Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait.} 5... g6 6. Qh3?? {win% 45→7, meilleur : Qh4} 6... Bxh3 7. gxh3 {win% 4} 7... Nxe4 8. d3 {win% 4} 8... Nc5 9. Nf3 {win% 6} 9... e6 10. Ne5 {win% 2} 10... Nxe5 11. Rf1 {win% 2} 11... Qh4+ 12. Rf2 {win% 2} 12... Nxc4 13. Bf4 {win% 2} 13... Nxb2 14. Bxc7 {win% 2} 14... Ncxd3+ 15. Kd2 {win% 2} 15... Qxf2+ 16. Kc3 {win% 2} 16... Bg7+ 17. Kb3 {win% 2} 17... Nc5+ 18. Ka3 {win% 2} 18... Qxc2 19. h4 {win% 2} 19... Qa4# 0-1
```

### Partie n°2

```pgn
[Event "Sparring Échecs — partie n°2"]
[Date "2026.11.15"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. d4 d5 {win% 48} 2. Nc3 Nf6 {win% 50} 3. Nf3 Nc6 {win% 48} 4. Ne5 Nxe5 {win% 47} 5. dxe5 Nh5? {win% 47→26, meilleur : d4. Je pensais : Je pensais que ma pièce était protégée.} 6. Nxd5 e6?! {win% 37→26, meilleur : c6} 7. Nc3 Nf4?! {win% 25→7, meilleur : Qxd1+} 8. e3 Ng6 {win% 31} 9. Bb5+ Ke7?! {win% 47→28, meilleur : c6} 10. Qxd8+ Kxd8 {win% 29} 11. O-O Nxe5 {win% 45} 12. Ne4 c6 {win% 48} 13. Rd1+ Kc7 {win% 50} 14. Ba4 b5 {win% 51} 15. Bb3 f5?! {win% 51→35, meilleur : h6} 16. Ng5 h6 {win% 32} 17. Nxe6+ Kb6?! {win% 33→17, meilleur : Bxe6} 18. Nxf8 Rxf8 {win% 21} 19. a4 bxa4 {win% 16} 20. Rxa4 Kb5 {win% 11} 21. c4+ Kc5 {win% 11} 22. Ra5+ Kb4 {win% 14} 23. Rxe5 Kxb3 {win% 37} 24. Rd3+ Kxc4?! {win% 37→18, meilleur : Kc2} 25. Rd4+ Kb3 {win% 35} 26. Rd3+ Kc2 {win% 43} 27. Rc3+ Kd1?! {win% 43→23, meilleur : Kb1} 28. e4 Ba6 {win% 17} 29. exf5 Rfd8?! {win% 19→8, meilleur : Rae8} 30. g3 Rd4 {win% 15} 31. Bf4 Rb4?! {win% 13→2, meilleur : Rc4} 32. Rc1# 1-0
```

### Partie n°3

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.15"]
[White "Moi (831)"]
[Black "Maia-3 (881)"]
[Result "0-1"]
[Termination "Abandon"]

1. e4 {win% 53} 1... e5 2. Qh5 {win% 47} 2... g6 3. Qxe5+ {win% 89} 3... Be7 4. Qxh8 {win% 93} 4... d5 5. Qxg8+ {win% 94} 5... Bf8 6. Qxh7 {win% 92} 6... dxe4 7. Qh4?? {win% 94→17, meilleur : Bc4. Je pensais : Je cherchais à échanger les dames pour simplifier.} 7... f5 8. Bb5+ {win% 95} 8... c6 9. Bc4?? {win% 96→29, meilleur : Qxd8+} 9... b5 10. Bg8?? {win% 96→19, meilleur : Bf7+} 10... Nd7 11. Qh6?? {win% 98→15, meilleur : Bf7+} 11... Bxh6 12. Ne2 {win% 17} 12... Ba6 13. Nd4 {win% 10} 13... b4 14. Nxc6 {win% 11} 14... Qc8 15. Ne5?! {win% 23→3, meilleur : Nxb4} 15... Nxe5 16. c3 {win% 2} 16... Nd3+ 17. Kd1 {win% 2} 17... Nxc1 18. Kxc1 {win% 2} 18... bxc3 19. bxc3 {win% 2} 19... Qd7 20. a4 {win% 3} 20... Rd8 21. Ra3 {win% 4} 21... Bxd2+ 22. Nxd2 {win% 2} 22... Qxd2+ 23. Kb1 {win% 2} 23... Bd3+ 24. Ka1 {win% 3} 24... Qxc3+ 25. Ka2?? {win% 88→2, meilleur : Rxc3} 25... Qc2+ 26. Ka1 {win% 2} 26... Rd4 27. Rb1 {win% 2} 27... Rc4 28. Rb2 {win% 5} 28... Qc1+ 29. Ka2 {win% 5} 29... Bc2 30. Bxc4 {win% 32} 30... Bb1+ 31. Kb3 {win% 26} 31... Qd1+ 32. Kc3 {win% 31} 32... Qc1+ 33. Kb4? {win% 32→6, meilleur : Kb3} 33... Qe1+ 34. Kb5 {win% 19} 34... a6+ 35. Kxa6 {win% 44} 35... f4 36. Rxb1?? {win% 65→34, meilleur : Bb5+} 36... Qxb1 37. Rh3 {win% 25} 37... Qb4 38. Rh8+ {win% 36} 38... Ke7 39. Bg8?? {win% 40→7, meilleur : Bb5} 39... Qxa4+ 40. Kb7 {win% 3} 40... Qb4+ 41. Kc6 {win% 3} 41... e3 42. fxe3 {win% 3} 42... fxe3 43. Rh7+ {win% 10} 43... Kf8 44. Bd5 {win% 12} 44... e2 45. Rh8+ {win% 5} 45... Kg7 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `r1bqkb1r/ppp1pppp/2n2n2/8/2B1P3/8/PPPP2PP/RNBQK1NR w KQkq - 3 5` | Blancs | d3 | 2 / 2 | erreur (j’avais joué Qh5) |
