# Carrefours du répertoire — phrases-panneaux

Un carrefour : une position où l’adversaire a au moins 2 coups dans mon arbre (son coup change ma réponse). Une carte
par coup-panneau ; sa phrase-panneau dit en une phrase ce que son coup change → ma réponse. Phrases générées par
règles simples (src/lib/signposts.ts) à partir de la position : à relire.

109 cartes au total.

## Anglaise (système fermé) (Blancs) — 11 carrefours, 25 cartes

### Après 1.c4

- **1…e5** → 2.Nc3 : « Il prend de la place au centre avec son pion e5 → tu sors ton cavalier : Nc3 »
- **1…c5** → 2.Nc3 : « Il prend de la place au centre avec son pion c5 → tu sors ton cavalier : Nc3 »
- **1…Nf6** → 2.Nc3 : « Il sort son cavalier en f6 → tu sors ton cavalier : Nc3 »
- **1…e6** → 2.Nc3 : « Il avance son pion en e6 → tu sors ton cavalier : Nc3 »
- **1…d5** → 2.cxd5 : « Il attaque ton pion c4 → tu prends : cxd5 »

### Après 1.c4 e5 2.Nc3

- **2…Nc6** → 3.g3 : « Il sort son cavalier en c6 → tu prépares ton fianchetto : g3 »
- **2…Nf6** → 3.g3 : « Il sort son cavalier en f6 → tu prépares ton fianchetto : g3 »

### Après 1.c4 e5 2.Nc3 Nc6 3.g3

- **3…g6** → 4.Bg2 : « Il prépare le fianchetto de son fou → tu sors ton fou : Bg2 »
- **3…Nf6** → 4.Bg2 : « Il sort son cavalier en f6 → tu sors ton fou : Bg2 »

### Après 1.c4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.e4

- **6…Nge7** → 7.Nge2 : « Il sort son cavalier en e7 → tu sors ton cavalier : Nge2 »
- **6…f5** → 7.Nge2 : « Il attaque ton pion e4 → tu continues ton développement : Nge2 »

### Après 1.c4 e5 2.Nc3 Nf6 3.g3

- **3…d5** → 4.cxd5 : « Il attaque ton pion c4 → tu prends : cxd5 »
- **3…Bb4** → 4.Bg2 : « Il sort son fou en b4 → tu sors ton fou : Bg2 »

### Après 1.c4 c5 2.Nc3

- **2…Nc6** → 3.g3 : « Il sort son cavalier en c6 → tu prépares ton fianchetto : g3 »
- **2…Nf6** → 3.g3 : « Il sort son cavalier en f6 → tu prépares ton fianchetto : g3 »

### Après 1.c4 c5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3

- **5…d6** → 6.e4 : « Il avance son pion en d6 → tu prends ta part du centre : e4 »
- **5…Nf6** → 6.e4 : « Il sort son cavalier en f6 → tu prends ta part du centre : e4 »

### Après 1.c4 Nf6 2.Nc3

- **2…g6** → 3.g3 : « Il prépare le fianchetto de son fou → tu prépares ton fianchetto : g3 »
- **2…e6** → 3.d4 : « Il avance son pion en e6 → tu prends ta part du centre : d4 »

### Après 1.c4 d5 2.cxd5

- **2…Qxd5** → 3.Nc3 : « Il prend ton pion d5 → tu attaques sa dame d5 : Nc3 »
- **2…Nf6** → 3.Nf3 : « Il attaque ton pion d5 → tu continues ton développement : Nf3 »

### Après 1.c4 d5 2.cxd5 Qxd5 3.Nc3

- **3…Qd8** → 4.d4 : « Sa dame va en d8 → tu prends ta part du centre : d4 »
- **3…Qa5** → 4.d4 : « Sa dame va en a5 → tu prends ta part du centre : d4 »

### Après 1.c4 d5 2.cxd5 Qxd5 3.Nc3 Qd8 4.d4 Nf6 5.Nf3

- **5…g6** → 6.e4 : « Il prépare le fianchetto de son fou → tu prends ta part du centre : e4 »
- **5…e6** → 6.e4 : « Il avance son pion en e6 → tu prends ta part du centre : e4 »

## Système de Londres (Blancs) — 5 carrefours, 17 cartes

### Après 1.d4

- **1…d5** → 2.Bf4 : « Il prend de la place au centre avec son pion d5 → tu sors ton fou : Bf4 »
- **1…Nf6** → 2.Bf4 : « Il sort son cavalier en f6 → tu sors ton fou : Bf4 »
- **1…e6** → 2.Bf4 : « Il avance son pion en e6 → tu sors ton fou : Bf4 »
- **1…c5** → 2.d5 : « Il attaque ton pion d4 → tu le mets à l’abri : d5 »
- **1…g6** → 2.Nf3 : « Il prépare le fianchetto de son fou → tu sors ton cavalier : Nf3 »
- **1…f5** → 2.Bf4 : « Il prend de la place au centre avec son pion f5 → tu sors ton fou : Bf4 »
- **1…e5** → 2.dxe5 : « Il attaque ton pion d4 → tu prends : dxe5 »

### Après 1.d4 d5 2.Bf4

- **2…Nf6** → 3.e3 : « Il sort son cavalier en f6 → tu avances ton pion : e3 »
- **2…c5** → 3.e3 : « Il attaque ton pion d4 → tu le soutiens : e3 »
- **2…Bf5** → 3.e3 : « Il sort son fou en f5 → tu avances ton pion : e3 »

### Après 1.d4 d5 2.Bf4 Nf6 3.e3

- **3…c5** → 4.c3 : « Il attaque ton pion d4 → tu le soutiens : c3 »
- **3…e6** → 4.Nf3 : « Il avance son pion en e6 → tu sors ton cavalier : Nf3 »
- **3…g6** → 4.Nf3 : « Il prépare le fianchetto de son fou → tu sors ton cavalier : Nf3 »

### Après 1.d4 Nf6 2.Bf4

- **2…g6** → 3.e3 : « Il prépare le fianchetto de son fou → tu avances ton pion : e3 »
- **2…e6** → 3.e3 : « Il avance son pion en e6 → tu avances ton pion : e3 »

### Après 1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bg5

- **4…Qb4+** → 5.Nc3 : « Il te met en échec → tu pares l’échec : Nc3 »
- **4…Qc5** → 5.Be3 : « Il attaque ton pion e5 → tu attaques sa dame c5 : Be3 »

## Système …c5 / …g6 (Dragon accéléré) (Noirs) — 14 carrefours, 43 cartes

### Après position de départ

- **1.e4** → 1…c5 : « Il prend de la place au centre avec son pion e4 → tu prends ta part du centre : …c5 »
- **1.e3** → 1…c5 : « Il avance son pion en e3 → tu prends ta part du centre : …c5 »

### Après 1.e4 c5

- **2.Nf3** → 2…Nc6 : « Il sort son cavalier en f3 → tu sors ton cavalier : …Nc6 »
- **2.Nc3** → 2…Nc6 : « Il sort son cavalier en c3 → tu sors ton cavalier : …Nc6 »
- **2.c3** → 2…Nf6 : « Il avance son pion en c3 → tu attaques son pion e4 : …Nf6 »
- **2.d4** → 2…cxd4 : « Il attaque ton pion c5 → tu prends : …cxd4 »
- **2.Bc4** → 2…Nc6 : « Il sort son fou en c4 → tu sors ton cavalier : …Nc6 »
- **2.Qh5** → 2…d6 : « Il attaque ton pion c5 → tu le soutiens : …d6 »
- **2.Qf3** → 2…Nc6 : « Il sort sa dame en f3 → tu sors ton cavalier : …Nc6 »
- **2.d3** → 2…g6 : « Il avance son pion en d3 → tu prépares ton fianchetto : …g6 »
- **2.c4** → 2…Nc6 : « Il prend de la place au centre avec son pion c4 → tu sors ton cavalier : …Nc6 »

### Après 1.e4 c5 2.Nf3 Nc6

- **3.d4** → 3…cxd4 : « Il attaque ton pion c5 → tu prends : …cxd4 »
- **3.Bc4** → 3…g6 : « Il sort son fou en c4 → tu prépares ton fianchetto : …g6 »
- **3.Bb5** → 3…g6 : « Il sort son fou en b5 → tu prépares ton fianchetto : …g6 »
- **3.Nc3** → 3…g6 : « Il sort son cavalier en c3 → tu prépares ton fianchetto : …g6 »
- **3.c3** → 3…Nf6 : « Il avance son pion en c3 → tu attaques son pion e4 : …Nf6 »

### Après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6

- **5.Nc3** → 5…Bg7 : « Il sort son cavalier en c3 → tu sors ton fou : …Bg7 »
- **5.c4** → 5…Bg7 : « Il prend de la place au centre avec son pion c4 → tu sors ton fou : …Bg7 »
- **5.Nxc6** → 5…bxc6 : « Il prend ton cavalier c6 → tu prends : …bxc6 »

### Après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Be3 Nf6

- **7.Bc4** → 7…O-O : « Il sort son fou en c4 → tu roques : …O-O »
- **7.Be2** → 7…O-O : « Il sort son fou en e2 → tu roques : …O-O »

### Après 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nxc6 bxc6

- **6.Bd3** → 6…Bg7 : « Il sort son fou en d3 → tu sors ton fou : …Bg7 »
- **6.Qd4** → 6…Nf6 : « Il attaque ta tour h8 → tu bloques son attaque : …Nf6 »

### Après 1.e4 c5 2.Nf3 Nc6 3.Bc4 g6

- **4.O-O** → 4…Bg7 : « Il roque → tu sors ton fou : …Bg7 »
- **4.Nc3** → 4…Bg7 : « Il sort son cavalier en c3 → tu sors ton fou : …Bg7 »

### Après 1.e4 c5 2.Nf3 Nc6 3.Bb5 g6

- **4.O-O** → 4…Bg7 : « Il roque → tu sors ton fou : …Bg7 »
- **4.Bxc6** → 4…dxc6 : « Il prend ton cavalier c6 → tu prends : …dxc6 »

### Après 1.e4 c5 2.Nc3 Nc6

- **3.g3** → 3…g6 : « Il prépare le fianchetto de son fou → tu prépares ton fianchetto : …g6 »
- **3.f4** → 3…g6 : « Il prend de la place au centre avec son pion f4 → tu prépares ton fianchetto : …g6 »
- **3.Nf3** → 3…g6 : « Il sort son cavalier en f3 → tu prépares ton fianchetto : …g6 »
- **3.Bc4** → 3…g6 : « Il sort son fou en c4 → tu prépares ton fianchetto : …g6 »
- **3.Bb5** → 3…g6 : « Il sort son fou en b5 → tu prépares ton fianchetto : …g6 »

### Après 1.e4 c5 2.Nc3 Nc6 3.Bc4 g6

- **4.Qf3** → 4…Nf6 : « Il sort sa dame en f3 → tu attaques son pion e4 : …Nf6 »
- **4.Nf3** → 4…Bg7 : « Il sort son cavalier en f3 → tu sors ton fou : …Bg7 »

### Après 1.e4 c5 2.c3 Nf6 3.e5 Nd5

- **4.d4** → 4…cxd4 : « Il attaque ton pion c5 → tu prends : …cxd4 »
- **4.Nf3** → 4…Nc6 : « Il sort son cavalier en f3 → tu attaques son pion e5 : …Nc6 »

### Après 1.e4 c5 2.d4 cxd4

- **3.c3** → 3…Nf6 : « Il attaque ton pion d4 → tu attaques son pion e4 : …Nf6 »
- **3.Nf3** → 3…Nc6 : « Il attaque ton pion d4 → tu le soutiens : …Nc6 »

### Après 1.e4 c5 2.Bc4 Nc6

- **3.Nf3** → 3…g6 : « Il sort son cavalier en f3 → tu prépares ton fianchetto : …g6 »
- **3.Qf3** → 3…Nf6 : « Il sort sa dame en f3 → tu attaques son pion e4 : …Nf6 »
- **3.Qh5** → 3…e6 : « Il attaque ton pion c5 → tu le soutiens : …e6 »

### Après 1.e4 c5 2.Qh5 d6 3.Bc4 g6

- **4.Qe2** → 4…Bg7 : « Sa dame va en e2 → tu sors ton fou : …Bg7 »
- **4.Qf3** → 4…Nf6 : « Sa dame va en f3 → tu attaques son pion e4 : …Nf6 »

## Londres en défense (Noirs) — 8 carrefours, 24 cartes

### Après position de départ

- **1.d4** → 1…d5 : « Il prend de la place au centre avec son pion d4 → tu prends ta part du centre : …d5 »
- **1.c4** → 1…c6 : « Il prend de la place au centre avec son pion c4 → tu avances ton pion : …c6 »
- **1.Nf3** → 1…d5 : « Il sort son cavalier en f3 → tu prends ta part du centre : …d5 »

### Après 1.d4 d5

- **2.c4** → 2…c6 : « Il attaque ton pion d5 → tu le soutiens : …c6 »
- **2.Nf3** → 2…c6 : « Il sort son cavalier en f3 → tu avances ton pion : …c6 »
- **2.Bf4** → 2…Nf6 : « Il sort son fou en f4 → tu sors ton cavalier : …Nf6 »
- **2.e3** → 2…Bf5 : « Il avance son pion en e3 → tu sors ton fou : …Bf5 »
- **2.Nc3** → 2…Nf6 : « Il attaque ton pion d5 → tu le soutiens : …Nf6 »

### Après 1.d4 d5 2.c4 c6

- **3.Nf3** → 3…Nf6 : « Il sort son cavalier en f3 → tu sors ton cavalier : …Nf6 »
- **3.Nc3** → 3…Nf6 : « Il attaque ton pion d5 → tu le soutiens : …Nf6 »
- **3.cxd5** → 3…cxd5 : « Il prend ton pion d5 → tu prends : …cxd5 »

### Après 1.d4 d5 2.c4 c6 3.Nf3 Nf6

- **4.e3** → 4…Bf5 : « Il avance son pion en e3 → tu sors ton fou : …Bf5 »
- **4.Nc3** → 4…e6 : « Il attaque ton pion d5 → tu le soutiens : …e6 »

### Après 1.d4 d5 2.Nf3 c6

- **3.Bf4** → 3…Nf6 : « Il sort son fou en f4 → tu sors ton cavalier : …Nf6 »
- **3.c4** → 3…Nf6 : « Il attaque ton pion d5 → tu le soutiens : …Nf6 »

### Après 1.d4 d5 2.e3 Bf5

- **3.c4** → 3…e6 : « Il attaque ton pion d5 → tu le soutiens : …e6 »
- **3.Bd3** → 3…e6 : « Il attaque ton fou f5 → tu le défends : …e6 »

### Après 1.c4 c6

- **2.Nf3** → 2…d5 : « Il sort son cavalier en f3 → tu prends ta part du centre : …d5 »
- **2.e4** → 2…d5 : « Il prend de la place au centre avec son pion e4 → tu prends ta part du centre : …d5 »
- **2.Nc3** → 2…d5 : « Il sort son cavalier en c3 → tu prends ta part du centre : …d5 »

### Après 1.Nf3 d5

- **2.c4** → 2…c6 : « Il attaque ton pion d5 → tu le soutiens : …c6 »
- **2.d4** → 2…c6 : « Il prend de la place au centre avec son pion d4 → tu avances ton pion : …c6 »
- **2.g3** → 2…c6 : « Il prépare le fianchetto de son fou → tu avances ton pion : …c6 »
- **2.e3** → 2…c6 : « Il avance son pion en e3 → tu avances ton pion : …c6 »
