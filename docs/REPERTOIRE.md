# Répertoire pré-chargé et vérification Stockfish

Stockfish 19 lite (single-thread), profondeur 20, en Node.
Perte d'un de mes coups = éval du meilleur coup − éval de mon coup (même position, `searchmoves`). Seuil : 50 cp (0,5 pion).

## Anglaise (système fermé) (Blancs)

Coups adverses imposés : aucun · 15 lignes · 111 coups vérifiés · 184 s

```pgn
[Event "Anglaise (système fermé)"]
[Orientation "white"]

1. c4 e5 (1... c5 2. Nc3 Nc6 (2... Nf6 3. g3 d5 4. cxd5 Nxd5 5. Bg2 Nc7 6. Nf3 Nc6 7. O-O e5 8. d3 Be7 9. Nd2 Bd7 10. Nc4 f6) 3. g3 g6 4. Bg2 Bg7 5. d3 d6 (5... Nf6 6. e4 O-O 7. Nge2 d6 8. O-O a6 9. h3 Rb8 10. a4 Ne8) 6. e4 e5 7. Nge2 Nge7 8. O-O O-O 9. Be3 Nd4 10. Qd2 Be6) (1... Nf6 2. Nc3 g6 (2... e6 3. d4 Bb4 4. e3 O-O 5. Bd3 d5 6. cxd5 exd5 7. Ne2 Re8 8. O-O Bd6 9. a3 c6 10. Qc2 Nbd7) 3. g3 Bg7 4. Bg2 O-O 5. e4 d6 6. Nge2 e5 7. O-O c6 8. d3 a6 9. h3 b5 10. Be3 Nbd7) (1... e6 2. Nc3 d5 3. cxd5 exd5 4. d4 Nf6 5. Bg5 Be7 6. e3 O-O 7. Bd3 Nbd7 8. Nge2 Re8 9. O-O Nf8 10. Qc2 c6) (1... d5 2. cxd5 Qxd5 (2... Nf6 3. Nf3 Nxd5 4. d4 g6 5. e4 Nb6 6. h3 Bg7 7. Nc3 O-O 8. Be3 Nc6 9. Qd2 f5) 3. Nc3 Qd8 (3... Qa5 4. d4 Nf6 5. Nf3 c6 6. Bd2 Qb6 7. e4 Bg4 8. Qa4 Bxf3 9. gxf3) 4. d4 Nf6 5. Nf3 g6 (5... e6 6. e4 Be7 7. Bd3 O-O 8. O-O c5 9. dxc5 Nfd7 10. Qe2 Nc6 11. Rd1) 6. e4 Bg7 7. Be2 c5 8. d5 O-O 9. O-O) 2. Nc3 Nc6 (2... Nf6 3. g3 d5 (3... Bb4 4. Bg2 O-O 5. e4 Bxc3 6. bxc3 c6 7. Ne2 d5 8. cxd5 cxd5 9. exd5 Nxd5 10. O-O Nc6) 4. cxd5 Nxd5 5. Bg2 Nb6 6. d3 Be7 7. Nf3 Nc6 8. Be3 O-O 9. a3 Be6 10. O-O h6 11. Rc1) 3. g3 g6 (3... Nf6 4. Bg2 Bc5 5. e3 O-O 6. Nge2 d6 7. O-O a6 8. d4 Ba7 9. h3 Re8) 4. Bg2 Bg7 5. d3 d6 6. e4 Nge7 (6... f5 7. Nge2 Nf6 8. O-O O-O 9. exf5 Bxf5 10. h3 Qd7) 7. Nge2 O-O 8. O-O Be6 9. Nd5 Qd7 10. Be3 f5 *
```

| # | Ligne | Perte max (cp) | Résultat |
|---|---|---|---|
| 1 | 1. c4 e5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6 6. e4 Nge7 7. Nge2 O-O 8. O-O Be6 9. Nd5 Qd7 10. Be3 f5 | 11 | ✅ |
| 2 | 1. c4 e5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6 6. e4 f5 7. Nge2 Nf6 8. O-O O-O 9. exf5 Bxf5 10. h3 Qd7 | 11 | ✅ |
| 3 | 1. c4 e5 2. Nc3 Nc6 3. g3 Nf6 4. Bg2 Bc5 5. e3 O-O 6. Nge2 d6 7. O-O a6 8. d4 Ba7 9. h3 Re8 | 18 | ✅ |
| 4 | 1. c4 e5 2. Nc3 Nf6 3. g3 d5 4. cxd5 Nxd5 5. Bg2 Nb6 6. d3 Be7 7. Nf3 Nc6 8. Be3 O-O 9. a3 Be6 10. O-O h6 11. Rc1 | 14 | ✅ |
| 5 | 1. c4 e5 2. Nc3 Nf6 3. g3 Bb4 4. Bg2 O-O 5. e4 Bxc3 6. bxc3 c6 7. Ne2 d5 8. cxd5 cxd5 9. exd5 Nxd5 10. O-O Nc6 | 15 | ✅ |
| 6 | 1. c4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6 6. e4 e5 7. Nge2 Nge7 8. O-O O-O 9. Be3 Nd4 10. Qd2 Be6 | 17 | ✅ |
| 7 | 1. c4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 Nf6 6. e4 O-O 7. Nge2 d6 8. O-O a6 9. h3 Rb8 10. a4 Ne8 | 12 | ✅ |
| 8 | 1. c4 c5 2. Nc3 Nf6 3. g3 d5 4. cxd5 Nxd5 5. Bg2 Nc7 6. Nf3 Nc6 7. O-O e5 8. d3 Be7 9. Nd2 Bd7 10. Nc4 f6 | 14 | ✅ |
| 9 | 1. c4 Nf6 2. Nc3 g6 3. g3 Bg7 4. Bg2 O-O 5. e4 d6 6. Nge2 e5 7. O-O c6 8. d3 a6 9. h3 b5 10. Be3 Nbd7 | 29 | ✅ |
| 10 | 1. c4 Nf6 2. Nc3 e6 3. d4 Bb4 4. e3 O-O 5. Bd3 d5 6. cxd5 exd5 7. Ne2 Re8 8. O-O Bd6 9. a3 c6 10. Qc2 Nbd7 | 12 | ✅ |
| 11 | 1. c4 e6 2. Nc3 d5 3. cxd5 exd5 4. d4 Nf6 5. Bg5 Be7 6. e3 O-O 7. Bd3 Nbd7 8. Nge2 Re8 9. O-O Nf8 10. Qc2 c6 | 11 | ✅ |
| 12 | 1. c4 d5 2. cxd5 Qxd5 3. Nc3 Qd8 4. d4 Nf6 5. Nf3 g6 6. e4 Bg7 7. Be2 c5 8. d5 O-O 9. O-O | 31 | ✅ |
| 13 | 1. c4 d5 2. cxd5 Qxd5 3. Nc3 Qd8 4. d4 Nf6 5. Nf3 e6 6. e4 Be7 7. Bd3 O-O 8. O-O c5 9. dxc5 Nfd7 10. Qe2 Nc6 11. Rd1 | 31 | ✅ |
| 14 | 1. c4 d5 2. cxd5 Qxd5 3. Nc3 Qa5 4. d4 Nf6 5. Nf3 c6 6. Bd2 Qb6 7. e4 Bg4 8. Qa4 Bxf3 9. gxf3 | 19 | ✅ |
| 15 | 1. c4 d5 2. cxd5 Nf6 3. Nf3 Nxd5 4. d4 g6 5. e4 Nb6 6. h3 Bg7 7. Nc3 O-O 8. Be3 Nc6 9. Qd2 f5 | 13 | ✅ |

Coups les plus coûteux : d4 (31 cp, SF préfère Nf3), e4 (29 cp, SF préfère d4), Be3 (25 cp, SF préfère a3)

## Système de Londres (Blancs)

Coups adverses imposés : aucun · 13 lignes · 87 coups vérifiés · 171 s

```pgn
[Event "Système de Londres"]
[Orientation "white"]

1. d4 d5 (1... Nf6 2. Bf4 g6 (2... e6 3. e3 c5 4. c3 Nc6 5. Nd2 d5 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4) 3. e3 Bg7 4. Nf3 O-O 5. Be2 d6 6. h3 c5 7. c3 Nc6 8. O-O b6 9. a4 Bb7 10. Nbd2) (1... e6 2. Bf4 c5 3. e3 d5 4. Nf3 Nf6 5. c3 Nc6 6. Nbd2 Nh5 7. Bg3 Nxg3 8. hxg3 Qb6 9. Qc2 g6 10. Bd3 Bd7) (1... c5 2. d5 Nf6 3. Nf3 e6 4. Nc3 exd5 5. Nxd5 Nxd5 6. Qxd5 Nc6 7. e4 d6 8. Ng5 Qe7 9. Bb5 Bd7 10. Bc4 Nd8) (1... g6 2. Nf3 Nf6 3. Bf4 Bg7 4. e3 O-O 5. Be2 d6 6. h3 c5 7. c3 Nc6 8. O-O b6 9. a4 Bb7 10. Nbd2) (1... f5 2. Bf4 d6 3. e3 Nf6 4. Nf3 g6 5. h3 Nc6 6. Bd3 Bg7 7. O-O O-O 8. Bg3 Qe8 9. Qe2 Kh8 10. Nc3 a6) (1... e5 2. dxe5 Nc6 3. Nf3 Qe7 4. Bg5 Qb4+ (4... Qc5 5. Be3 Qe7 6. Nc3 Nxe5 7. Bf4 Nxf3+ 8. gxf3 c6 9. Qd2 d5 10. O-O-O Nf6) 5. Nc3 Qa5 6. Qd5 Bc5 7. a3 h6 8. Bh4 g5 9. Bg3 g4 10. Nd2 Nge7) 2. Bf4 Nf6 (2... c5 3. e3 Nc6 4. Nf3 Nf6 5. Nbd2 e6 6. c3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4) (2... Bf5 3. e3 e6 4. Bd3 Bxd3 5. Qxd3 Nf6 6. Nf3 c5 7. c3 Nc6 8. Nbd2 Bd6 9. Bxd6 Qxd6 10. O-O O-O) 3. e3 c5 (3... e6 4. Nf3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4) (3... g6 4. Nf3 Bg7 5. Be2 O-O 6. O-O c5 7. c3 Nc6 8. h3 b6 9. Nbd2 Bb7 10. Ne5) 4. c3 Nc6 5. Nd2 e6 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 *
```

| # | Ligne | Perte max (cp) | Résultat |
|---|---|---|---|
| 1 | 1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. c3 Nc6 5. Nd2 e6 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 | 21 | ✅ |
| 2 | 1. d4 d5 2. Bf4 Nf6 3. e3 e6 4. Nf3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 | 21 | ✅ |
| 3 | 1. d4 d5 2. Bf4 Nf6 3. e3 g6 4. Nf3 Bg7 5. Be2 O-O 6. O-O c5 7. c3 Nc6 8. h3 b6 9. Nbd2 Bb7 10. Ne5 | 21 | ✅ |
| 4 | 1. d4 d5 2. Bf4 c5 3. e3 Nc6 4. Nf3 Nf6 5. Nbd2 e6 6. c3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 | 21 | ✅ |
| 5 | 1. d4 d5 2. Bf4 Bf5 3. e3 e6 4. Bd3 Bxd3 5. Qxd3 Nf6 6. Nf3 c5 7. c3 Nc6 8. Nbd2 Bd6 9. Bxd6 Qxd6 10. O-O O-O | 21 | ✅ |
| 6 | 1. d4 Nf6 2. Bf4 g6 3. e3 Bg7 4. Nf3 O-O 5. Be2 d6 6. h3 c5 7. c3 Nc6 8. O-O b6 9. a4 Bb7 10. Nbd2 | 26 | ✅ |
| 7 | 1. d4 Nf6 2. Bf4 e6 3. e3 c5 4. c3 Nc6 5. Nd2 d5 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 | 10 | ✅ |
| 8 | 1. d4 e6 2. Bf4 c5 3. e3 d5 4. Nf3 Nf6 5. c3 Nc6 6. Nbd2 Nh5 7. Bg3 Nxg3 8. hxg3 Qb6 9. Qc2 g6 10. Bd3 Bd7 | 35 | ✅ |
| 9 | 1. d4 c5 2. d5 Nf6 3. Nf3 e6 4. Nc3 exd5 5. Nxd5 Nxd5 6. Qxd5 Nc6 7. e4 d6 8. Ng5 Qe7 9. Bb5 Bd7 10. Bc4 Nd8 | 17 | ✅ |
| 10 | 1. d4 g6 2. Nf3 Nf6 3. Bf4 Bg7 4. e3 O-O 5. Be2 d6 6. h3 c5 7. c3 Nc6 8. O-O b6 9. a4 Bb7 10. Nbd2 | 29 | ✅ |
| 11 | 1. d4 f5 2. Bf4 d6 3. e3 Nf6 4. Nf3 g6 5. h3 Nc6 6. Bd3 Bg7 7. O-O O-O 8. Bg3 Qe8 9. Qe2 Kh8 10. Nc3 a6 | 30 | ✅ |
| 12 | 1. d4 e5 2. dxe5 Nc6 3. Nf3 Qe7 4. Bg5 Qb4+ 5. Nc3 Qa5 6. Qd5 Bc5 7. a3 h6 8. Bh4 g5 9. Bg3 g4 10. Nd2 Nge7 | 14 | ✅ |
| 13 | 1. d4 e5 2. dxe5 Nc6 3. Nf3 Qe7 4. Bg5 Qc5 5. Be3 Qe7 6. Nc3 Nxe5 7. Bf4 Nxf3+ 8. gxf3 c6 9. Qd2 d5 10. O-O-O Nf6 | 30 | ✅ |

Coups les plus coûteux : Bf4 (35 cp, SF préfère e4), Bg3 (30 cp, SF préfère Nc3), Bf4 (30 cp, SF préfère Nxe5)

## Système …c5 / …g6 (Dragon accéléré) (Noirs)

Coups adverses imposés : aucun · 30 lignes · 161 coups vérifiés · 284 s

```pgn
[Event "Système …c5 / …g6 (Dragon accéléré)"]
[Orientation "black"]

1. e4 (1. e3 c5 2. d4 g6 3. c4 Bg7 4. Nc3 Nf6 5. d5 d6 6. Nf3 O-O 7. Bd3 e6 8. h3 exd5) 1... c5 2. Nf3 (2. Nc3 Nc6 3. g3 (3. f4 g6 4. Nf3 Bg7 5. Bc4 e6 6. O-O Nge7 7. d3 d5 8. Bb3 O-O) (3. Nf3 g6 4. d4 cxd4 5. Nxd4 Bg7 6. Be3 Nf6 7. Bc4 O-O) (3. Bc4 g6 4. Qf3 (4. Nf3 Bg7 5. d3 Nf6 6. h3 d6 7. O-O O-O 8. Be3 e6) 4... Nf6 5. d3 Bg7 6. Nge2 d6 7. O-O O-O 8. Qg3 Bd7) (3. Bb5 g6 4. Bxc6 bxc6 5. f4 Bg7 6. d3 Nf6 7. Nf3 d6 8. h3 O-O) 3... g6 4. Bg2 Bg7 5. d3 d6 6. f4 e6 7. Nf3 Nge7 8. O-O O-O 9. Be3 Nd4 10. Qd2 Rb8) (2. c3 Nf6 3. e5 Nd5 4. d4 (4. Nf3 Nc6 5. d4 cxd4 6. cxd4 d6 7. Bc4 Nb6) 4... cxd4 5. Nf3 Nc6 6. cxd4 d6 7. Bc4 Nb6 8. Bb5 dxe5 9. Nxe5 Bd7 10. Nxd7 Qxd7) (2. d4 cxd4 3. c3 (3. Nf3 Nc6 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6) 3... Nf6 4. e5 Nd5 5. Nf3 Nc6 6. cxd4 d6 7. Bc4 Nb6) (2. Bc4 Nc6 3. Nf3 (3. Qf3 Nf6 4. d3 g6 5. Nc3 Bg7 6. Nge2 d6 7. Qg3 O-O 8. O-O Bd7) (3. Qh5 e6 4. Nf3 Nf6 5. Qh4 d5 6. exd5 exd5 7. Bb5 Bd6 8. O-O O-O) 3... g6 4. O-O Bg7 5. c3 e6) (2. Qh5 d6 3. Bc4 g6 4. Qe2 (4. Qf3 Nf6 5. d3 Bg7 6. Ne2 Nc6 7. Nbc3 O-O 8. O-O e6) 4... Bg7 5. Nf3 Nc6 6. O-O Nf6 7. h3 O-O 8. d3 Rb8) (2. Qf3 Nc6 3. Bc4 Nf6 4. d3 g6 5. Nc3 Bg7 6. Nge2 d6 7. Qg3 O-O 8. O-O Bd7) (2. d3 g6 3. g3 Bg7 4. Bg2 Nc6 5. c3 Nf6 6. d4 d6 7. d5 Na5 8. Na3 O-O) (2. c4 Nc6 3. Nc3 g6 4. Nge2 Bg7 5. d3 d6 6. g3 Nf6 7. h3 O-O 8. Bg2 Bd7) 2... Nc6 3. d4 (3. Bc4 g6 4. O-O (4. Nc3 Bg7 5. d3 e6 6. O-O Nge7 7. Bb3 O-O 8. Re1 d6 9. Ne2 Ne5 10. Nxe5 dxe5) 4... Bg7 5. c3 e6 6. d4 cxd4 7. cxd4 d5 8. exd5 exd5 9. Bb5 Ne7 10. Re1 O-O) (3. Bb5 g6 4. O-O (4. Bxc6 dxc6 5. d3 Bg7 6. h3 Nf6 7. Nc3 O-O 8. Be3 b6 9. Qd2 e5) 4... Bg7 5. Re1 e5 6. Bxc6 dxc6 7. d3 Qe7 8. Nbd2 Nf6 9. Nc4 Nd7) (3. Nc3 g6 4. d4 cxd4 5. Nxd4 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 d6) (3. c3 Nf6 4. d4 cxd4 5. e5 Nd5 6. cxd4 d6 7. Bc4 Nb6 8. Bb3 dxe5) 3... cxd4 4. Nxd4 g6 5. Nc3 (5. c4 Bg7 6. Be3 Nf6 7. Nc3 Ng4 8. Qxg4 Nxd4 9. Qd1 Ne6 10. Rc1 Qa5 11. Qd2 d6) (5. Nxc6 bxc6 6. Bd3 (6. Qd4 Nf6 7. e5 Nd5 8. e6 f6 9. exd7+ Bxd7 10. Bc4 e5) 6... Bg7 7. O-O Nf6 8. Nc3 d6 9. h3 O-O 10. Be3 Rb8) 5... Bg7 6. Be3 Nf6 7. Bc4 (7. Be2 O-O 8. O-O d5 9. exd5 Nxd5 10. Nxd5 Qxd5 11. Bf3 Qc4 12. Nxc6 bxc6 13. b3 Qa6) 7... O-O 8. Bb3 d6 9. f3 Bd7 10. Qd2 Nxd4 11. Bxd4 b5 *
```

| # | Ligne | Perte max (cp) | Résultat |
|---|---|---|---|
| 1 | 1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 d6 9. f3 Bd7 10. Qd2 Nxd4 11. Bxd4 b5 | 22 | ✅ |
| 2 | 1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6 7. Be2 O-O 8. O-O d5 9. exd5 Nxd5 10. Nxd5 Qxd5 11. Bf3 Qc4 12. Nxc6 bxc6 13. b3 Qa6 | 22 | ✅ |
| 3 | 1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. c4 Bg7 6. Be3 Nf6 7. Nc3 Ng4 8. Qxg4 Nxd4 9. Qd1 Ne6 10. Rc1 Qa5 11. Qd2 d6 | 22 | ✅ |
| 4 | 1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nxc6 bxc6 6. Bd3 Bg7 7. O-O Nf6 8. Nc3 d6 9. h3 O-O 10. Be3 Rb8 | 27 | ✅ |
| 5 | 1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nxc6 bxc6 6. Qd4 Nf6 7. e5 Nd5 8. e6 f6 9. exd7+ Bxd7 10. Bc4 e5 | 27 | ✅ |
| 6 | 1. e4 c5 2. Nf3 Nc6 3. Bc4 g6 4. O-O Bg7 5. c3 e6 6. d4 cxd4 7. cxd4 d5 8. exd5 exd5 9. Bb5 Ne7 10. Re1 O-O | 30 | ✅ |
| 7 | 1. e4 c5 2. Nf3 Nc6 3. Bc4 g6 4. Nc3 Bg7 5. d3 e6 6. O-O Nge7 7. Bb3 O-O 8. Re1 d6 9. Ne2 Ne5 10. Nxe5 dxe5 | 30 | ✅ |
| 8 | 1. e4 c5 2. Nf3 Nc6 3. Bb5 g6 4. O-O Bg7 5. Re1 e5 6. Bxc6 dxc6 7. d3 Qe7 8. Nbd2 Nf6 9. Nc4 Nd7 | 10 | ✅ |
| 9 | 1. e4 c5 2. Nf3 Nc6 3. Bb5 g6 4. Bxc6 dxc6 5. d3 Bg7 6. h3 Nf6 7. Nc3 O-O 8. Be3 b6 9. Qd2 e5 | 15 | ✅ |
| 10 | 1. e4 c5 2. Nf3 Nc6 3. Nc3 g6 4. d4 cxd4 5. Nxd4 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 d6 | 8 | ✅ |
| 11 | 1. e4 c5 2. Nf3 Nc6 3. c3 Nf6 4. d4 cxd4 5. e5 Nd5 6. cxd4 d6 7. Bc4 Nb6 8. Bb3 dxe5 | 8 | ✅ |
| 12 | 1. e4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6 6. f4 e6 7. Nf3 Nge7 8. O-O O-O 9. Be3 Nd4 10. Qd2 Rb8 | 8 | ✅ |
| 13 | 1. e4 c5 2. Nc3 Nc6 3. f4 g6 4. Nf3 Bg7 5. Bc4 e6 6. O-O Nge7 7. d3 d5 8. Bb3 O-O | 8 | ✅ |
| 14 | 1. e4 c5 2. Nc3 Nc6 3. Nf3 g6 4. d4 cxd4 5. Nxd4 Bg7 6. Be3 Nf6 7. Bc4 O-O | 8 | ✅ |
| 15 | 1. e4 c5 2. Nc3 Nc6 3. Bc4 g6 4. Qf3 Nf6 5. d3 Bg7 6. Nge2 d6 7. O-O O-O 8. Qg3 Bd7 | 17 | ✅ |
| 16 | 1. e4 c5 2. Nc3 Nc6 3. Bc4 g6 4. Nf3 Bg7 5. d3 Nf6 6. h3 d6 7. O-O O-O 8. Be3 e6 | 8 | ✅ |
| 17 | 1. e4 c5 2. Nc3 Nc6 3. Bb5 g6 4. Bxc6 bxc6 5. f4 Bg7 6. d3 Nf6 7. Nf3 d6 8. h3 O-O | 9 | ✅ |
| 18 | 1. e4 c5 2. c3 Nf6 3. e5 Nd5 4. d4 cxd4 5. Nf3 Nc6 6. cxd4 d6 7. Bc4 Nb6 8. Bb5 dxe5 9. Nxe5 Bd7 10. Nxd7 Qxd7 | 8 | ✅ |
| 19 | 1. e4 c5 2. c3 Nf6 3. e5 Nd5 4. Nf3 Nc6 5. d4 cxd4 6. cxd4 d6 7. Bc4 Nb6 | 8 | ✅ |
| 20 | 1. e4 c5 2. d4 cxd4 3. c3 Nf6 4. e5 Nd5 5. Nf3 Nc6 6. cxd4 d6 7. Bc4 Nb6 | 36 | ✅ |
| 21 | 1. e4 c5 2. d4 cxd4 3. Nf3 Nc6 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6 | 22 | ✅ |
| 22 | 1. e4 c5 2. Bc4 Nc6 3. Nf3 g6 4. O-O Bg7 5. c3 e6 | 30 | ✅ |
| 23 | 1. e4 c5 2. Bc4 Nc6 3. Qf3 Nf6 4. d3 g6 5. Nc3 Bg7 6. Nge2 d6 7. Qg3 O-O 8. O-O Bd7 | 37 | ✅ |
| 24 | 1. e4 c5 2. Bc4 Nc6 3. Qh5 e6 4. Nf3 Nf6 5. Qh4 d5 6. exd5 exd5 7. Bb5 Bd6 8. O-O O-O | 33 | ✅ |
| 25 | 1. e4 c5 2. Qh5 d6 3. Bc4 g6 4. Qe2 Bg7 5. Nf3 Nc6 6. O-O Nf6 7. h3 O-O 8. d3 Rb8 | 11 | ✅ |
| 26 | 1. e4 c5 2. Qh5 d6 3. Bc4 g6 4. Qf3 Nf6 5. d3 Bg7 6. Ne2 Nc6 7. Nbc3 O-O 8. O-O e6 | 12 | ✅ |
| 27 | 1. e4 c5 2. Qf3 Nc6 3. Bc4 Nf6 4. d3 g6 5. Nc3 Bg7 6. Nge2 d6 7. Qg3 O-O 8. O-O Bd7 | 37 | ✅ |
| 28 | 1. e4 c5 2. d3 g6 3. g3 Bg7 4. Bg2 Nc6 5. c3 Nf6 6. d4 d6 7. d5 Na5 8. Na3 O-O | 35 | ✅ |
| 29 | 1. e4 c5 2. c4 Nc6 3. Nc3 g6 4. Nge2 Bg7 5. d3 d6 6. g3 Nf6 7. h3 O-O 8. Bg2 Bd7 | 10 | ✅ |
| 30 | 1. e3 c5 2. d4 g6 3. c4 Bg7 4. Nc3 Nf6 5. d5 d6 6. Nf3 O-O 7. Bd3 e6 8. h3 exd5 | 9 | ✅ |

Coups les plus coûteux : g6 (37 cp, SF préfère e6), Nf6 (36 cp, SF préfère dxc3), Nf6 (35 cp, SF préfère e5)

## Londres en défense (Noirs)

Coups adverses imposés : d4 ou c4 ou Nf3 · 17 lignes · 105 coups vérifiés · 206 s

```pgn
[Event "Londres en défense"]
[Orientation "black"]

1. d4 (1. c4 c6 2. Nf3 (2. e4 d5 3. exd5 Nf6 4. d4 cxd5 5. Nf3 e6 6. Nc3 Be7 7. cxd5 Nxd5 8. Bd3 Nf6 9. O-O O-O 10. Re1 Nc6) (2. Nc3 d5 3. cxd5 cxd5 4. d4 Nf6 5. Bf4 e6 6. e3 Bd6 7. Bg3 O-O 8. Bd3 h6 9. Rc1 Be7 10. Nf3 Qb6) 2... d5 3. e3 Nf6 4. d4 Bf5 5. Nc3 e6 6. Nh4 Bg6 7. Qb3 Qc7 8. Nxg6 hxg6 9. h4 Bd6 10. Bd2 Nbd7) (1. Nf3 d5 2. c4 (2. d4 c6 3. Bf4 Nf6 4. e3 Bf5 5. c4 e6) (2. g3 c6 3. Bg2 Nf6 4. O-O Bf5 5. d3 e6 6. Nh4 Bg4 7. Qe1 Nbd7 8. h3 Bh5 9. e4 h6 10. f4 Qb6+) (2. e3 c6 3. c4 Nf6 4. d4 Bf5 5. Nc3 e6) 2... c6 3. e3 Nf6 4. d4 Bf5 5. Nc3 e6) 1... d5 2. c4 (2. Nf3 c6 3. Bf4 (3. c4 Nf6 4. e3 Bf5 5. Nc3 e6) 3... Nf6 4. e3 Bf5 5. c4 e6 6. Qb3 Qc8 7. Nc3 Nbd7 8. cxd5 Nxd5 9. Bg3 Bg6 10. Rc1 h6) (2. Bf4 Nf6 3. e3 Bf5 4. Nf3 c6 5. c4 e6 6. Qb3 Qc8 7. Nc3 Nbd7 8. cxd5 Nxd5 9. Bg3 Bg6 10. Rc1 h6) (2. e3 Bf5 3. c4 (3. Bd3 e6 4. Nf3 c6 5. c4 Nf6 6. O-O Nbd7 7. Bxf5 exf5 8. Qd3 g6 9. cxd5 Nxd5 10. e4 fxe4) 3... e6 4. Qb3 Nc6 5. Bd2 Rb8 6. Nf3 Nf6 7. Bc3 Bd6 8. c5 Be7 9. Nbd2 O-O 10. Bb5 Qc8) (2. Nc3 Nf6 3. Bf4 c6 4. e3 Bf5 5. f3 e6 6. g4 Bg6 7. h4 h6 8. Nge2 Nbd7 9. Qd2 Nb6 10. Ng3 Bd6) 2... c6 3. Nf3 (3. Nc3 Nf6 4. e3 e6 5. Nf3 Bd6 6. Bd3 Nbd7 7. e4 dxc4 8. Bxc4 b5 9. Bb3 b4 10. Na4 Be7) (3. cxd5 cxd5 4. Nc3 Nf6 5. Bf4 e6 6. e3 Bd6 7. Bg3 O-O 8. Nf3 h6 9. Bh4 Nbd7 10. Bd3 Be7) 3... Nf6 4. e3 (4. Nc3 e6 5. Bg5 Nbd7 6. cxd5 exd5 7. Qc2 Bd6 8. e3 O-O 9. Bd3 h6 10. Bh4 Be7) 4... Bf5 5. Nc3 e6 6. Nh4 Bg6 7. Nxg6 hxg6 8. Bd3 Bd6 9. Qb3 Qc7 10. cxd5 exd5 11. Bd2 Nbd7 *
```

| # | Ligne | Perte max (cp) | Résultat |
|---|---|---|---|
| 1 | 1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. e3 Bf5 5. Nc3 e6 6. Nh4 Bg6 7. Nxg6 hxg6 8. Bd3 Bd6 9. Qb3 Qc7 10. cxd5 exd5 11. Bd2 Nbd7 | 13 | ✅ |
| 2 | 1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. Bg5 Nbd7 6. cxd5 exd5 7. Qc2 Bd6 8. e3 O-O 9. Bd3 h6 10. Bh4 Be7 | 21 | ✅ |
| 3 | 1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. Nf3 Bd6 6. Bd3 Nbd7 7. e4 dxc4 8. Bxc4 b5 9. Bb3 b4 10. Na4 Be7 | 19 | ✅ |
| 4 | 1. d4 d5 2. c4 c6 3. cxd5 cxd5 4. Nc3 Nf6 5. Bf4 e6 6. e3 Bd6 7. Bg3 O-O 8. Nf3 h6 9. Bh4 Nbd7 10. Bd3 Be7 | 24 | ✅ |
| 5 | 1. d4 d5 2. Nf3 c6 3. Bf4 Nf6 4. e3 Bf5 5. c4 e6 6. Qb3 Qc8 7. Nc3 Nbd7 8. cxd5 Nxd5 9. Bg3 Bg6 10. Rc1 h6 | 24 | ✅ |
| 6 | 1. d4 d5 2. Nf3 c6 3. c4 Nf6 4. e3 Bf5 5. Nc3 e6 | 4 | ✅ |
| 7 | 1. d4 d5 2. Bf4 Nf6 3. e3 Bf5 4. Nf3 c6 5. c4 e6 6. Qb3 Qc8 7. Nc3 Nbd7 8. cxd5 Nxd5 9. Bg3 Bg6 10. Rc1 h6 | 28 | ✅ |
| 8 | 1. d4 d5 2. e3 Bf5 3. c4 e6 4. Qb3 Nc6 5. Bd2 Rb8 6. Nf3 Nf6 7. Bc3 Bd6 8. c5 Be7 9. Nbd2 O-O 10. Bb5 Qc8 | 46 | ✅ |
| 9 | 1. d4 d5 2. e3 Bf5 3. Bd3 e6 4. Nf3 c6 5. c4 Nf6 6. O-O Nbd7 7. Bxf5 exf5 8. Qd3 g6 9. cxd5 Nxd5 10. e4 fxe4 | 15 | ✅ |
| 10 | 1. d4 d5 2. Nc3 Nf6 3. Bf4 c6 4. e3 Bf5 5. f3 e6 6. g4 Bg6 7. h4 h6 8. Nge2 Nbd7 9. Qd2 Nb6 10. Ng3 Bd6 | 19 | ✅ |
| 11 | 1. c4 c6 2. Nf3 d5 3. e3 Nf6 4. d4 Bf5 5. Nc3 e6 6. Nh4 Bg6 7. Qb3 Qc7 8. Nxg6 hxg6 9. h4 Bd6 10. Bd2 Nbd7 | 18 | ✅ |
| 12 | 1. c4 c6 2. e4 d5 3. exd5 Nf6 4. d4 cxd5 5. Nf3 e6 6. Nc3 Be7 7. cxd5 Nxd5 8. Bd3 Nf6 9. O-O O-O 10. Re1 Nc6 | 17 | ✅ |
| 13 | 1. c4 c6 2. Nc3 d5 3. cxd5 cxd5 4. d4 Nf6 5. Bf4 e6 6. e3 Bd6 7. Bg3 O-O 8. Bd3 h6 9. Rc1 Be7 10. Nf3 Qb6 | 22 | ✅ |
| 14 | 1. Nf3 d5 2. c4 c6 3. e3 Nf6 4. d4 Bf5 5. Nc3 e6 | 16 | ✅ |
| 15 | 1. Nf3 d5 2. d4 c6 3. Bf4 Nf6 4. e3 Bf5 5. c4 e6 | 1 | ✅ |
| 16 | 1. Nf3 d5 2. g3 c6 3. Bg2 Nf6 4. O-O Bf5 5. d3 e6 6. Nh4 Bg4 7. Qe1 Nbd7 8. h3 Bh5 9. e4 h6 10. f4 Qb6+ | 21 | ✅ |
| 17 | 1. Nf3 d5 2. e3 c6 3. c4 Nf6 4. d4 Bf5 5. Nc3 e6 | 12 | ✅ |

Coups les plus coûteux : Bd6 (46 cp, SF préfère Be7), Qc8 (44 cp, SF préfère Ne4), c6 (28 cp, SF préfère e6)

**Toutes les lignes passent le seuil.**

## Archives (ancien répertoire)

Consultables dans l’onglet « Archives » de l’écran Ouvertures ; vérification conservée :

- Système …c5/…g6 contre 1.d4, 1.c4, 1.♘f3 (ancien) (Noirs) : 63 coups vérifiés, perte max 21 cp.
- Gambit Dame refusé (Noirs) : 51 coups vérifiés, perte max 47 cp.
- Défense française (Noirs) : 67 coups vérifiés, perte max 36 cp.
