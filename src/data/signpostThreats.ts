// Généré par scripts/signpost-threats.ts (npm run signpost-threats) : ne pas modifier à la main.
// Menace de son coup-panneau (position après son coup, trait rendu à l'adversaire), Stockfish profondeur 16,
// 4 demi-coups : mat en 3 au plus, ou gain d'au moins 2 points. Clé : position après son coup (fenKey).
import type { SignpostThreat } from '../lib/signposts';

export const SIGNPOST_THREATS: Record<string, SignpostThreat> = {
 "r1bqkbnr/pp1ppp1p/2N3p1/8/4P3/8/PPP2PPP/RNBQKB1R b KQkq -": {
  "san": "Nxd8",
  "line": [
   "Nxd8",
   "Kxd8",
   "Be3",
   "d6"
  ],
  "mate": null,
  "gain": 6,
  "captured": {
   "type": "q",
   "sq": "d8"
  }
 },
 "r1bqkbnr/p2ppp1p/2p3p1/8/3QP3/8/PPP2PPP/RNB1KB1R b KQkq -": {
  "san": "Qxh8",
  "line": [
   "Qxh8",
   "d5",
   "Be2",
   "Qb6"
  ],
  "mate": null,
  "gain": 5,
  "captured": {
   "type": "r",
   "sq": "h8"
  }
 },
 "r1bqkbnr/pp1ppp1p/2n3p1/2p5/2B1P3/2N2Q2/PPPP1PPP/R1B1K1NR b KQkq -": {
  "san": "Qxf7#",
  "line": [
   "Qxf7#"
  ],
  "mate": 1,
  "gain": 1,
  "captured": {
   "type": "p",
   "sq": "f7"
  }
 },
 "rnbqkbnr/pp1ppppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq -": {
  "san": "cxd4",
  "line": [
   "cxd4",
   "d5",
   "exd5",
   "Nf6"
  ],
  "mate": null,
  "gain": 2,
  "captured": {
   "type": "p",
   "sq": "d4"
  }
 },
 "r1bqkbnr/pp1ppppp/2n5/2p5/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq -": {
  "san": "Qxf7#",
  "line": [
   "Qxf7#"
  ],
  "mate": 1,
  "gain": 1,
  "captured": {
   "type": "p",
   "sq": "f7"
  }
 },
 "r1bqkbnr/pp1ppppp/2n5/2p4Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq -": {
  "san": "Qxf7#",
  "line": [
   "Qxf7#"
  ],
  "mate": 1,
  "gain": 1,
  "captured": {
   "type": "p",
   "sq": "f7"
  }
 },
 "rn1qkbnr/ppp1pppp/8/3p1b2/3P4/3BP3/PPP2PPP/RNBQK1NR b KQkq -": {
  "san": "Bxf5",
  "line": [
   "Bxf5",
   "e6",
   "Bd3",
   "Nc6"
  ],
  "mate": null,
  "gain": 3,
  "captured": {
   "type": "b",
   "sq": "f5"
  }
 }
};
