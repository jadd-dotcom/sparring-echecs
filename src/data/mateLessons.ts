// Leçons des mats élémentaires : la méthode en 5 étapes, sur une position rejouée coup par coup.
// Lignes : Stockfish pour les deux camps (mat le plus court contre la meilleure défense), sauf l'échelle (écrite à la main).
// Chaque coup blanc est rattaché à une étape (`s`, à partir de 1).
import type { MateLevelId } from '../lib/mates';

export interface MateLesson {
  level: MateLevelId;
  fen: string;
  intro: string;
  steps: string[];
  moves: { san: string; s?: number }[];
}

const line = (spec: string) =>
  spec.trim().split(/\s+/).map((tok) => {
    const m = tok.match(/^([^@]+)(?:@(\d))?$/)!;
    return m[2] ? { san: m[1], s: Number(m[2]) } : { san: m[1] };
  });

export const MATE_LESSONS: MateLesson[] = [
  {
    level: 'kq',
    fen: '8/8/8/3k4/8/7Q/2K5/8 w - - 0 1',
    intro: 'La dame seule ne peut pas mater : il faut l’aide du roi. Le danger principal est le pat.',
    steps: [
      'Place ta dame à un saut de cavalier du roi adverse : il est enfermé dans une « boîte », sans échec.',
      'Rapproche ton roi pendant que la dame garde la boîte.',
      'Suis le roi avec la dame (toujours à un saut de cavalier) : la boîte rétrécit jusqu’au bord.',
      'Attention au pat : quand le roi est au bord, laisse-lui toujours une case et amène ton roi.',
      'Mat : la dame donne échec sur le bord, ton roi garde les cases de fuite.',
    ],
    moves: line('Qe3@1 Kd6 Kd3@2 Kd7 Kc4@2 Kd6 Qe8@3 Kc7 Kc5@2 Kb7 Qe7+@3 Ka6 Kc6@4 Ka5 Qa3#@5'),
  },
  {
    level: 'krr',
    fen: '8/8/8/8/4k3/1R6/8/R3K3 w - - 0 1',
    intro: 'Deux tours matent sans l’aide du roi : c’est l’« échelle ».',
    steps: [
      'Une tour coupe une rangée (ici b3 coupe la 3e) ; l’autre donne échec sur la rangée suivante : le roi doit reculer.',
      'Les tours avancent en échelle : chacune à son tour donne échec une rangée plus loin.',
      'Si le roi s’approche d’une tour, éloigne-la à l’autre bout de la rangée : elle garde la même barrière.',
      'Ne donne jamais un échec sur une case que le roi peut prendre : vérifie avant chaque coup.',
      'Mat sur la dernière rangée : une tour donne échec, l’autre garde l’avant-dernière.',
    ],
    moves: line('Ra4+@1 Kd5 Rb5+@2 Kc6 Rh5@3 Kb6 Rg4@4 Kc6 Rg6+@2 Kd7 Rh7+@2 Ke8 Rg8#@5'),
  },
  {
    level: 'kr',
    fen: '8/8/5k2/8/8/8/8/R3K3 w - - 0 1',
    intro: 'Avec une seule tour, ton roi doit participer : c’est la méthode de la « boîte ».',
    steps: [
      'Rapproche ton roi du roi adverse.',
      'La tour coupe une colonne ou une rangée : le roi adverse est enfermé dans une « boîte ».',
      'Rétrécis la boîte dès que c’est possible, en gardant la tour loin du roi adverse.',
      'Rois face à face (opposition) : échec de la tour, le roi recule. Sinon, joue un coup d’attente avec la tour.',
      'Mat sur le bord : échec de la tour quand les rois sont face à face.',
    ],
    moves: line('Ke2@1 Ke5 Rd1@2 Kf6 Rd3@3 Ke5 Kf3@1 Kf6 Rd5@3 Ke6 Ke4@1 Kf6 Re5@3 Kg6 Kf4@1 Kf6 Re3@4 Kg6 Re6+@4 Kg7 Kf5@1 Kf7 Re1@4 Kg7 Re7+@4 Kf8 Kf6@1 Kg8 Kg6@1 Kf8 Re1@4 Kg8 Re8#@5'),
  },
  {
    level: 'kbb',
    fen: '8/8/4k3/8/8/8/3K4/2B2B2 w - - 0 1',
    intro: 'Les deux fous (un sur chaque couleur) matent avec l’aide du roi, toujours dans un coin.',
    steps: [
      'Les deux fous, côte à côte, forment une barrière en diagonale que le roi ne peut pas franchir.',
      'Ton roi avance pour soutenir les fous et prendre des cases au roi adverse.',
      'Repousse le roi vers un coin en rapprochant la barrière (attention au pat : laisse-lui une case).',
      'Dans le coin, ton roi garde les cases de fuite ; un fou prépare l’échec final.',
      'Mat : un fou donne échec, l’autre fou et ton roi gardent les dernières cases.',
    ],
    moves: line('Bc4+@1 Ke7 Bb2@1 Kd6 Kd3@2 Kc5 Bf7@3 Kc6 Ba2@3 Kb5 Kd4@2 Ka4 Kc5@2 Ka5 Bb3@3 Ka6 Kc6@2 Ka5 Bc3+@3 Ka6 Bc4+@3 Ka7 Be5@4 Ka8 Kc7@4 Ka7 Bd4+@4 Ka8 Bd5#@5'),
  },
];
