// Leçons du mode « Maîtrise de l'échiquier » : une méthode et une astuce par chapitre, et ce que demande chaque exercice.
// Le contenu est repris tel quel dans docs/LECONS-ECHIQUIER.md (npm run board-doc).

export interface BoardLesson {
  chapter: number;
  goal: string;                 // une phrase : ce que tu sauras faire
  method: string[];             // la méthode, pas à pas
  tip: string;                  // l'astuce
  examples: string[];           // exemples corrigés
  exercises: Record<string, string>;   // niveau → consigne
}

export const BOARD_LESSONS: BoardLesson[] = [
  {
    chapter: 1,
    goal: 'Trouver et nommer n’importe quelle case sans réfléchir, l’échiquier vu des Blancs.',
    method: [
      'Vu des Blancs, les colonnes vont de a (à gauche) à h (à droite) et les rangées de 1 (en bas, ton côté) à 8 (en haut).',
      'Une case se nomme toujours colonne puis rangée : e4 = colonne e, rangée 4.',
      'Pour trouver une case : repère d’abord la colonne, puis compte les rangées depuis ton côté.',
    ],
    tip: 'Coupe l’échiquier en deux : colonnes a-d à gauche (côté de la dame), e-h à droite (côté du roi) ; rangées 1-4 chez toi, 5-8 chez l’adversaire. Le roi blanc part de e1, la dame de d1 : d et e sont les deux colonnes du milieu.',
    examples: ['e4 : colonne e (la 5e depuis la gauche), rangée 4 (la 4e depuis le bas).', 'b7 : 2e colonne depuis la gauche, 2e rangée depuis le haut.'],
    exercises: {
      '1a': 'Une colonne est demandée (« touche la colonne e ») : touche n’importe quelle case de cette colonne. Coordonnées cachées.',
      '1b': 'Une rangée est demandée (« touche la rangée 6 ») : touche n’importe quelle case de cette rangée. Coordonnées cachées.',
      '1c': 'Une case est demandée : touche-la. Les coordonnées sont affichées sur le bord.',
      '1d': 'Une case est demandée : touche-la. Les coordonnées sont cachées.',
      '1e': 'Une case est surlignée : tape sa colonne (a-h) puis sa rangée (1-8).',
    },
  },
  {
    chapter: 2,
    goal: 'Les mêmes repères quand tu joues les Noirs, échiquier retourné.',
    method: [
      'Vu des Noirs, tout est retourné : la colonne a est à droite et la h à gauche ; la rangée 8 est en bas (ton côté) et la 1 en haut.',
      'Le nom d’une case ne change pas : e4 reste e4, seule sa place à l’écran change.',
      'Pour trouver une case : colonne d’abord (en comptant depuis la droite pour a, b, c…), puis rangée (en comptant depuis le haut pour 1, 2, 3…).',
    ],
    tip: 'Garde un point fixe : les rois sont toujours sur la colonne e, et chaque dame commence sur sa couleur (d8, case foncée, pour la dame noire). Vu des Noirs, le roi est donc à gauche de la dame.',
    examples: ['e5 vu des Noirs : 4e colonne depuis la gauche (h, g, f, e), 4e rangée depuis le bas (8, 7, 6, 5).', 'a1 vu des Noirs : la case en haut à droite.'],
    exercises: {
      '2c': 'Une case est demandée : touche-la. Échiquier vu des Noirs, coordonnées affichées.',
      '2d': 'Une case est demandée : touche-la. Échiquier vu des Noirs, coordonnées cachées.',
      '2e': 'Une case est surlignée, échiquier vu des Noirs : tape sa colonne puis sa rangée.',
    },
  },
  {
    chapter: 3,
    goal: 'Dire la couleur de n’importe quelle case sans la voir.',
    method: [
      'Remplace la colonne par son numéro : a=1, b=2, c=3, d=4, e=5, f=6, g=7, h=8.',
      'Ajoute la rangée. Somme paire → case foncée ; somme impaire → case claire.',
    ],
    tip: 'Repères à retenir : a1 est foncée et h1 claire ; la grande diagonale a1-h8 est toute foncée, la diagonale h1-a8 toute claire. Deux cases voisines sur une rangée ou une colonne n’ont jamais la même couleur.',
    examples: ['a1 : 1 + 1 = 2, paire → foncée.', 'h1 : 8 + 1 = 9, impaire → claire.', 'f5 : 6 + 5 = 11, impaire → claire.', 'd4 : 4 + 4 = 8, paire → foncée.'],
    exercises: { '3': 'Une case est donnée, sans échiquier : réponds « Claire » ou « Foncée ».' },
  },
  {
    chapter: 4,
    goal: 'Savoir sans échiquier si deux cases sont sur la même diagonale, et quelles cases les séparent.',
    method: [
      'Deux cases sont sur la même diagonale si l’écart de colonnes est égal à l’écart de rangées.',
      'Pour citer les cases entre deux cases d’une diagonale, avance d’une colonne et d’une rangée à la fois.',
    ],
    tip: 'Vérifie d’abord la couleur (chapitre 3) : deux cases de couleurs différentes ne sont jamais sur la même diagonale. Sur une diagonale qui monte vers la droite (comme a1-h8), colonne moins rangée reste constant ; sur une diagonale qui descend vers la droite (comme a8-h1), colonne plus rangée reste constant.',
    examples: ['c1 et h6 : colonnes c→h = 5, rangées 1→6 = 5 → même diagonale.', 'Entre b2 et f6 : c3, d4, e5.', 'c1 et h7 : écarts 5 et 6 → pas la même diagonale.'],
    exercises: { '4': 'Deux sortes de questions, sans échiquier : « c1 et h6 sont-elles sur la même diagonale ? » (Oui / Non), et « cite les cases entre b2 et f6 » (tape chaque case, puis Valider).' },
  },
  {
    chapter: 5,
    goal: 'Voir les déplacements du cavalier et du fou sans échiquier.',
    method: [
      'Cavalier : deux cases dans une direction, puis une sur le côté (un « L »). Pour lister ses cases, fais le tour : deux vers le haut puis un à gauche ou à droite, deux vers la droite puis un en haut ou en bas, et ainsi de suite.',
      'Fou : il attaque une case si elle est sur sa diagonale (écart de colonnes = écart de rangées) ; ici l’échiquier est vide, rien ne le bloque.',
      'Nombre de coups du cavalier : cherche les cases d’où il atteint l’arrivée en un coup, puis d’où il atteint ces cases, et ainsi de suite.',
    ],
    tip: 'Le cavalier change de couleur de case à chaque coup : entre deux cases de même couleur, le nombre de coups est pair ; entre deux couleurs différentes, il est impair. Au centre, un cavalier a 8 cases ; dans un coin, 2 seulement. Piège : du coin a1 à la case voisine en diagonale b2, il faut 4 coups.',
    examples: ['♘ en g1 : e2, f3, h3.', '♗ en c4 : attaque f7 (écarts 3 et 3), pas f6 (écarts 3 et 2).', '♘ de b1 à d4 : 3 coups (b1-c3-b5-d4).'],
    exercises: { '5': 'Trois sortes de questions, sans échiquier : toutes les cases d’un cavalier (tape chaque case, puis Valider), « le fou attaque-t-il cette case ? » (Oui / Non), et le nombre minimum de coups d’un cavalier (1 à 6).' },
  },
  {
    chapter: 6,
    goal: 'Suivre une suite de coups de tête, sans échiquier.',
    method: [
      'Pars de la position de départ et joue chaque coup dans ta tête, dans l’ordre. Demande-toi d’où vient chaque pièce : ♘f3 vient de g1, ♗c4 de f1, ♘c6 de b8.',
      'Une prise (x) fait disparaître la pièce qui était sur la case d’arrivée.',
      'La longueur se compte en demi-coups : « 1.e4 e5 » fait 2 demi-coups. On monte de 2 à 4, 6, puis 8 demi-coups.',
    ],
    tip: 'Garde une image simple : les pions du centre, les pièces sorties et la dernière pièce jouée. Pour « est-elle défendue ? », cherche une pièce de son camp qui touche cette case : un pion défend en diagonale vers l’avant, un cavalier en « L », la dame et les fous en diagonale, la dame et les tours en ligne droite, le roi sur les cases autour de lui.',
    examples: ['Après 1.e4 e5 2.♘f3 ♘c6 : en c6, un cavalier noir ; en g1, plus rien.', 'Après 1.e4 e5 2.♘f3 ♘c6 3.♗b5 : le fou en b5 n’est pas défendu.'],
    exercises: {
      '6-2': 'Une suite de 2 demi-coups s’affiche, puis une question : « quelle pièce est en c6 ? » ou « la pièce en b5 est-elle défendue ? ».',
      '6-4': 'Pareil avec 4 demi-coups.',
      '6-6': 'Pareil avec 6 demi-coups.',
      '6-8': 'Pareil avec 8 demi-coups.',
    },
  },
  {
    chapter: 7,
    goal: 'Jouer une partie entière sans voir les pièces.',
    method: [
      'Rejouer de tête : une partie courte célèbre s’affiche coup par coup en notation ; joue chaque coup sur l’échiquier sans pièces (les cases restent visibles) en touchant la case de départ puis la case d’arrivée.',
      'Partie à l’aveugle : contre Maia, au niveau de ton choix ; les pièces sont cachées, tu joues en touchant les cases et le coup de Maia est annoncé en texte.',
      'Le bouton « Voir les pièces » montre la position 3 secondes ; chaque coup d’œil est compté.',
    ],
    tip: 'Après chaque coup adverse, demande-toi : quelle pièce a bougé, d’où, et que touche-t-elle maintenant ? Répète la position à voix basse (« mon roi g1, ma tour f1… »). Au début, choisis un niveau de Maia bas : le but est de finir la partie avec peu de coups d’œil.',
    examples: ['Le coup du berger : 1.e4 e5 2.♗c4 ♘c6 3.♕h5 ♘f6 4.♕xf7#.'],
    exercises: {
      '7a': 'Rejoue de tête une partie courte célèbre (le coup du berger, le mat de Légal, la partie de l’Opéra…).',
      '7b': 'Partie complète contre Maia, pièces cachées.',
    },
  },
];

export const lessonOf = (chapter: number) => BOARD_LESSONS.find((l) => l.chapter === chapter)!;
