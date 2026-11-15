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
- **Drill** : une carte par position du répertoire où c'est à moi de jouer (154 cartes pour les 3 ouvertures), mêmes intervalles
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
