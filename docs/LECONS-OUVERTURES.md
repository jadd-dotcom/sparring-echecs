# Leçons d'ouvertures (mode Leçon)

Contenu affiché dans l'appli, généré depuis `src/data/openingLessons.ts` (`npm run lessons-doc`). Ordre conseillé : Blancs — l’Anglaise (1.c4) et le Londres (1.d4) ; Noirs — le système …c5/…g6 (contre 1.e4) et le Londres en défense (contre 1.d4, 1.c4, 1.Nf3) ; pour chacune : 1. Leçon → 2. Drill → 3. Partie à thème. Les leçons de l’ancien répertoire (Gambit Dame refusé, Défense française) restent consultables dans l’onglet « Archives » ; elles sont reprises en fin de document.

Déroulé d'une leçon : (1) la ligne principale par blocs de 3 coups, une phrase par coup ; (2) après chaque bloc, l'élève rejoue ses coups (1re erreur : case de départ surlignée ; 2e : solution) ; (3) le plan en 3 phrases ; (4) une partie type commentée ; (5) parfois un bloc supplémentaire (lignes de côté : attaques rapides sur f7, autres premiers coups…). Les coups appris entrent dans le drill (1re révision le lendemain).

(6) les lignes par carrefour : toutes les lignes du répertoire actif qui n’avaient pas encore d’explication, rangées par carrefour (là où son coup change ta réponse), avec un « pourquoi » à chaque coup (les deux camps) et une phrase de plan à la fin. Ces « pourquoi » sont calculés sur la position (`src/lib/moveWhy.ts` : roque, prise, clouage, pion qui prend le centre, développement…, ou l’explication déjà écrite pour la même position) ; les phrases de plan sont écrites à la main (`src/data/linePlans.ts`) d’après la suite conseillée par Stockfish 19 (profondeur 16) à la fin de la ligne. Génération : `npm run lesson-lines`.

Toutes les lignes du répertoire et leur vérification Stockfish : `docs/REPERTOIRE.md`.

Les parties types prolongent la ligne principale avec Stockfish (1 s par coup, les deux camps) : ce ne sont pas des parties de joueurs réels.

## Lignes complétées (répertoire actif)

| Ouverture | Lignes complétées | Carrefours | Coups expliqués |
|---|---|---|---|
| Anglaise (système fermé) (Blancs) | 14 | 11 | 212 |
| Système de Londres (Blancs) | 12 | 5 | 202 |
| Système …c5 / …g6 (Dragon accéléré) (Noirs) | 24 | 13 | 300 |
| Londres en défense (Noirs) | 16 | 8 | 210 |

## Glossaire (expliqué à la 1re apparition dans chaque leçon)

- **centre** : les cases d4, d5, e4 et e5 ; les pièces qui les contrôlent sont plus actives.
- **développer** : sortir une pièce de sa case de départ vers une case où elle est active.
- **roque** : coup spécial qui met le roi à l’abri et rapproche une tour du centre (petit roque côté roi, grand roque côté dame).
- **chaîne de pions** : pions placés en diagonale qui se protègent l’un l’autre ; sa base (le pion de derrière) est son point faible.
- **fianchetto** : placer un fou sur une grande diagonale (en b2, g2, b7 ou g7) après avoir avancé d’une case le pion b ou g.
- **avant-poste** : case avancée où une pièce est bien installée, protégée par un pion et difficile à chasser.
- **gambit** : pion offert en début de partie pour obtenir autre chose en échange (du temps, le centre).
- **clouage** : une pièce ne peut pas bouger sans exposer une pièce plus importante placée derrière elle (ici la dame).
- **colonne semi-ouverte** : colonne où il n’y a plus de pion de son camp : une tour y devient active.
- **pions pendants** : deux pions voisins (ici c5 et d5) sans autre pion à côté pour les soutenir.
- **roques opposés** : les deux rois sont roqués de côtés différents : chacun attaque avec les pions de l’aile où se trouve le roi adverse.
- **mauvais fou** : fou gêné par ses propres pions placés sur des cases de sa couleur.
- **grande diagonale** : la plus longue diagonale (a1-h8 ou h1-a8) ; un fou en fianchetto y surveille le centre et l’autre aile.

## Anglaise (système fermé) (Blancs)

L’Anglaise (1.c4) est une ouverture tranquille pour les Blancs : avec le système fermé, tu places tes pièces aux mêmes cases contre presque toutes les défenses.

### 1-2. Ligne principale, par blocs

**Bloc 1**

- 1. c4 — Le pion c4 surveille la case d5 du centre sans s’y montrer : c’est l’Anglaise. _(mot expliqué : centre)_
- 1... e5 — Les Noirs occupent le centre avec leur pion e.
- 2. Nc3 — Ton cavalier se développe et surveille lui aussi les cases d5 et e4. _(mot expliqué : développer)_
- 2... Nc6 — Les Noirs développent leur cavalier, qui soutient le pion e5.
- 3. g3 — Le pion g3 prépare le fianchetto de ton fou f1. _(mot expliqué : fianchetto)_
- 3... g6 — Les Noirs font la même chose de leur côté.

**Bloc 2**

- 4. Bg2 — Ton fou se place sur la grande diagonale h1-a8, d’où il vise le centre et l’aile dame. _(mot expliqué : grande diagonale)_
- 4... Bg7 — Le fou noir se place lui aussi sur une grande diagonale.
- 5. d3 — Le pion d3 ouvre la diagonale de ton fou c1 et protège la case e4.
- 5... d6 — Les Noirs ouvrent eux aussi la diagonale de leur fou c8.
- 6. e4 — Le pion e4 prend de l’espace : avec c4, tes deux pions tiennent la case d5.
- 6... Nge7 — Le cavalier noir sort en e7 pour laisser son pion f libre d’avancer.

**Bloc 3**

- 7. Nge2 — Ton second cavalier sort en e2 et non en f3 : ainsi il ne bloque pas ton pion f.
- 7... O-O — Les Noirs roquent : leur roi est à l’abri.
- 8. O-O — Tu fais le petit roque : ton roi est à l’abri derrière le fou g2. _(mot expliqué : roque)_
- 8... Be6 — Le fou noir vise la case d5 et ton pion c4.
- 9. Nd5 — Ton cavalier saute en d5, un avant-poste protégé par tes pions c4 et e4. _(mot expliqué : avant-poste)_
- 9... Qd7 — La dame noire prépare …Bh3 pour échanger ton fou g2.

**Bloc 4**

- 10. Be3 — Ton dernier fou se développe : tes tours peuvent maintenant venir sur l’aile dame.
- 10... f5 — Les Noirs attaquent ton pion e4 avec leur pion f : c’est leur plan sur l’aile roi.

### 3. Le plan

1. Tes pièces vont presque toujours aux mêmes cases : pions c4, d3 et e4 (ou e3), fou en g2, cavaliers en c3 et e2, petit roque.
2. Au milieu de partie, joue sur l’aile dame : avance tes pions b et a (b4, b5), avec une tour sur la colonne b ou c.
3. Ton cavalier d5 est ta meilleure pièce : garde-le, et réponds à …f5 en prenant (exf5) pour ouvrir la diagonale de ton fou g2.

### 4. Partie type (Stockfish contre lui-même)

Coups : 11. b4 11... Rae8 12. Rc1 12... Nc8 13. b5 13... Nd8 14. exf5 14... Bxf5 15. Nec3 15... c6 16. Nb4 16... Bh3 17. Bxh3 17... Qxh3 18. Ne4 18... Ne6

Moments clés :

- 11. b4 — Les Blancs lancent leur pion b : c’est le plan typique de l’Anglaise fermée, l’attaque sur l’aile dame.
- 12. Rc1 — La tour vient sur la colonne c, qui s’ouvrira quand les pions s’échangeront.
- 13. b5 — Le pion b5 gagne de l’espace et chasse les pièces noires de l’aile dame.
- 14. exf5 — Les Blancs prennent en f5 : la diagonale du fou g2 s’ouvre et la case e4 se libère pour un cavalier.
- 15. Nec3 — Le cavalier e2 revient en c3 pour soutenir le cavalier d5.
- 17. Bxh3 — Les Noirs ont échangé les fous de cases blanches, comme prévu avec …Qd7 et …Bh3.
- 18. Ne4 — Le cavalier s’installe en e4, une belle case centrale d’où il vise d6 et f6.

Fin : Position un peu meilleure pour les Blancs : leur jeu sur l’aile dame avance et leurs cavaliers sont bien placés.

### 6. Les autres lignes, par carrefour

Chaque ligne se regarde puis se rejoue comme un bloc de la leçon ; ses coups entrent dans le drill. Accès : page de l’ouverture → onglet « Leçon » → sommaire.

#### Carrefour après 1.c4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.e4

À ce carrefour, il a plusieurs coups dans ton répertoire (6…Nge7, 6…f5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 6…f5** (début : 1. c4 e5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6 6. e4)

- 6... f5 — Le pion f5 prend de l’espace au centre et surveille e4.
- 7. Nge2 — Ton cavalier se développe en e2 et surveille d4.
- 7... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 8. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8... O-O — Petit roque : son roi se met à l’abri.
- 9. exf5 — Ton pion prend son pion f5 : la colonne e s’ouvre pour tes tours.
- 9... Bxf5 — Son fou reprend en f5 : le matériel reste égal.
- 10. h3 — Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite.
- 10... Qd7 — Sa dame se développe en d7.

_Le plan :_ Sa dame et son fou visent ton pion h3 : protège-le par Kh2, puis Be3 et Qd2, et un cavalier viendra en d5 ou e4.

#### Carrefour après 1.c4 e5 2.Nc3 Nc6 3.g3

À ce carrefour, il a plusieurs coups dans ton répertoire (3…g6, 3…Nf6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 3…Nf6** (début : 1. c4 e5 2. Nc3 Nc6 3. g3)

- 3... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 4. Bg2 — Ton fou se développe en g2 et vise son cavalier c6.
- 4... Bc5 — Son fou se développe en c5 et surveille d4.
- 5. e3 — Le pion e3 surveille d4, au centre.
- 5... O-O — Petit roque : son roi se met à l’abri.
- 6. Nge2 — Ton cavalier se développe en e2 et surveille d4.
- 6... d6 — Le pion d6 soutient son fou c5.
- 7. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 7... a6 — Le pion a6 contrôle b5 : ni ton fou ni ton cavalier ne pourront s’y installer.
- 8. d4 — Le pion d4 chasse son fou c5.
- 8... Ba7 — Son fou, attaqué par ton pion, s’écarte en a7 ; il surveille aussi d4.
- 9. h3 — Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite.
- 9... Re8 — Sa tour vient en e8 et soutient son pion e5.

_Le plan :_ Ensuite dxe5 pour ouvrir la colonne d, puis b3 et Bb2 : tes deux fous visent le centre et l’aile dame.

#### Carrefour après 1.c4 e5 2.Nc3

À ce carrefour, il a plusieurs coups dans ton répertoire (2…Nc6, 2…Nf6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 2…Nf6** (début : 1. c4 e5 2. Nc3)

- 2... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 3. g3 — Le pion g3 prépare le fianchetto de ton fou en g2.
- 3... d5 — Le pion d5 attaque ton pion c4.
- 4. cxd5 — Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours.
- 4... Nxd5 — Son cavalier reprend en d5 : le matériel reste égal.
- 5. Bg2 — Ton fou se développe en g2 et vise son cavalier d5.
- 5... Nb6 — Son cavalier, attaqué par ton cavalier et ton fou, s’écarte en b6 ; il surveille aussi d5.
- 6. d3 — Le pion d3 ouvre la diagonale de ton fou c1.
- 6... Be7 — Son fou se développe en e7.
- 7. Nf3 — Ton cavalier va en f3 et attaque son pion e5.
- 7... Nc6 — Son cavalier va en c6 et protège son pion e5, attaqué par ton cavalier ; il surveille aussi d4.
- 8. Be3 — Ton fou se développe en e3 et vise son cavalier b6.
- 8... O-O — Petit roque : son roi se met à l’abri.
- 9. a3 — Le pion a3 contrôle b4 : ni son fou ni son cavalier ne pourront s’y installer.
- 9... Be6 — Son fou se développe en e6 et surveille d5.
- 10. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 10... h6 — Le pion h6 contrôle g5 : ni ton fou ni ton cavalier ne pourront s’y installer, et son roi a une case de fuite.
- 11. Rc1 — Ta tour vient sur la colonne c, semi-ouverte.

_Le plan :_ Ta tour c1 et ton fou g2 pèsent sur l’aile dame : continue avec b4 puis b5 pour chasser son cavalier c6 et attaquer c7.

#### Carrefour après 1.c4 e5 2.Nc3 Nf6 3.g3

À ce carrefour, il a plusieurs coups dans ton répertoire (3…d5, 3…Bb4) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 3…Bb4** (début : 1. c4 e5 2. Nc3 Nf6 3. g3)

- 3... Bb4 — Son fou se développe en b4 et vise ton cavalier c3.
- 4. Bg2 — Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 4... O-O — Petit roque : son roi se met à l’abri.
- 5. e4 — Le pion e4 prend de l’espace au centre et surveille d5.
- 5... Bxc3 — Son fou prend ton cavalier c3.
- 6. bxc3 — Ton pion reprend en c3 : le matériel reste égal.
- 6... c6 — Le pion c6 prépare …d5 : il pourra occuper tout le centre.
- 7. Ne2 — Ton cavalier se développe en e2 et surveille d4.
- 7... d5 — Le pion d5 attaque ton pion c4.
- 8. cxd5 — Ton pion prend son pion d5, qui attaquait ton pion c4.
- 8... cxd5 — Son pion reprend en d5 : le matériel reste égal.
- 9. exd5 — Ton pion reprend en d5 : le matériel reste égal.
- 9... Nxd5 — Son cavalier reprend en d5 : le matériel reste égal.
- 10. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 10... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.

_Le plan :_ Ta paire de fous compense tes pions abîmés de l’aile dame : prépare d4 (avec h3 et Re1), puis active ton fou c1.

#### Carrefour après 1.c4

À ce carrefour, il a plusieurs coups dans ton répertoire (1…e5, 1…c5, 1…Nf6, 1…e6, 1…d5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 1…c5** (début : 1. c4)

- 1... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 2. Nc3 — Ton cavalier se développe en c3 et surveille d5 et e4.
- 2... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.
- 3. g3 — Le pion g3 prépare le fianchetto de ton fou en g2.
- 3... g6 — Le pion g6 prépare le fianchetto de son fou en g7.
- 4. Bg2 — Ton fou se développe en g2 et vise son cavalier c6.
- 4... Bg7 — Son fou se développe en g7 et vise ton cavalier c3.
- 5. d3 — Le pion d3 soutient ton pion c4.
- 5... d6 — Le pion d6 soutient son pion c5.
- 6. e4 — Le pion e4 prend de l’espace au centre et surveille d5.
- 6... e5 — Le pion e5 prend de l’espace au centre et surveille d4.
- 7. Nge2 — Ton cavalier se développe en e2 et surveille d4.
- 7... Nge7 — Son cavalier se développe en e7 et surveille d5.
- 8. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8... O-O — Petit roque : son roi se met à l’abri.
- 9. Be3 — Ton fou se développe en e3 et surveille d4.
- 9... Nd4 — Son cavalier s’installe en d4, un avant-poste protégé par son pion.
- 10. Qd2 — Ta dame sort en d2 : avec ton fou e3, Bh6 échangera son fou g7, le meilleur défenseur de son roi.
- 10... Be6 — Son fou se développe en e6 et surveille d5.

_Le plan :_ Plan : f4 pour ouvrir la colonne f ; si …exf4, Nxf4 chasse son fou e6 et ta tour f1 entre dans le jeu.

**Ligne 2 — 1…Nf6** (début : 1. c4)

- 1... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 2. Nc3 — Ton cavalier se développe en c3 et surveille d5 et e4.
- 2... g6 — Le pion g6 prépare le fianchetto de son fou en g7.
- 3. g3 — Le pion g3 prépare le fianchetto de ton fou en g2.
- 3... Bg7 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 4. Bg2 — Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 4... O-O — Petit roque : son roi se met à l’abri.
- 5. e4 — Le pion e4 prend de l’espace au centre et surveille d5.
- 5... d6 — Le pion d6 ouvre la diagonale de son fou c8.
- 6. Nge2 — Ton cavalier se développe en e2 et surveille d4.
- 6... e5 — Le pion e5 prend de l’espace au centre et surveille d4.
- 7. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 7... c6 — Le pion c6 surveille d5, au centre.
- 8. d3 — Le pion d3 soutient ton pion c4.
- 8... a6 — Le pion a6 contrôle b5 : ni ton fou ni ton cavalier ne pourront s’y installer.
- 9. h3 — Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite.
- 9... b5 — Le pion b5 ouvre la diagonale de son fou c8.
- 10. Be3 — Ton fou se développe en e3 et surveille d4.
- 10... Nbd7 — Son cavalier se développe en d7 et surveille e5.

_Le plan :_ Plan : a3 et b3, puis Rc1 : tu protèges c4 et tu ouvres l’aile dame, où ses pions …a6 et …b5 sont avancés.

**Ligne 3 — 1…e6** (début : 1. c4)

- 1... e6 — Le pion e6 ouvre la diagonale de son fou f8.
- 2. Nc3 — Ton cavalier se développe en c3 et surveille d5 et e4.
- 2... d5 — Le pion d5 attaque ton pion c4.
- 3. cxd5 — Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours.
- 3... exd5 — Son pion reprend en d5 : le matériel reste égal.
- 4. d4 — Le pion d4 prend de l’espace au centre et surveille e5.
- 4... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 5. Bg5 — Ton fou cloue son cavalier f6 sur sa dame.
- 5... Be7 — Son fou va en e7 : son cavalier f6 n’est plus cloué.
- 6. e3 — Le pion e3 soutient ton pion d4.
- 6... O-O — Petit roque : son roi se met à l’abri.
- 7. Bd3 — Ton fou se développe en d3 et surveille e4.
- 7... Nbd7 — Son cavalier se développe en d7 et surveille e5.
- 8. Nge2 — Ton cavalier se développe en e2 et surveille d4.
- 8... Re8 — Sa tour vient sur la colonne e, semi-ouverte.
- 9. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 9... Nf8 — Son cavalier se replace en f8.
- 10. Qc2 — Ta dame se développe en c2.
- 10... c6 — Le pion c6 soutient son pion d5.

_Le plan :_ Plan typique de cette structure : f3 puis e4 pour prendre tout le centre ; ton fou d3 et ta dame c2 visent alors son roi.

**Ligne 4 — 1…d5** (début : 1. c4)

- 1... d5 — Le pion d5 attaque ton pion c4.
- 2. cxd5 — Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours.
- 2... Qxd5 — Sa dame reprend en d5 : le matériel reste égal.
- 3. Nc3 — Ton cavalier va en c3 et attaque sa dame d5.
- 3... Qd8 — Sa dame, attaquée par ton cavalier, s’écarte en d8 ; elle surveille aussi d4 et d5.
- 4. d4 — Le pion d4 prend de l’espace au centre et surveille e5.
- 4... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 5. Nf3 — Ton cavalier se développe en f3 et surveille d4 et e5.
- 5... g6 — Le pion g6 prépare le fianchetto de son fou en g7.
- 6. e4 — Le pion e4 prend de l’espace au centre et surveille d5.
- 6... Bg7 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 7. Be2 — Ton fou se développe en e2.
- 7... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 8. d5 — Le pion d5 occupe le centre.
- 8... O-O — Petit roque : son roi se met à l’abri.
- 9. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.

_Le plan :_ Tes pions d5 et e4 forment un grand centre : protège-le (Re1, Bf4, Qd2) et pousse e5 au bon moment pour chasser son cavalier f6.

#### Carrefour après 1.c4 c5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3

À ce carrefour, il a plusieurs coups dans ton répertoire (5…d6, 5…Nf6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 5…Nf6** (début : 1. c4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3)

- 5... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 6. e4 — Le pion e4 prend de l’espace au centre et surveille d5.
- 6... O-O — Petit roque : son roi se met à l’abri.
- 7. Nge2 — Ton cavalier se développe en e2 et surveille d4.
- 7... d6 — Le pion d6 soutient son pion c5.
- 8. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8... a6 — Le pion a6 contrôle b5 : ni ton fou ni ton cavalier ne pourront s’y installer.
- 9. h3 — Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite.
- 9... Rb8 — Sa tour vient en b8 et soutient son pion b7.
- 10. a4 — Le pion a4 gagne de l’espace à l’aile dame.
- 10... Ne8 — Son cavalier se replace en e8.

_Le plan :_ Ensuite Be3 et Qd2, puis Nd5 : ton pion a4 freine …b5 et ton cavalier en d5 devient ta meilleure pièce.

#### Carrefour après 1.c4 c5 2.Nc3

À ce carrefour, il a plusieurs coups dans ton répertoire (2…Nc6, 2…Nf6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 2…Nf6** (début : 1. c4 c5 2. Nc3)

- 2... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 3. g3 — Le pion g3 prépare le fianchetto de ton fou en g2.
- 3... d5 — Le pion d5 attaque ton pion c4.
- 4. cxd5 — Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours.
- 4... Nxd5 — Son cavalier reprend en d5 : le matériel reste égal.
- 5. Bg2 — Ton fou se développe en g2 et vise son cavalier d5.
- 5... Nc7 — Son cavalier, attaqué par ton cavalier et ton fou, s’écarte en c7 ; il surveille aussi d5.
- 6. Nf3 — Ton cavalier se développe en f3 et surveille d4 et e5.
- 6... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.
- 7. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 7... e5 — Le pion e5 prend de l’espace au centre et surveille d4.
- 8. d3 — Le pion d3 ouvre la diagonale de ton fou c1.
- 8... Be7 — Son fou se développe en e7.
- 9. Nd2 — Ton cavalier va en d2 et vise e4.
- 9... Bd7 — Son fou se développe en d7.
- 10. Nc4 — Ton cavalier va en c4 et vise e5.
- 10... f6 — Le pion f6 soutient son pion e5.

_Le plan :_ Plan : f4 pour attaquer son pion e5 ; si …b5, ton cavalier c4 passe en e3, puis en d5 ou f5.

#### Carrefour après 1.c4 Nf6 2.Nc3

À ce carrefour, il a plusieurs coups dans ton répertoire (2…g6, 2…e6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 2…e6** (début : 1. c4 Nf6 2. Nc3)

- 2... e6 — Le pion e6 ouvre la diagonale de son fou f8.
- 3. d4 — Le pion d4 prend de l’espace au centre et surveille e5.
- 3... Bb4 — Son fou cloue ton cavalier c3 sur ton roi.
- 4. e3 — Le pion e3 soutient ton pion d4.
- 4... O-O — Petit roque : son roi se met à l’abri.
- 5. Bd3 — Ton fou se développe en d3 et surveille e4.
- 5... d5 — Le pion d5 prend de l’espace au centre et surveille e4.
- 6. cxd5 — Ton pion prend son pion d5 : la colonne c s’ouvre pour tes tours.
- 6... exd5 — Son pion reprend en d5 : le matériel reste égal.
- 7. Ne2 — Ton cavalier se développe en e2 et surveille d4.
- 7... Re8 — Sa tour vient sur la colonne e, semi-ouverte.
- 8. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8... Bd6 — Son fou va en d6 et vise e5.
- 9. a3 — Le pion a3 contrôle b4 : ni son fou ni son cavalier ne pourront s’y installer.
- 9... c6 — Le pion c6 soutient son pion d5.
- 10. Qc2 — Ta dame se développe en c2.
- 10... Nbd7 — Son cavalier se développe en d7 et surveille e5.

_Le plan :_ Comme dans la ligne 1…e6 : f3 puis e4 pour prendre le centre, avec ton fou d3 tourné vers son roi.

#### Carrefour après 1.c4 d5 2.cxd5 Qxd5 3.Nc3 Qd8 4.d4 Nf6 5.Nf3

À ce carrefour, il a plusieurs coups dans ton répertoire (5…g6, 5…e6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 5…e6** (début : 1. c4 d5 2. cxd5 Qxd5 3. Nc3 Qd8 4. d4 Nf6 5. Nf3)

- 5... e6 — Le pion e6 ouvre la diagonale de son fou f8.
- 6. e4 — Le pion e4 prend de l’espace au centre et surveille d5.
- 6... Be7 — Son fou se développe en e7.
- 7. Bd3 — Ton fou se développe en d3 et surveille e4.
- 7... O-O — Petit roque : son roi se met à l’abri.
- 8. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 9. dxc5 — Ton pion prend son pion c5, qui attaquait ton pion d4, et la colonne d s’ouvre pour tes tours.
- 9... Nfd7 — Son cavalier va en d7 et attaque ton pion c5.
- 10. Qe2 — Ta dame sort en e2 et surveille e4.
- 10... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.
- 11. Rd1 — Ta tour vient sur la colonne d, ouverte.

_Le plan :_ Ta tour d1 sur la colonne ouverte et ton pion e4 te donnent l’avantage : sors ton fou c1 (Be3), puis double tes tours sur la colonne d.

#### Carrefour après 1.c4 d5 2.cxd5 Qxd5 3.Nc3

À ce carrefour, il a plusieurs coups dans ton répertoire (3…Qd8, 3…Qa5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 3…Qa5** (début : 1. c4 d5 2. cxd5 Qxd5 3. Nc3)

- 3... Qa5 — Sa dame, attaquée par ton cavalier, s’écarte en a5 ; elle surveille aussi d5 et e5.
- 4. d4 — Le pion d4 prend de l’espace au centre et surveille e5.
- 4... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 5. Nf3 — Ton cavalier se développe en f3 et surveille d4 et e5.
- 5... c6 — Le pion c6 surveille d5, au centre.
- 6. Bd2 — Ton fou va en d2 : ton cavalier c3 n’est plus cloué.
- 6... Qb6 — Sa dame va en b6 et attaque ton pion b2.
- 7. e4 — Le pion e4 prend de l’espace au centre et surveille d5.
- 7... Bg4 — Son fou cloue ton cavalier f3 sur ta dame.
- 8. Qa4 — Ta dame cloue son pion c6 sur son roi.
- 8... Bxf3 — Son fou prend ton cavalier f3.
- 9. gxf3 — Ton pion reprend en f3 : le matériel reste égal.

_Le plan :_ Ta paire de fous et ton grand centre valent bien les pions doublés f : fais le grand roque, puis ta tour g1 attaque sur la colonne g ouverte.

#### Carrefour après 1.c4 d5 2.cxd5

À ce carrefour, il a plusieurs coups dans ton répertoire (2…Qxd5, 2…Nf6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 2…Nf6** (début : 1. c4 d5 2. cxd5)

- 2... Nf6 — Son cavalier va en f6 et attaque ton pion d5.
- 3. Nf3 — Ton cavalier se développe en f3 et surveille d4 et e5.
- 3... Nxd5 — Son cavalier prend ton pion d5.
- 4. d4 — Le pion d4 prend de l’espace au centre et surveille e5.
- 4... g6 — Le pion g6 prépare le fianchetto de son fou en g7.
- 5. e4 — Le pion e4 chasse son cavalier d5.
- 5... Nb6 — Son cavalier, attaqué par ton pion, s’écarte en b6 ; il surveille aussi d5.
- 6. h3 — Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer.
- 6... Bg7 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 7. Nc3 — Ton cavalier se développe en c3 et surveille d5 et e4.
- 7... O-O — Petit roque : son roi se met à l’abri.
- 8. Be3 — Ton fou se développe en e3 et surveille d4.
- 8... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.
- 9. Qd2 — Ta dame sort en d2 : avec ton fou e3, Bh6 échangera son fou g7, le meilleur défenseur de son roi.
- 9... f5 — Le pion f5 prend de l’espace au centre et surveille e4.

_Le plan :_ Pousse e5 pour chasser ses pièces du centre ; ta tour viendra en d1 soutenir d4, et Bh6 échangera son fou g7.

## Système de Londres (Blancs)

Le Système de Londres est une ouverture tranquille pour les Blancs : on place presque toujours les mêmes pièces aux mêmes cases, quoi que fassent les Noirs.

### 1-2. Ligne principale, par blocs

**Bloc 1**

- 1. d4 — Le pion prend une case du centre et ouvre la diagonale du fou c1. _(mot expliqué : centre)_
- 1... d5 — Les Noirs prennent aussi leur part du centre.
- 2. Bf4 — Le fou sort tout de suite, avant que le pion e3 ne lui ferme le chemin : c’est la signature du Londres.
- 2... Nf6 — Les Noirs développent un cavalier vers le centre. _(mot expliqué : développer)_
- 3. e3 — Le pion e3 soutient d4 et ouvre la diagonale du fou f1.
- 3... c5 — Les Noirs attaquent d4 avec un pion de côté, le plan le plus actif.

**Bloc 2**

- 4. c3 — Le pion c3 protège d4 une deuxième fois : la chaîne de pions c3-d4-e3 est solide. _(mot expliqué : chaîne de pions)_
- 4... Nc6 — Le cavalier noir ajoute une pression sur d4.
- 5. Nd2 — Le cavalier se développe en d2, car le pion occupe c3 ; il pourra soutenir la case e4.
- 5... e6 — Les Noirs ouvrent la diagonale de leur fou f8.
- 6. Ngf3 — Le second cavalier vient en f3, vers le centre, et prépare le roque. _(mot expliqué : roque)_
- 6... Bd6 — Les Noirs proposent l’échange des fous de cases noires.

**Bloc 3**

- 7. Bg3 — Le fou recule sans s’échanger lui-même. Si les Noirs prennent (…Bxg3), tu reprends avec le pion h (hxg3) et ta tour h1 gagne la colonne h.
- 7... O-O — Les Noirs roquent : leur roi est à l’abri.
- 8. Bd3 — Le fou f1 se place sur la diagonale qui vise le roi noir en h7.
- 8... b6 — Les Noirs préparent le fianchetto de leur fou c8 en b7. _(mot expliqué : fianchetto)_
- 9. Ne5 — Le cavalier saute en e5, un avant-poste au centre, d’où il gêne les Noirs et prépare l’attaque. _(mot expliqué : avant-poste)_
- 9... Bb7 — Le fou noir vise la grande diagonale, vers e4.

**Bloc 4**

- 10. f4 — Le pion f4 soutient le cavalier e5 et prépare une attaque sur l’aile roi.

### 3. Le plan

1. Tes pièces vont presque toujours aux mêmes cases : pions d4-e3-c3, fous f4 (puis g3) et d3, cavaliers d2 et f3 (puis e5), petit roque.
2. Au milieu de partie, installe un cavalier en e5 soutenu par le pion f4, puis attaque le roi noir avec la dame (h5 ou f3) et une tour sur la colonne f.
3. Si les Noirs échangent ton cavalier e5, reprends avec un pion pour garder de l’espace au centre et ouvrir une colonne à tes tours.

### 4. Partie type (Stockfish contre lui-même)

Coups : 10... Be7 11. O-O 11... Ne8 12. Qh5 12... f5 13. Ndf3 13... Nf6 14. Qh3 14... Nxe5 15. dxe5 15... Ne4 16. Bh4 16... Bxh4 17. Nxh4 17... Qe7 18. Rad1 18... g6 19. g4 19... Rad8 20. gxf5 20... exf5 21. Nf3 21... Kg7 22. Qh4

Moments clés :

- 11. O-O — Les Blancs roquent : le roi est à l’abri et la tour f1 soutient le pion f4.
- 12. Qh5 — La dame rejoint l’aile roi : avec le cavalier e5 et le fou d3, trois pièces visent le roi noir.
- 12... f5 — Les Noirs répondent par …f5 pour fermer la diagonale du fou d3 vers h7.
- 15. dxe5 — Les Noirs ont échangé le cavalier e5 ; les Blancs reprennent avec le pion d, qui gagne de l’espace et ouvre la colonne d.
- 15... Ne4 — Un cavalier noir s’installe à son tour en e4, un avant-poste protégé par le pion d5.
- 17. Nxh4 — Les fous de cases noires sont échangés : il reste à chaque camp un fou et un cavalier.
- 19. g4 — Les Blancs avancent le pion g pour ouvrir des lignes vers le roi noir.
- 20... exf5 — La colonne g est maintenant à moitié ouverte : les tours blanches pourront y venir face au roi noir. _(mot expliqué : colonne semi-ouverte)_
- 22. Qh4 — La dame vise le roi noir : la position est équilibrée, mais l’initiative est aux Blancs.

Fin : Position équilibrée : les Blancs ont suivi leur plan (cavalier en e5, attaque sur l’aile roi).

### 5. Bloc supplémentaire : Contre les autres premiers coups noirs

Contre 1…e6, 1…g6 et 1…f5, tu gardes le placement du Londres. Deux exceptions vues avec Stockfish : contre 1…c5, tu avances 2.d5 ; contre le gambit Englund (1…e5), pas de Bf4 automatique.

Chaque ligne se regarde puis se rejoue comme un bloc de la leçon ; ses coups entrent dans le drill. Accès direct : écran Ouvertures → « Leçon : contre les autres premiers coups noirs ».

**Ligne 1 — 1…e6** (début : 1. d4 e6)

- 2. Bf4 — Ton fou sort tout de suite, comme toujours dans le Londres.
- 2... c5 — Les Noirs attaquent ton pion d4.
- 3. e3 — Le pion e3 soutient d4 et ouvre la diagonale de ton fou f1.
- 3... d5 — Les Noirs prennent leur part du centre.
- 4. Nf3 — Ton cavalier se développe et protège d4.
- 4... Nf6 — Le cavalier noir se développe.
- 5. c3 — Le pion c3 protège d4 une deuxième fois : ta chaîne c3-d4-e3 est en place.
- 5... Nc6 — Le cavalier noir ajoute une pression sur d4.
- 6. Nbd2 — Ton cavalier se développe en d2, car le pion occupe c3.
- 6... Nh5 — Le cavalier noir attaque ton fou f4 pour l’échanger.
- 7. Bg3 — Ton fou recule en g3, comme dans la leçon.
- 7... Nxg3 — Les Noirs échangent le cavalier contre ton fou.
- 8. hxg3 — Tu reprends avec le pion h : ta tour h1 gagne la colonne h.

**Ligne 2 — 1…c5 : 2.d5** (début : 1. d4 c5)

- 2. d5 — Pas de Londres ici : avec c3 ou Bf4, tu perdrais plus d’un demi-pion (Stockfish). Ton pion d5 prend de l’espace.
- 2... Nf6 — Le cavalier noir se développe et attaque ton pion d5.
- 3. Nf3 — Ton cavalier se développe.
- 3... e6 — Les Noirs attaquent ton pion d5 avec le pion e.
- 4. Nc3 — Ton second cavalier protège d5.
- 4... exd5 — Les Noirs prennent.
- 5. Nxd5 — Tu reprends avec le cavalier, bien placé au centre.
- 5... Nxd5 — Les Noirs échangent les cavaliers.
- 6. Qxd5 — Ta dame reprend au centre, d’où elle attaque c5 et vise f7.
- 6... Nc6 — Le cavalier noir se développe.
- 7. e4 — Ton pion e4 prend le centre et ouvre la diagonale de ton fou f1.

**Ligne 3 — 1…g6 : le cavalier d’abord** (début : 1. d4 g6)

- 2. Nf3 — Ton cavalier sort d’abord, puis ton fou viendra en f4 : c’est toujours le placement du Londres.
- 2... Nf6 — Le cavalier noir se développe.
- 3. Bf4 — Ton fou sort en f4, avant e3.
- 3... Bg7 — Les Noirs font le fianchetto de leur fou.
- 4. e3 — Le pion e3 soutient d4.
- 4... O-O — Les Noirs roquent.
- 5. Be2 — C’est la position de la ligne 1…Nf6 2.Bf4 g6 : continue avec h3, c3 et le roque.

**Ligne 4 — 1…f5 (Hollandaise)** (début : 1. d4 f5)

- 2. Bf4 — Contre la Hollandaise aussi, ton fou sort tout de suite.
- 2... d6 — Les Noirs préparent …e5 pour chasser ton fou.
- 3. e3 — Le pion e3 soutient d4.
- 3... Nf6 — Le cavalier noir se développe.
- 4. Nf3 — Ton cavalier surveille e5 : …e5 devient plus difficile.
- 4... g6 — Les Noirs préparent le fianchetto de leur fou f8.
- 5. h3 — Le pion h3 empêche …Ng4 et donne une case de retraite à ton fou (h2).
- 5... Nc6 — Le cavalier noir se développe.
- 6. Bd3 — Ton fou vise le pion f5 et le roi noir.
- 6... Bg7 — Le fou noir va en g7.
- 7. O-O — Tu roques : ton roi est à l’abri.
- 7... O-O — Les Noirs roquent aussi.

**Ligne 5 — 1…e5 : le gambit Englund et son piège** (début : 1. d4 e5)

- 2. dxe5 — Tu prends le pion offert : c’est le gambit Englund. _(mot expliqué : gambit)_
- 2... Nc6 — Les Noirs attaquent ton pion e5.
- 3. Nf3 — Ton cavalier protège e5.
- 3... Qe7 — La dame noire attaque e5 et prépare …Qb4+ contre ton pion b2.
- 4. Bg5 — Piège à éviter : Bf4 permet …Qb4+ puis …Qxb2, et Bc3 perd sur …Bb4 et …Qc1 mat. Ton fou va en g5 et attaque la dame.
- 4... Qb4+ — La dame noire fait échec et vise ton pion b2.
- 5. Nc3 — Ton cavalier pare l’échec en se développant ; si …Qxb2, Bd2 puis Rb1 chasse la dame (Stockfish : gros avantage blanc).
- 5... Qa5 — La dame noire recule : tu as un pion de plus et tes pièces sont sorties.

### 6. Les autres lignes, par carrefour

Chaque ligne se regarde puis se rejoue comme un bloc de la leçon ; ses coups entrent dans le drill. Accès : page de l’ouverture → onglet « Leçon » → sommaire.

#### Carrefour après 1.d4

À ce carrefour, il a plusieurs coups dans ton répertoire (1…d5, 1…Nf6, 1…e6, 1…c5, 1…g6, 1…f5, 1…e5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 1…e6** (début : 1. d4)

- 1... e6 — Le pion e6 ouvre la diagonale de son fou f8.
- 2. Bf4 — Ton fou sort tout de suite, comme toujours dans le Londres.
- 2... c5 — Les Noirs attaquent ton pion d4.
- 3. e3 — Le pion e3 soutient d4 et ouvre la diagonale de ton fou f1.
- 3... d5 — Les Noirs prennent leur part du centre.
- 4. Nf3 — Ton cavalier se développe et protège d4.
- 4... Nf6 — Le cavalier noir se développe.
- 5. c3 — Le pion c3 protège d4 une deuxième fois : ta chaîne c3-d4-e3 est en place.
- 5... Nc6 — Le cavalier noir ajoute une pression sur d4.
- 6. Nbd2 — Ton cavalier se développe en d2, car le pion occupe c3.
- 6... Nh5 — Le cavalier noir attaque ton fou f4 pour l’échanger.
- 7. Bg3 — Ton fou recule en g3, comme dans la leçon.
- 7... Nxg3 — Les Noirs échangent le cavalier contre ton fou.
- 8. hxg3 — Tu reprends avec le pion h : ta tour h1 gagne la colonne h.
- 8... Qb6 — Sa dame va en b6 et attaque ton pion b2.
- 9. Qc2 — Ta dame va en c2 et protège ton pion b2, attaqué par sa dame ; elle surveille aussi e4.
- 9... g6 — Le pion g6 bouche la diagonale de ta dame : elle ne vise plus son pion h7 ; il prépare aussi le fianchetto de son fou en g7.
- 10. Bd3 — Ton fou se développe en d3 et surveille e4.
- 10... Bd7 — Son fou se développe en d7.

_Le plan :_ Plan : Rd1 et Qb1 protègent ton centre et le pion b2, puis tu roques ; ensuite e4 ouvre le jeu pour ton fou d3.

**Ligne 2 — 1…c5 : 2.d5** (début : 1. d4)

- 1... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 2. d5 — Pas de Londres ici : avec c3 ou Bf4, tu perdrais plus d’un demi-pion (Stockfish). Ton pion d5 prend de l’espace.
- 2... Nf6 — Le cavalier noir se développe et attaque ton pion d5.
- 3. Nf3 — Ton cavalier se développe.
- 3... e6 — Les Noirs attaquent ton pion d5 avec le pion e.
- 4. Nc3 — Ton second cavalier protège d5.
- 4... exd5 — Les Noirs prennent.
- 5. Nxd5 — Tu reprends avec le cavalier, bien placé au centre.
- 5... Nxd5 — Les Noirs échangent les cavaliers.
- 6. Qxd5 — Ta dame reprend au centre, d’où elle attaque c5 et vise f7.
- 6... Nc6 — Le cavalier noir se développe.
- 7. e4 — Ton pion e4 prend le centre et ouvre la diagonale de ton fou f1.
- 7... d6 — Le pion d6 soutient son pion c5.
- 8. Ng5 — Ton cavalier va en g5 : avec ta dame d5, il menace Qxf7 mat.
- 8... Qe7 — Sa dame va en e7 et protège f7 contre la menace de mat, et cloue ton pion e4 sur ton roi.
- 9. Bb5 — Ton fou cloue son cavalier c6 sur son roi.
- 9... Bd7 — Son fou va en d7 et protège son cavalier c6, attaqué par ta dame et ton fou ; son cavalier c6 n’est plus cloué.
- 10. Bc4 — Ton fou va en c4 et vise d5.
- 10... Nd8 — Son cavalier se met à l’abri en d8.

_Le plan :_ Roque, et replace ton cavalier g5 s’il est chassé (Nh3, puis f4) : ta dame d5 et ton fou c4 visent f7, et f4 ouvrira la colonne f.

**Ligne 3 — 1…g6 : le cavalier d’abord** (début : 1. d4)

- 1... g6 — Le pion g6 prépare le fianchetto de son fou en g7.
- 2. Nf3 — Ton cavalier sort d’abord, puis ton fou viendra en f4 : c’est toujours le placement du Londres.
- 2... Nf6 — Le cavalier noir se développe.
- 3. Bf4 — Ton fou sort en f4, avant e3.
- 3... Bg7 — Les Noirs font le fianchetto de leur fou.
- 4. e3 — Le pion e3 soutient d4.
- 4... O-O — Les Noirs roquent.
- 5. Be2 — C’est la position de la ligne 1…Nf6 2.Bf4 g6 : continue avec h3, c3 et le roque.
- 5... d6 — Le pion d6 ouvre la diagonale de son fou c8.
- 6. h3 — Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer.
- 6... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 7. c3 — Le pion c3 soutient ton pion d4.
- 7... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.
- 8. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8... b6 — Le pion b6 prépare le fianchetto de son fou en b7.
- 9. a4 — Le pion a4 gagne de l’espace à l’aile dame.
- 9... Bb7 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 10. Nbd2 — Ton cavalier se développe en d2 et surveille e4.

_Le plan :_ Garde ton fou f4 (recule en h2 s’il est attaqué par …e5 ou …Nh5) et pousse a5 pour ouvrir la colonne a : ta chaîne c3-d4-e3 ne craint rien.

**Ligne 4 — 1…f5 (Hollandaise)** (début : 1. d4)

- 1... f5 — Le pion f5 prend de l’espace au centre et surveille e4.
- 2. Bf4 — Contre la Hollandaise aussi, ton fou sort tout de suite.
- 2... d6 — Les Noirs préparent …e5 pour chasser ton fou.
- 3. e3 — Le pion e3 soutient d4.
- 3... Nf6 — Le cavalier noir se développe.
- 4. Nf3 — Ton cavalier surveille e5 : …e5 devient plus difficile.
- 4... g6 — Les Noirs préparent le fianchetto de leur fou f8.
- 5. h3 — Le pion h3 empêche …Ng4 et donne une case de retraite à ton fou (h2).
- 5... Nc6 — Le cavalier noir se développe.
- 6. Bd3 — Ton fou vise le pion f5 et le roi noir.
- 6... Bg7 — Le fou noir va en g7.
- 7. O-O — Tu roques : ton roi est à l’abri.
- 7... O-O — Les Noirs roquent aussi.
- 8. Bg3 — Ton fou va en g3 et vise e5.
- 8... Qe8 — Sa dame se développe en e8.
- 9. Qe2 — Ta dame se développe en e2.
- 9... Kh8 — Son roi va en h8, un peu plus à l’abri.
- 10. Nc3 — Ton cavalier se développe en c3 et surveille d5 et e4.
- 10... a6 — Le pion a6 contrôle b5 : ni ton fou ni ton cavalier ne pourront s’y installer.

_Le plan :_ Plan : e4 pour ouvrir le centre contre son pion f5 ; si son cavalier attaque ton fou g3 (…Nh5), recule en h2 et garde ton pion d4 protégé.

**Ligne 5 — 1…e5 : le gambit Englund et son piège** (début : 1. d4)

- 1... e5 — Le pion e5 prend de l’espace au centre et surveille d4.
- 2. dxe5 — Tu prends le pion offert : c’est le gambit Englund.
- 2... Nc6 — Les Noirs attaquent ton pion e5.
- 3. Nf3 — Ton cavalier protège e5.
- 3... Qe7 — La dame noire attaque e5 et prépare …Qb4+ contre ton pion b2.
- 4. Bg5 — Piège à éviter : Bf4 permet …Qb4+ puis …Qxb2, et Bc3 perd sur …Bb4 et …Qc1 mat. Ton fou va en g5 et attaque la dame.
- 4... Qb4+ — La dame noire fait échec et vise ton pion b2.
- 5. Nc3 — Ton cavalier pare l’échec en se développant ; si …Qxb2, Bd2 puis Rb1 chasse la dame (Stockfish : gros avantage blanc).
- 5... Qa5 — La dame noire recule : tu as un pion de plus et tes pièces sont sorties.
- 6. Qd5 — Ta dame bouche la rangée de sa dame : sa dame ne vise plus ton pion e5 ; elle surveille aussi d4 et e4.
- 6... Bc5 — Son fou se développe en c5 et surveille d4.
- 7. a3 — Le pion a3 contrôle b4 : ni son fou ni son cavalier ne pourront s’y installer.
- 7... h6 — Le pion h6 chasse ton fou g5.
- 8. Bh4 — Ton fou, attaqué par son pion, s’écarte en h4.
- 8... g5 — Le pion g5 chasse ton fou h4.
- 9. Bg3 — Ton fou, attaqué par son pion, s’écarte en g3 ; il surveille aussi e5.
- 9... g4 — Le pion g4 chasse ton cavalier f3.
- 10. Nd2 — Ton cavalier, attaqué par son pion, s’écarte en d2 ; ton cavalier c3 n’est plus cloué.
- 10... Nge7 — Son cavalier va en e7 et attaque ta dame d5.

_Le plan :_ Son cavalier e7 attaque ta dame : Qc4 la met à l’abri ; tu as un pion de plus et ses pions g sont trop avancés, développe-toi (e3, Be2) puis roque.

**Ligne 6 — 1…Nf6** (début : 1. d4)

- 1... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 2. Bf4 — Ton fou se développe en f4 et surveille e5.
- 2... g6 — Le pion g6 prépare le fianchetto de son fou en g7.
- 3. e3 — Le pion e3 soutient ton pion d4.
- 3... Bg7 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 4. Nf3 — Ton cavalier se développe en f3 et surveille d4 et e5.
- 4... O-O — Les Noirs roquent.
- 5. Be2 — C’est la position de la ligne 1…Nf6 2.Bf4 g6 : continue avec h3, c3 et le roque.
- 5... d6 — Le pion d6 ouvre la diagonale de son fou c8.
- 6. h3 — Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer.
- 6... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 7. c3 — Le pion c3 soutient ton pion d4.
- 7... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.
- 8. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8... b6 — Le pion b6 prépare le fianchetto de son fou en b7.
- 9. a4 — Le pion a4 gagne de l’espace à l’aile dame.
- 9... Bb7 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 10. Nbd2 — Ton cavalier se développe en d2 et surveille e4.

_Le plan :_ Garde ton fou f4 (recule en h2 s’il est attaqué par …e5 ou …Nh5) et pousse a5 pour ouvrir la colonne a : ta chaîne c3-d4-e3 ne craint rien.

#### Carrefour après 1.d4 d5 2.Bf4 Nf6 3.e3

À ce carrefour, il a plusieurs coups dans ton répertoire (3…c5, 3…e6, 3…g6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 3…e6** (début : 1. d4 d5 2. Bf4 Nf6 3. e3)

- 3... e6 — Le pion e6 soutient son pion d5.
- 4. Nf3 — Ton cavalier se développe en f3 et surveille d4 et e5.
- 4... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 5. c3 — Le pion c3 protège d4 une deuxième fois : ta chaîne c3-d4-e3 est en place.
- 5... Nc6 — Le cavalier noir ajoute une pression sur d4.
- 6. Nbd2 — Ton cavalier se développe en d2, car le pion occupe c3.
- 6... Bd6 — Les Noirs proposent l’échange des fous de cases noires.
- 7. Bg3 — Le fou recule sans s’échanger lui-même. Si les Noirs prennent (…Bxg3), tu reprends avec le pion h (hxg3) et ta tour h1 gagne la colonne h.
- 7... O-O — Les Noirs roquent : leur roi est à l’abri.
- 8. Bd3 — Le fou f1 se place sur la diagonale qui vise le roi noir en h7.
- 8... b6 — Les Noirs préparent le fianchetto de leur fou c8 en b7.
- 9. Ne5 — Le cavalier saute en e5, un avant-poste au centre, d’où il gêne les Noirs et prépare l’attaque.
- 9... Bb7 — Le fou noir vise la grande diagonale, vers e4.
- 10. f4 — Le pion f4 soutient le cavalier e5 et prépare une attaque sur l’aile roi.

_Le plan :_ C’est le plan de la leçon : cavalier e5 soutenu par f4, puis ta dame sur l’aile roi ; si son cavalier vient en f5 attaquer ton fou g3, recule-le en f2.

**Ligne 2 — 3…g6** (début : 1. d4 d5 2. Bf4 Nf6 3. e3)

- 3... g6 — Le pion g6 prépare le fianchetto de son fou en g7.
- 4. Nf3 — Ton cavalier se développe en f3 et surveille d4 et e5.
- 4... Bg7 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 5. Be2 — Ton fou se développe en e2.
- 5... O-O — Petit roque : son roi se met à l’abri.
- 6. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 6... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 7. c3 — Le pion c3 soutient ton pion d4.
- 7... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.
- 8. h3 — Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite.
- 8... b6 — Le pion b6 prépare le fianchetto de son fou en b7.
- 9. Nbd2 — Ton cavalier se développe en d2 et surveille e4.
- 9... Bb7 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 10. Ne5 — Ton cavalier s’installe en e5, un avant-poste protégé par ton pion.

_Le plan :_ Ton cavalier e5 bloque son fou b7 : s’il l’échange (…Nxe5), reprends avec le fou (Bxe5), puis f4 et ta dame sur l’aile roi pour l’attaque.

#### Carrefour après 1.d4 d5 2.Bf4

À ce carrefour, il a plusieurs coups dans ton répertoire (2…Nf6, 2…c5, 2…Bf5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 2…c5** (début : 1. d4 d5 2. Bf4)

- 2... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 3. e3 — Le pion e3 soutient ton pion d4.
- 3... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.
- 4. Nf3 — Ton cavalier se développe en f3 et surveille d4 et e5.
- 4... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 5. Nbd2 — Ton cavalier se développe en d2 et surveille e4.
- 5... e6 — Le pion e6 soutient son pion d5.
- 6. c3 — Le pion c3 soutient ton pion d4.
- 6... Bd6 — Les Noirs proposent l’échange des fous de cases noires.
- 7. Bg3 — Le fou recule sans s’échanger lui-même. Si les Noirs prennent (…Bxg3), tu reprends avec le pion h (hxg3) et ta tour h1 gagne la colonne h.
- 7... O-O — Les Noirs roquent : leur roi est à l’abri.
- 8. Bd3 — Le fou f1 se place sur la diagonale qui vise le roi noir en h7.
- 8... b6 — Les Noirs préparent le fianchetto de leur fou c8 en b7.
- 9. Ne5 — Le cavalier saute en e5, un avant-poste au centre, d’où il gêne les Noirs et prépare l’attaque.
- 9... Bb7 — Le fou noir vise la grande diagonale, vers e4.
- 10. f4 — Le pion f4 soutient le cavalier e5 et prépare une attaque sur l’aile roi.

_Le plan :_ C’est le plan de la leçon : cavalier e5 soutenu par f4, puis ta dame sur l’aile roi ; si son cavalier vient en f5 attaquer ton fou g3, recule-le en f2.

**Ligne 2 — 2…Bf5** (début : 1. d4 d5 2. Bf4)

- 2... Bf5 — Son fou se développe en f5 et surveille e4.
- 3. e3 — Le pion e3 soutient ton pion d4.
- 3... e6 — Le pion e6 soutient son pion d5.
- 4. Bd3 — Ton fou se développe en d3 et surveille e4.
- 4... Bxd3 — Son fou prend ton fou d3.
- 5. Qxd3 — Ta dame reprend en d3 : le matériel reste égal.
- 5... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.
- 6. Nf3 — Ton cavalier se développe en f3 et surveille d4 et e5.
- 6... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 7. c3 — Le pion c3 soutient ton pion d4.
- 7... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.
- 8. Nbd2 — Ton cavalier se développe en d2 et surveille e4.
- 8... Bd6 — Son fou se développe en d6 et surveille e5.
- 9. Bxd6 — Ton fou prend son fou d6.
- 9... Qxd6 — Sa dame reprend en d6 : le matériel reste égal.
- 10. O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 10... O-O — Petit roque : son roi se met à l’abri.

_Le plan :_ Position calme : tes tours viennent en d1 et c1, et tu prépares e4 (avec Qe2) pour ouvrir le centre ; ton cavalier f3 peut aussi sauter en e5.

#### Carrefour après 1.d4 Nf6 2.Bf4

À ce carrefour, il a plusieurs coups dans ton répertoire (2…g6, 2…e6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 2…e6** (début : 1. d4 Nf6 2. Bf4)

- 2... e6 — Le pion e6 ouvre la diagonale de son fou f8.
- 3. e3 — Le pion e3 soutient ton pion d4.
- 3... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 4. c3 — Le pion c3 soutient ton pion d4.
- 4... Nc6 — Son cavalier se développe en c6 et surveille d4 et e5.
- 5. Nd2 — Ton cavalier se développe en d2 et surveille e4.
- 5... d5 — Le pion d5 prend de l’espace au centre et surveille e4.
- 6. Ngf3 — Le second cavalier vient en f3, vers le centre, et prépare le roque.
- 6... Bd6 — Les Noirs proposent l’échange des fous de cases noires.
- 7. Bg3 — Le fou recule sans s’échanger lui-même. Si les Noirs prennent (…Bxg3), tu reprends avec le pion h (hxg3) et ta tour h1 gagne la colonne h.
- 7... O-O — Les Noirs roquent : leur roi est à l’abri.
- 8. Bd3 — Le fou f1 se place sur la diagonale qui vise le roi noir en h7.
- 8... b6 — Les Noirs préparent le fianchetto de leur fou c8 en b7.
- 9. Ne5 — Le cavalier saute en e5, un avant-poste au centre, d’où il gêne les Noirs et prépare l’attaque.
- 9... Bb7 — Le fou noir vise la grande diagonale, vers e4.
- 10. f4 — Le pion f4 soutient le cavalier e5 et prépare une attaque sur l’aile roi.

_Le plan :_ C’est le plan de la leçon : cavalier e5 soutenu par f4, puis ta dame sur l’aile roi ; si son cavalier vient en f5 attaquer ton fou g3, recule-le en f2.

#### Carrefour après 1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bg5

À ce carrefour, il a plusieurs coups dans ton répertoire (4…Qb4+, 4…Qc5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 4…Qc5** (début : 1. d4 e5 2. dxe5 Nc6 3. Nf3 Qe7 4. Bg5)

- 4... Qc5 — Sa dame, attaquée par ton fou, s’écarte en c5 ; elle surveille aussi d4, d5 et e5.
- 5. Be3 — Ton fou va en e3 et contre-attaque sa dame c5 au lieu de défendre ton pion e5.
- 5... Qe7 — Sa dame, attaquée par ton fou, s’écarte en e7 ; elle surveille aussi e5.
- 6. Nc3 — Ton cavalier se développe en c3 et surveille d5 et e4.
- 6... Nxe5 — Son cavalier prend ton pion e5.
- 7. Bf4 — Ton fou va en f4 et vise son cavalier e5.
- 7... Nxf3+ — Son cavalier, attaqué par ton fou et ton cavalier, prend ton cavalier f3 avec échec.
- 8. gxf3 — Ton pion reprend en f3 : le matériel reste égal.
- 8... c6 — Le pion c6 prépare …d5 : il pourra occuper tout le centre.
- 9. Qd2 — Ta dame sort en d2 et surveille d4 et d5.
- 9... d5 — Le pion d5 prend de l’espace au centre et surveille e4.
- 10. O-O-O — Grand roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 10... Nf6 — Son cavalier se développe en f6 et surveille d5 et e4.

_Le plan :_ Grand roque fait et un pion de plus : pousse e4 pour ouvrir le centre contre son roi resté en e8, ta tour d1 est déjà sur la colonne d.

## Système …c5 / …g6 (Dragon accéléré) (Noirs)

Avec les Noirs, tu joues le même système que l’Anglaise, inversé : …c5, …Nc6, …g6, …Bg7 et …d6. Contre 1.e4 puis 2.Nf3 et 3.d4, cela donne le Dragon accéléré.

### 1-2. Ligne principale, par blocs

**Bloc 1**

- 1. e4 — Les Blancs occupent le centre avec leur pion e. _(mot expliqué : centre)_
- 1... c5 — Ton pion c5 surveille la case d4 sans t’exposer : c’est la Défense sicilienne.
- 2. Nf3 — Le cavalier blanc se développe et prépare d4. _(mot expliqué : développer)_
- 2... Nc6 — Ton cavalier se développe et surveille les cases d4 et e5.
- 3. d4 — Les Blancs ouvrent le centre en attaquant ton pion c5.
- 3... cxd4 — Tu échanges ton pion c contre le pion d blanc : il te reste deux pions au centre (d et e).

**Bloc 2**

- 4. Nxd4 — Le cavalier blanc reprend le pion et s’installe au centre.
- 4... g6 — Tu prépares tout de suite le fianchetto de ton fou f8 : c’est le Dragon accéléré. _(mot expliqué : fianchetto)_
- 5. Nc3 — Le second cavalier blanc protège le pion e4.
- 5... Bg7 — Ton fou se place sur la grande diagonale et vise le cavalier d4 et l’aile dame. _(mot expliqué : grande diagonale)_
- 6. Be3 — Le fou blanc protège le cavalier d4.
- 6... Nf6 — Ton second cavalier se développe et attaque le pion e4.

**Bloc 3**

- 7. Bc4 — Le fou blanc vise ton pion f7, le point faible près de ton roi.
- 7... O-O — Tu fais le petit roque : ton roi est à l’abri derrière le fou g7. _(mot expliqué : roque)_
- 8. Bb3 — Le fou blanc se met à l’abri en b3, d’où il vise toujours f7.
- 8... d6 — Le pion d6 ouvre la diagonale de ton fou c8 et surveille la case e5.
- 9. f3 — Le pion f3 protège e4 et empêche ton cavalier de venir en g4.
- 9... Bd7 — Ton fou se développe : tes deux tours peuvent maintenant se rejoindre.

**Bloc 4**

- 10. Qd2 — La dame blanche se développe et prépare le grand roque.
- 10... Nxd4 — Tu échanges les cavaliers pour te libérer.
- 11. Bxd4 — Le fou blanc reprend au centre, face à ton fou g7.
- 11... b5 — Ton pion b lance l’attaque sur l’aile dame, là où le roi blanc veut roquer.

### 3. Le plan

1. Tes pièces vont presque toujours aux mêmes cases : pions c5, d6 et g6, fou en g7, cavaliers en c6 et f6, petit roque.
2. Ton fou g7 est ta meilleure pièce : garde-le, car sur la grande diagonale il vise le centre et l’aile dame.
3. Au milieu de partie, attaque sur l’aile dame avec …b5, une tour sur la colonne c et ta dame en a5 ou c7. _(mot expliqué : colonne semi-ouverte)_

### 4. Partie type (Stockfish contre lui-même)

Coups : 12. a4 12... bxa4 13. Bxa4 13... Qc7 14. Bxd7 14... Qxd7 15. O-O 15... Rfc8 16. b3 16... Qc7 17. Ra4 17... e5 18. Rc4 18... Qa5 19. Be3 19... Rxc4 20. bxc4 20... Rc8

Moments clés :

- 12. a4 — Les Blancs attaquent ton pion b5 avec leur pion a.
- 12... bxa4 — Tu prends : la colonne b s’ouvre pour tes tours.
- 13... Qc7 — Ta dame vient sur la colonne c, ta colonne d’attaque dans la Sicilienne.
- 15. O-O — Les Blancs ne font pas le grand roque : avec ton jeu sur l’aile dame, leur roi y serait en danger.
- 15... Rfc8 — Ta tour f8 rejoint ta dame sur la colonne c.
- 17... e5 — Ton pion e5 chasse le fou d4 et prend de l’espace au centre.
- 19... Rxc4 — Tu échanges une paire de tours sur la case c4.
- 20... Rc8 — Ta dernière tour reprend la colonne c et vise le pion c4.

Fin : Position équilibrée : tu as gardé ton fou g7 et ta colonne c, ton jeu est actif.

### 5. Bloc supplémentaire : Contre les attaques rapides sur f7

Coups vus dans tes parties Chess.com : la dame (en h5, f3 ou g3) et le fou c4 visent f7, que seul ton roi protège. Règle : bloque la route de la dame (…Nf6 contre Qf3, …g6 ou …e6 contre Qh5), puis développe-toi ; avant …g6, vérifie que la dame ne peut pas prendre c5.

Chaque ligne se regarde puis se rejoue comme un bloc de la leçon ; ses coups entrent dans le drill. Accès direct : écran Ouvertures → « Leçon : contre les attaques rapides sur f7 ».

**Ligne 1 — 2.Qh5 (la dame vise f7 et c5)** (début : 1. e4 c5)

- 2. Qh5 — La dame blanche sort tout de suite : elle vise f7 et aussi ton pion c5, par la 5e rangée.
- 2... d6 — Le pion d6 protège c5 ; pas encore …g6, la dame prendrait c5.
- 3. Bc4 — Le fou rejoint la dame contre f7 : ils menacent Qxf7+.
- 3... g6 — Le pion g6 coupe la route de la dame vers f7 et l’attaque : c’est aussi ton fianchetto.
- 4. Qe2 — La dame recule en e2, d’où elle protège le pion e4.
- 4... Bg7 — Ton fou se place sur la grande diagonale, comme toujours.
- 5. Nf3 — Le cavalier blanc se développe.
- 5... Nc6 — Ton cavalier se développe et surveille les cases d4 et e5.
- 6. O-O — Les Blancs mettent leur roi à l’abri.
- 6... Nf6 — Ton second cavalier sort et attaque le pion e4.
- 7. h3 — Le pion h3 empêche ton fou c8 de venir en g4.
- 7... O-O — Tu fais le petit roque : ton roi est à l’abri derrière le fou g7.
- 8. d3 — Le pion d3 protège e4 et ouvre la diagonale du fou c1.
- 8... Rb8 — Ta tour prépare …b5 : ton jeu est sur l’aile dame, comme dans la leçon.

**Ligne 2 — 2.Qh5 d6 3.Bc4 g6 4.Qf3 (la dame revient sur f7)** (début : 1. e4 c5 2. Qh5 d6 3. Bc4 g6)

- 4. Qf3 — La dame revient viser f7, cette fois par la colonne f : elle menace encore Qxf7+.
- 4... Nf6 — Ton cavalier bloque la colonne f : f7 est de nouveau à l’abri.
- 5. d3 — Le pion d3 protège e4, attaqué par ton cavalier.
- 5... Bg7 — Ton fou rejoint la grande diagonale.
- 6. Ne2 — Le cavalier sort en e2, car la dame occupe f3.
- 6... Nc6 — Ton second cavalier se développe.
- 7. Nbc3 — L’autre cavalier blanc se développe.
- 7... O-O — Tu roques : ton roi est à l’abri.
- 8. O-O — Les Blancs roquent aussi.
- 8... e6 — Le pion e6 ferme pour de bon la diagonale du fou c4 vers f7.

**Ligne 3 — 2.Qf3 puis 3.Bc4 (menace de mat en f7)** (début : 1. e4 c5)

- 2. Qf3 — La dame blanche sort en f3 : elle vise f7 par la colonne f.
- 2... Nc6 — Tu te développes normalement : la dame seule ne menace rien.
- 3. Bc4 — Le fou rejoint la dame : ils menacent Qxf7 échec et mat.
- 3... Nf6 — Ton cavalier bloque la colonne f : plus de mat en f7.
- 4. d3 — Le pion d3 protège e4, attaqué par ton cavalier.
- 4... g6 — Tu prépares ton fianchetto ; la dame ne pourra pas venir en h5.
- 5. Nc3 — Le cavalier blanc se développe.
- 5... Bg7 — Ton fou se place sur la grande diagonale.
- 6. Nge2 — Le second cavalier sort en e2, car la dame occupe f3.
- 6... d6 — Le pion d6 ouvre la diagonale de ton fou c8.
- 7. Qg3 — La dame passe en g3, face à ton roque : elle prépare Bh6 pour échanger ton fou g7.
- 7... O-O — Tu roques quand même : ton pion d6 reste protégé par le pion e7.
- 8. O-O — Les Blancs roquent.
- 8... Bd7 — Ton dernier fou se développe ; ensuite …Rb8 et …b5 sur l’aile dame.

**Ligne 4 — 2.Bc4 Nc6 3.Qf3 (même idée, autre ordre)** (début : 1. e4 c5)

- 2. Bc4 — Le fou blanc vise tout de suite f7.
- 2... Nc6 — Tu te développes.
- 3. Qf3 — La dame rejoint le fou : ils menacent Qxf7 échec et mat.
- 3... Nf6 — Comme contre 2.Qf3 : ton cavalier bloque la colonne f.
- 4. d3 — Le pion d3 protège e4.
- 4... g6 — C’est la même position que contre 2.Qf3 : continue avec …Bg7, …d6 et le roque.

**Ligne 5 — 2.Bc4 Nc6 3.Qh5 (mat en f7 et pion c5 visés)** (début : 1. e4 c5 2. Bc4 Nc6)

- 3. Qh5 — La dame menace Qxf7 échec et mat avec le fou, et vise aussi ton pion c5.
- 3... e6 — Le pion e6 ferme la route du fou vers f7 et ouvre celle de ton fou f8, qui protège c5 ; ici …g6 perdrait c5.
- 4. Nf3 — Le cavalier blanc se développe.
- 4... Nf6 — Ton cavalier attaque la dame : tu gagnes du temps.
- 5. Qh4 — La dame recule en h4.
- 5... d5 — Le pion d5 attaque à la fois le fou c4 et le pion e4.
- 6. exd5 — Les Blancs prennent ton pion.
- 6... exd5 — Tu reprends : le fou c4 est de nouveau attaqué.
- 7. Bb5 — Le fou s’écarte en b5 et cloue ton cavalier c6 devant ton roi.
- 7... Bd6 — Ton fou se développe et prépare le roque.
- 8. O-O — Les Blancs roquent.
- 8... O-O — Tu roques : le clouage disparaît, ton centre est solide et tes pièces actives.

**Ligne 6 — 2.Nc3 Nc6 3.Bc4 g6 4.Qf3** (début : 1. e4 c5 2. Nc3 Nc6)

- 3. Bc4 — Le fou blanc vise f7.
- 3... g6 — Le pion g6 prépare ton fianchetto et interdit Qh5.
- 4. Qf3 — La dame rejoint le fou contre f7 : menace Qxf7 échec et mat.
- 4... Nf6 — Ton cavalier bloque la colonne f : f7 est à l’abri.
- 5. d3 — Le pion d3 protège e4.
- 5... Bg7 — Ton fou va sur la grande diagonale.
- 6. Nge2 — Le cavalier sort en e2, car la dame occupe f3.
- 6... d6 — Le pion d6 ouvre la diagonale de ton fou c8.
- 7. O-O — Les Blancs roquent.
- 7... O-O — Tu roques à ton tour.
- 8. Qg3 — La dame passe en g3 et vise ton pion d6.
- 8... Bd7 — Ton fou se développe ; d6 reste protégé par le pion e7.

### 6. Les autres lignes, par carrefour

Chaque ligne se regarde puis se rejoue comme un bloc de la leçon ; ses coups entrent dans le drill. Accès : page de l’ouverture → onglet « Leçon » → sommaire.

#### Carrefour après 1.e4 c5

À ce carrefour, il a plusieurs coups dans ton répertoire (2.Nf3, 2.Nc3, 2.c3, 2.d4, 2.Bc4, 2.Qh5, 2.Qf3, 2.d3, 2.c4) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 2.Nc3 Nc6 3.Bc4 g6 4.Qf3** (début : 1. e4 c5)

- 2. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 2... Nc6 — Ton cavalier se développe en c6 et surveille d4 et e5.
- 3. Bc4 — Le fou blanc vise f7.
- 3... g6 — Le pion g6 prépare ton fianchetto et interdit Qh5.
- 4. Qf3 — La dame rejoint le fou contre f7 : menace Qxf7 échec et mat.
- 4... Nf6 — Ton cavalier bloque la colonne f : f7 est à l’abri.
- 5. d3 — Le pion d3 protège e4.
- 5... Bg7 — Ton fou se place sur la grande diagonale.
- 6. Nge2 — Le second cavalier sort en e2, car la dame occupe f3.
- 6... d6 — Le pion d6 ouvre la diagonale de ton fou c8.
- 7. O-O — Les Blancs roquent.
- 7... O-O — Tu roques à ton tour.
- 8. Qg3 — La dame passe en g3 et vise ton pion d6.
- 8... Bd7 — Ton dernier fou se développe ; ensuite …Rb8 et …b5 sur l’aile dame.

_Le plan :_ Ton pion f7 est à l’abri : …Na5 échange son fou c4, puis …Rb8 et …b5 attaquent sur l’aile dame.

**Ligne 2 — 2.c3** (début : 1. e4 c5)

- 2. c3 — Le pion c3 prépare d4 : il pourra occuper tout le centre.
- 2... Nf6 — Ton cavalier va en f6 et attaque son pion e4.
- 3. e5 — Son pion e4, attaqué par ton cavalier, avance en e5 et chasse ton cavalier f6.
- 3... Nd5 — Ton cavalier, attaqué par son pion, s’écarte en d5.
- 4. d4 — Le pion d4 attaque ton pion c5.
- 4... cxd4 — Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours.
- 5. Nf3 — Son cavalier va en f3 et attaque ton pion d4.
- 5... Nc6 — Ton cavalier se développe en c6 et surveille d4 et e5.
- 6. cxd4 — Son pion prend ton pion d4 : la colonne c s’ouvre pour ses tours.
- 6... d6 — Le pion d6 ouvre la diagonale de ton fou c8.
- 7. Bc4 — Son fou va en c4 et attaque ton cavalier d5.
- 7... Nb6 — Ton cavalier, attaqué par son fou, s’écarte en b6 et attaque son fou c4 ; il surveille aussi d5.
- 8. Bb5 — Son fou, attaqué par ton cavalier, s’écarte en b5 et cloue ton cavalier c6 sur ton roi.
- 8... dxe5 — Ton pion prend son pion e5 : la colonne d s’ouvre pour tes tours.
- 9. Nxe5 — Son cavalier reprend en e5 : le matériel reste égal.
- 9... Bd7 — Ton fou va en d7 et protège ton cavalier c6, attaqué par son fou et son cavalier ; ton cavalier c6 n’est plus cloué.
- 10. Nxd7 — Son cavalier, attaqué par ton cavalier, prend ton fou d7.
- 10... Qxd7 — Ta dame reprend en d7 : le matériel reste égal.

_Le plan :_ Continue avec …e6, …Be7 et le roque : son pion d4 est isolé, place un cavalier en d5 devant lui et attaque-le.

**Ligne 3 — 2.d4** (début : 1. e4 c5)

- 2. d4 — Le pion d4 attaque ton pion c5.
- 2... cxd4 — Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours.
- 3. c3 — Le pion c3 attaque ton pion d4.
- 3... Nf6 — Ton cavalier va en f6 et contre-attaque son pion e4 au lieu de défendre ton pion d4.
- 4. e5 — Son pion e4, attaqué par ton cavalier, avance en e5 et chasse ton cavalier f6.
- 4... Nd5 — Ton cavalier, attaqué par son pion, s’écarte en d5.
- 5. Nf3 — Son cavalier va en f3 et attaque ton pion d4.
- 5... Nc6 — Ton cavalier se développe en c6 et surveille d4 et e5.
- 6. cxd4 — Son pion prend ton pion d4 : la colonne c s’ouvre pour ses tours.
- 6... d6 — Le pion d6 ouvre la diagonale de ton fou c8.
- 7. Bc4 — Son fou va en c4 et attaque ton cavalier d5.
- 7... Nb6 — Ton cavalier, attaqué par son fou, s’écarte en b6 et attaque son fou c4 ; il surveille aussi d5.

_Le plan :_ Même position que dans la ligne 2.c3 : …dxe5 ouvre le centre, puis …g6 et …Bg7 pour viser son pion d4.

**Ligne 4 — 2.d3** (début : 1. e4 c5)

- 2. d3 — Le pion d3 soutient son pion e4.
- 2... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 3. g3 — Le pion g3 prépare le fianchetto de son fou en g2.
- 3... Bg7 — Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 4. Bg2 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 4... Nc6 — Ton cavalier se développe en c6 et surveille d4 et e5.
- 5. c3 — Le pion c3 surveille d4, au centre.
- 5... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 6. d4 — Le pion d4 attaque ton pion c5.
- 6... d6 — Le pion d6 protège ton pion c5, attaqué par son pion, et ouvre la diagonale de ton fou c8.
- 7. d5 — Le pion d5 chasse ton cavalier c6.
- 7... Na5 — Ton cavalier, attaqué par son pion, s’écarte en a5.
- 8. Na3 — Son cavalier se développe en a3.
- 8... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.

_Le plan :_ Attaque son pion d5 avec …e6 (ou …b5), et méfie-toi de b4 qui chasse ton cavalier a5 : réponds-y par …cxb4.

**Ligne 5 — 2.c4** (début : 1. e4 c5)

- 2. c4 — Le pion c4 prend de l’espace au centre et surveille d5.
- 2... Nc6 — Ton cavalier se développe en c6 et surveille d4 et e5.
- 3. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 3... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 4. Nge2 — Son cavalier se développe en e2 et surveille d4.
- 4... Bg7 — Ton fou se développe en g7 et vise son cavalier c3.
- 5. d3 — Le pion d3 soutient son pion c4.
- 5... d6 — Le pion d6 soutient ton pion c5.
- 6. g3 — Le pion g3 prépare le fianchetto de son fou en g2.
- 6... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 7. h3 — Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer.
- 7... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8. Bg2 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 8... Bd7 — Ton fou se développe en d7.

_Le plan :_ Ensuite …e5 (la case d4 pour ton cavalier), puis …Rb8 et …a6 pour préparer …b5 contre son pion c4.

#### Carrefour après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Be3 Nf6

À ce carrefour, il a plusieurs coups dans ton répertoire (7.Bc4, 7.Be2) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 7.Be2** (début : 1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6)

- 7. Be2 — Son fou se développe en e2.
- 7... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8. O-O — Petit roque : son roi se met à l’abri.
- 8... d5 — Le pion d5 prend de l’espace au centre et surveille e4.
- 9. exd5 — Son pion prend ton pion d5, qui attaquait son pion e4, et la colonne e s’ouvre pour ses tours.
- 9... Nxd5 — Ton cavalier reprend en d5 : le matériel reste égal.
- 10. Nxd5 — Son cavalier reprend en d5 : le matériel reste égal.
- 10... Qxd5 — Ta dame reprend en d5 : le matériel reste égal.
- 11. Bf3 — Son fou va en f3 et contre-attaque ta dame d5 au lieu de défendre son cavalier d4.
- 11... Qc4 — Ta dame, attaquée par son fou, s’écarte en c4 ; elle surveille aussi d4 et d5.
- 12. Nxc6 — Son cavalier, attaqué par ta dame, ton fou et ton cavalier, prend ton cavalier c6.
- 12... bxc6 — Ton pion reprend en c6 : le matériel reste égal.
- 13. b3 — Le pion b3 chasse ta dame c4.
- 13... Qa6 — Ta dame, attaquée par son pion, s’écarte en a6.

_Le plan :_ Ton fou g7 vise c3 et a1 : sors ton fou c8 (…Bf5 ou …Be6), puis tes tours sur les colonnes b et d contre ses pions de l’aile dame.

#### Carrefour après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6

À ce carrefour, il a plusieurs coups dans ton répertoire (5.Nc3, 5.c4, 5.Nxc6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 5.c4** (début : 1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6)

- 5. c4 — Le pion c4 prend de l’espace au centre et surveille d5.
- 5... Bg7 — Ton fou se développe en g7 et vise son cavalier d4.
- 6. Be3 — Son fou va en e3 et protège son cavalier d4, attaqué par ton fou et ton cavalier.
- 6... Nf6 — Ton cavalier va en f6 et attaque son pion e4.
- 7. Nc3 — Son cavalier va en c3 et protège son pion e4, attaqué par ton cavalier ; il surveille aussi d5.
- 7... Ng4 — Ton cavalier va en g4 et vise e5.
- 8. Qxg4 — Sa dame prend ton cavalier g4.
- 8... Nxd4 — Ton cavalier prend son cavalier d4 et menace Nc2+, fourchette sur son roi et sa tour a1.
- 9. Qd1 — Sa dame va en d1 et garde c2 : plus de fourchette Nc2+ sur son roi et sa tour.
- 9... Ne6 — Ton cavalier, attaqué par sa dame et son fou, s’écarte en e6 ; il surveille aussi d4.
- 10. Rc1 — Sa tour vient en c1, prête si la colonne c s’ouvre.
- 10... Qa5 — Ta dame cloue son cavalier c3 sur son roi.
- 11. Qd2 — Sa dame va en d2 : son cavalier c3 n’est plus cloué.
- 11... d6 — Le pion d6 ouvre la diagonale de ton fou c8.

_Le plan :_ Roque, puis …b6 et …Bb7 (ou …Be6) : avec ta dame a5 et ton fou g7, vise ses pions c3 et c4.

**Ligne 2 — 5.Nxc6** (début : 1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6)

- 5. Nxc6 — Son cavalier prend ton cavalier c6 et menace de prendre ta dame d8.
- 5... bxc6 — Ton pion reprend en c6 : le matériel reste égal.
- 6. Bd3 — Son fou se développe en d3 et surveille e4.
- 6... Bg7 — Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 7. O-O — Petit roque : son roi se met à l’abri.
- 7... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 8. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 8... d6 — Le pion d6 ouvre la diagonale de ton fou c8.
- 9. h3 — Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer, et son roi a une case de fuite.
- 9... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 10. Be3 — Son fou se développe en e3 et surveille d4.
- 10... Rb8 — Ta tour va en b8 et attaque son pion b2.

_Le plan :_ Ta tour b8 attaque b2 : joue ensuite …Qc7 et …Nd7 pour libérer ton fou g7, et pousse …c5 pour gagner de la place.

#### Carrefour après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nxc6 bxc6

À ce carrefour, il a plusieurs coups dans ton répertoire (6.Bd3, 6.Qd4) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 6.Qd4** (début : 1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nxc6 bxc6)

- 6. Qd4 — Sa dame va en d4 et attaque ta tour h8.
- 6... Nf6 — Ton cavalier bouche la diagonale de sa dame : ta tour h8 n’est plus attaquée ; il surveille aussi d5 et e4.
- 7. e5 — Le pion e5 chasse ton cavalier f6.
- 7... Nd5 — Ton cavalier, attaqué par son pion, s’écarte en d5.
- 8. e6 — Le pion e6 ouvre la diagonale de sa dame d4, qui menace de prendre ta tour h8.
- 8... f6 — Le pion f6 bouche la diagonale de sa dame : ta tour h8 n’est plus attaquée.
- 9. exd7+ — Son pion prend ton pion d7, avec échec : la colonne e s’ouvre pour ses tours.
- 9... Bxd7 — Ton fou reprend en d7 : le matériel reste égal.
- 10. Bc4 — Son fou se développe en c4 et vise ton cavalier d5.
- 10... e5 — Le pion e5 contre-attaque sa dame d4 au lieu de défendre ton cavalier d5.

_Le plan :_ Ton pion e5 chasse sa dame : ensuite sors ton fou f8 (…Be7), échange son fou c4 par …Be6 et roque ; tes pions c6 et e5 te donnent de l’espace.

#### Carrefour après 1.e4 c5 2.Nf3 Nc6

À ce carrefour, il a plusieurs coups dans ton répertoire (3.d4, 3.Bc4, 3.Bb5, 3.Nc3, 3.c3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 3.Bc4** (début : 1. e4 c5 2. Nf3 Nc6)

- 3. Bc4 — Son fou se développe en c4 et surveille d5.
- 3... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 4. O-O — Petit roque : son roi se met à l’abri.
- 4... Bg7 — Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 5. c3 — Le pion c3 prépare d4 : il pourra occuper tout le centre.
- 5... e6 — Le pion e6 surveille d5, au centre.
- 6. d4 — Le pion d4 attaque ton pion c5.
- 6... cxd4 — Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours.
- 7. cxd4 — Son pion reprend en d4 : le matériel reste égal.
- 7... d5 — Le pion d5 chasse son fou c4.
- 8. exd5 — Son pion prend ton pion d5, qui attaquait son fou c4, et la colonne e s’ouvre pour ses tours.
- 8... exd5 — Ton pion reprend en d5 : le matériel reste égal.
- 9. Bb5 — Son fou, attaqué par ton pion, s’écarte en b5 et cloue ton cavalier c6 sur ton roi.
- 9... Ne7 — Ton cavalier se développe en e7 et surveille d5.
- 10. Re1 — Sa tour cloue ton cavalier e7 sur ton roi.
- 10... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.

_Le plan :_ Vise son pion d4, isolé : ton cavalier ira en f5, ta dame en b6, ton fou g7 tire déjà dessus, et ta tour prend la colonne c.

**Ligne 2 — 3.Bb5** (début : 1. e4 c5 2. Nf3 Nc6)

- 3. Bb5 — Son fou se développe en b5 et vise ton cavalier c6.
- 3... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 4. O-O — Petit roque : son roi se met à l’abri.
- 4... Bg7 — Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 5. Re1 — Sa tour vient en e1 et soutient son pion e4.
- 5... e5 — Le pion e5 prend de l’espace au centre et surveille d4.
- 6. Bxc6 — Son fou prend ton cavalier c6.
- 6... dxc6 — Ton pion reprend en c6 : le matériel reste égal.
- 7. d3 — Le pion d3 soutient son pion e4.
- 7... Qe7 — Ta dame sort en e7 et surveille e5.
- 8. Nbd2 — Son cavalier se développe en d2 et surveille e4.
- 8... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 9. Nc4 — Son cavalier va en c4 et vise e5.
- 9... Nd7 — Ton cavalier va en d7 et protège ton pion e5, attaqué par ses deux cavaliers.

_Le plan :_ Ton cavalier d7 protège e5 : roque, puis …b6 et …f6 rendent ton centre solide.

**Ligne 3 — 3.Nc3** (début : 1. e4 c5 2. Nf3 Nc6)

- 3. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 3... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 4. d4 — Le pion d4 attaque ton pion c5.
- 4... cxd4 — Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours.
- 5. Nxd4 — Son cavalier reprend en d4 : le matériel reste égal.
- 5... Bg7 — Ton fou se place sur la grande diagonale et vise le cavalier d4 et l’aile dame.
- 6. Be3 — Le fou blanc protège le cavalier d4.
- 6... Nf6 — Ton second cavalier se développe et attaque le pion e4.
- 7. Bc4 — Le fou blanc vise ton pion f7, le point faible près de ton roi.
- 7... O-O — Tu fais le petit roque : ton roi est à l’abri derrière le fou g7.
- 8. Bb3 — Le fou blanc se met à l’abri en b3, d’où il vise toujours f7.
- 8... d6 — Le pion d6 ouvre la diagonale de ton fou c8 et surveille la case e5.

_Le plan :_ Ensuite …Bd7 et …Rc8, puis …Nxd4 et …b5 : tu attaques son fou b3 et tu ouvres la colonne c.

**Ligne 4 — 3.c3** (début : 1. e4 c5 2. Nf3 Nc6)

- 3. c3 — Le pion c3 prépare d4 : il pourra occuper tout le centre.
- 3... Nf6 — Ton cavalier va en f6 et attaque son pion e4.
- 4. d4 — Le pion d4 contre-attaque ton pion c5 au lieu de défendre son pion e4.
- 4... cxd4 — Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours.
- 5. e5 — Le pion e5 chasse ton cavalier f6.
- 5... Nd5 — Ton cavalier, attaqué par son pion, s’écarte en d5.
- 6. cxd4 — Son pion prend ton pion d4 : la colonne c s’ouvre pour ses tours.
- 6... d6 — Le pion d6 ouvre la diagonale de ton fou c8.
- 7. Bc4 — Son fou va en c4 et attaque ton cavalier d5.
- 7... Nb6 — Ton cavalier, attaqué par son fou, s’écarte en b6 et attaque son fou c4 ; il surveille aussi d5.
- 8. Bb3 — Son fou, attaqué par ton cavalier, s’écarte en b3 ; il surveille aussi d5.
- 8... dxe5 — Ton pion prend son pion e5 : la colonne d s’ouvre pour tes tours.

_Le plan :_ S’il reprend en e5, échange les cavaliers puis les dames (…Qxd1+) : la finale est égale et ton fou c8 sort en f5.

#### Carrefour après 1.e4 c5 2.Nf3 Nc6 3.Bc4 g6

À ce carrefour, il a plusieurs coups dans ton répertoire (4.O-O, 4.Nc3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 4.Nc3** (début : 1. e4 c5 2. Nf3 Nc6 3. Bc4 g6)

- 4. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 4... Bg7 — Ton fou se développe en g7 et vise son cavalier c3.
- 5. d3 — Le pion d3 soutient son fou c4.
- 5... e6 — Le pion e6 surveille d5, au centre.
- 6. O-O — Petit roque : son roi se met à l’abri.
- 6... Nge7 — Ton cavalier se développe en e7 et surveille d5.
- 7. Bb3 — Son fou va en b3 et vise d5.
- 7... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8. Re1 — Sa tour vient en e1 et soutient son pion e4.
- 8... d6 — Le pion d6 soutient ton pion c5.
- 9. Ne2 — Son cavalier se met à l’abri en e2 et surveille d4.
- 9... Ne5 — Ton cavalier se replace en e5.
- 10. Nxe5 — Son cavalier prend ton cavalier e5.
- 10... dxe5 — Ton pion reprend en e5 : le matériel reste égal.

_Le plan :_ Ensuite …b6 et …Qc7, puis ton cavalier e7 vient en c6 et vise d4 : ton pion e5 tient le centre.

#### Carrefour après 1.e4 c5 2.Nf3 Nc6 3.Bb5 g6

À ce carrefour, il a plusieurs coups dans ton répertoire (4.O-O, 4.Bxc6) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 4.Bxc6** (début : 1. e4 c5 2. Nf3 Nc6 3. Bb5 g6)

- 4. Bxc6 — Son fou prend ton cavalier c6.
- 4... dxc6 — Ton pion reprend en c6 : le matériel reste égal.
- 5. d3 — Le pion d3 soutient son pion e4.
- 5... Bg7 — Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 6. h3 — Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer.
- 6... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 7. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 7... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8. Be3 — Son fou va en e3 et attaque ton pion c5.
- 8... b6 — Le pion b6 protège ton pion c5, attaqué par son fou, et prépare le fianchetto de ton fou en b7.
- 9. Qd2 — Sa dame sort en d2 : avec son fou e3, Bh6 échangera ton fou g7, le meilleur défenseur de ton roi.
- 9... e5 — Le pion e5 prend de l’espace au centre et surveille d4.

_Le plan :_ S’il échange les fous de cases noires (Bh6), reprends avec le roi ; puis …Qd6 et …Ne8 : tes pions c5 et e5 tiennent la case d4.

#### Carrefour après 1.e4 c5 2.Nc3 Nc6

À ce carrefour, il a plusieurs coups dans ton répertoire (3.g3, 3.f4, 3.Nf3, 3.Bc4, 3.Bb5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 3.g3** (début : 1. e4 c5 2. Nc3 Nc6)

- 3. g3 — Le pion g3 prépare le fianchetto de son fou en g2.
- 3... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 4. Bg2 — Son fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 4... Bg7 — Ton fou se développe en g7 et vise son cavalier c3.
- 5. d3 — Le pion d3 soutient son pion e4.
- 5... d6 — Le pion d6 soutient ton pion c5.
- 6. f4 — Le pion f4 prend de l’espace au centre et surveille e5.
- 6... e6 — Le pion e6 surveille d5, au centre.
- 7. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 7... Nge7 — Ton cavalier se développe en e7 et surveille d5.
- 8. O-O — Petit roque : son roi se met à l’abri.
- 8... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 9. Be3 — Son fou se développe en e3 et surveille d4.
- 9... Nd4 — Ton cavalier s’installe en d4, un avant-poste protégé par ton pion. _(mot expliqué : avant-poste)_
- 10. Qd2 — Sa dame sort en d2 : avec son fou e3, Bh6 échangera ton fou g7, le meilleur défenseur de ton roi.
- 10... Rb8 — Ta tour vient en b8 et soutient ton pion b7.

_Le plan :_ Avance …b5 et …b4 avec ta tour b8 ; s’il lance g4 contre ton roi, l’avance …f5 freine son attaque.

**Ligne 2 — 3.f4** (début : 1. e4 c5 2. Nc3 Nc6)

- 3. f4 — Le pion f4 prend de l’espace au centre et surveille e5.
- 3... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 4. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 4... Bg7 — Ton fou se développe en g7 et vise son cavalier c3.
- 5. Bc4 — Son fou se développe en c4 et surveille d5.
- 5... e6 — Le pion e6 surveille d5, au centre.
- 6. O-O — Petit roque : son roi se met à l’abri.
- 6... Nge7 — Ton cavalier se développe en e7 et surveille d5.
- 7. d3 — Le pion d3 soutient son fou c4.
- 7... d5 — Le pion d5 chasse son fou c4.
- 8. Bb3 — Son fou, attaqué par ton pion, s’écarte en b3 ; il surveille aussi d5.
- 8... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.

_Le plan :_ S’il pousse e5, le centre se ferme : …b6 puis …Ba6 met ton fou sur une diagonale libre, et …c4 attaque à l’aile dame.

**Ligne 3 — 3.Nf3** (début : 1. e4 c5 2. Nc3 Nc6)

- 3. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 3... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 4. d4 — Le pion d4 attaque ton pion c5.
- 4... cxd4 — Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours.
- 5. Nxd4 — Son cavalier reprend en d4 : le matériel reste égal.
- 5... Bg7 — Ton fou se place sur la grande diagonale et vise le cavalier d4 et l’aile dame.
- 6. Be3 — Le fou blanc protège le cavalier d4.
- 6... Nf6 — Ton second cavalier se développe et attaque le pion e4.
- 7. Bc4 — Le fou blanc vise ton pion f7, le point faible près de ton roi.
- 7... O-O — Tu fais le petit roque : ton roi est à l’abri derrière le fou g7.

_Le plan :_ Après Bb3, …d6 puis …Bd7 et …Rc8 : ta tour prend la colonne c, et …Na5 ou …b5 attaquera son fou b3.

**Ligne 4 — 3.Bb5** (début : 1. e4 c5 2. Nc3 Nc6)

- 3. Bb5 — Son fou se développe en b5 et vise ton cavalier c6.
- 3... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 4. Bxc6 — Son fou prend ton cavalier c6.
- 4... bxc6 — Ton pion reprend en c6 : le matériel reste égal.
- 5. f4 — Le pion f4 prend de l’espace au centre et surveille e5.
- 5... Bg7 — Ton fou se développe en g7 et vise son cavalier c3.
- 6. d3 — Le pion d3 soutient son pion e4.
- 6... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 7. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 7... d6 — Le pion d6 soutient ton pion c5.
- 8. h3 — Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer.
- 8... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.

_Le plan :_ Ta tour va en b8 sur la colonne semi-ouverte et ton cavalier f6 passe par e8 vers c7 ; ta paire de fous et …c4 te donnent du jeu à l’aile dame.

#### Carrefour après 1.e4 c5 2.Nc3 Nc6 3.Bc4 g6

À ce carrefour, il a plusieurs coups dans ton répertoire (4.Qf3, 4.Nf3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 4.Nf3** (début : 1. e4 c5 2. Nc3 Nc6 3. Bc4 g6)

- 4. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 4... Bg7 — Ton fou se développe en g7 et vise son cavalier c3.
- 5. d3 — Le pion d3 soutient son fou c4.
- 5... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 6. h3 — Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer.
- 6... d6 — Le pion d6 soutient ton pion c5.
- 7. O-O — Petit roque : son roi se met à l’abri.
- 7... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8. Be3 — Son fou se développe en e3 et surveille d4.
- 8... e6 — Ton pion va en e6 : ton pion f7 n’est plus cloué.

_Le plan :_ Ton pion e6 coupe la diagonale de son fou c4 et prépare …d5 ; s’il ouvre le centre avec d4, réponds …d5 et ton fou g7 devient très fort.

#### Carrefour après 1.e4 c5 2.c3 Nf6 3.e5 Nd5

À ce carrefour, il a plusieurs coups dans ton répertoire (4.d4, 4.Nf3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 4.Nf3** (début : 1. e4 c5 2. c3 Nf6 3. e5 Nd5)

- 4. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 4... Nc6 — Ton cavalier se développe en c6 et surveille d4 et e5.
- 5. d4 — Le pion d4 attaque ton pion c5.
- 5... cxd4 — Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours.
- 6. cxd4 — Son pion prend ton pion d4 : la colonne c s’ouvre pour ses tours.
- 6... d6 — Le pion d6 ouvre la diagonale de ton fou c8.
- 7. Bc4 — Son fou va en c4 et attaque ton cavalier d5.
- 7... Nb6 — Ton cavalier, attaqué par son fou, s’écarte en b6 et attaque son fou c4 ; il surveille aussi d5.

_Le plan :_ Même position que dans la ligne 2.c3 : …dxe5 ouvre le centre, puis …g6 et …Bg7 pour viser son pion d4.

#### Carrefour après 1.e4 c5 2.d4 cxd4

À ce carrefour, il a plusieurs coups dans ton répertoire (3.c3, 3.Nf3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 3.Nf3** (début : 1. e4 c5 2. d4 cxd4)

- 3. Nf3 — Son cavalier va en f3 et attaque ton pion d4.
- 3... Nc6 — Ton cavalier se développe en c6 et surveille d4 et e5.
- 4. Nxd4 — Le cavalier blanc reprend le pion et s’installe au centre.
- 4... g6 — Tu prépares tout de suite le fianchetto de ton fou f8 : c’est le Dragon accéléré.
- 5. Nc3 — Le second cavalier blanc protège le pion e4.
- 5... Bg7 — Ton fou se place sur la grande diagonale et vise le cavalier d4 et l’aile dame.
- 6. Be3 — Le fou blanc protège le cavalier d4.
- 6... Nf6 — Ton second cavalier se développe et attaque le pion e4.

_Le plan :_ Tu retrouves la ligne principale : contre Bc4, roque ; si Nxc6 bxc6 puis e5, recule ton cavalier en g8, puis …d6 attaque son pion e5.

#### Carrefour après 1.e4 c5 2.Bc4 Nc6

À ce carrefour, il a plusieurs coups dans ton répertoire (3.Nf3, 3.Qf3, 3.Qh5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 3.Nf3** (début : 1. e4 c5 2. Bc4 Nc6)

- 3. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 3... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 4. O-O — Petit roque : son roi se met à l’abri.
- 4... Bg7 — Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 5. c3 — Le pion c3 prépare d4 : il pourra occuper tout le centre.
- 5... e6 — Le pion e6 surveille d5, au centre.

_Le plan :_ Ensuite …Nge7 et …d5 : ton pion e6 a coupé la diagonale de son fou c4, et …d5 te donnera le centre.

#### Carrefour au premier coup

À ce carrefour, il a plusieurs coups dans ton répertoire (1.e4, 1.e3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 1.e3**

- 1. e3 — Le pion e3 ouvre la diagonale de son fou f1.
- 1... c5 — Le pion c5 prend de l’espace au centre et surveille d4.
- 2. d4 — Le pion d4 attaque ton pion c5.
- 2... g6 — Le pion g6 prépare le fianchetto de ton fou en g7.
- 3. c4 — Le pion c4 prend de l’espace au centre et surveille d5.
- 3... Bg7 — Ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile.
- 4. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 4... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 5. d5 — Le pion d5 occupe le centre.
- 5... d6 — Le pion d6 soutient ton pion c5.
- 6. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 6... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 7. Bd3 — Son fou se développe en d3 et surveille e4.
- 7... e6 — Le pion e6 surveille d5, au centre.
- 8. h3 — Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer.
- 8... exd5 — Ton pion prend son pion d5 : la colonne e s’ouvre pour tes tours.

_Le plan :_ Après cxd5, ton plan est à l’aile dame : …Na6 puis …Nc7, …Re8 et …b5 ; ton fou g7 tire sur la grande diagonale.

## Londres en défense (Noirs)

Le « Londres en défense » : contre 1.d4, 1.c4 et 1.Nf3, tu places tes pièces presque toujours aux mêmes cases : …d5, …c6, …Nf6, le fou en f5 AVANT …e6, puis …e6, …Bd6, …Nbd7 et le petit roque.

### 1-2. Ligne principale, par blocs

**Bloc 1**

- 1. d4 — Les Blancs occupent le centre avec leur pion d. _(mot expliqué : centre)_
- 1... d5 — Ton pion d5 prend lui aussi une case du centre : c’est la base de ton système.
- 2. c4 — Les Blancs attaquent ton pion d5 avec le pion c : c’est le Gambit Dame.
- 2... c6 — Le pion c6 soutient d5 sans enfermer ton fou c8 : c’est la Défense slave.
- 3. Nf3 — Le cavalier blanc se développe et surveille la case e5. _(mot expliqué : développer)_
- 3... Nf6 — Ton cavalier se développe et protège d5 une deuxième fois.

**Bloc 2**

- 4. e3 — Le pion e3 soutient d4, mais il enferme le fou c1 des Blancs.
- 4... Bf5 — Ton fou sort AVANT …e6 : c’est l’idée du Londres en défense, ce fou ne restera pas enfermé.
- 5. Nc3 — Le second cavalier blanc se développe et vise d5.
- 5... e6 — Le pion e6 complète ta chaîne de pions c6-d5-e6 et ouvre la diagonale de ton fou f8. _(mot expliqué : chaîne de pions)_
- 6. Nh4 — Le cavalier blanc attaque ton fou f5 pour l’échanger.
- 6... Bg6 — Ton fou recule en g6 : si le cavalier le prend, tu reprends avec le pion h.

**Bloc 3**

- 7. Nxg6 — Les Blancs échangent leur cavalier contre ton fou.
- 7... hxg6 — Tu reprends vers le centre : ta tour h8 voit maintenant la colonne h ouverte.
- 8. Bd3 — Le fou blanc se développe et vise ton pion g6.
- 8... Bd6 — Ton fou se place en d6, sa case préférée, d’où il vise h2.
- 9. Qb3 — La dame blanche attaque ton pion b7.
- 9... Qc7 — Ta dame protège b7 et se place derrière ton fou d6 : ensemble, ils visent h2.

**Bloc 4**

- 10. cxd5 — Les Blancs échangent au centre.
- 10... exd5 — Tu reprends avec le pion e : ta chaîne c6-d5 reste solide et la colonne e s’ouvre pour tes tours.
- 11. Bd2 — Le fou blanc se développe ; les Blancs préparent le grand roque. _(mot expliqué : roque)_
- 11... Nbd7 — Ton dernier cavalier se développe derrière tes pions : tout ton système est en place.

### 3. Le plan

1. Tes pièces vont presque toujours aux mêmes cases : pions d5, c6 et e6, fou en f5 (sorti avant …e6) puis g6, fou en d6, cavaliers en f6 et d7, petit roque.
2. Quand les Blancs ont déjà c4 et Nc3, ne sors pas ton fou en f5 trop tôt : après cxd5 cxd5 et Qb3, ton pion b7 tombe ; Stockfish joue alors …e6 d’abord.
3. Au milieu de partie, tes tours prennent les colonnes ouvertes (h après …hxg6, e après …exd5) et tu prépares …c5 ou …e5 pour libérer ton jeu.

### 4. Partie type (Stockfish contre lui-même)

Coups : 12. O-O-O 12... b5 13. Kb1 13... O-O 14. Rc1 14... a6 15. h4 15... Rfe8 16. Qd1 16... c5 17. h5 17... c4

Moments clés :

- 12. O-O-O — Les Blancs font le grand roque : leur roi part à l’aile dame, le tien ira à l’aile roi.
- 12... b5 — Avec des roques opposés, tu attaques avec les pions : ton pion b avance vers le roi blanc. _(mot expliqué : roques opposés)_
- 13... O-O — Tu fais le petit roque : ton roi est à l’abri derrière les pions f7, g7 et g6.
- 15... Rfe8 — Ta tour vient sur la colonne e, face au pion e3.
- 16... c5 — Ton pion c attaque d4 et ouvre la route vers le roi blanc.
- 17. h5 — Les Blancs attaquent ton roque avec le pion h.
- 17... c4 — Ton pion chasse le fou d3 : la course est lancée, chacun attaque le roi adverse.

Fin : Position un peu meilleure pour les Blancs (leur attaque sur la colonne h est rapide) : dans ces positions, compte bien et va vite sur l’aile dame.

### 5. Bloc supplémentaire : Contre 1.c4, 1.Nf3 et les autres coups blancs

Même placement autant que possible. Deux exceptions vues avec Stockfish : contre c4 et Nc3, …e6 avant …Bf5 (sinon cxd5 cxd5 et Qb3 gagnent b7) ; contre g3 et Nh4, le fou va en g4.

Chaque ligne se regarde puis se rejoue comme un bloc de la leçon ; ses coups entrent dans le drill. Accès direct : écran Ouvertures → « Leçon : contre 1.c4, 1.Nf3 et les autres coups blancs ».

**Ligne 1 — 4.Nc3 : …e6 d’abord** (début : 1. d4 d5 2. c4 c6 3. Nf3 Nf6)

- 4. Nc3 — Le second cavalier blanc soutient c4 et vise d5.
- 4... e6 — …Bf5 serait trop tôt (cxd5 cxd5 puis Qb3 attaque b7) : tu joues …e6 d’abord, comme Stockfish.
- 5. Bg5 — Le fou blanc fait un clouage : ton cavalier f6 est devant ta dame d8. _(mot expliqué : clouage)_
- 5... Nbd7 — Ton cavalier se développe et protège f6.
- 6. cxd5 — Les Blancs échangent au centre.
- 6... exd5 — Tu reprends avec le pion e : ta chaîne c6-d5 reste solide.
- 7. Qc2 — La dame blanche vise h7 et la case f5.
- 7... Bd6 — Ton fou se place en d6, comme dans la leçon.
- 8. e3 — Le pion e3 ouvre la diagonale du fou f1.
- 8... O-O — Tu roques : ton roi est à l’abri.

**Ligne 2 — 2.Nf3 ou 2.Bf4 : Londres contre Londres** (début : 1. d4 d5 2. Nf3 c6 3. Bf4 Nf6 4. e3 Bf5 5. c4 e6)

- 6. Qb3 — La dame blanche attaque ton pion b7.
- 6... Qc8 — Ta dame protège b7 depuis c8, sans s’exposer.
- 7. Nc3 — Le cavalier blanc se développe et vise d5.
- 7... Nbd7 — Ton cavalier se développe derrière ta chaîne de pions.
- 8. cxd5 — Les Blancs échangent au centre.
- 8... Nxd5 — Tu reprends avec le cavalier, qui attaque le cavalier c3 et le fou f4.
- 9. Bg3 — Le fou blanc recule en g3.
- 9... Bg6 — Ton fou recule en g6, à l’abri.

**Ligne 3 — 2.e3 : le fou sort tout de suite** (début : 1. d4 d5)

- 2. e3 — Le pion e3 enferme le fou c1 des Blancs.
- 2... Bf5 — Ton fou sort tout de suite, avant que le fou blanc ne vienne en d3.
- 3. c4 — Les Blancs attaquent ton pion d5.
- 3... e6 — Le pion e6 soutient d5 ; ton fou f5 est déjà dehors.
- 4. Qb3 — La dame blanche vise ton pion b7.
- 4... Nc6 — Ton cavalier se développe : si la dame prend b7, …Nb4 menace …Nc2+ (le roi et la tour a1).
- 5. Bd2 — Le fou blanc se développe et surveille la case b4.
- 5... Rb8 — Ta tour protège b7 : la dame blanche n’a plus de cible.

**Ligne 4 — 1.c4 c6 : même placement**

- 1. c4 — Les Blancs commencent par le pion c.
- 1... c6 — Ton pion c6 prépare …d5 : tu retrouves ton système.
- 2. Nf3 — Le cavalier blanc se développe.
- 2... d5 — Ton pion prend sa place au centre.
- 3. e3 — Le pion e3 prépare d4.
- 3... Nf6 — Ton cavalier se développe vers le centre.
- 4. d4 — Les Blancs occupent le centre : c’est la position de la leçon.
- 4... Bf5 — Ton fou sort avant …e6, comme dans la leçon.
- 5. Nc3 — Le second cavalier blanc se développe.
- 5... e6 — Même position que dans la leçon : contre Nh4, …Bg6 ; puis …Bd6 et …Nbd7.

**Ligne 5 — 1.Nf3 d5 2.g3 : contre le fianchetto** (début : 1. Nf3 d5)

- 2. g3 — Les Blancs préparent le fianchetto de leur fou f1. _(mot expliqué : fianchetto)_
- 2... c6 — Ton pion c6 soutient d5 et laisse ton fou c8 libre.
- 3. Bg2 — Le fou blanc se place sur la grande diagonale. _(mot expliqué : grande diagonale)_
- 3... Nf6 — Ton cavalier se développe vers le centre.
- 4. O-O — Les Blancs roquent.
- 4... Bf5 — Ton fou sort avant …e6, comme toujours.
- 5. d3 — Le pion d3 prépare e4.
- 5... e6 — Le pion e6 complète ta chaîne c6-d5-e6.
- 6. Nh4 — Le cavalier blanc attaque ton fou f5.
- 6... Bg4 — Ici le fou va en g4 (Stockfish) : il attaque le pion e2 au lieu d’être échangé en g6.

### 6. Les autres lignes, par carrefour

Chaque ligne se regarde puis se rejoue comme un bloc de la leçon ; ses coups entrent dans le drill. Accès : page de l’ouverture → onglet « Leçon » → sommaire.

#### Carrefour après 1.d4 d5 2.c4 c6 3.Nf3 Nf6

À ce carrefour, il a plusieurs coups dans ton répertoire (4.e3, 4.Nc3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 4.Nc3 : …e6 d’abord** (début : 1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. Bg5 Nbd7 6. cxd5 exd5 7. Qc2 Bd6 8. e3 O-O)

- 9. Bd3 — Son fou se développe en d3 et surveille e4.
- 9... h6 — Le pion h6 chasse son fou g5.
- 10. Bh4 — Son fou, attaqué par ton pion, s’écarte en h4 et cloue ton cavalier f6 sur ta dame.
- 10... Be7 — Ton fou va en e7 : ton cavalier f6 n’est plus cloué.

_Le plan :_ Ensuite …Re8, puis …Nf8 et …Ng6 ou …Ne4 : ta tour tient la colonne e, et ton fou c8 sortira en g4 ou e6.

#### Carrefour après 1.d4 d5

À ce carrefour, il a plusieurs coups dans ton répertoire (2.c4, 2.Nf3, 2.Bf4, 2.e3, 2.Nc3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 2.Nf3 ou 2.Bf4 : Londres contre Londres** (début : 1. d4 d5)

- 2. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 2... c6 — Le pion c6 soutient ton pion d5.
- 3. Bf4 — Son fou se développe en f4 et surveille e5.
- 3... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 4. e3 — Le pion e3 soutient son pion d4.
- 4... Bf5 — Ton fou se développe en f5 et surveille e4.
- 5. c4 — Le pion c4 prend de l’espace au centre et surveille d5.
- 5... e6 — Le pion e6 soutient ton pion d5.
- 6. Qb3 — La dame blanche attaque ton pion b7.
- 6... Qc8 — Ta dame protège b7 depuis c8, sans s’exposer.
- 7. Nc3 — Le cavalier blanc se développe et vise d5.
- 7... Nbd7 — Ton cavalier se développe derrière ta chaîne de pions.
- 8. cxd5 — Les Blancs échangent au centre.
- 8... Nxd5 — Tu reprends avec le cavalier, qui attaque le cavalier c3 et le fou f4.
- 9. Bg3 — Le fou blanc recule en g3.
- 9... Bg6 — Ton fou recule en g6, à l’abri.
- 10. Rc1 — Sa tour vient sur la colonne c, semi-ouverte.
- 10... h6 — Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer.

_Le plan :_ Ensuite …Be7 et le roque ; si Bc4, …Nxc3 lui laisse un pion faible en c3, et ta tour viendra sur la colonne c.

**Ligne 2 — 2.Bf4** (début : 1. d4 d5)

- 2. Bf4 — Son fou se développe en f4 et surveille e5.
- 2... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 3. e3 — Le pion e3 soutient son pion d4.
- 3... Bf5 — Ton fou se développe en f5 et surveille e4.
- 4. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 4... c6 — Le pion c6 soutient ton pion d5.
- 5. c4 — Le pion c4 prend de l’espace au centre et surveille d5.
- 5... e6 — Le pion e6 soutient ton pion d5.
- 6. Qb3 — La dame blanche attaque ton pion b7.
- 6... Qc8 — Ta dame protège b7 depuis c8, sans s’exposer.
- 7. Nc3 — Le cavalier blanc se développe et vise d5.
- 7... Nbd7 — Ton cavalier se développe derrière ta chaîne de pions.
- 8. cxd5 — Les Blancs échangent au centre.
- 8... Nxd5 — Tu reprends avec le cavalier, qui attaque le cavalier c3 et le fou f4.
- 9. Bg3 — Le fou blanc recule en g3.
- 9... Bg6 — Ton fou recule en g6, à l’abri.
- 10. Rc1 — Sa tour vient sur la colonne c, semi-ouverte.
- 10... h6 — Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer.

_Le plan :_ Ensuite …Be7 et le roque ; si Bc4, …Nxc3 lui laisse un pion faible en c3, et ta tour viendra sur la colonne c.

**Ligne 3 — 2.Nc3** (début : 1. d4 d5)

- 2. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 2... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 3. Bf4 — Son fou se développe en f4 et surveille e5.
- 3... c6 — Le pion c6 soutient ton pion d5.
- 4. e3 — Le pion e3 soutient son pion d4.
- 4... Bf5 — Ton fou se développe en f5 et surveille e4.
- 5. f3 — Le pion f3 surveille e4, au centre.
- 5... e6 — Le pion e6 soutient ton pion d5.
- 6. g4 — Le pion g4 chasse ton fou f5.
- 6... Bg6 — Ton fou, attaqué par son pion, s’écarte en g6 ; il surveille aussi e4.
- 7. h4 — Le pion h4 gagne de l’espace à l’aile roi.
- 7... h6 — Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer.
- 8. Nge2 — Son cavalier se développe en e2 et surveille d4.
- 8... Nbd7 — Ton cavalier se développe en d7 et surveille e5.
- 9. Qd2 — Sa dame sort en d2 et surveille d4.
- 9... Nb6 — Ton cavalier va en b6 et vise d5.
- 10. Ng3 — Son cavalier va en g3 et vise e4.
- 10... Bd6 — Ton fou se développe en d6 et surveille e5.

_Le plan :_ Plan : …Bxf4 échange son meilleur fou ; après exf4, ta dame en d6 vise son pion f4, et tu fais le grand roque, loin de ses pions g4 et h4.

#### Carrefour après 1.d4 d5 2.e3 Bf5

À ce carrefour, il a plusieurs coups dans ton répertoire (3.c4, 3.Bd3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 2.e3 : le fou sort tout de suite** (début : 1. d4 d5 2. e3 Bf5 3. c4 e6 4. Qb3 Nc6 5. Bd2 Rb8)

- 6. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 6... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 7. Bc3 — Son fou va en c3 et vise d4.
- 7... Bd6 — Ton fou se développe en d6 et surveille e5.
- 8. c5 — Le pion c5 chasse ton fou d6.
- 8... Be7 — Ton fou, attaqué par son pion, s’écarte en e7.
- 9. Nbd2 — Son cavalier se développe en d2 et surveille e4.
- 9... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 10. Bb5 — Son fou se développe en b5 et vise ton cavalier c6.
- 10... Qc8 — Ta dame se développe en c8.

_Le plan :_ Plan : …Ne4 installe ton cavalier au centre et propose des échanges ; ensuite …f6 puis …e5 ouvre le jeu contre sa chaîne c5-d4.

**Ligne 2 — 3.Bd3** (début : 1. d4 d5 2. e3 Bf5)

- 3. Bd3 — Son fou va en d3 et attaque ton fou f5.
- 3... e6 — Le pion e6 protège ton fou f5, attaqué par son fou, et ouvre la diagonale de ton fou f8.
- 4. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 4... c6 — Le pion c6 soutient ton pion d5.
- 5. c4 — Le pion c4 prend de l’espace au centre et surveille d5.
- 5... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 6. O-O — Petit roque : son roi se met à l’abri.
- 6... Nbd7 — Ton cavalier se développe en d7 et surveille e5.
- 7. Bxf5 — Son fou prend ton fou f5.
- 7... exf5 — Ton pion reprend en f5 : le matériel reste égal.
- 8. Qd3 — Sa dame va en d3 et attaque ton pion f5.
- 8... g6 — Le pion g6 protège ton pion f5, attaqué par sa dame, et prépare le fianchetto de ton fou en g7.
- 9. cxd5 — Son pion prend ton pion d5 : la colonne c s’ouvre pour ses tours.
- 9... Nxd5 — Ton cavalier reprend en d5 : le matériel reste égal.
- 10. e4 — Le pion e4 chasse ton cavalier d5.
- 10... fxe4 — Ton pion prend son pion e4, qui attaquait ton cavalier d5.

_Le plan :_ Après Qxe4+, pare l’échec par …Be7, puis …N7f6 : tes cavaliers d5 et f6 tiennent le centre, et tu roques dès que possible.

#### Carrefour après 1.c4 c6

À ce carrefour, il a plusieurs coups dans ton répertoire (2.Nf3, 2.e4, 2.Nc3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 1.c4 c6 : même placement** (début : 1. c4 c6 2. Nf3 d5 3. e3 Nf6 4. d4 Bf5 5. Nc3 e6 6. Nh4 Bg6)

- 7. Qb3 — Sa dame va en b3 et attaque ton pion b7.
- 7... Qc7 — Ta dame va en c7 et protège ton pion b7, attaqué par sa dame ; elle surveille aussi e5.
- 8. Nxg6 — Son cavalier prend ton fou g6 et menace de prendre ta tour h8.
- 8... hxg6 — Ton pion reprend en g6 : le matériel reste égal.
- 9. h4 — Son pion h2, attaqué par ta dame et ta tour, avance en h4.
- 9... Bd6 — Ton fou se développe en d6 et surveille e5.
- 10. Bd2 — Son fou se développe en d2.
- 10... Nbd7 — Ton cavalier se développe en d7 et surveille e5.

_Le plan :_ S’il fait le grand roque, attaque son roi avec …a5 et …b5 ; ta tour h8 garde la colonne h ouverte contre son pion h4.

**Ligne 2 — 2.e4** (début : 1. c4 c6)

- 2. e4 — Le pion e4 prend de l’espace au centre et surveille d5.
- 2... d5 — Le pion d5 attaque son pion e4.
- 3. exd5 — Son pion prend ton pion d5, qui attaquait son pion e4, et la colonne e s’ouvre pour ses tours.
- 3... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 4. d4 — Le pion d4 prend de l’espace au centre et surveille e5.
- 4... cxd5 — Ton pion prend son pion d5 : la colonne c s’ouvre pour tes tours.
- 5. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 5... e6 — Le pion e6 soutient ton pion d5.
- 6. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 6... Be7 — Ton fou se développe en e7.
- 7. cxd5 — Son pion prend ton pion d5 : la colonne c s’ouvre pour ses tours.
- 7... Nxd5 — Ton cavalier reprend en d5 : le matériel reste égal.
- 8. Bd3 — Son fou se développe en d3 et surveille e4.
- 8... Nf6 — Ton cavalier se met à l’abri en f6 et surveille d5 et e4.
- 9. O-O — Petit roque : son roi se met à l’abri.
- 9... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 10. Re1 — Sa tour vient sur la colonne e, semi-ouverte.
- 10... Nc6 — Ton cavalier se développe en c6 et surveille d4 et e5.

_Le plan :_ Son pion d4 est isolé : bloque la case d5 avec un cavalier, sors ton fou c8 en b7 (…a6 puis …b5), et vise d4 avec tes tours.

**Ligne 3 — 2.Nc3** (début : 1. c4 c6)

- 2. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 2... d5 — Le pion d5 attaque son pion c4.
- 3. cxd5 — Son pion prend ton pion d5, qui attaquait son pion c4, et la colonne c s’ouvre pour ses tours.
- 3... cxd5 — Ton pion reprend en d5 : le matériel reste égal.
- 4. d4 — Le pion d4 prend de l’espace au centre et surveille e5.
- 4... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 5. Bf4 — Son fou se développe en f4 et surveille e5.
- 5... e6 — Le pion e6 soutient ton pion d5.
- 6. e3 — Le pion e3 soutient son pion d4.
- 6... Bd6 — Ton fou se développe en d6 et surveille e5.
- 7. Bg3 — Son fou se met à l’abri en g3 et surveille e5.
- 7... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8. Bd3 — Son fou se développe en d3 et surveille e4.
- 8... h6 — Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite.
- 9. Rc1 — Sa tour vient sur la colonne c, ouverte.
- 9... Be7 — Ton fou se met à l’abri en e7.
- 10. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 10... Qb6 — Ta dame va en b6 et attaque son pion b2.

_Le plan :_ Ta dame b6 vise b2 : …Nc6 et …Bd7, puis …Rc8 pour contester la colonne c ; le pion b2 tombe s’il l’oublie.

#### Carrefour au premier coup

À ce carrefour, il a plusieurs coups dans ton répertoire (1.d4, 1.c4, 1.Nf3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 1.Nf3 d5 2.g3 : contre le fianchetto**

- 1. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 1... d5 — Le pion d5 prend de l’espace au centre et surveille e4.
- 2. g3 — Les Blancs préparent le fianchetto de leur fou f1.
- 2... c6 — Ton pion c6 soutient d5 et laisse ton fou c8 libre.
- 3. Bg2 — Le fou blanc se place sur la grande diagonale.
- 3... Nf6 — Ton cavalier se développe vers le centre.
- 4. O-O — Les Blancs roquent.
- 4... Bf5 — Ton fou sort avant …e6, comme toujours.
- 5. d3 — Le pion d3 prépare e4.
- 5... e6 — Le pion e6 complète ta chaîne c6-d5-e6.
- 6. Nh4 — Le cavalier blanc attaque ton fou f5.
- 6... Bg4 — Ici le fou va en g4 (Stockfish) : il attaque le pion e2 au lieu d’être échangé en g6.
- 7. Qe1 — Sa dame se développe en e1.
- 7... Nbd7 — Ton cavalier se développe en d7 et surveille e5.
- 8. h3 — Le pion h3 chasse ton fou g4.
- 8... Bh5 — Ton fou, attaqué par son pion, s’écarte en h5.
- 9. e4 — Le pion e4 prend de l’espace au centre et surveille d5.
- 9... h6 — Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer.
- 10. f4 — Le pion f4 prend de l’espace au centre et surveille e5.
- 10... Qb6+ — Ta dame va en b6 avec échec.

_Le plan :_ Après Kh2, ouvre par …dxe4, puis fais le grand roque : ta dame b6 et ton fou f8 (…Bc5) visent son roi.

#### Carrefour après 1.d4 d5 2.c4 c6

À ce carrefour, il a plusieurs coups dans ton répertoire (3.Nf3, 3.Nc3, 3.cxd5) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 3.Nc3** (début : 1. d4 d5 2. c4 c6)

- 3. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 3... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 4. e3 — Le pion e3 soutient son pion d4.
- 4... e6 — Le pion e6 soutient ton pion d5.
- 5. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 5... Bd6 — Ton fou se développe en d6 et surveille e5.
- 6. Bd3 — Son fou se développe en d3 et surveille e4.
- 6... Nbd7 — Ton cavalier se développe en d7 et surveille e5.
- 7. e4 — Le pion e4 menace e5, fourchette sur ton fou d6 et ton cavalier f6.
- 7... dxc4 — Ton pion prend son pion c4 : la colonne d s’ouvre pour tes tours.
- 8. Bxc4 — Son fou reprend en c4 : le matériel reste égal.
- 8... b5 — Le pion b5 chasse son fou c4.
- 9. Bb3 — Son fou, attaqué par ton pion, s’écarte en b3 ; il surveille aussi d5.
- 9... b4 — Le pion b4 chasse son cavalier c3.
- 10. Na4 — Son cavalier, attaqué par ton pion, s’écarte en a4.
- 10... Be7 — Ton fou se replace en e7.

_Le plan :_ S’il pousse e5, ton cavalier va en d5 ; ensuite …Bb7, le roque et …c5 pour attaquer son centre, et son cavalier a4 est mal placé.

**Ligne 2 — 3.cxd5** (début : 1. d4 d5 2. c4 c6)

- 3. cxd5 — Son pion prend ton pion d5 : la colonne c s’ouvre pour ses tours.
- 3... cxd5 — Ton pion reprend en d5 : le matériel reste égal.
- 4. Nc3 — Son cavalier se développe en c3 et surveille d5 et e4.
- 4... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 5. Bf4 — Son fou se développe en f4 et surveille e5.
- 5... e6 — Le pion e6 soutient ton pion d5.
- 6. e3 — Le pion e3 soutient son pion d4.
- 6... Bd6 — Ton fou se développe en d6 et surveille e5.
- 7. Bg3 — Son fou se met à l’abri en g3 et surveille e5.
- 7... O-O — Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.
- 8. Nf3 — Son cavalier se développe en f3 et surveille d4 et e5.
- 8... h6 — Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite.
- 9. Bh4 — Son fou cloue ton cavalier f6 sur ta dame.
- 9... Nbd7 — Ton cavalier se développe en d7 et surveille e5.
- 10. Bd3 — Son fou se développe en d3 et surveille e4.
- 10... Be7 — Ton fou va en e7 : ton cavalier f6 n’est plus cloué.

_Le plan :_ Ensuite …b6 et …Bb7, puis …Rc8 : tes tours prennent la colonne c ouverte, et ton fou e7 a décloué ton cavalier f6.

#### Carrefour après 1.d4 d5 2.Nf3 c6

À ce carrefour, il a plusieurs coups dans ton répertoire (3.Bf4, 3.c4) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 3.c4** (début : 1. d4 d5 2. Nf3 c6)

- 3. c4 — Le pion c4 prend de l’espace au centre et surveille d5.
- 3... Nf6 — Ton cavalier se développe et protège d5 une deuxième fois.
- 4. e3 — Le pion e3 soutient d4, mais il enferme le fou c1 des Blancs.
- 4... Bf5 — Ton fou sort AVANT …e6 : c’est l’idée du Londres en défense, ce fou ne restera pas enfermé.
- 5. Nc3 — Le second cavalier blanc se développe et vise d5.
- 5... e6 — Le pion e6 complète ta chaîne de pions c6-d5-e6 et ouvre la diagonale de ton fou f8.

_Le plan :_ Position de la leçon : contre Nh4, recule ton fou en g6 ; après Nxg6 hxg6, ta tour h8 a la colonne h, et contre Qb3 joue …Qc7 ou …Qb6.

#### Carrefour après 1.Nf3 d5

À ce carrefour, il a plusieurs coups dans ton répertoire (2.c4, 2.d4, 2.g3, 2.e3) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.

**Ligne 1 — 2.c4** (début : 1. Nf3 d5)

- 2. c4 — Le pion c4 prend de l’espace au centre et surveille d5.
- 2... c6 — Le pion c6 soutient ton pion d5.
- 3. e3 — Le pion e3 prépare d4.
- 3... Nf6 — Ton cavalier se développe vers le centre.
- 4. d4 — Les Blancs occupent le centre : c’est la position de la leçon.
- 4... Bf5 — Ton fou sort AVANT …e6 : c’est l’idée du Londres en défense, ce fou ne restera pas enfermé.
- 5. Nc3 — Le second cavalier blanc se développe et vise d5.
- 5... e6 — Le pion e6 complète ta chaîne de pions c6-d5-e6 et ouvre la diagonale de ton fou f8.

_Le plan :_ Position de la leçon : contre Nh4, recule ton fou en g6 ; après Nxg6 hxg6, ta tour h8 a la colonne h, et contre Qb3 joue …Qc7 ou …Qb6.

**Ligne 2 — 2.d4** (début : 1. Nf3 d5)

- 2. d4 — Le pion d4 prend de l’espace au centre et surveille e5.
- 2... c6 — Le pion c6 soutient ton pion d5.
- 3. Bf4 — Son fou se développe en f4 et surveille e5.
- 3... Nf6 — Ton cavalier se développe en f6 et surveille d5 et e4.
- 4. e3 — Le pion e3 soutient son pion d4.
- 4... Bf5 — Ton fou se développe en f5 et surveille e4.
- 5. c4 — Le pion c4 prend de l’espace au centre et surveille d5.
- 5... e6 — Le pion e6 soutient ton pion d5.

_Le plan :_ Position de la leçon (Londres contre Londres) : contre Qb3, protège b7 par …Qc8, puis …Nbd7, …Be7 et le roque.

**Ligne 3 — 2.e3** (début : 1. Nf3 d5)

- 2. e3 — Le pion e3 ouvre la diagonale de son fou f1.
- 2... c6 — Le pion c6 soutient ton pion d5.
- 3. c4 — Le pion c4 prend de l’espace au centre et surveille d5.
- 3... Nf6 — Ton cavalier se développe vers le centre.
- 4. d4 — Les Blancs occupent le centre : c’est la position de la leçon.
- 4... Bf5 — Ton fou sort AVANT …e6 : c’est l’idée du Londres en défense, ce fou ne restera pas enfermé.
- 5. Nc3 — Le second cavalier blanc se développe et vise d5.
- 5... e6 — Le pion e6 complète ta chaîne de pions c6-d5-e6 et ouvre la diagonale de ton fou f8.

_Le plan :_ Position de la leçon : contre Nh4, recule ton fou en g6 ; après Nxg6 hxg6, ta tour h8 a la colonne h, et contre Qb3 joue …Qc7 ou …Qb6.

---

# Archives (ancien répertoire)

## Gambit Dame refusé (Noirs) — archivée

Le Gambit Dame refusé est une défense solide contre 1.d4 : tu tiens le centre avec tes pions d5 et e6, sans prendre le pion offert.

### 1-2. Ligne principale, par blocs

**Bloc 1**

- 1. d4 — Les Blancs occupent le centre. _(mot expliqué : centre)_
- 1... d5 — Tu prends ta part du centre et bloques le pion d4.
- 2. c4 — Les Blancs offrent un pion pour détourner ton pion d5 : c’est le gambit Dame. _(mot expliqué : gambit)_
- 2... e6 — Tu refuses le gambit et soutiens d5 avec un pion : ton centre tient.
- 3. Nc3 — Le cavalier blanc attaque d5 une deuxième fois.
- 3... Nf6 — Tu développes ton cavalier, qui défend d5 et vise le centre. _(mot expliqué : développer)_

**Bloc 2**

- 4. Bg5 — Le fou blanc fait un clouage : ton cavalier f6 ne peut plus bouger sans exposer ta dame. _(mot expliqué : clouage)_
- 4... Be7 — Ton fou se place en e7 et supprime le clouage.
- 5. e3 — Les Blancs ouvrent la diagonale de leur fou f1.
- 5... O-O — Tu fais le roque : ton roi est à l’abri. _(mot expliqué : roque)_
- 6. Nf3 — Le second cavalier blanc se développe vers le centre.
- 6... h6 — Tu demandes au fou g5 de se décider : reculer ou s’échanger.

**Bloc 3**

- 7. Bh4 — Le fou recule mais garde la pression sur ton cavalier f6. Ce n’est plus un clouage : ton fou e7 fait écran devant ta dame.
- 7... b6 — Tu prépares le fianchetto de ton fou c8 en b7 : c’est la variante Tartakower. _(mot expliqué : fianchetto)_
- 8. cxd5 — Les Blancs échangent au centre.
- 8... Nxd5 — Tu reprends avec le cavalier pour libérer ton jeu par des échanges.
- 9. Bxe7 — Le fou blanc s’échange contre le tien.
- 9... Qxe7 — Tu reprends avec la dame, qui se développe en même temps.

**Bloc 4**

- 10. Nxd5 — Les Blancs échangent aussi les cavaliers.
- 10... exd5 — Tu reprends avec le pion e : ton pion d5 tient le centre et la colonne e s’ouvre pour tes tours.
- 11. Rc1 — La tour blanche vient sur la colonne semi-ouverte c pour viser ton pion c7. _(mot expliqué : colonne semi-ouverte)_
- 11... Be6 — Ton fou se développe en e6 et protège le pion d5.

### 3. Le plan

1. Tes pièces : pions d5 et e6, fou en e7, cavalier en f6, petit roque, puis fou c8 en b7 ou e6 et tours sur les colonnes c et e.
2. Au milieu de partie, cherche le coup libérateur …c5 pour attaquer le centre blanc et ouvrir des lignes à tes pièces.
3. Échanger des pièces soulage ta position : vise d’abord l’égalité, puis joue contre les faiblesses blanches.

### 4. Partie type (Stockfish contre lui-même)

Coups : 12. Bd3 12... c5 13. b3 13... Nd7 14. O-O 14... a5 15. h3 15... Nf6 16. Re1 16... Rfc8 17. Bc2 17... Ra7 18. Qe2 18... a4 19. bxa4 19... Bd7 20. dxc5 20... bxc5 21. e4 21... Bxa4 22. exd5 22... Qxe2 23. Rxe2 23... Nxd5

Moments clés :

- 12... c5 — Le coup libérateur …c5 : ton pion attaque le centre blanc, exactement comme dans le plan.
- 15... Nf6 — Ton cavalier revient en f6 en passant par d7 : il protège d5 et surveille e4.
- 16... Rfc8 — Ta tour vient sur la colonne c, qui va s’ouvrir.
- 18... a4 — Tu attaques l’aile dame avec le pion a pour créer des faiblesses chez les Blancs.
- 20... bxc5 — Après les échanges, tes pions c5 et d5 sont des pions pendants : forts s’ils avancent, à surveiller s’ils sont bloqués. _(mot expliqué : pions pendants)_
- 21. e4 — Les Blancs frappent ton centre avec le pion e.
- 22... Qxe2 — Tu échanges les dames : la position se simplifie.
- 23... Nxd5 — Tu reprends le pion d5 : la finale est équilibrée, tu as égalisé.

Fin : Finale équilibrée : les Noirs ont atteint leur but, égaliser grâce à …c5 et aux échanges.

## Défense française (Noirs) — archivée

La Défense française répond à 1.e4 par …e6 puis …d5 : une défense solide où tu attaques ensuite la chaîne de pions blanche.

### 1-2. Ligne principale, par blocs

**Bloc 1**

- 1. e4 — Les Blancs occupent le centre avec le pion e. _(mot expliqué : centre)_
- 1... e6 — Tu prépares …d5 en soutenant d’avance la case d5 : c’est la Défense française.
- 2. d4 — Les Blancs prennent tout le centre avec deux pions.
- 2... d5 — Tu attaques le pion e4 : la bataille du centre commence.
- 3. Nc3 — Le cavalier blanc défend le pion e4.
- 3... Nf6 — Tu développes ton cavalier et attaques e4 une deuxième fois : c’est la variante classique. _(mot expliqué : développer)_

**Bloc 2**

- 4. Bg5 — Le fou blanc fait un clouage : ton cavalier f6 ne peut plus bouger sans exposer ta dame. _(mot expliqué : clouage)_
- 4... Be7 — Ton fou se glisse en e7 et supprime le clouage.
- 5. e5 — Les Blancs avancent le pion e, chassent ton cavalier et gagnent de l’espace.
- 5... Nfd7 — Ton cavalier recule en d7, d’où il pourra attaquer le pion e5.
- 6. Bxe7 — Les Blancs échangent les fous.
- 6... Qxe7 — Tu reprends avec la dame, qui se développe en même temps.

**Bloc 3**

- 7. f4 — Le pion f4 soutient e5 : la chaîne de pions blanche d4-e5 est solide. _(mot expliqué : chaîne de pions)_
- 7... a6 — Tu empêches un cavalier blanc de venir en b5 et prépares l’attaque sur l’aile dame.
- 8. Nf3 — Le cavalier blanc soutient les pions d4 et e5.
- 8... c5 — Tu attaques la base de la chaîne blanche, le pion d4 : c’est le plan clé de la Française.
- 9. Qd2 — La dame blanche se développe et prépare le grand roque.
- 9... Nc6 — Ton cavalier ajoute une pression sur le pion d4.

**Bloc 4**

- 10. O-O-O — Les Blancs font le grand roque, côté dame. _(mot expliqué : roque)_
- 10... b5 — Tu lances ton pion b vers le roi blanc : l’attaque sur l’aile dame commence.

### 3. Le plan

1. Tes pièces : pions e6 et d5, cavaliers en d7 et c6, dame en e7 ; tout ton jeu vise la chaîne de pions blanche d4-e5.
2. Au milieu de partie, attaque la base de la chaîne avec …c5, puis ouvre les colonnes de l’aile dame avec …b5 et …b4.
3. Ton fou c8 est un mauvais fou, gêné par tes pions e6 et d5 : patience, il sortira quand le centre s’ouvrira. _(mot expliqué : mauvais fou)_

### 4. Partie type (Stockfish contre lui-même)

Coups : 11. g4 11... b4 12. Ne2 12... O-O 13. f5 13... cxd4 14. f6 14... gxf6 15. exf6 15... Qxf6 16. Nf4 16... e5 17. Nxd5 17... Qxf3 18. Bg2 18... Qxg4 19. Rhg1 19... Kh8

Moments clés :

- 11. g4 — Les Blancs ont roqué côté dame et lancent leurs pions côté roi : ce sont des roques opposés, chacun attaque sur une aile. _(mot expliqué : roques opposés)_
- 11... b4 — Ton pion b chasse le cavalier c3 : ton attaque avance.
- 12... O-O — Tu roques côté roi pour quitter le centre, mais c’est le côté où avancent les pions blancs (g4, f5) : ton roi n’y sera pas tranquille.
- 13. f5 — La poussée f5 attaque ta chaîne de pions à sa base, le pion e6.
- 13... cxd4 — Tu prends en d4 et ouvres la colonne c vers le roi blanc.
- 15... Qxf6 — Les Blancs ont donné des pions pour ouvrir des lignes vers ton roi ; ta dame reprend en f6.
- 17... Qxf3 — Position très tactique : les Blancs prennent ton pion d5 et ta dame prend le cavalier f3.
- 18... Qxg4 — Ta dame prend encore un pion ; elle est active mais exposée.
- 19... Kh8 — La tour blanche arrive sur la colonne g ouverte : tu mets ton roi en h8, hors de sa portée.

Fin : Position compliquée et à peu près équilibrée : chaque camp a attaqué sur son aile.

