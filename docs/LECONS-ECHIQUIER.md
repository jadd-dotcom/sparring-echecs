# Leçons « Maîtrise de l’échiquier »

Contenu affiché dans l’appli, généré depuis `src/data/boardLessons.ts` et `src/lib/board/` (`npm run board-doc`).
Objectif du mode : jouer à l’aveugle. Les chapitres se débloquent dans l’ordre ; chaque chapitre = une courte leçon
(méthode + astuce), puis des exercices chronométrés : « S’entraîner » (sans chrono, corrigé expliqué après chaque réponse)
et « Épreuve » (critères de maîtrise ci-dessous). Tout se fait au toucher, hors ligne ; son court et légère vibration
sur une erreur (désactivables avec le réglage Sons).

## Règles générales

- **Validation d’un chapitre** : tous ses niveaux validés (le 7a, « rejouer de tête », est un entraînement non noté).
  Les niveaux d’un chapitre se débloquent aussi dans l’ordre.
- **Ch. 1-2** : chaque niveau (1a … 1e, 2c … 2e) a son épreuve de 30 s, à réussir 3 fois (pas forcément de suite) :
  au moins 25 bonnes réponses et au plus 1 erreur ; pour 1e et 2e (nommer une case au clavier, deux touches par réponse),
  au moins 20 bonnes réponses et au plus 1 erreur.
- **Ch. 3-5** : 20 questions, au moins 19 justes, temps médian ≤ 3 s par question. Pour une réponse à plusieurs cases
  (« cite les cases entre… », « toutes les cases du cavalier »), le temps compte **par case donnée** (temps ÷ nombre de cases).
- **Ch. 6** : 10 questions à la longueur visée, au moins 9 justes ; longueurs 2, 4, 6, 8, puis 12 et 16 **demi-coups**
  (« 1.e4 e5 » = 2 demi-coups ; 16 demi-coups = 8 coups complets), un niveau par longueur.
- **Ch. 7** : partie à l’aveugle finie avec au plus 3 coups d’œil ; finie = mat, pat ou nulle, ou abandon après au moins
  30 de mes coups (pour qu’un abandon rapide ne valide pas le chapitre). Contre Maia au niveau choisi ; sans effet sur mon niveau.
- **Révisions** des chapitres validés : J+1, J+3, J+7, puis tous les 7 jours. Une révision = une épreuve d’un
  niveau du chapitre, à tour de rôle (chapitre 7 : rejouer une partie courte avec au plus 2 erreurs et
  1 coup d’œil). Révision ratée → chapitre « à revoir », de nouveau dû le lendemain ; une fois réussie,
  on repart de J+1.
- **Échauffement échiquier (3 min)** (accueil) : enchaîne les révisions du jour, « à revoir » d’abord, jusqu’à 3 minutes ;
  sans révision due, 3 minutes de « trouve la case » sur mes cases les plus faibles.
- **Adaptatif** : pour chaque case, erreurs et temps de réponse. Faiblesse = 70 % taux d’erreur + 30 % lenteur (au-delà de
  1,5 s en moyenne) ; une case jamais vue vaut 0,3. Une case est tirée avec un poids 1 + 6 × faiblesse : une case très faible
  sort jusqu’à 7 fois plus souvent qu’une case sûre. Carte de chaleur dans l’écran du mode ; les 10 cases les plus faibles
  dans le rapport pour Claude (section « Échiquier »).

## Chapitre 1. Repères (vu des Blancs)

**Objectif :** Trouver et nommer n’importe quelle case sans réfléchir, l’échiquier vu des Blancs.

### Méthode

1. Vu des Blancs, les colonnes vont de a (à gauche) à h (à droite) et les rangées de 1 (en bas, ton côté) à 8 (en haut).
2. Une case se nomme toujours colonne puis rangée : e4 = colonne e, rangée 4.
3. Pour trouver une case : repère d’abord la colonne, puis compte les rangées depuis ton côté.

### Astuce

Coupe l’échiquier en deux : colonnes a-d à gauche (côté de la dame), e-h à droite (côté du roi) ; rangées 1-4 chez toi, 5-8 chez l’adversaire. Le roi blanc part de e1, la dame de d1 : d et e sont les deux colonnes du milieu.

### Exemples

- e4 : colonne e (la 5e depuis la gauche), rangée 4 (la 4e depuis le bas).
- b7 : 2e colonne depuis la gauche, 2e rangée depuis le haut.

### Exercices

- **1a. Colonnes** — Une colonne est demandée (« touche la colonne e ») : touche n’importe quelle case de cette colonne. Coordonnées cachées. _Épreuve : 30 s, au moins 25 bonnes réponses et au plus 1 erreur ; à réussir 3 fois._
  - Exemples de questions : « Touche la colonne d » → d ; « Touche la colonne c » → c ; « Touche la colonne f » → f
- **1b. Rangées** — Une rangée est demandée (« touche la rangée 6 ») : touche n’importe quelle case de cette rangée. Coordonnées cachées. _Épreuve : 30 s, au moins 25 bonnes réponses et au plus 1 erreur ; à réussir 3 fois._
  - Exemples de questions : « Touche la rangée 5 » → 5 ; « Touche la rangée 2 » → 2 ; « Touche la rangée 3 » → 3
- **1c. Trouver une case (coordonnées affichées)** — Une case est demandée : touche-la. Les coordonnées sont affichées sur le bord. _Épreuve : 30 s, au moins 25 bonnes réponses et au plus 1 erreur ; à réussir 3 fois._
  - Exemples de questions : « Touche la case d6 » → d6 ; « Touche la case d7 » → d7 ; « Touche la case c3 » → c3
- **1d. Trouver une case (coordonnées cachées)** — Une case est demandée : touche-la. Les coordonnées sont cachées. _Épreuve : 30 s, au moins 25 bonnes réponses et au plus 1 erreur ; à réussir 3 fois._
  - Exemples de questions : « Touche la case c1 » → c1 ; « Touche la case f1 » → f1 ; « Touche la case a6 » → a6
- **1e. Nommer une case** — Une case est surlignée : tape sa colonne (a-h) puis sa rangée (1-8). _Épreuve : 30 s, au moins 20 bonnes réponses et au plus 1 erreur ; à réussir 3 fois._
  - Exemples de questions : « Quelle est cette case ? » → a4 ; « Quelle est cette case ? » → h1 ; « Quelle est cette case ? » → e2

## Chapitre 2. Vu des Noirs

**Objectif :** Les mêmes repères quand tu joues les Noirs, échiquier retourné.

### Méthode

1. Vu des Noirs, tout est retourné : la colonne a est à droite et la h à gauche ; la rangée 8 est en bas (ton côté) et la 1 en haut.
2. Le nom d’une case ne change pas : e4 reste e4, seule sa place à l’écran change.
3. Pour trouver une case : colonne d’abord (en comptant depuis la droite pour a, b, c…), puis rangée (en comptant depuis le haut pour 1, 2, 3…).

### Astuce

Garde un point fixe : les rois sont toujours sur la colonne e, et chaque dame commence sur sa couleur (d8, case foncée, pour la dame noire). Vu des Noirs, le roi est donc à gauche de la dame.

### Exemples

- e5 vu des Noirs : 4e colonne depuis la gauche (h, g, f, e), 4e rangée depuis le bas (8, 7, 6, 5).
- a1 vu des Noirs : la case en haut à droite.

### Exercices

- **2c. Trouver une case (coordonnées affichées)** — Une case est demandée : touche-la. Échiquier vu des Noirs, coordonnées affichées. _Épreuve : 30 s, au moins 25 bonnes réponses et au plus 1 erreur ; à réussir 3 fois._
  - Exemples de questions : « Touche la case f3 » → f3 ; « Touche la case c4 » → c4 ; « Touche la case d8 » → d8
- **2d. Trouver une case (coordonnées cachées)** — Une case est demandée : touche-la. Échiquier vu des Noirs, coordonnées cachées. _Épreuve : 30 s, au moins 25 bonnes réponses et au plus 1 erreur ; à réussir 3 fois._
  - Exemples de questions : « Touche la case e5 » → e5 ; « Touche la case a1 » → a1 ; « Touche la case f2 » → f2
- **2e. Nommer une case** — Une case est surlignée, échiquier vu des Noirs : tape sa colonne puis sa rangée. _Épreuve : 30 s, au moins 20 bonnes réponses et au plus 1 erreur ; à réussir 3 fois._
  - Exemples de questions : « Quelle est cette case ? » → b3 ; « Quelle est cette case ? » → c7 ; « Quelle est cette case ? » → f8

## Chapitre 3. Couleur des cases

**Objectif :** Dire la couleur de n’importe quelle case sans la voir.

### Méthode

1. Remplace la colonne par son numéro : a=1, b=2, c=3, d=4, e=5, f=6, g=7, h=8.
2. Ajoute la rangée. Somme paire → case foncée ; somme impaire → case claire.

### Astuce

Repères à retenir : a1 est foncée et h1 claire ; la grande diagonale a1-h8 est toute foncée, la diagonale h1-a8 toute claire. Deux cases voisines sur une rangée ou une colonne n’ont jamais la même couleur.

### Exemples

- a1 : 1 + 1 = 2, paire → foncée.
- h1 : 8 + 1 = 9, impaire → claire.
- f5 : 6 + 5 = 11, impaire → claire.
- d4 : 4 + 4 = 8, paire → foncée.

### Exercices

- **3. Couleur des cases** — Une case est donnée, sans échiquier : réponds « Claire » ou « Foncée ». _Épreuve : 20 questions, au moins 19 justes, temps médian ≤ 3 s par question (par case pour les réponses à plusieurs cases)._
  - Exemples de questions : « e8 : claire ou foncée ? » → Claire ; « a7 : claire ou foncée ? » → Foncée ; « b3 : claire ou foncée ? » → Claire

## Chapitre 4. Diagonales

**Objectif :** Savoir sans échiquier si deux cases sont sur la même diagonale, et quelles cases les séparent.

### Méthode

1. Deux cases sont sur la même diagonale si l’écart de colonnes est égal à l’écart de rangées.
2. Pour citer les cases entre deux cases d’une diagonale, avance d’une colonne et d’une rangée à la fois.

### Astuce

Vérifie d’abord la couleur (chapitre 3) : deux cases de couleurs différentes ne sont jamais sur la même diagonale. Sur une diagonale qui monte vers la droite (comme a1-h8), colonne moins rangée reste constant ; sur une diagonale qui descend vers la droite (comme a8-h1), colonne plus rangée reste constant.

### Exemples

- c1 et h6 : colonnes c→h = 5, rangées 1→6 = 5 → même diagonale.
- Entre b2 et f6 : c3, d4, e5.
- c1 et h7 : écarts 5 et 6 → pas la même diagonale.

### Exercices

- **4. Diagonales** — Deux sortes de questions, sans échiquier : « c1 et h6 sont-elles sur la même diagonale ? » (Oui / Non), et « cite les cases entre b2 et f6 » (tape chaque case, puis Valider). _Épreuve : 20 questions, au moins 19 justes, temps médian ≤ 3 s par question (par case pour les réponses à plusieurs cases)._
  - Exemples de questions : « d5 et b3 sont-elles sur la même diagonale ? » → Oui ; « Cite les cases entre d3 et b1 » → c2 ; « c1 et f5 sont-elles sur la même diagonale ? » → Non

## Chapitre 5. Pièces

**Objectif :** Voir les déplacements du cavalier et du fou sans échiquier.

### Méthode

1. Cavalier : deux cases dans une direction, puis une sur le côté (un « L »). Pour lister ses cases, fais le tour : deux vers le haut puis un à gauche ou à droite, deux vers la droite puis un en haut ou en bas, et ainsi de suite.
2. Fou : il attaque une case si elle est sur sa diagonale (écart de colonnes = écart de rangées) ; ici l’échiquier est vide, rien ne le bloque.
3. Nombre de coups du cavalier : cherche les cases d’où il atteint l’arrivée en un coup, puis d’où il atteint ces cases, et ainsi de suite.

### Astuce

Le cavalier change de couleur de case à chaque coup : entre deux cases de même couleur, le nombre de coups est pair ; entre deux couleurs différentes, il est impair. Au centre, un cavalier a 8 cases ; dans un coin, 2 seulement. Piège : du coin a1 à la case voisine en diagonale b2, il faut 4 coups.

### Exemples

- ♘ en g1 : e2, f3, h3.
- ♗ en c4 : attaque f7 (écarts 3 et 3), pas f6 (écarts 3 et 2).
- ♘ de b1 à d4 : 3 coups (b1-c3-b5-d4).

### Exercices

- **5. Pièces** — Trois sortes de questions, sans échiquier : toutes les cases d’un cavalier (tape chaque case, puis Valider), « le fou attaque-t-il cette case ? » (Oui / Non), et le nombre minimum de coups d’un cavalier (1 à 6). _Épreuve : 20 questions, au moins 19 justes, temps médian ≤ 3 s par question (par case pour les réponses à plusieurs cases)._
  - Exemples de questions : « ♘ de f8 à g5 : combien de coups minimum ? » → 2 ; « ♘ en h3 : toutes ses cases ? » → f2, f4, g1, g5 ; « ♘ en h8 : toutes ses cases ? » → f7, g6

## Chapitre 6. Visualisation

**Objectif :** Suivre une suite de coups de tête, sans échiquier.

### Méthode

1. Pars de la position de départ et joue chaque coup dans ta tête, dans l’ordre. Demande-toi d’où vient chaque pièce : ♘f3 vient de g1, ♗c4 de f1, ♘c6 de b8.
2. Une prise (x) fait disparaître la pièce qui était sur la case d’arrivée.
3. La longueur se compte en demi-coups : « 1.e4 e5 » fait 2 demi-coups. On monte de 2 à 4, 6, 8, puis 12 et 16 demi-coups (8 coups complets).

### Astuce

Garde une image simple : les pions du centre, les pièces sorties et la dernière pièce jouée. Pour « est-elle défendue ? », cherche une pièce de son camp qui touche cette case : un pion défend en diagonale vers l’avant, un cavalier en « L », la dame et les fous en diagonale, la dame et les tours en ligne droite, le roi sur les cases autour de lui.

### Exemples

- Après 1.e4 e5 2.♘f3 ♘c6 : en c6, un cavalier noir ; en g1, plus rien.
- Après 1.e4 e5 2.♘f3 ♘c6 3.♗b5 : le fou en b5 n’est pas défendu.

### Exercices

- **6-2. Visualisation : 2 demi-coups** — Une suite de 2 demi-coups s’affiche, puis une question : « quelle pièce est en c6 ? » ou « la pièce en b5 est-elle défendue ? ». _Épreuve : 10 questions, au moins 9 justes._
  - Exemples de questions : « Après 1.c4 e5 : quelle pièce est en c4 ? » → Pion blanc ; « Après 1.c4 e5 : le pion noir en b7 est-il défendu ? » → Oui ; « Après 1.e4 e5 : le pion noir en b7 est-il défendu ? » → Oui
- **6-4. Visualisation : 4 demi-coups** — Pareil avec 4 demi-coups. _Épreuve : 10 questions, au moins 9 justes._
  - Exemples de questions : « Après 1.d4 d5 2.c4 e6 : quelle pièce est en d4 ? » → Pion blanc ; « Après 1.e4 e5 2.♘f3 ♘c6 : le pion blanc en e4 est-il défendu ? » → Non ; « Après 1.e4 d5 2.exd5 ♕xd5 : quelle pièce est en e8 ? » → Roi noir
- **6-6. Visualisation : 6 demi-coups** — Pareil avec 6 demi-coups. _Épreuve : 10 questions, au moins 9 justes._
  - Exemples de questions : « Après 1.e4 e5 2.♘f3 ♘c6 3.♗c4 ♗c5 : le pion blanc en c2 est-il défendu ? » → Oui ; « Après 1.e4 e5 2.♘f3 ♘c6 3.d4 exd4 : quelle pièce est en d8 ? » → Dame noire ; « Après 1.c4 e5 2.♘c3 ♘c6 3.g3 g6 : quelle pièce est en f8 ? » → Fou noir
- **6-8. Visualisation : 8 demi-coups** — Pareil avec 8 demi-coups. _Épreuve : 10 questions, au moins 9 justes._
  - Exemples de questions : « Après 1.e4 d5 2.exd5 ♕xd5 3.♘c3 ♕a5 4.♘a4 ♔d8 : le pion noir en a7 est-il défendu ? » → Oui ; « Après 1.e4 c5 2.♘f3 d6 3.d4 cxd4 4.♘c3 dxc3 : le cavalier blanc en f3 est-il défendu ? » → Oui ; « Après 1.d4 d5 2.c4 e6 3.♘c3 ♘f6 4.♗g5 ♗e7 : quelle pièce est en f8 ? » → Aucune
- **6-12. Visualisation : 12 demi-coups** — Pareil avec 12 demi-coups (6 coups complets). _Épreuve : 10 questions, au moins 9 justes._
  - Exemples de questions : « Après 1.e4 e5 2.♘f3 ♘c6 3.♗c4 ♗c5 4.c3 ♘f6 5.d3 d6 6.O-O O-O : quelle pièce est en g8 ? » → Roi noir ; « Après 1.e4 c5 2.♘f3 ♘c6 3.d4 cxd4 4.♘xd4 g6 5.♘c3 ♗g7 6.a3 ♔f8 : le pion blanc en e4 est-il défendu ? » → Oui ; « Après 1.e4 c6 2.d4 d5 3.♘c3 dxe4 4.♘xe4 ♗f5 5.♘g3 ♗g6 6.♗a6 ♗h5 : le pion blanc en d4 est-il défendu ? » → Oui
- **6-16. Visualisation : 16 demi-coups** — Pareil avec 16 demi-coups (8 coups complets). _Épreuve : 10 questions, au moins 9 justes._
  - Exemples de questions : « Après 1.e4 c5 2.♘f3 ♘c6 3.d4 cxd4 4.♘xd4 g6 5.♘c3 ♗g7 6.♗e3 ♘f6 7.♗c4 O-O 8.♘f5 ♕e8 : quelle pièce est en e1 ? » → Roi blanc ; « Après 1.d4 ♘f6 2.c4 e6 3.♘c3 ♗b4 4.e3 O-O 5.♗d3 d5 6.♘f3 c5 7.O-O ♘c6 8.a3 ♗xc3 : quelle pièce est en c4 ? » → Pion blanc ; « Après 1.e4 e6 2.d4 d5 3.♘c3 ♘f6 4.♗g5 ♗e7 5.e5 ♘fd7 6.♗xe7 ♕xe7 7.f4 a6 8.♘f3 c5 : quelle pièce est en e4 ? » → Aucune

## Chapitre 7. Aveugle

**Objectif :** Jouer une partie entière sans voir les pièces.

### Méthode

1. Rejouer de tête : une partie courte célèbre s’affiche coup par coup en notation ; joue chaque coup sur l’échiquier sans pièces (les cases restent visibles) en touchant la case de départ puis la case d’arrivée.
2. Partie à l’aveugle : contre Maia, au niveau de ton choix ; les pièces sont cachées, tu joues en touchant les cases et le coup de Maia est annoncé en texte.
3. Le bouton « Voir les pièces » montre la position 3 secondes ; chaque coup d’œil est compté.

### Astuce

Après chaque coup adverse, demande-toi : quelle pièce a bougé, d’où, et que touche-t-elle maintenant ? Répète la position à voix basse (« mon roi g1, ma tour f1… »). Au début, choisis un niveau de Maia bas : le but est de finir la partie avec peu de coups d’œil.

### Exemples

- Le coup du berger : 1.e4 e5 2.♗c4 ♘c6 3.♕h5 ♘f6 4.♕xf7#.

### Exercices

- **7a. Rejouer de tête des parties courtes** — Rejoue de tête une partie courte célèbre (le coup du berger, le mat de Légal, la partie de l’Opéra…). 
- **7b. Partie à l’aveugle contre Maia** — Partie complète contre Maia, pièces cachées. _Épreuve : finir une partie à l’aveugle avec au plus 3 coups d’œil (un abandon ne compte qu’après 30 coups joués)._

## Parties courtes à rejouer (7a)

- **Le mat du lion (mat du sot)** : 1.f3 e5 2.g4 ♕h4# — Le mat le plus rapide : la dame noire profite de la diagonale e1-h4 ouverte.
- **Le coup du berger** : 1.e4 e5 2.♗c4 ♘c6 3.♕h5 ♘f6 4.♕xf7# — La dame et le fou visent ensemble f7, protégé seulement par le roi.
- **Le mat de Légal** : 1.e4 e5 2.♘f3 d6 3.♗c4 ♗g4 4.♘c3 g6 5.♘xe5 ♗xd1 6.♗xf7+ ♔e7 7.♘d5# — Les Blancs donnent leur dame pour mater avec trois pièces mineures.
- **Le mat à l’étouffée de la Caro-Kann** : 1.e4 c6 2.d4 d5 3.♘c3 dxe4 4.♘xe4 ♘d7 5.♕e2 ♘gf6 6.♘d6# — Le roi noir, entouré de ses propres pièces, ne peut pas échapper au cavalier.
- **Le piège de Blackburne** : 1.e4 e5 2.♘f3 ♘c6 3.♗c4 ♘d4 4.♘xe5 ♕g5 5.♘xf7 ♕xg2 6.♖f1 ♕xe4+ 7.♗e2 ♘f3# — Les Blancs prennent un pion « gratuit » en e5 et se font mater par le cavalier en f3.
- **Le piège de l’Englund** : 1.d4 e5 2.dxe5 ♕e7 3.♘f3 ♘c6 4.♗f4 ♕b4+ 5.♗d2 ♕xb2 6.♗c3 ♗b4 7.♕d2 ♗xc3 8.♕xc3 ♕c1# — La dame noire prend en b2, puis mate en c1 sur la première rangée.
- **La partie de l’Opéra (Morphy, 1858)** : 1.e4 e5 2.♘f3 d6 3.d4 ♗g4 4.dxe5 ♗xf3 5.♕xf3 dxe5 6.♗c4 ♘f6 7.♕b3 ♕e7 8.♘c3 c6 9.♗g5 b5 10.♘xb5 cxb5 11.♗xb5+ ♘bd7 12.O-O-O ♖d8 13.♖xd7 ♖xd7 14.♖d1 ♕e6 15.♗xd7+ ♘xd7 16.♕b8+ ♘xb8 17.♖d8# — Développement rapide, colonnes ouvertes et sacrifices : le modèle de la partie d’attaque.
