# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 27/11/2026 12:20. Période : toutes les parties (premier rapport) — 5 parties.

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
| n°3 | 27/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 866 |
| n°4 | 27/11/2026 | Maia | Noirs | Maia-3 (916) | Défaite (1-0) | Échec et mat | **sorti au coup 2…** (d6 au lieu de Nc6) | 831 |
| n°5 | 27/11/2026 | Maia | Blancs | Maia-3 (881) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 797 |

### Résultats

Victoires / nulles / défaites : **1 / 0 / 4**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 0 / 0 / 3 | 74,2 % | 1,3 | 1,3 |
| Chess.com | 2 | 1 / 0 / 1 | 72 % | 0 | 1 |

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
| n°1 | 25 | 72,4 % | 1 | 0 | 1 |
| n°2 | 20 | 71,7 % | 2 | 0 | 1 |
| n°3 | 35 | 79,4 % | 1 | 1 | 1 |
| n°4 | 31 | 76,3 % | 3 | 1 | 1 |
| n°5 | 31 | 67 % | 2 | 2 | 2 |
| **Moyenne par partie** | 28,4 | 73,3 % | 1,8 | 0,8 | 1,2 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 50 | 5 | 1 | 5 | 1,2 |
| Milieu | 76 | 3 | 2 | 1 | 0,4 |
| Finale | 16 | 1 | 1 | 0 | 0,6 |

### Motifs des erreurs et gaffes

Sur 10 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 0 |
| Menace ignorée | 1 |
| Pièce laissée en prise | 3 |
| Gain raté | 2 |
| Autre | 4 |

### Ce que je pensais (réponse en un toucher), par motif

Réponses données sur 3 de mes 10 erreurs et gaffes (dans la revue, avant de voir le meilleur coup).

| Motif | Menace pas vue | Mal calculé | Autre cible | Trop vite | Ne sait pas | Sans réponse |
|---|---|---|---|---|---|---|
| Mat raté | 0 | 0 | 0 | 0 | 0 | 0 |
| Mat ouvert | 0 | 0 | 0 | 0 | 0 | 0 |
| Menace ignorée | 0 | 0 | 1 | 0 | 0 | 0 |
| Pièce laissée en prise | 0 | 0 | 0 | 0 | 0 | 3 |
| Gain raté | 0 | 1 | 0 | 0 | 0 | 1 |
| Autre | 1 | 0 | 0 | 0 | 0 | 3 |
| **Total** | **1** | **1** | **1** | **0** | **0** | **7** |

Réponses : Menace pas vue = « Je n’ai pas vu la menace » ; Mal calculé = « J’ai vu, mais mal calculé » ; Autre cible = « Je voulais attaquer autre chose » ; Trop vite = « J’ai joué trop vite » ; Ne sait pas = « Je ne sais pas ».

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Lis la menace : 0 tentatives, réussite – (détail en section 7).
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (10, tri par chute de win%)

### 1. Partie n°5, coup 5. d4?? — gaffe (−42 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : ouverture · motif : **Menace ignorée** (aussi : Pièce laissée en prise)
- Dernier coup adverse : 4… d5
- FEN avant mon coup : `r1bqkb1r/ppp2ppp/2n2n2/3pp3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5`

```
  +-----------------+
8 | r . b q k b . r |
7 | p p p . . p p p |
6 | . . n . . n . . |
5 | . . . p p . . . |
4 | . . B . P . . . |
3 | . . N . . N . . |
2 | P P P P . P P P |
1 | R . B Q K . . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **5. d4** → win% 60 → 17
- Meilleur coup : **exd5** — suite : 5. exd5 Nd4 6. h3 Bd6 7. d3 — bilan matériel au bout : +1
- Réfutation de mon coup : 5… dxc4 6. d5 Na5 7. Nxe5 Bb4 — bilan matériel au bout : -2
- Menace avant mon coup (si l’adversaire rejouait) : 5… dxc4 6. d4 exd4 7. Nxd4 Nxd4
- Ce que je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »

### 2. Partie n°2, coup 8… a6?? — gaffe (−42 pts)

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

### 3. Partie n°1, coup 8. d4?? — gaffe (−41 pts)

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
- Réfutation de mon coup : 8… dxe4 9. Nxe4 Nxe4 10. Qb3 Nd6 — bilan matériel au bout : -3
- Ce que je pensais : (non renseigné)

### 4. Partie n°4, coup 10… O-O?? — gaffe (−39 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : ouverture · motif : **Gain raté**
- Dernier coup adverse : 10. Bg5
- FEN avant mon coup : `rn2k2r/pp1q1pbp/3p1np1/4p1B1/3NP3/8/PPP2PPP/RN1QR1K1 b kq - 1 10`

```
  +-----------------+
1 | . K . R Q . N R |
2 | P P P . . P P P |
3 | . . . . . . . . |
4 | . . . P N . . . |
5 | . B . p . . . . |
6 | . p n . p . . . |
7 | p b p . q . p p |
8 | r . . k . . n r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **10… O-O** → win% 86 → 47
- Meilleur coup : **exd4** — suite : 10… exd4 11. Nc3 Nh5 12. Nd5 — bilan matériel au bout : +3
- Réfutation de mon coup : 11. Nb3 Qc6 12. Bxf6 Bxf6 13. Nc3 — bilan matériel au bout : 0
- Ce que je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »

### 5. Partie n°3, coup 10. c4?? — gaffe (−32 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 9… Nxd5
- FEN avant mon coup : `r1bq1rk1/ppp2ppp/2n5/3n4/3P4/2P2P2/P5PP/1RBQKBNR w K - 0 10`

```
  +-----------------+
8 | r . b q . r k . |
7 | p p p . . p p p |
6 | . . n . . . . . |
5 | . . . n . . . . |
4 | . . . P . . . . |
3 | . . P . . P . . |
2 | P . . . . . P P |
1 | . R B Q K B N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **10. c4** → win% 41 → 9
- Meilleur coup : **Qd2** — suite : 10. Qd2 Bf5 11. Rb5 Re8+ 12. Kf2 — bilan matériel au bout : 0
- Réfutation de mon coup : 10… Nc3 11. Qd3 Nxb1 12. Kf2 Qxd4+ — bilan matériel au bout : -6
- Ce que je pensais : (non renseigné)

### 6. Partie n°5, coup 15. Nxg5?? — gaffe (−30 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : milieu · motif : **Pièce laissée en prise** (aussi : Gain raté)
- Dernier coup adverse : 14… Ng5
- FEN avant mon coup : `2r1k2r/ppB1bppp/8/6n1/2p1N3/4R2P/PPP2P2/R2K4 w k - 5 15`

```
  +-----------------+
8 | . . r . k . . r |
7 | p p B . b p p p |
6 | . . . . . . . . |
5 | . . . . . . n . |
4 | . . p . N . . . |
3 | . . . . R . . P |
2 | P P P . . P . . |
1 | R . . K . . . . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **15. Nxg5** → win% 61 → 31
- Meilleur coup : **Nd6+** — suite : 15. Nd6+ Kd7 16. Nxc8 Rxc8 17. Bf4 — bilan matériel au bout : +1
- Réfutation de mon coup : 15… Rxc7 16. Ke2 O-O 17. Nf3 Rd8 — bilan matériel au bout : -1
- Menace avant mon coup (si l’adversaire rejouait) : 15… Nxe4 16. Be5 f5 17. f3 Rd8+
- Ce que je pensais : (non renseigné)

### 7. Partie n°5, coup 16. Ne6? — erreur (−22 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : finale · motif : **Pièce laissée en prise**
- Dernier coup adverse : 15… Rxc7
- FEN avant mon coup : `4k2r/ppr1bppp/8/6N1/2p5/4R2P/PPP2P2/R2K4 w k - 0 16`

```
  +-----------------+
8 | . . . . k . . r |
7 | p p r . b p p p |
6 | . . . . . . . . |
5 | . . . . . . N . |
4 | . . p . . . . . |
3 | . . . . R . . P |
2 | P P P . . P . . |
1 | R . . K . . . . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **16. Ne6** → win% 33 → 11
- Meilleur coup : **Ke2** — suite : 16. Ke2 O-O 17. Nf3 Rd8 18. Rd1 — bilan matériel au bout : -1
- Réfutation de mon coup : 16… fxe6 17. Ke1 O-O 18. Rd1 Bc5 — bilan matériel au bout : -4
- Ce que je pensais : (non renseigné)

### 8. Partie n°4, coup 16… Nd4? — erreur (−22 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Autre**
- Dernier coup adverse : 16. h3
- FEN avant mon coup : `r4rk1/pp2qp2/2np2pp/4p3/4P3/5N1P/PPP2PP1/R2QR1K1 b - - 0 16`

```
  +-----------------+
1 | . K . R Q . . R |
2 | . P P . . P P P |
3 | P . N . . . . . |
4 | . . . P . . . . |
5 | . . . p . . . . |
6 | p p . . p n . . |
7 | . . p q . . p p |
8 | . k r . . . . r |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **16… Nd4** → win% 49 → 27
- Meilleur coup : **Nd8** — suite : 16… Nd8 17. Qd2 Kg7 18. Rad1 Rc8 — bilan matériel au bout : 0
- Réfutation de mon coup : 17. Nxd4 exd4 18. Qxd4 Rac8 19. c3 — bilan matériel au bout : -1
- Ce que je pensais : (non renseigné)

### 9. Partie n°5, coup 13. Re1? — erreur (−20 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : milieu · motif : **Pièce laissée en prise**
- Dernier coup adverse : 12… Be7
- FEN avant mon coup : `r3k2r/ppB1bppp/8/8/2p1N3/5n1P/PPP2P2/R2K3R w kq - 1 13`

```
  +-----------------+
8 | r . . . k . . r |
7 | p p B . b p p p |
6 | . . . . . . . . |
5 | . . . . . . . . |
4 | . . p . N . . . |
3 | . . . . . n . P |
2 | P P P . . P . . |
1 | R . . K . . . R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **13. Re1** → win% 32 → 11
- Meilleur coup : **Ke2** — suite : 13. Ke2 Nd4+ 14. Kf1 Ne6 15. Ba5 — bilan matériel au bout : -1
- Réfutation de mon coup : 13… Nxe1 14. Ke2 Ng2 15. Rg1 Nh4 — bilan matériel au bout : -6
- Ce que je pensais : (non renseigné)

### 10. Partie n°3, coup 9. exd5? — erreur (−20 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : ouverture · motif : **Autre**
- Dernier coup adverse : 8… d5
- FEN avant mon coup : `r1bq1rk1/ppp2ppp/2n2n2/3p4/3PP3/2P2P2/P5PP/1RBQKBNR w K - 0 9`

```
  +-----------------+
8 | r . b q . r k . |
7 | p p p . . p p p |
6 | . . n . . n . . |
5 | . . . p . . . . |
4 | . . . P P . . . |
3 | . . P . . P . . |
2 | P . . . . . P P |
1 | . R B Q K B N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **9. exd5** → win% 59 → 39
- Meilleur coup : **e5** — suite : 9. e5 Nh5 10. g3 g6 11. Bd3 — bilan matériel au bout : 0
- Réfutation de mon coup : 9… Nxd5 10. Qc2 Re8+ 11. Kf2 Bf5 — bilan matériel au bout : 0
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

1. e4 {win% 52} 1... e5 2. Nf3 {win% 51} 2... Nc6 3. Bc4 {win% 51} 3... Nf6 4. Nc3 {win% 49} 4... d5 5. d4?? {win% 60→17, meilleur : exd5. Je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »} 5... dxc4 6. dxe5 {win% 14} 6... Nxe4 7. Nxe4 {win% 29} 7... Qxd1+ 8. Kxd1 {win% 29} 8... Bg4 9. h3 {win% 26} 9... Bxf3+ 10. gxf3 {win% 26} 10... Nxe5 11. Bf4 {win% 24} 11... Nxf3 12. Bxc7 {win% 32} 12... Be7 13. Re1? {win% 32→11, meilleur : Ke2} 13... Rc8 14. Re3?! {win% 44→29, meilleur : Nd6+} 14... Ng5 15. Nxg5?? {win% 61→31, meilleur : Nd6+} 15... Rxc7 16. Ne6? {win% 33→11, meilleur : Ke2} 16... fxe6 17. Rxe6 {win% 10} 17... Rd7+ 18. Ke1 {win% 9} 18... Kf7 19. Re3 {win% 11} 19... Bg5 20. Rf3+ {win% 11} 20... Kg6 21. h4 {win% 10} 21... Bxh4 22. Rf4 {win% 10} 22... Bg5 23. Rg4 {win% 7} 23... Re8+ 24. Kf1 {win% 8} 24... b5 25. Re1 {win% 7} 25... Rde7 26. f4?! {win% 17→2, meilleur : Rxe7} 26... Rxe1+ 27. Kf2 {win% 2} 27... R8e2+ 28. Kf3 {win% 2} 28... Kf5 29. Rxg5+ {win% 5} 29... Kf6 30. Kg4 {win% 4} 30... Rg1+ 31. Kh5 {win% 2} 31... Rh2# 0-1
```

### Partie n°4 — défaite, Maia contre Maia-3 (916) · répertoire : sorti au coup 2… (d6 au lieu de Nc6)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.27"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. e4 c5 {win% 46} 2. Nf3 d6 {win% 45} 3. Bc4 Nf6 {win% 49} 4. O-O g6 {win% 46} 5. Re1 Bg7 {win% 50} 6. d4 cxd4 {win% 49} 7. Nxd4 e5?! {win% 50→36, meilleur : O-O} 8. Bb5+ Bd7 {win% 48} 9. Bxd7+ Qxd7 {win% 47} 10. Bg5 O-O?? {win% 86→47, meilleur : exd4. Je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »} 11. Nf3 h6 {win% 43} 12. Bxf6 Bxf6 {win% 43} 13. Nc3 Nc6 {win% 43} 14. Nd5 Be7 {win% 41} 15. Nxe7+ Qxe7 {win% 46} 16. h3 Nd4? {win% 49→27, meilleur : Nd8} 17. Nxd4 exd4 {win% 26} 18. Qxd4 f5?! {win% 27→12, meilleur : Rfc8} 19. exf5 Rxf5?! {win% 13→2, meilleur : Qf6} 20. Rxe7 Raf8 {win% 2} 21. f3 Rf4 {win% 2} 22. Qxd6 R4f6 {win% 2} 23. Qd7 R8f7 {win% 2} 24. Re8+ Kh7 {win% 2} 25. Qd5 Rf8 {win% 2} 26. Rae1 R6f7 {win% 2} 27. R8e7 Rxe7 {win% 2} 28. Rxe7+ Kh8 {win% 2} 29. Qd4+ Kg8 {win% 2} 30. Qd5+ Kh8 {win% 2} 31. Qe5+ Kg8 {win% 2} 32. Qg7# 1-0
```

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : hors répertoire dès le 1er coup (e4 au lieu de c4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.27"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. e4 {win% 53} 1... e5 2. d4 {win% 50} 2... Nc6 3. c3 {win% 49} 3... Nf6 4. f3?! {win% 54→39, meilleur : d5} 4... exd4 5. cxd4 {win% 52} 5... Bb4+ 6. Nc3 {win% 51} 6... Bxc3+ 7. bxc3 {win% 66} 7... O-O 8. Rb1 {win% 58} 8... d5 9. exd5? {win% 59→39, meilleur : e5. Je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »} 9... Nxd5 10. c4?? {win% 41→9, meilleur : Qd2} 10... Nc3 11. Qb3 {win% 6} 11... Nxb1 12. Qxb1 {win% 9} 12... Re8+ 13. Kf2 {win% 6} 13... Qxd4+ 14. Kg3 {win% 5} 14... Ne5 15. Bb2 {win% 9} 15... Qe3 16. Bc1 {win% 2} 16... Qb6 17. Qc2 {win% 8} 17... Re6 18. Qf5 {win% 2} 18... Rg6+ 19. Qxg6 {win% 2} 19... Nxg6 20. Be3 {win% 2} 20... Qxe3 21. Nh3 {win% 2} 21... Qe5+ 22. Nf4 {win% 2} 22... Qxf4+ 23. Kf2 {win% 2} 23... Qd4+ 24. Kg3 {win% 2} 24... Qf4+ 25. Kf2 {win% 2} 25... Ne5 26. Ke1 {win% 2} 26... Nd3+ 27. Bxd3 {win% 2} 27... Qe3+ 28. Kd1 {win% 2} 28... Qxd3+ 29. Ke1 {win% 2} 29... Qxc4 30. Kf2 {win% 2} 30... Qxa2+ 31. Kf1 {win% 2} 31... c5 32. Kg1 {win% 2} 32... c4 33. f4 {win% 2} 33... c3 34. f5 {win% 2} 34... c2 35. g4 {win% 2} 35... c1=Q# 0-1
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

1. c4 {win% 51} 1... g6 2. Nc3 {win% 51} 2... Bg7 3. g3 {win% 52} 3... Nf6 4. Bg2 {win% 52} 4... O-O 5. e4 {win% 51} 5... c6 6. Nf3 {win% 55} 6... d5 7. O-O?! {win% 53→36, meilleur : cxd5} 7... Bg4 8. d4?? {win% 52→11, meilleur : cxd5} 8... dxe4 9. Ne5 {win% 8} 9... Bxd1 10. Nxd1 {win% 5} 10... Qxd4 11. Bf4 {win% 5} 11... g5 12. Bxg5 {win% 4} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 2} 14... exf3 15. Bxf3 {win% 3} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
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

1. e4 c5 {win% 46} 2. Nf3 Nc6 {win% 47} 3. Nc3 g6 {win% 48} 4. e5 Bg7 {win% 62} 5. d4 cxd4 {win% 60} 6. Nd5 e6?! {win% 89→75, meilleur : Qa5+} 7. Nf4 d5?! {win% 77→63, meilleur : Nxe5} 8. Bb5 a6?? {win% 88→46, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 45} 10. O-O h5 {win% 44} 11. Nxd4 Bb7 {win% 41} 12. b4 Bxe5 {win% 56} 13. Nde2 g5 {win% 75} 14. Nd3 Bxa1 {win% 76} 15. Bxg5 Qxg5 {win% 84} 16. Qxa1 Nf6 {win% 85} 17. Nc5 O-O {win% 80} 18. Nxb7 Kh7 {win% 76} 19. Nd4 Rg8 {win% 73} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `r1bq1rk1/ppp2ppp/2n2n2/3p4/3PP3/2P2P2/P5PP/1RBQKBNR w K - 0 9` | Blancs | e5 | 2 / 2 | erreur (j’avais joué exd5) |

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
