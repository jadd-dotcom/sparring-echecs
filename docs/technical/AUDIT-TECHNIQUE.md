# Audit technique et pédagogique — Sparring Échecs

Mission P1-01, 28/11/2026. Dépôt `jadd-dotcom/sparring-echecs`, `main` sur `61afd16`. Aucune ligne de code modifiée.

Conventions : chaque constat renvoie à `fichier:ligne` (chemins relatifs à la racine du dépôt) ou à une commande exécutée.
« Mesuré » = résultat d'un script temporaire exécuté hors du dépôt (Node 22, ce conteneur, 4 cœurs). « Hypothèse » = déduit
du code sans vérification à l'exécution. « Non vérifié » = pas pu être vérifié. Le design et l'ergonomie ne sont pas évalués
(audit séparé de Codex).

---

## 0. Synthèse (une page, sans jargon)

L'appli est riche et fonctionne : 39 fichiers de tests unitaires, 439 tests qui passent, une analyse automatique de chaque
partie, et une douzaine de modes d'entraînement qui marchent hors ligne. Elle est pensée pour un joueur qui apprend seul.
Ses limites tiennent moins à la quantité de contenu qu'à la façon de **mesurer ce qui est vraiment acquis** et de **choisir
quoi travailler**.

**5 forces à préserver**
1. **On s'entraîne sur ses propres fautes.** Chaque erreur ou gaffe d'une partie devient un exercice à rejouer
   (`src/analysis.ts:125-137`). Les positions où l'on a ignoré une menace deviennent des exercices « Lis la menace »,
   confirmés par Stockfish (`src/lib/threatCards.ts:47-85`, `src/lib/threat.ts:62-79`).
2. **La sécurité des pièces est déjà au cœur.** Le premier objectif s'appelle « Ne rien donner » (menace ignorée, pièce en
   prise : `src/lib/goals.ts:22`), et les cartes de ce motif passent en tête de la révision (`src/lib/dailyPlan.ts:20-28`).
3. **Une réussite doit être autonome pour compter.** Dans la plupart des modes, une carte n'avance que si elle est réussie
   du premier coup avec au plus un indice (`src/screens/ReviseMistake.tsx:57`, `src/screens/ReviseThreat.tsx:67`,
   `src/screens/CrossroadTrainer.tsx:90`). Les pièges distinguent même une réussite « propre » (`src/TrapExercise.tsx:51-54`).
4. **Le contenu d'ouvertures est vérifié.** Chaque coup du répertoire est vérifié par Stockfish (perte ≤ 0,5 pion,
   `src/data/openings.test.ts:52`, `:119`), et les leçons sont testées (137 tests dans `src/data/openingLessons.test.ts`).
5. **Tout tourne sur l'appareil, même hors ligne.** Maia et Stockfish sont embarqués (`scripts/copy-assets.mjs:7-9`), tout est
   précaché (`vite.config.ts:33-39`) et aucune donnée ne quitte l'iPad, sauf l'import Chess.com à la demande.

**5 faiblesses principales**
1. **Pas de notion commune de « maîtrisé ».** Chaque mode a ses propres états. Certaines réussites assistées comptent quand
   même : un bloc de leçon est « fait » malgré des erreurs (`src/lib/lessonPlan.ts:48`), et « Refaire » peut faire avancer une
   carte de carrefour ratée (`src/screens/CrossroadTrainer.tsx:73-90`).
2. **Les ouvertures s'apprennent dans un ordre fixe, contre un adversaire qui ne dévie jamais.** Aucun mélange, aucune position
   au hasard (`src/lib/lineTrainer.ts:32-63`, `src/screens/PlayLines.tsx:121-126`). Rien ne mesure ce que je fais **après** la
   sortie du répertoire.
3. **La séance du jour est toujours la même** : 5 étapes fixes (`src/lib/dailyPlan.ts:75-87`). Elle s'adapte peu : seul l'ordre
   des cartes change. Aucune priorité de « coach » n'est calculée ni expliquée, et le diagnostic est délégué à Claude par le
   rapport (`src/lib/report/buildReport.ts:395`).
4. **Il manque les indicateurs qui comptent pour progresser** : pièces données par partie, réussite sans aide, rappel à
   30 jours, réussite sur positions nouvelles. Le niveau de l'appli n'a aucun lien calculé avec l'Elo Chess.com Rapid visé
   (`src/screens/Settings.tsx:84`).
5. **Les données sont fragiles.** L'import remplace tout sans contrôle de version (`src/db.ts:244-258`). Aucun test ne couvre la
   sauvegarde, la restauration ni les migrations (aucun test n'importe `src/db.ts`, voir §3).

**3 risques**
1. **Perte de la progression** : elle n'existe que dans le navigateur de l'iPad (`src/db.ts:194-219`), sans demande de stockage
   persistant, avec un import destructeur (R-01, R-02 de `docs/project/RISKS.md`).
2. **Apprendre des explications inexactes** : 24 des 31 phrases « la colonne X s'ouvre pour tes tours » décrivent une colonne
   seulement semi-ouverte (mesuré, §4.11).
3. **Casser la progression pendant la refonte** : 27 clés de progression non typées (§2) et des services d'accès aux données
   sans aucun test (§3).

---

## 1. Architecture

### 1.1 Organisation de `src/`
Volume mesuré par `wc -l` sur les fichiers hors tests : 19 786 lignes, dont `src/data/lessonLines.ts` (4 770 lignes, généré)
et `src/data/openingLessons.ts` (653).

| Dossier | Rôle | Exemples |
|---|---|---|
| `src/screens/` (27 fichiers) | écrans routés | `Play.tsx`, `Review.tsx`, `Revise.tsx`, `OpeningPage.tsx` |
| `src/*.tsx` | composants partagés | `Board.tsx`, `TabBar.tsx`, `TrapExercise.tsx`, `MateExercise.tsx` |
| `src/*Service.ts`, `src/openings.ts`, `src/game.ts`, `src/analysis.ts` | accès aux données et orchestration | `trapService.ts`, `boardService.ts`, `sessionService.ts` |
| `src/lib/` | logique pure (la plus testée) | `rating.ts`, `srs.ts`, `dailyPlan.ts`, `moveWhy.ts`, `report/` |
| `src/data/` | contenus et données précalculées | `openings.ts`, `openingLessons.ts`, `traps.ts`, `matePositions.json` |
| `src/engines/` | moteurs | `stockfish.ts`, `maia.ts`, `maia.worker.ts` |
| `scripts/` | génération et vérification hors ligne | `validate-repertoire.ts`, `lesson-lines.ts`, `signpost-threats.ts` |

### 1.2 Dépendances et flux de données
- **Navigation** : routage par le fragment d'URL (`src/router.ts:30-70`). `src/App.tsx:1-28` importe statiquement les 27 écrans,
  donc il n'y a aucun découpage du code (voir §1.6).
- **Démarrage** : `ensureOpenings()` et `loadPrefs()` (`src/App.tsx:48`), puis l'import Chess.com automatique et le recalcul
  des détails en tâche de fond (`src/App.tsx:50-58`). L'analyse de fond se met en pause pendant une partie
  (`src/App.tsx:38-42`).
- **Flux d'une partie** :
  1. `src/screens/Play.tsx` joue la partie ; la partie en cours est sauvegardée à chaque coup (`meta.current`) ;
  2. `finishGame` enregistre la partie et met à jour le niveau (`src/game.ts:58-79`) ;
  3. `analyseGame` évalue chaque position, crée les cartes et calcule les motifs (`src/analysis.ts:114-139`) ;
  4. les cartes alimentent la révision et la séance du jour (`src/sessionService.ts:44-55`, `src/openings.ts:176-222`).
- **Accès aux données dispersé** : 24 écrans ou composants importent `db` directement (commande
  `grep -ln "from '\.\./db'\|from '\./db'"`). Les écritures en base sont réparties entre les services **et** les écrans (§6).
- **Crochets de test en production** : `src/selftest.ts:81` expose `__db`, `__selftest`, `__sfBench`… sur `globalThis`. Ce
  module est importé par `src/App.tsx:30`, donc présent dans le bundle publié. Les tests Playwright s'en servent
  (ex. `tests/settings.cjs:14-15`).

### 1.3 Moteurs
**Stockfish 19 lite, un seul fil** (`src/engines/stockfish.ts`)
- Un seul worker, créé à la demande (`:19-28`), avec une table de hachage de 32 Mo (`:48`).
- Les recherches sont **sérialisées** dans une file de promesses (`:96-97`) : une analyse de fond retarde l'indice demandé en
  partie (hypothèse sur l'effet ressenti).
- **Aucune annulation** : la commande UCI `stop` n'est jamais envoyée (grep `'stop'` sans résultat dans `src/`). Une recherche
  lancée va jusqu'au bout (`movetime` ou profondeur).
- **Aucune gestion d'erreur du worker** : pas de `onerror` ni de délai maximal (grep sans résultat). Si le worker plante, les
  promesses en attente ne se résolvent jamais (hypothèse, non vérifié).
- Usages : 500 ms par position pour l'analyse (`src/analysis.ts:9`), 700 ms pour juger une réponse en révision
  (`src/screens/ReviseMistake.tsx:75-76`, `src/screens/Review.tsx:151-152`, `src/TrapExercise.tsx:63`), profondeur 12 pour le
  détail des erreurs (`src/lib/report/motifs.ts:91`).

**Maia-3, variante 5m** (`src/engines/maia.ts`, `src/engines/maia.worker.ts`)
- Le modèle (22,5 Mo, `public/vendor/maia3_5m.onnx`) est lu d'abord dans le précache du service worker, sinon téléchargé
  avec 3 essais (`src/engines/maia.worker.ts:16-23`) ; inférence sur 1 fil (`:38`).
- Les appels sont corrélés par identifiant (`src/engines/maia.ts:36-42`). Il n'y a ni annulation ni délai maximal.
- **Aucun repli** si Maia échoue : la partie affiche « Erreur de Maia » et propose de recharger la page
  (`src/screens/Play.tsx:114-116`, `:127`).
- Le coup est tiré au hasard selon les probabilités de Maia ; les coups sous 3 % sont ignorés (`src/lib/maiaPick.ts`, testé
  dans `src/lib/logic.test.ts:93-104`).

### 1.4 PWA et hors ligne
- Mise à jour **automatique** du service worker (`vite.config.ts:14`, `src/main.tsx:7`).
- Précache de tous les fichiers, modèle Maia et `.wasm` compris (`vite.config.ts:35`). Résultat du build : 62 entrées,
  40 490 KiB (`npm run build`).
- Le chargement de Maia attend la fin de l'installation du précache pour éviter un double téléchargement (`src/offline.ts:31-55`).
- Test hors ligne Playwright : `tests/offline.cjs` (résultat au §3.3).

### 1.5 Performances mesurées
**Bundle** (`npm run build`)

| Fichier | Taille | gzip |
|---|---|---|
| `index-*.js` (toute l'appli, 27 écrans) | 1 063 kB | 306 kB |
| `ort-wasm-simd-threaded-*.wasm` (runtime ONNX) | 14 849 kB | 3 837 kB |
| `maia3_5m.onnx` (modèle) | 22,5 Mo | — |
| `stockfish-19-lite-single.wasm` | 1,85 Mo | — |

**Calculs lents** (scripts temporaires, Node 22)
- **`lessonWhy`** (`src/lib/lineTrainer.ts:130-148`) rejoue avec chess.js **toutes** les séquences de la leçon à chaque appel,
  sans cache.
  - Mesuré : 14 à 24 ms par appel quand le coup est absent (selon l'ouverture).
  - `signpostSentence` l'appelle deux fois par carte (`src/lib/signposts.ts:138`, `:143`).
  - Construire toutes les phrases d'une ouverture coûte 258 ms (london), 282 ms (english), 368 ms (london-def) et 959 ms
    (g6-system, 43 cartes).
- **Ce calcul tourne dans l'appli**, pendant l'affichage, sans mise en cache :
  - l'onglet Carrefours recalcule la phrase de chaque carte à chaque rendu (`src/screens/OpeningPage.tsx:223`) ;
  - l'entraîneur la recalcule à chaque rendu de la carte (`src/screens/CrossroadTrainer.tsx:68`).
- Durée sur iPad : non vérifié.
- Le test qui reconstruit les 109 phrases prend environ 2 s en local ; en CI, son délai est porté à 20 s (P0-04, R-08).

---

## 2. Données

### 2.1 Tables Dexie (base `sparring-echecs`, `src/db.ts:194-219`)
| Version | Contenu | Migration |
|---|---|---|
| 1 (`:203-207`) | `games`, `cards`, `meta` | — |
| 2 (`:208-214`) | ajoute `openings`, `holes` ; nouveaux index | `cards.kind ??= 'mistake'` (`:214`) |
| 3 (`:215`) | ajoute `mateRuns` | — |

| Table | Type (fichier) | Principaux écrivains |
|---|---|---|
| `games` | `Game`, `src/db.ts:46-80` | `src/game.ts:64`, `src/chesscomImport.ts:64`, `src/analysis.ts:92` et `:134`, `src/ThoughtUi.tsx:16` et `:41`, `src/detailRefresh.ts:51`, `src/screens/Report.tsx:60` et `:70`, `src/openings.ts:268` |
| `cards` | `Card`, `src/db.ts:84-126` (types `mistake`, `drill`, `mate`, `threat`, `trap`) | `src/analysis.ts:135-136`, `src/openings.ts:139-152`, `src/threatService.ts:56`, `src/trapService.ts:31`, `src/matesService.ts:87`, plus les écrans `Revise.tsx`, `ReviseMistake.tsx`, `ReviseThreat.tsx`, `Cards.tsx` |
| `meta` | `{ key: string; value: unknown }`, `src/db.ts:176` | 27 clés, voir §2.2 |
| `openings` | `Opening`, `src/db.ts:147-159` | `src/openings.ts:39-117`, `src/screens/Openings.tsx:52` |
| `holes` | `Hole`, `src/db.ts:162-174` | `src/openings.ts:272-280`, `src/openings.ts:125`, `src/screens/RepertoireEditor.tsx:199` |
| `mateRuns` | `MateRun`, `src/db.ts:129-140` | `src/MateExercise.tsx:90` |

Remarque : `analyseGame` supprime **toutes** les cartes d'une partie avant de les recréer (`src/analysis.ts:135`), y compris
les cartes « Lis la menace », qui portent aussi le `gameId` (`src/threatService.ts:49`). En pratique, `analyseGame` n'est
appelé que pour une partie non encore analysée (`src/screens/Review.tsx:75`, `src/screens/Comment.tsx:55`). Deux analyses
simultanées de la même partie supprimeraient des cartes « menace » déjà créées (hypothèse).

### 2.2 Clés de la table `meta` (27 : 25 fixes et 2 motifs)
| Clé | Valeur | Écrite par | Lue par |
|---|---|---|---|
| `profile` | `ProfileData {rating, gamesPlayed, nextColor, colorMode?, calibrationStart?}` (`src/lib/profile.ts:7-16`) | `src/db.ts:225` (via `src/game.ts:73`, `src/screens/Settings.tsx:40`/`:53`, `src/screens/PlayMenu.tsx:23`) | `src/db.ts:222` |
| `current` | `CurrentGame` (`src/db.ts:181-192`) | `src/db.ts:231` (via `src/game.ts`, `src/linesService.ts:35`, `src/screens/Play.tsx`) | `src/db.ts:228` |
| `theme` | `'dark'│'light'│'auto'` | `src/prefs.ts:53` | `src/prefs.ts:37` |
| `pieces` | `'relief'│'merida'│'maestro'` | `src/prefs.ts:59` | `src/prefs.ts:37` |
| `sound` | `boolean` | `src/sound.ts:21` | `src/sound.ts:13` |
| `reviseCap` | `10│15│25│0` (`src/lib/dailyPlan.ts:8`) | `src/openings.ts:173` | `src/openings.ts:170` |
| `reviseShowMine` | `boolean` | `src/screens/ReviseMistake.tsx:126` | `src/screens/ReviseMistake.tsx:42` |
| `warmupDay` | `AAAA-MM-JJ` | `src/sessionService.ts:27` | `src/sessionService.ts:32` |
| `sessionTrap` | `{day, id│null}` | `src/sessionService.ts:39` | `src/sessionService.ts:33` |
| `traps` | `Record<trapId, TrapProgress {attempts[{date, mode, ok, clean}], masteredAt?}>` | `src/trapService.ts:34` | `src/trapService.ts:10` |
| `threatScanned` | `string[]` de `threat:<gameId>:<ply>` (`src/lib/threatCards.ts:25`) | `src/threatService.ts:60` | `src/threatService.ts:28` |
| `chesscomUser` | `string` | `src/chesscomImport.ts:29` | `src/chesscomImport.ts:25` |
| `chesscomSync` | `{user, done: string[]}` (mois `AAAA/MM`) | `src/chesscomImport.ts:105` | `src/chesscomImport.ts:33` |
| `chesscomAutoAt` | `number` (ms) | `src/autoImport.ts:38` | `src/autoImport.ts:36` |
| `goals` | `GoalState {active, since, mastered, messages[]}` (`src/lib/goals.ts:65-74`) | `src/goalService.ts:40`, `:47` | `src/goalService.ts:36`, `src/openings.ts:197`, `src/TabBar.tsx:20` |
| `lastReportAt` | `number` | `src/screens/Report.tsx:129` | `src/screens/Report.tsx:33` |
| `boardProgress` | `BoardProgress {levels, chapters}` (`src/lib/board/levels.ts:107-109`) | `src/boardService.ts:32`, `:39` | `src/boardService.ts:12` |
| `boardStats` | `Record<case, {n, err, ms}>` (`src/lib/board/stats.ts`) | `src/boardService.ts:24` | `src/boardService.ts:15` |
| `lineProgress` | `Record<openingId, LineProgress {round, lines, errors}>` (`src/lib/lineTrainer.ts:11-14`) | `src/linesService.ts:20` | `src/linesService.ts:11` |
| `lineSession` | `{openingId, keys, start, loop, i, both?}` (`src/linesService.ts:41`) | `src/linesService.ts:47` | `src/linesService.ts:44` |
| `openingLessons` | `Record<openingId, {blocksDone, done, at}>` (`src/openings.ts:330`) | `src/openings.ts:340` | `src/openings.ts:333` |
| `openingsSeeded` | `string[]` | `src/openings.ts:51` | `src/openings.ts:29` |
| `openingsArchived` | `string[]` | `src/openings.ts:52` | `src/openings.ts:30` |
| `openingsRev` | `Record<openingId, number>` | `src/openings.ts:95` | `src/openings.ts:62` |
| `drillIntroduced` | `{day, count}` | `src/openings.ts:165` | `src/openings.ts:159` |
| `lessonState:<openingId>` | `LessonState {blocks, resume?}` (`src/lib/lessonPlan.ts:19-22`) | `src/lessonService.ts:21` | `src/lessonService.ts:9` |
| `crossroads:<openingId>` | `Record<cardId, {step, due, attempts[]}>` (`src/lib/crossroadTrainer.ts:8-9`) | `src/crossroadService.ts:14` | `src/crossroadService.ts:12` |

**Hors Dexie**
- localStorage `theme`, simple copie (`src/prefs.ts:32`, `:39`) ;
- sessionStorage `seance`, l'étape du jour en cours (`src/sessionService.ts:63-66`) ;
- Cache Storage du service worker (ressources de l'appli, pas de données utilisateur).

Aucun autre usage d'IndexedDB : grep `indexedDB` sans résultat dans `src/`.

### 2.3 Export, import et mise à jour après import
- **Export** (`src/db.ts:236-242`) : les 6 tables entières (dont toute la table `meta`), `version: 3`. Ni localStorage ni
  sessionStorage. Bouton dans `src/screens/Settings.tsx:57-66`.
- **Import** (`src/db.ts:244-258`) :
  - **Validation minimale** : seulement `app === 'sparring-echecs'`, et `games`/`cards` doivent être des tableaux (`:245`).
  - **`version` jamais lu.** Aucune migration de `meta`.
  - **Tables vidées** : `games`, `cards`, `meta`, `holes` toujours (`:249`), `mateRuns` toujours (`:255`), `openings`
    seulement si le fichier en contient (`:253`). Un fichier sans `meta` efface donc toute la progression (`:252`).
- **Après l'import** : pas de rechargement de la page, seulement un message (`src/screens/Settings.tsx:67-75`). Restent
  périmés jusqu'au prochain lancement :
  - les préférences en mémoire (`src/prefs.ts:19`) et le réglage du son (`src/sound.ts:9-14`) ;
  - les états de l'écran Réglages (`src/screens/Settings.tsx:20-30`) : enregistrer le niveau ou la couleur juste après un
    import réécrirait l'ancien profil (hypothèse) ;
  - les tâches de fond (analyse Chess.com, `detailRefresh`, cartes menace), qui écrivent ensuite par `gameId`, peut-être dans
    une partie importée qui porte le même identifiant (hypothèse, non vérifié).

---

## 3. Tests

### 3.1 Les 439 tests unitaires (Vitest)
Commande : `npx vitest run --reporter=json`, soit 39 fichiers et 439 tests, tous passés.

| Fichier | Tests | Ce qu'il couvre |
|---|---|---|
| `src/data/openingLessons.test.ts` | 137 | légalité des leçons, une phrase par coup, blocs, glossaire, menaces annoncées sur f7 vraies (`:106`) |
| `src/lib/report/facts.test.ts`, `buildReport.test.ts` | 23 + 22 | faits et rapport pour Claude |
| `src/lib/mates.test.ts` | 22 | règles des mats, limites, validation |
| `src/lib/logic.test.ts` | 21 | niveau Elo, % de gain et seuils, intervalles de révision, tirage Maia, profil |
| `src/lib/board/board.test.ts` | 19 | questions de la maîtrise de l'échiquier |
| `src/lib/repertoire.test.ts`, `src/data/openings.test.ts` | 18 + 17 | PGN, index, sortie du répertoire, vérification Stockfish du répertoire (lecture de `repertoire-checks.json`) |
| `src/lib/lineTrainer.test.ts` | 13 | ordre et validation des lignes |
| `src/lib/assist.test.ts` | 11 | précision, menaces, raisons d'erreur |
| `src/lib/moveWhy.test.ts`, `signposts.test.ts` | 10 + 9 | phrases attendues mot pour mot |
| `src/lib/report/motifs.sf.test.ts`, `src/lib/threat.sf.test.ts` | 9 + 4 | motifs et menaces avec un vrai Stockfish en Node (`tests/nodeEngine.ts`) |
| 25 autres fichiers | 1 à 7 chacun | `dailyPlan`, `goals`, `traps`, `crossroadTrainer`, `chesscom`, `dtm`, etc. |

**Non couvert** : 31 modules ne sont importés directement par **aucun** test (script temporaire sur les imports des
`*.test.ts`) :
- **données** : `db`, `openings`, `game`, `analysis`, tous les `*Service.ts` (`reviseService`, `sessionService`,
  `threatService`, `trapService`, `boardService`, `linesService`, `lessonService`, `goalService`, `matesService`,
  `crossroadService`), `chesscomImport`, `autoImport`, `prefs` ;
- **moteurs** : `engines/stockfish`, `engines/maia`, `engines/maia.worker` ;
- **navigation et PWA** : `router`, `nav`, `offline`, `useMoveNav` ;
- **contenus générés** : `data/lessonLines`, `data/signpostThreats`, `data/boardLessons`.

Conséquences :
- aucun test d'export, d'import ni de migration Dexie (grep `exportAll|importAll|indexedDB|Dexie` vide dans les tests ;
  `fake-indexeddb` absent de `package.json`) ;
- aucun test des écrans React.

### 3.2 Scripts Playwright de `tests/`
- 34 scripts `.cjs` utilisent Playwright (`grep -l playwright tests/*.cjs`) ; `tests/lib.cjs` sert d'aide commune.
- Ils ne sont lancés ni par un script npm ni par le CI (`package.json`, `.github/workflows/deploy.yml`).
- Ils attendent un serveur `vite preview` sur `http://localhost:4173/sparring-echecs/` (argument 3), un dossier de captures
  (argument 2), et pour `public.cjs` l'URL publique.

### 3.3 Résultat de leur exécution
Protocole :
- `npm run build` puis `npx vite preview --port 4173 --strictPort` ;
- chaque script lancé seul avec `timeout 300 node tests/<script>.cjs <dossier temporaire> <url>` ;
- les sorties (captures, `exemple-rapport.md`) dans un dossier temporaire hors du dépôt ; `git status` inchangé après coup.

**Résultat : 32 scripts sur 34 réussissent (dont `coords`, avec un délai plus long). `settings` est instable (1 réussite sur
3 passages) et `traps` échoue à chaque fois.**

| Script | Résultat | Durée |
|---|---|---|
| appearance, attaques, autoimport, cancel, chesscom, comment, crossroads, e2e, explore, goals, ingame, layout, lessons, lessons-full, lines, london, material, mates, motifs, offline, opening, pieces-shots, review2, revise, screens, today, v2 | code 0 | 6 à 108 s |
| board | code 0 | 188 s |
| report | code 0 (23 contrôles « ok ») | 211 s |
| selftest20 | code 0 : 20 parties Maia contre un joueur aléatoire, 0 plantage, 0 coup illégal, Maia 35 ms par coup en médiane | 19 s |
| public (URL publique) | code 0 (13 contrôles « ok ») | 31 s |
| coords | dépasse 300 s au 1er passage (code 124, interrompu par `timeout`) ; code 0 au 2e passage avec 1 500 s de délai (61 contrôles « ok ») | 317 s |
| **settings** | **instable** : échec au 1er passage et au 1er relancement, `Timeout 30000ms exceeded` en attendant « Niveau réglé à 1200 » (`tests/settings.cjs:103`) ; code 0 au 2e relancement | 43 s |
| **traps** | **échec reproductible** (3 passages sur 3) : `TypeError: Cannot read properties of undefined (reading 'attempts')` (`tests/traps.cjs:87`) | 3 s |

Causes probables (hypothèses, non corrigées) :
- **traps** : le test lit `meta.traps.petrov` dès l'affichage « réussi ». Or `finish` met à jour l'écran avant que
  `recordTrapAttempt`, asynchrone, ait écrit en base (`src/TrapExercise.tsx:51-54`, `src/screens/Traps.tsx:30-33`). C'est une
  course entre le test et l'écriture.
- **settings** : délai d'attente de 30 s atteint après « Enregistrer » ; course de même nature, cause précise non vérifiée.
- **coords** : script long (61 contrôles au pixel), simplement plus lent que le délai choisi.

---

## 4. Pédagogie, fonctionnalité par fonctionnalité

### 4.1 Niveau du joueur (et rapport avec Chess.com)
- **Formule** : Elo classique, `E = 1/(1+10^((Rbot−R)/400))`, puis `R' = R + K(score − E)` (`src/lib/rating.ts:19`, `:26-29`).
  - Départ à 900, bornes 550 à 2600 (`:3-5`) ;
  - K = 80 pendant 10 parties après le début de la calibration, puis 32 (`:7-9`, `:22-23`) ;
  - régler le niveau à la main relance la calibration (`src/lib/profile.ts:34-39`).
- **Niveau de Maia** : joueur + 50, borné (`src/lib/rating.ts:6`, `:16`). Il est figé au début de la partie
  (`src/game.ts:18-22`, mise à jour `:61`) et transmis tel quel au modèle : `selfElo` = niveau de Maia, `oppoElo` = joueur
  (`src/screens/Play.tsx:108`, `src/engines/maia.worker.ts:55-61`).
- **Parties qui ne comptent pas pour le niveau** :
  - parties non comptées et « Continuer la partie » depuis une ligne (`src/game.ts:61`, `src/linesService.ts:28-37`) ;
  - parties Chess.com, importées pour l'analyse seulement.
- **Rapport avec un Elo Chess.com Rapid : aucun.**
  - Le niveau ne dépend que des résultats contre Maia. Réglages précise « échelle de l'appli, pas celle de Chess.com »
    (`src/screens/Settings.tsx:84`).
  - La cadence et le classement Chess.com des parties importées sont enregistrés (`src/lib/chesscom.ts:26-36`, `:148`), mais
    seulement affichés (`src/screens/Review.tsx:250`). Ils ne servent à aucun calcul : grep `timeClass` sans autre usage.
  - L'échelle d'Elo sur laquelle Maia-3 a été entraînée n'est pas documentée dans `maia3-js` : correspondance non vérifiée.

### 4.2 Répétition espacée
**Moteur commun** : étapes fixes de type Leitner (`src/lib/srs.ts:1-32`).
- Intervalles 1, 3, 7, 14 puis 30 jours ; le palier de 30 jours se répète indéfiniment.
- Un échec ramène à J+1, étape 0 (`:28`).
- Ni facteur de facilité, ni note graduée, ni retrait d'une carte : aucun état « maîtrisée » pour la table `cards`.

| Type | Création | Particularités |
|---|---|---|
| Erreur (`mistake`) | une par erreur ou gaffe d'une partie analysée, due à J+1 (`src/analysis.ts:125-132`) | réponse juste = meilleur coup ou perte ≤ 5 points (`src/lib/winpct.ts:42-43`) ; tout essai raté replanifie à J+1 (`src/screens/ReviseMistake.tsx:86-87`) |
| Drill d'ouverture (`drill`) | une par position du répertoire où je joue, `due = 'new'` (`src/openings.ts:129-154`) | juste si le coup est dans la liste du répertoire (`src/screens/Revise.tsx:133`) ; la 1re présentation met la carte à J+1 quel que soit le résultat (`:134`) ; au plus 10 nouvelles par jour (`src/openings.ts:16`, `:158-166`) |
| Mat (`mate`) | un exercice de mat raté (`src/matesService.ts:78-88`) | réussite = mat donné, sans limite de coups |
| Menace (`threat`) | au plus 5 nouvelles par jour (`src/lib/threatCards.ts:10`, `:30`), dues le jour même (`src/threatService.ts:52`) | voir §4.6 |
| Piège (`trap`) | à la maîtrise du piège, étape 1, J+3 (`src/trapService.ts:19-31`) | réussite = les deux modes « propres » (`src/screens/Revise.tsx:189-192`) |

**Plafond et file de la Révision**
- **Plafond** : `reviseCap`, de 10, 15 (par défaut), 25 ou sans limite (`src/lib/dailyPlan.ts:8-9`). Il est diminué des cartes
  déjà revues aujourd'hui (`:12-14`, `:31`).
- **Tri** (`src/lib/dailyPlan.ts:20-28`) :
  1. les cartes d'erreur d'un motif de l'objectif actif ;
  2. puis « Lis la menace » ;
  3. puis le reste, par échéance puis date de création.
- Les nouvelles cartes de drill passent en dernier (`src/db.ts:142-143`). L'étape « Lis la menace » prend au plus 5 positions,
  le reste va à la Révision (`src/lib/dailyPlan.ts:34-46`).
- **Contournement possible du plafond** : quand la file est vide, de nouvelles cartes « menace » sont créées et ajoutées
  directement (`src/screens/Revise.tsx:39-48`), sans repasser par le plafond (hypothèse sur l'effet).

**Autres progressions (hors table `cards`)**
- **Carrefours** : même `schedule`, au plus 8 nouvelles cartes par séance (`src/lib/crossroadTrainer.ts:11-18`) ; « maîtrisée »
  dès l'étape 2 (`src/crossroadService.ts:16`).
- **Lignes** : pas de répétition espacée, mais des tours ; une ligne validée sans erreur, sinon « à refaire »
  (`src/lib/lineTrainer.ts:32-63`, `:112-127`).
- **Échiquier** : révision des chapitres validés à J+1, J+3, J+7, puis tous les 7 jours (`src/lib/board/levels.ts:113-115`).
- **Leçons** : pas de répétition espacée (`src/lib/lessonPlan.ts:41-52`).

### 4.3 Réussite avec aide ou autonome
| Mode | Règle réelle | Distinguée ? |
|---|---|---|
| Cartes d'erreur | réussite = premier coup juste et au plus 1 indice (`src/screens/ReviseMistake.tsx:57`) ; solution après 2 essais ratés ou 2 indices (`:52`) | oui pour l'avancement, mais les indices ne sont pas enregistrés dans `attempts` |
| Lis la menace | Q1 du premier coup avec au plus 1 indice, et Q2 du premier coup (`src/screens/ReviseThreat.tsx:67`) | oui pour l'avancement ; chaque tentative est enregistrée `ok` sans trace des indices (`:60-62`) |
| Pièges | `clean = ok && tries === 0 && hints === 0` (`src/TrapExercise.tsx:51-54`) | **oui**, `ok` et `clean` sont stockés séparément (`src/trapService.ts:17`) |
| Carrefours | réussite = Q1 juste, Q2 du premier coup, aucun indice (`src/screens/CrossroadTrainer.tsx:90`) | oui, mais « Refaire » (`:73-75`, `:149`) rappelle `finish` sur une progression déjà mise à jour : un échec suivi d'une réussite refaite avance la carte (hypothèse, mesurée sur la fonction pure seulement) |
| Leçon | un bloc est « fait » dès qu'il a été rejoué une fois, avec ou sans erreurs (`src/lib/lessonPlan.ts:48`) ; ses coups entrent alors dans le drill | **non** |
| Lignes | une seule erreur met la ligne « à refaire » (`src/lib/lineTrainer.ts:112-127`) | oui |
| Partie non comptée avec assistance | indices Stockfish, reprise de coup (`src/screens/Play.tsx:146-188`) | **non** : rien n'est enregistré, et la partie compte pour les objectifs (`src/lib/goals.ts:39-41`) |

### 4.4 Découverte, comprise, mémorisée, maîtrisée
Il n'existe **aucun** modèle commun. Chaque mode a ses états :
- **pièges** : `nouveau`, `en cours`, `maîtrisé` (`src/lib/traps.ts:85-89`) ;
- **carrefours** : `nouvelle`, `en cours`, `à revoir`, `maîtrisée` (`src/screens/OpeningPage.tsx:208`) ;
- **leçons** : `new`, `started`, `done` (`src/lib/lessonPlan.ts:41-52`) ;
- **lignes** : `ok`, `redo` (`src/lib/lineTrainer.ts:11`) ;
- **échiquier** : niveau validé, chapitre validé ou « à revoir » (`src/lib/board/levels.ts:107-109`) ;
- **mats** : débloqué, validé, série (`src/lib/mates.ts:190-209`) ;
- **cartes de révision** : seulement « nouvelle » (drill), « à revoir » ou date de la prochaine révision ; pas de
  « maîtrisée ».

La différence entre « vu » (découverte), « rejoué sans aide » (compris), « rappelé après plusieurs jours » (mémorisé) et
« réussi en partie » (maîtrisé) n'est représentée nulle part.

### 4.5 Séance du jour
- **Composition fixe** de 5 étapes (`src/lib/dailyPlan.ts:75-87`). La première non faite est proposée (`:89`).

| Étape | Faite quand… | Source |
|---|---|---|
| Échauffement échiquier (3 min) | `warmupDay` = aujourd'hui, quel que soit le résultat | `src/sessionService.ts:27`, `:45` |
| Un piège d'ouverture (4 min) | une tentative « défense » et une « punition » aujourd'hui, réussies ou non | `src/sessionService.ts:48` |
| Lis la menace (5 min) | plus de position à revoir (au plus 5) | `src/lib/dailyPlan.ts:81` |
| Révision (10 min) | plus de carte sous le plafond | `src/lib/dailyPlan.ts:83` |
| Une partie contre Maia (15 min) | une partie `source === 'app'` aujourd'hui | `src/sessionService.ts:53` |

- **Écart entre libellé et règle** : l'étape « partie » affiche « partie comptée » (`src/lib/dailyPlan.ts:85`), mais une partie
  non comptée ou une ligne continuée la coche aussi (`src/sessionService.ts:53`, `src/linesService.ts:33`).
- **Piège du jour** : le premier piège non maîtrisé, par ordre fixe de chapitre `mes`, puis `mats`, puis `dame`
  (`src/lib/dailyPlan.ts:92-96`). Les pièges où je suis tombé en partie ne sont repérés que pour le rapport
  (`src/screens/Report.tsx:115`).
- **Adaptation aux faiblesses : faible.**
  - Ce qui s'adapte :
    - le tri des cartes par motif de l'objectif (`src/lib/dailyPlan.ts:20-28`) ;
    - les menaces ignorées traitées d'abord à la création des cartes (`src/lib/threatCards.ts:47-85`) ;
    - les cases faibles surpondérées à l'échauffement (`src/lib/board/stats.ts:30-34`).
  - Ce qui ne s'adapte pas : le nombre d'étapes, leur durée, leur ordre, le choix du piège et le niveau de Maia.

### 4.6 Fonctionnalités, une par une
**Parties contre Maia** (`src/screens/Play.tsx`, `src/game.ts`)
- Niveau de Maia = joueur + 50.
- Nulle acceptée si au moins 20 demi-coups ont été joués et si Maia estime ses chances à 55 % au plus
  (`src/screens/Play.tsx:25`, `:197`).
- Assistance seulement en partie non comptée (`:146`). Une partie annulée pendant les premiers coups est supprimée
  (`src/game.ts:29-34`).

**Revue de partie** (`src/analysis.ts`, `src/screens/Review.tsx`)
- Chaque position est évaluée 500 ms. Le % de gain suit la formule Lichess (`src/lib/winpct.ts:15-18`).
- Seuils de gravité : imprécision 10, erreur 20, gaffe 30 points de % de gain (`src/lib/winpct.ts:24-30`).
- Classement façon Chess.com : Excellent ≤ 3, Bon < 10 (`src/lib/moveClass.ts:24-30`). Précision façon Lichess
  (`src/lib/accuracy.ts:10-46`).
- 6 motifs d'erreur (`src/lib/report/motifs.ts:7`, règles `:54-63`) : mat raté, mat ouvert, menace ignorée, pièce laissée en
  prise, gain raté, autre.
- « Réessayer » accepte un coup de chute < 10 (`src/screens/Review.tsx:151-156`) et n'enregistre rien.
- Sur une erreur non encore commentée, la revue masque le meilleur coup (`src/screens/Review.tsx:112`, `:124`).

**Commenter ses erreurs** (`src/screens/Comment.tsx`, `src/lib/thoughts.ts`)
- 5 réponses en un toucher (« menace non vue », « trop vite »…) avant de voir la solution. Elles ne servent qu'au rapport
  (`src/lib/report/buildReport.ts:180-208`).

**Révision des erreurs** (`src/screens/ReviseMistake.tsx`)
- Indice 1 : le motif en mots (`:136`). Indice 2 : la pièce à jouer est surlignée (`:104`).

**Lis la menace** (`src/threatService.ts`, `src/screens/ReviseThreat.tsx`)
- Positions tirées de mes parties, d'abord celles où j'ai ignoré une menace (`src/lib/threatCards.ts:47-85`).
- Une menace est confirmée si, en donnant le trait à l'adversaire, il gagne au moins 20 points de % de gain ou mate
  (`src/lib/threat.ts:8`, `:62-79`).
- Q1 : jouer son prochain coup à sa place. Q2 : parer.

**Pièges** (`src/data/traps.ts`, `src/TrapExercise.tsx`)
- 13 pièges en 3 chapitres (`src/data/traps.ts:9-13`), sur des positions fixes. Deux modes : « Défends-toi » et « Punis-le ».
- Maîtrise = les deux modes réussis proprement, sur 2 jours différents (`src/lib/traps.ts:72-83`).
- Vérification Stockfish documentée dans `docs/PIEGES.md` (script non relancé ici).

**Mats élémentaires** (`src/lib/mates.ts`, `src/matesService.ts`)
- 4 niveaux disponibles (D+R, T+T, T+R, F+F+R) ; positions précalculées avec distance exacte au mat.
- Le roi seul se défend avec Stockfish à 500 ms (`src/matesService.ts:13`). Que ce coup soit la meilleure défense possible :
  non vérifié.
- Validation : 3 mats d'affilée dans la limite `min(50, max(min+10, 2×min))` coups (`src/lib/mates.ts:24`, `:32`, `:187-195`).

**Maîtrise de l'échiquier** (`src/lib/board/*`, `src/screens/Board*.tsx`)
- 7 chapitres débloqués dans l'ordre (`src/lib/board/levels.ts:127`) : épreuves chronométrées (30 s, au moins 25 bonnes
  réponses, au plus 1 erreur, 3 fois : `:24`), questions, visualisation, partie à l'aveugle.
- Les cases faibles sortent plus souvent (`src/lib/board/stats.ts:30-34`).

**Ouvertures** (mesuré, script temporaire)

| Ouverture | Lignes | Mes coups (= cartes de drill) | Carrefours / cartes |
|---|---|---|---|
| Anglaise (Blancs) | 15 | 111 | 11 / 25 |
| Londres (Blancs) | 13 | 87 | 5 / 17 |
| …c5/…g6 (Noirs) | 30 | 160 | 14 / 43 |
| Londres en défense (Noirs) | 17 | 105 | 8 / 24 |

- **Leçon** : la ligne principale par blocs, puis le plan, la partie type et les blocs supplémentaires. Étapes « regarder »,
  « rejouer », « en boucle » ; la boucle n'a pas de fin automatique.
- **Drill** : une position, un coup.
  - Affiche « Vérification par Stockfish… » (`src/screens/Revise.tsx:163`), alors que la réponse est seulement comparée à la
    liste du répertoire (`:133`).
- **Lignes** : l'adversaire joue exactement les coups de la ligne (`src/screens/PlayLines.tsx:121-126`).
  - Après 2 refus, le bon coup et son « pourquoi » s'affichent (`src/screens/PlayLines.tsx:195-201`).
  - « Continuer la partie » lance Maia en partie non comptée (`src/linesService.ts:28-37`).
- **Carrefours** : un nœud où l'adversaire a au moins 2 coups (`src/lib/crossroads.ts:26-29`).
  - Q1 : « Sur quelle ligne es-tu ? ». Q2 : mon coup, accepté seulement s'il suit ce chemin (`src/lib/crossroadTrainer.ts:44`).
- **Partie à thème** : seuls les coups adverses qui définissent l'ouverture sont imposés, puis Maia joue librement
  (`src/screens/Play.tsx:101-108`).
- **Éditeur** : tout nouveau coup est vérifié par Stockfish à 800 ms (`src/openings.ts:289-326`).

**Objectifs** (`src/lib/goals.ts`)
- 3 objectifs dans un ordre fixe (`:21-28`) : « Ne rien donner », « Ne rien laisser passer », « Tenir mon répertoire ».
- Maîtrise = 7 parties propres sur les 10 dernières (`:31`, `:101`). Une « partie propre » n'a aucune **gaffe** du motif visé.
- Les parties non comptées avec assistance sont mesurées comme les autres (`:39-41`, aucun filtre sur `unrated`).

**Rapport pour Claude** (`src/lib/report/buildReport.ts`, `src/screens/Report.tsx`)
- Markdown complet : résultats, motifs par phase, 10 pires coups, PGN annotés, révision, pièges.
- Il demande à Claude de diagnostiquer et de proposer 3 axes de travail (`src/lib/report/buildReport.ts:395`).

### 4.7 Quand l'adversaire sort du répertoire
- **Détection** : `findBookExit` rejoue la partie sur l'index des positions et dit qui est sorti et quand
  (`src/lib/repertoire.ts:287-304`).
- **Partie à thème contre Maia** :
  - si l'adversaire sort, un **trou** est enregistré (`db.holes`), avec le meilleur coup Stockfish à 1 s
    (`src/openings.ts:262-284`) ;
  - la revue le signale ; l'éditeur propose « Ajouter », « Compléter à la main » ou « Ignorer »
    (`src/screens/RepertoireEditor.tsx:186-203`) ;
  - **le trou n'est pas un exercice** : il devient une carte seulement si on ajoute la ligne au répertoire.
- **Partie Chess.com** : la sortie est calculée (`src/chesscomImport.ts:62-63`) mais **aucun trou n'est créé**, car
  `recordBookExit` exige une partie à thème (`src/openings.ts:264`). Le rapport liste les sorties adverses vues au moins
  2 fois (`src/lib/report/buildReport.ts:160-174`).
- **Après la sortie** : aucune mesure de la qualité de mon jeu dans les coups qui suivent. Seules les cartes d'erreur génériques
  existent (`src/analysis.ts:125-132`).

### 4.8 Comment sont produits les « pourquoi »
- **Écrits à la main** : ligne principale, plans, notes des parties types et blocs supplémentaires
  (`src/data/openingLessons.ts`, `src/data/linePlans.ts`).
- **Calculés hors ligne, puis figés dans les données** :
  - `scripts/lesson-lines.ts` génère `src/data/lessonLines.ts`. Il reprend une explication écrite à la main pour la même
    position, sinon il appelle `moveWhy` ;
  - les menaces viennent d'un Stockfish 19 en Node (`scripts/threatEngine.ts`, `scripts/signpost-threats.ts`) ;
  - mesuré : 924 « pourquoi » dans `lessonLines.ts`, dont 141 repris d'un texte écrit à la main.
- **Calculés à l'affichage** : les phrases-panneaux des carrefours (`src/lib/signposts.ts:132-146`), qui combinent la menace
  précalculée, le « pourquoi » de la leçon (`lessonWhy`) et des règles de secours.
- **Heuristiques de `src/lib/moveWhy.ts`** : une suite de règles ordonnées (`:219-354`) — réponse au coup précédent, roque,
  prise, clouage, échec, pions, attaque, développement, etc.
  - La plupart décrivent des **faits** vérifiés sur l'échiquier, par exemple les attaques via `chess.attackers`.
  - D'autres affirment une **intention** sans la vérifier : « prépare le fianchetto » dès qu'un pion arrive en g3/b3/g6/b6
    (`:274`), « contrôle g4 : ni son fou ni son cavalier ne pourront s'y installer » (`:279`), « prête si la colonne s'ouvre »
    (`:326`), « Bh6 échangera son fou g7 » (`:336`).
- **Ce qui garantit l'exactitude**
  - des tests de non-régression sur une trentaine de phrases attendues mot pour mot (`src/lib/moveWhy.test.ts`) ;
  - la vérification des menaces de mat sur f7 annoncées par les leçons (`src/data/openingLessons.test.ts:106`) ;
  - un journal de relecture humaine (`docs/POURQUOI-MODIFIES.md`).
  - **Aucun contrôle systématique** ne compare chaque phrase à la position. Deux erreurs ont été mesurées :
    - **« la colonne X s'ouvre pour tes tours »** (`src/lib/moveWhy.ts:246`, `:376`) ne regarde que **mes** pions : 24 des 31
      occurrences distinctes ont encore un pion adverse sur la colonne, qui n'est donc que semi-ouverte ;
    - **« reprend : le matériel reste égal »** (`:242`) : 1 occurrence sur 36 est fausse au moment du coup (…c5/…g6,
      10.Nxd5).

### 4.9 Indicateurs mesurés aujourd'hui
| Indicateur | État | Où |
|---|---|---|
| Gaffes par partie | existe | `src/screens/Stats.tsx` (parties Maia), rapport par source |
| Pièces données (en prise) par partie | partiel : le motif est compté sur la période, sans indicateur par partie | rapport (`src/lib/report/buildReport.ts:497-520`), « À surveiller » des objectifs |
| Réussite sans aide | partiel : pièges seulement (`clean`) | `src/trapService.ts:17` |
| Rappel à 30 jours | absent : seul l'intervalle de 30 jours existe | `src/lib/srs.ts:2` |
| Transfert sur positions inédites | absent | — |
| Priorité de coach calculée et expliquée | absent : diagnostic délégué à Claude | `src/lib/report/buildReport.ts:395` |

---

## 5. Confrontation au rapport d'audit V2

### 5.1 Constats
| Constat V2 | État réel | Preuve |
|---|---|---|
| (a) 15 variantes et blocs de répétition favorisant la récitation | **Partiel** | 15 lignes pour l'Anglaise seulement (13, 30 et 17 pour les autres, mesuré). L'ordre est fixe partout : aucun mélange dans `src/lib/lineTrainer.ts:32-63`, `src/openings.ts:189-191` ni `src/lib/crossroadTrainer.ts:14-18`. La boucle de leçon n'a pas de fin automatique. L'adversaire des lignes ne dévie jamais (`src/screens/PlayLines.tsx:121-126`). |
| (b) Pas de mesure de la réussite hors répertoire ni sur positions nouvelles | **Confirmé** | On mesure qui sort et quand (`src/lib/repertoire.ts:287-304`, `src/lib/report/buildReport.ts:461-481`), jamais la qualité du jeu après la sortie. Aucun exercice sur positions nouvelles. |
| (c) Manque d'exercices de menaces et de défense | **Partiel, en partie déjà traité** | Existent : « Lis la menace » sur mes parties (`src/screens/ReviseThreat.tsx`), « Défends-toi » des pièges (13 positions fixes, `src/data/traps.ts`), « la pièce en X est-elle défendue ? » du chapitre 6 (`src/lib/board/questions.ts`), cartes d'erreur du motif « pièce en prise ». Manquent : une série dédiée « pièces en prise » sur positions variées, et des exercices de défense hors de mes propres parties. |
| (d) `moveWhy.ts` mêle faits et intentions | **Partiel** | Aucune distinction dans le code : tout est une phrase. La plupart des phrases sont des faits, une partie des intentions non vérifiées (`src/lib/moveWhy.ts:274`, `:279`, `:326`, `:336`). Deux règles produisent des phrases fausses (mesuré, §4.8). |
| (e) Incohérences : 14 contre 15, 111 demi-coups, Stockfish 16 et 19 | **Faux pour 14/15 et 111 ; confirmé pour SF16/19, sans contradiction** | 15 lignes, dont la principale déjà couverte par la leçon : 14 lignes générées (`docs/REPERTOIRE.md:8`, mesuré). « 111 » = 111 coups **de mon camp** (= 111 cartes de drill), pas 111 demi-coups. Stockfish 19 lite pour l'appli et les vérifications (`package.json`, `scripts/validate-repertoire.ts:1`) ; Stockfish 16 natif pour les positions de mats (`src/data/matePositions.json:1`, `scripts/annotate-mates.ts:25`) et les parties types (`src/data/openingLessons.ts:4`). Aucun script du dépôt ne produit les parties types : leur moteur est invérifiable. |
| (f) Sauvegarde, restauration et migrations non testées | **Confirmé** | Aucun test ne couvre `exportAll`, `importAll` ni les migrations Dexie. Seul `tests/e2e.cjs:122-125` vérifie le contenu d'un export. Voir §2.3 et §3.1. |

### 5.2 Recommandations V2
| Recommandation | État | Preuve |
|---|---|---|
| Graphe de positions avec fusion des transpositions | **Partiel** | Arbre de coups (`src/lib/repertoire.ts:8-28`) avec un index par position (`:206-220`). Le drill, la sortie du répertoire, `lessonWhy` et les lignes (bascule `src/lib/lineTrainer.ts:97-100`) fusionnent par position ; les carrefours et les coups adverses des lignes suivent le chemin. Mesuré : 26, 43 et 37 positions atteintes par au moins 2 chemins (Londres, …c5/…g6, Londres en défense). |
| Rappel côté Blancs / côté Noirs | **Partiel** | Rappel de ma couleur (drill, lignes), plus l'option « Les deux camps ». Pas de rappel du seul camp adverse. |
| Carrefours | **Existe** | `src/screens/CrossroadTrainer.tsx` |
| Positions aléatoires | **Absent** | aucun tirage au hasard dans le module Ouvertures |
| Variantes mélangées | **Absent** | ordre fixe (voir (a)) |
| Hors répertoire | **Partiel** | « Continuer la partie » contre Maia (`src/linesService.ts:28-37`) et partie à thème, sans exercice dédié ni mesure |
| Partie à thème | **Existe** | `src/screens/Play.tsx:101-108` |
| Examen sans aide | **Absent** | pas de mode dédié ; le drill est sans indice, mais affiche la ligne qui y mène |
| Réussite assistée non comptée comme maîtrise | **Partiel** | voir §4.3 : oui pour les erreurs, menaces, carrefours et pièges ; non pour les leçons et les parties assistées |
| Exercices tirés des erreurs personnelles | **Existe** | cartes d'erreur (`src/analysis.ts:125-132`), Lis la menace (`src/lib/threatCards.ts:47-85`) |
| Indices graduels | **Existe** | 2 niveaux en révision, menace, pièges et carrefours ; case puis flèche en leçon |
| Priorité de coach calculée et expliquée | **Absent** | ordre fixe des objectifs et des étapes ; diagnostic délégué à Claude |
| Pièces données par partie | **Partiel** | motif compté sur une période, pas par partie |
| Réussite sans aide | **Partiel** | pièges seulement |
| Rappel à 30 jours | **Absent** | — |
| Transfert sur positions inédites | **Absent** | — |

---

## 6. Frontière avec le design : logique mêlée à l'affichage
Comptage par fichier (commande `grep -c` sur `db.(games|cards|meta|openings|holes|mateRuns|transaction)`, `stockfish.|maia.`
et `new Chess`) :

| Fichier | Accès base | Appels moteur | `new Chess` | Logique métier repérée dans l'écran |
|---|---|---|---|---|
| `src/screens/Report.tsx` | 10 | 0 | 0 | analyse des parties manquantes, sélection, écriture de `lastReportAt` (`:44-73`, `:129`) |
| `src/screens/ReviseMistake.tsx` | 5 | 0 | 1 | jugement de la réponse et planification (`:57-60`, `:75-87`) |
| `src/screens/Revise.tsx` | 4 | 0 | 0 | drill (`:126-140`), révision des pièges (`:184-192`), création de cartes menace (`:39-48`) |
| `src/screens/ReviseThreat.tsx` | 3 | 0 | 1 | Q1/Q2, tentatives, planification (`:60-68`) |
| `src/screens/Openings.tsx` | 4 | 0 | 0 | création d'ouverture (`:52`) |
| `src/ThoughtUi.tsx` | 4 | 0 | 0 | écriture des réponses « ce que je pensais » (`:16`, `:41`) |
| `src/screens/Review.tsx` | 3 | 0 | 2 | lancement de l'analyse, « Réessayer » (`:75`, `:151-156`) |
| `src/screens/RepertoireEditor.tsx` | 3 | 0 | 3 | vérification et enregistrement du répertoire, trous (`:41-63`, `:199`) |
| `src/screens/Play.tsx` | 2 | 6 | 1 | boucle de jeu, Maia, nulle, indices (`:95-120`, `:146-207`) |
| `src/screens/PlayLines.tsx` | 1 | 0 | 7 | déroulé des lignes, `lessonWhy` (`:121-201`) |
| `src/screens/BoardBlind.tsx` | 0 | 4 | 7 | partie à l'aveugle contre Maia (`:217`) |
| `src/screens/CrossroadTrainer.tsx` | 1 | 0 | 4 | réussite, progression, phrase-panneau (`:68`, `:76-90`) |
| `src/screens/OpeningLesson.tsx` | 1 | 0 | 4 | progression de la leçon, ajout au drill (`:138-160`) |
| `src/screens/OpeningPage.tsx` | 1 | 0 | 0 | file et état des carrefours, phrases à chaque rendu (`:200-223`) |
| `src/MateExercise.tsx` | 1 | 1 | 4 | défense du roi, enregistrement (`:90-91`) |
| `src/TrapExercise.tsx` | 0 | 1 | 5 | jugement des coups par Stockfish (`:63-125`) |
| `src/Explorer.tsx`, `src/Suite.tsx`, `src/MaterialBar.tsx`, `src/Board.tsx` | 0 | 0 à 1 | 1 à 2 | calculs d'échecs pour l'affichage |
| `src/screens/Stats.tsx`, `Cards.tsx`, `Comment.tsx`, `Training.tsx`, `PlayMenu.tsx`, `src/TabBar.tsx` | 1 à 2 | 0 | 0 à 1 | lectures et agrégats en base |

Pour le partage des domaines : ces fichiers relèvent des deux agents. Toute modification exige une note dans
`docs/project/HANDOFF.md` (règle de `AGENTS.md`).

---

## 7. Constats et recommandations priorisés
Effort : petit (< 1 jour), moyen (quelques jours), grand (plus d'une semaine). Pas d'architecture cible : c'est l'objet de
la phase 2.

### P0 — à traiter avant toute refonte
| N° | Constat (preuve) | Recommandation | Bénéfice pour le joueur | Effort | Risque |
|---|---|---|---|---|---|
| P0-A | Import destructeur sans version ni sauvegarde préalable ; un fichier sans `meta` efface toute la progression (`src/db.ts:244-258`) | sauvegarde automatique avant import, contrôle de `version`, rechargement après import | ne jamais perdre sa progression | petit | faible |
| P0-B | Aucun test de sauvegarde, restauration ni migration (§3.1) | tests d'aller-retour export/import et de migration Dexie (ex. avec `fake-indexeddb`) | la refonte ne casse pas les données de l'iPad | moyen | faible |
| P0-C | 27 clés `meta` non typées, sans inventaire dans le code (§2.2) | registre typé des clés et règle de migration | progression conservée au fil des versions | moyen | moyen (touche tous les services) |
| P0-D | Données uniquement dans le navigateur, sans `navigator.storage.persist()` (grep vide) | demander le stockage persistant ; rappel d'export | réduit le risque d'effacement par Safari | petit | faible ; effet sur iPad non vérifié |

### P1 — fondations pédagogiques
| N° | Constat (preuve) | Recommandation | Bénéfice | Effort | Risque |
|---|---|---|---|---|---|
| P1-A | Pas de modèle commun de maîtrise ; réussites assistées comptées (leçon `src/lib/lessonPlan.ts:48`, « Refaire » `src/screens/CrossroadTrainer.tsx:73-90`, parties assistées `src/lib/goals.ts:39-41`) | un état d'apprentissage commun (découvert, réussi sans aide, rappelé à J+n, réussi en partie) et l'enregistrement des aides utilisées | savoir ce qui est vraiment acquis | grand | moyen (données) |
| P1-B | Explications fausses mesurées (colonne « ouverte » 24/31, « matériel égal » 1/36 : `src/lib/moveWhy.ts:242-246`, `:376`) ; aucun contrôle systématique | corriger les deux règles, séparer faits vérifiés et intentions, ajouter un contrôle automatique de chaque phrase générée | ne pas apprendre de notions fausses | moyen | faible |
| P1-C | Aucune mesure hors répertoire ni de transfert (§5.1 b) | mesurer la qualité des coups après la sortie et la réussite sur positions jamais vues | savoir si l'ouverture apprise sert en vraie partie | moyen | faible |
| P1-D | Indicateurs absents : pièces données par partie, réussite sans aide, rappel à 30 jours (§4.9) | les calculer à partir des données existantes (`attempts`, `analysis`) | voir ses progrès sur ce qui compte à 900 Elo | moyen | faible |
| P1-E | Ouvertures en ordre fixe, adversaire qui ne dévie jamais (`src/lib/lineTrainer.ts:32-63`, `src/screens/PlayLines.tsx:121-126`) | ordre mélangé et positions au hasard dans le répertoire ; déviations de l'adversaire | rappel actif plutôt que récitation | moyen | faible |
| P1-F | Séance figée et sans priorité expliquée (`src/lib/dailyPlan.ts:75-96`) | priorité calculée à partir des motifs et des indicateurs, avec la raison affichée | travailler d'abord sa faiblesse principale (sécurité des pièces) | moyen | moyen (dépend de P1-A et P1-D) |
| P1-G | Aucun lien entre le niveau de l'appli et l'Elo Chess.com Rapid, alors que les parties Rapid sont importées avec leur classement (`src/lib/chesscom.ts:26-36`, `:148`) | suivre le classement Rapid importé comme indicateur de résultat, sans le mélanger au niveau Maia | suivre l'objectif réel de 1 800 Rapid | petit | faible |

### P2 — robustesse et performances
| N° | Constat (preuve) | Recommandation | Bénéfice | Effort | Risque |
|---|---|---|---|---|---|
| P2-A | `lessonWhy` sans cache, recalculé à chaque rendu (≈ 1 s pour l'onglet Carrefours de …c5/…g6, mesuré ; `src/screens/OpeningPage.tsx:223`) | index position → « pourquoi » calculé une fois, mise en cache des phrases | écrans d'ouvertures fluides sur iPad | petit | faible |
| P2-B | Bundle de 1 063 kB, 27 écrans chargés d'emblée (`src/App.tsx:1-28`) | découpage par écran (`import()` dynamique) | démarrage plus rapide | petit | faible |
| P2-C | Stockfish sans annulation ni gestion d'erreur ; Maia sans repli (`src/engines/stockfish.ts:96-97`, `src/screens/Play.tsx:114-116`) | commande `stop`, délai maximal, `onerror`, repli si Maia échoue | moins de blocages en partie | moyen | moyen |
| P2-D | Scripts Playwright hors CI ; `traps` échoue à chaque fois, `settings` est instable (§3.3) | réparer et intégrer quelques parcours critiques au CI | moins de régressions d'interface | moyen | faible |
| P2-E | Crochets de test (`__db`…) exposés en production (`src/selftest.ts:81`) | ne les charger qu'en mode test | réduit la surface d'erreur | petit | faible (les tests Playwright en dépendent) |
| P2-F | Message « Vérification par Stockfish… » trompeur dans le drill (`src/screens/Revise.tsx:163`) ; libellé « partie comptée » coché par une partie non comptée (`src/lib/dailyPlan.ts:85`, `src/sessionService.ts:53`) | aligner libellés et règles | confiance dans ce que dit l'appli | petit | faible |
| P2-G | Logique métier dans 20 écrans ou composants (§6) | extraire progressivement vers des services testés | partage clair avec Codex, tests possibles | grand | moyen |

---

## Annexe : commandes et scripts
- `npm ci`, `npm run lint`, `npx tsc -b`, `npm test` (439/439), `npm run build` (code 0), `npx vitest run --reporter=json`.
- `npx vite preview --port 4173` et `node tests/<script>.cjs <dossier> <url>` pour chaque script Playwright (§3.3).
- Scripts temporaires (hors dépôt) bundlés avec `npx esbuild … --bundle --platform=node --format=esm`, puis exécutés avec
  `node` : profil de `lessonWhy` et `signpostSentence`, comptage des lignes, cartes et transpositions, contrôle des phrases
  « colonne » et « matériel ».
- `grep` cités dans le texte (`db.meta`, `'stop'`, `onerror`, `indexedDB`, `timeClass`, `from '../db'`).
