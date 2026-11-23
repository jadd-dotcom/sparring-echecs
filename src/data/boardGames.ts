// Mode « Maîtrise de l'échiquier » : débuts courants (chapitre 6, visualisation) et parties courtes célèbres
// (chapitre 7, rejouer de tête). Notation anglaise standard ; l'affichage la convertit en figurines.

/** Débuts courants (au moins 8 demi-coups chacun) : les suites du chapitre 6 en sont tirées, parfois modifiées. */
export const OPENING_LINES: string[][] = [
  'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6',        // italienne
  'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6',        // espagnole
  'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6',       // sicilienne
  'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6',       // Dragon accéléré
  'e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7',         // française
  'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5',       // Caro-Kann
  'e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4',      // Petrov
  'e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6',      // scandinave
  'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6',      // écossaise
  'e4 e5 f4 exf4 Nf3 g5 h4 g4',          // gambit du roi
  'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7',         // Gambit Dame refusé
  'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6',          // Est-indienne
  'd4 Nf6 c4 e6 Nc3 Bb4 e3 O-O',         // Nimzo-indienne
  'd4 d5 Bf4 Nf6 e3 c5 c3 Nc6',          // Londres
  'c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7',         // anglaise
].map((l) => l.split(' '));

/** Parties courtes célèbres, à rejouer de tête (chapitre 7a). */
export const SHORT_GAMES: { name: string; moves: string[]; note: string }[] = [
  { name: 'Le mat du lion (mat du sot)', moves: 'f3 e5 g4 Qh4#'.split(' '), note: 'Le mat le plus rapide : la dame noire profite de la diagonale e1-h4 ouverte.' },
  { name: 'Le coup du berger', moves: 'e4 e5 Bc4 Nc6 Qh5 Nf6 Qxf7#'.split(' '), note: 'La dame et le fou visent ensemble f7, protégé seulement par le roi.' },
  { name: 'Le mat de Légal', moves: 'e4 e5 Nf3 d6 Bc4 Bg4 Nc3 g6 Nxe5 Bxd1 Bxf7+ Ke7 Nd5#'.split(' '), note: 'Les Blancs donnent leur dame pour mater avec trois pièces mineures.' },
  { name: 'Le mat à l’étouffée de la Caro-Kann', moves: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Qe2 Ngf6 Nd6#'.split(' '), note: 'Le roi noir, entouré de ses propres pièces, ne peut pas échapper au cavalier.' },
  { name: 'Le piège de Blackburne', moves: 'e4 e5 Nf3 Nc6 Bc4 Nd4 Nxe5 Qg5 Nxf7 Qxg2 Rf1 Qxe4+ Be2 Nf3#'.split(' '), note: 'Les Blancs prennent un pion « gratuit » en e5 et se font mater par le cavalier en f3.' },
  { name: 'Le piège de l’Englund', moves: 'd4 e5 dxe5 Qe7 Nf3 Nc6 Bf4 Qb4+ Bd2 Qxb2 Bc3 Bb4 Qd2 Bxc3 Qxc3 Qc1#'.split(' '), note: 'La dame noire prend en b2, puis mate en c1 sur la première rangée.' },
  { name: 'La partie de l’Opéra (Morphy, 1858)', moves: 'e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#'.split(' '), note: 'Développement rapide, colonnes ouvertes et sacrifices : le modèle de la partie d’attaque.' },
];
