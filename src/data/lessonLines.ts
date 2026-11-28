// Généré par scripts/lesson-lines.ts (npm run lesson-lines) : ne pas modifier à la main.
// Lignes du répertoire actif qui n'avaient pas d'explication, rangées par carrefour ; un « pourquoi » par coup
// (src/lib/moveWhy.ts, ou l'explication déjà écrite pour la même position) et une phrase de plan (src/data/linePlans.ts).
import type { LessonExtra } from './openingLessons';

export const GENERATED_EXTRAS: Record<string, LessonExtra[]> = {
 "english": [
  {
   "id": "cx-english-1",
   "title": "Carrefour après 1.c4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.e4",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (6…Nge7, 6…f5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "6…f5",
     "start": [
      "c4",
      "e5",
      "Nc3",
      "Nc6",
      "g3",
      "g6",
      "Bg2",
      "Bg7",
      "d3",
      "d6",
      "e4"
     ],
     "moves": [
      {
       "san": "f5",
       "why": "Le pion f5 prend de l’espace au centre et surveille e4."
      },
      {
       "san": "Nge2",
       "why": "Ton cavalier se développe en e2 et surveille d4."
      },
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "exf5",
       "why": "Ton pion prend son pion f5 : la colonne e s’ouvre pour tes tours."
      },
      {
       "san": "Bxf5",
       "why": "Son fou reprend en f5 : le matériel reste égal."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite."
      },
      {
       "san": "Qd7",
       "why": "Sa dame se développe en d7."
      }
     ],
     "plan": "Sa dame et son fou visent ton pion h3 : protège-le par Kh2, puis Be3 et Qd2, et un cavalier viendra en d5 ou e4."
    }
   ]
  },
  {
   "id": "cx-english-2",
   "title": "Carrefour après 1.c4 e5 2.Nc3 Nc6 3.g3",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3…g6, 3…Nf6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "3…Nf6",
     "start": [
      "c4",
      "e5",
      "Nc3",
      "Nc6",
      "g3"
     ],
     "moves": [
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Bg2",
       "why": "Ton fou se développe en g2 et vise son cavalier c6."
      },
      {
       "san": "Bc5",
       "why": "Son fou se développe en c5 et surveille d4."
      },
      {
       "san": "e3",
       "why": "Le pion e3 surveille d4, au centre."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Nge2",
       "why": "Ton cavalier se développe en e2 et surveille d4."
      },
      {
       "san": "d6",
       "why": "Le pion d6 soutient son fou c5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "a6",
       "why": "Le pion a6 contrôle b5 : ni ton fou ni ton cavalier ne pourront s’y installer."
      },
      {
       "san": "d4",
       "why": "Le pion d4 chasse son fou c5."
      },
      {
       "san": "Ba7",
       "why": "Son fou, attaqué par ton pion, s’écarte en a7 ; il surveille aussi d4."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite."
      },
      {
       "san": "Re8",
       "why": "Sa tour vient en e8 et soutient son pion e5."
      }
     ],
     "plan": "Ensuite dxe5 pour ouvrir la colonne d, puis b3 et Bb2 : tes deux fous visent le centre et l’aile dame."
    }
   ]
  },
  {
   "id": "cx-english-3",
   "title": "Carrefour après 1.c4 e5 2.Nc3",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (2…Nc6, 2…Nf6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "2…Nf6",
     "start": [
      "c4",
      "e5",
      "Nc3"
     ],
     "moves": [
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "g3",
       "why": "Le pion g3 prépare le fianchetto de ton fou en g2."
      },
      {
       "san": "d5",
       "why": "Le pion d5 attaque ton pion c4."
      },
      {
       "san": "cxd5",
       "why": "Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "Nxd5",
       "why": "Son cavalier reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Bg2",
       "why": "Ton fou se développe en g2 et vise son cavalier d5."
      },
      {
       "san": "Nb6",
       "why": "Son cavalier, attaqué par ton fou, s’écarte en b6 ; il surveille aussi d5."
      },
      {
       "san": "d3",
       "why": "Le pion d3 ouvre la diagonale de ton fou c1."
      },
      {
       "san": "Be7",
       "why": "Son fou se développe en e7."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier va en f3 et attaque son pion e5."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier va en c6 et protège son pion e5, attaqué par ton cavalier ; il surveille aussi d4."
      },
      {
       "san": "Be3",
       "why": "Ton fou se développe en e3 et vise son cavalier b6."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "a3",
       "why": "Le pion a3 contrôle b4 : ni son fou ni son cavalier ne pourront s’y installer."
      },
      {
       "san": "Be6",
       "why": "Son fou se développe en e6 et surveille d5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "h6",
       "why": "Le pion h6 contrôle g5 : ni ton fou ni ton cavalier ne pourront s’y installer, et son roi a une case de fuite."
      },
      {
       "san": "Rc1",
       "why": "Ta tour vient sur la colonne c, semi-ouverte."
      }
     ],
     "plan": "Ta tour c1 et ton fou g2 pèsent sur l’aile dame : continue avec b4 puis b5 pour chasser son cavalier c6 et attaquer c7."
    }
   ]
  },
  {
   "id": "cx-english-4",
   "title": "Carrefour après 1.c4 e5 2.Nc3 Nf6 3.g3",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3…d5, 3…Bb4) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "3…Bb4",
     "start": [
      "c4",
      "e5",
      "Nc3",
      "Nf6",
      "g3"
     ],
     "moves": [
      {
       "san": "Bb4",
       "why": "Son fou se développe en b4 et vise ton cavalier c3."
      },
      {
       "san": "Bg2",
       "why": "Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "e4",
       "why": "Le pion e4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "Bxc3",
       "why": "Son fou prend ton cavalier c3."
      },
      {
       "san": "bxc3",
       "why": "Ton pion reprend en c3 : le matériel reste égal."
      },
      {
       "san": "c6",
       "why": "Le pion c6 prépare …d5 : il pourra occuper tout le centre."
      },
      {
       "san": "Ne2",
       "why": "Ton cavalier se développe en e2 et surveille d4."
      },
      {
       "san": "d5",
       "why": "Le pion d5 attaque ton pion c4."
      },
      {
       "san": "cxd5",
       "why": "Ton pion prend son pion d5, qui attaquait ton pion c4."
      },
      {
       "san": "cxd5",
       "why": "Son pion reprend en d5 : le matériel reste égal."
      },
      {
       "san": "exd5",
       "why": "Ton pion reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Nxd5",
       "why": "Son cavalier reprend en d5 : le matériel reste égal."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      }
     ],
     "plan": "Ta paire de fous compense tes pions abîmés de l’aile dame : prépare d4 (avec h3 et Re1), puis active ton fou c1."
    }
   ]
  },
  {
   "id": "cx-english-5",
   "title": "Carrefour après 1.c4",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (1…e5, 1…c5, 1…Nf6, 1…e6, 1…d5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "1…c5",
     "start": [
      "c4"
     ],
     "moves": [
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "Nc3",
       "why": "Ton cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "g3",
       "why": "Le pion g3 prépare le fianchetto de ton fou en g2."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de son fou en g7."
      },
      {
       "san": "Bg2",
       "why": "Ton fou se développe en g2 et vise son cavalier c6."
      },
      {
       "san": "Bg7",
       "why": "Son fou se développe en g7 et vise ton cavalier c3."
      },
      {
       "san": "d3",
       "why": "Le pion d3 soutient ton pion c4."
      },
      {
       "san": "d6",
       "why": "Le pion d6 soutient son pion c5."
      },
      {
       "san": "e4",
       "why": "Le pion e4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "e5",
       "why": "Le pion e5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "Nge2",
       "why": "Ton cavalier se développe en e2 et surveille d4."
      },
      {
       "san": "Nge7",
       "why": "Son cavalier se développe en e7 et surveille d5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Be3",
       "why": "Ton fou se développe en e3 et surveille d4."
      },
      {
       "san": "Nd4",
       "why": "Son cavalier s’installe en d4, un [[avant-poste]] protégé par son pion."
      },
      {
       "san": "Qd2",
       "why": "Ta dame sort en d2 : avec ton fou e3, Bh6 échangera son fou g7, le meilleur défenseur de son roi."
      },
      {
       "san": "Be6",
       "why": "Son fou se développe en e6 et surveille d5."
      }
     ],
     "plan": "Plan : f4 pour ouvrir la colonne f ; si …exf4, Nxf4 chasse son fou e6 et ta tour f1 entre dans le jeu."
    },
    {
     "name": "1…Nf6",
     "start": [
      "c4"
     ],
     "moves": [
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Nc3",
       "why": "Ton cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de son fou en g7."
      },
      {
       "san": "g3",
       "why": "Le pion g3 prépare le fianchetto de ton fou en g2."
      },
      {
       "san": "Bg7",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Bg2",
       "why": "Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "e4",
       "why": "Le pion e4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de son fou c8."
      },
      {
       "san": "Nge2",
       "why": "Ton cavalier se développe en e2 et surveille d4."
      },
      {
       "san": "e5",
       "why": "Le pion e5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "c6",
       "why": "Le pion c6 surveille d5, au centre."
      },
      {
       "san": "d3",
       "why": "Le pion d3 soutient ton pion c4."
      },
      {
       "san": "a6",
       "why": "Le pion a6 contrôle b5 : ni ton fou ni ton cavalier ne pourront s’y installer."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite."
      },
      {
       "san": "b5",
       "why": "Le pion b5 ouvre la diagonale de son fou c8."
      },
      {
       "san": "Be3",
       "why": "Ton fou se développe en e3 et surveille d4."
      },
      {
       "san": "Nbd7",
       "why": "Son cavalier se développe en d7 et surveille e5."
      }
     ],
     "plan": "Plan : a3 et b3, puis Rc1 : tu protèges c4 et tu ouvres l’aile dame, où ses pions …a6 et …b5 sont avancés."
    },
    {
     "name": "1…e6",
     "start": [
      "c4"
     ],
     "moves": [
      {
       "san": "e6",
       "why": "Le pion e6 ouvre la diagonale de son fou f8."
      },
      {
       "san": "Nc3",
       "why": "Ton cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "d5",
       "why": "Le pion d5 attaque ton pion c4."
      },
      {
       "san": "cxd5",
       "why": "Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "exd5",
       "why": "Son pion reprend en d5 : le matériel reste égal."
      },
      {
       "san": "d4",
       "why": "Le pion d4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Bg5",
       "why": "Ton fou cloue son cavalier f6 sur sa dame."
      },
      {
       "san": "Be7",
       "why": "Son fou va en e7 : son cavalier f6 n’est plus cloué."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient ton pion d4."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Bd3",
       "why": "Ton fou se développe en d3 et surveille e4."
      },
      {
       "san": "Nbd7",
       "why": "Son cavalier se développe en d7 et surveille e5."
      },
      {
       "san": "Nge2",
       "why": "Ton cavalier se développe en e2 et surveille d4."
      },
      {
       "san": "Re8",
       "why": "Sa tour vient sur la colonne e, semi-ouverte."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Nf8",
       "why": "Son cavalier se replace en f8."
      },
      {
       "san": "Qc2",
       "why": "Ta dame se développe en c2."
      },
      {
       "san": "c6",
       "why": "Le pion c6 soutient son pion d5."
      }
     ],
     "plan": "Plan typique de cette structure : f3 puis e4 pour prendre tout le centre ; ton fou d3 et ta dame c2 visent alors son roi."
    },
    {
     "name": "1…d5",
     "start": [
      "c4"
     ],
     "moves": [
      {
       "san": "d5",
       "why": "Le pion d5 attaque ton pion c4."
      },
      {
       "san": "cxd5",
       "why": "Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "Qxd5",
       "why": "Sa dame reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Nc3",
       "why": "Ton cavalier va en c3 et attaque sa dame d5."
      },
      {
       "san": "Qd8",
       "why": "Sa dame, attaquée par ton cavalier, s’écarte en d8 ; elle surveille aussi d4 et d5."
      },
      {
       "san": "d4",
       "why": "Le pion d4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de son fou en g7."
      },
      {
       "san": "e4",
       "why": "Le pion e4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "Bg7",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Be2",
       "why": "Ton fou se développe en e2."
      },
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "d5",
       "why": "Le pion d5 occupe le centre."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      }
     ],
     "plan": "Tes pions d5 et e4 forment un grand centre : protège-le (Re1, Bf4, Qd2) et pousse e5 au bon moment pour chasser son cavalier f6."
    }
   ]
  },
  {
   "id": "cx-english-6",
   "title": "Carrefour après 1.c4 c5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (5…d6, 5…Nf6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "5…Nf6",
     "start": [
      "c4",
      "c5",
      "Nc3",
      "Nc6",
      "g3",
      "g6",
      "Bg2",
      "Bg7",
      "d3"
     ],
     "moves": [
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "e4",
       "why": "Le pion e4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Nge2",
       "why": "Ton cavalier se développe en e2 et surveille d4."
      },
      {
       "san": "d6",
       "why": "Le pion d6 soutient son pion c5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "a6",
       "why": "Le pion a6 contrôle b5 : ni ton fou ni ton cavalier ne pourront s’y installer."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite."
      },
      {
       "san": "Rb8",
       "why": "Sa tour vient en b8 et soutient son pion b7."
      },
      {
       "san": "a4",
       "why": "Le pion a4 gagne de l’espace à l’aile dame."
      },
      {
       "san": "Ne8",
       "why": "Son cavalier se replace en e8."
      }
     ],
     "plan": "Ensuite Be3 et Qd2, puis Nd5 : ton pion a4 freine …b5 et ton cavalier en d5 devient ta meilleure pièce."
    }
   ]
  },
  {
   "id": "cx-english-7",
   "title": "Carrefour après 1.c4 c5 2.Nc3",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (2…Nc6, 2…Nf6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "2…Nf6",
     "start": [
      "c4",
      "c5",
      "Nc3"
     ],
     "moves": [
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "g3",
       "why": "Le pion g3 prépare le fianchetto de ton fou en g2."
      },
      {
       "san": "d5",
       "why": "Le pion d5 attaque ton pion c4."
      },
      {
       "san": "cxd5",
       "why": "Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "Nxd5",
       "why": "Son cavalier reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Bg2",
       "why": "Ton fou se développe en g2 et vise son cavalier d5."
      },
      {
       "san": "Nc7",
       "why": "Son cavalier, attaqué par ton fou, s’écarte en c7 ; il surveille aussi d5."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "e5",
       "why": "Le pion e5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "d3",
       "why": "Le pion d3 ouvre la diagonale de ton fou c1."
      },
      {
       "san": "Be7",
       "why": "Son fou se développe en e7."
      },
      {
       "san": "Nd2",
       "why": "Ton cavalier va en d2 et vise e4."
      },
      {
       "san": "Bd7",
       "why": "Son fou se développe en d7."
      },
      {
       "san": "Nc4",
       "why": "Ton cavalier va en c4 et vise e5."
      },
      {
       "san": "f6",
       "why": "Le pion f6 soutient son pion e5."
      }
     ],
     "plan": "Plan : f4 pour attaquer son pion e5 ; si …b5, ton cavalier c4 passe en e3, puis en d5 ou f5."
    }
   ]
  },
  {
   "id": "cx-english-8",
   "title": "Carrefour après 1.c4 Nf6 2.Nc3",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (2…g6, 2…e6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "2…e6",
     "start": [
      "c4",
      "Nf6",
      "Nc3"
     ],
     "moves": [
      {
       "san": "e6",
       "why": "Le pion e6 ouvre la diagonale de son fou f8."
      },
      {
       "san": "d4",
       "why": "Le pion d4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "Bb4",
       "why": "Son fou cloue ton cavalier c3 sur ton roi."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient ton pion d4."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Bd3",
       "why": "Ton fou se développe en d3 et surveille e4."
      },
      {
       "san": "d5",
       "why": "Le pion d5 prend de l’espace au centre et surveille e4."
      },
      {
       "san": "cxd5",
       "why": "Ton pion prend son pion d5 : la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "exd5",
       "why": "Son pion reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Ne2",
       "why": "Ton cavalier se développe en e2 et surveille d4."
      },
      {
       "san": "Re8",
       "why": "Sa tour vient sur la colonne e, semi-ouverte."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Bd6",
       "why": "Son fou va en d6 et vise e5."
      },
      {
       "san": "a3",
       "why": "Le pion a3 contrôle b4 : ni son fou ni son cavalier ne pourront s’y installer."
      },
      {
       "san": "c6",
       "why": "Le pion c6 soutient son pion d5."
      },
      {
       "san": "Qc2",
       "why": "Ta dame se développe en c2."
      },
      {
       "san": "Nbd7",
       "why": "Son cavalier se développe en d7 et surveille e5."
      }
     ],
     "plan": "Comme dans la ligne 1…e6 : f3 puis e4 pour prendre le centre, avec ton fou d3 tourné vers son roi."
    }
   ]
  },
  {
   "id": "cx-english-9",
   "title": "Carrefour après 1.c4 d5 2.cxd5 Qxd5 3.Nc3 Qd8 4.d4 Nf6 5.Nf3",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (5…g6, 5…e6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "5…e6",
     "start": [
      "c4",
      "d5",
      "cxd5",
      "Qxd5",
      "Nc3",
      "Qd8",
      "d4",
      "Nf6",
      "Nf3"
     ],
     "moves": [
      {
       "san": "e6",
       "why": "Le pion e6 ouvre la diagonale de son fou f8."
      },
      {
       "san": "e4",
       "why": "Le pion e4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "Be7",
       "why": "Son fou se développe en e7."
      },
      {
       "san": "Bd3",
       "why": "Ton fou se développe en d3 et surveille e4."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "dxc5",
       "why": "Ton pion prend son pion c5, qui attaquait ton pion d4, et la colonne d s’ouvre pour tes tours."
      },
      {
       "san": "Nfd7",
       "why": "Son cavalier va en d7 et attaque ton pion c5."
      },
      {
       "san": "Qe2",
       "why": "Ta dame sort en e2 et surveille e4."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "Rd1",
       "why": "Ta tour vient sur la colonne d, ouverte."
      }
     ],
     "plan": "Ta tour d1 sur la colonne ouverte et ton pion e4 te donnent l’avantage : sors ton fou c1 (Be3), puis double tes tours sur la colonne d."
    }
   ]
  },
  {
   "id": "cx-english-10",
   "title": "Carrefour après 1.c4 d5 2.cxd5 Qxd5 3.Nc3",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3…Qd8, 3…Qa5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "3…Qa5",
     "start": [
      "c4",
      "d5",
      "cxd5",
      "Qxd5",
      "Nc3"
     ],
     "moves": [
      {
       "san": "Qa5",
       "why": "Sa dame, attaquée par ton cavalier, s’écarte en a5 ; elle surveille aussi d5 et e5."
      },
      {
       "san": "d4",
       "why": "Le pion d4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "c6",
       "why": "Le pion c6 surveille d5, au centre."
      },
      {
       "san": "Bd2",
       "why": "Ton fou va en d2 : ton cavalier c3 n’est plus cloué."
      },
      {
       "san": "Qb6",
       "why": "Sa dame va en b6 et attaque ton pion b2."
      },
      {
       "san": "e4",
       "why": "Le pion e4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "Bg4",
       "why": "Son fou cloue ton cavalier f3 sur ta dame."
      },
      {
       "san": "Qa4",
       "why": "Ta dame cloue son pion c6 sur son roi."
      },
      {
       "san": "Bxf3",
       "why": "Son fou prend ton cavalier f3."
      },
      {
       "san": "gxf3",
       "why": "Ton pion reprend en f3 : le matériel reste égal."
      }
     ],
     "plan": "Ta paire de fous et ton grand centre valent bien les pions doublés f : fais le grand roque, puis ta tour g1 attaque sur la colonne g ouverte."
    }
   ]
  },
  {
   "id": "cx-english-11",
   "title": "Carrefour après 1.c4 d5 2.cxd5",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (2…Qxd5, 2…Nf6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "2…Nf6",
     "start": [
      "c4",
      "d5",
      "cxd5"
     ],
     "moves": [
      {
       "san": "Nf6",
       "why": "Son cavalier va en f6 et attaque ton pion d5."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Nxd5",
       "why": "Son cavalier prend ton pion d5."
      },
      {
       "san": "d4",
       "why": "Le pion d4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de son fou en g7."
      },
      {
       "san": "e4",
       "why": "Le pion e4 chasse son cavalier d5."
      },
      {
       "san": "Nb6",
       "why": "Son cavalier, attaqué par ton pion, s’écarte en b6 ; il surveille aussi d5."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer."
      },
      {
       "san": "Bg7",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Nc3",
       "why": "Ton cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Be3",
       "why": "Ton fou se développe en e3 et surveille d4."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "Qd2",
       "why": "Ta dame sort en d2 : avec ton fou e3, Bh6 échangera son fou g7, le meilleur défenseur de son roi."
      },
      {
       "san": "f5",
       "why": "Le pion f5 prend de l’espace au centre et surveille e4."
      }
     ],
     "plan": "Pousse e5 pour chasser ses pièces du centre ; ta tour viendra en d1 soutenir d4, et Bh6 échangera son fou g7."
    }
   ]
  }
 ],
 "london": [
  {
   "id": "cx-london-1",
   "title": "Carrefour après 1.d4",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (1…d5, 1…Nf6, 1…e6, 1…c5, 1…g6, 1…f5, 1…e5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "1…e6",
     "start": [
      "d4"
     ],
     "moves": [
      {
       "san": "e6",
       "why": "Le pion e6 ouvre la diagonale de son fou f8."
      },
      {
       "san": "Bf4",
       "why": "Ton fou sort tout de suite, comme toujours dans le Londres."
      },
      {
       "san": "c5",
       "why": "Les Noirs attaquent ton pion d4."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient d4 et ouvre la diagonale de ton fou f1."
      },
      {
       "san": "d5",
       "why": "Les Noirs prennent leur part du centre."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe et protège d4."
      },
      {
       "san": "Nf6",
       "why": "Le cavalier noir se développe."
      },
      {
       "san": "c3",
       "why": "Le pion c3 protège d4 une deuxième fois : ta chaîne c3-d4-e3 est en place."
      },
      {
       "san": "Nc6",
       "why": "Le cavalier noir ajoute une pression sur d4."
      },
      {
       "san": "Nbd2",
       "why": "Ton cavalier se développe en d2, car le pion occupe c3."
      },
      {
       "san": "Nh5",
       "why": "Le cavalier noir attaque ton fou f4 pour l’échanger."
      },
      {
       "san": "Bg3",
       "why": "Ton fou recule en g3, comme dans la leçon."
      },
      {
       "san": "Nxg3",
       "why": "Les Noirs échangent le cavalier contre ton fou."
      },
      {
       "san": "hxg3",
       "why": "Tu reprends avec le pion h : ta tour h1 gagne la colonne h."
      },
      {
       "san": "Qb6",
       "why": "Sa dame va en b6 et attaque ton pion b2."
      },
      {
       "san": "Qc2",
       "why": "Ta dame va en c2 et protège ton pion b2, attaqué par sa dame ; elle surveille aussi e4."
      },
      {
       "san": "g6",
       "why": "Le pion g6 bouche la diagonale de ta dame : son pion h7 n’est plus attaqué ; il prépare aussi le fianchetto de son fou en g7."
      },
      {
       "san": "Bd3",
       "why": "Ton fou se développe en d3 et surveille e4."
      },
      {
       "san": "Bd7",
       "why": "Son fou se développe en d7."
      }
     ],
     "plan": "Plan : Rd1 et Qb1 protègent ton centre et le pion b2, puis tu roques ; ensuite e4 ouvre le jeu pour ton fou d3."
    },
    {
     "name": "1…c5 : 2.d5",
     "start": [
      "d4"
     ],
     "moves": [
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "d5",
       "why": "Pas de Londres ici : avec c3 ou Bf4, tu perdrais plus d’un demi-pion (Stockfish). Ton pion d5 prend de l’espace."
      },
      {
       "san": "Nf6",
       "why": "Le cavalier noir se développe et attaque ton pion d5."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe."
      },
      {
       "san": "e6",
       "why": "Les Noirs attaquent ton pion d5 avec le pion e."
      },
      {
       "san": "Nc3",
       "why": "Ton second cavalier protège d5."
      },
      {
       "san": "exd5",
       "why": "Les Noirs prennent."
      },
      {
       "san": "Nxd5",
       "why": "Tu reprends avec le cavalier, bien placé au centre."
      },
      {
       "san": "Nxd5",
       "why": "Les Noirs échangent les cavaliers."
      },
      {
       "san": "Qxd5",
       "why": "Ta dame reprend au centre, d’où elle attaque c5 et vise f7."
      },
      {
       "san": "Nc6",
       "why": "Le cavalier noir se développe."
      },
      {
       "san": "e4",
       "why": "Ton pion e4 prend le centre et ouvre la diagonale de ton fou f1."
      },
      {
       "san": "d6",
       "why": "Le pion d6 soutient son pion c5."
      },
      {
       "san": "Ng5",
       "why": "Ton cavalier va en g5 et vise e4."
      },
      {
       "san": "Qe7",
       "why": "Sa dame va en e7 et protège f7 contre la menace de mat ; elle surveille aussi e4 et e5."
      },
      {
       "san": "Bb5",
       "why": "Ton fou cloue son cavalier c6 sur son roi."
      },
      {
       "san": "Bd7",
       "why": "Son fou va en d7 et protège son cavalier c6, attaqué par ton fou."
      },
      {
       "san": "Bc4",
       "why": "Ton fou va en c4 et vise d5."
      },
      {
       "san": "Nd8",
       "why": "Son cavalier se met à l’abri en d8."
      }
     ],
     "plan": "Roque, et replace ton cavalier g5 s’il est chassé (Nh3, puis f4) : ta dame d5 et ton fou c4 visent f7, et f4 ouvrira la colonne f."
    },
    {
     "name": "1…g6 : le cavalier d’abord",
     "start": [
      "d4"
     ],
     "moves": [
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de son fou en g7."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier sort d’abord, puis ton fou viendra en f4 : c’est toujours le placement du Londres."
      },
      {
       "san": "Nf6",
       "why": "Le cavalier noir se développe."
      },
      {
       "san": "Bf4",
       "why": "Ton fou sort en f4, avant e3."
      },
      {
       "san": "Bg7",
       "why": "Les Noirs font le [[fianchetto]] de leur fou."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient d4."
      },
      {
       "san": "O-O",
       "why": "Les Noirs roquent."
      },
      {
       "san": "Be2",
       "why": "C’est la position de la ligne 1…Nf6 2.Bf4 g6 : continue avec h3, c3 et le roque."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de son fou c8."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer."
      },
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "c3",
       "why": "Le pion c3 soutient ton pion d4."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "b6",
       "why": "Le pion b6 prépare le fianchetto de son fou en b7."
      },
      {
       "san": "a4",
       "why": "Le pion a4 gagne de l’espace à l’aile dame."
      },
      {
       "san": "Bb7",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Nbd2",
       "why": "Ton cavalier se développe en d2 et surveille e4."
      }
     ],
     "plan": "Garde ton fou f4 (recule en h2 s’il est attaqué par …e5 ou …Nh5) et pousse a5 pour ouvrir la colonne a : ta chaîne c3-d4-e3 ne craint rien."
    },
    {
     "name": "1…f5 (Hollandaise)",
     "start": [
      "d4"
     ],
     "moves": [
      {
       "san": "f5",
       "why": "Le pion f5 prend de l’espace au centre et surveille e4."
      },
      {
       "san": "Bf4",
       "why": "Contre la Hollandaise aussi, ton fou sort tout de suite."
      },
      {
       "san": "d6",
       "why": "Les Noirs préparent …e5 pour chasser ton fou."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient d4."
      },
      {
       "san": "Nf6",
       "why": "Le cavalier noir se développe."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier surveille e5 : …e5 devient plus difficile."
      },
      {
       "san": "g6",
       "why": "Les Noirs préparent le fianchetto de leur fou f8."
      },
      {
       "san": "h3",
       "why": "Le pion h3 empêche …Ng4 et donne une case de retraite à ton fou (h2)."
      },
      {
       "san": "Nc6",
       "why": "Le cavalier noir se développe."
      },
      {
       "san": "Bd3",
       "why": "Ton fou vise le pion f5 et le roi noir."
      },
      {
       "san": "Bg7",
       "why": "Le fou noir va en g7."
      },
      {
       "san": "O-O",
       "why": "Tu roques : ton roi est à l’abri."
      },
      {
       "san": "O-O",
       "why": "Les Noirs roquent aussi."
      },
      {
       "san": "Bg3",
       "why": "Ton fou va en g3 et vise e5."
      },
      {
       "san": "Qe8",
       "why": "Sa dame se développe en e8."
      },
      {
       "san": "Qe2",
       "why": "Ta dame se développe en e2."
      },
      {
       "san": "Kh8",
       "why": "Son roi va en h8, un peu plus à l’abri."
      },
      {
       "san": "Nc3",
       "why": "Ton cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "a6",
       "why": "Le pion a6 contrôle b5 : ni ton fou ni ton cavalier ne pourront s’y installer."
      }
     ],
     "plan": "Plan : e4 pour ouvrir le centre contre son pion f5 ; si son cavalier attaque ton fou g3 (…Nh5), recule en h2 et garde ton pion d4 protégé."
    },
    {
     "name": "1…e5 : le gambit Englund et son piège",
     "start": [
      "d4"
     ],
     "moves": [
      {
       "san": "e5",
       "why": "Le pion e5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "dxe5",
       "why": "Tu prends le pion offert : c’est le [[gambit]] Englund."
      },
      {
       "san": "Nc6",
       "why": "Les Noirs attaquent ton pion e5."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier protège e5."
      },
      {
       "san": "Qe7",
       "why": "La dame noire attaque e5 et prépare …Qb4+ contre ton pion b2."
      },
      {
       "san": "Bg5",
       "why": "Piège à éviter : Bf4 permet …Qb4+ puis …Qxb2, et Bc3 perd sur …Bb4 et …Qc1 mat. Ton fou va en g5 et attaque la dame."
      },
      {
       "san": "Qb4+",
       "why": "La dame noire fait échec et vise ton pion b2."
      },
      {
       "san": "Nc3",
       "why": "Ton cavalier pare l’échec en se développant ; si …Qxb2, Bd2 puis Rb1 chasse la dame (Stockfish : gros avantage blanc)."
      },
      {
       "san": "Qa5",
       "why": "La dame noire recule : tu as un pion de plus et tes pièces sont sorties."
      },
      {
       "san": "Qd5",
       "why": "Ta dame bouche la rangée de sa dame : ton pion e5 n’est plus attaqué ; elle surveille aussi d4 et e4."
      },
      {
       "san": "Bc5",
       "why": "Son fou se développe en c5 et surveille d4."
      },
      {
       "san": "a3",
       "why": "Le pion a3 contrôle b4 : ni son fou ni son cavalier ne pourront s’y installer."
      },
      {
       "san": "h6",
       "why": "Le pion h6 chasse ton fou g5."
      },
      {
       "san": "Bh4",
       "why": "Ton fou, attaqué par son pion, s’écarte en h4."
      },
      {
       "san": "g5",
       "why": "Le pion g5 chasse ton fou h4."
      },
      {
       "san": "Bg3",
       "why": "Ton fou, attaqué par son pion, s’écarte en g3 ; il surveille aussi e5."
      },
      {
       "san": "g4",
       "why": "Le pion g4 chasse ton cavalier f3."
      },
      {
       "san": "Nd2",
       "why": "Ton cavalier, attaqué par son pion, s’écarte en d2 ; il surveille aussi e4."
      },
      {
       "san": "Nge7",
       "why": "Son cavalier va en e7 et attaque ta dame d5."
      }
     ],
     "plan": "Son cavalier e7 attaque ta dame : Qc4 la met à l’abri ; tu as un pion de plus et ses pions g sont trop avancés, développe-toi (e3, Be2) puis roque."
    },
    {
     "name": "1…Nf6",
     "start": [
      "d4"
     ],
     "moves": [
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Bf4",
       "why": "Ton fou se développe en f4 et surveille e5."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de son fou en g7."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient ton pion d4."
      },
      {
       "san": "Bg7",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "O-O",
       "why": "Les Noirs roquent."
      },
      {
       "san": "Be2",
       "why": "C’est la position de la ligne 1…Nf6 2.Bf4 g6 : continue avec h3, c3 et le roque."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de son fou c8."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer."
      },
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "c3",
       "why": "Le pion c3 soutient ton pion d4."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "b6",
       "why": "Le pion b6 prépare le fianchetto de son fou en b7."
      },
      {
       "san": "a4",
       "why": "Le pion a4 gagne de l’espace à l’aile dame."
      },
      {
       "san": "Bb7",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Nbd2",
       "why": "Ton cavalier se développe en d2 et surveille e4."
      }
     ],
     "plan": "Garde ton fou f4 (recule en h2 s’il est attaqué par …e5 ou …Nh5) et pousse a5 pour ouvrir la colonne a : ta chaîne c3-d4-e3 ne craint rien."
    }
   ]
  },
  {
   "id": "cx-london-2",
   "title": "Carrefour après 1.d4 d5 2.Bf4 Nf6 3.e3",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3…c5, 3…e6, 3…g6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "3…e6",
     "start": [
      "d4",
      "d5",
      "Bf4",
      "Nf6",
      "e3"
     ],
     "moves": [
      {
       "san": "e6",
       "why": "Le pion e6 soutient son pion d5."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "c3",
       "why": "Le pion c3 protège d4 une deuxième fois : ta chaîne c3-d4-e3 est en place."
      },
      {
       "san": "Nc6",
       "why": "Le cavalier noir ajoute une pression sur d4."
      },
      {
       "san": "Nbd2",
       "why": "Ton cavalier se développe en d2, car le pion occupe c3."
      },
      {
       "san": "Bd6",
       "why": "Les Noirs proposent l’échange des fous de cases noires."
      },
      {
       "san": "Bg3",
       "why": "Le fou recule sans s’échanger lui-même. Si les Noirs prennent (…Bxg3), tu reprends avec le pion h (hxg3) et ta tour h1 gagne la colonne h."
      },
      {
       "san": "O-O",
       "why": "Les Noirs roquent : leur roi est à l’abri."
      },
      {
       "san": "Bd3",
       "why": "Le fou f1 se place sur la diagonale qui vise le roi noir en h7."
      },
      {
       "san": "b6",
       "why": "Les Noirs préparent le [[fianchetto]] de leur fou c8 en b7."
      },
      {
       "san": "Ne5",
       "why": "Le cavalier saute en e5, un [[avant-poste]] au centre, d’où il gêne les Noirs et prépare l’attaque."
      },
      {
       "san": "Bb7",
       "why": "Le fou noir vise la grande diagonale, vers e4."
      },
      {
       "san": "f4",
       "why": "Le pion f4 soutient le cavalier e5 et prépare une attaque sur l’aile roi."
      }
     ],
     "plan": "C’est le plan de la leçon : cavalier e5 soutenu par f4, puis ta dame sur l’aile roi ; si son cavalier vient en f5 attaquer ton fou g3, recule-le en f2."
    },
    {
     "name": "3…g6",
     "start": [
      "d4",
      "d5",
      "Bf4",
      "Nf6",
      "e3"
     ],
     "moves": [
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de son fou en g7."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Bg7",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Be2",
       "why": "Ton fou se développe en e2."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "c3",
       "why": "Le pion c3 soutient ton pion d4."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite."
      },
      {
       "san": "b6",
       "why": "Le pion b6 prépare le fianchetto de son fou en b7."
      },
      {
       "san": "Nbd2",
       "why": "Ton cavalier se développe en d2 et surveille e4."
      },
      {
       "san": "Bb7",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Ne5",
       "why": "Ton cavalier s’installe en e5, un [[avant-poste]] protégé par ton pion."
      }
     ],
     "plan": "Ton cavalier e5 bloque son fou b7 : s’il l’échange (…Nxe5), reprends avec le fou (Bxe5), puis f4 et ta dame sur l’aile roi pour l’attaque."
    }
   ]
  },
  {
   "id": "cx-london-3",
   "title": "Carrefour après 1.d4 d5 2.Bf4",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (2…Nf6, 2…c5, 2…Bf5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "2…c5",
     "start": [
      "d4",
      "d5",
      "Bf4"
     ],
     "moves": [
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient ton pion d4."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Nbd2",
       "why": "Ton cavalier se développe en d2 et surveille e4."
      },
      {
       "san": "e6",
       "why": "Le pion e6 soutient son pion d5."
      },
      {
       "san": "c3",
       "why": "Le pion c3 soutient ton pion d4."
      },
      {
       "san": "Bd6",
       "why": "Les Noirs proposent l’échange des fous de cases noires."
      },
      {
       "san": "Bg3",
       "why": "Le fou recule sans s’échanger lui-même. Si les Noirs prennent (…Bxg3), tu reprends avec le pion h (hxg3) et ta tour h1 gagne la colonne h."
      },
      {
       "san": "O-O",
       "why": "Les Noirs roquent : leur roi est à l’abri."
      },
      {
       "san": "Bd3",
       "why": "Le fou f1 se place sur la diagonale qui vise le roi noir en h7."
      },
      {
       "san": "b6",
       "why": "Les Noirs préparent le [[fianchetto]] de leur fou c8 en b7."
      },
      {
       "san": "Ne5",
       "why": "Le cavalier saute en e5, un [[avant-poste]] au centre, d’où il gêne les Noirs et prépare l’attaque."
      },
      {
       "san": "Bb7",
       "why": "Le fou noir vise la grande diagonale, vers e4."
      },
      {
       "san": "f4",
       "why": "Le pion f4 soutient le cavalier e5 et prépare une attaque sur l’aile roi."
      }
     ],
     "plan": "C’est le plan de la leçon : cavalier e5 soutenu par f4, puis ta dame sur l’aile roi ; si son cavalier vient en f5 attaquer ton fou g3, recule-le en f2."
    },
    {
     "name": "2…Bf5",
     "start": [
      "d4",
      "d5",
      "Bf4"
     ],
     "moves": [
      {
       "san": "Bf5",
       "why": "Son fou se développe en f5 et surveille e4."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient ton pion d4."
      },
      {
       "san": "e6",
       "why": "Le pion e6 soutient son pion d5."
      },
      {
       "san": "Bd3",
       "why": "Ton fou se développe en d3 et surveille e4."
      },
      {
       "san": "Bxd3",
       "why": "Son fou prend ton fou d3."
      },
      {
       "san": "Qxd3",
       "why": "Ta dame reprend en d3 : le matériel reste égal."
      },
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Nf3",
       "why": "Ton cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "c3",
       "why": "Le pion c3 soutient ton pion d4."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "Nbd2",
       "why": "Ton cavalier se développe en d2 et surveille e4."
      },
      {
       "san": "Bd6",
       "why": "Son fou se développe en d6 et surveille e5."
      },
      {
       "san": "Bxd6",
       "why": "Ton fou prend son fou d6."
      },
      {
       "san": "Qxd6",
       "why": "Sa dame reprend en d6 : le matériel reste égal."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      }
     ],
     "plan": "Position calme : tes tours viennent en d1 et c1, et tu prépares e4 (avec Qe2) pour ouvrir le centre ; ton cavalier f3 peut aussi sauter en e5."
    }
   ]
  },
  {
   "id": "cx-london-4",
   "title": "Carrefour après 1.d4 Nf6 2.Bf4",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (2…g6, 2…e6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "2…e6",
     "start": [
      "d4",
      "Nf6",
      "Bf4"
     ],
     "moves": [
      {
       "san": "e6",
       "why": "Le pion e6 ouvre la diagonale de son fou f8."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient ton pion d4."
      },
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "c3",
       "why": "Le pion c3 soutient ton pion d4."
      },
      {
       "san": "Nc6",
       "why": "Son cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "Nd2",
       "why": "Ton cavalier se développe en d2 et surveille e4."
      },
      {
       "san": "d5",
       "why": "Le pion d5 prend de l’espace au centre et surveille e4."
      },
      {
       "san": "Ngf3",
       "why": "Le second cavalier vient en f3, vers le centre, et prépare le [[roque]]."
      },
      {
       "san": "Bd6",
       "why": "Les Noirs proposent l’échange des fous de cases noires."
      },
      {
       "san": "Bg3",
       "why": "Le fou recule sans s’échanger lui-même. Si les Noirs prennent (…Bxg3), tu reprends avec le pion h (hxg3) et ta tour h1 gagne la colonne h."
      },
      {
       "san": "O-O",
       "why": "Les Noirs roquent : leur roi est à l’abri."
      },
      {
       "san": "Bd3",
       "why": "Le fou f1 se place sur la diagonale qui vise le roi noir en h7."
      },
      {
       "san": "b6",
       "why": "Les Noirs préparent le [[fianchetto]] de leur fou c8 en b7."
      },
      {
       "san": "Ne5",
       "why": "Le cavalier saute en e5, un [[avant-poste]] au centre, d’où il gêne les Noirs et prépare l’attaque."
      },
      {
       "san": "Bb7",
       "why": "Le fou noir vise la grande diagonale, vers e4."
      },
      {
       "san": "f4",
       "why": "Le pion f4 soutient le cavalier e5 et prépare une attaque sur l’aile roi."
      }
     ],
     "plan": "C’est le plan de la leçon : cavalier e5 soutenu par f4, puis ta dame sur l’aile roi ; si son cavalier vient en f5 attaquer ton fou g3, recule-le en f2."
    }
   ]
  },
  {
   "id": "cx-london-5",
   "title": "Carrefour après 1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bg5",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (4…Qb4+, 4…Qc5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "4…Qc5",
     "start": [
      "d4",
      "e5",
      "dxe5",
      "Nc6",
      "Nf3",
      "Qe7",
      "Bg5"
     ],
     "moves": [
      {
       "san": "Qc5",
       "why": "Sa dame, attaquée par ton fou, s’écarte en c5 ; elle surveille aussi d4, d5 et e5."
      },
      {
       "san": "Be3",
       "why": "Ton fou va en e3 et contre-attaque sa dame c5 au lieu de défendre ton pion e5."
      },
      {
       "san": "Qe7",
       "why": "Sa dame, attaquée par ton fou, s’écarte en e7 ; elle surveille aussi e5."
      },
      {
       "san": "Nc3",
       "why": "Ton cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "Nxe5",
       "why": "Son cavalier prend ton pion e5."
      },
      {
       "san": "Bf4",
       "why": "Ton fou va en f4 et vise son cavalier e5."
      },
      {
       "san": "Nxf3+",
       "why": "Son cavalier, attaqué par ton fou, prend ton cavalier f3 avec échec."
      },
      {
       "san": "gxf3",
       "why": "Ton pion reprend en f3 : le matériel reste égal."
      },
      {
       "san": "c6",
       "why": "Le pion c6 prépare …d5 : il pourra occuper tout le centre."
      },
      {
       "san": "Qd2",
       "why": "Ta dame sort en d2 et surveille d4 et d5."
      },
      {
       "san": "d5",
       "why": "Le pion d5 prend de l’espace au centre et surveille e4."
      },
      {
       "san": "O-O-O",
       "why": "Grand roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Nf6",
       "why": "Son cavalier se développe en f6 et surveille d5 et e4."
      }
     ],
     "plan": "Grand roque fait et un pion de plus : pousse e4 pour ouvrir le centre contre son roi resté en e8, ta tour d1 est déjà sur la colonne d."
    }
   ]
  }
 ],
 "g6-system": [
  {
   "id": "cx-g6-system-1",
   "title": "Carrefour après 1.e4 c5",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (2.Nf3, 2.Nc3, 2.c3, 2.d4, 2.Bc4, 2.Qh5, 2.Qf3, 2.d3, 2.c4) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "2.Nc3 Nc6 3.Bc4 g6 4.Qf3",
     "start": [
      "e4",
      "c5"
     ],
     "moves": [
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "Nc6",
       "why": "Ton cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "Bc4",
       "why": "Le fou blanc vise f7."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare ton fianchetto et interdit Qh5."
      },
      {
       "san": "Qf3",
       "why": "La dame rejoint le fou contre f7 : menace Qxf7 échec et mat."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier bloque la colonne f : f7 est à l’abri."
      },
      {
       "san": "d3",
       "why": "Le pion d3 protège e4."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la grande diagonale."
      },
      {
       "san": "Nge2",
       "why": "Le second cavalier sort en e2, car la dame occupe f3."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de ton fou c8."
      },
      {
       "san": "O-O",
       "why": "Les Blancs roquent."
      },
      {
       "san": "O-O",
       "why": "Tu roques à ton tour."
      },
      {
       "san": "Qg3",
       "why": "La dame passe en g3 et vise ton pion d6."
      },
      {
       "san": "Bd7",
       "why": "Ton dernier fou se développe ; ensuite …Rb8 et …b5 sur l’aile dame."
      }
     ],
     "plan": "Ton pion f7 est à l’abri : …Na5 échange son fou c4, puis …Rb8 et …b5 attaquent sur l’aile dame."
    },
    {
     "name": "2.c3",
     "start": [
      "e4",
      "c5"
     ],
     "moves": [
      {
       "san": "c3",
       "why": "Le pion c3 prépare d4 : il pourra occuper tout le centre."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier va en f6 et attaque son pion e4."
      },
      {
       "san": "e5",
       "why": "Son pion e4, attaqué par ton cavalier, avance en e5 et chasse ton cavalier f6."
      },
      {
       "san": "Nd5",
       "why": "Ton cavalier, attaqué par son pion, s’écarte en d5."
      },
      {
       "san": "d4",
       "why": "Le pion d4 attaque ton pion c5."
      },
      {
       "san": "cxd4",
       "why": "Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier va en f3 et attaque ton pion d4."
      },
      {
       "san": "Nc6",
       "why": "Ton cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "cxd4",
       "why": "Son pion prend ton pion d4 : la colonne c s’ouvre pour ses tours."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de ton fou c8."
      },
      {
       "san": "Bc4",
       "why": "Son fou va en c4 et attaque ton cavalier d5."
      },
      {
       "san": "Nb6",
       "why": "Ton cavalier, attaqué par son fou, s’écarte en b6 et attaque son fou c4 ; il surveille aussi d5."
      },
      {
       "san": "Bb5",
       "why": "Son fou, attaqué par ton cavalier, s’écarte en b5 et cloue ton cavalier c6 sur ton roi."
      },
      {
       "san": "dxe5",
       "why": "Ton pion prend son pion e5 : la colonne d s’ouvre pour tes tours."
      },
      {
       "san": "Nxe5",
       "why": "Son cavalier reprend en e5 : le matériel reste égal."
      },
      {
       "san": "Bd7",
       "why": "Ton fou va en d7 et protège ton cavalier c6, attaqué par son cavalier."
      },
      {
       "san": "Nxd7",
       "why": "Son cavalier, attaqué par ton cavalier, prend ton fou d7."
      },
      {
       "san": "Qxd7",
       "why": "Ta dame reprend en d7 : le matériel reste égal."
      }
     ],
     "plan": "Continue avec …e6, …Be7 et le roque : son pion d4 est isolé, place un cavalier en d5 devant lui et attaque-le."
    },
    {
     "name": "2.d4",
     "start": [
      "e4",
      "c5"
     ],
     "moves": [
      {
       "san": "d4",
       "why": "Le pion d4 attaque ton pion c5."
      },
      {
       "san": "cxd4",
       "why": "Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "c3",
       "why": "Le pion c3 attaque ton pion d4."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier va en f6 et contre-attaque son pion e4 au lieu de défendre ton pion d4."
      },
      {
       "san": "e5",
       "why": "Son pion e4, attaqué par ton cavalier, avance en e5 et chasse ton cavalier f6."
      },
      {
       "san": "Nd5",
       "why": "Ton cavalier, attaqué par son pion, s’écarte en d5."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier va en f3 et attaque ton pion d4."
      },
      {
       "san": "Nc6",
       "why": "Ton cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "cxd4",
       "why": "Son pion prend ton pion d4 : la colonne c s’ouvre pour ses tours."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de ton fou c8."
      },
      {
       "san": "Bc4",
       "why": "Son fou va en c4 et attaque ton cavalier d5."
      },
      {
       "san": "Nb6",
       "why": "Ton cavalier, attaqué par son fou, s’écarte en b6 et attaque son fou c4 ; il surveille aussi d5."
      }
     ],
     "plan": "Même position que dans la ligne 2.c3 : …dxe5 ouvre le centre, puis …g6 et …Bg7 pour viser son pion d4."
    },
    {
     "name": "2.d3",
     "start": [
      "e4",
      "c5"
     ],
     "moves": [
      {
       "san": "d3",
       "why": "Le pion d3 soutient son pion e4."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "g3",
       "why": "Le pion g3 prépare le fianchetto de son fou en g2."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Bg2",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Nc6",
       "why": "Ton cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "c3",
       "why": "Le pion c3 surveille d4, au centre."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "d4",
       "why": "Le pion d4 attaque ton pion c5."
      },
      {
       "san": "d6",
       "why": "Le pion d6 protège ton pion c5, attaqué par son pion, et ouvre la diagonale de ton fou c8."
      },
      {
       "san": "d5",
       "why": "Le pion d5 chasse ton cavalier c6."
      },
      {
       "san": "Na5",
       "why": "Ton cavalier, attaqué par son pion, s’écarte en a5."
      },
      {
       "san": "Na3",
       "why": "Son cavalier se développe en a3."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      }
     ],
     "plan": "Attaque son pion d5 avec …e6 (ou …b5), et méfie-toi de b4 qui chasse ton cavalier a5 : réponds-y par …cxb4."
    },
    {
     "name": "2.c4",
     "start": [
      "e4",
      "c5"
     ],
     "moves": [
      {
       "san": "c4",
       "why": "Le pion c4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "Nc6",
       "why": "Ton cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "Nge2",
       "why": "Son cavalier se développe en e2 et surveille d4."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se développe en g7 et vise son cavalier c3."
      },
      {
       "san": "d3",
       "why": "Le pion d3 soutient son pion c4."
      },
      {
       "san": "d6",
       "why": "Le pion d6 soutient ton pion c5."
      },
      {
       "san": "g3",
       "why": "Le pion g3 prépare le fianchetto de son fou en g2."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Bg2",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Bd7",
       "why": "Ton fou se développe en d7."
      }
     ],
     "plan": "Ensuite …e5 (la case d4 pour ton cavalier), puis …Rb8 et …a6 pour préparer …b5 contre son pion c4."
    }
   ]
  },
  {
   "id": "cx-g6-system-2",
   "title": "Carrefour après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Be3 Nf6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (7.Bc4, 7.Be2) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "7.Be2",
     "start": [
      "e4",
      "c5",
      "Nf3",
      "Nc6",
      "d4",
      "cxd4",
      "Nxd4",
      "g6",
      "Nc3",
      "Bg7",
      "Be3",
      "Nf6"
     ],
     "moves": [
      {
       "san": "Be2",
       "why": "Son fou se développe en e2."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "d5",
       "why": "Le pion d5 prend de l’espace au centre et surveille e4."
      },
      {
       "san": "exd5",
       "why": "Son pion prend ton pion d5, qui attaquait son pion e4, et la colonne e s’ouvre pour ses tours."
      },
      {
       "san": "Nxd5",
       "why": "Ton cavalier reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Nxd5",
       "why": "Son cavalier reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Qxd5",
       "why": "Ta dame reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Bf3",
       "why": "Son fou va en f3 et contre-attaque ta dame d5 au lieu de défendre son cavalier d4."
      },
      {
       "san": "Qc4",
       "why": "Ta dame, attaquée par son fou, s’écarte en c4 ; elle surveille aussi d4 et d5."
      },
      {
       "san": "Nxc6",
       "why": "Son cavalier, attaqué par ta dame, prend ton cavalier c6."
      },
      {
       "san": "bxc6",
       "why": "Ton pion reprend en c6 : le matériel reste égal."
      },
      {
       "san": "b3",
       "why": "Le pion b3 chasse ta dame c4."
      },
      {
       "san": "Qa6",
       "why": "Ta dame, attaquée par son pion, s’écarte en a6."
      }
     ],
     "plan": "Ton fou g7 vise c3 et a1 : sors ton fou c8 (…Bf5 ou …Be6), puis tes tours sur les colonnes b et d contre ses pions de l’aile dame."
    }
   ]
  },
  {
   "id": "cx-g6-system-3",
   "title": "Carrefour après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (5.Nc3, 5.c4, 5.Nxc6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "5.c4",
     "start": [
      "e4",
      "c5",
      "Nf3",
      "Nc6",
      "d4",
      "cxd4",
      "Nxd4",
      "g6"
     ],
     "moves": [
      {
       "san": "c4",
       "why": "Le pion c4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se développe en g7 et vise son cavalier d4."
      },
      {
       "san": "Be3",
       "why": "Son fou va en e3 et protège son cavalier d4, attaqué par ton fou."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier va en f6 et attaque son pion e4."
      },
      {
       "san": "Nc3",
       "why": "Son cavalier va en c3 et protège son pion e4, attaqué par ton cavalier ; il surveille aussi d5."
      },
      {
       "san": "Ng4",
       "why": "Ton cavalier va en g4 et vise e5."
      },
      {
       "san": "Qxg4",
       "why": "Sa dame prend ton cavalier g4."
      },
      {
       "san": "Nxd4",
       "why": "Ton cavalier prend son cavalier d4."
      },
      {
       "san": "Qd1",
       "why": "Sa dame va en d1 et protège sa tour a1, menacée par ton cavalier (Nc2+) ; elle surveille aussi d4."
      },
      {
       "san": "Ne6",
       "why": "Ton cavalier, attaqué par sa dame, s’écarte en e6 ; il surveille aussi d4."
      },
      {
       "san": "Rc1",
       "why": "Sa tour vient en c1, prête si la colonne c s’ouvre."
      },
      {
       "san": "Qa5",
       "why": "Ta dame cloue son cavalier c3 sur son roi."
      },
      {
       "san": "Qd2",
       "why": "Sa dame va en d2 : son cavalier c3 n’est plus cloué."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de ton fou c8."
      }
     ],
     "plan": "Roque, puis …b6 et …Bb7 (ou …Be6) : avec ta dame a5 et ton fou g7, vise ses pions c3 et c4."
    },
    {
     "name": "5.Nxc6",
     "start": [
      "e4",
      "c5",
      "Nf3",
      "Nc6",
      "d4",
      "cxd4",
      "Nxd4",
      "g6"
     ],
     "moves": [
      {
       "san": "Nxc6",
       "why": "Son cavalier prend ton cavalier c6."
      },
      {
       "san": "bxc6",
       "why": "Ton pion reprend en c6 : le matériel reste égal."
      },
      {
       "san": "Bd3",
       "why": "Son fou se développe en d3 et surveille e4."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de ton fou c8."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer, et son roi a une case de fuite."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Be3",
       "why": "Son fou se développe en e3 et surveille d4."
      },
      {
       "san": "Rb8",
       "why": "Ta tour va en b8 et attaque son pion b2."
      }
     ],
     "plan": "Ta tour b8 attaque b2 : joue ensuite …Qc7 et …Nd7 pour libérer ton fou g7, et pousse …c5 pour gagner de la place."
    }
   ]
  },
  {
   "id": "cx-g6-system-4",
   "title": "Carrefour après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nxc6 bxc6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (6.Bd3, 6.Qd4) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "6.Qd4",
     "start": [
      "e4",
      "c5",
      "Nf3",
      "Nc6",
      "d4",
      "cxd4",
      "Nxd4",
      "g6",
      "Nxc6",
      "bxc6"
     ],
     "moves": [
      {
       "san": "Qd4",
       "why": "Sa dame va en d4 et attaque ta tour h8."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier bouche la diagonale de sa dame : ta tour h8 n’est plus attaquée ; il surveille aussi d5 et e4."
      },
      {
       "san": "e5",
       "why": "Le pion e5 chasse ton cavalier f6."
      },
      {
       "san": "Nd5",
       "why": "Ton cavalier, attaqué par son pion, s’écarte en d5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 gagne de l’espace au centre."
      },
      {
       "san": "f6",
       "why": "Le pion f6 bouche la diagonale de sa dame : ta tour h8 n’est plus attaquée."
      },
      {
       "san": "exd7+",
       "why": "Son pion prend ton pion d7, avec échec : la colonne e s’ouvre pour ses tours."
      },
      {
       "san": "Bxd7",
       "why": "Ton fou reprend en d7 : le matériel reste égal."
      },
      {
       "san": "Bc4",
       "why": "Son fou se développe en c4 et vise ton cavalier d5."
      },
      {
       "san": "e5",
       "why": "Le pion e5 contre-attaque sa dame d4 au lieu de défendre ton cavalier d5."
      }
     ],
     "plan": "Ton pion e5 chasse sa dame : ensuite sors ton fou f8 (…Be7), échange son fou c4 par …Be6 et roque ; tes pions c6 et e5 te donnent de l’espace."
    }
   ]
  },
  {
   "id": "cx-g6-system-5",
   "title": "Carrefour après 1.e4 c5 2.Nf3 Nc6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3.d4, 3.Bc4, 3.Bb5, 3.Nc3, 3.c3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "3.Bc4",
     "start": [
      "e4",
      "c5",
      "Nf3",
      "Nc6"
     ],
     "moves": [
      {
       "san": "Bc4",
       "why": "Son fou se développe en c4 et surveille d5."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "c3",
       "why": "Le pion c3 prépare d4 : il pourra occuper tout le centre."
      },
      {
       "san": "e6",
       "why": "Le pion e6 surveille d5, au centre."
      },
      {
       "san": "d4",
       "why": "Le pion d4 attaque ton pion c5."
      },
      {
       "san": "cxd4",
       "why": "Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "cxd4",
       "why": "Son pion reprend en d4 : le matériel reste égal."
      },
      {
       "san": "d5",
       "why": "Le pion d5 chasse son fou c4."
      },
      {
       "san": "exd5",
       "why": "Son pion prend ton pion d5, qui attaquait son fou c4, et la colonne e s’ouvre pour ses tours."
      },
      {
       "san": "exd5",
       "why": "Ton pion reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Bb5",
       "why": "Son fou, attaqué par ton pion, s’écarte en b5 et cloue ton cavalier c6 sur ton roi."
      },
      {
       "san": "Ne7",
       "why": "Ton cavalier se développe en e7 et surveille d5."
      },
      {
       "san": "Re1",
       "why": "Sa tour cloue ton cavalier e7 sur ton roi."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      }
     ],
     "plan": "Vise son pion d4, isolé : ton cavalier ira en f5, ta dame en b6, ton fou g7 tire déjà dessus, et ta tour prend la colonne c."
    },
    {
     "name": "3.Bb5",
     "start": [
      "e4",
      "c5",
      "Nf3",
      "Nc6"
     ],
     "moves": [
      {
       "san": "Bb5",
       "why": "Son fou se développe en b5 et vise ton cavalier c6."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Re1",
       "why": "Sa tour vient en e1 et soutient son pion e4."
      },
      {
       "san": "e5",
       "why": "Le pion e5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "Bxc6",
       "why": "Son fou prend ton cavalier c6."
      },
      {
       "san": "dxc6",
       "why": "Ton pion reprend en c6 : le matériel reste égal."
      },
      {
       "san": "d3",
       "why": "Le pion d3 soutient son pion e4."
      },
      {
       "san": "Qe7",
       "why": "Ta dame sort en e7 et surveille e5."
      },
      {
       "san": "Nbd2",
       "why": "Son cavalier se développe en d2 et surveille e4."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Nc4",
       "why": "Son cavalier va en c4 et vise e5."
      },
      {
       "san": "Nd7",
       "why": "Ton cavalier va en d7 et protège ton pion e5, attaqué par son cavalier."
      }
     ],
     "plan": "Ton cavalier d7 protège e5 : roque, puis …b6 et …f6 rendent ton centre solide."
    },
    {
     "name": "3.Nc3",
     "start": [
      "e4",
      "c5",
      "Nf3",
      "Nc6"
     ],
     "moves": [
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "d4",
       "why": "Le pion d4 attaque ton pion c5."
      },
      {
       "san": "cxd4",
       "why": "Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "Nxd4",
       "why": "Son cavalier reprend en d4 : le matériel reste égal."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la [[grande diagonale]] et vise le cavalier d4 et l’aile dame."
      },
      {
       "san": "Be3",
       "why": "Le fou blanc protège le cavalier d4."
      },
      {
       "san": "Nf6",
       "why": "Ton second cavalier se développe et attaque le pion e4."
      },
      {
       "san": "Bc4",
       "why": "Le fou blanc vise ton pion f7, le point faible près de ton roi."
      },
      {
       "san": "O-O",
       "why": "Tu fais le petit [[roque]] : ton roi est à l’abri derrière le fou g7."
      },
      {
       "san": "Bb3",
       "why": "Le fou blanc se met à l’abri en b3, d’où il vise toujours f7."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de ton fou c8 et surveille la case e5."
      }
     ],
     "plan": "Ensuite …Bd7 et …Rc8, puis …Nxd4 et …b5 : tu attaques son fou b3 et tu ouvres la colonne c."
    },
    {
     "name": "3.c3",
     "start": [
      "e4",
      "c5",
      "Nf3",
      "Nc6"
     ],
     "moves": [
      {
       "san": "c3",
       "why": "Le pion c3 prépare d4 : il pourra occuper tout le centre."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier va en f6 et attaque son pion e4."
      },
      {
       "san": "d4",
       "why": "Le pion d4 contre-attaque ton pion c5 au lieu de défendre son pion e4."
      },
      {
       "san": "cxd4",
       "why": "Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "e5",
       "why": "Le pion e5 chasse ton cavalier f6."
      },
      {
       "san": "Nd5",
       "why": "Ton cavalier, attaqué par son pion, s’écarte en d5."
      },
      {
       "san": "cxd4",
       "why": "Son pion prend ton pion d4 : la colonne c s’ouvre pour ses tours."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de ton fou c8."
      },
      {
       "san": "Bc4",
       "why": "Son fou va en c4 et attaque ton cavalier d5."
      },
      {
       "san": "Nb6",
       "why": "Ton cavalier, attaqué par son fou, s’écarte en b6 et attaque son fou c4 ; il surveille aussi d5."
      },
      {
       "san": "Bb3",
       "why": "Son fou, attaqué par ton cavalier, s’écarte en b3 ; il surveille aussi d5."
      },
      {
       "san": "dxe5",
       "why": "Ton pion prend son pion e5 : la colonne d s’ouvre pour tes tours."
      }
     ],
     "plan": "S’il reprend en e5, échange les cavaliers puis les dames (…Qxd1+) : la finale est égale et ton fou c8 sort en f5."
    }
   ]
  },
  {
   "id": "cx-g6-system-6",
   "title": "Carrefour après 1.e4 c5 2.Nf3 Nc6 3.Bc4 g6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (4.O-O, 4.Nc3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "4.Nc3",
     "start": [
      "e4",
      "c5",
      "Nf3",
      "Nc6",
      "Bc4",
      "g6"
     ],
     "moves": [
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se développe en g7 et vise son cavalier c3."
      },
      {
       "san": "d3",
       "why": "Le pion d3 soutient son fou c4."
      },
      {
       "san": "e6",
       "why": "Le pion e6 surveille d5, au centre."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Nge7",
       "why": "Ton cavalier se développe en e7 et surveille d5."
      },
      {
       "san": "Bb3",
       "why": "Son fou va en b3 et vise d5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Re1",
       "why": "Sa tour vient en e1 et soutient son pion e4."
      },
      {
       "san": "d6",
       "why": "Le pion d6 soutient ton pion c5."
      },
      {
       "san": "Ne2",
       "why": "Son cavalier se met à l’abri en e2 et surveille d4."
      },
      {
       "san": "Ne5",
       "why": "Ton cavalier se replace en e5."
      },
      {
       "san": "Nxe5",
       "why": "Son cavalier prend ton cavalier e5."
      },
      {
       "san": "dxe5",
       "why": "Ton pion reprend en e5 : le matériel reste égal."
      }
     ],
     "plan": "Ensuite …b6 et …Qc7, puis ton cavalier e7 vient en c6 et vise d4 : ton pion e5 tient le centre."
    }
   ]
  },
  {
   "id": "cx-g6-system-7",
   "title": "Carrefour après 1.e4 c5 2.Nf3 Nc6 3.Bb5 g6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (4.O-O, 4.Bxc6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "4.Bxc6",
     "start": [
      "e4",
      "c5",
      "Nf3",
      "Nc6",
      "Bb5",
      "g6"
     ],
     "moves": [
      {
       "san": "Bxc6",
       "why": "Son fou prend ton cavalier c6."
      },
      {
       "san": "dxc6",
       "why": "Ton pion reprend en c6 : le matériel reste égal."
      },
      {
       "san": "d3",
       "why": "Le pion d3 soutient son pion e4."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Be3",
       "why": "Son fou va en e3 et attaque ton pion c5."
      },
      {
       "san": "b6",
       "why": "Le pion b6 protège ton pion c5, attaqué par son fou, et prépare le fianchetto de ton fou en b7."
      },
      {
       "san": "Qd2",
       "why": "Sa dame sort en d2 : avec son fou e3, Bh6 échangera ton fou g7, le meilleur défenseur de ton roi."
      },
      {
       "san": "e5",
       "why": "Le pion e5 prend de l’espace au centre et surveille d4."
      }
     ],
     "plan": "S’il échange les fous de cases noires (Bh6), reprends avec le roi ; puis …Qd6 et …Ne8 : tes pions c5 et e5 tiennent la case d4."
    }
   ]
  },
  {
   "id": "cx-g6-system-8",
   "title": "Carrefour après 1.e4 c5 2.Nc3 Nc6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3.g3, 3.f4, 3.Nf3, 3.Bc4, 3.Bb5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "3.g3",
     "start": [
      "e4",
      "c5",
      "Nc3",
      "Nc6"
     ],
     "moves": [
      {
       "san": "g3",
       "why": "Le pion g3 prépare le fianchetto de son fou en g2."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "Bg2",
       "why": "Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se développe en g7 et vise son cavalier c3."
      },
      {
       "san": "d3",
       "why": "Le pion d3 soutient son pion e4."
      },
      {
       "san": "d6",
       "why": "Le pion d6 soutient ton pion c5."
      },
      {
       "san": "f4",
       "why": "Le pion f4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 surveille d5, au centre."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Nge7",
       "why": "Ton cavalier se développe en e7 et surveille d5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Be3",
       "why": "Son fou se développe en e3 et surveille d4."
      },
      {
       "san": "Nd4",
       "why": "Ton cavalier s’installe en d4, un [[avant-poste]] protégé par ton pion."
      },
      {
       "san": "Qd2",
       "why": "Sa dame sort en d2 : avec son fou e3, Bh6 échangera ton fou g7, le meilleur défenseur de ton roi."
      },
      {
       "san": "Rb8",
       "why": "Ta tour vient en b8 et soutient ton pion b7."
      }
     ],
     "plan": "Avance …b5 et …b4 avec ta tour b8 ; s’il lance g4 contre ton roi, l’avance …f5 freine son attaque."
    },
    {
     "name": "3.f4",
     "start": [
      "e4",
      "c5",
      "Nc3",
      "Nc6"
     ],
     "moves": [
      {
       "san": "f4",
       "why": "Le pion f4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se développe en g7 et vise son cavalier c3."
      },
      {
       "san": "Bc4",
       "why": "Son fou se développe en c4 et surveille d5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 surveille d5, au centre."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Nge7",
       "why": "Ton cavalier se développe en e7 et surveille d5."
      },
      {
       "san": "d3",
       "why": "Le pion d3 soutient son fou c4."
      },
      {
       "san": "d5",
       "why": "Le pion d5 chasse son fou c4."
      },
      {
       "san": "Bb3",
       "why": "Son fou, attaqué par ton pion, s’écarte en b3 ; il surveille aussi d5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      }
     ],
     "plan": "S’il pousse e5, le centre se ferme : …b6 puis …Ba6 met ton fou sur une diagonale libre, et …c4 attaque à l’aile dame."
    },
    {
     "name": "3.Nf3",
     "start": [
      "e4",
      "c5",
      "Nc3",
      "Nc6"
     ],
     "moves": [
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "d4",
       "why": "Le pion d4 attaque ton pion c5."
      },
      {
       "san": "cxd4",
       "why": "Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "Nxd4",
       "why": "Son cavalier reprend en d4 : le matériel reste égal."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la [[grande diagonale]] et vise le cavalier d4 et l’aile dame."
      },
      {
       "san": "Be3",
       "why": "Le fou blanc protège le cavalier d4."
      },
      {
       "san": "Nf6",
       "why": "Ton second cavalier se développe et attaque le pion e4."
      },
      {
       "san": "Bc4",
       "why": "Le fou blanc vise ton pion f7, le point faible près de ton roi."
      },
      {
       "san": "O-O",
       "why": "Tu fais le petit [[roque]] : ton roi est à l’abri derrière le fou g7."
      }
     ],
     "plan": "Après Bb3, …d6 puis …Bd7 et …Rc8 : ta tour prend la colonne c, et …Na5 ou …b5 attaquera son fou b3."
    },
    {
     "name": "3.Bb5",
     "start": [
      "e4",
      "c5",
      "Nc3",
      "Nc6"
     ],
     "moves": [
      {
       "san": "Bb5",
       "why": "Son fou se développe en b5 et vise ton cavalier c6."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "Bxc6",
       "why": "Son fou prend ton cavalier c6."
      },
      {
       "san": "bxc6",
       "why": "Ton pion reprend en c6 : le matériel reste égal."
      },
      {
       "san": "f4",
       "why": "Le pion f4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se développe en g7 et vise son cavalier c3."
      },
      {
       "san": "d3",
       "why": "Le pion d3 soutient son pion e4."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "d6",
       "why": "Le pion d6 soutient ton pion c5."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      }
     ],
     "plan": "Ta tour va en b8 sur la colonne semi-ouverte et ton cavalier f6 passe par e8 vers c7 ; ta paire de fous et …c4 te donnent du jeu à l’aile dame."
    }
   ]
  },
  {
   "id": "cx-g6-system-9",
   "title": "Carrefour après 1.e4 c5 2.Nc3 Nc6 3.Bc4 g6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (4.Qf3, 4.Nf3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "4.Nf3",
     "start": [
      "e4",
      "c5",
      "Nc3",
      "Nc6",
      "Bc4",
      "g6"
     ],
     "moves": [
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se développe en g7 et vise son cavalier c3."
      },
      {
       "san": "d3",
       "why": "Le pion d3 soutient son fou c4."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer."
      },
      {
       "san": "d6",
       "why": "Le pion d6 soutient ton pion c5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Be3",
       "why": "Son fou se développe en e3 et surveille d4."
      },
      {
       "san": "e6",
       "why": "Ton pion va en e6 : ton pion f7 n’est plus cloué."
      }
     ],
     "plan": "Ton pion e6 coupe la diagonale de son fou c4 et prépare …d5 ; s’il ouvre le centre avec d4, réponds …d5 et ton fou g7 devient très fort."
    }
   ]
  },
  {
   "id": "cx-g6-system-10",
   "title": "Carrefour après 1.e4 c5 2.c3 Nf6 3.e5 Nd5",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (4.d4, 4.Nf3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "4.Nf3",
     "start": [
      "e4",
      "c5",
      "c3",
      "Nf6",
      "e5",
      "Nd5"
     ],
     "moves": [
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Nc6",
       "why": "Ton cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "d4",
       "why": "Le pion d4 attaque ton pion c5."
      },
      {
       "san": "cxd4",
       "why": "Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "cxd4",
       "why": "Son pion prend ton pion d4 : la colonne c s’ouvre pour ses tours."
      },
      {
       "san": "d6",
       "why": "Le pion d6 ouvre la diagonale de ton fou c8."
      },
      {
       "san": "Bc4",
       "why": "Son fou va en c4 et attaque ton cavalier d5."
      },
      {
       "san": "Nb6",
       "why": "Ton cavalier, attaqué par son fou, s’écarte en b6 et attaque son fou c4 ; il surveille aussi d5."
      }
     ],
     "plan": "Même position que dans la ligne 2.c3 : …dxe5 ouvre le centre, puis …g6 et …Bg7 pour viser son pion d4."
    }
   ]
  },
  {
   "id": "cx-g6-system-11",
   "title": "Carrefour après 1.e4 c5 2.d4 cxd4",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3.c3, 3.Nf3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "3.Nf3",
     "start": [
      "e4",
      "c5",
      "d4",
      "cxd4"
     ],
     "moves": [
      {
       "san": "Nf3",
       "why": "Son cavalier va en f3 et attaque ton pion d4."
      },
      {
       "san": "Nc6",
       "why": "Ton cavalier se développe en c6 et surveille d4 et e5."
      },
      {
       "san": "Nxd4",
       "why": "Le cavalier blanc reprend le pion et s’installe au centre."
      },
      {
       "san": "g6",
       "why": "Tu prépares tout de suite le [[fianchetto]] de ton fou f8 : c’est le Dragon accéléré."
      },
      {
       "san": "Nc3",
       "why": "Le second cavalier blanc protège le pion e4."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la [[grande diagonale]] et vise le cavalier d4 et l’aile dame."
      },
      {
       "san": "Be3",
       "why": "Le fou blanc protège le cavalier d4."
      },
      {
       "san": "Nf6",
       "why": "Ton second cavalier se développe et attaque le pion e4."
      }
     ],
     "plan": "Tu retrouves la ligne principale : contre Bc4, roque ; si Nxc6 bxc6 puis e5, recule ton cavalier en g8, puis …d6 attaque son pion e5."
    }
   ]
  },
  {
   "id": "cx-g6-system-12",
   "title": "Carrefour après 1.e4 c5 2.Bc4 Nc6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3.Nf3, 3.Qf3, 3.Qh5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "3.Nf3",
     "start": [
      "e4",
      "c5",
      "Bc4",
      "Nc6"
     ],
     "moves": [
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "c3",
       "why": "Le pion c3 prépare d4 : il pourra occuper tout le centre."
      },
      {
       "san": "e6",
       "why": "Le pion e6 surveille d5, au centre."
      }
     ],
     "plan": "Ensuite …Nge7 et …d5 : ton pion e6 a coupé la diagonale de son fou c4, et …d5 te donnera le centre."
    }
   ]
  },
  {
   "id": "cx-g6-system-13",
   "title": "Carrefour au premier coup",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (1.e4, 1.e3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "1.e3",
     "start": [],
     "moves": [
      {
       "san": "e3",
       "why": "Le pion e3 ouvre la diagonale de son fou f1."
      },
      {
       "san": "c5",
       "why": "Le pion c5 prend de l’espace au centre et surveille d4."
      },
      {
       "san": "d4",
       "why": "Le pion d4 attaque ton pion c5."
      },
      {
       "san": "g6",
       "why": "Le pion g6 prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "c4",
       "why": "Le pion c4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "Bg7",
       "why": "Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile."
      },
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "d5",
       "why": "Le pion d5 occupe le centre."
      },
      {
       "san": "d6",
       "why": "Le pion d6 soutient ton pion c5."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Bd3",
       "why": "Son fou se développe en d3 et surveille e4."
      },
      {
       "san": "e6",
       "why": "Le pion e6 surveille d5, au centre."
      },
      {
       "san": "h3",
       "why": "Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer."
      },
      {
       "san": "exd5",
       "why": "Ton pion prend son pion d5 : la colonne e s’ouvre pour tes tours."
      }
     ],
     "plan": "Après cxd5, ton plan est à l’aile dame : …Na6 puis …Nc7, …Re8 et …b5 ; ton fou g7 tire sur la grande diagonale."
    }
   ]
  }
 ],
 "london-def": [
  {
   "id": "cx-london-def-1",
   "title": "Carrefour après 1.d4 d5 2.c4 c6 3.Nf3 Nf6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (4.e3, 4.Nc3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "4.Nc3 : …e6 d’abord",
     "start": [
      "d4",
      "d5",
      "c4",
      "c6",
      "Nf3",
      "Nf6",
      "Nc3",
      "e6",
      "Bg5",
      "Nbd7",
      "cxd5",
      "exd5",
      "Qc2",
      "Bd6",
      "e3",
      "O-O"
     ],
     "moves": [
      {
       "san": "Bd3",
       "why": "Son fou se développe en d3 et surveille e4."
      },
      {
       "san": "h6",
       "why": "Le pion h6 chasse son fou g5."
      },
      {
       "san": "Bh4",
       "why": "Son fou, attaqué par ton pion, s’écarte en h4 et cloue ton cavalier f6 sur ta dame."
      },
      {
       "san": "Be7",
       "why": "Ton fou va en e7 : ton cavalier f6 n’est plus cloué."
      }
     ],
     "plan": "Ensuite …Re8, puis …Nf8 et …Ng6 ou …Ne4 : ta tour tient la colonne e, et ton fou c8 sortira en g4 ou e6."
    }
   ]
  },
  {
   "id": "cx-london-def-2",
   "title": "Carrefour après 1.d4 d5",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (2.c4, 2.Nf3, 2.Bf4, 2.e3, 2.Nc3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "2.Nf3 ou 2.Bf4 : Londres contre Londres",
     "start": [
      "d4",
      "d5"
     ],
     "moves": [
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "c6",
       "why": "Le pion c6 soutient ton pion d5."
      },
      {
       "san": "Bf4",
       "why": "Son fou se développe en f4 et surveille e5."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient son pion d4."
      },
      {
       "san": "Bf5",
       "why": "Ton fou se développe en f5 et surveille e4."
      },
      {
       "san": "c4",
       "why": "Le pion c4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 soutient ton pion d5."
      },
      {
       "san": "Qb3",
       "why": "La dame blanche attaque ton pion b7."
      },
      {
       "san": "Qc8",
       "why": "Ta dame protège b7 depuis c8, sans s’exposer."
      },
      {
       "san": "Nc3",
       "why": "Le cavalier blanc se développe et vise d5."
      },
      {
       "san": "Nbd7",
       "why": "Ton cavalier se développe derrière ta chaîne de pions."
      },
      {
       "san": "cxd5",
       "why": "Les Blancs échangent au centre."
      },
      {
       "san": "Nxd5",
       "why": "Tu reprends avec le cavalier, qui attaque le cavalier c3 et le fou f4."
      },
      {
       "san": "Bg3",
       "why": "Le fou blanc recule en g3."
      },
      {
       "san": "Bg6",
       "why": "Ton fou recule en g6, à l’abri."
      },
      {
       "san": "Rc1",
       "why": "Sa tour vient sur la colonne c, semi-ouverte."
      },
      {
       "san": "h6",
       "why": "Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer."
      }
     ],
     "plan": "Ensuite …Be7 et le roque ; si Bc4, …Nxc3 lui laisse un pion faible en c3, et ta tour viendra sur la colonne c."
    },
    {
     "name": "2.Bf4",
     "start": [
      "d4",
      "d5"
     ],
     "moves": [
      {
       "san": "Bf4",
       "why": "Son fou se développe en f4 et surveille e5."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient son pion d4."
      },
      {
       "san": "Bf5",
       "why": "Ton fou se développe en f5 et surveille e4."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "c6",
       "why": "Le pion c6 soutient ton pion d5."
      },
      {
       "san": "c4",
       "why": "Le pion c4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 soutient ton pion d5."
      },
      {
       "san": "Qb3",
       "why": "La dame blanche attaque ton pion b7."
      },
      {
       "san": "Qc8",
       "why": "Ta dame protège b7 depuis c8, sans s’exposer."
      },
      {
       "san": "Nc3",
       "why": "Le cavalier blanc se développe et vise d5."
      },
      {
       "san": "Nbd7",
       "why": "Ton cavalier se développe derrière ta chaîne de pions."
      },
      {
       "san": "cxd5",
       "why": "Les Blancs échangent au centre."
      },
      {
       "san": "Nxd5",
       "why": "Tu reprends avec le cavalier, qui attaque le cavalier c3 et le fou f4."
      },
      {
       "san": "Bg3",
       "why": "Le fou blanc recule en g3."
      },
      {
       "san": "Bg6",
       "why": "Ton fou recule en g6, à l’abri."
      },
      {
       "san": "Rc1",
       "why": "Sa tour vient sur la colonne c, semi-ouverte."
      },
      {
       "san": "h6",
       "why": "Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer."
      }
     ],
     "plan": "Ensuite …Be7 et le roque ; si Bc4, …Nxc3 lui laisse un pion faible en c3, et ta tour viendra sur la colonne c."
    },
    {
     "name": "2.Nc3",
     "start": [
      "d4",
      "d5"
     ],
     "moves": [
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Bf4",
       "why": "Son fou se développe en f4 et surveille e5."
      },
      {
       "san": "c6",
       "why": "Le pion c6 soutient ton pion d5."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient son pion d4."
      },
      {
       "san": "Bf5",
       "why": "Ton fou se développe en f5 et surveille e4."
      },
      {
       "san": "f3",
       "why": "Le pion f3 surveille e4, au centre."
      },
      {
       "san": "e6",
       "why": "Le pion e6 soutient ton pion d5."
      },
      {
       "san": "g4",
       "why": "Le pion g4 chasse ton fou f5."
      },
      {
       "san": "Bg6",
       "why": "Ton fou, attaqué par son pion, s’écarte en g6 ; il surveille aussi e4."
      },
      {
       "san": "h4",
       "why": "Le pion h4 gagne de l’espace à l’aile roi."
      },
      {
       "san": "h6",
       "why": "Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer."
      },
      {
       "san": "Nge2",
       "why": "Son cavalier se développe en e2 et surveille d4."
      },
      {
       "san": "Nbd7",
       "why": "Ton cavalier se développe en d7 et surveille e5."
      },
      {
       "san": "Qd2",
       "why": "Sa dame sort en d2 et surveille d4."
      },
      {
       "san": "Nb6",
       "why": "Ton cavalier va en b6 et vise d5."
      },
      {
       "san": "Ng3",
       "why": "Son cavalier va en g3 et vise e4."
      },
      {
       "san": "Bd6",
       "why": "Ton fou se développe en d6 et surveille e5."
      }
     ],
     "plan": "Plan : …Bxf4 échange son meilleur fou ; après exf4, ta dame en d6 vise son pion f4, et tu fais le grand roque, loin de ses pions g4 et h4."
    }
   ]
  },
  {
   "id": "cx-london-def-3",
   "title": "Carrefour après 1.d4 d5 2.e3 Bf5",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3.c4, 3.Bd3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "2.e3 : le fou sort tout de suite",
     "start": [
      "d4",
      "d5",
      "e3",
      "Bf5",
      "c4",
      "e6",
      "Qb3",
      "Nc6",
      "Bd2",
      "Rb8"
     ],
     "moves": [
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Bc3",
       "why": "Son fou va en c3 et vise d4."
      },
      {
       "san": "Bd6",
       "why": "Ton fou se développe en d6 et surveille e5."
      },
      {
       "san": "c5",
       "why": "Le pion c5 chasse ton fou d6."
      },
      {
       "san": "Be7",
       "why": "Ton fou, attaqué par son pion, s’écarte en e7."
      },
      {
       "san": "Nbd2",
       "why": "Son cavalier se développe en d2 et surveille e4."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Bb5",
       "why": "Son fou se développe en b5 et vise ton cavalier c6."
      },
      {
       "san": "Qc8",
       "why": "Ta dame se développe en c8."
      }
     ],
     "plan": "Plan : …Ne4 installe ton cavalier au centre et propose des échanges ; ensuite …f6 puis …e5 ouvre le jeu contre sa chaîne c5-d4."
    },
    {
     "name": "3.Bd3",
     "start": [
      "d4",
      "d5",
      "e3",
      "Bf5"
     ],
     "moves": [
      {
       "san": "Bd3",
       "why": "Son fou va en d3 et attaque ton fou f5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 protège ton fou f5, attaqué par son fou, et ouvre la diagonale de ton fou f8."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "c6",
       "why": "Le pion c6 soutient ton pion d5."
      },
      {
       "san": "c4",
       "why": "Le pion c4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "Nbd7",
       "why": "Ton cavalier se développe en d7 et surveille e5."
      },
      {
       "san": "Bxf5",
       "why": "Son fou prend ton fou f5."
      },
      {
       "san": "exf5",
       "why": "Ton pion reprend en f5 : le matériel reste égal."
      },
      {
       "san": "Qd3",
       "why": "Sa dame va en d3 et attaque ton pion f5."
      },
      {
       "san": "g6",
       "why": "Le pion g6 protège ton pion f5, attaqué par sa dame, et prépare le fianchetto de ton fou en g7."
      },
      {
       "san": "cxd5",
       "why": "Son pion prend ton pion d5 : la colonne c s’ouvre pour ses tours."
      },
      {
       "san": "Nxd5",
       "why": "Ton cavalier reprend en d5 : le matériel reste égal."
      },
      {
       "san": "e4",
       "why": "Le pion e4 chasse ton cavalier d5."
      },
      {
       "san": "fxe4",
       "why": "Ton pion prend son pion e4, qui attaquait ton cavalier d5."
      }
     ],
     "plan": "Après Qxe4+, pare l’échec par …Be7, puis …N7f6 : tes cavaliers d5 et f6 tiennent le centre, et tu roques dès que possible."
    }
   ]
  },
  {
   "id": "cx-london-def-4",
   "title": "Carrefour après 1.c4 c6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (2.Nf3, 2.e4, 2.Nc3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "1.c4 c6 : même placement",
     "start": [
      "c4",
      "c6",
      "Nf3",
      "d5",
      "e3",
      "Nf6",
      "d4",
      "Bf5",
      "Nc3",
      "e6",
      "Nh4",
      "Bg6"
     ],
     "moves": [
      {
       "san": "Qb3",
       "why": "Sa dame va en b3 et attaque ton pion b7."
      },
      {
       "san": "Qc7",
       "why": "Ta dame va en c7 et protège ton pion b7, attaqué par sa dame ; elle surveille aussi e5."
      },
      {
       "san": "Nxg6",
       "why": "Son cavalier prend ton fou g6."
      },
      {
       "san": "hxg6",
       "why": "Ton pion reprend en g6 : le matériel reste égal."
      },
      {
       "san": "h4",
       "why": "Son pion h2, attaqué par ta tour, avance en h4."
      },
      {
       "san": "Bd6",
       "why": "Ton fou se développe en d6 et surveille e5."
      },
      {
       "san": "Bd2",
       "why": "Son fou se développe en d2."
      },
      {
       "san": "Nbd7",
       "why": "Ton cavalier se développe en d7 et surveille e5."
      }
     ],
     "plan": "S’il fait le grand roque, attaque son roi avec …a5 et …b5 ; ta tour h8 garde la colonne h ouverte contre son pion h4."
    },
    {
     "name": "2.e4",
     "start": [
      "c4",
      "c6"
     ],
     "moves": [
      {
       "san": "e4",
       "why": "Le pion e4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "d5",
       "why": "Le pion d5 attaque son pion e4."
      },
      {
       "san": "exd5",
       "why": "Son pion prend ton pion d5, qui attaquait son pion e4, et la colonne e s’ouvre pour ses tours."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "d4",
       "why": "Le pion d4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "cxd5",
       "why": "Ton pion prend son pion d5 : la colonne c s’ouvre pour tes tours."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 soutient ton pion d5."
      },
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "Be7",
       "why": "Ton fou se développe en e7."
      },
      {
       "san": "cxd5",
       "why": "Son pion prend ton pion d5 : la colonne c s’ouvre pour ses tours."
      },
      {
       "san": "Nxd5",
       "why": "Ton cavalier reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Bd3",
       "why": "Son fou se développe en d3 et surveille e4."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se met à l’abri en f6 et surveille d5 et e4."
      },
      {
       "san": "O-O",
       "why": "Petit roque : son roi se met à l’abri."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Re1",
       "why": "Sa tour vient sur la colonne e, semi-ouverte."
      },
      {
       "san": "Nc6",
       "why": "Ton cavalier se développe en c6 et surveille d4 et e5."
      }
     ],
     "plan": "Son pion d4 est isolé : bloque la case d5 avec un cavalier, sors ton fou c8 en b7 (…a6 puis …b5), et vise d4 avec tes tours."
    },
    {
     "name": "2.Nc3",
     "start": [
      "c4",
      "c6"
     ],
     "moves": [
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "d5",
       "why": "Le pion d5 attaque son pion c4."
      },
      {
       "san": "cxd5",
       "why": "Son pion prend ton pion d5, qui attaquait son pion c4, et la colonne c s’ouvre pour ses tours."
      },
      {
       "san": "cxd5",
       "why": "Ton pion reprend en d5 : le matériel reste égal."
      },
      {
       "san": "d4",
       "why": "Le pion d4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Bf4",
       "why": "Son fou se développe en f4 et surveille e5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 soutient ton pion d5."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient son pion d4."
      },
      {
       "san": "Bd6",
       "why": "Ton fou se développe en d6 et surveille e5."
      },
      {
       "san": "Bg3",
       "why": "Son fou se met à l’abri en g3 et surveille e5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Bd3",
       "why": "Son fou se développe en d3 et surveille e4."
      },
      {
       "san": "h6",
       "why": "Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite."
      },
      {
       "san": "Rc1",
       "why": "Sa tour vient sur la colonne c, ouverte."
      },
      {
       "san": "Be7",
       "why": "Ton fou se met à l’abri en e7."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Qb6",
       "why": "Ta dame va en b6 et attaque son pion b2."
      }
     ],
     "plan": "Ta dame b6 vise b2 : …Nc6 et …Bd7, puis …Rc8 pour contester la colonne c ; le pion b2 tombe s’il l’oublie."
    }
   ]
  },
  {
   "id": "cx-london-def-5",
   "title": "Carrefour au premier coup",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (1.d4, 1.c4, 1.Nf3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "1.Nf3 d5 2.g3 : contre le fianchetto",
     "start": [],
     "moves": [
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "d5",
       "why": "Le pion d5 prend de l’espace au centre et surveille e4."
      },
      {
       "san": "g3",
       "why": "Les Blancs préparent le [[fianchetto]] de leur fou f1."
      },
      {
       "san": "c6",
       "why": "Ton pion c6 soutient d5 et laisse ton fou c8 libre."
      },
      {
       "san": "Bg2",
       "why": "Le fou blanc se place sur la [[grande diagonale]]."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe vers le centre."
      },
      {
       "san": "O-O",
       "why": "Les Blancs roquent."
      },
      {
       "san": "Bf5",
       "why": "Ton fou sort avant …e6, comme toujours."
      },
      {
       "san": "d3",
       "why": "Le pion d3 prépare e4."
      },
      {
       "san": "e6",
       "why": "Le pion e6 complète ta chaîne c6-d5-e6."
      },
      {
       "san": "Nh4",
       "why": "Le cavalier blanc attaque ton fou f5."
      },
      {
       "san": "Bg4",
       "why": "Ici le fou va en g4 (Stockfish) : il attaque le pion e2 au lieu d’être échangé en g6."
      },
      {
       "san": "Qe1",
       "why": "Sa dame se développe en e1."
      },
      {
       "san": "Nbd7",
       "why": "Ton cavalier se développe en d7 et surveille e5."
      },
      {
       "san": "h3",
       "why": "Le pion h3 chasse ton fou g4."
      },
      {
       "san": "Bh5",
       "why": "Ton fou, attaqué par son pion, s’écarte en h5."
      },
      {
       "san": "e4",
       "why": "Le pion e4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "h6",
       "why": "Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer."
      },
      {
       "san": "f4",
       "why": "Le pion f4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "Qb6+",
       "why": "Ta dame va en b6 avec échec."
      }
     ],
     "plan": "Après Kh2, ouvre par …dxe4, puis fais le grand roque : ta dame b6 et ton fou f8 (…Bc5) visent son roi."
    }
   ]
  },
  {
   "id": "cx-london-def-6",
   "title": "Carrefour après 1.d4 d5 2.c4 c6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3.Nf3, 3.Nc3, 3.cxd5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "3.Nc3",
     "start": [
      "d4",
      "d5",
      "c4",
      "c6"
     ],
     "moves": [
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient son pion d4."
      },
      {
       "san": "e6",
       "why": "Le pion e6 soutient ton pion d5."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "Bd6",
       "why": "Ton fou se développe en d6 et surveille e5."
      },
      {
       "san": "Bd3",
       "why": "Son fou se développe en d3 et surveille e4."
      },
      {
       "san": "Nbd7",
       "why": "Ton cavalier se développe en d7 et surveille e5."
      },
      {
       "san": "e4",
       "why": "Le pion e4 occupe le centre et surveille d5."
      },
      {
       "san": "dxc4",
       "why": "Ton pion prend son pion c4 : la colonne d s’ouvre pour tes tours."
      },
      {
       "san": "Bxc4",
       "why": "Son fou reprend en c4 : le matériel reste égal."
      },
      {
       "san": "b5",
       "why": "Le pion b5 chasse son fou c4."
      },
      {
       "san": "Bb3",
       "why": "Son fou, attaqué par ton pion, s’écarte en b3 ; il surveille aussi d5."
      },
      {
       "san": "b4",
       "why": "Le pion b4 chasse son cavalier c3."
      },
      {
       "san": "Na4",
       "why": "Son cavalier, attaqué par ton pion, s’écarte en a4."
      },
      {
       "san": "Be7",
       "why": "Ton fou se replace en e7."
      }
     ],
     "plan": "S’il pousse e5, ton cavalier va en d5 ; ensuite …Bb7, le roque et …c5 pour attaquer son centre, et son cavalier a4 est mal placé."
    },
    {
     "name": "3.cxd5",
     "start": [
      "d4",
      "d5",
      "c4",
      "c6"
     ],
     "moves": [
      {
       "san": "cxd5",
       "why": "Son pion prend ton pion d5 : la colonne c s’ouvre pour ses tours."
      },
      {
       "san": "cxd5",
       "why": "Ton pion reprend en d5 : le matériel reste égal."
      },
      {
       "san": "Nc3",
       "why": "Son cavalier se développe en c3 et surveille d5 et e4."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "Bf4",
       "why": "Son fou se développe en f4 et surveille e5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 soutient ton pion d5."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient son pion d4."
      },
      {
       "san": "Bd6",
       "why": "Ton fou se développe en d6 et surveille e5."
      },
      {
       "san": "Bg3",
       "why": "Son fou se met à l’abri en g3 et surveille e5."
      },
      {
       "san": "O-O",
       "why": "Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre."
      },
      {
       "san": "Nf3",
       "why": "Son cavalier se développe en f3 et surveille d4 et e5."
      },
      {
       "san": "h6",
       "why": "Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite."
      },
      {
       "san": "Bh4",
       "why": "Son fou cloue ton cavalier f6 sur ta dame."
      },
      {
       "san": "Nbd7",
       "why": "Ton cavalier se développe en d7 et surveille e5."
      },
      {
       "san": "Bd3",
       "why": "Son fou se développe en d3 et surveille e4."
      },
      {
       "san": "Be7",
       "why": "Ton fou va en e7 : ton cavalier f6 n’est plus cloué."
      }
     ],
     "plan": "Ensuite …b6 et …Bb7, puis …Rc8 : tes tours prennent la colonne c ouverte, et ton fou e7 a décloué ton cavalier f6."
    }
   ]
  },
  {
   "id": "cx-london-def-7",
   "title": "Carrefour après 1.d4 d5 2.Nf3 c6",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (3.Bf4, 3.c4) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "3.c4",
     "start": [
      "d4",
      "d5",
      "Nf3",
      "c6"
     ],
     "moves": [
      {
       "san": "c4",
       "why": "Le pion c4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe et protège d5 une deuxième fois."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient d4, mais il enferme le fou c1 des Blancs."
      },
      {
       "san": "Bf5",
       "why": "Ton fou sort AVANT …e6 : c’est l’idée du Londres en défense, ce fou ne restera pas enfermé."
      },
      {
       "san": "Nc3",
       "why": "Le second cavalier blanc se développe et vise d5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 complète ta [[chaîne de pions]] c6-d5-e6 et ouvre la diagonale de ton fou f8."
      }
     ],
     "plan": "Position de la leçon : contre Nh4, recule ton fou en g6 ; après Nxg6 hxg6, ta tour h8 a la colonne h, et contre Qb3 joue …Qc7 ou …Qb6."
    }
   ]
  },
  {
   "id": "cx-london-def-8",
   "title": "Carrefour après 1.Nf3 d5",
   "intro": "À ce carrefour, il a plusieurs coups dans ton répertoire (2.c4, 2.d4, 2.g3, 2.e3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.",
   "lines": [
    {
     "name": "2.c4",
     "start": [
      "Nf3",
      "d5"
     ],
     "moves": [
      {
       "san": "c4",
       "why": "Le pion c4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "c6",
       "why": "Le pion c6 soutient ton pion d5."
      },
      {
       "san": "e3",
       "why": "Le pion e3 prépare d4."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe vers le centre."
      },
      {
       "san": "d4",
       "why": "Les Blancs occupent le centre : c’est la position de la leçon."
      },
      {
       "san": "Bf5",
       "why": "Ton fou sort AVANT …e6 : c’est l’idée du Londres en défense, ce fou ne restera pas enfermé."
      },
      {
       "san": "Nc3",
       "why": "Le second cavalier blanc se développe et vise d5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 complète ta [[chaîne de pions]] c6-d5-e6 et ouvre la diagonale de ton fou f8."
      }
     ],
     "plan": "Position de la leçon : contre Nh4, recule ton fou en g6 ; après Nxg6 hxg6, ta tour h8 a la colonne h, et contre Qb3 joue …Qc7 ou …Qb6."
    },
    {
     "name": "2.d4",
     "start": [
      "Nf3",
      "d5"
     ],
     "moves": [
      {
       "san": "d4",
       "why": "Le pion d4 prend de l’espace au centre et surveille e5."
      },
      {
       "san": "c6",
       "why": "Le pion c6 soutient ton pion d5."
      },
      {
       "san": "Bf4",
       "why": "Son fou se développe en f4 et surveille e5."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe en f6 et surveille d5 et e4."
      },
      {
       "san": "e3",
       "why": "Le pion e3 soutient son pion d4."
      },
      {
       "san": "Bf5",
       "why": "Ton fou se développe en f5 et surveille e4."
      },
      {
       "san": "c4",
       "why": "Le pion c4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 soutient ton pion d5."
      }
     ],
     "plan": "Position de la leçon (Londres contre Londres) : contre Qb3, protège b7 par …Qc8, puis …Nbd7, …Be7 et le roque."
    },
    {
     "name": "2.e3",
     "start": [
      "Nf3",
      "d5"
     ],
     "moves": [
      {
       "san": "e3",
       "why": "Le pion e3 ouvre la diagonale de son fou f1."
      },
      {
       "san": "c6",
       "why": "Le pion c6 soutient ton pion d5."
      },
      {
       "san": "c4",
       "why": "Le pion c4 prend de l’espace au centre et surveille d5."
      },
      {
       "san": "Nf6",
       "why": "Ton cavalier se développe vers le centre."
      },
      {
       "san": "d4",
       "why": "Les Blancs occupent le centre : c’est la position de la leçon."
      },
      {
       "san": "Bf5",
       "why": "Ton fou sort AVANT …e6 : c’est l’idée du Londres en défense, ce fou ne restera pas enfermé."
      },
      {
       "san": "Nc3",
       "why": "Le second cavalier blanc se développe et vise d5."
      },
      {
       "san": "e6",
       "why": "Le pion e6 complète ta [[chaîne de pions]] c6-d5-e6 et ouvre la diagonale de ton fou f8."
      }
     ],
     "plan": "Position de la leçon : contre Nh4, recule ton fou en g6 ; après Nxg6 hxg6, ta tour h8 a la colonne h, et contre Qb3 joue …Qc7 ou …Qb6."
    }
   ]
  }
 ]
};
