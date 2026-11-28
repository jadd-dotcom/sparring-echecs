# « Pourquoi » corrigés — brief de clôture, étape 3

Règles corrigées dans `src/lib/moveWhy.ts` ; textes régénérés (`npm run lesson-lines`, `lessons-doc`, `crossroads-doc`) ; garde-fou `src/lib/whyGuard.test.ts` (CI).

## Phrases calculées modifiées (`src/data/lessonLines.ts`) : 62 occurrences, 30 phrases distinctes

- exf5 : « Ton pion prend son pion f5 : la colonne e s’ouvre pour tes tours. » → « Ton pion prend son pion f5 : la colonne e devient semi-ouverte pour tes tours. »
- h3 : « Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite. » → « Le pion h3 contrôle g4 et libère h2 pour ton roi. »
- a6 : « Le pion a6 contrôle b5 : ni ton fou ni ton cavalier ne pourront s’y installer. » → « Le pion a6 contrôle b5. »
- cxd5 : « Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours. » → « Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c devient semi-ouverte pour tes tours. »
- a3 : « Le pion a3 contrôle b4 : ni son fou ni son cavalier ne pourront s’y installer. » → « Le pion a3 contrôle b4. »
- h6 : « Le pion h6 contrôle g5 : ni ton fou ni ton cavalier ne pourront s’y installer, et son roi a une case de fuite. » → « Le pion h6 contrôle g5 et libère h7 pour son roi. »
- exd5 : « Ton pion reprend en d5 : le matériel reste égal. » → « Ton pion reprend en d5. »
- Qd2 : « Ta dame sort en d2 : avec ton fou e3, Bh6 échangera son fou g7, le meilleur défenseur de son roi. » → « Ta dame sort en d2 : avec ton fou e3, elle prépare Bh6, qui propose l’échange de son fou g7. »
- cxd5 : « Ton pion prend son pion d5 : la colonne c s’ouvre pour tes tours. » → « Ton pion prend son pion d5 : la colonne c devient semi-ouverte pour tes tours. »
- h3 : « Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer. » → « Le pion h3 contrôle g4. »
- cxd4 : « Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours. » → « Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c devient semi-ouverte pour tes tours. »
- dxe5 : « Ton pion prend son pion e5 : la colonne d s’ouvre pour tes tours. » → « Ton pion prend son pion e5 : la colonne d devient semi-ouverte pour tes tours. »
- h3 : « Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer. » → « Le pion h3 contrôle g4. »
- exd5 : « Son pion prend ton pion d5, qui attaquait son pion e4, et la colonne e s’ouvre pour ses tours. » → « Son pion prend ton pion d5, qui attaquait son pion e4, et la colonne e devient semi-ouverte pour ses tours ; il menace aussi de prendre ton cavalier c6. »
- Nxd5 : « Son cavalier reprend en d5 : le matériel reste égal. » → « Son cavalier reprend en d5. »
- Qd1 : « Sa dame va en d1 et garde c2 : plus de fourchette Nc2+ sur son roi et sa tour. » → « Sa dame va en d1 et garde c2 : plus de fourchette Nc2+ sur son roi et sa tour ; avec son fou e3, elle menace aussi de prendre ton cavalier d4. »
- Rc1 : « Sa tour vient en c1, prête si la colonne c s’ouvre. » → « Sa tour vient en c1 et se place sur la colonne c. »
- h3 : « Le pion h3 contrôle g4 : ni ton fou ni ton cavalier ne pourront s’y installer, et son roi a une case de fuite. » → « Le pion h3 contrôle g4 et libère h2 pour son roi. »
- exd7+ : « Son pion prend ton pion d7, avec échec : la colonne e s’ouvre pour ses tours. » → « Son pion prend ton pion d7, avec échec : la colonne e devient semi-ouverte pour ses tours. »
- exd5 : « Son pion prend ton pion d5, qui attaquait son fou c4, et la colonne e s’ouvre pour ses tours. » → « Son pion prend ton pion d5, qui attaquait son fou c4, et la colonne e devient semi-ouverte pour ses tours ; il menace aussi de prendre ton cavalier c6. »
- cxd4 : « Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c s’ouvre pour tes tours. » → « Ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c devient semi-ouverte pour tes tours ; il menace aussi de prendre son cavalier c3. »
- Qd2 : « Sa dame sort en d2 : avec son fou e3, Bh6 échangera ton fou g7, le meilleur défenseur de ton roi. » → « Sa dame sort en d2 : avec son fou e3, elle prépare Bh6, qui propose l’échange de ton fou g7. »
- exd5 : « Ton pion prend son pion d5 : la colonne e s’ouvre pour tes tours. » → « Ton pion prend son pion d5 : la colonne e devient semi-ouverte pour tes tours. »
- h6 : « Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer. » → « Le pion h6 contrôle g5. »
- cxd5 : « Son pion prend ton pion d5 : la colonne c s’ouvre pour ses tours. » → « Son pion prend ton pion d5 : la colonne c devient semi-ouverte pour ses tours. »
- fxe4 : « Ton pion prend son pion e4, qui attaquait ton cavalier d5. » → « Ton pion prend son pion e4, qui attaquait ton cavalier d5 ; il menace aussi de prendre sa dame d3. »
- exd5 : « Son pion prend ton pion d5, qui attaquait son pion e4, et la colonne e s’ouvre pour ses tours. » → « Son pion prend ton pion d5, qui attaquait son pion e4, et la colonne e devient semi-ouverte pour ses tours. »
- cxd5 : « Son pion prend ton pion d5, qui attaquait son pion c4, et la colonne c s’ouvre pour ses tours. » → « Son pion prend ton pion d5, qui attaquait son pion c4, et la colonne c devient semi-ouverte pour ses tours. »
- h6 : « Le pion h6 contrôle g5 : ni son fou ni son cavalier ne pourront s’y installer, et ton roi a une case de fuite. » → « Le pion h6 contrôle g5 et libère h7 pour ton roi. »
- dxc4 : « Ton pion prend son pion c4 : la colonne d s’ouvre pour tes tours. » → « Ton pion prend son pion c4 : la colonne d devient semi-ouverte pour tes tours. »
## Phrases-panneaux modifiées (`docs/CARREFOURS.md`) : 5

- **1…d5** → 2.cxd5 : « Le pion d5 attaque ton pion c4 → ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c devient semi-ouverte pour tes tours (cxd5) »
- **3…d5** → 4.cxd5 : « Le pion d5 attaque ton pion c4 → ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c devient semi-ouverte pour tes tours (cxd5) »
- **2.d4** → 2…cxd4 : « Le pion d4 attaque ton pion c5 → ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c devient semi-ouverte pour tes tours (…cxd4) »
- **4.d4** → 4…cxd4 : « Le pion d4 attaque ton pion c5 → ton pion prend son pion d4, qui attaquait ton pion c5, et la colonne c devient semi-ouverte pour tes tours (…cxd4) »
- **3.cxd5** → 3…cxd5 : « Son pion prend ton pion d5 : la colonne c devient semi-ouverte pour ses tours → ton pion reprend en d5 : le matériel reste égal (…cxd5) »

## « Pourquoi » écrits à la main signalés par le garde-fou (avertissements, non bloquants, à relire)

- london · d4 e6 Bf4 c5 e3 d5 Nf3 Nf6 c3 Nc6 Nbd2 Nh5 Bg3 Nxg3 · « Les Noirs échangent le cavalier contre ton fou. » → menace créée non dite (Nxh1)
- london · d4 e5 dxe5 Nc6 Nf3 Qe7 Bg5 · « Piège à éviter : Bf4 permet …Qb4+ puis …Qxb2, et Bc3 perd sur …Bb4 et …Qc1 mat. Ton fou va en g5 et attaque la dame. » → « mat » sans mat ni menace de mat calculée
- london · d4 e5 dxe5 Nc6 Nf3 Qe7 Bg5 Qb4+ · « La dame noire fait échec et vise ton pion b2. » → réponse qui pare sa menace Bxe7, la pièce e7 sans le dire
- london · d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3 b6 Ne5 · « Le cavalier saute en e5, un [[avant-poste]] au centre, d’où il gêne les Noirs et prépare l’attaque. » → menace créée non dite (Nxc6)
- london · d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3 b6 Ne5 Bb7 · « Le fou noir vise la grande diagonale, vers e4. » → réponse qui pare sa menace Nxc6, la pièce c6 sans le dire
- london · d4 d5 Bf4 c5 e3 Nc6 Nf3 Nf6 Nbd2 e6 c3 Bd6 Bg3 O-O Bd3 b6 Ne5 · « Le cavalier saute en e5, un [[avant-poste]] au centre, d’où il gêne les Noirs et prépare l’attaque. » → menace créée non dite (Nxc6)
- london · d4 d5 Bf4 c5 e3 Nc6 Nf3 Nf6 Nbd2 e6 c3 Bd6 Bg3 O-O Bd3 b6 Ne5 Bb7 · « Le fou noir vise la grande diagonale, vers e4. » → réponse qui pare sa menace Nxc6, la pièce c6 sans le dire
- london · d4 Nf6 Bf4 e6 e3 c5 c3 Nc6 Nd2 d5 Ngf3 Bd6 Bg3 O-O Bd3 b6 Ne5 · « Le cavalier saute en e5, un [[avant-poste]] au centre, d’où il gêne les Noirs et prépare l’attaque. » → menace créée non dite (Nxc6)
- london · d4 Nf6 Bf4 e6 e3 c5 c3 Nc6 Nd2 d5 Ngf3 Bd6 Bg3 O-O Bd3 b6 Ne5 Bb7 · « Le fou noir vise la grande diagonale, vers e4. » → réponse qui pare sa menace Nxc6, la pièce c6 sans le dire
