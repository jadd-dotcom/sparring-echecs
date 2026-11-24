# Leçons d'ouvertures (mode Leçon)

Contenu affiché dans l'appli, généré depuis `src/data/openingLessons.ts` (`npm run lessons-doc`). Ordre conseillé : l’Anglaise (Blancs), puis le système …c5/…g6 (Noirs) ; pour chacune : 1. Leçon → 2. Drill → 3. Partie à thème. Les leçons de l’ancien répertoire (Londres, Gambit Dame refusé, Défense française) restent consultables dans l’onglet « Archives » ; elles sont reprises en fin de document.

Déroulé d'une leçon : (1) la ligne principale par blocs de 3 coups, une phrase par coup ; (2) après chaque bloc, l'élève rejoue ses coups (1re erreur : case de départ surlignée ; 2e : solution) ; (3) le plan en 3 phrases ; (4) une partie type commentée ; (5) pour le système …c5/…g6, un bloc supplémentaire « Contre les attaques rapides sur f7 » (lignes de côté vues dans mes parties Chess.com). Les coups appris entrent dans le drill (1re révision le lendemain).

Toutes les lignes du répertoire et leur vérification Stockfish : `docs/REPERTOIRE.md`.

Les parties types prolongent la ligne principale avec Stockfish 16 (1 s par coup, les deux camps) : ce ne sont pas des parties de joueurs réels.

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

---

# Archives (ancien répertoire)

## Système de Londres (Blancs) — archivée

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

