# Leçons d'ouvertures (mode Leçon)

Contenu affiché dans l'appli, généré depuis `src/data/openingLessons.ts` (`npm run lessons-doc`). Ordre conseillé : Londres, puis Gambit Dame refusé, puis Défense française ; pour chacune : 1. Leçon → 2. Drill → 3. Partie à thème.

Déroulé d'une leçon : (1) la ligne principale par blocs de 3 coups, une phrase par coup ; (2) après chaque bloc, l'élève rejoue ses coups (1re erreur : case de départ surlignée ; 2e : solution) ; (3) le plan en 3 phrases ; (4) une partie type commentée. Les coups appris entrent dans le drill (1re révision le lendemain).

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

## Gambit Dame refusé (Noirs)

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

## Défense française (Noirs)

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

