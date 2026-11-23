// Leçons d'ouvertures (mode Leçon) : ligne principale du répertoire, une phrase par coup, le plan, une partie type.
// Répertoire actuel : Anglaise (Blancs) puis système …c5/…g6 (Noirs) ; les leçons Londres, GDR et Française restent (Archives).
// Les mots techniques sont notés [[clé]] ou [[clé|texte affiché]] ; ils sont expliqués (GLOSSARY) à leur 1re apparition.
// Parties types : suite de la ligne principale jouée par Stockfish 16 (1 s par coup, les deux camps) — aucun vrai joueur.
// Coups en notation anglaise standard (l'affichage les convertit en figurines).

export interface OpeningLesson {
  openingId: string;
  intro: string;
  /** Ligne principale du répertoire : un coup par demi-coup, avec une phrase sur son but. */
  moves: { san: string; why: string }[];
  /** Le plan, en 3 phrases. */
  plan: [string, string, string];
  /** Partie type : suite de la ligne principale et commentaires des moments clés (indice dans `moves`). */
  model: { moves: string[]; notes: Record<number, string>; end: string };
}

export const GLOSSARY: Record<string, string> = {
  centre: 'les cases d4, d5, e4 et e5 ; les pièces qui les contrôlent sont plus actives.',
  'développer': 'sortir une pièce de sa case de départ vers une case où elle est active.',
  roque: 'coup spécial qui met le roi à l’abri et rapproche une tour du centre (petit roque côté roi, grand roque côté dame).',
  'chaîne de pions': 'pions placés en diagonale qui se protègent l’un l’autre ; sa base (le pion de derrière) est son point faible.',
  fianchetto: 'placer un fou sur une grande diagonale (en b2, g2, b7 ou g7) après avoir avancé d’une case le pion b ou g.',
  'avant-poste': 'case avancée où une pièce est bien installée, protégée par un pion et difficile à chasser.',
  gambit: 'pion offert en début de partie pour obtenir autre chose en échange (du temps, le centre).',
  clouage: 'une pièce ne peut pas bouger sans exposer une pièce plus importante placée derrière elle (ici la dame).',
  'colonne semi-ouverte': 'colonne où il n’y a plus de pion de son camp : une tour y devient active.',
  'pions pendants': 'deux pions voisins (ici c5 et d5) sans autre pion à côté pour les soutenir.',
  'roques opposés': 'les deux rois sont roqués de côtés différents : chacun attaque avec les pions de l’aile où se trouve le roi adverse.',
  'mauvais fou': 'fou gêné par ses propres pions placés sur des cases de sa couleur.',
  'grande diagonale': 'la plus longue diagonale (a1-h8 ou h1-a8) ; un fou en fianchetto y surveille le centre et l’autre aile.',
};

export const OPENING_LESSONS: OpeningLesson[] = [
  {
    openingId: 'english',
    intro: 'L’Anglaise (1.c4) est une ouverture tranquille pour les Blancs : avec le système fermé, tu places tes pièces aux mêmes cases contre presque toutes les défenses.',
    moves: [
      { san: 'c4', why: 'Le pion c4 surveille la case d5 du [[centre]] sans s’y montrer : c’est l’Anglaise.' },
      { san: 'e5', why: 'Les Noirs occupent le centre avec leur pion e.' },
      { san: 'Nc3', why: 'Ton cavalier se [[développer|développe]] et surveille lui aussi les cases d5 et e4.' },
      { san: 'Nc6', why: 'Les Noirs développent leur cavalier, qui soutient le pion e5.' },
      { san: 'g3', why: 'Le pion g3 prépare le [[fianchetto]] de ton fou f1.' },
      { san: 'g6', why: 'Les Noirs font la même chose de leur côté.' },
      { san: 'Bg2', why: 'Ton fou se place sur la [[grande diagonale]] h1-a8, d’où il vise le centre et l’aile dame.' },
      { san: 'Bg7', why: 'Le fou noir se place lui aussi sur une grande diagonale.' },
      { san: 'd3', why: 'Le pion d3 ouvre la diagonale de ton fou c1 et protège la case e4.' },
      { san: 'd6', why: 'Les Noirs ouvrent eux aussi la diagonale de leur fou c8.' },
      { san: 'e4', why: 'Le pion e4 prend de l’espace : avec c4, tes deux pions tiennent la case d5.' },
      { san: 'Nge7', why: 'Le cavalier noir sort en e7 pour laisser son pion f libre d’avancer.' },
      { san: 'Nge2', why: 'Ton second cavalier sort en e2 et non en f3 : ainsi il ne bloque pas ton pion f.' },
      { san: 'O-O', why: 'Les Noirs roquent : leur roi est à l’abri.' },
      { san: 'O-O', why: 'Tu fais le petit [[roque]] : ton roi est à l’abri derrière le fou g2.' },
      { san: 'Be6', why: 'Le fou noir vise la case d5 et ton pion c4.' },
      { san: 'Nd5', why: 'Ton cavalier saute en d5, un [[avant-poste]] protégé par tes pions c4 et e4.' },
      { san: 'Qd7', why: 'La dame noire prépare …Bh3 pour échanger ton fou g2.' },
      { san: 'Be3', why: 'Ton dernier fou se développe : tes tours peuvent maintenant venir sur l’aile dame.' },
      { san: 'f5', why: 'Les Noirs attaquent ton pion e4 avec leur pion f : c’est leur plan sur l’aile roi.' },
    ],
    plan: [
      'Tes pièces vont presque toujours aux mêmes cases : pions c4, d3 et e4 (ou e3), fou en g2, cavaliers en c3 et e2, petit roque.',
      'Au milieu de partie, joue sur l’aile dame : avance tes pions b et a (b4, b5), avec une tour sur la colonne b ou c.',
      'Ton cavalier d5 est ta meilleure pièce : garde-le, et réponds à …f5 en prenant (exf5) pour ouvrir la diagonale de ton fou g2.',
    ],
    model: {
      moves: ['b4', 'Rae8', 'Rc1', 'Nc8', 'b5', 'Nd8', 'exf5', 'Bxf5', 'Nec3', 'c6', 'Nb4', 'Bh3', 'Bxh3', 'Qxh3', 'Ne4', 'Ne6'],
      notes: {
        0: 'Les Blancs lancent leur pion b : c’est le plan typique de l’Anglaise fermée, l’attaque sur l’aile dame.',
        2: 'La tour vient sur la colonne c, qui s’ouvrira quand les pions s’échangeront.',
        4: 'Le pion b5 gagne de l’espace et chasse les pièces noires de l’aile dame.',
        6: 'Les Blancs prennent en f5 : la diagonale du fou g2 s’ouvre et la case e4 se libère pour un cavalier.',
        8: 'Le cavalier e2 revient en c3 pour soutenir le cavalier d5.',
        12: 'Les Noirs ont échangé les fous de cases blanches, comme prévu avec …Qd7 et …Bh3.',
        14: 'Le cavalier s’installe en e4, une belle case centrale d’où il vise d6 et f6.',
      },
      end: 'Position un peu meilleure pour les Blancs : leur jeu sur l’aile dame avance et leurs cavaliers sont bien placés.',
    },
  },
  {
    openingId: 'g6-system',
    intro: 'Avec les Noirs, tu joues le même système que l’Anglaise, inversé : …c5, …Nc6, …g6, …Bg7 et …d6. Contre 1.e4 puis 2.Nf3 et 3.d4, cela donne le Dragon accéléré.',
    moves: [
      { san: 'e4', why: 'Les Blancs occupent le [[centre]] avec leur pion e.' },
      { san: 'c5', why: 'Ton pion c5 surveille la case d4 sans t’exposer : c’est la Défense sicilienne.' },
      { san: 'Nf3', why: 'Le cavalier blanc se [[développer|développe]] et prépare d4.' },
      { san: 'Nc6', why: 'Ton cavalier se développe et surveille les cases d4 et e5.' },
      { san: 'd4', why: 'Les Blancs ouvrent le centre en attaquant ton pion c5.' },
      { san: 'cxd4', why: 'Tu échanges ton pion c contre le pion d blanc : il te reste deux pions au centre (d et e).' },
      { san: 'Nxd4', why: 'Le cavalier blanc reprend le pion et s’installe au centre.' },
      { san: 'g6', why: 'Tu prépares tout de suite le [[fianchetto]] de ton fou f8 : c’est le Dragon accéléré.' },
      { san: 'Nc3', why: 'Le second cavalier blanc protège le pion e4.' },
      { san: 'Bg7', why: 'Ton fou se place sur la [[grande diagonale]] et vise le cavalier d4 et l’aile dame.' },
      { san: 'Be3', why: 'Le fou blanc protège le cavalier d4.' },
      { san: 'Nf6', why: 'Ton second cavalier se développe et attaque le pion e4.' },
      { san: 'Bc4', why: 'Le fou blanc vise ton pion f7, le point faible près de ton roi.' },
      { san: 'O-O', why: 'Tu fais le petit [[roque]] : ton roi est à l’abri derrière le fou g7.' },
      { san: 'Bb3', why: 'Le fou blanc se met à l’abri en b3, d’où il vise toujours f7.' },
      { san: 'd6', why: 'Le pion d6 ouvre la diagonale de ton fou c8 et surveille la case e5.' },
      { san: 'f3', why: 'Le pion f3 protège e4 et empêche ton cavalier de venir en g4.' },
      { san: 'Bd7', why: 'Ton fou se développe : tes deux tours peuvent maintenant se rejoindre.' },
      { san: 'Qd2', why: 'La dame blanche se développe et prépare le grand roque.' },
      { san: 'Nxd4', why: 'Tu échanges les cavaliers pour te libérer.' },
      { san: 'Bxd4', why: 'Le fou blanc reprend au centre, face à ton fou g7.' },
      { san: 'b5', why: 'Ton pion b lance l’attaque sur l’aile dame, là où le roi blanc veut roquer.' },
    ],
    plan: [
      'Tes pièces vont presque toujours aux mêmes cases : pions c5, d6 et g6, fou en g7, cavaliers en c6 et f6, petit roque.',
      'Ton fou g7 est ta meilleure pièce : garde-le, car sur la grande diagonale il vise le centre et l’aile dame.',
      'Au milieu de partie, attaque sur l’aile dame avec …b5, une tour sur la [[colonne semi-ouverte|colonne c]] et ta dame en a5 ou c7.',
    ],
    model: {
      moves: ['a4', 'bxa4', 'Bxa4', 'Qc7', 'Bxd7', 'Qxd7', 'O-O', 'Rfc8', 'b3', 'Qc7', 'Ra4', 'e5', 'Rc4', 'Qa5', 'Be3', 'Rxc4', 'bxc4', 'Rc8'],
      notes: {
        0: 'Les Blancs attaquent ton pion b5 avec leur pion a.',
        1: 'Tu prends : la colonne b s’ouvre pour tes tours.',
        3: 'Ta dame vient sur la colonne c, ta colonne d’attaque dans la Sicilienne.',
        6: 'Les Blancs ne font pas le grand roque : avec ton jeu sur l’aile dame, leur roi y serait en danger.',
        7: 'Ta tour f8 rejoint ta dame sur la colonne c.',
        11: 'Ton pion e5 chasse le fou d4 et prend de l’espace au centre.',
        15: 'Tu échanges une paire de tours sur la case c4.',
        17: 'Ta dernière tour reprend la colonne c et vise le pion c4.',
      },
      end: 'Position équilibrée : tu as gardé ton fou g7 et ta colonne c, ton jeu est actif.',
    },
  },
  {
    openingId: 'london',
    intro: 'Le Système de Londres est une ouverture tranquille pour les Blancs : on place presque toujours les mêmes pièces aux mêmes cases, quoi que fassent les Noirs.',
    moves: [
      { san: 'd4', why: 'Le pion prend une case du [[centre]] et ouvre la diagonale du fou c1.' },
      { san: 'd5', why: 'Les Noirs prennent aussi leur part du centre.' },
      { san: 'Bf4', why: 'Le fou sort tout de suite, avant que le pion e3 ne lui ferme le chemin : c’est la signature du Londres.' },
      { san: 'Nf6', why: 'Les Noirs [[développer|développent]] un cavalier vers le centre.' },
      { san: 'e3', why: 'Le pion e3 soutient d4 et ouvre la diagonale du fou f1.' },
      { san: 'c5', why: 'Les Noirs attaquent d4 avec un pion de côté, le plan le plus actif.' },
      { san: 'c3', why: 'Le pion c3 protège d4 une deuxième fois : la [[chaîne de pions]] c3-d4-e3 est solide.' },
      { san: 'Nc6', why: 'Le cavalier noir ajoute une pression sur d4.' },
      { san: 'Nd2', why: 'Le cavalier se développe en d2, car le pion occupe c3 ; il pourra soutenir la case e4.' },
      { san: 'e6', why: 'Les Noirs ouvrent la diagonale de leur fou f8.' },
      { san: 'Ngf3', why: 'Le second cavalier vient en f3, vers le centre, et prépare le [[roque]].' },
      { san: 'Bd6', why: 'Les Noirs proposent l’échange des fous de cases noires.' },
      { san: 'Bg3', why: 'Le fou recule sans s’échanger lui-même. Si les Noirs prennent (…Bxg3), tu reprends avec le pion h (hxg3) et ta tour h1 gagne la colonne h.' },
      { san: 'O-O', why: 'Les Noirs roquent : leur roi est à l’abri.' },
      { san: 'Bd3', why: 'Le fou f1 se place sur la diagonale qui vise le roi noir en h7.' },
      { san: 'b6', why: 'Les Noirs préparent le [[fianchetto]] de leur fou c8 en b7.' },
      { san: 'Ne5', why: 'Le cavalier saute en e5, un [[avant-poste]] au centre, d’où il gêne les Noirs et prépare l’attaque.' },
      { san: 'Bb7', why: 'Le fou noir vise la grande diagonale, vers e4.' },
      { san: 'f4', why: 'Le pion f4 soutient le cavalier e5 et prépare une attaque sur l’aile roi.' },
    ],
    plan: [
      'Tes pièces vont presque toujours aux mêmes cases : pions d4-e3-c3, fous f4 (puis g3) et d3, cavaliers d2 et f3 (puis e5), petit roque.',
      'Au milieu de partie, installe un cavalier en e5 soutenu par le pion f4, puis attaque le roi noir avec la dame (h5 ou f3) et une tour sur la colonne f.',
      'Si les Noirs échangent ton cavalier e5, reprends avec un pion pour garder de l’espace au centre et ouvrir une colonne à tes tours.',
    ],
    model: {
      moves: ['Be7', 'O-O', 'Ne8', 'Qh5', 'f5', 'Ndf3', 'Nf6', 'Qh3', 'Nxe5', 'dxe5', 'Ne4', 'Bh4', 'Bxh4', 'Nxh4', 'Qe7', 'Rad1', 'g6', 'g4', 'Rad8', 'gxf5', 'exf5', 'Nf3', 'Kg7', 'Qh4'],
      notes: {
        1: 'Les Blancs roquent : le roi est à l’abri et la tour f1 soutient le pion f4.',
        3: 'La dame rejoint l’aile roi : avec le cavalier e5 et le fou d3, trois pièces visent le roi noir.',
        4: 'Les Noirs répondent par …f5 pour fermer la diagonale du fou d3 vers h7.',
        9: 'Les Noirs ont échangé le cavalier e5 ; les Blancs reprennent avec le pion d, qui gagne de l’espace et ouvre la colonne d.',
        10: 'Un cavalier noir s’installe à son tour en e4, un avant-poste protégé par le pion d5.',
        13: 'Les fous de cases noires sont échangés : il reste à chaque camp un fou et un cavalier.',
        17: 'Les Blancs avancent le pion g pour ouvrir des lignes vers le roi noir.',
        20: 'La [[colonne semi-ouverte|colonne g]] est maintenant à moitié ouverte : les tours blanches pourront y venir face au roi noir.',
        23: 'La dame vise le roi noir : la position est équilibrée, mais l’initiative est aux Blancs.',
      },
      end: 'Position équilibrée : les Blancs ont suivi leur plan (cavalier en e5, attaque sur l’aile roi).',
    },
  },
  {
    openingId: 'qgd',
    intro: 'Le Gambit Dame refusé est une défense solide contre 1.d4 : tu tiens le centre avec tes pions d5 et e6, sans prendre le pion offert.',
    moves: [
      { san: 'd4', why: 'Les Blancs occupent le [[centre]].' },
      { san: 'd5', why: 'Tu prends ta part du centre et bloques le pion d4.' },
      { san: 'c4', why: 'Les Blancs offrent un pion pour détourner ton pion d5 : c’est le [[gambit]] Dame.' },
      { san: 'e6', why: 'Tu refuses le gambit et soutiens d5 avec un pion : ton centre tient.' },
      { san: 'Nc3', why: 'Le cavalier blanc attaque d5 une deuxième fois.' },
      { san: 'Nf6', why: 'Tu [[développer|développes]] ton cavalier, qui défend d5 et vise le centre.' },
      { san: 'Bg5', why: 'Le fou blanc fait un [[clouage]] : ton cavalier f6 ne peut plus bouger sans exposer ta dame.' },
      { san: 'Be7', why: 'Ton fou se place en e7 et supprime le clouage.' },
      { san: 'e3', why: 'Les Blancs ouvrent la diagonale de leur fou f1.' },
      { san: 'O-O', why: 'Tu fais le [[roque]] : ton roi est à l’abri.' },
      { san: 'Nf3', why: 'Le second cavalier blanc se développe vers le centre.' },
      { san: 'h6', why: 'Tu demandes au fou g5 de se décider : reculer ou s’échanger.' },
      { san: 'Bh4', why: 'Le fou recule mais garde la pression sur ton cavalier f6. Ce n’est plus un clouage : ton fou e7 fait écran devant ta dame.' },
      { san: 'b6', why: 'Tu prépares le [[fianchetto]] de ton fou c8 en b7 : c’est la variante Tartakower.' },
      { san: 'cxd5', why: 'Les Blancs échangent au centre.' },
      { san: 'Nxd5', why: 'Tu reprends avec le cavalier pour libérer ton jeu par des échanges.' },
      { san: 'Bxe7', why: 'Le fou blanc s’échange contre le tien.' },
      { san: 'Qxe7', why: 'Tu reprends avec la dame, qui se développe en même temps.' },
      { san: 'Nxd5', why: 'Les Blancs échangent aussi les cavaliers.' },
      { san: 'exd5', why: 'Tu reprends avec le pion e : ton pion d5 tient le centre et la colonne e s’ouvre pour tes tours.' },
      { san: 'Rc1', why: 'La tour blanche vient sur la [[colonne semi-ouverte]] c pour viser ton pion c7.' },
      { san: 'Be6', why: 'Ton fou se développe en e6 et protège le pion d5.' },
    ],
    plan: [
      'Tes pièces : pions d5 et e6, fou en e7, cavalier en f6, petit roque, puis fou c8 en b7 ou e6 et tours sur les colonnes c et e.',
      'Au milieu de partie, cherche le coup libérateur …c5 pour attaquer le centre blanc et ouvrir des lignes à tes pièces.',
      'Échanger des pièces soulage ta position : vise d’abord l’égalité, puis joue contre les faiblesses blanches.',
    ],
    model: {
      moves: ['Bd3', 'c5', 'b3', 'Nd7', 'O-O', 'a5', 'h3', 'Nf6', 'Re1', 'Rfc8', 'Bc2', 'Ra7', 'Qe2', 'a4', 'bxa4', 'Bd7', 'dxc5', 'bxc5', 'e4', 'Bxa4', 'exd5', 'Qxe2', 'Rxe2', 'Nxd5'],
      notes: {
        1: 'Le coup libérateur …c5 : ton pion attaque le centre blanc, exactement comme dans le plan.',
        7: 'Ton cavalier revient en f6 en passant par d7 : il protège d5 et surveille e4.',
        9: 'Ta tour vient sur la colonne c, qui va s’ouvrir.',
        13: 'Tu attaques l’aile dame avec le pion a pour créer des faiblesses chez les Blancs.',
        17: 'Après les échanges, tes pions c5 et d5 sont des [[pions pendants]] : forts s’ils avancent, à surveiller s’ils sont bloqués.',
        18: 'Les Blancs frappent ton centre avec le pion e.',
        21: 'Tu échanges les dames : la position se simplifie.',
        23: 'Tu reprends le pion d5 : la finale est équilibrée, tu as égalisé.',
      },
      end: 'Finale équilibrée : les Noirs ont atteint leur but, égaliser grâce à …c5 et aux échanges.',
    },
  },
  {
    openingId: 'french',
    intro: 'La Défense française répond à 1.e4 par …e6 puis …d5 : une défense solide où tu attaques ensuite la chaîne de pions blanche.',
    moves: [
      { san: 'e4', why: 'Les Blancs occupent le [[centre]] avec le pion e.' },
      { san: 'e6', why: 'Tu prépares …d5 en soutenant d’avance la case d5 : c’est la Défense française.' },
      { san: 'd4', why: 'Les Blancs prennent tout le centre avec deux pions.' },
      { san: 'd5', why: 'Tu attaques le pion e4 : la bataille du centre commence.' },
      { san: 'Nc3', why: 'Le cavalier blanc défend le pion e4.' },
      { san: 'Nf6', why: 'Tu [[développer|développes]] ton cavalier et attaques e4 une deuxième fois : c’est la variante classique.' },
      { san: 'Bg5', why: 'Le fou blanc fait un [[clouage]] : ton cavalier f6 ne peut plus bouger sans exposer ta dame.' },
      { san: 'Be7', why: 'Ton fou se glisse en e7 et supprime le clouage.' },
      { san: 'e5', why: 'Les Blancs avancent le pion e, chassent ton cavalier et gagnent de l’espace.' },
      { san: 'Nfd7', why: 'Ton cavalier recule en d7, d’où il pourra attaquer le pion e5.' },
      { san: 'Bxe7', why: 'Les Blancs échangent les fous.' },
      { san: 'Qxe7', why: 'Tu reprends avec la dame, qui se développe en même temps.' },
      { san: 'f4', why: 'Le pion f4 soutient e5 : la [[chaîne de pions]] blanche d4-e5 est solide.' },
      { san: 'a6', why: 'Tu empêches un cavalier blanc de venir en b5 et prépares l’attaque sur l’aile dame.' },
      { san: 'Nf3', why: 'Le cavalier blanc soutient les pions d4 et e5.' },
      { san: 'c5', why: 'Tu attaques la base de la chaîne blanche, le pion d4 : c’est le plan clé de la Française.' },
      { san: 'Qd2', why: 'La dame blanche se développe et prépare le grand roque.' },
      { san: 'Nc6', why: 'Ton cavalier ajoute une pression sur le pion d4.' },
      { san: 'O-O-O', why: 'Les Blancs font le grand [[roque]], côté dame.' },
      { san: 'b5', why: 'Tu lances ton pion b vers le roi blanc : l’attaque sur l’aile dame commence.' },
    ],
    plan: [
      'Tes pièces : pions e6 et d5, cavaliers en d7 et c6, dame en e7 ; tout ton jeu vise la chaîne de pions blanche d4-e5.',
      'Au milieu de partie, attaque la base de la chaîne avec …c5, puis ouvre les colonnes de l’aile dame avec …b5 et …b4.',
      'Ton fou c8 est un [[mauvais fou]], gêné par tes pions e6 et d5 : patience, il sortira quand le centre s’ouvrira.',
    ],
    model: {
      moves: ['g4', 'b4', 'Ne2', 'O-O', 'f5', 'cxd4', 'f6', 'gxf6', 'exf6', 'Qxf6', 'Nf4', 'e5', 'Nxd5', 'Qxf3', 'Bg2', 'Qxg4', 'Rhg1', 'Kh8'],
      notes: {
        0: 'Les Blancs ont roqué côté dame et lancent leurs pions côté roi : ce sont des [[roques opposés]], chacun attaque sur une aile.',
        1: 'Ton pion b chasse le cavalier c3 : ton attaque avance.',
        3: 'Tu roques côté roi pour quitter le centre, mais c’est le côté où avancent les pions blancs (g4, f5) : ton roi n’y sera pas tranquille.',
        4: 'La poussée f5 attaque ta chaîne de pions à sa base, le pion e6.',
        5: 'Tu prends en d4 et ouvres la colonne c vers le roi blanc.',
        9: 'Les Blancs ont donné des pions pour ouvrir des lignes vers ton roi ; ta dame reprend en f6.',
        13: 'Position très tactique : les Blancs prennent ton pion d5 et ta dame prend le cavalier f3.',
        15: 'Ta dame prend encore un pion ; elle est active mais exposée.',
        17: 'La tour blanche arrive sur la colonne g ouverte : tu mets ton roi en h8, hors de sa portée.',
      },
      end: 'Position compliquée et à peu près équilibrée : chaque camp a attaqué sur son aile.',
    },
  },
];

/** Blocs de la ligne principale : 6 demi-coups (= 3 coups de chaque camp). */
export function lessonBlocks(n: number, size = 6): [number, number][] {
  const out: [number, number][] = [];
  for (let s = 0; s < n; s += size) out.push([s, Math.min(n, s + size)]);
  return out;
}

const TERM = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/** Texte sans balises (le mot affiché). */
export const plainText = (t: string) => t.replace(TERM, (_, key: string, shown?: string) => shown ?? key);

/** Termes techniques d'un texte (clés du glossaire). */
export const termsOf = (t: string) => [...t.matchAll(TERM)].map((m) => m[1]);

/** Tous les textes d'une leçon dans l'ordre d'affichage (pour repérer la 1re apparition de chaque terme). */
export function lessonTexts(l: OpeningLesson): { where: string; text: string }[] {
  return [
    ...l.moves.map((m, i) => ({ where: `move:${i}`, text: m.why })),
    ...l.plan.map((p, i) => ({ where: `plan:${i}`, text: p })),
    ...Object.entries(l.model.notes).map(([k, v]) => ({ where: `model:${k}`, text: v })),
  ];
}

/** Pour chaque endroit, les termes à expliquer (1re apparition dans la leçon). */
export function firstAppearances(l: OpeningLesson): Record<string, string[]> {
  const seen = new Set<string>();
  const out: Record<string, string[]> = {};
  for (const { where, text } of lessonTexts(l)) {
    const fresh = termsOf(text).filter((k) => !seen.has(k));
    fresh.forEach((k) => seen.add(k));
    if (fresh.length) out[where] = fresh;
  }
  return out;
}
