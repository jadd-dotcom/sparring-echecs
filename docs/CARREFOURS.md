# Carrefours du répertoire — phrases-panneaux

109 cartes au total.

Un carrefour : une position où l’adversaire a au moins 2 coups dans mon arbre (son coup change ma réponse). Une carte
par coup-panneau ; sa phrase-panneau dit ce que son coup change → ma réponse (src/lib/signposts.ts).

- Partie gauche : d’abord la menace de son coup, calculée « s’il rejouait » sur 4 demi-coups (comme « Qu’est-ce qu’il
  menace ? », Stockfish 19 lite profondeur 16 : src/data/signpostThreats.ts, `npm run signpost-threats`) : mat → « Il
  menace Qxf7 mat » ; gain d’au moins 2 points → « Il menace de prendre ta pièce… ». Sinon, le « pourquoi » de la leçon
  pour son coup.
- Partie droite : le « pourquoi » de la leçon pour mon coup ; s’il n’y en a pas, ce que mon coup fait contre la menace
  (prend, s’écarte, bouche la ligne, défend). Mon coup entre parenthèses. Génération : `npm run crossroads-doc`.

## Anglaise (système fermé) (Blancs) — 11 carrefours, 25 cartes

### Après 1.c4

- **1…e5** → 2.Nc3 : « Les Noirs occupent le centre avec leur pion e → ton cavalier se développe et surveille lui aussi les cases d5 et e4 (Nc3) »
- **1…c5** → 2.Nc3 : « Le pion c5 prend de l’espace au centre et surveille d4 → ton cavalier se développe en c3 et surveille d5 et e4 (Nc3) »
- **1…Nf6** → 2.Nc3 : « Son cavalier se développe en f6 et surveille d5 et e4 → ton cavalier se développe en c3 et surveille d5 et e4 (Nc3) »
- **1…e6** → 2.Nc3 : « Le pion e6 ouvre la diagonale de son fou f8 → ton cavalier se développe en c3 et surveille d5 et e4 (Nc3) »
- **1…d5** → 2.cxd5 : « Le pion d5 attaque ton pion c4 → ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours (cxd5) »

### Après 1.c4 e5 2.Nc3

- **2…Nc6** → 3.g3 : « Les Noirs développent leur cavalier, qui soutient le pion e5 → le pion g3 prépare le fianchetto de ton fou f1 (g3) »
- **2…Nf6** → 3.g3 : « Son cavalier se développe en f6 et surveille d5 et e4 → le pion g3 prépare le fianchetto de ton fou en g2 (g3) »

### Après 1.c4 e5 2.Nc3 Nc6 3.g3

- **3…g6** → 4.Bg2 : « Les Noirs font la même chose de leur côté → ton fou se place sur la grande diagonale h1-a8, d’où il vise le centre et l’aile dame (Bg2) »
- **3…Nf6** → 4.Bg2 : « Son cavalier se développe en f6 et surveille d5 et e4 → ton fou se développe en g2 et vise son cavalier c6 (Bg2) »

### Après 1.c4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.e4

- **6…Nge7** → 7.Nge2 : « Le cavalier noir sort en e7 pour laisser son pion f libre d’avancer → ton second cavalier sort en e2 et non en f3 : ainsi il ne bloque pas ton pion f (Nge2) »
- **6…f5** → 7.Nge2 : « Le pion f5 prend de l’espace au centre et surveille e4 → ton cavalier se développe en e2 et surveille d4 (Nge2) »

### Après 1.c4 e5 2.Nc3 Nf6 3.g3

- **3…d5** → 4.cxd5 : « Le pion d5 attaque ton pion c4 → ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours (cxd5) »
- **3…Bb4** → 4.Bg2 : « Son fou se développe en b4 et vise ton cavalier c3 → ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile (Bg2) »

### Après 1.c4 c5 2.Nc3

- **2…Nc6** → 3.g3 : « Son cavalier se développe en c6 et surveille d4 et e5 → le pion g3 prépare le fianchetto de ton fou en g2 (g3) »
- **2…Nf6** → 3.g3 : « Son cavalier se développe en f6 et surveille d5 et e4 → le pion g3 prépare le fianchetto de ton fou en g2 (g3) »

### Après 1.c4 c5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3

- **5…d6** → 6.e4 : « Le pion d6 soutient son pion c5 → le pion e4 prend de l’espace au centre et surveille d5 (e4) »
- **5…Nf6** → 6.e4 : « Son cavalier se développe en f6 et surveille d5 et e4 → le pion e4 prend de l’espace au centre et surveille d5 (e4) »

### Après 1.c4 Nf6 2.Nc3

- **2…g6** → 3.g3 : « Le pion g6 prépare le fianchetto de son fou en g7 → le pion g3 prépare le fianchetto de ton fou en g2 (g3) »
- **2…e6** → 3.d4 : « Le pion e6 ouvre la diagonale de son fou f8 → le pion d4 prend de l’espace au centre et surveille e5 (d4) »

### Après 1.c4 d5 2.cxd5

- **2…Qxd5** → 3.Nc3 : « Sa dame reprend en d5 : le matériel reste égal → ton cavalier va en c3 et attaque sa dame d5 (Nc3) »
- **2…Nf6** → 3.Nf3 : « Son cavalier va en f6 et attaque ton pion d5 → ton cavalier se développe en f3 et surveille d4 et e5 (Nf3) »

### Après 1.c4 d5 2.cxd5 Qxd5 3.Nc3

- **3…Qd8** → 4.d4 : « Sa dame, attaquée par ton cavalier, s’écarte en d8 ; elle surveille aussi d4 et d5 → le pion d4 prend de l’espace au centre et surveille e5 (d4) »
- **3…Qa5** → 4.d4 : « Sa dame, attaquée par ton cavalier, s’écarte en a5 ; elle surveille aussi d5 et e5 → le pion d4 prend de l’espace au centre et surveille e5 (d4) »

### Après 1.c4 d5 2.cxd5 Qxd5 3.Nc3 Qd8 4.d4 Nf6 5.Nf3

- **5…g6** → 6.e4 : « Le pion g6 prépare le fianchetto de son fou en g7 → le pion e4 prend de l’espace au centre et surveille d5 (e4) »
- **5…e6** → 6.e4 : « Le pion e6 ouvre la diagonale de son fou f8 → le pion e4 prend de l’espace au centre et surveille d5 (e4) »

## Système de Londres (Blancs) — 5 carrefours, 17 cartes

### Après 1.d4

- **1…d5** → 2.Bf4 : « Les Noirs prennent aussi leur part du centre → le fou sort tout de suite, avant que le pion e3 ne lui ferme le chemin : c’est la signature du Londres (Bf4) »
- **1…Nf6** → 2.Bf4 : « Son cavalier se développe en f6 et surveille d5 et e4 → ton fou se développe en f4 et surveille e5 (Bf4) »
- **1…e6** → 2.Bf4 : « Le pion e6 ouvre la diagonale de son fou f8 → ton fou sort tout de suite, comme toujours dans le Londres (Bf4) »
- **1…c5** → 2.d5 : « Le pion c5 prend de l’espace au centre et surveille d4 → pas de Londres ici : avec c3 ou Bf4, tu perdrais plus d’un demi-pion (Stockfish). Ton pion d5 prend de l’espace (d5) »
- **1…g6** → 2.Nf3 : « Le pion g6 prépare le fianchetto de son fou en g7 → ton cavalier sort d’abord, puis ton fou viendra en f4 : c’est toujours le placement du Londres (Nf3) »
- **1…f5** → 2.Bf4 : « Le pion f5 prend de l’espace au centre et surveille e4 → contre la Hollandaise aussi, ton fou sort tout de suite (Bf4) »
- **1…e5** → 2.dxe5 : « Le pion e5 prend de l’espace au centre et surveille d4 → tu prends le pion offert : c’est le gambit Englund (dxe5) »

### Après 1.d4 d5 2.Bf4

- **2…Nf6** → 3.e3 : « Les Noirs développent un cavalier vers le centre → le pion e3 soutient d4 et ouvre la diagonale du fou f1 (e3) »
- **2…c5** → 3.e3 : « Le pion c5 prend de l’espace au centre et surveille d4 → le pion e3 soutient ton pion d4 (e3) »
- **2…Bf5** → 3.e3 : « Son fou se développe en f5 et surveille e4 → le pion e3 soutient ton pion d4 (e3) »

### Après 1.d4 d5 2.Bf4 Nf6 3.e3

- **3…c5** → 4.c3 : « Les Noirs attaquent d4 avec un pion de côté, le plan le plus actif → le pion c3 protège d4 une deuxième fois : la chaîne de pions c3-d4-e3 est solide (c3) »
- **3…e6** → 4.Nf3 : « Le pion e6 soutient son pion d5 → ton cavalier se développe en f3 et surveille d4 et e5 (Nf3) »
- **3…g6** → 4.Nf3 : « Le pion g6 prépare le fianchetto de son fou en g7 → ton cavalier se développe en f3 et surveille d4 et e5 (Nf3) »

### Après 1.d4 Nf6 2.Bf4

- **2…g6** → 3.e3 : « Le pion g6 prépare le fianchetto de son fou en g7 → le pion e3 soutient ton pion d4 (e3) »
- **2…e6** → 3.e3 : « Le pion e6 ouvre la diagonale de son fou f8 → le pion e3 soutient ton pion d4 (e3) »

### Après 1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bg5

- **4…Qb4+** → 5.Nc3 : « La dame noire fait échec et vise ton pion b2 → ton cavalier pare l’échec en se développant ; si …Qxb2, Bd2 puis Rb1 chasse la dame (Stockfish : gros avantage blanc) (Nc3) »
- **4…Qc5** → 5.Be3 : « Sa dame, attaquée par ton fou, s’écarte en c5 ; elle surveille aussi d4, d5 et e5 → ton fou va en e3 et contre-attaque sa dame c5 au lieu de défendre ton pion e5 (Be3) »

## Système …c5 / …g6 (Dragon accéléré) (Noirs) — 14 carrefours, 43 cartes

### Après position de départ

- **1.e4** → 1…c5 : « Les Blancs occupent le centre avec leur pion e → ton pion c5 surveille la case d4 sans t’exposer : c’est la Défense sicilienne (…c5) »
- **1.e3** → 1…c5 : « Le pion e3 ouvre la diagonale de son fou f1 → le pion c5 prend de l’espace au centre et surveille d4 (…c5) »

### Après 1.e4 c5

- **2.Nf3** → 2…Nc6 : « Le cavalier blanc se développe et prépare d4 → ton cavalier se développe et surveille les cases d4 et e5 (…Nc6) »
- **2.Nc3** → 2…Nc6 : « Son cavalier se développe en c3 et surveille d5 et e4 → ton cavalier se développe en c6 et surveille d4 et e5 (…Nc6) »
- **2.c3** → 2…Nf6 : « Le pion c3 prépare d4 : il pourra occuper tout le centre → ton cavalier va en f6 et attaque son pion e4 (…Nf6) »
- **2.d4** → 2…cxd4 : « Le pion d4 attaque ton pion c5 → ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours (…cxd4) »
- **2.Bc4** → 2…Nc6 : « Le fou blanc vise tout de suite f7 → tu te développes (…Nc6) »
- **2.Qh5** → 2…d6 : « La dame blanche sort tout de suite : elle vise f7 et aussi ton pion c5, par la 5e rangée → le pion d6 protège c5 ; pas encore …g6, la dame prendrait c5 (…d6) »
- **2.Qf3** → 2…Nc6 : « La dame blanche sort en f3 : elle vise f7 par la colonne f → tu te développes normalement : la dame seule ne menace rien (…Nc6) »
- **2.d3** → 2…g6 : « Le pion d3 soutient son pion e4 → le pion g6 prépare le fianchetto de ton fou en g7 (…g6) »
- **2.c4** → 2…Nc6 : « Le pion c4 prend de l’espace au centre et surveille d5 → ton cavalier se développe en c6 et surveille d4 et e5 (…Nc6) »

### Après 1.e4 c5 2.Nf3 Nc6

- **3.d4** → 3…cxd4 : « Les Blancs ouvrent le centre en attaquant ton pion c5 → tu échanges ton pion c contre le pion d blanc : il te reste deux pions au centre (d et e) (…cxd4) »
- **3.Bc4** → 3…g6 : « Son fou se développe en c4 et surveille d5 → le pion g6 prépare le fianchetto de ton fou en g7 (…g6) »
- **3.Bb5** → 3…g6 : « Son fou se développe en b5 et vise ton cavalier c6 → le pion g6 prépare le fianchetto de ton fou en g7 (…g6) »
- **3.Nc3** → 3…g6 : « Son cavalier se développe en c3 et surveille d5 et e4 → le pion g6 prépare le fianchetto de ton fou en g7 (…g6) »
- **3.c3** → 3…Nf6 : « Le pion c3 prépare d4 : il pourra occuper tout le centre → ton cavalier va en f6 et attaque son pion e4 (…Nf6) »

### Après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6

- **5.Nc3** → 5…Bg7 : « Le second cavalier blanc protège le pion e4 → ton fou se place sur la grande diagonale et vise le cavalier d4 et l’aile dame (…Bg7) »
- **5.c4** → 5…Bg7 : « Le pion c4 prend de l’espace au centre et surveille d5 → ton fou se développe en g7 et vise son cavalier d4 (…Bg7) »
- **5.Nxc6** → 5…bxc6 : « Il menace de prendre ta dame d8 → ton pion reprend en c6 : le matériel reste égal (…bxc6) »

### Après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Be3 Nf6

- **7.Bc4** → 7…O-O : « Le fou blanc vise ton pion f7, le point faible près de ton roi → tu fais le petit roque : ton roi est à l’abri derrière le fou g7 (…O-O) »
- **7.Be2** → 7…O-O : « Son fou se développe en e2 → petit roque : ton roi se met à l’abri et ta tour se rapproche du centre (…O-O) »

### Après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nxc6 bxc6

- **6.Bd3** → 6…Bg7 : « Son fou se développe en d3 et surveille e4 → ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile (…Bg7) »
- **6.Qd4** → 6…Nf6 : « Il menace de prendre ta tour h8 → ton cavalier bouche la diagonale de sa dame : ta tour h8 n’est plus attaquée ; il surveille aussi d5 et e4 (…Nf6) »

### Après 1.e4 c5 2.Nf3 Nc6 3.Bc4 g6

- **4.O-O** → 4…Bg7 : « Petit roque : son roi se met à l’abri → ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile (…Bg7) »
- **4.Nc3** → 4…Bg7 : « Son cavalier se développe en c3 et surveille d5 et e4 → ton fou se développe en g7 et vise son cavalier c3 (…Bg7) »

### Après 1.e4 c5 2.Nf3 Nc6 3.Bb5 g6

- **4.O-O** → 4…Bg7 : « Petit roque : son roi se met à l’abri → ton fou se place sur la grande diagonale, d’où il vise le centre et l’autre aile (…Bg7) »
- **4.Bxc6** → 4…dxc6 : « Son fou prend ton cavalier c6 → ton pion reprend en c6 : le matériel reste égal (…dxc6) »

### Après 1.e4 c5 2.Nc3 Nc6

- **3.g3** → 3…g6 : « Le pion g3 prépare le fianchetto de son fou en g2 → le pion g6 prépare le fianchetto de ton fou en g7 (…g6) »
- **3.f4** → 3…g6 : « Le pion f4 prend de l’espace au centre et surveille e5 → le pion g6 prépare le fianchetto de ton fou en g7 (…g6) »
- **3.Nf3** → 3…g6 : « Son cavalier se développe en f3 et surveille d4 et e5 → le pion g6 prépare le fianchetto de ton fou en g7 (…g6) »
- **3.Bc4** → 3…g6 : « Le fou blanc vise f7 → le pion g6 prépare ton fianchetto et interdit Qh5 (…g6) »
- **3.Bb5** → 3…g6 : « Son fou se développe en b5 et vise ton cavalier c6 → le pion g6 prépare le fianchetto de ton fou en g7 (…g6) »

### Après 1.e4 c5 2.Nc3 Nc6 3.Bc4 g6

- **4.Qf3** → 4…Nf6 : « Il menace Qxf7 mat → ton cavalier bloque la colonne f : f7 est à l’abri (…Nf6) »
- **4.Nf3** → 4…Bg7 : « Son cavalier se développe en f3 et surveille d4 et e5 → ton fou se développe en g7 et vise son cavalier c3 (…Bg7) »

### Après 1.e4 c5 2.c3 Nf6 3.e5 Nd5

- **4.d4** → 4…cxd4 : « Le pion d4 attaque ton pion c5 → ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours (…cxd4) »
- **4.Nf3** → 4…Nc6 : « Son cavalier se développe en f3 et surveille d4 et e5 → ton cavalier se développe en c6 et surveille d4 et e5 (…Nc6) »

### Après 1.e4 c5 2.d4 cxd4

- **3.c3** → 3…Nf6 : « Il menace de prendre ton pion d4 → ton cavalier va en f6 et contre-attaque son pion e4 au lieu de défendre ton pion d4 (…Nf6) »
- **3.Nf3** → 3…Nc6 : « Son cavalier va en f3 et attaque ton pion d4 → ton cavalier se développe en c6 et surveille d4 et e5 (…Nc6) »

### Après 1.e4 c5 2.Bc4 Nc6

- **3.Nf3** → 3…g6 : « Son cavalier se développe en f3 et surveille d4 et e5 → le pion g6 prépare le fianchetto de ton fou en g7 (…g6) »
- **3.Qf3** → 3…Nf6 : « Il menace Qxf7 mat → ton cavalier bloque la colonne f : plus de mat en f7 (…Nf6) »
- **3.Qh5** → 3…e6 : « Il menace Qxf7 mat → le pion e6 ferme la route du fou vers f7 et ouvre celle de ton fou f8, qui protège c5 ; ici …g6 perdrait c5 (…e6) »

### Après 1.e4 c5 2.Qh5 d6 3.Bc4 g6

- **4.Qe2** → 4…Bg7 : « La dame recule en e2, d’où elle protège le pion e4 → ton fou se place sur la grande diagonale, comme toujours (…Bg7) »
- **4.Qf3** → 4…Nf6 : « La dame revient viser f7, cette fois par la colonne f : elle menace encore Qxf7+ → ton cavalier bloque la colonne f : f7 est de nouveau à l’abri (…Nf6) »

## Londres en défense (Noirs) — 8 carrefours, 24 cartes

### Après position de départ

- **1.d4** → 1…d5 : « Les Blancs occupent le centre avec leur pion d → ton pion d5 prend lui aussi une case du centre : c’est la base de ton système (…d5) »
- **1.c4** → 1…c6 : « Les Blancs commencent par le pion c → ton pion c6 prépare …d5 : tu retrouves ton système (…c6) »
- **1.Nf3** → 1…d5 : « Son cavalier se développe en f3 et surveille d4 et e5 → le pion d5 prend de l’espace au centre et surveille e4 (…d5) »

### Après 1.d4 d5

- **2.c4** → 2…c6 : « Les Blancs attaquent ton pion d5 avec le pion c : c’est le Gambit Dame → le pion c6 soutient d5 sans enfermer ton fou c8 : c’est la Défense slave (…c6) »
- **2.Nf3** → 2…c6 : « Son cavalier se développe en f3 et surveille d4 et e5 → le pion c6 soutient ton pion d5 (…c6) »
- **2.Bf4** → 2…Nf6 : « Son fou se développe en f4 et surveille e5 → ton cavalier se développe en f6 et surveille d5 et e4 (…Nf6) »
- **2.e3** → 2…Bf5 : « Le pion e3 enferme le fou c1 des Blancs → ton fou sort tout de suite, avant que le fou blanc ne vienne en d3 (…Bf5) »
- **2.Nc3** → 2…Nf6 : « Son cavalier se développe en c3 et surveille d5 et e4 → ton cavalier se développe en f6 et surveille d5 et e4 (…Nf6) »

### Après 1.d4 d5 2.c4 c6

- **3.Nf3** → 3…Nf6 : « Le cavalier blanc se développe et surveille la case e5 → ton cavalier se développe et protège d5 une deuxième fois (…Nf6) »
- **3.Nc3** → 3…Nf6 : « Son cavalier se développe en c3 et surveille d5 et e4 → ton cavalier se développe en f6 et surveille d5 et e4 (…Nf6) »
- **3.cxd5** → 3…cxd5 : « Son pion prend ton pion d5 : la colonne c s’ouvre pour ses tours → ton pion reprend en d5 : le matériel reste égal (…cxd5) »

### Après 1.d4 d5 2.c4 c6 3.Nf3 Nf6

- **4.e3** → 4…Bf5 : « Le pion e3 soutient d4, mais il enferme le fou c1 des Blancs → ton fou sort AVANT …e6 : c’est l’idée du Londres en défense, ce fou ne restera pas enfermé (…Bf5) »
- **4.Nc3** → 4…e6 : « Le second cavalier blanc soutient c4 et vise d5 → …Bf5 serait trop tôt (cxd5 cxd5 puis Qb3 attaque b7) : tu joues …e6 d’abord, comme Stockfish (…e6) »

### Après 1.d4 d5 2.Nf3 c6

- **3.Bf4** → 3…Nf6 : « Son fou se développe en f4 et surveille e5 → ton cavalier se développe en f6 et surveille d5 et e4 (…Nf6) »
- **3.c4** → 3…Nf6 : « Le pion c4 prend de l’espace au centre et surveille d5 → ton cavalier se développe et protège d5 une deuxième fois (…Nf6) »

### Après 1.d4 d5 2.e3 Bf5

- **3.c4** → 3…e6 : « Les Blancs attaquent ton pion d5 → le pion e6 soutient d5 ; ton fou f5 est déjà dehors (…e6) »
- **3.Bd3** → 3…e6 : « Il menace de prendre ton fou f5 → le pion e6 protège ton fou f5, attaqué par son fou, et ouvre la diagonale de ton fou f8 (…e6) »

### Après 1.c4 c6

- **2.Nf3** → 2…d5 : « Le cavalier blanc se développe → ton pion prend sa place au centre (…d5) »
- **2.e4** → 2…d5 : « Le pion e4 prend de l’espace au centre et surveille d5 → le pion d5 attaque son pion e4 (…d5) »
- **2.Nc3** → 2…d5 : « Son cavalier se développe en c3 et surveille d5 et e4 → le pion d5 attaque son pion c4 (…d5) »

### Après 1.Nf3 d5

- **2.c4** → 2…c6 : « Le pion c4 prend de l’espace au centre et surveille d5 → le pion c6 soutient ton pion d5 (…c6) »
- **2.d4** → 2…c6 : « Le pion d4 prend de l’espace au centre et surveille e5 → le pion c6 soutient ton pion d5 (…c6) »
- **2.g3** → 2…c6 : « Les Blancs préparent le fianchetto de leur fou f1 → ton pion c6 soutient d5 et laisse ton fou c8 libre (…c6) »
- **2.e3** → 2…c6 : « Le pion e3 ouvre la diagonale de son fou f1 → le pion c6 soutient ton pion d5 (…c6) »
