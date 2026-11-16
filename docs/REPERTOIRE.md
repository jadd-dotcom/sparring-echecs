# Répertoire pré-chargé et vérification Stockfish

Stockfish 19 lite (single-thread), profondeur 20, en Node.
Perte d'un de mes coups = éval du meilleur coup − éval de mon coup (même position, `searchmoves`). Seuil : 50 cp (0,5 pion).

## Système de Londres (Blancs)

Coups adverses imposés : aucun · 7 lignes · 44 coups vérifiés · 76 s

```pgn
[Event "Système de Londres"]
[Orientation "white"]

1. d4 d5 (1... Nf6 2. Bf4 g6 (2... e6 3. e3 c5 4. c3 Nc6 5. Nd2 d5 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4) 3. e3 Bg7 4. Nf3 O-O 5. Be2 d6 6. h3 c5 7. c3 Nc6 8. O-O b6 9. a4 Bb7 10. Nbd2) 2. Bf4 Nf6 (2... c5 3. e3 Nc6 4. Nf3 Nf6 5. Nbd2 e6 6. c3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4) (2... Bf5 3. e3 e6 4. Bd3 Bxd3 5. Qxd3 Nf6 6. Nf3 c5 7. c3 Nc6 8. Nbd2 Bd6 9. Bxd6 Qxd6 10. O-O O-O) 3. e3 c5 (3... e6 4. Nf3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4) (3... g6 4. Nf3 Bg7 5. Be2 O-O 6. O-O c5 7. c3 Nc6 8. h3 b6 9. Nbd2 Bb7 10. Ne5) 4. c3 Nc6 5. Nd2 e6 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 *
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

Coups les plus coûteux : O-O (26 cp, SF préfère dxc5), c3 (24 cp, SF préfère O-O), Bf4 (21 cp, SF préfère c4)

## Gambit Dame refusé (Noirs)

Coups adverses imposés : d4, c4 · 8 lignes · 51 coups vérifiés · 70 s

```pgn
[Event "Gambit Dame refusé"]
[Orientation "black"]

1. d4 d5 2. c4 e6 3. Nc3 (3. Nf3 Nf6 4. g3 (4. Bg5 h6 5. Bxf6 Qxf6 6. Nc3 c6 7. e3 Nd7 8. Bd3 dxc4 9. Bxc4 g6 10. O-O Bg7) (4. Nc3 Be7 5. Bg5 h6 6. Bh4 O-O 7. e3 b6) 4... Be7 5. Bg2 O-O 6. O-O dxc4 7. Qc2 a6 8. Qxc4 b5 9. Qc2 Bb7 10. Bd2 Be4 11. Qc1 Bb7) (3. cxd5 exd5 4. Nc3 Nf6 5. Bg5 c6) 3... Nf6 4. Bg5 (4. cxd5 exd5 5. Bg5 c6 6. Qc2 Be7 7. e3 Nbd7 8. Bd3 O-O 9. Nge2 Re8 10. O-O Nf8) (4. Nf3 Be7 5. Bf4 O-O 6. e3 c5 7. dxc5 Bxc5 8. Qc2 Nc6 9. a3 Qa5 10. Rd1 Re8 11. Nd2 e5) 4... Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 (7. Bxf6 Bxf6 8. Rc1 c6 9. Bd3 Nd7 10. O-O dxc4 11. Bxc4 e5) 7... b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 *
```

| # | Ligne | Perte max (cp) | Résultat |
|---|---|---|---|
| 1 | 1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 | 4 | ✅ |
| 2 | 1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bxf6 Bxf6 8. Rc1 c6 9. Bd3 Nd7 10. O-O dxc4 11. Bxc4 e5 | 4 | ✅ |
| 3 | 1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5 5. Bg5 c6 6. Qc2 Be7 7. e3 Nbd7 8. Bd3 O-O 9. Nge2 Re8 10. O-O Nf8 | 10 | ✅ |
| 4 | 1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Nf3 Be7 5. Bf4 O-O 6. e3 c5 7. dxc5 Bxc5 8. Qc2 Nc6 9. a3 Qa5 10. Rd1 Re8 11. Nd2 e5 | 47 | ✅ |
| 5 | 1. d4 d5 2. c4 e6 3. Nf3 Nf6 4. g3 Be7 5. Bg2 O-O 6. O-O dxc4 7. Qc2 a6 8. Qxc4 b5 9. Qc2 Bb7 10. Bd2 Be4 11. Qc1 Bb7 | 4 | ✅ |
| 6 | 1. d4 d5 2. c4 e6 3. Nf3 Nf6 4. Bg5 h6 5. Bxf6 Qxf6 6. Nc3 c6 7. e3 Nd7 8. Bd3 dxc4 9. Bxc4 g6 10. O-O Bg7 | 11 | ✅ |
| 7 | 1. d4 d5 2. c4 e6 3. Nf3 Nf6 4. Nc3 Be7 5. Bg5 h6 6. Bh4 O-O 7. e3 b6 | 4 | ✅ |
| 8 | 1. d4 d5 2. c4 e6 3. cxd5 exd5 4. Nc3 Nf6 5. Bg5 c6 | 6 | ✅ |

Coups les plus coûteux : Re8 (47 cp, SF préfère Be7), c5 (11 cp, SF préfère Nbd7), h6 (11 cp, SF préfère dxc4)

## Défense française (Noirs)

Coups adverses imposés : e4 · 9 lignes · 67 coups vérifiés · 88 s

```pgn
[Event "Défense française"]
[Orientation "black"]

1. e4 e6 2. d4 (2. d3 d5 3. Nd2 Nf6 4. Ngf3 c5 5. g3 Nc6 6. Bg2 Be7 7. O-O O-O 8. Re1 b5 9. e5 Nd7 10. Nf1 a5) (2. Nf3 d5 3. Nc3 Nf6 4. e5 Nfd7 5. d4 c5 6. dxc5 Nc6 7. Bf4 Bxc5 8. Bd3 f6 9. exf6 Nxf6 10. O-O O-O) 2... d5 3. Nc3 (3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. Be2 (6. Bd3 cxd4 7. cxd4 Bd7 8. O-O Nxd4 9. Nxd4 Qxd4 10. Nc3 a6) (6. a3 c4 7. Nbd2 Na5 8. Rb1 Bd7) 6... cxd4 7. cxd4 Nh6 8. Nc3 Nf5 9. Na4 Qa5+ 10. Bd2 Bb4) (3. Nd2 c5 4. exd5 Qxd5 5. Ngf3 cxd4 6. Bc4 Qd6 7. O-O Nf6 8. Nb3 Nc6 9. Nbxd4 Nxd4 10. Nxd4 a6) (3. exd5 exd5 4. Nf3 Nf6 5. Bd3 Bd6 6. O-O O-O 7. Bg5 Bg4 8. Nbd2 Nbd7 9. c3 c6 10. Qc2 Qc7) 3... Nf6 4. Bg5 (4. e5 Nfd7 5. f4 c5 6. Nf3 Nc6 7. Be3 cxd4 8. Nxd4 Bc5 9. Qd2 O-O 10. O-O-O a6) 4... Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 a6 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O b5 *
```

| # | Ligne | Perte max (cp) | Résultat |
|---|---|---|---|
| 1 | 1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 a6 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O b5 | 36 | ✅ |
| 2 | 1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. e5 Nfd7 5. f4 c5 6. Nf3 Nc6 7. Be3 cxd4 8. Nxd4 Bc5 9. Qd2 O-O 10. O-O-O a6 | 9 | ✅ |
| 3 | 1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. Be2 cxd4 7. cxd4 Nh6 8. Nc3 Nf5 9. Na4 Qa5+ 10. Bd2 Bb4 | 0 | ✅ |
| 4 | 1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. Bd3 cxd4 7. cxd4 Bd7 8. O-O Nxd4 9. Nxd4 Qxd4 10. Nc3 a6 | 0 | ✅ |
| 5 | 1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. a3 c4 7. Nbd2 Na5 8. Rb1 Bd7 | 0 | ✅ |
| 6 | 1. e4 e6 2. d4 d5 3. Nd2 c5 4. exd5 Qxd5 5. Ngf3 cxd4 6. Bc4 Qd6 7. O-O Nf6 8. Nb3 Nc6 9. Nbxd4 Nxd4 10. Nxd4 a6 | 15 | ✅ |
| 7 | 1. e4 e6 2. d4 d5 3. exd5 exd5 4. Nf3 Nf6 5. Bd3 Bd6 6. O-O O-O 7. Bg5 Bg4 8. Nbd2 Nbd7 9. c3 c6 10. Qc2 Qc7 | 15 | ✅ |
| 8 | 1. e4 e6 2. d3 d5 3. Nd2 Nf6 4. Ngf3 c5 5. g3 Nc6 6. Bg2 Be7 7. O-O O-O 8. Re1 b5 9. e5 Nd7 10. Nf1 a5 | 14 | ✅ |
| 9 | 1. e4 e6 2. Nf3 d5 3. Nc3 Nf6 4. e5 Nfd7 5. d4 c5 6. dxc5 Nc6 7. Bf4 Bxc5 8. Bd3 f6 9. exf6 Nxf6 10. O-O O-O | 25 | ✅ |

Coups les plus coûteux : Be7 (36 cp, SF préfère dxe4), f6 (25 cp, SF préfère a6), a6 (20 cp, SF préfère O-O)

**Toutes les lignes passent le seuil.**
