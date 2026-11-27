# Rapport V1 — Sparring Échecs (15/11/2026)

## Choix techniques
- **Adversaire : Maia-3 via `maia3-js` 0.2.0** (plan A ; le plan B Maia-2 n'a pas servi). Modèle 5M embarqué (22,5 Mo),
  exécuté par onnxruntime-web 1.31 (build « wasm » seul, 14,8 Mo) dans un Web Worker. `selfElo` = Rbot, `oppoElo` = R,
  historique des coups transmis. Tirage selon la politique, coups < 3 % ignorés, puis renormalisation.
- **Correcteur : Stockfish 19 « lite single-threaded »** (nmrugg, 1,8 Mo) : pas besoin de COOP/COEP, que GitHub Pages ne permet pas.
  500 ms par position ; chaque coup du joueur demande 2 positions (avant/après), positions communes réutilisées.
- **Win %** : formule Lichess, cp bornés à ±1000, mats → ±10000. Chute = win% (meilleur coup) − win% (après mon coup).
- **Révision** : une carte par erreur/gaffe, 1re révision à J+1. Vérif : meilleur coup, sinon Stockfish 700 ms avant/après le coup, juste si chute ≤ 5.
- **Nulle proposée** : Maia accepte à partir du 10e coup si sa probabilité de gain (tête de valeur de Maia) est ≤ 55 %.
- **Stockage** : Dexie (IndexedDB), partie en cours sauvegardée à chaque coup. Champ `source: 'app' | 'chesscom'` + `externalId` prévus pour la V2.
- **PWA** : vite-plugin-pwa (Workbox), précache complet (≈ 40 Mo). Au 1er lancement, Maia attend la fin du précache → un seul téléchargement.

## Tests
- Unitaires (Vitest) : 17 tests (niveau, intervalles, classement, tirage Maia) ✅
- 20 parties Maia vs aléatoire dans Chromium : 20/20 terminées (mat), 0 plantage, 0 coup illégal ✅
- Parcours tactile iPad émulé (tap, glisser-déposer, coup illégal, nulle refusée, abandon, analyse, cartes, révision, stats, export, portrait) ✅
- Hors ligne (Playwright `setOffline`) : accueil, partie contre Maia, analyse Stockfish ✅ (en local ; à refaire sur l'URL publique)

## Mesures (conteneur Linux, Chromium headless, serveur local)
- Poids : 39,9 Mo non compressés ; 34,4 Mo transférés (gzip) au 1er lancement.
- Accueil affiché : ~150 ms (local). Appli prête hors ligne + Maia chargée : ~2,5 s (réseau local).
- Maia : moyenne 43 ms, médiane 42 ms, p95 57 ms, max 153 ms par coup (437 coups). +450 ms de « réflexion » minimale volontaire.
- Stockfish : profondeur ~16-17 en 500 ms ; analyse d'une partie de 30 coups ≈ 30 s.

---

# V2 — Mode Ouvertures

## Ce qui a été ajouté
- **Répertoire** stocké en PGN avec variantes (une entrée par ouverture dans IndexedDB). Pré-chargé : Système de Londres (Blancs, 7 lignes),
  Gambit Dame refusé (Noirs, 8 lignes), Défense française (Noirs, 9 lignes), ~10 coups. Ajout d'autres ouvertures : bouton
  « + Ajouter une ouverture » (nom, couleur, coups adverses imposés) ou une entrée dans `src/data/openings.ts`.
- **Validation** : légalité par chess.js (lecture du PGN, message « coup illégal « Ke3 » après 1. e4 e5 ») et perte de chacun de MES
  coups ≤ 50 cp par Stockfish (`searchmoves` : éval du meilleur coup − éval de mon coup, même position). Le pré-chargé est vérifié en
  Node à profondeur 20 (`npm run validate-repertoire`, résultat dans `docs/REPERTOIRE.md`) ; les ajouts de l'utilisateur sont vérifiés
  dans le navigateur (800 ms par recherche) et les lignes fautives sont refusées avec la raison.
- **Éditeur** : liste des lignes avec statut (✓ / ⚠ / ?), suppression, ajout en jouant les coups sur l'échiquier (« ⑂ » pour partir d'une
  ligne existante), import PGN (texte ou fichier, études Lichess multi-chapitres ; chapitres à FEN non standard ignorés), export PGN.
- **Partie à thème** : couleur de l'ouverture ; seuls les coups adverses qui définissent l'ouverture sont imposés (GDR : 1.d4 et 2.c4,
  Française : 1.e4, Londres : aucun ; un coup imposé devenu illégal est ignoré), ensuite Maia joue librement à R+50. Aucune alerte pendant
  la partie. Elle compte pour le niveau mais ne change pas l'alternance Blancs/Noirs des parties libres.
- **Revue** : première sortie du répertoire signalée (coup joué, coup prévu en flèche bleue, 📖 dans la liste des coups). Les
  transpositions sont reconnues (index par position).
- **Trous du répertoire** : si l'adversaire sort du répertoire, la position est enregistrée avec le meilleur coup Stockfish (1 s) ;
  bouton « Ajouter X au répertoire » ou « Compléter à la main » ; les trous couverts disparaissent.
- **Drill** : une carte par position du répertoire où c'est à moi de jouer (162 cartes : Londres 44, GDR 51, Française 67), mêmes intervalles
  (1re présentation → J+1, puis J+3, J+7, J+14, J+30 ; raté → J+1), correction immédiate (juste si le coup est dans le répertoire).
  Pour ne pas noyer l'accueil, 10 nouvelles positions sont introduites par jour ; le bouton « Drill » d'une ouverture en propose 10 de plus.
- **Stats par ouverture** : parties, % de victoires, sorties de répertoire (par moi / par l'adversaire), gaffes par partie.

## Tests V2
- Unitaires (Vitest, 38 au total) : lecture/écriture PGN à variantes, ajout/suppression de lignes, **forçage des coups d'ouverture**
  (GDR 1.d4 puis 2.c4, aussi après 1…Nf6 ; jamais sur mes coups ; ignoré si illégal ; Française 1.e4 seul), **détection de sortie**
  (par moi, par l'adversaire, fin de ligne, transposition), **création des cartes** (une par position à moi de jouer, sans doublon),
  légalité des 3 répertoires pré-chargés, stats par ouverture.
- Navigateur (`tests/v2.cjs`, iPad émulé) : partie à thème GDR (1.d4/2.c4 imposés, sortie 2…c6 détectée, signalée dans la revue),
  partie Française jusqu'à une sortie de l'adversaire → trou enregistré avec coup Stockfish → comblé en un geste → carte de drill créée ;
  ajout d'une ligne sur l'échiquier (acceptée), ligne 3…Qg5?? refusée (−858 cp), suppression, import PGN à variante, PGN illégal refusé,
  drill juste puis faux, stats par ouverture. V1 (`tests/e2e.cjs`), 20 parties Maia et hors ligne : toujours verts.

---

# V1.5 — Rapport pour Claude

## Ce qui a été ajouté
- **Revue** : sur chaque erreur et gaffe, champ facultatif « Ce que je pensais » (enregistré automatiquement), motif et réfutation affichés.
- **Analyse** : pour chaque erreur/gaffe, calcul et stockage des suites Stockfish (profondeur 12, 5 demi-coups) — meilleur coup
  et réfutation —, bilans matériels au bout des suites, menace « si l'adversaire rejouait », motif. Les parties analysées avant
  la V1.5 sont complétées à la génération du rapport.
- **Motifs** (règles déterministes, `src/lib/report/motifs.ts`) : mat raté (mat en ≤ 3 non joué), mat ouvert (mat contre moi
  en ≤ 3 après mon coup), menace ignorée (trait inversé sauf échec : gain ≥ 2 pts en 2 demi-coups ou mat, toujours possible après
  mon coup), pièce en prise (réfutation : gain ≥ 2 pts en 2 demi-coups), autre. Un motif principal (ordre de priorité ci-dessus),
  les autres motifs applicables sont listés en « aussi ».
- **Rapport Markdown** (`src/lib/report/buildReport.ts`, fonction pure) : définitions, résumé (niveau début → fin et après chaque
  partie, V/N/D, imprécisions/erreurs/gaffes par partie, par phase avec taux pour 10 coups, motifs, révision), 10 pires erreurs
  (FEN, plateau ASCII ma couleur en bas, dernier coup adverse, win% avant/après, meilleur coup + suite, réfutation, bilans
  matériels, menace, motif, « ce que je pensais »), 3 dernières parties perdues en PGN annoté, cartes ratées ≥ 2 fois.
- **Export** : période « depuis le dernier rapport » (défaut), « 7 derniers jours » ou « 20 dernières parties » ; boutons Copier,
  Partager (Web Share API avec fichier .md, sinon texte) et Télécharger .md. La date du rapport est mémorisée dès qu'il est
  copié, partagé ou téléchargé.

## Tests V1.5
- Unitaires : matériel, **phases** (coups 1-10, seuil 13 pts exact), plateau ASCII des deux côtés, gain en 2 demi-coups, règles des
  motifs (faits donnés), **tri des erreurs**, période, PGN annoté relisible, rapport complet.
- **Chaque motif sur une position connue avec le vrai Stockfish** (Node) : 2.Qg4?? (pièce en prise), 4.a3?? face à Nc6 attaquant
  la dame en d4 (menace ignorée), 4.d3 au lieu de Qxf7# (mat raté), 2.g4?? (mat ouvert, Qh4#), 2.Ke2 (autre), 3…Qh4?? côté Noirs.
- Navigateur (`tests/report.cjs`) : 3 parties de test jouées au toucher (mes coups choisis par Maia réglée à 600 pour imiter un
  débutant), analyse, saisie de « ce que je pensais », une carte ratée 2 fois, génération → `docs/exemple-rapport.md`,
  date mémorisée (période par défaut ensuite vide).

## Limites connues
- Les règles de motifs s'appuient sur des suites de 5 demi-coups à profondeur 12 : une tactique plus longue tombe en « Autre ».
- La vérification Stockfish du navigateur (800 ms) est moins précise qu'en Node : une ligne d'ouverture à la limite des 0,5 pion
  (ex. 3…Bb4 Winawer, −52 cp mesuré une fois) peut être refusée.

---

# Onglet « Mats élémentaires »

## Ce qui a été ajouté
- **Niveaux débloqués dans l'ordre** : 1. Dame + roi, 2. deux tours (l'échelle), 3. tour + roi (la boîte), 4. deux fous + roi ;
  5. fou + cavalier affiché « plus tard » (le moteur le gère déjà, il manque la leçon et la vérification).
- **Leçons** (`src/data/mateLessons.ts`) : la méthode en 5 étapes, sur une position rejouée coup par coup (⏮ ◀ ▶ ⏭), l'étape du
  coup courant est surlignée. Lignes calculées par Stockfish pour les deux camps (mat le plus court contre la meilleure défense)
  puis annotées ; l'échelle est écrite à la main pour montrer la tour qui s'éloigne quand le roi l'approche.
- **Exercices** : position aléatoire légale (roi noir au centre dans 80 % des cas, aucune pièce en prise, roi noir avec au
  moins 2 cases, fous de couleurs opposées), « mat en N » calculé au départ par Stockfish (plus court de « go mate 30 » et
  d'une recherche de 2,5 s ; positions en mat en ≤ 2 écartées), roi seul joué par Stockfish (500 ms, il retarde le mat au
  maximum). Pas de retour en arrière. Affichage « Coups : X / minimum N ».
- **Issue** : réussite = mat ; échec = pat, pièce perdue, règle des 50 coups (et triple répétition, ajoutée car c'est aussi une nulle).
- **Après l'exercice** : « pat frôlé » (après un de mes coups sans échec, le roi noir n'avait plus qu'un seul coup) et « pièce
  sans protection » (une de mes pièces attaquée par le roi noir et non défendue), avec les coups concernés.
- **Validation** : 3 mats d'affilée en au plus minimum + 10 coups (les rejouées du paquet ne comptent pas) → niveau suivant.
- **Positions ratées → paquet de révision** (carte « mat », mêmes intervalles) : on rejoue la position jusqu'au mat.
- Sauvegarde JSON et rapport pour Claude étendus aux exercices de mat.

## Tests
- Unitaires : 200 positions générées par niveau, toutes légales et conformes (roi noir pas en échec, rois non adjacents,
  aucune pièce en prise, fous de couleurs opposées, roi noir central dans > 65 % des cas), refus de positions illégales,
  détection du mat, du pat, de la pièce perdue et des 50 coups, alertes, validation (série de 3, limite +10), déblocage.
  Leçons : chaque ligne est légale, finit par un mat, chaque coup blanc est rattaché à une étape et chaque étape est utilisée.
- Navigateur (`tests/mates.cjs`) : seul le niveau 1 ouvert au départ, leçon rejouée jusqu'au mat, 3 exercices matés
  (mat en 7/7, 6/6, 5/5) → niveau validé et niveau 2 débloqué, dame laissée en prise → « pièce perdue » + alerte + carte,
  carte rejouée depuis la révision jusqu'au mat.
- **Vérification Stockfish** (`npm run verify-mates`, détail dans `docs/MATS.md`) : 20 positions générées par niveau, toutes
  légales ; Stockfish joue mon camp (300 ms/coup) contre Stockfish en défense (300 ms/coup). Résultat final : **80/80 matées
  dans la limite** (minimum + 10). Lors d'un premier passage, une position des deux fous (`1B6/8/K7/3B1k2/8/8/8/8 w`, mat en 16)
  avait été matée en 28 coups (limite 26) : rejouée à 1 s/coup, Stockfish la mate en 22. Le script rejoue désormais une fois
  à 1 s/coup toute position hors limite ; au passage final, aucune n'en a eu besoin (variabilité des recherches à temps fixe).

## Limites connues
- Le « minimum » est le plus court mat trouvé par Stockfish (deux recherches), pas une valeur de table de finales : il peut
  être légèrement surestimé (ex. mat en 17 trouvé par « go mate » contre 15 avec plus de temps), ce qui rend la limite un peu
  plus souple. La préparation d'un exercice prend ~3-5 s (plus sur tablette).
- Fou + cavalier (niveau 5) : affiché « plus tard ».

## Mise à jour (16/11)
- **« Pat frôlé »** : alerte seulement si, dans une position où c'était à moi de jouer, un de mes coups légaux aurait fait pat ;
  le coup piège est affiché ; au plus une alerte par exercice (position avec le plus de coups pat). Mesure sur 20 exercices
  par niveau joués par Stockfish : D+R 16 → 18, T+T 16 → 3, T+R 20 → 8, F+F 20 → 20 exercices avec alerte (ancienne → nouvelle règle).
  Avec la dame ou les fous, un coup pat existe presque toujours près du mat.
- **Positions précalculées** : 150 par niveau (`src/data/matePositions.json`), générées une fois avec Stockfish 16 natif
  (5 s par position, `scripts/precompute-mates.ts`), symétrie tirée au hasard parmi les 8 ; le générateur + Stockfish reste en secours.
  Le « mat en N » de Stockfish était surestimé pour 2/150 (D+R), 0/150 (T+T), 134/150 (T+R) et 147/150 (F+F) positions
  (jusqu'à 30 et 38 coups, au-delà des maximums théoriques 16 et 19) : la distance exacte est calculée par analyse rétrograde
  (`scripts/dtm.ts`, maximums retrouvés 10 / 7 / 16 / 19) et c'est elle que l'appli affiche ; la valeur Stockfish reste dans le JSON.
- Vérification refaite sur ces positions avec le minimum exact : **80/80 matées dans la limite** (`docs/MATS.md`).

## Mise à jour (16/11, suite)
- **Alerte « pat frôlé » supprimée** (tous niveaux). À la place, quand un exercice échoue par pat : position avant mon coup,
  mon coup (flèche rouge) et un coup correct (flèche verte) avec sa distance exacte, et le message « le roi noir n'avait plus
  aucune case et n'était pas en échec » ; bouton pour revoir la position de pat.
- **Tables exactes dans l'appli** : `public/dtm/*.dtm` (gzip, roi blanc ramené par symétrie dans le triangle a1-d1-d4 ;
  10 + 11 + 355 + 356 Ko, mises en cache hors ligne), générées une fois par `scripts/build-dtm-tables.ts`. Elles servent au
  coup correct après un pat et, pour les positions du générateur de secours, au minimum exact.
- **Leçons Dame et deux fous** : étape « Piège du pat » montrant le coup qui fait pat (Dame : Qc7 ; deux fous : Kb6, puis
  avant le mat final où 16 coups sur 17 feraient pat).
- **Limite de validation** = max(minimum + 10, 2 × minimum), plafonnée à 50 (ex. minimum 16 → 32 coups ; 19 → 38).
  Vérification Stockfish refaite : 80/80 dans la limite (`docs/MATS.md`).

## Notation à figurines (16/11)
- Partout où un coup s'affiche dans l'interface (liste des coups, revue, messages de pat et de coup correct, leçons, drill,
  éditeur de répertoire, trous) : ♔ ♕ ♖ ♗ ♘, rien pour les pions (`src/lib/notation.ts`, fonction `fig`, appliquée seulement
  à l'affichage). Le PGN, l'export JSON et le rapport pour Claude restent en notation anglaise standard.

## Réglages : niveau et couleur (16/11)
- **Mon niveau** modifiable dans Réglages (550 à 2600, « échelle de l'appli, pas celle de Chess.com ») ; après un changement,
  retour en calibration (K = 80 pour les 10 parties suivantes, via `calibrationStart` dans le profil).
- **Plancher à 550** (`RATING_MIN`) : au plus bas, Maia joue à 600 (R + 50). Rapport pour Claude : bornes 550–2600.
- **Ma couleur** : Blancs / Noirs / Alterner (défaut). En mode Alterner, la couleur change à chaque partie libre terminée
  (abandon compris) ; une partie interrompue (rechargement) reprend avec la même couleur ; les parties à thème ne comptent pas.
- Tests : unitaires (bornes, calibration après réglage, alternance, couleur fixe) et navigateur (`tests/settings.cjs`).

## Premiers essais : annulation, mode Leçon, analyse façon Chess.com (16/11)
- **Annuler la partie** : bouton pendant mes 5 premiers coups (partie supprimée, aucun effet sur le niveau ni sur la couleur
  suivante) ; après le 5e coup, seulement nulle ou abandon. **Partie non comptée** (case à cocher à l'accueil) : analysée
  normalement, sans effet sur le niveau ni sur la calibration ; la couleur alterne quand même.
- **Mode Leçon** des ouvertures (Londres, puis GDR, puis Française) : ligne principale par blocs de 3 coups avec une phrase
  par coup (mots techniques expliqués à leur 1re apparition), rejeu de chaque bloc (case surlignée puis solution), le plan en
  3 phrases, partie type jouée par Stockfish depuis la ligne principale avec moments clés commentés ; les coups appris entrent
  dans le drill. Contenu complet : `docs/LECONS-OUVERTURES.md`.
- **Revue façon Chess.com** : chaque coup (le mien et ceux de Maia) classé Meilleur / Excellent (≤ 3) / Bon (< 10) /
  Imprécision / Erreur / Gaffe / Livre ; pastille sur la case d'arrivée, icône dans la liste, barre d'évaluation, phrase
  « ♔d2 est une gaffe. Meilleur : ♕h5+ » avec flèche, bilan par catégorie pour moi et pour Maia. Le rapport pour Claude ne change pas.

## Façon Chess.com : en partie et dans la revue (16/11)
- **En partie** : navigation en lecture seule (⏮ ◀ ▶ ⏭, tap sur un coup de la liste), échiquier bloqué avec le bandeau
  « Tu revois le coup n — ⏭ pour revenir », retour par ⏭ ou un tap sur l'échiquier ; si Maia joue pendant la navigation,
  on reste sur place et ⏭ clignote (« Maia a joué »). Aucune annulation possible par ce biais. Même navigation dans les Mats.
- **Dernier coup** : « Maia a joué : ♘g4 » au-dessus de l'échiquier ; surlignage plus contrasté.
- **Sons** générés par Web Audio (aucun fichier, hors ligne, libres de droits) : coup, prise, échec, roque, fin ; réglage Sons.
- **Assistance, seulement en partie non comptée** : Indice (pièce surlignée, puis flèche), Afficher les menaces (flèches rouges :
  prises adverses gagnantes), Reprendre mon coup. Absente en partie comptée.
- **Revue** : raison dans la phrase (tirée des motifs), ex. « ♕g4 est une gaffe : le ♗c8 peut prendre ta ♕g4 (pièce laissée en
  prise). Meilleur : exd5 » ; bouton Réessayer sur mes imprécisions, erreurs et gaffes (réussi si le coup est Bon ou mieux,
  solution au 2e essai) ; courbe d'évaluation cliquable ; précision des deux camps (formule publique de Lichess) ; courbe de
  ma précision dans les Stats ; colonne Précision par partie dans le rapport pour Claude.

## Changement de cap : Anglaise, import Chess.com, rapport (23/11)
- **Nouveau répertoire** (`src/data/openings.ts`, `docs/REPERTOIRE.md`) : Blancs — Anglaise, système fermé (c4, ♘c3, g3, ♗g2,
  d3, e4 ou e3, ♘ge2, petit roque), 15 lignes contre 1…e5, 1…c5, 1…♘f6, 1…e6, 1…d5 ; Noirs — système …c5, …♘c6, …g6, …♗g7, …d6,
  29 lignes contre 1.e4 (2.♘f3 et 3.d4 : Dragon accéléré ; 2.♘c3 ; 2.c3 ; aussi 2.d4, 3.♗b5, 3.♗c4), 1.d4, 1.c4, 1.♘f3.
  Validation Stockfish 19 lite, profondeur 20 : aucun de mes coups ne perd plus de 0,5 pion (pertes max 31 et 30 cp) ;
  4 coups remplacés par le choix de Stockfish pendant la validation. Contre 2.c3, exception au système : …♘f6 (Alapin classique).
- **Archives** : Londres, GDR et Française gardent leur leçon et leur répertoire, consultables (onglet « Archives »), mais
  sortent du drill du jour, du « livre » de la revue et des parties à thème ; bouton pour les remettre dans le répertoire.
- **Leçons** des deux nouvelles ouvertures (même format), `docs/LECONS-OUVERTURES.md` régénéré.
- **Import Chess.com** (`src/lib/chesscom.ts`, `src/chesscomImport.ts`) : archives mensuelles demandées une à une avec une pause ;
  un mois passé déjà importé n'est plus jamais redemandé ; le mois en cours est revalidé par le cache du navigateur (ETag).
  Doublons évités par l'URL de la partie (aussi pour un PGN collé contenant le lien). Parties analysées une à une (les plus
  récentes d'abord), interrompables. Tests sur des réponses de l'API enregistrées (`tests/fixtures/chesscom`), sans réseau.
- **Rapport pour Claude** : colonnes Source / Adversaire / Répertoire ; niveau calculé sur les parties contre Maia seulement ;
  tableaux par source et par ouverture ; % de parties où je suis resté dans mon répertoire jusqu'au coup 8 ;
  section 2 « Mes coups les plus coûteux » (complétée par mes imprécisions s'il y a moins de 5 erreurs et gaffes) ;
  section 3 « Mes parties » (5 au plus : défaites, puis nulles, puis victoires, PGN annotés).

## Refonte visuelle (23/11)
- **Thème sombre par défaut** (fond anthracite #1f2023, cartes plus claires sans bordure fine, ombres) ; réglage
  Réglages → Apparence : Sombre / Clair / Auto (Auto suit l'appareil et bascule en direct). Le thème est appliqué avant
  l'affichage (script dans `index.html`, copie dans localStorage) ; la préférence est aussi dans la base (sauvegarde JSON).
- **Pièces** : 3 jeux libres de Lichess au choix — Celtic (par défaut, relief, MIT), Merida (GPLv2+), Cburnett (GPLv2+),
  servis avec l'appli (`public/pieces/`, précachés). Crédits : README et `public/pieces/LICENCES.txt`.
- **Échiquier** : bords arrondis, ombre, coordonnées discrètes dans les cases du bord, pièce saisie agrandie (×1,22) avec ombre ;
  promotion avec les images du jeu choisi.
- **Boutons** pleins et gras avec épaisseur en bas et enfoncement au toucher ; « Jouer » vert et grand (96 px).
- **Icônes** Lucide (ISC) à la place de tous les emojis ; pastilles de classement dessinées pour l'appli (`src/icons.tsx`).
- **Police** Inter (OFL), sous-ensemble latin local (48 Ko) ; niveau en très grand (4,2 rem), précision et classements en gras.
- **Zones tactiles ≥ 48 px** et **aucun emoji affiché** : vérifiés par `tests/appearance.cjs` (8 écrans, iPhone et iPad).
- Captures avant / après et poids ajouté (≈ 149 Ko brut, ≈ 71 Ko compressé) : `docs/design/README.md`.

## Ajustements : coordonnées et analyse des parties importées (23/11)
- **Coordonnées jamais sous les pièces** : coordonnées plus petites (≈ 15 % de la case), tout au coin, au premier plan ;
  pièces centrées à 88 % de la case, avec une marge minimale pour les coins sur les petits échiquiers (iPad : 88 % ;
  iPhone : 74 à 86 % selon le jeu, Merida étant le plus large). Arrondi de l'échiquier ramené à 6 px ; les deux seules
  coordonnées situées dans un coin arrondi (cases a8 et h1) sont un peu décalées vers l'intérieur, et la pièce de ces deux
  cases garde un peu plus de marge. Vérifié au pixel (`tests/coords.cjs`, 61 contrôles) : pièces centrées, aucune
  coordonnée rognée par l'arrondi, et pour les 12 pièces × 16 coordonnées aucun pixel de pièce sous le texte — Celtic,
  Merida, Cburnett × iPhone SE, iPhone 13 (portrait, paysage), iPad (paysage, portrait) × côté Blancs et Noirs.
- **Analyse des parties importées** : les plus récentes d'abord ; automatiquement seulement celles jouées depuis le
  16/11/2026 ; les plus anciennes restent importées sans analyse, avec un bouton « Analyser aussi les anciennes (N) ».
  Progression « Analyse : X/Y », avancement de la partie en cours et temps restant estimé (d'après la vitesse observée,
  en demi-coups analysés). Exemple sur les parties de lightning_light : 30 parties analysées automatiquement (≈ 20 min),
  138 plus anciennes à la demande.

## Maîtrise de l'échiquier (23/11)
- **7 chapitres, 17 niveaux** (`src/lib/board/levels.ts`) débloqués dans l'ordre : repères vus des Blancs (colonnes, rangées,
  trouver une case avec et sans coordonnées, nommer une case au clavier), vus des Noirs, couleur des cases, diagonales,
  pièces (cases du cavalier, fou, distance du cavalier), visualisation (2, 4, 6, 8 demi-coups), aveugle (rejouer de tête des
  parties courtes, partie contre Maia pièces cachées). Leçons (méthode + astuce + exemples) : `docs/LECONS-ECHIQUIER.md`.
- **Maîtrise** : ch. 1-2, épreuve de 30 s (≥ 25 bonnes, ≤ 1 erreur) réussie 3 fois par niveau ; ch. 3-5, 20 questions,
  ≥ 19 justes, temps médian ≤ 3 s (par case pour les réponses à plusieurs cases) ; ch. 6, 10 questions, ≥ 9 justes ;
  ch. 7, partie à l'aveugle finie avec ≤ 3 coups d'œil (abandon compté après 20 coups joués).
- **Adaptatif** : erreurs et temps par case ; faiblesse = 70 % erreurs + 30 % lenteur ; tirage pondéré (une case faible sort
  jusqu'à 7 fois plus) ; carte de chaleur. **Révisions** J+1, J+3, J+7 puis tous les 7 jours ; ratée → « à revoir ».
  **Échauffement (3 min)** à l'accueil : révisions du jour, sinon cases faibles.
- **Ergonomie** : tout au toucher (cases et touches ≥ 48 px, échiquier d'exercice en pleine largeur sur téléphone), son court
  et légère vibration sur erreur (réglage Sons), hors ligne.
- **Rapport pour Claude** : section 5 « Échiquier » (chapitres validés et révisions, meilleurs scores, 10 cases les plus faibles).
- **Tests** : `src/lib/board/*.test.ts` (questions vérifiées par des calculs indépendants et chess.js : cases, couleurs,
  diagonales, distances du cavalier ; critères ; révisions ; tirage adaptatif) et `tests/board.cjs` (parcours complet, dont une
  vraie partie à l'aveugle gagnée contre Maia avec 1 coup d'œil).

## Maîtrise de l'échiquier : ajustements (24/11)
- Ch. 6 : deux niveaux de plus, 12 et 16 demi-coups (8 coups complets) ; débuts courants allongés à 16 demi-coups.
- Ch. 7 : un abandon ne compte comme partie finie qu'après 30 de mes coups (au lieu de 20).
- 1e et 2e (nommer une case au clavier) : épreuve à 20 bonnes réponses en 30 s, au plus 1 erreur ; les autres niveaux
  des ch. 1-2 restent à 25.

## Révision « Trouve le bon coup » (24/11)
- **En haut** : d'où vient la position (Chess.com / PGN importé / Maia, adversaire et classement, date, n° du coup) et la
  consigne « Joue sur l'échiquier un meilleur coup que 4. ♔e2 ». Mon coup de la partie en **flèche rouge**, désactivable
  (réglage mémorisé).
- **Boutons** : « Indice » (1er appui : le motif en mots, ex. « Une pièce adverse n'est pas défendue : cherche une prise » ;
  2e appui : la pièce à jouer est surlignée) ; « Solution » (après 2 essais ratés ou 2 indices) ; « Passer » (la carte
  revient demain, sans essai compté). Plusieurs essais possibles ; réussie du premier coup (au plus l'indice en mots) → la
  carte avance (J+3, J+7…), sinon elle revient demain.
- **Après la réponse** : pourquoi le bon coup est bon (suite de Stockfish et bilan matériel) et pourquoi le mien l'était
  moins (motif, comme dans la revue, + la suite qui le réfute). Le détail est repris de l'analyse de la partie, ou calculé
  une fois puis enregistré.
- **Toutes mes cartes** (accueil, écran de révision) : chaque position avec un petit échiquier (coup joué en rouge, meilleur en
  vert), son origine, la prochaine révision, les essais ; « Voir la partie » ; « Supprimer » (avec confirmation). Les
  positions du répertoire se gèrent depuis le répertoire.
- **Nouveau motif « Gain raté »** : je pouvais gagner au moins 2 points de matériel (sur les 3 premiers demi-coups de la
  meilleure suite) ou mater, et mon coup ne le fait pas. Dans la revue (« tu pouvais prendre le ♗f2 avec ♔xf2 … (gain
  raté) »), les indices et le rapport pour Claude (ligne avant « Autre »). Les analyses déjà faites sont recalculées pour
  les erreurs (version 2 du détail).
- **Tests** : `src/lib/reviseText.test.ts`, motif dans `facts.test.ts` et `motifs.sf.test.ts` (vrai Stockfish sur
  1.e4 e5 2.♘f3 ♗c5 3.♘c3 ♗xf2+ 4.♔e2), `tests/revise.cjs` (parcours complet sur iPad émulé).

## Jeux de pièces : Relief, Merida, Maestro (24/11)
- **Relief** (par défaut) : créé à partir de cburnett (GPLv2+) par `scripts/make-relief.py` (script fourni, non modifié) :
  dégradés clairs/sombres et ombre portée ; fichiers dans `public/pieces/relief/`.
- **Merida** (GPLv2+) inchangé ; **Maestro** (sadsnake1, CC BY-NC-SA 4.0, licence non commerciale) repris de
  `lila/public/piece/maestro`. Crédits dans le README et `public/pieces/LICENCES.txt`.
- **Celtic supprimé** ; Cburnett retiré des réglages (il reste comme source de Relief, non précaché). Un ancien réglage
  Celtic ou Cburnett passe automatiquement à Relief.
- Pièces affichées en `<img>` : chaque SVG est un document séparé, les id internes de Relief (`L`, `D`, `sh`) ne se
  mélangent donc pas entre pièces (pas besoin de les renommer).
- Coordonnées : `tests/coords.cjs` refait pour Relief, Merida et Maestro (5 écrans × 2 côtés : pièces centrées, aucune
  coordonnée sous une pièce ni rognée). Captures : `docs/design/pieces/` (3 jeux) et `docs/design/apres/` (Relief).

## Répertoire Noirs : réponses aux sorties réelles (24/11)
- **Analyse** des 89 parties Chess.com avec les Noirs (octobre et novembre, jusqu'au 23/11) : coups par lesquels
  l'adversaire quitte mon répertoire …c5/…g6, gardés s'ils sont vus au moins 2 fois : 3.c3 (après 2.♘f3 ♘c6, 3 fois),
  1.e3, 2.d3, 2.c4, 2.♘c3 ♘c6 3.♗c4 (2 fois chacun) ; et, dans les premiers coups de toutes mes parties Noirs,
  les attaques rapides sur f7 : ♕h5 (16 parties), ♗c4 + ♕h5 (8), ♗c4 + ♕f3 (6), ♕f3 (8), ♕g3 (2), ♗b5 tôt (4).
- **12 lignes ajoutées** (~8 de mes coups chacune), toujours …c5/…g6, sans …e5 précoce : 2.♕h5 d6! (…g6 tout de suite
  perdrait c5), 2.♕f3 ♘c6 3.♗c4 ♘f6, 2.♗c4 ♘c6 3.♕f3 ♘f6 / 3.♕h5 e6!, 2.♘c3 ♘c6 3.♗c4 g6 (4.♕f3 ♘f6 … 8.♕g3) et
  3.♗b5 g6, 3.c3 ♘f6 (rejoint l'Alapin), 1.e3 c5, 2.d3 g6, 2.c4 ♘c6. Vérifiées par Stockfish 19 (profondeur 20) :
  aucun de mes coups ne perd plus de 0,5 pion (pire : 37 cp) — `docs/REPERTOIRE.md`.
- **Leçon** : bloc « Contre les attaques rapides sur f7 » (6 lignes, une phrase par coup ; regarder puis rejouer),
  accessible depuis l'écran Ouvertures et à la fin de la leçon …c5/…g6 ; les coups rejoués entrent dans le drill.
  Texte : `docs/LECONS-OUVERTURES.md`.
- **Mise à jour** du répertoire déjà enregistré : les lignes ajoutées sont fusionnées une seule fois (révision 1),
  sans toucher à mes propres modifications ; les nouvelles positions entrent dans le drill (10 nouvelles par jour).
- **Rapport pour Claude** : liste des coups par lesquels l'adversaire sort de mon répertoire, vus au moins 2 fois.

## « Ce que je pensais » en un toucher (24/11)
- Dans la revue, sur chacune de mes erreurs et gaffes, **avant** de montrer le meilleur coup (flèche verte, « Meilleur : »,
  raison et motif cachés) : 5 boutons « Je n'ai pas vu la menace » / « J'ai vu, mais mal calculé » / « Je voulais attaquer
  autre chose » / « J'ai joué trop vite » / « Je ne sais pas ». Après la réponse, tout s'affiche, avec le texte libre
  facultatif ; la réponse reste modifiable.
- Rapport pour Claude : tableau « Ce que je pensais, par motif » (réponses × motifs + « sans réponse ») ; la réponse
  apparaît aussi dans « Mes coups les plus coûteux » et en commentaire des PGN annotés.

## Import automatique et « ce que je pensais » au bon moment (27/11)
- **Import Chess.com automatique** : à chaque ouverture de l'appli avec Internet, si un pseudo est enregistré, les
  nouvelles parties sont importées sans toucher de bouton (mêmes règles : requêtes une à une, mois passés jamais
  redemandés ; pas deux imports à moins de 2 minutes). Message discret « X nouvelles parties importées » (rien s'il n'y en
  a pas, rien en cas d'erreur). Analyse comme avant (parties depuis le 16/11/2026, les plus récentes d'abord), en
  arrière-plan : une seule série à la fois pour toute l'appli, visible et arrêtable dans les Réglages, en pause pendant
  une partie contre Maia.
- **Fin d'une partie contre Maia** : avant tout autre écran, le résultat, l'analyse de mes coups, puis chacune de mes
  erreurs et gaffes : position AVANT mon coup, mon coup en flèche rouge, les 5 réponses en un toucher, PUIS le meilleur
  coup (flèche verte, raison, réfutation) et le texte libre facultatif. « Plus tard » à tout moment ; ensuite « Revoir
  la partie », « Nouvelle partie » ou « Accueil ».
- **Accueil** : badge « X erreurs à commenter » (parties importées analysées et « plus tard ») qui ouvre le même écran,
  les parties les plus récentes d'abord. Depuis le 27/11 (relecture) : seulement les parties jouées à partir du
  27/11/2026 ; les erreurs plus anciennes restent commentables dans la revue, sans badge.
- Le rapport pour Claude garde le tableau « Ce que je pensais, par motif ».

## Mise en page : tout tient dans l'écran (27/11)
- Écrans avec un échiquier (partie, revue, révision, drill, leçons, commentaires, Mats, Maîtrise de l'échiquier,
  répertoire) : l'appli prend exactement la hauteur de l'écran, sans défilement de la page. L'échiquier est un carré
  = min(largeur disponible, hauteur restante), calculé par une boîte `.board-fit` (requêtes de conteneur CSS), quels
  que soient les lignes et boutons autour.
- Portrait : l'échiquier puis une zone de texte d'au moins ~24 % de la hauteur, qui défile seule (les boutons de la
  partie et l'explication de la revue passent en tête). Paysage : échiquier à gauche, texte et boutons à droite.
- Test `tests/layout.cjs` : iPhone portrait, iPad portrait, iPad paysage × 12 écrans : page sans dépassement,
  échiquier entier, les 8 cases de la rangée du haut visibles (rien ne les recouvre), zone de texte visible.

## Système de Londres (27/11)
- **Blancs** : le Londres sort des Archives, à côté de l'Anglaise (1.d4 → Londres, 1.c4 → Anglaise). Lignes ajoutées
  contre 1…e6, 1…c5, 1…g6, 1…f5 et 1…e5 (en plus de 1…d5 et 1…Nf6). Stockfish refuse le placement du Londres contre
  1…c5 (c3 ou e3 : −0,6) : 2.d5. Contre 1…g6 : le cavalier d'abord (2.Nf3), puis Bf4. Contre l'Englund : 4.Bg5 (le
  piège : 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Bc3 Bb4 7.Qd2 Bxc3 8.Qxc3 Qc1#) ; contre 4…Qc5, 5.Be3.
- **Noirs** : nouveau « Londres en défense » contre 1.d4, 1.c4 et 1.Nf3 (…d5, …c6, …Nf6, …Bf5 avant …e6, …e6, …Bd6,
  …Nbd7, petit roque). Stockfish refuse …Bf5 quand les Blancs ont c4 et Nc3 (cxd5 cxd5 puis Qb3 gagne b7) : …e6
  d'abord ; contre g3 + Nh4, le fou va en g4. Les anciennes lignes …c5/…g6 contre 1.d4, 1.c4, 1.Nf3 passent dans les
  Archives ; contre 1.e4, …c5/…g6 reste.
- **Validation** Stockfish 19, profondeur 20 : aucun de mes coups ne perd plus de 0,5 pion (Londres 13 lignes, Londres
  en défense 17 lignes) — `docs/REPERTOIRE.md`.
- **Leçons** au même format : « Londres en défense » (ligne principale, plan, partie type) + bloc « Contre 1.c4, 1.Nf3 et
  les autres coups blancs » ; Londres : bloc « Contre les autres premiers coups noirs » (dont le piège de l'Englund).
  `docs/LECONS-OUVERTURES.md`. Drill et parties à thème (l'adversaire commence au hasard par 1.d4, 1.c4 ou 1.Nf3).
- **Mise à jour** d'un répertoire déjà enregistré : faite une seule fois, sans perdre mes propres lignes.

## « Jouer les lignes » (27/11)
- Écran Ouvertures : **1. Leçon → 2. Drill → 3. Jouer les lignes → 4. Partie à thème** (texte d'aide à jour) ; le
  bouton 3 montre les lignes validées du tour en cours (ex. « 3. Jouer les lignes (3/16) »).
- Une partie = une ligne du répertoire (une feuille de l'arbre), dans la couleur de l'ouverture. L'adversaire joue
  exactement la ligne. Mon coup doit être celui du répertoire ; un autre coup du répertoire depuis la même position
  (même début de partie, ou par transposition) est accepté et fait basculer sur sa ligne. Coup hors répertoire :
  refusé (annulé) ; 1er refus « Pas le coup de ton répertoire, réessaie. » ; 2e refus : flèche verte sur le bon coup
  et commentaire de la leçon pour ce coup (ligne principale ou blocs supplémentaires). Toute erreur rend la ligne
  « à refaire ».
- Bandeau : nom de l'ouverture · « Ligne 4/16 » · « Coup 5/11 » (mes coups dans la ligne) · « à refaire » ou ✓.
- Fin : « Ligne terminée » (+ ✓ sans erreur), le plan de la leçon (et le bloc supplémentaire qui couvre la ligne), puis
  « Continuer la partie » (Maia à mon niveau, R + 50 ; partie non comptée, enregistrée et analysée comme les autres)
  ou « Ligne suivante ». Une ligne jouée sans « Continuer la partie » n'est pas enregistrée comme partie : seules sa
  progression et ses erreurs le sont.
- Choix : d'abord les lignes « à refaire », puis les lignes jamais jouées, dans l'ordre de la leçon (ligne principale,
  lignes des blocs supplémentaires, puis l'ordre de l'arbre) ; quand toutes ont le ✓, un nouveau tour commence.
  Progression par ouverture dans IndexedDB (clé `lineProgress`, sauvegardée avec l'export JSON).
- Rapport pour Claude : section 6 « Lignes du répertoire » — par ouverture, X/Y validées et le tour ; chaque erreur de
  la période : ligne, coup attendu, coup joué, date.
- Tests : `src/lib/lineTrainer.test.ts` (ordre et choix des lignes, coups acceptés, bascule y compris par
  transposition, refus 1 et 2, compteur, commentaire de la leçon, plan) ; section du rapport ; `tests/lines.cjs` sur le
  Londres (refus, ligne à refaire reprise en premier, ✓, progression, « Continuer la partie »).

## Explorer, explications en mots, lire les menaces (27/11)
**Étape 1 — Explorer.** Bouton « Explorer » dans la revue et dans la révision (après la réponse). Je bouge librement
les pièces des deux camps ; Stockfish (~0,7 s) montre le meilleur coup du camp au trait : flèche verte pour moi, rouge
pour l'adversaire (sa meilleure réponse), avec une phrase en mots. Indicateur « Tu gagnes / Égal / Tu perds » (win%
≥ 60 / ≤ 40) et bilan matériel en mots. ◀ annule un coup, « Revenir à la position », « Quitter ». Rien n'est enregistré.

**Étape 2 — Explications sans notation.**
- « Voir la suite » remplace les suites écrites en notation (révision, revue, écran de commentaire) : la suite se
  joue sur l'échiquier coup par coup (◀ / ▶), une flèche par coup (verte pour moi, rouge pour lui) et une légende
  en mots, une phrase au plus (`src/lib/words.ts`, règles simples sans moteur) : « Son cavalier prend ton pion f7 »,
  « … : échec. », « … : il attaque ta dame et ta tour en même temps (fourchette). », « … : ta dame n'est plus
  défendue. », « … : échec et mat. ». Boutons : « Voir la bonne suite », « Voir la suite après ton coup », « Voir sa
  menace » (menace ignorée).
- « Pourquoi » : 2 phrases au plus, en mots (pièce + case), sans suite en notation (`src/lib/whyWords.ts`) ; la
  raison de la revue et les indices de la révision aussi. La notation reste derrière « Afficher la notation » (replié).
- Le rapport pour Claude garde la notation.

**Étape 3 — Lire les menaces de l'adversaire.**
- « Qu'est-ce qu'il menace ? » (revue, Explorer, et à la place de « Afficher les menaces » en partie avec
  assistance) : on donne le trait à l'adversaire (coup nul, sauf si je suis en échec) et Stockfish cherche son
  meilleur coup. Vraie menace s'il gagne au moins 20 points de win% par rapport à la position actuelle, ou un mat :
  flèche rouge + phrase en mots + « Voir la suite ». Sinon : « Pas de menace sérieuse. » (`src/lib/threat.ts`).
- Cartes « Lis la menace » : positions de mes parties (Sparring et Chess.com) juste après un coup adverse qui a
  créé une vraie menace (même critère), parée ou non ; les menaces ignorées (motif « Menace ignorée ») d'abord, puis
  les parties récentes. Tri rapide sans moteur (prise gagnante nouvelle, ou mat en 1 s'il rejouait), puis Stockfish
  confirme. Au plus 5 nouvelles cartes par jour, puis répétition espacée habituelle. La recherche se fait quand la
  file de révision est vide (pour ne pas faire attendre Stockfish pendant les autres cartes) et, discrètement, à
  l'accueil quand rien n'est à revoir.
  - Q1 : « Il vient de jouer [en mots + flèche orange]. Joue son prochain coup à sa place. » Je bouge une pièce
    adverse ; accepté : sa menace, un mat, ou un coup qui lui rapporte presque autant (10 points de moins au plus).
    Indices : 1) la pièce qui vient de bouger, 2) la case visée. « Voir sa menace » après 2 essais ratés ou 2 indices.
  - Q2 : « Maintenant pare-la » (même position, mon camp), validé comme les autres cartes (meilleur coup, ou à
    5 points près). Puis l'explication en mots avec « Voir sa menace » / « Voir la bonne suite ».
  - Réussie (la carte avance) : Q1 du premier coup avec au plus 1 indice, et Q2 du premier coup ; sinon demain.
  - Liste « Toutes mes cartes » : section « Lis la menace ».
- Rapport pour Claude : section 7 « Lecture des menaces » — Q1 (lire) et Q2 (parer) réussies / ratées, puis les
  5 dernières Q1 ratées (FEN, sa menace, coup joué à sa place) ; la révision les compte à part.
- Tests : `src/lib/words.test.ts` (légendes), `src/lib/whyWords.test.ts`, `src/lib/threat.test.ts` (coup nul,
  verdict, phrase, réponse acceptée), `src/lib/threat.sf.test.ts` (vrai Stockfish : …Nxd4, Qxf7#, rien, échec),
  `src/lib/threatCards.test.ts` (choix des positions, ordre, quota), section du rapport ; `tests/explore.cjs`
  (Explorer, « Voir la suite », « Qu'est-ce qu'il menace ? » dans la revue et Explorer, une carte « Lis la menace »
  de bout en bout, section du rapport).

## « Mon objectif » : une règle à la fois (27/11)
- Carte en haut de l'accueil. Trois objectifs dans l'ordre, un seul actif (`src/lib/goals.ts`) :
  1. **Ne rien donner** (gaffes « Menace ignorée » + « Pièce laissée en prise ») — « Avant de lâcher la pièce : après
     mon coup, quels sont SES échecs, SES prises, SES attaques ? »
  2. **Ne rien laisser passer** (« Gain raté » + « Mat raté ») — « Avant de jouer : quels sont MES échecs, MES prises,
     MES attaques ? »
  3. **Tenir mon répertoire** (sortie du répertoire par moi avant la fin de la ligne) — « Dans l'ouverture, je joue
     mes coups appris, pas des coups au feeling. »
- Mesure : mes parties analysées (Sparring et Chess.com, 10 coups à moi au moins) jouées depuis le début de
  l'objectif. Partie « propre » = aucune gaffe (≥ 30 points, motif principal) des motifs de l'objectif ; objectif 3 :
  aucune sortie du répertoire par moi (même calcul que le rapport : partie à thème → son ouverture ; importée →
  sortie enregistrée ; sinon mes ouvertures actives de la couleur).
- Carte : nom et règle en gros, « X parties propres sur les 10 dernières », une pastille par partie (verte / rouge,
  touchée → la revue), le point de départ (les 10 parties d'avant le début). « À surveiller » sous la carte : sur les
  10 dernières parties, les gaffes des autres motifs (et les sorties du répertoire).
- Maîtrisé : 7 propres sur les 10 dernières, 10 parties au moins depuis le début → message, l'objectif suivant
  devient actif (mesure depuis ce moment). Un objectif maîtrisé qui retombe à 5/10 ou moins (10 dernières parties)
  redevient actif, avec un message. État dans IndexedDB (clé `goals`), mis à jour à l'accueil et au rapport.
- Revue : chaque gaffe qui relève de l'objectif actif est marquée « Règle de l'objectif » (carte du coup + icône dans
  la liste des coups).
- Rapport pour Claude : section « Objectif en cours » en tête (objectif actif, début, X/10 avec ✓/✗, point de
  départ, objectifs maîtrisés, À surveiller).
- Tests : `src/lib/goals.test.ts` (partie propre, mesure, maîtrise, objectif suivant, retour, À surveiller), section
  du rapport ; `tests/goals.cjs` (marque dans la revue, carte, maîtrise → objectif suivant, rapport).

## Mode « Pièges d'ouverture » (27/11)
- Nouvel onglet à l'accueil (comme Mats élémentaires), 13 pièges en 3 chapitres (`src/data/traps.ts`) :
  1. **Mats rapides** : mat du berger (dame h5, dame f3, avec le fou c4), mat du fou (pions f et g), mat de Légal,
     cavalier g5 sur f7.
  2. **Dame perdue** : fourchette de cavalier en c2, clouage de la dame sur le roi (piège de l'éléphant), échec à la
     découverte (Petrov : 3…♘xe4 4.♕e2 ♘f6?? 5.♘c6+), pion empoisonné en b2.
  3. **Pièges de mes ouvertures**, choisis dans les lignes du répertoire actif : gambit Englund (Londres, 6.♗c3??
     ♗b4), Anglaise (4…♕xd5?? 5.♘xd5), mon système …c5/…g6 contre ♗c4 + ♕f3 (…g6?? ♕xf7#), Londres en défense contre
     ♘c3/f3/g4/h4 (…♘bd7?? h5 enferme le fou g6).
- Pour chaque piège : mini-leçon (2 phrases en mots, « Voir la suite » depuis le début, une règle en une phrase),
  « Défends-toi » (le bot a tendu le piège : je trouve le bon coup au moment critique ; si je tombe dedans, la suite
  se joue et s'explique) et « Punis-le » (le bot a fait la faute : je trouve le coup gagnant, puis la suite se joue).
  Coups acceptés : la liste vérifiée, ou tout coup que Stockfish juge à 10 points de win% près ; une perte de 20
  points ou plus = tombé dans le piège. Indices progressifs (en mots, puis la pièce à jouer), solution après 2 essais
  ratés ou 2 indices.
- Maîtrisé : les deux exercices réussis sans indice, deux jours différents → carte de révision espacée (kind `trap`,
  J+3, puis J+7…) : la révision enchaîne « Défends-toi » et « Punis-le ». Progression dans IndexedDB (clé `traps`).
- Vérification coup par coup avec Stockfish natif (`sh scripts/verify-traps.sh` → `docs/PIEGES.md`) : éval après
  chaque coup de la suite, chaque bonne défense tient (≤ 10 points sous le meilleur coup), la faute perd au moins
  20 points, la punition est un mat ou ≥ 75 % de gain à 10 points près du meilleur coup, chaque coup suivant du
  punisseur aussi. Les 13 pièges passent (un premier choix pour le Londres en défense, « pion b7 », a été refusé par
  la vérification et remplacé).
- Rapport pour Claude : section 8 « Pièges d'ouverture » (maîtrisés / en cours / pas commencés, détail par piège) et
  les pièges où je suis tombé dans mes vraies parties (même position, mon coup fautif).
- Tests : `src/lib/traps.test.ts` (données, verdicts, maîtrise sur deux jours, chutes dans mes parties), section du
  rapport ; `tests/traps.cjs` (leçon, un piège défendu, un piège puni, une chute, indices, maîtrise → révision,
  rapport).

## Refonte, étape 1 : mesure des motifs (27/11)
- « Pièce laissée en prise » ne regardait que 2 demi-coups de la réfutation : une fourchette avec échec (il donne
  échec, mon roi bouge, il prend) finissait en « Autre ». Le gain de l'adversaire est maintenant mesuré sur 4
  demi-coups (lui, moi, lui, moi), seuil 2 points ; même horizon pour la menace de « Menace ignorée » (et pour savoir
  si elle marche encore après mon coup). Quand la variante de Stockfish est écourtée, elle est prolongée par de
  nouvelles recherches jusqu'à l'horizon.
- « Autre » s'appelle « Erreur de position (pas de perte de matériel tout de suite) ».
- Version du détail : 3. Toutes les parties analysées sont recalculées en arrière-plan au démarrage, des plus
  récentes aux plus anciennes, une erreur après l'autre (pause pendant une partie contre Maia, reprise ensuite ;
  progression dans Réglages → Chess.com). L'objectif, son point de départ, la revue et le rapport se mettent à jour.
- Tests : `motifs.sf.test.ts` (vrai Stockfish : 4.Nb5 Qe7?? 5.Nxc7+ Kd8 6.Nxa8 = « Pièce laissée en prise »),
  `facts.test.ts` (1 pion sur 2 demi-coups, la tour sur 4), `detailRefresh.test.ts` ; `tests/motifs.cjs` (un détail
  ancien recalculé au démarrage, revue, rapport).

## Refonte, étape 2 : navigation par onglets et « Aujourd'hui » (27/11)
- Barre d'onglets en bas (iPhone et iPad, masquée sur les écrans avec échiquier pour garder l'échiquier grand) :
  **Aujourd'hui · Jouer · Ouvertures · Entraînement · Progrès**, avec des pastilles de nombre (étapes du jour
  restantes, partie en cours, cartes du jour + erreurs à commenter, messages de l'objectif). Réglages : roue dentée en
  haut d'Aujourd'hui.
- Retour = écran parent (`src/nav.ts`), avec son nom : « ‹ Pièges d'ouverture », « ‹ Entraînement »… jamais
  l'accueil d'office. Les racines des onglets n'ont pas de bouton retour ; annuler une partie ramène à « Jouer ».
- **Aujourd'hui** : chip niveau (« 900 · Maia 950 »), carte Objectif compacte (nom, règle, 10 pastilles, départ),
  « Ta séance du jour » en 5 étapes avec durée et coche — échauffement échiquier (chapitre dû), un piège non maîtrisé
  (mes ouvertures d'abord, gardé toute la journée), Lis la menace, Révision, une partie contre Maia — et un seul gros
  bouton « Continuer : <étape suivante> ». Les étapes sont cochées d'après les données (échauffement terminé, les
  deux exercices du piège faits aujourd'hui, plus de carte du jour, une partie contre Maia jouée aujourd'hui) ; la
  fin d'une étape lancée depuis Aujourd'hui propose « Retour à Aujourd'hui ». Liens : erreurs à commenter, partie libre.
- **Révision plafonnée** : 15 par jour par défaut (Réglages : 10 / 15 / 25 / sans limite) ; d'abord les cartes des
  motifs de l'objectif, puis Lis la menace, puis les plus anciennes ; le reste attend les jours suivants (compteur
  dans Entraînement). Le drill d'une ouverture n'est pas plafonné.
- **Jouer** : couleur (Blancs / Noirs / Alterner), interrupteur « Partie comptée / Partie non comptée », reprendre la
  partie en cours, raccourcis « Jouer les lignes » et « Partie à thème » par ouverture. **Entraînement** : révision,
  Lis la menace, pièges, mats, échiquier, échauffement, erreurs à commenter, toutes mes cartes. **Progrès** : objectif
  en détail (les 3 objectifs, les parties depuis le début de l'objectif), statistiques et parties, rapport.
- Style : une seule action principale par écran (bouton vert à relief **#4a9a33**, texte blanc gras ≥ 18 px) ; le
  reste en cartes plates ; cibles ≥ 44 px. Identité gardée (anthracite, vert, pièces Relief, Inter).
- Tests : `src/lib/dailyPlan.test.ts` (plafond et priorités, étapes, piège du jour) ; `tests/today.cjs` (chip,
  séance, couleurs et tailles, retour au parent, étape cochée au retour, plafond réglable, onglets) ; les tests
  existants passent par les onglets.

## Refonte, étape 3 : page d'une ouverture (27/11)
- Ouvertures › une ouverture : page à onglets **Leçon / Lignes / Carrefours / Pièges**, en-tête
  « Leçon x/y · Lignes x/y · Carrefours x/y ». Retour = parent (« ‹ Londres en défense » depuis la leçon ou les lignes).
- **Leçon** : sommaire (blocs de la ligne principale, Le plan, La partie type, lignes supplémentaires groupées par
  bloc) avec statut fait / en cours / pas commencé et compteurs (rejoué, erreurs, tours en boucle) ; carte
  « Reprendre où je me suis arrêté » (bloc + étape + coup enregistrés) ; chaque bloc : Regarder · Rejouer · ↻ en
  boucle (le bloc recommence seul, tour n et erreurs comptés, jusqu'à « Arrêter la boucle »). Dans un bloc : ◀ ▶ et
  « Recommencer ce bloc » ; les coups d'avant le bloc sont déjà placés. État dans IndexedDB (`lessonState:<id>`),
  écritures en file (aucune ne s'écrase).
- **Lignes** : arbre groupé par carrefours (positions où son coup change ma réponse), chaque nœud « son coup → mon
  coup » ; nom de ligne : celui de la leçon, sinon le coup-panneau (ex. « 2.♘c3 »). Filtres Toutes / À refaire /
  Jamais jouées / Validées ; par ligne : statut, Jouer, ↻ en boucle, case à cocher. Barre du bas : « Entraîner la
  sélection », départ « au carrefour » (les coups d'avant sont joués tout de suite) ou « au 1er coup », option « En
  boucle ». Fin de ligne : « Rejouer cette ligne », « Ligne suivante de la sélection », « Continuer la partie ». Une
  ligne validée se rejoue à volonté ; une erreur la repasse « À refaire ».
- **Carrefours** : la liste des carrefours et de leurs coups-panneaux (l'exercice arrive avec le mode Carrefours).
  **Pièges** : les pièges de cette ouverture (Englund et pion b2 pour le Londres, etc.).
- Partout : un exercice réussi se refait depuis sa liste, avec **Refaire** et **Suivant** en fin d'exercice
  (pièges, mats élémentaires, maîtrise de l'échiquier).
- Tests : `src/lib/crossroads.test.ts` (carrefours, arbre, noms), `src/lib/lessonPlan.test.ts` (sommaire, statuts) ;
  `tests/opening.cjs` (en-tête, sommaire, Rejouer, boucle, Recommencer, reprise, sélection au carrefour, Rejouer cette
  ligne, erreur → à refaire, pièges, Refaire / Suivant).

## Refonte, étape 4 : mode Carrefours et « Les deux camps » (27/11)
- **Carrefour** : position où l'adversaire a au moins 2 coups dans mon arbre ; une carte par **coup-panneau** (109
  cartes sur le répertoire actif : Anglaise 25, Londres 17, …c5/…g6 43, Londres en défense 24).
- Exercice (Ouvertures › une ouverture › Carrefours › « Entraîner les carrefours ») : la position juste après son
  coup (dernier coup surligné, flèche orange, son coup en mots). Q1 « Sur quelle ligne es-tu ? » (choix parmi les lignes
  de ce carrefour : nom de la leçon, sinon le coup-panneau) ; Q2 : je joue mon coup (tout coup de mon répertoire à cette
  position est accepté). Indices : 1) la pièce qui a bougé surlignée + « Que vise-t-elle ? » ; 2) la phrase-panneau.
  Fin : la phrase-panneau, « Refaire » et « Suivant ».
- **Phrase-panneau** (une par coup-panneau, `src/lib/signposts.ts`) : ce que son coup change → ma réponse, ex. « Il
  attaque ton pion d5 → tu le soutiens : …c6 ». Règles simples sur la position (prise, échec, attaque nouvelle d'une
  pièce ou d'un pion du centre, développement, fianchetto, centre ; de mon côté : je prends, je mets à l'abri, je
  soutiens / défends, je bloque son attaque, je pare l'échec, j'attaque…). Toutes dans **docs/CARREFOURS.md** pour
  relecture (`scripts/crossroads-doc.ts`).
- Répétition espacée par carte (réussie = bonne ligne, bon coup du premier coup, sans indice : J+3, J+7… ; sinon
  demain) ; file du jour : cartes échues puis 8 nouvelles ; progression sur la page de l'ouverture (états nouvelle / en
  cours / à revoir / maîtrisée, « Carrefours x/y » dans l'en-tête).
- **« Les deux camps »** (onglet Lignes, case à cocher) : je rejoue la ligne en jouant AUSSI les coups adverses de
  mémoire (départ au carrefour ou au 1er coup) ; un autre coup adverse de mon arbre fait changer de ligne ; erreurs
  comptées des deux côtés (« Erreurs : 0 de ton côté, 1 du sien »), et la ligne repasse « à refaire ».
- Tests : `src/lib/crossroadTrainer.test.ts` (file, choix de ligne, coups acceptés, répétition espacée),
  `src/lib/signposts.test.ts` ; `tests/crossroads.cjs` (cartes, Q1 / Q2, indices, répétition espacée, progression, les
  deux camps).

## Refonte, étape 5 : leçons complètes (27/11)
- **Lignes du répertoire actif sans explication** : 66 lignes (Anglaise 14, Londres 12, …c5/…g6 24, Londres en
  défense 16), soit 924 coups (les deux camps) qui n'avaient pas de « pourquoi » dans une leçon. Liste et contenu :
  **docs/LECONS-OUVERTURES.md** (tableau « Lignes complétées » puis, pour chaque ouverture, « 6. Les autres lignes,
  par carrefour »).
- Chaque ligne commence là où elle quitte ce qui est déjà expliqué (les coups d'avant sont joués d'office, comme les
  blocs supplémentaires) ; **un « pourquoi » à chaque coup** : l'explication déjà écrite pour la même position quand il
  y en a une (transposition), sinon une phrase calculée sur la position (`src/lib/moveWhy.ts` : roque, prise / reprise,
  clouage et déclouage, échec, pion qui prend le centre / prépare un fianchetto / contrôle g4 / prépare d4, avant-poste,
  grande diagonale, colonne ouverte, idée Qd2 + Bh6 contre un fianchetto…).
- **Une phrase de plan à la fin de chaque ligne** (`src/data/linePlans.ts`, écrite à la main d'après la suite
  conseillée par Stockfish 19, profondeur 16, sur la position finale) ; montrée à la fin de « Regarder », après
  « Ligne réussie », et en tête du plan dans « Jouer les lignes ».
- **Rangées par carrefour** : un bloc « Carrefour après 1.c4 e5 2.Nc3 » par carrefour (le dernier où la ligne quitte
  ce qui est expliqué) ; 37 blocs, après les blocs écrits à la main, dans le sommaire de la leçon. Génération :
  `npm run lesson-lines` (`scripts/lesson-lines.ts` → `src/data/lessonLines.ts`).
- **Stockfish** : répertoire revérifié (`npm run validate-repertoire`, profondeur 20, docs/REPERTOIRE.md) ; aucun coup
  ne change.
- Tests : `src/lib/moveWhy.test.ts` ; `src/data/openingLessons.test.ts` (chaque coup de chaque ligne du répertoire
  actif a un « pourquoi », chaque ligne ajoutée est dans l'arbre, mes coups sont dans le drill, une phrase de plan,
  rangement par carrefour) ; `tests/lessons-full.cjs` (sommaire par carrefour, une ligne regardée coup par coup, son plan,
  rejouée, ✓).
