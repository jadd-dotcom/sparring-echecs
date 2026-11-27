# Rapport d’entraînement aux échecs — pour Claude

Généré par l’appli Sparring Échecs le 27/11/2026 16:22. Période : toutes les parties (premier rapport) — 5 parties.

**Demande :** je suis débutant. À partir de ces données (calculées automatiquement, pas devinées), diagnostique mes lacunes principales, explique-les simplement et propose-moi 3 axes de travail concrets.

## Objectif en cours (« Mon objectif » : une règle à la fois)

**Ne rien donner** — règle : « Avant de lâcher la pièce : après mon coup, quels sont SES échecs, SES prises, SES attaques ? »

- Début : 27/11/2026 ; 3 parties mesurées depuis (analysées, 10 coups au moins).
- **1/10** parties propres sur les 3 dernières : ✓ ✗ ✗ (maîtrisé à 7/10, 10 parties au moins).
- Point de départ : 1/2 parties propres sur les 2 d’avant le début.
- À surveiller (gaffes des autres motifs sur les 10 dernières parties) : Gain raté ×1, sorties du répertoire par moi ×3.

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
| n°3 | 27/11/2026 | Maia | Blancs | Maia-3 (950) | Défaite (0-1) | Échec et mat | **sorti au coup 2.** (e4 au lieu de Bf4) | 866 |
| n°4 | 27/11/2026 | Maia | Noirs | Maia-3 (916) | Défaite (1-0) | Échec et mat | **sorti au coup 2…** (Nc6 au lieu de Nf6) | 831 |
| n°5 | 27/11/2026 | Maia | Blancs | Maia-3 (881) | Défaite (0-1) | Échec et mat | hors répertoire dès le 1er coup (e4 au lieu de c4) | 797 |

### Résultats

Victoires / nulles / défaites : **1 / 0 / 4**.

### Par source

| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |
|---|---|---|---|---|---|
| Maia | 3 | 0 / 0 / 3 | 70,3 % | 1 | 0,7 |
| Chess.com | 2 | 1 / 0 / 1 | 72,5 % | 0 | 1 |

### Par ouverture

| Ouverture | Parties | V / N / D | Resté dans mon répertoire jusqu’au coup 8 | Sorti moi-même avant | Adversaire sorti avant |
|---|---|---|---|---|---|
| Anglaise (système fermé) | 1 | 0 / 0 / 1 | 0 | 0 | 1 |
| Système …c5 / …g6 (Dragon accéléré) | 1 | 1 / 0 / 0 | 0 | 0 | 1 |
| Système de Londres | 1 | 0 / 0 / 1 | 0 | 1 | 0 |
| Londres en défense | 1 | 0 / 0 / 1 | 0 | 1 | 0 |
| Hors répertoire (Blancs) | 1 | 0 / 0 / 1 | 0 | 1 | 0 |

**Resté dans mon répertoire jusqu’au coup 8 : 0 / 5 parties (0 %)** — sorti moi-même avant : 3 (60 %) ; l’adversaire en est sorti avant : 2 (40 %).

- Contre Maia : 0 / 3 (0 %) · sur Chess.com : 0 / 2 (0 %).

#### Coups par lesquels l’adversaire sort de mon répertoire (vus au moins 2 fois)

Aucun coup vu 2 fois sur la période.

### Imprécisions, erreurs, gaffes par partie

| Partie | Mes coups | Précision | Imprécisions | Erreurs | Gaffes |
|---|---|---|---|---|---|
| n°1 | 25 | 73 % | 1 | 0 | 1 |
| n°2 | 20 | 71,9 % | 3 | 0 | 1 |
| n°3 | 31 | 82 % | 4 | 1 | 0 |
| n°4 | 33 | 62,5 % | 0 | 2 | 1 |
| n°5 | 21 | 66,3 % | 4 | 0 | 1 |
| **Moyenne par partie** | 26 | 71,2 % | 2,4 | 0,6 | 0,8 |

### Par phase

| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |
|---|---|---|---|---|---|
| Ouverture | 50 | 10 | 1 | 3 | 0,8 |
| Milieu | 80 | 2 | 2 | 1 | 0,4 |
| Finale | 0 | 0 | 0 | 0 | – |

### Motifs des erreurs et gaffes

Sur 7 erreurs et gaffes :

| Motif | Nombre |
|---|---|
| Mat raté | 0 |
| Mat ouvert | 0 |
| Menace ignorée | 2 |
| Pièce laissée en prise | 2 |
| Gain raté | 1 |
| Erreur de position (pas de perte de matériel tout de suite) | 2 |

### Ce que je pensais (réponse en un toucher), par motif

Réponses données sur 3 de mes 7 erreurs et gaffes (dans la revue, avant de voir le meilleur coup).

| Motif | Menace pas vue | Mal calculé | Autre cible | Trop vite | Ne sait pas | Sans réponse |
|---|---|---|---|---|---|---|
| Mat raté | 0 | 0 | 0 | 0 | 0 | 0 |
| Mat ouvert | 0 | 0 | 0 | 0 | 0 | 0 |
| Menace ignorée | 0 | 0 | 1 | 0 | 0 | 1 |
| Pièce laissée en prise | 1 | 1 | 0 | 0 | 0 | 0 |
| Gain raté | 0 | 0 | 0 | 0 | 0 | 1 |
| Erreur de position (pas de perte de matériel tout de suite) | 0 | 0 | 0 | 0 | 0 | 2 |
| **Total** | **1** | **1** | **1** | **0** | **0** | **4** |

Réponses : Menace pas vue = « Je n’ai pas vu la menace » ; Mal calculé = « J’ai vu, mais mal calculé » ; Autre cible = « Je voulais attaquer autre chose » ; Trop vite = « J’ai joué trop vite » ; Ne sait pas = « Je ne sais pas ».

### Révision (paquet de positions)

Cartes vues : **2** (3 tentatives) ; réussite : **33 %**.
- Positions issues de mes erreurs : 3 tentatives, réussite 33 %.
- Lis la menace : 0 tentatives, réussite – (détail en section 7).
- Drill d’ouvertures : 0 tentatives, réussite –.

## 2. Mes coups les plus coûteux (7, tri par chute de win%)

### 1. Partie n°4, coup 13… Bc5+?? — gaffe (−67 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Pièce laissée en prise**
- Dernier coup adverse : 13. O-O
- FEN avant mon coup : `2kr1bnr/ppp2ppp/4p3/5b2/4NP2/3B4/q1P1N1PP/1R1Q1RK1 b - - 1 13`

```
  +-----------------+
1 | . K R . Q . R . |
2 | P P . N . P . q |
3 | . . . . B . . . |
4 | . . P N . . . . |
5 | . . b . . . . . |
6 | . . . p . . . . |
7 | p p p . . p p p |
8 | r n b . r k . . |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **13… Bc5+** → win% 87 → 19
- Meilleur coup : **Bxe4** — suite : 13… Bxe4 14. Bxe4 Bc5+ 15. Kh1 Rxd1 — bilan matériel au bout : +12
- Réfutation de mon coup : 14. Nxc5 Bxd3 15. cxd3 b6 16. Nc3 — bilan matériel au bout : 0
- Ce que je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »

### 2. Partie n°2, coup 8… a6?? — gaffe (−43 pts)

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
- Réfutation de mon coup : 9. Bxc6+ bxc6 10. Qxd4 a5 11. O-O — bilan matériel au bout : 0
- Ce que je pensais : (non renseigné)

### 3. Partie n°1, coup 8. d4?? — gaffe (−40 pts)

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

- Mon coup : **8. d4** → win% 51 → 11
- Meilleur coup : **cxd5** — suite : 8. cxd5 cxd5 9. e5 Nfd7 10. d4 — bilan matériel au bout : 0
- Réfutation de mon coup : 8… dxe4 9. Nxe4 Nxe4 10. Re1 Nd6 — bilan matériel au bout : -3
- Menace avant mon coup (si l’adversaire rejouait) : 8… dxe4 9. Re1 exf3 10. Bxf3 Bxf3
- Ce que je pensais : (non renseigné)

### 4. Partie n°5, coup 7. Nc3?? — gaffe (−38 pts)

- Source : Maia · adversaire : Maia-3 (881)
- Ma couleur : Blancs · phase : ouverture · motif : **Menace ignorée** (aussi : Pièce laissée en prise)
- Dernier coup adverse : 6… d5
- FEN avant mon coup : `rnbq1rk1/pp3ppp/2p1pn2/2bp4/2B1P3/5N2/PPPPQPPP/RNB2RK1 w - - 0 7`

```
  +-----------------+
8 | r n b q . r k . |
7 | p p . . . p p p |
6 | . . p . p n . . |
5 | . . b p . . . . |
4 | . . B . P . . . |
3 | . . . . . N . . |
2 | P P P P Q P P P |
1 | R N B . . R K . |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **7. Nc3** → win% 50 → 12
- Meilleur coup : **d4** — suite : 7. d4 Be7 8. Bd3 dxe4 9. Bxe4 — bilan matériel au bout : 0
- Réfutation de mon coup : 7… dxc4 8. Qxc4 Be7 9. Rd1 b5 — bilan matériel au bout : -2
- Menace avant mon coup (si l’adversaire rejouait) : 7… dxc4 8. Qxc4 Bb6 9. e5 Nd5
- Ce que je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »

### 5. Partie n°4, coup 22… Qb5? — erreur (−28 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Erreur de position (pas de perte de matériel tout de suite)**
- Dernier coup adverse : 22. Nbd2
- FEN avant mon coup : `Rnkr3r/2p2ppp/1p2p3/8/4NP2/3P4/1q1N2PP/3Q1RK1 b - - 4 22`

```
  +-----------------+
1 | . K R . Q . . . |
2 | P P . . N . q . |
3 | . . . . P . . . |
4 | . . P N . . . . |
5 | . . . . . . . . |
6 | . . . p . . p . |
7 | p p p . . p . . |
8 | r . . . r k n R |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **22… Qb5** → win% 44 → 16
- Meilleur coup : **Rxd3** — suite : 22… Rxd3 23. Kh1 Rd4 24. Qe2 f5 — bilan matériel au bout : 0
- Réfutation de mon coup : 23. Nc4 Kb7 24. Ra2 Nc6 25. Rb2 — bilan matériel au bout : -1
- Ce que je pensais : (non renseigné)

### 6. Partie n°4, coup 18… Qa2? — erreur (−21 pts)

- Source : Maia · adversaire : Maia-3 (916)
- Ma couleur : Noirs · phase : milieu · motif : **Erreur de position (pas de perte de matériel tout de suite)**
- Dernier coup adverse : 18. Nb3
- FEN avant mon coup : `2kr3r/p1p1nppp/1p2p3/8/4NP2/qN1P4/6PP/1R1Q1RK1 b - - 5 18`

```
  +-----------------+
1 | . K R . Q . R . |
2 | P P . . . . . . |
3 | . . . . P . N q |
4 | . . P N . . . . |
5 | . . . . . . . . |
6 | . . . p . . p . |
7 | p p p n . p . p |
8 | r . . . r k . . |
  +-----------------+
    h g f e d c b a
```

- Mon coup : **18… Qa2** → win% 29 → 8
- Meilleur coup : **Qa6** — suite : 18… Qa6 19. d4 Qb5 20. Qf3 Qd5 — bilan matériel au bout : 0
- Réfutation de mon coup : 19. Ra1 Qb2 20. Rf2 Qxf2+ 21. Nxf2 — bilan matériel au bout : -4
- Ce que je pensais : (non renseigné)

### 7. Partie n°3, coup 7. Qxg4? — erreur (−21 pts)

- Source : Maia · adversaire : Maia-3 (950)
- Ma couleur : Blancs · phase : ouverture · motif : **Pièce laissée en prise**
- Dernier coup adverse : 6… Bg4
- FEN avant mon coup : `r2qkb1r/ppp1pppp/2n2n2/8/3P1Pb1/2P5/PP5P/RNBQKBNR w KQkq - 1 7`

```
  +-----------------+
8 | r . . q k b . r |
7 | p p p . p p p p |
6 | . . n . . n . . |
5 | . . . . . . . . |
4 | . . . P . P b . |
3 | . . P . . . . . |
2 | P P . . . . . P |
1 | R N B Q K B N R |
  +-----------------+
    a b c d e f g h
```

- Mon coup : **7. Qxg4** → win% 27 → 6
- Meilleur coup : **Be2** — suite : 7. Be2 Bf5 8. Nf3 e6 9. Nbd2 — bilan matériel au bout : -1
- Réfutation de mon coup : 7… Nxg4 8. h4 f6 9. h5 e6 — bilan matériel au bout : -7
- Menace avant mon coup (si l’adversaire rejouait) : 7… Bxd1 8. Kxd1 Qd5 9. Be3 Qxh1
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

1. e4 {win% 53} 1... e6 2. Nf3 {win% 52} 2... Nf6 3. Bb5?! {win% 61→42, meilleur : e5} 3... Bc5 4. O-O?! {win% 60→45, meilleur : d4} 4... c6 5. Bc4?! {win% 59→43, meilleur : d4} 5... O-O 6. Qe2?! {win% 61→48, meilleur : e5} 6... d5 7. Nc3?? {win% 50→12, meilleur : d4. Je pensais : Je voulais attaquer autre chose — « Je cherchais à échanger les dames pour simplifier. »} 7... dxc4 8. Ne5 {win% 10} 8... b5 9. b4 {win% 8} 9... Bxb4 10. a3 {win% 8} 10... Bxc3 11. dxc3 {win% 11} 11... Bb7 12. Bg5 {win% 28} 12... Nbd7 13. Rad1 {win% 14} 13... Qc7 14. Nxd7 {win% 13} 14... Nxd7 15. e5 {win% 11} 15... Nxe5 16. Qxe5 {win% 4} 16... Qxe5 17. Rfe1 {win% 2} 17... Qxg5 18. Rd4 {win% 2} 18... Rad8 19. Red1 {win% 2} 19... Rxd4 20. Rxd4 {win% 2} 20... Qc1+ 21. Rd1 {win% 2} 21... Qxd1# 0-1
```

### Partie n°4 — défaite, Maia contre Maia-3 (916) · répertoire : sorti au coup 2… (Nc6 au lieu de Nf6)

```pgn
[Event "Sparring Échecs — partie n°4"]
[Date "2026.11.27"]
[White "Maia-3 (916)"]
[Black "Moi (866)"]
[Result "1-0"]
[Termination "Échec et mat"]

1. d4 d5 {win% 48} 2. Nc3 Nc6 {win% 47} 3. e4 dxe4 {win% 48} 4. Nxe4 Nxd4 {win% 51} 5. Bc4 Bf5 {win% 61} 6. Bd3 Qd5 {win% 66} 7. f3 O-O-O {win% 68} 8. Be3 e6 {win% 66} 9. Bxd4 Qxd4 {win% 85} 10. Ne2 Qe5 {win% 82} 11. f4 Qxb2 {win% 85} 12. Rb1 Qxa2 {win% 83} 13. O-O Bc5+?? {win% 87→19, meilleur : Bxe4. Je pensais : J’ai vu, mais mal calculé — « Je pensais que ma pièce était protégée. »} 14. Nxc5 Bxd3 {win% 18} 15. cxd3 b6 {win% 18} 16. Ne4 Qa3 {win% 14} 17. Nc1 Ne7 {win% 27} 18. Nb3 Qa2? {win% 29→8, meilleur : Qa6} 19. Ra1 Qb2 {win% 7} 20. Rxa7 Nc6 {win% 12} 21. Ra8+ Nb8 {win% 7} 22. Nbd2 Qb5? {win% 44→16, meilleur : Rxd3} 23. Nc4 f5 {win% 12} 24. Ng5 Rhe8 {win% 7} 25. Nxh7 Rh8 {win% 10} 26. Ng5 Qe8 {win% 5} 27. Re1 Qh5 {win% 5} 28. Qxh5 g6 {win% 2} 29. Qxg6 Rxd3 {win% 2} 30. Qg7 Rh5 {win% 2} 31. Rxe6 Rxg5 {win% 2} 32. Qxg5 Rc3 {win% 2} 33. Qg8+ Kb7 {win% 2} 34. Qxb8# 1-0
```

### Partie n°3 — défaite, Maia contre Maia-3 (950) · répertoire : sorti au coup 2. (e4 au lieu de Bf4)

```pgn
[Event "Sparring Échecs — partie n°3"]
[Date "2026.11.27"]
[White "Moi (900)"]
[Black "Maia-3 (950)"]
[Result "0-1"]
[Termination "Échec et mat"]

1. d4 {win% 52} 1... d5 2. e4 {win% 45} 2... Nf6 3. f3?! {win% 58→46, meilleur : e5} 3... dxe4 4. c3 {win% 40} 4... exf3 5. gxf3?! {win% 42→28, meilleur : Nxf3} 5... Nc6 6. f4 {win% 28} 6... Bg4 7. Qxg4? {win% 27→6, meilleur : Be2. Je pensais : Je n’ai pas vu la menace — « Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait. »} 7... Nxg4 8. Nf3 {win% 8} 8... Ne3 9. Bxe3 {win% 13} 9... e5 10. fxe5 {win% 21} 10... Be7 11. Bb5?! {win% 28→15, meilleur : Nbd2} 11... Bh4+ 12. Nxh4?! {win% 24→11, meilleur : Ke2} 12... Qxh4+ 13. Bf2 {win% 4} 13... Qe4+ 14. Be3 {win% 4} 14... Qxh1+ 15. Bg1 {win% 2} 15... Qxg1+ 16. Ke2 {win% 2} 16... Qxh2+ 17. Ke3 {win% 2} 17... O-O-O 18. d5 {win% 2} 18... Nxe5 19. c4 {win% 2} 19... Rhe8 20. Bxe8 {win% 2} 20... Rxe8 21. Nc3 {win% 2} 21... Nxc4+ 22. Kd4 {win% 2} 22... Nxb2 23. Re1 {win% 2} 23... Rxe1 24. Ne2 {win% 2} 24... Rxe2 25. d6 {win% 2} 25... Qxd6+ 26. Kc3 {win% 2} 26... Na4+ 27. Kb3 {win% 2} 27... Re4 28. Kc2 {win% 2} 28... Qb4 29. Kc1 {win% 2} 29... Re2 30. Kd1 {win% 2} 30... Qb2 31. a3 {win% 2} 31... Nc3# 0-1
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

1. c4 {win% 51} 1... g6 2. Nc3 {win% 53} 2... Bg7 3. g3 {win% 52} 3... Nf6 4. Bg2 {win% 52} 4... O-O 5. e4 {win% 49} 5... c6 6. Nf3 {win% 54} 6... d5 7. O-O?! {win% 53→35, meilleur : cxd5} 7... Bg4 8. d4?? {win% 51→11, meilleur : cxd5} 8... dxe4 9. Ne5 {win% 8} 9... Bxd1 10. Nxd1 {win% 6} 10... Qxd4 11. Bf4 {win% 5} 11... g5 12. Bxg5 {win% 4} 12... Qxe5 13. Bh4 {win% 3} 13... Nbd7 14. f4 {win% 3} 14... exf3 15. Bxf3 {win% 3} 15... Qd4+ 16. Ne3 {win% 2} 16... Qxe3+ 17. Kg2 {win% 2} 17... Ne4 18. Rae1 {win% 2} 18... Qd2+ 19. Rf2 {win% 2} 19... Qxe1 20. Bxe4 {win% 2} 20... Bd4 21. Bxe7 {win% 2} 21... Qxf2+ 22. Kh3 {win% 2} 22... Rfe8 23. Bf6 {win% 2} 23... Rxe4 24. Bxd4 {win% 2} 24... Rxd4 25. g4 {win% 2} 25... Rd3# 0-1
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

1. e4 c5 {win% 46} 2. Nf3 Nc6 {win% 46} 3. Nc3 g6 {win% 48} 4. e5 Bg7 {win% 60} 5. d4 cxd4 {win% 59} 6. Nd5 e6?! {win% 88→77, meilleur : Qa5+} 7. Nf4 d5?! {win% 78→65, meilleur : d6} 8. Bb5 a6?? {win% 88→45, meilleur : Qa5+} 9. Bxc6+ bxc6 {win% 45} 10. O-O h5?! {win% 53→42, meilleur : c5} 11. Nxd4 Bb7 {win% 42} 12. b4 Bxe5 {win% 55} 13. Nde2 g5 {win% 76} 14. Nd3 Bxa1 {win% 76} 15. Bxg5 Qxg5 {win% 86} 16. Qxa1 Nf6 {win% 81} 17. Nc5 O-O {win% 78} 18. Nxb7 Kh7 {win% 76} 19. Nd4 Rg8 {win% 74} 20. Nxc6 Qxg2# {win% 98} 0-1
```

## 4. Positions du paquet ratées au moins 2 fois

| FEN | Trait | Bon coup | Échecs / tentatives | Origine |
|---|---|---|---|---|
| `r2qkb1r/ppp1pppp/2n2n2/8/3P1Pb1/2P5/PP5P/RNBQKBNR w KQkq - 1 7` | Blancs | Be2 | 2 / 2 | erreur (j’avais joué Qxg4) |

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
