// Plan (une phrase) à la fin de chaque ligne complétée du répertoire actif, par ouverture et par ligne (coups SAN
// séparés par des espaces, depuis le début). Écrit à la main ; utilisé par scripts/lesson-lines.ts.
export const LINE_PLANS: Record<string, Record<string, string>> = {
  english: {
    "c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 e4 f5 Nge2 Nf6 O-O O-O exf5 Bxf5 h3 Qd7":
      "Sa dame et son fou visent ton pion h3 : protège-le par Kh2, puis Be3 et Qd2, et un cavalier viendra en d5 ou e4.",
    "c4 e5 Nc3 Nc6 g3 Nf6 Bg2 Bc5 e3 O-O Nge2 d6 O-O a6 d4 Ba7 h3 Re8":
      "Ensuite dxe5 pour ouvrir la colonne d, puis b3 et Bb2 : tes deux fous visent le centre et l’aile dame.",
    "c4 e5 Nc3 Nf6 g3 d5 cxd5 Nxd5 Bg2 Nb6 d3 Be7 Nf3 Nc6 Be3 O-O a3 Be6 O-O h6 Rc1":
      "Ta tour c1 et ton fou g2 pèsent sur l’aile dame : continue avec b4 puis b5 pour chasser son cavalier c6 et attaquer c7.",
    "c4 e5 Nc3 Nf6 g3 Bb4 Bg2 O-O e4 Bxc3 bxc3 c6 Ne2 d5 cxd5 cxd5 exd5 Nxd5 O-O Nc6":
      "Ta paire de fous compense tes pions abîmés de l’aile dame : prépare d4 (avec h3 et Re1), puis active ton fou c1.",
    "c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 e4 e5 Nge2 Nge7 O-O O-O Be3 Nd4 Qd2 Be6":
      "Plan : f4 pour ouvrir la colonne f ; si …exf4, Nxf4 chasse son fou e6 et ta tour f1 entre dans le jeu.",
    "c4 Nf6 Nc3 g6 g3 Bg7 Bg2 O-O e4 d6 Nge2 e5 O-O c6 d3 a6 h3 b5 Be3 Nbd7":
      "Plan : a3 et b3, puis Rc1 : tu protèges c4 et tu ouvres l’aile dame, où ses pions …a6 et …b5 sont avancés.",
    "c4 e6 Nc3 d5 cxd5 exd5 d4 Nf6 Bg5 Be7 e3 O-O Bd3 Nbd7 Nge2 Re8 O-O Nf8 Qc2 c6":
      "Plan typique de cette structure : f3 puis e4 pour prendre tout le centre ; ton fou d3 et ta dame c2 visent alors son roi.",
    "c4 d5 cxd5 Qxd5 Nc3 Qd8 d4 Nf6 Nf3 g6 e4 Bg7 Be2 c5 d5 O-O O-O":
      "Tes pions d5 et e4 forment un grand centre : protège-le (Re1, Bf4, Qd2) et pousse e5 au bon moment pour chasser son cavalier f6.",
    "c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 Nf6 e4 O-O Nge2 d6 O-O a6 h3 Rb8 a4 Ne8":
      "Ensuite Be3 et Qd2, puis Nd5 : ton pion a4 freine …b5 et ton cavalier en d5 devient ta meilleure pièce.",
    "c4 c5 Nc3 Nf6 g3 d5 cxd5 Nxd5 Bg2 Nc7 Nf3 Nc6 O-O e5 d3 Be7 Nd2 Bd7 Nc4 f6":
      "Plan : f4 pour attaquer son pion e5 ; si …b5, ton cavalier c4 passe en e3, puis en d5 ou f5.",
    "c4 Nf6 Nc3 e6 d4 Bb4 e3 O-O Bd3 d5 cxd5 exd5 Ne2 Re8 O-O Bd6 a3 c6 Qc2 Nbd7":
      "Comme dans la ligne 1…e6 : f3 puis e4 pour prendre le centre, avec ton fou d3 tourné vers son roi.",
    "c4 d5 cxd5 Qxd5 Nc3 Qd8 d4 Nf6 Nf3 e6 e4 Be7 Bd3 O-O O-O c5 dxc5 Nfd7 Qe2 Nc6 Rd1":
      "Ta tour d1 sur la colonne ouverte et ton pion e4 te donnent l’avantage : sors ton fou c1 (Be3), puis double tes tours sur la colonne d.",
    "c4 d5 cxd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 c6 Bd2 Qb6 e4 Bg4 Qa4 Bxf3 gxf3":
      "Ta paire de fous et ton grand centre valent bien les pions doublés f : fais le grand roque, puis ta tour g1 attaque sur la colonne g ouverte.",
    "c4 d5 cxd5 Nf6 Nf3 Nxd5 d4 g6 e4 Nb6 h3 Bg7 Nc3 O-O Be3 Nc6 Qd2 f5":
      "Pousse e5 pour chasser ses pièces du centre ; ta tour viendra en d1 soutenir d4, et Bh6 échangera son fou g7.",
  },
  london: {
    "d4 e6 Bf4 c5 e3 d5 Nf3 Nf6 c3 Nc6 Nbd2 Nh5 Bg3 Nxg3 hxg3 Qb6 Qc2 g6 Bd3 Bd7":
      "Plan : Rd1 et Qb1 protègent ton centre et le pion b2, puis tu roques ; ensuite e4 ouvre le jeu pour ton fou d3.",
    "d4 c5 d5 Nf6 Nf3 e6 Nc3 exd5 Nxd5 Nxd5 Qxd5 Nc6 e4 d6 Ng5 Qe7 Bb5 Bd7 Bc4 Nd8":
      "Roque, et replace ton cavalier g5 s’il est chassé (Nh3, puis f4) : ta dame d5 et ton fou c4 visent f7, et f4 ouvrira la colonne f.",
    "d4 g6 Nf3 Nf6 Bf4 Bg7 e3 O-O Be2 d6 h3 c5 c3 Nc6 O-O b6 a4 Bb7 Nbd2":
      "Garde ton fou f4 (recule en h2 s’il est attaqué par …e5 ou …Nh5) et pousse a5 pour ouvrir la colonne a : ta chaîne c3-d4-e3 ne craint rien.",
    "d4 f5 Bf4 d6 e3 Nf6 Nf3 g6 h3 Nc6 Bd3 Bg7 O-O O-O Bg3 Qe8 Qe2 Kh8 Nc3 a6":
      "Plan : e4 pour ouvrir le centre contre son pion f5 ; si son cavalier attaque ton fou g3 (…Nh5), recule en h2 et garde ton pion d4 protégé.",
    "d4 Nf6 Bf4 g6 e3 Bg7 Nf3 O-O Be2 d6 h3 c5 c3 Nc6 O-O b6 a4 Bb7 Nbd2":
      "Garde ton fou f4 (recule en h2 s’il est attaqué par …e5 ou …Nh5) et pousse a5 pour ouvrir la colonne a : ta chaîne c3-d4-e3 ne craint rien.",
    "d4 e5 dxe5 Nc6 Nf3 Qe7 Bg5 Qb4+ Nc3 Qa5 Qd5 Bc5 a3 h6 Bh4 g5 Bg3 g4 Nd2 Nge7":
      "Son cavalier e7 attaque ta dame : Qc4 la met à l’abri ; tu as un pion de plus et ses pions g sont trop avancés, développe-toi (e3, Be2) puis roque.",
    "d4 e5 dxe5 Nc6 Nf3 Qe7 Bg5 Qc5 Be3 Qe7 Nc3 Nxe5 Bf4 Nxf3+ gxf3 c6 Qd2 d5 O-O-O Nf6":
      "Grand roque fait et un pion de plus : pousse e4 pour ouvrir le centre contre son roi resté en e8, ta tour d1 est déjà sur la colonne d.",
    "d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3 b6 Ne5 Bb7 f4":
      "C’est le plan de la leçon : cavalier e5 soutenu par f4, puis ta dame sur l’aile roi ; si son cavalier vient en f5 attaquer ton fou g3, recule-le en f2.",
    "d4 d5 Bf4 Nf6 e3 g6 Nf3 Bg7 Be2 O-O O-O c5 c3 Nc6 h3 b6 Nbd2 Bb7 Ne5":
      "Ton cavalier e5 bloque son fou b7 : s’il l’échange (…Nxe5), reprends avec le fou (Bxe5), puis f4 et ta dame sur l’aile roi pour l’attaque.",
    "d4 d5 Bf4 c5 e3 Nc6 Nf3 Nf6 Nbd2 e6 c3 Bd6 Bg3 O-O Bd3 b6 Ne5 Bb7 f4":
      "C’est le plan de la leçon : cavalier e5 soutenu par f4, puis ta dame sur l’aile roi ; si son cavalier vient en f5 attaquer ton fou g3, recule-le en f2.",
    "d4 d5 Bf4 Bf5 e3 e6 Bd3 Bxd3 Qxd3 Nf6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bxd6 Qxd6 O-O O-O":
      "Position calme : tes tours viennent en d1 et c1, et tu prépares e4 (avec Qe2) pour ouvrir le centre ; ton cavalier f3 peut aussi sauter en e5.",
    "d4 Nf6 Bf4 e6 e3 c5 c3 Nc6 Nd2 d5 Ngf3 Bd6 Bg3 O-O Bd3 b6 Ne5 Bb7 f4":
      "C’est le plan de la leçon : cavalier e5 soutenu par f4, puis ta dame sur l’aile roi ; si son cavalier vient en f5 attaquer ton fou g3, recule-le en f2.",
  },
  "g6-system": {
    "e4 c5 Nc3 Nc6 Bc4 g6 Qf3 Nf6 d3 Bg7 Nge2 d6 O-O O-O Qg3 Bd7":
      "Ton pion f7 est à l’abri : …Na5 échange son fou c4, puis …Rb8 et …b5 attaquent sur l’aile dame.",
    "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nc3 Bg7 Be3 Nf6 Be2 O-O O-O d5 exd5 Nxd5 Nxd5 Qxd5 Bf3 Qc4 Nxc6 bxc6 b3 Qa6":
      "Ton fou g7 vise c3 et a1 : sors ton fou c8 (…Bf5 ou …Be6), puis tes tours sur les colonnes b et d contre ses pions de l’aile dame.",
    "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Bg7 Be3 Nf6 Nc3 Ng4 Qxg4 Nxd4 Qd1 Ne6 Rc1 Qa5 Qd2 d6":
      "Roque, puis …b6 et …Bb7 (ou …Be6) : avec ta dame a5 et ton fou g7, vise ses pions c3 et c4.",
    "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nxc6 bxc6 Bd3 Bg7 O-O Nf6 Nc3 d6 h3 O-O Be3 Rb8":
      "Ta tour b8 attaque b2 : joue ensuite …Qc7 et …Nd7 pour libérer ton fou g7, et pousse …c5 pour gagner de la place.",
    "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nxc6 bxc6 Qd4 Nf6 e5 Nd5 e6 f6 exd7+ Bxd7 Bc4 e5":
      "Ton pion e5 chasse sa dame : ensuite sors ton fou f8 (…Be7), échange son fou c4 par …Be6 et roque ; tes pions c6 et e5 te donnent de l’espace.",
    "e4 c5 Nf3 Nc6 Bc4 g6 O-O Bg7 c3 e6 d4 cxd4 cxd4 d5 exd5 exd5 Bb5 Ne7 Re1 O-O":
      "Vise son pion d4, isolé : ton cavalier ira en f5, ta dame en b6, ton fou g7 tire déjà dessus, et ta tour prend la colonne c.",
    "e4 c5 Nf3 Nc6 Bb5 g6 O-O Bg7 Re1 e5 Bxc6 dxc6 d3 Qe7 Nbd2 Nf6 Nc4 Nd7":
      "Ton cavalier d7 protège e5 : roque, puis …b6 et …f6 rendent ton centre solide.",
    "e4 c5 Nf3 Nc6 Nc3 g6 d4 cxd4 Nxd4 Bg7 Be3 Nf6 Bc4 O-O Bb3 d6":
      "Ensuite …Bd7 et …Rc8, puis …Nxd4 et …b5 : tu attaques son fou b3 et tu ouvres la colonne c.",
    "e4 c5 Nf3 Nc6 c3 Nf6 d4 cxd4 e5 Nd5 cxd4 d6 Bc4 Nb6 Bb3 dxe5":
      "S’il reprend en e5, échange les cavaliers puis les dames (…Qxd1+) : la finale est égale et ton fou c8 sort en f5.",
    "e4 c5 Nf3 Nc6 Bc4 g6 Nc3 Bg7 d3 e6 O-O Nge7 Bb3 O-O Re1 d6 Ne2 Ne5 Nxe5 dxe5":
      "Ensuite …b6 et …Qc7, puis ton cavalier e7 vient en c6 et vise d4 : ton pion e5 tient le centre.",
    "e4 c5 Nf3 Nc6 Bb5 g6 Bxc6 dxc6 d3 Bg7 h3 Nf6 Nc3 O-O Be3 b6 Qd2 e5":
      "S’il échange les fous de cases noires (Bh6), reprends avec le roi ; puis …Qd6 et …Ne8 : tes pions c5 et e5 tiennent la case d4.",
    "e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 f4 e6 Nf3 Nge7 O-O O-O Be3 Nd4 Qd2 Rb8":
      "Avance …b5 et …b4 avec ta tour b8 ; s’il lance g4 contre ton roi, l’avance …f5 freine son attaque.",
    "e4 c5 Nc3 Nc6 f4 g6 Nf3 Bg7 Bc4 e6 O-O Nge7 d3 d5 Bb3 O-O":
      "S’il pousse e5, le centre se ferme : …b6 puis …Ba6 met ton fou sur une diagonale libre, et …c4 attaque à l’aile dame.",
    "e4 c5 Nc3 Nc6 Nf3 g6 d4 cxd4 Nxd4 Bg7 Be3 Nf6 Bc4 O-O":
      "Après Bb3, …d6 puis …Bd7 et …Rc8 : ta tour prend la colonne c, et …Na5 ou …b5 attaquera son fou b3.",
    "e4 c5 Nc3 Nc6 Bb5 g6 Bxc6 bxc6 f4 Bg7 d3 Nf6 Nf3 d6 h3 O-O":
      "Ta tour va en b8 sur la colonne semi-ouverte et ton cavalier f6 passe par e8 vers c7 ; ta paire de fous et …c4 te donnent du jeu à l’aile dame.",
    "e4 c5 Nc3 Nc6 Bc4 g6 Nf3 Bg7 d3 Nf6 h3 d6 O-O O-O Be3 e6":
      "Ton pion e6 coupe la diagonale de son fou c4 et prépare …d5 ; s’il ouvre le centre avec d4, réponds …d5 et ton fou g7 devient très fort.",
    "e4 c5 c3 Nf6 e5 Nd5 d4 cxd4 Nf3 Nc6 cxd4 d6 Bc4 Nb6 Bb5 dxe5 Nxe5 Bd7 Nxd7 Qxd7":
      "Continue avec …e6, …Be7 et le roque : son pion d4 est isolé, place un cavalier en d5 devant lui et attaque-le.",
    "e4 c5 d4 cxd4 c3 Nf6 e5 Nd5 Nf3 Nc6 cxd4 d6 Bc4 Nb6":
      "Même position que dans la ligne 2.c3 : …dxe5 ouvre le centre, puis …g6 et …Bg7 pour viser son pion d4.",
    "e4 c5 d3 g6 g3 Bg7 Bg2 Nc6 c3 Nf6 d4 d6 d5 Na5 Na3 O-O":
      "Attaque son pion d5 avec …e6 (ou …b5), et méfie-toi de b4 qui chasse ton cavalier a5 : réponds-y par …cxb4.",
    "e4 c5 c4 Nc6 Nc3 g6 Nge2 Bg7 d3 d6 g3 Nf6 h3 O-O Bg2 Bd7":
      "Ensuite …e5 (la case d4 pour ton cavalier), puis …Rb8 et …a6 pour préparer …b5 contre son pion c4.",
    "e4 c5 c3 Nf6 e5 Nd5 Nf3 Nc6 d4 cxd4 cxd4 d6 Bc4 Nb6":
      "Même position que dans la ligne 2.c3 : …dxe5 ouvre le centre, puis …g6 et …Bg7 pour viser son pion d4.",
    "e4 c5 d4 cxd4 Nf3 Nc6 Nxd4 g6 Nc3 Bg7 Be3 Nf6":
      "Tu retrouves la ligne principale : contre Bc4, roque ; si Nxc6 bxc6 puis e5, recule ton cavalier en g8, puis …d6 attaque son pion e5.",
    "e4 c5 Bc4 Nc6 Nf3 g6 O-O Bg7 c3 e6":
      "Ensuite …Nge7 et …d5 : ton pion e6 a coupé la diagonale de son fou c4, et …d5 te donnera le centre.",
    "e3 c5 d4 g6 c4 Bg7 Nc3 Nf6 d5 d6 Nf3 O-O Bd3 e6 h3 exd5":
      "Après cxd5, ton plan est à l’aile dame : …Na6 puis …Nc7, …Re8 et …b5 ; ton fou g7 tire sur la grande diagonale.",
  },
  "london-def": {
    "d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 Nbd7 cxd5 exd5 Qc2 Bd6 e3 O-O Bd3 h6 Bh4 Be7":
      "Ensuite …Re8, puis …Nf8 et …Ng6 ou …Ne4 : ta tour tient la colonne e, et ton fou c8 sortira en g4 ou e6.",
    "d4 d5 Nf3 c6 Bf4 Nf6 e3 Bf5 c4 e6 Qb3 Qc8 Nc3 Nbd7 cxd5 Nxd5 Bg3 Bg6 Rc1 h6":
      "Ensuite …Be7 et le roque ; si Bc4, …Nxc3 lui laisse un pion faible en c3, et ta tour viendra sur la colonne c.",
    "d4 d5 Nf3 c6 c4 Nf6 e3 Bf5 Nc3 e6":
      "Position de la leçon : contre Nh4, recule ton fou en g6 ; après Nxg6 hxg6, ta tour h8 a la colonne h, et contre Qb3 joue …Qc7 ou …Qb6.",
    "d4 d5 e3 Bf5 c4 e6 Qb3 Nc6 Bd2 Rb8 Nf3 Nf6 Bc3 Bd6 c5 Be7 Nbd2 O-O Bb5 Qc8":
      "Plan : …Ne4 installe ton cavalier au centre et propose des échanges ; ensuite …f6 puis …e5 ouvre le jeu contre sa chaîne c5-d4.",
    "d4 d5 e3 Bf5 Bd3 e6 Nf3 c6 c4 Nf6 O-O Nbd7 Bxf5 exf5 Qd3 g6 cxd5 Nxd5 e4 fxe4":
      "Après Qxe4+, pare l’échec par …Be7, puis …N7f6 : tes cavaliers d5 et f6 tiennent le centre, et tu roques dès que possible.",
    "c4 c6 Nf3 d5 e3 Nf6 d4 Bf5 Nc3 e6 Nh4 Bg6 Qb3 Qc7 Nxg6 hxg6 h4 Bd6 Bd2 Nbd7":
      "S’il fait le grand roque, attaque son roi avec …a5 et …b5 ; ta tour h8 garde la colonne h ouverte contre son pion h4.",
    "c4 c6 e4 d5 exd5 Nf6 d4 cxd5 Nf3 e6 Nc3 Be7 cxd5 Nxd5 Bd3 Nf6 O-O O-O Re1 Nc6":
      "Son pion d4 est isolé : bloque la case d5 avec un cavalier, sors ton fou c8 en b7 (…a6 puis …b5), et vise d4 avec tes tours.",
    "c4 c6 Nc3 d5 cxd5 cxd5 d4 Nf6 Bf4 e6 e3 Bd6 Bg3 O-O Bd3 h6 Rc1 Be7 Nf3 Qb6":
      "Ta dame b6 vise b2 : …Nc6 et …Bd7, puis …Rc8 pour contester la colonne c ; le pion b2 tombe s’il l’oublie.",
    "Nf3 d5 g3 c6 Bg2 Nf6 O-O Bf5 d3 e6 Nh4 Bg4 Qe1 Nbd7 h3 Bh5 e4 h6 f4 Qb6+":
      "Après Kh2, ouvre par …dxe4, puis fais le grand roque : ta dame b6 et ton fou f8 (…Bc5) visent son roi.",
    "Nf3 d5 c4 c6 e3 Nf6 d4 Bf5 Nc3 e6":
      "Position de la leçon : contre Nh4, recule ton fou en g6 ; après Nxg6 hxg6, ta tour h8 a la colonne h, et contre Qb3 joue …Qc7 ou …Qb6.",
    "Nf3 d5 d4 c6 Bf4 Nf6 e3 Bf5 c4 e6":
      "Position de la leçon (Londres contre Londres) : contre Qb3, protège b7 par …Qc8, puis …Nbd7, …Be7 et le roque.",
    "Nf3 d5 e3 c6 c4 Nf6 d4 Bf5 Nc3 e6":
      "Position de la leçon : contre Nh4, recule ton fou en g6 ; après Nxg6 hxg6, ta tour h8 a la colonne h, et contre Qb3 joue …Qc7 ou …Qb6.",
    "d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Bd6 Bd3 Nbd7 e4 dxc4 Bxc4 b5 Bb3 b4 Na4 Be7":
      "S’il pousse e5, ton cavalier va en d5 ; ensuite …Bb7, le roque et …c5 pour attaquer son centre, et son cavalier a4 est mal placé.",
    "d4 d5 c4 c6 cxd5 cxd5 Nc3 Nf6 Bf4 e6 e3 Bd6 Bg3 O-O Nf3 h6 Bh4 Nbd7 Bd3 Be7":
      "Ensuite …b6 et …Bb7, puis …Rc8 : tes tours prennent la colonne c ouverte, et ton fou e7 a décloué ton cavalier f6.",
    "d4 d5 Bf4 Nf6 e3 Bf5 Nf3 c6 c4 e6 Qb3 Qc8 Nc3 Nbd7 cxd5 Nxd5 Bg3 Bg6 Rc1 h6":
      "Ensuite …Be7 et le roque ; si Bc4, …Nxc3 lui laisse un pion faible en c3, et ta tour viendra sur la colonne c.",
    "d4 d5 Nc3 Nf6 Bf4 c6 e3 Bf5 f3 e6 g4 Bg6 h4 h6 Nge2 Nbd7 Qd2 Nb6 Ng3 Bd6":
      "Plan : …Bxf4 échange son meilleur fou ; après exf4, ta dame en d6 vise son pion f4, et tu fais le grand roque, loin de ses pions g4 et h4.",
  },
};
