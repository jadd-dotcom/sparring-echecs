// Répertoire pré-chargé : lignes principales, ~10 coups, en PGN avec variantes.
// Pour ajouter une ouverture : ajouter une entrée ici (ou via l'écran Ouvertures).
// Répertoire actuel : Anglaise (Blancs) et système …c5/…g6 (Noirs). L'ancien (Londres, GDR, Française) est archivé.
import type { Color } from '../lib/repertoire';

export interface OpeningDef {
  id: string;
  name: string;
  color: Color;          // ma couleur
  /** Coups adverses imposés en début de partie (SAN, dans l'ordre), ensuite Maia est libre. */
  forced: string[];
  pgn: string;
  /** Rangée dans les Archives (ancien répertoire, consultable). */
  archived?: boolean;
}

/** Blancs : Anglaise, système fermé (c4, Nc3, g3, Bg2, d3, puis e4 ou e3, Nge2, petit roque). */
export const ENGLISH_PGN = `[Event "Anglaise (système fermé)"]
[Orientation "white"]

1. c4 e5 (1... c5 2. Nc3 Nc6 (2... Nf6 3. g3 d5 4. cxd5 Nxd5 5. Bg2 Nc7 6. Nf3 Nc6 7. O-O e5 8. d3 Be7 9. Nd2 Bd7 10. Nc4 f6) 3. g3 g6 4. Bg2 Bg7 5. d3 d6 (5... Nf6 6. e4 O-O 7. Nge2 d6 8. O-O a6 9. h3 Rb8 10. a4 Ne8) 6. e4 e5 7. Nge2 Nge7 8. O-O O-O 9. Be3 Nd4 10. Qd2 Be6) (1... Nf6 2. Nc3 g6 (2... e6 3. d4 Bb4 4. e3 O-O 5. Bd3 d5 6. cxd5 exd5 7. Ne2 Re8 8. O-O Bd6 9. a3 c6 10. Qc2 Nbd7) 3. g3 Bg7 4. Bg2 O-O 5. e4 d6 6. Nge2 e5 7. O-O c6 8. d3 a6 9. h3 b5 10. Be3 Nbd7) (1... e6 2. Nc3 d5 3. cxd5 exd5 4. d4 Nf6 5. Bg5 Be7 6. e3 O-O 7. Bd3 Nbd7 8. Nge2 Re8 9. O-O Nf8 10. Qc2 c6) (1... d5 2. cxd5 Qxd5 (2... Nf6 3. Nf3 Nxd5 4. d4 g6 5. e4 Nb6 6. h3 Bg7 7. Nc3 O-O 8. Be3 Nc6 9. Qd2 f5) 3. Nc3 Qd8 (3... Qa5 4. d4 Nf6 5. Nf3 c6 6. Bd2 Qb6 7. e4 Bg4 8. Qa4 Bxf3 9. gxf3) 4. d4 Nf6 5. Nf3 g6 (5... e6 6. e4 Be7 7. Bd3 O-O 8. O-O c5 9. dxc5 Nfd7 10. Qe2 Nc6 11. Rd1) 6. e4 Bg7 7. Be2 c5 8. d5 O-O 9. O-O) 2. Nc3 Nc6 (2... Nf6 3. g3 d5 (3... Bb4 4. Bg2 O-O 5. e4 Bxc3 6. bxc3 c6 7. Ne2 d5 8. cxd5 cxd5 9. exd5 Nxd5 10. O-O Nc6) 4. cxd5 Nxd5 5. Bg2 Nb6 6. d3 Be7 7. Nf3 Nc6 8. Be3 O-O 9. a3 Be6 10. O-O h6 11. Rc1) 3. g3 g6 (3... Nf6 4. Bg2 Bc5 5. e3 O-O 6. Nge2 d6 7. O-O a6 8. d4 Ba7 9. h3 Re8) 4. Bg2 Bg7 5. d3 d6 6. e4 Nge7 (6... f5 7. Nge2 Nf6 8. O-O O-O 9. exf5 Bxf5 10. h3 Qd7) 7. Nge2 O-O 8. O-O Be6 9. Nd5 Qd7 10. Be3 f5 *
`;

/** Noirs : le même système inversé (…c5, …Nc6, …g6, …Bg7, …d6), contre 1.e4, 1.d4, 1.c4 et 1.Nf3. */
export const G6_SYSTEM_PGN = `[Event "Système …c5 / …g6 (Dragon accéléré)"]
[Orientation "black"]

1. e4 (1. d4 Nf6 2. c4 (2. Nf3 g6 3. Bf4 (3. c4 Bg7 4. Nc3 O-O 5. e4 d6 6. Be2 c5) 3... Bg7 4. e3 O-O 5. Be2 d6 6. h3 c5 7. c3 Qb6 8. Qb3 Be6 9. Qxb6 axb6 10. a3 cxd4 11. exd4 Nd5) (2. Bf4 g6 3. e3 Bg7 4. Nf3 O-O 5. Be2 d6 6. h3 c5 7. c3 Qb6) 2... g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 c5 7. O-O (7. d5 e6 8. O-O exd5 9. cxd5 Re8 10. Nd2 Na6) 7... cxd4 8. Nxd4 Nc6 9. Be3 Bd7 10. Qd2 Nxd4 11. Bxd4 Bc6) (1. c4 c5 2. Nc3 (2. Nf3 Nc6 3. Nc3 g6 4. g3 Bg7 5. Bg2 d6 6. O-O Nf6) 2... Nc6 3. g3 g6 4. Bg2 Bg7 5. Nf3 (5. e3 e5 6. Nge2 Nge7 7. O-O O-O 8. d3 d6 9. Rb1 a5 10. a3 Be6) 5... d6 6. O-O Nf6 7. d3 O-O 8. a3 a6 9. Rb1 Rb8 10. b4 cxb4 11. axb4 b5) (1. Nf3 c5 2. g3 (2. e4 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7) (2. c4 Nc6 3. Nc3 g6 4. g3 Bg7 5. Bg2 d6) 2... g6 3. Bg2 Bg7 4. O-O Nc6 5. d3 d6 6. e4 e5 7. c3 Nge7 8. a3 O-O 9. b4 b6) 1... c5 2. Nf3 (2. Nc3 Nc6 3. g3 (3. f4 g6 4. Nf3 Bg7 5. Bc4 e6 6. O-O Nge7 7. d3 d5 8. Bb3 O-O) (3. Nf3 g6 4. d4 cxd4 5. Nxd4 Bg7 6. Be3 Nf6 7. Bc4 O-O) 3... g6 4. Bg2 Bg7 5. d3 d6 6. f4 e6 7. Nf3 Nge7 8. O-O O-O 9. Be3 Nd4 10. Qd2 Rb8) (2. c3 Nf6 3. e5 Nd5 4. d4 (4. Nf3 Nc6 5. d4 cxd4 6. cxd4 d6 7. Bc4 Nb6) 4... cxd4 5. Nf3 Nc6 6. cxd4 d6 7. Bc4 Nb6 8. Bb5 dxe5 9. Nxe5 Bd7 10. Nxd7 Qxd7) (2. d4 cxd4 3. c3 (3. Nf3 Nc6 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6) 3... Nf6 4. e5 Nd5 5. Nf3 Nc6 6. cxd4 d6 7. Bc4 Nb6) (2. Bc4 Nc6 3. Nf3 g6 4. O-O Bg7 5. c3 e6) 2... Nc6 3. d4 (3. Bc4 g6 4. O-O (4. Nc3 Bg7 5. d3 e6 6. O-O Nge7 7. Bb3 O-O 8. Re1 d6 9. Ne2 Ne5 10. Nxe5 dxe5) 4... Bg7 5. c3 e6 6. d4 cxd4 7. cxd4 d5 8. exd5 exd5 9. Bb5 Ne7 10. Re1 O-O) (3. Bb5 g6 4. O-O (4. Bxc6 dxc6 5. d3 Bg7 6. h3 Nf6 7. Nc3 O-O 8. Be3 b6 9. Qd2 e5) 4... Bg7 5. Re1 e5 6. Bxc6 dxc6 7. d3 Qe7 8. Nbd2 Nf6 9. Nc4 Nd7) (3. Nc3 g6 4. d4 cxd4 5. Nxd4 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 d6) 3... cxd4 4. Nxd4 g6 5. Nc3 (5. c4 Bg7 6. Be3 Nf6 7. Nc3 Ng4 8. Qxg4 Nxd4 9. Qd1 Ne6 10. Rc1 Qa5 11. Qd2 d6) (5. Nxc6 bxc6 6. Bd3 (6. Qd4 Nf6 7. e5 Nd5 8. e6 f6 9. exd7+ Bxd7 10. Bc4 e5) 6... Bg7 7. O-O Nf6 8. Nc3 d6 9. h3 O-O 10. Be3 Rb8) 5... Bg7 6. Be3 Nf6 7. Bc4 (7. Be2 O-O 8. O-O d5 9. exd5 Nxd5 10. Nxd5 Qxd5 11. Bf3 Qc4 12. Nxc6 bxc6 13. b3 Qa6) 7... O-O 8. Bb3 d6 9. f3 Bd7 10. Qd2 Nxd4 11. Bxd4 b5 *
`;

// ---------------------------------------------------------------- Archives (ancien répertoire)

export const LONDON_PGN = `[Event "Système de Londres"]
[Orientation "white"]

1. d4 d5 (1... Nf6 2. Bf4 g6 (2... e6 3. e3 c5 4. c3 Nc6 5. Nd2 d5 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4) 3. e3 Bg7 4. Nf3 O-O 5. Be2 d6 6. h3 c5 7. c3 Nc6 8. O-O b6 9. a4 Bb7 10. Nbd2) 2. Bf4 Nf6 (2... c5 3. e3 Nc6 4. Nf3 Nf6 5. Nbd2 e6 6. c3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4) (2... Bf5 3. e3 e6 4. Bd3 Bxd3 5. Qxd3 Nf6 6. Nf3 c5 7. c3 Nc6 8. Nbd2 Bd6 9. Bxd6 Qxd6 10. O-O O-O) 3. e3 c5 (3... e6 4. Nf3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4) (3... g6 4. Nf3 Bg7 5. Be2 O-O 6. O-O c5 7. c3 Nc6 8. h3 b6 9. Nbd2 Bb7 10. Ne5) 4. c3 Nc6 5. Nd2 e6 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 *
`;

export const QGD_PGN = `[Event "Gambit Dame refusé"]
[Orientation "black"]

1. d4 d5 2. c4 e6 3. Nc3 (3. Nf3 Nf6 4. g3 (4. Bg5 h6 5. Bxf6 Qxf6 6. Nc3 c6 7. e3 Nd7 8. Bd3 dxc4 9. Bxc4 g6 10. O-O Bg7) (4. Nc3 Be7 5. Bg5 h6 6. Bh4 O-O 7. e3 b6) 4... Be7 5. Bg2 O-O 6. O-O dxc4 7. Qc2 a6 8. Qxc4 b5 9. Qc2 Bb7 10. Bd2 Be4 11. Qc1 Bb7) (3. cxd5 exd5 4. Nc3 Nf6 5. Bg5 c6) 3... Nf6 4. Bg5 (4. cxd5 exd5 5. Bg5 c6 6. Qc2 Be7 7. e3 Nbd7 8. Bd3 O-O 9. Nge2 Re8 10. O-O Nf8) (4. Nf3 Be7 5. Bf4 O-O 6. e3 c5 7. dxc5 Bxc5 8. Qc2 Nc6 9. a3 Qa5 10. Rd1 Re8 11. Nd2 e5) 4... Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 (7. Bxf6 Bxf6 8. Rc1 c6 9. Bd3 Nd7 10. O-O dxc4 11. Bxc4 e5) 7... b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 *
`;

export const FRENCH_PGN = `[Event "Défense française"]
[Orientation "black"]

1. e4 e6 2. d4 (2. d3 d5 3. Nd2 Nf6 4. Ngf3 c5 5. g3 Nc6 6. Bg2 Be7 7. O-O O-O 8. Re1 b5 9. e5 Nd7 10. Nf1 a5) (2. Nf3 d5 3. Nc3 Nf6 4. e5 Nfd7 5. d4 c5 6. dxc5 Nc6 7. Bf4 Bxc5 8. Bd3 f6 9. exf6 Nxf6 10. O-O O-O) 2... d5 3. Nc3 (3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. Be2 (6. Bd3 cxd4 7. cxd4 Bd7 8. O-O Nxd4 9. Nxd4 Qxd4 10. Nc3 a6) (6. a3 c4 7. Nbd2 Na5 8. Rb1 Bd7) 6... cxd4 7. cxd4 Nh6 8. Nc3 Nf5 9. Na4 Qa5+ 10. Bd2 Bb4) (3. Nd2 c5 4. exd5 Qxd5 5. Ngf3 cxd4 6. Bc4 Qd6 7. O-O Nf6 8. Nb3 Nc6 9. Nbxd4 Nxd4 10. Nxd4 a6) (3. exd5 exd5 4. Nf3 Nf6 5. Bd3 Bd6 6. O-O O-O 7. Bg5 Bg4 8. Nbd2 Nbd7 9. c3 c6 10. Qc2 Qc7) 3... Nf6 4. Bg5 (4. e5 Nfd7 5. f4 c5 6. Nf3 Nc6 7. Be3 cxd4 8. Nxd4 Bc5 9. Qd2 O-O 10. O-O-O a6) 4... Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 a6 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O b5 *
`;

export const BUILTIN_OPENINGS: OpeningDef[] = [
  { id: 'english', name: 'Anglaise (système fermé)', color: 'w', forced: [], pgn: ENGLISH_PGN },
  { id: 'g6-system', name: 'Système …c5 / …g6 (Dragon accéléré)', color: 'b', forced: [], pgn: G6_SYSTEM_PGN },
  { id: 'london', name: 'Système de Londres', color: 'w', forced: [], pgn: LONDON_PGN, archived: true },
  { id: 'qgd', name: 'Gambit Dame refusé', color: 'b', forced: ['d4', 'c4'], pgn: QGD_PGN, archived: true },
  { id: 'french', name: 'Défense française', color: 'b', forced: ['e4'], pgn: FRENCH_PGN, archived: true },
];
