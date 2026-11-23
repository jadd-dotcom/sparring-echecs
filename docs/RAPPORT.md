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
  pièces à 88 % de la case, avec une marge minimale pour les coins sur les petits échiquiers (iPad : 88 % ; iPhone : 74 à 86 %
  selon le jeu, Merida étant le plus large). Vérifié au pixel (`tests/coords.cjs`) : les 12 pièces × 16 coordonnées,
  sans aucun pixel de pièce sous le texte, pour Celtic, Merida et Cburnett, sur iPhone SE, iPhone 13 (portrait et paysage)
  et iPad (paysage et portrait), côté Blancs et côté Noirs.
- **Analyse des parties importées** : les plus récentes d'abord ; automatiquement seulement celles jouées depuis le
  16/11/2026 ; les plus anciennes restent importées sans analyse, avec un bouton « Analyser aussi les anciennes (N) ».
  Progression « Analyse : X/Y », avancement de la partie en cours et temps restant estimé (d'après la vitesse observée,
  en demi-coups analysés). Exemple sur les parties de lightning_light : 30 parties analysées automatiquement (≈ 20 min),
  138 plus anciennes à la demande.
