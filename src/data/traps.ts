// Pièges d'ouverture : 3 chapitres. Chaque piège = une suite depuis le début (coups SAN) jusqu'au moment critique
// (la victime a le trait), le coup fautif, la punition (coup clé + suite), les bonnes défenses, une mini-leçon en mots,
// une règle et deux indices. Tout est vérifié coup par coup par Stockfish (scripts/verify-traps.ts → docs/PIEGES.md).

export type TrapChapterId = 'mats' | 'dame' | 'mes';

export interface TrapChapter { id: TrapChapterId; name: string; intro: string }

export const TRAP_CHAPTERS: TrapChapter[] = [
  { id: 'mats', name: 'Mats rapides', intro: 'Les mats en quelques coups qui finissent beaucoup de parties de débutants.' },
  { id: 'dame', name: 'Dame perdue', intro: 'Fourchette, clouage, échec à la découverte, pion empoisonné : la dame tombe en un coup.' },
  { id: 'mes', name: 'Pièges de mes ouvertures', intro: 'Les pièges qui existent dans les lignes de mon répertoire (Londres, Anglaise, …c5/…g6, Londres en défense).' },
];

export interface TrapDef {
  id: string;
  chapter: TrapChapterId;
  name: string;
  /** Chapitre 3 : l'ouverture de mon répertoire concernée. */
  opening?: string;
  /** Suite depuis la position de départ jusqu'au moment critique (la victime a le trait). */
  line: string[];
  /** Le coup fautif de la victime. */
  blunder: string;
  /** La punition : coup clé, puis la suite (réponses comprises). */
  punish: string[];
  /** Bonnes défenses au moment critique (vérifiées : elles tiennent). */
  good: string[];
  /** Ce que la punition rapporte. */
  gain: string;
  lesson: [string, string];
  rule: string;
  /** Indice 1 (en mots) pour « Défends-toi » et pour « Punis-le » ; l'indice 2 surligne la pièce à jouer. */
  hintDefend: string;
  hintPunish: string;
}

export const TRAPS: TrapDef[] = [
  // ------------------------------------------------------------------ 1. Mats rapides
  {
    id: 'berger-h5', chapter: 'mats', name: 'Mat du berger (dame en h5)',
    line: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5'], blunder: 'Nf6', punish: ['Qxf7#'], good: ['g6', 'Qe7', 'Qf6'], gain: 'le mat',
    lesson: ['Sa dame en h5 et son fou en c4 visent tous les deux le pion f7, qui n’est défendu que par ton roi.',
      'Si ton cavalier attaque sa dame en f6 sans protéger f7, sa dame prend f7 : échec et mat.'],
    rule: 'Quand sa dame et son fou visent f7, défends f7 avant tout (pion g6 ou dame en e7).',
    hintDefend: 'Compte les pièces qui visent ton pion f7, et celles qui le défendent.',
    hintPunish: 'Le pion f7 n’est défendu que par son roi, et ton fou protège ta dame.',
  },
  {
    id: 'berger-f3', chapter: 'mats', name: 'Mat du berger (dame en f3)',
    line: ['e4', 'e5', 'Bc4', 'Nc6', 'Qf3'], blunder: 'Nd4', punish: ['Qxf7#'], good: ['Nf6'], gain: 'le mat',
    lesson: ['Sa dame en f3 et son fou en c4 visent f7, par la colonne f et par la diagonale.',
      'Ton cavalier en d4 attaque sa dame, mais elle prend f7 : échec et mat.'],
    rule: 'Avant d’attaquer sa dame, regarde ce qu’elle menace : ici, ton cavalier en f6 bouche la colonne f.',
    hintDefend: 'Sa dame et son fou visent f7 : bouche la colonne f.',
    hintPunish: 'Le pion f7 n’est défendu que par son roi, et ton fou protège ta dame.',
  },
  {
    id: 'fou', chapter: 'mats', name: 'Mat du fou (pions f et g)',
    line: ['f3', 'e5'], blunder: 'g4', punish: ['Qh4#'], good: ['Nc3', 'e3', 'e4'], gain: 'le mat',
    lesson: ['Pousser les pions f et g ouvre la diagonale qui va de sa dame jusqu’à ton roi.',
      'Sa dame descend en h4 : échec et mat, ton roi n’a aucune case et rien ne peut s’interposer.'],
    rule: 'Ne pousse pas les pions f et g devant ton roi en début de partie.',
    hintDefend: 'Regarde la diagonale qui va de sa dame jusqu’à ton roi : ne l’ouvre pas davantage.',
    hintPunish: 'Son roi n’a plus de case : cherche un échec de ta dame sur la diagonale ouverte.',
  },
  {
    id: 'legal', chapter: 'mats', name: 'Mat de Légal',
    line: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6', 'Nxe5'], blunder: 'Bxd1', punish: ['Bxf7+', 'Ke7', 'Nd5#'],
    good: ['dxe5', 'Be6'], gain: 'le mat',
    lesson: ['Son cavalier prend e5 et laisse sa dame en prise : c’est un appât.',
      'Si ton fou prend sa dame, son fou prend f7 avec échec, ton roi va en e7 et son autre cavalier fait mat en d5.'],
    rule: 'Quand on t’offre la dame gratuitement, cherche d’abord le piège : ses échecs, ses prises, ses attaques.',
    hintDefend: 'Sa dame est offerte : avant de la prendre, regarde quels échecs il aurait ensuite.',
    hintPunish: 'Commence par un échec avec ton fou en f7 : son roi n’aura plus qu’une case.',
  },
  {
    id: 'g5-f7', chapter: 'mats', name: 'Le cavalier g5 sur f7',
    line: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5'], blunder: 'h6', punish: ['Nxf7', 'Qe7', 'Nxh8'], good: ['d5'], gain: 'la tour',
    lesson: ['Son cavalier en g5 et son fou en c4 attaquent f7 deux fois, et f7 n’est défendu que par ton roi.',
      'Si tu joues un coup lent, son cavalier prend f7 et attaque ta dame et ta tour en même temps.'],
    rule: 'Contre le cavalier en g5, coupe la diagonale de son fou tout de suite (pion d5).',
    hintDefend: 'Deux de ses pièces visent f7 : coupe la diagonale de son fou.',
    hintPunish: 'Le pion f7 n’est défendu que par son roi ; derrière, il y a sa dame et sa tour.',
  },

  // ------------------------------------------------------------------ 2. Dame perdue
  {
    id: 'fourchette-c2', chapter: 'dame', name: 'Fourchette de cavalier en c2',
    line: ['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6', 'Qe3', 'Nb4'], blunder: 'Nf3', punish: ['Nxc2+', 'Ke2', 'Nxe3'],
    good: ['Qe2', 'Na3', 'Qb3'], gain: 'la dame',
    lesson: ['Son cavalier en b4 vise la case c2, d’où il donnerait échec à ton roi en attaquant ta dame en e3 et ta tour en a1.',
      'Si ton coup ne défend pas c2, son cavalier y saute avec échec et prend ta dame au coup suivant.'],
    rule: 'Quand un cavalier ennemi approche de c2 (ou de c7), regarde quelles pièces il toucherait de là.',
    hintDefend: 'Regarde la case c2 : quelles pièces son cavalier toucherait-il de là ?',
    hintPunish: 'Ton cavalier peut donner échec en attaquant en même temps sa dame et sa tour.',
  },
  {
    id: 'elephant', chapter: 'dame', name: 'Clouage de la dame sur le roi (piège de l’éléphant)',
    line: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Nbd7', 'cxd5', 'exd5'], blunder: 'Nxd5',
    punish: ['Nxd5', 'Bxd8', 'Bb4+', 'Qd2', 'Bxd2+', 'Kxd2', 'Kxd8'], good: ['e3', 'Nf3', 'Qc2'], gain: 'une pièce',
    lesson: ['Le cavalier en f6 n’est cloué que sur la dame, pas sur le roi : il peut reprendre en d5.',
      'Si ton fou prend alors sa dame, son fou donne échec en b4 : ta dame doit s’interposer en d2, clouée sur ton roi, et elle tombe.'],
    rule: 'Une pièce clouée sur la dame (pas sur le roi) peut quand même bouger : vérifie ce que ça coûte.',
    hintDefend: 'Le cavalier en f6 n’est cloué que sur sa dame, pas sur son roi.',
    hintPunish: 'Reprends en d5 : si son fou prend ta dame, ton fou donne échec en b4.',
  },
  {
    id: 'petrov', chapter: 'dame', name: 'Échec à la découverte (Petrov)',
    line: ['e4', 'e5', 'Nf3', 'Nf6', 'Nxe5', 'Nxe4', 'Qe2'], blunder: 'Nf6', punish: ['Nc6+', 'Be7', 'Nxd8'], good: ['Qe7'], gain: 'la dame',
    lesson: ['Sa dame en e2 et ton roi en e8 sont sur la même colonne, avec seulement son cavalier entre les deux.',
      'Si ton cavalier recule en f6, son cavalier saute en c6 : échec à la découverte par sa dame, et ta dame en d8 est prise.'],
    rule: 'Quand une pièce adverse est entre sa dame (ou sa tour) et ton roi, chaque saut de cette pièce peut être un échec.',
    hintDefend: 'Sa dame et ton roi sont sur la même colonne : bloque-la avec ta dame.',
    hintPunish: 'Ton cavalier peut bouger en découvrant un échec de ta dame, et attaquer sa dame en même temps.',
  },
  {
    id: 'b2', chapter: 'dame', name: 'Pion empoisonné en b2',
    line: ['d4', 'd5', 'Bf4', 'c5', 'e3', 'Qb6', 'Nc3'], blunder: 'Qxb2', punish: ['Nxd5', 'Bf5', 'Rb1', 'Qxa2', 'Nc7+'],
    good: ['Nf6', 'e6'], gain: 'du matériel',
    lesson: ['Son pion b2 semble gratuit, mais si ta dame le prend, elle s’éloigne de ton roi.',
      'Son cavalier prend d5 et menace la fourchette en c7 sur ton roi et ta tour, pendant que sa tour chasse ta dame.'],
    rule: 'Ne prends pas un pion loin de ton camp avec la dame tant que tes pièces ne sont pas sorties.',
    hintDefend: 'Ta dame peut prendre un pion, mais regarde où ses cavaliers pourraient sauter ensuite.',
    hintPunish: 'Ton cavalier peut prendre un pion au centre et menacer une fourchette sur son roi et sa tour.',
  },

  // ------------------------------------------------------------------ 3. Pièges de mes ouvertures
  {
    id: 'englund', chapter: 'mes', opening: 'Londres (contre 1…e5, gambit Englund)', name: 'Gambit Englund : le fou en c3',
    line: ['d4', 'e5', 'dxe5', 'Nc6', 'Nf3', 'Qe7', 'Bf4', 'Qb4+', 'Bd2', 'Qxb2'], blunder: 'Bc3', punish: ['Bb4', 'Bd2', 'Qxa1'],
    good: ['Nc3'], gain: 'la tour (et le mat si sa dame vient en d2)',
    lesson: ['Sa dame prend b2 et vise ta tour en a1 ; ton fou en c3 la chasserait, mais il pourrait être cloué.',
      'Après ton fou en c3, son fou en b4 cloue ton fou : si ta dame le défend en d2, sa dame fait mat en c1, sinon ta tour tombe. Ton répertoire joue le fou en g5 au 4e coup pour éviter tout ça.'],
    rule: 'Contre l’Englund, défends ta tour avec le cavalier (c3), pas avec le fou.',
    hintDefend: 'Sa dame attaque ta tour : défends-la avec une pièce qui ne peut pas être clouée.',
    hintPunish: 'Son fou en c3 est seul devant sa dame et son roi : cloue-le avec ton fou.',
  },
  {
    id: 'anglaise-d5', chapter: 'mes', opening: 'Anglaise', name: 'Anglaise : reprendre en d5 avec la dame',
    line: ['c4', 'e5', 'Nc3', 'Nf6', 'g3', 'd5', 'cxd5'], blunder: 'Qxd5', punish: ['Nxd5', 'Nxd5'], good: ['Nxd5'], gain: 'la dame',
    lesson: ['Après l’échange en d5, cette case est surveillée par son cavalier en c3.',
      'Si ta dame reprend en d5, son cavalier la prend : tu perds ta dame pour un pion.'],
    rule: 'Avant de reprendre, compte qui surveille la case : reprends avec la pièce la moins précieuse.',
    hintDefend: 'Avant de reprendre en d5, regarde qui surveille cette case.',
    hintPunish: 'Sa dame est sur une case que ton cavalier surveille.',
  },
  {
    id: 'g6-f3', chapter: 'mes', opening: 'Système …c5 / …g6', name: 'Mon système …g6 contre le fou c4 et la dame f3',
    line: ['e4', 'c5', 'Bc4', 'Nc6', 'Qf3'], blunder: 'g6', punish: ['Qxf7#'], good: ['Nf6', 'e6'], gain: 'le mat',
    lesson: ['Contre sa dame en f3 et son fou en c4, le coup automatique de mon système (pion g6) laisse f7 sans défense.',
      'Sa dame prend f7 : échec et mat, car son fou la protège.'],
    rule: 'Dans mon système, quand sa dame est en f3, le cavalier en f6 d’abord : il bouche la colonne f.',
    hintDefend: 'Sa dame en f3 et son fou en c4 visent f7 : bouche la colonne f.',
    hintPunish: 'La case f7 n’est défendue que par son roi.',
  },
  {
    id: 'londres-def-g6', chapter: 'mes', opening: 'Londres en défense (contre cavalier c3, pions f3, g4, h4)', name: 'Londres en défense : le fou g6 enfermé',
    line: ['d4', 'd5', 'Nc3', 'Nf6', 'Bf4', 'c6', 'e3', 'Bf5', 'f3', 'e6', 'g4', 'Bg6', 'h4'], blunder: 'Nbd7', punish: ['h5', 'Bxh5', 'gxh5'],
    good: ['h5', 'h6'], gain: 'une pièce',
    lesson: ['Contre ses pions g4 et h4, ton fou en g6 n’a presque plus de cases : le pion h5 le prendrait au piège.',
      'Si tu sors une autre pièce (cavalier en d7, fou en d6), son pion arrive en h5 et ton fou est perdu.'],
    rule: 'Quand ses pions g4 et h4 avancent vers ton fou, fais-lui d’abord une case (pion h6 ou h5).',
    hintDefend: 'Ton fou en g6 : si son pion arrive en h5, où pourra-t-il aller ?',
    hintPunish: 'Son fou en g6 n’a plus de case de fuite : attaque-le avec un pion.',
  },
];
