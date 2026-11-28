# Revue du brief de clôture (P1-02)

Établie le 28/11/2026 sur `main` = `bfcb506` (fusion de la PR #40). Point de retour : tag `v1.0-avant-refonte` = `ad76851`.

Le « brief de clôture » (6 étapes, sans identifiant) ne venait pas du directeur de projet, et sa « décision du
propriétaire » n'en était pas une. Il a été exécuté : PR #35 à #40, fusionnées par Claude Code lui-même, sans revue ni
test sur iPad. Le brief demandait aussi de fusionner d'abord la PR #34 (audit P1-01) : elle a été fusionnée de la même
façon (`612c360`). Décision : ce travail n'est pas annulé ; il est mis sous revue (D-011).

Aucun fichier de code, de test ou de configuration n'a été modifié par cette revue. Les tests de compatibilité (§ 3) ont
été lancés depuis un dossier temporaire hors du dépôt.

## 1. Ce que contient chaque PR

Méthode : `git diff --stat <avant>..<après>` entre les commits de fusion, et `git diff` des fichiers `*.test.ts` et
`tests/` pour les tests ajoutés.

Total de `v1.0-avant-refonte` à `bfcb506` : 125 fichiers, +3 485 −434, dont `src/` : 62 fichiers, +1 753 −279.
Tests Vitest : 439 au tag, 475 sur `main` (`npx vitest run` lancé dans les deux, tous passent).

### PR #35 — Étape 1 : règles et données (`612c360..175a945`)
Fichiers (18 fichiers, +503 −58) :
```
 AGENTS.md                | 40 ++++++++++++++++--------------------
 CLAUDE.md                |  5 ++---
 docs/project/RISKS.md    |  6 +++---
 package-lock.json        | 11 ++++++++++
 package.json             |  1 +
 src/App.tsx              |  3 ++-
 src/backupService.ts     | 33 ++++++++++++++++++++++++++++++
 src/db.test.ts           | 86 ++++++++++++++++++++++++++++
 src/db.ts                | 27 ++++++++++++++-----------
 src/dbMigration.test.ts  | 27 +++++++++++++++++++++++++
 src/lib/backup.test.ts   | 61 +++++++++++++++++++++++++
 src/lib/backup.ts        | 76 ++++++++++++++++++++++++++++
 src/metaKeys.test.ts     | 45 +++++++++++++++++++++
 src/metaKeys.ts          | 78 ++++++++++++++++++++++++++++
 src/screens/Home.tsx     |  7 ++++++-
 src/screens/Settings.tsx | 30 +++++++++++++++------------
 src/sessionService.ts    | 10 +++++++--
 src/storage.ts           | 15 ++++++++++++++
```
Changements visibles pour le joueur :
- Réglages : ligne « Stockage protégé : oui / non » (`src/screens/Settings.tsx:131`) ; « Dernière sauvegarde » ;
- Import : confirmation, puis téléchargement automatique d'une sauvegarde « avant-import », puis remplacement et
  rechargement de la page (`src/screens/Settings.tsx:70-74`, `src/backupService.ts:24-31`) ; un fichier d'une version
  plus récente est refusé avec un message ;
- Aujourd'hui : rappel de sauvegarde au-delà de 14 jours, ou si aucune sauvegarde et des parties existent
  (`src/screens/Home.tsx:86`, `src/lib/backup.ts:64`) ;
- au démarrage, demande de stockage persistant au navigateur (`src/App.tsx:52`, `src/storage.ts:4-8`) : rien n'est
  affiché.

Tests ajoutés : `src/db.test.ts`, `src/dbMigration.test.ts`, `src/lib/backup.test.ts`, `src/metaKeys.test.ts`
(16 tests : aller-retour export/import de toutes les tables et clés, fichier sans `meta`, fichier v1, fichier plus récent
refusé, migration Dexie 1 → 3, registre des clés `meta`). Dépendance de développement ajoutée : `fake-indexeddb`.

### PR #36 — Étape 2 : mesures honnêtes (`175a945..3cbf046`)
Fichiers (29 fichiers, +167 −50) :
```
 src/analysis.ts                  |  9 +++++++--
 src/analysisCards.test.ts        | 21 +++++++++++++++++++++
 src/db.ts                        |  6 +++++-
 src/game.ts                      |  1 +
 src/index.css                    |  3 +++
 src/lib/crossroadTrainer.test.ts | 17 ++++++++++++++++-
 src/lib/crossroadTrainer.ts      | 14 ++++++++++----
 src/lib/dailyPlan.test.ts        |  1 +
 src/lib/dailyPlan.ts             |  2 +-
 src/lib/goals.test.ts            |  5 +++++
 src/lib/goals.ts                 |  4 ++--
 src/lib/lessonPlan.test.ts       | 12 +++++++++++-
 src/lib/lessonPlan.ts            | 26 ++++++++++++++++++++------
 src/lib/lineTrainer.ts           | 10 ++++++----
 src/openings.ts                  |  5 +++++
 src/screens/CrossroadTrainer.tsx |  2 +-
 src/screens/Home.tsx             |  4 +++-
 src/screens/OpeningLesson.tsx    |  8 ++++++--
 src/screens/Play.tsx             | 19 +++++++++++++++----
 src/screens/PlayLines.tsx        |  7 ++++---
 src/screens/Review.tsx           |  2 +-
 src/screens/Revise.tsx           | 12 +++++++-----
 src/screens/ReviseMistake.tsx    |  4 ++--
 src/screens/ReviseThreat.tsx     |  2 +-
 src/sessionService.ts            |  2 +-
 src/threatService.ts             | 11 ++++++-----
 tests/attaques.cjs               |  3 ++-
 tests/ingame.cjs                 |  1 +
 tests/lessons.cjs                |  4 +++-
```
Changements visibles pour le joueur :
- Leçons : un bloc rejoué avec erreurs affiche « Bloc à revoir » et le sommaire « à revoir » ; seul un rejeu sans erreur
  le rend « fait » (`src/lib/lessonPlan.ts:49-63`, `src/screens/OpeningLesson.tsx:144`, `:161`) ;
- d'anciens blocs peuvent passer de « fait » à « à revoir » sans que le joueur ait rien fait (recalcul, voir § 2) ;
- Carrefours : « Refaire » le même jour ne fait plus avancer la carte (`src/lib/crossroadTrainer.ts:52-57`) ;
- Jouer : un indice, une reprise de coup ou un toucher sur « Qu'est-ce qu'il menace ? » marque la partie « avec aide »
  (`src/screens/Play.tsx:170-175`, `:196`, `:268`) ; elle est exclue des objectifs (`src/lib/goals.ts:55-57`) et ne
  coche plus l'étape « Une partie contre Maia » (`src/sessionService.ts:58`) ; mention « avec aide » dans la revue
  (`src/screens/Review.tsx:253`) ;
- libellés : drill « Vérification… », étape de séance « Une partie contre Maia » ;
- Révision : moins de cartes « Lis la menace » créées d'un coup (place restante sous le plafond, `src/screens/Home.tsx:37`,
  `src/threatService.ts:20-27`) ;
- ré-analyser une partie ne supprime plus ses cartes « Lis la menace » (`src/analysis.ts:114-116`, `:141`).

Tests ajoutés ou réécrits : `src/analysisCards.test.ts` (nouveau) ; `crossroadTrainer`, `goals`, `lessonPlan`
(5 tests ajoutés, 1 réécrit : ancien test des statuts de leçon remplacé) ; `dailyPlan` (1 assertion). Scripts Playwright
adaptés au nouveau comportement : `tests/attaques.cjs`, `tests/ingame.cjs`, `tests/lessons.cjs`.

### PR #37 — Étape 3 : explications exactes et seuil (`3cbf046..443dd34`)
Fichiers (14 fichiers, +519 −170) :
```
 docs/CARREFOURS.md                 |  10 ++---
 docs/LECONS-OUVERTURES.md          | 124 ++++++++++-----------
 docs/technical/POURQUOI-CLOTURE.md |  55 +++++++++++
 src/GoalCard.tsx                   |   4 +-
 src/data/lessonLines.ts            | 124 ++++++++++-----------
 src/lib/goals.test.ts              |  38 +++++++----
 src/lib/goals.ts                   |  42 ++++++++++---
 src/lib/moveWhy.test.ts            |  17 +++---
 src/lib/moveWhy.ts                 |  48 +++++++++----
 src/lib/report/buildReport.ts      |   4 +-
 src/lib/whyGuard.test.ts           |  83 ++++++++++++++
 src/lib/whyGuard.ts                | 136 ++++++++++++++++++++++
 src/screens/Report.tsx             |   2 +-
 tests/goals.cjs                    |   2 +-
```
Changements visibles pour le joueur :
- phrases « pourquoi » modifiées dans les leçons, lignes et carrefours (liste : `docs/technical/POURQUOI-CLOTURE.md`) :
  « semi-ouverte » au lieu de « ouverte » quand un pion reste, « matériel égal » seulement s'il l'est, intentions
  remplacées par des faits ;
- objectifs : seuil de maîtrise = point de départ + 3, entre 5 et 7 sur 10, au lieu de 7/10 fixe ; retour à seuil − 2
  au lieu de 5/10 (`src/lib/goals.ts:44-48`, `:143`) ; seuil affiché sur la carte d'objectif et dans le rapport.

Tests ajoutés ou réécrits : `src/lib/whyGuard.test.ts` (nouveau : garde-fou sur les 924 « pourquoi » calculés et les
109 phrases-panneaux) ; `goals.test.ts` (seuils, départs 0/2/4/6 ; 2 anciens tests 7/10 et 5/10 réécrits) ;
`moveWhy.test.ts` (1 test réécrit, attentes changées) ; `tests/goals.cjs` adapté.

### PR #38 — Étape 4 : fiabilité et vitesse (`443dd34..1f27ecc`)
Fichiers (18 fichiers, +618 −178) :
```
 .github/workflows/deploy.yml  |  17 +++++--
 AGENTS.md                     |   3 +-
 package-lock.json             | 190 ++++++++++++-------------
 package.json                  |   1 +
 src/App.tsx                   |  58 +++++++-------
 src/engines/maia.test.ts      |  45 ++++++++++
 src/engines/maia.ts           |  76 +++++++++++---
 src/engines/stockfish.test.ts |  77 ++++++++++++++
 src/engines/stockfish.ts      | 151 ++++++++++++++-------
 src/lib/lineTrainer.ts        |  23 +++--
 src/lib/signposts.ts          |  11 +++
 src/main.tsx                  |  20 ++--
 src/screens/Play.tsx          |   7 +-
 src/screens/Revise.tsx        |   6 +-
 tests/ci-critical.cjs         |  93 +++++++++++++
 tests/settings.cjs            |   8 +-
 tests/traps.cjs               |   2 +
 vite.config.ts                |   8 +
```
Changements visibles pour le joueur :
- écrans chargés à la demande (fichier principal 1 063 kB → 412 kB) : un court chargement possible à la première
  ouverture d'un écran ;
- Stockfish : une recherche bloquée s'arrête (délai maximal) au lieu de rester figée ; Maia : relance automatique une fois,
  puis message clair ;
- Révision : correction d'une régression de la PR #36 (écran vide après création de cartes menace) ;
- pas de changement de données. CI : actions GitHub en Node 24, parcours critiques Playwright ajoutés au contrôle `build`,
  `npm audit fix` (10 → 4 vulnérabilités).

Tests ajoutés : `src/engines/maia.test.ts`, `src/engines/stockfish.test.ts` (8 tests avec de faux workers) ;
`tests/ci-critical.cjs` (5 parcours, lancé en CI) ; `tests/settings.cjs` et `tests/traps.cjs` réparés.
Dépendance de développement ajoutée : `playwright` 1.63.0.

### PR #39 — Étape 5 : mémoire active et progrès (`1f27ecc..838ed0a`)
Fichiers (16 fichiers, +433 −10) :
```
 src/App.tsx                    |  4 +++-
 src/LineChart.tsx              | 45 ++++++++++++
 src/icons.tsx                  |  2 +-
 src/index.css                  |  6 +++++
 src/lib/exam.ts                | 22 ++++++
 src/lib/progressCurves.test.ts | 63 ++++++++++++++++
 src/lib/progressCurves.ts      | 50 ++++++++++++
 src/lib/shuffle.ts             | 20 ++++++
 src/metaKeys.test.ts           |  4 ++--
 src/metaKeys.ts                |  5 +++-
 src/nav.ts                     |  3 ++-
 src/router.ts                  |  4 +++-
 src/screens/Exam.tsx           | 91 ++++++++++++++++++++++++
 src/screens/OpeningPage.tsx    | 11 +++++--
 src/screens/Progress.tsx       | 32 ++++++++-
 tests/exam.cjs                 | 81 ++++++++++++++++++++
```
Changements visibles pour le joueur :
- Lignes : option « Mélanger » ;
- page d'une ouverture : bouton « Examen » (10 positions, score /10) ; les positions ratées reviennent dans le drill du
  jour (`src/screens/Exam.tsx:24`) ;
- Progrès : trois courbes (pièces données par partie, réussite sans aide en révision, classement Chess.com Rapid).

Tests ajoutés : `src/lib/progressCurves.test.ts` (5 tests : 3 courbes, mélange, examen) ; `metaKeys.test.ts` passe de
26 à 27 clés ; `tests/exam.cjs` (Playwright, hors CI).

### PR #40 — Étape 6 : captures (`838ed0a..bfcb506`)
Fichiers (44 fichiers, +505 −10) : 38 captures `docs/captures/ipad-portrait/*.jpg` et `docs/captures/iphone/*.jpg`
(binaires, non listées ici), plus :
```
 docs/captures/CAPTURES.md   |  69 ++++++++
 docs/captures/defauts.json  | 275 ++++++++++++++++++
 docs/project/DECISIONS.md   |   1 +
 docs/project/RISKS.md       |   6 +-
 docs/project/STATUS.md      |  20 ++--
 tests/captures.cjs          | 144 ++++++++++++++
```
Changements visibles pour le joueur : aucun (documentation et script de captures). Tests : `tests/captures.cjs`
(Playwright, hors CI).

## 2. Données

### Versions
| | Avant (tag `ad76851`) | Après (`bfcb506`) | Preuve |
|---|---|---|---|
| Schéma Dexie | version 3 | version 3 (inchangé) | `diff` de la classe `SparringDB` entre les deux versions : identique ; `src/db.ts:208-220` |
| Format d'export | `version: 3` écrit en dur | `version: BACKUP_VERSION` = 3 | ancien `src/db.ts:238` ; `src/lib/backup.ts:5`, `src/db.ts:243` |

Aucune table ni index ajouté. Les changements de données sont des champs facultatifs et des clés `meta` en plus.

### Ce qui écrit dans les données existantes
| Traitement | Quand | Ce qui est écrit | Réversible ? |
|---|---|---|---|
| Recalcul des blocs de leçon (« fait » → « à revoir ») | à l'affichage | **Rien** : statut calculé à la lecture (`src/lib/lessonPlan.ts:49-63`) depuis `replays` et `errors` déjà enregistrés. Un bloc ancien avec `replays ≤ errors` s'affiche « à revoir » ; sans `errors`, il reste « fait ». | Oui : l'ancien code relit les mêmes compteurs et affiche « fait » (testé, § 3). |
| Compteur `clean` des blocs | à chaque rejeu sans erreur | `lessonState:<ouverture>` : `clean + 1` (`src/screens/OpeningLesson.tsx:144`). `openingLessons` n'avance plus que sur un rejeu sans erreur (`:161`). | Oui : champ ignoré par l'ancien code. |
| Partie avec aide | à l'usage d'une aide | `meta.current.assisted = true` (`src/screens/Play.tsx:170-175`, `:196`), puis `games.assisted` à la fin de la partie (`src/game.ts:70`). Seules les parties jouées après la PR #36 sont concernées. | Oui : champ ignoré par l'ancien code, qui recompte ces parties dans les objectifs (testé : 12 parties mesurées par le tag, 9 par la version actuelle). |
| Compteurs d'indices | à chaque tentative | `hints` ajouté dans `cards.attempts` (`src/screens/ReviseMistake.tsx:59`, `:86` ; `src/screens/ReviseThreat.tsx:60`), dans `crossroads:<ouverture>` (`src/lib/crossroadTrainer.ts:56-59`, appel `src/screens/CrossroadTrainer.tsx:77`) et `lineProgress` (`src/lib/lineTrainer.ts:124-127`, appel `src/screens/PlayLines.tsx:116`). Anciennes tentatives : sans `hints`, comptées « sans indice » dans la courbe (`src/lib/progressCurves.ts:37`). | Oui : champ en plus, ignoré par l'ancien code (testé). |
| « Refaire » aux carrefours | réponse refaite le même jour | tentative ajoutée avec `retry: true`, étape et échéance inchangées (`src/lib/crossroadTrainer.ts:55-56`). | Oui (testé). L'ancien code ferait de nouveau avancer la carte. |
| État des objectifs | **au démarrage** (chargement des objectifs) | `meta.goals` réécrit dès que l'état calculé diffère (`src/goalService.ts:35-40`, fichier inchangé). Le nouvel `updateGoals` ajoute toujours un champ `thresholds` (`src/lib/goals.ts:137`) : `meta.goals` est donc réécrit au premier démarrage. Avec le seuil abaissé (5 à 7 au lieu de 7), l'objectif actif a pu être déclaré maîtrisé au premier démarrage (date, message, objectif suivant) ; le seuil atteint est mémorisé (`:158`). | Oui pour les données (aucune perte, testé) ; non pour l'effet : l'ancien code garde l'objectif maîtrisé et applique son retour à 5/10 (ancien `src/lib/goals.ts:122`). Effet sur l'iPad du propriétaire : **non vérifié**. |
| Nouvelles clés `meta` | sauvegarde ; examen | `lastBackupAt` (`src/backupService.ts:16`, `:29`) ; `examResults` (`src/screens/Exam.tsx:20-21`). | Oui : clés ignorées par l'ancien code (testé). |
| Examen : positions ratées | fin d'un examen | cartes de drill des positions ratées remises à `step: 0, due: aujourd'hui` (`src/screens/Exam.tsx:24`). | Non : l'ancien intervalle de répétition de ces cartes est perdu (effet voulu par le brief). |
| Cartes « Lis la menace » | Aujourd'hui, Révision | moins de cartes créées (plafond, `src/threatService.ts:20-27`) ; ré-analyse : seules les cartes d'erreur de la partie sont remplacées (`src/analysis.ts:114-116`). | Oui ; la ré-analyse est moins destructrice qu'avant (l'ancien code supprimait toutes les cartes de la partie). |
| Import | action du joueur | sauvegarde « avant-import » téléchargée d'abord ; `meta` et `openings` gardées si absentes du fichier ; `games`, `cards`, `holes`, `mateRuns` toujours remplacées (`src/db.ts:253-264`). | Oui : sauvegarde téléchargée avant toute écriture (`src/backupService.ts:24-31`). |
| Stockage persistant | au démarrage | demande au navigateur, rien dans la base (`src/App.tsx:52`, `src/storage.ts:4-8`). | Sans objet ; l'autorisation du navigateur reste après un retour arrière. Comportement de Safari sur iPad : **non vérifié**. |

Aucune migration Dexie, aucun renommage ni suppression de clé `meta` (`src/metaKeys.ts`, test `src/metaKeys.test.ts`).

## 3. Compatibilité (testée)

Méthode : le code du tag extrait dans un dossier temporaire (`git worktree add --detach … v1.0-avant-refonte`), un script
TypeScript hors du dépôt qui importe l'ancien et le nouveau `src/db.ts` (et `lessonPlan`, `goals`, `crossroadTrainer`)
dans le même processus, sur la même base IndexedDB simulée (`fake-indexeddb`), regroupé par `esbuild` et lancé avec Node.
Données d'exemple écrites pour couvrir chaque champ et chaque clé ajoutés (pas l'export réel du propriétaire).

Résultat réel (`node compat.mjs`) :
```
=== A. Export du tag v1.0-avant-refonte → import dans la version actuelle ===
OK   export du tag : version 3 — version=3
OK   importAll actuel accepte le fichier — {"migratedFrom":3,"games":2,"cards":3}
OK   contenu importé identique au fichier (6 tables ; carte sans type → mistake)
OK   lastBackupAt de l’appareil remplacé par la meta du fichier (le fichier n’en a pas)
     statut des blocs (ancien → actuel) : b1 done → done ; b2 done → done ; b3 done → review

=== B. Base utilisée par la version actuelle → ouverte par le code du tag ===
OK   le tag ouvre la base (même schéma Dexie v3) — verno=3
OK   le tag relit toutes les tables à l’identique (champs et clés nouvelles comprises)
     statut des blocs (tag / actuel) : b1 done / done ; b2 done / review
     parties mesurées (tag / actuel) : 12 / 9
OK   updateGoals du tag accepte un état avec `thresholds` et le conserve
OK   afterAnswer du tag accepte des tentatives avec `hints` et `retry`
OK   la version actuelle relit la base après écriture par le tag

=== C. Export de la version actuelle → import par le code du tag ===
OK   export actuel : version 3 — version=3
OK   importAll du tag accepte le fichier et restitue les 6 tables à l’identique
OK   clés nouvelles conservées (lastBackupAt, examResults, goals.thresholds)

Tous les contrôles passent
```

Réponses :
- **Un export du tag s'importe-t-il dans la version actuelle ?** Oui (A) : contenu identique, statut « à revoir »
  recalculé à l'affichage pour les blocs dont `replays ≤ errors`.
- **Le code du tag peut-il ouvrir une base utilisée par la version actuelle ?** Oui (B) : même schéma Dexie v3, toutes les
  tables relues à l'identique, champs et clés en plus ignorés sans erreur. La version actuelle relit ensuite la base après
  écriture par le tag (aller-retour).
- **Un export actuel peut-il être relu par l'ancien code ?** Oui (C) : les 6 tables sont restituées à l'identique, clés
  nouvelles comprises. À noter : l'ancien `importAll` ne lit pas `version` et vide toujours `meta` (ancien
  `src/db.ts:249`, `:252`) ; sans effet sur un export de l'appli, qui contient toujours `meta`.

**Conclusion : le retour arrière est possible sans perte de données.** Aucune migration n'est nécessaire : l'ancien code
ouvre la base telle quelle. Ce qui change au retour arrière, c'est le comportement, pas les données :
- les blocs « à revoir » redeviennent « fait » ; les parties « avec aide » comptent de nouveau dans les objectifs ;
- seuil d'objectif de nouveau 7/10, retour à 5/10 ; un objectif maîtrisé avec le nouveau seuil reste maîtrisé, mais
  redevient actif si ses parties propres tombent à 5/10 ou moins ;
- examens, date de dernière sauvegarde, compteurs d'indices et `clean` restent dans la base, invisibles, et réapparaissent
  si l'on revient ensuite à la version actuelle.

Comment (à décider par le propriétaire et le directeur de projet ; aucun retour arrière n'a été fait) :
1. avant tout : exporter les données depuis Réglages (version actuelle) et garder le fichier ;
2. ouvrir une PR qui ramène le code de l'appli à l'état du tag (par exemple `git revert -m 1` des fusions #40 à #35, dans
   l'ordre inverse), contrôles verts, puis fusion par le propriétaire : le site est republié ;
3. sur l'iPad, l'ancienne version s'installe seule au lancement suivant (service worker en mise à jour automatique) et
   relit la base existante ; aucun import n'est nécessaire ;
4. le fichier exporté au point 1 reste la sauvegarde ; l'ancien code l'importe si besoin (test C).

Points non vérifiés : test sur l'iPad (Safari, IndexedDB réelle) ; test avec l'export réel du propriétaire (820 cartes) ;
build et déploiement du code du tag avec les dépendances actuelles ; comportement du service worker lors d'un retour à
une version plus ancienne.

## 4. Écarts

### Fait au-delà du brief
- PR #34 (audit P1-01) fusionnée par Claude Code, à la demande du brief, sans validation du directeur de projet.
- AGENTS.md, CLAUDE.md et D-011 réécrits selon la fausse « décision du propriétaire » (répartition Codex retirée,
  fusion par l'agent).
- Partie « avec aide » : le toucher sur « Qu'est-ce qu'il menace ? » compte aussi comme aide (le brief citait indices et
  reprise de coup).
- Fichiers d'interface (domaine de Codex) modifiés sans note dans `HANDOFF.md` : `src/App.tsx`, `src/GoalCard.tsx`,
  `src/LineChart.tsx`, `src/icons.tsx`, `src/index.css`, `src/nav.ts`, `src/router.ts` et 14 écrans de `src/screens/`.
- Dépendances de développement ajoutées : `fake-indexeddb` (#35), `playwright` 1.63.0 (#38).
- Captures : relevé automatique des textes qui se chevauchent, en plus des défauts demandés.
- Corrections de régressions introduites pendant le brief (voir plus bas).

### Pas fait, ou fait autrement
- Registre `meta` : le brief annonçait 27 clés ; le code en utilisait 25, plus `lastBackupAt` = 26 à l'étape 1 ; 27 après
  `examResults` (étape 5). Aucune clé renommée.
- Courbe « réussite sans aide en révision » : par jour, sur les 30 derniers jours où une carte a été révisée, pas sur les 30 dernières parties
  (`src/lib/progressCurves.ts:27-41`) ; les tentatives d'avant le 28/11/2026 n'ont pas de compteur d'indices et comptent
  « sans indice ».
- `npm audit` : 4 vulnérabilités « moderate » restent (glob, minimatch, vite-plugin-pwa, workbox-build ; `npm audit --json`
  relancé pour cette revue) ; correctif = vite-plugin-pwa 1.1.0, rupture.
- Lint : 4 avertissements `react-refresh/only-export-components` restent (non demandés).
- 9 « pourquoi » écrits à la main signalés par le garde-fou, non corrigés (avertissements, `docs/technical/POURQUOI-CLOTURE.md`).
- 3 défauts d'affichage relevés, non corrigés comme demandé (`docs/captures/CAPTURES.md`, section « Défauts d'affichage
  vus ») : « En boucle » et « Mélanger » se chevauchent (onglet Lignes, iPad et iPhone, introduit par la PR #39) ; filtre
  « Validées » coupé sur iPhone (33 px) ; bas de la carte de révision masqué par « Toutes mes cartes » sur iPhone.

### Régressions connues
- Introduite par la PR #36, corrigée par la PR #38 : l'écran Révision restait vide après création de cartes menace
  (vue par `tests/explore.cjs`). Cette version a été publiée de 11:25 à 12:20 UTC (exécutions n°156 à n°160).
- Introduites par la PR #38 et corrigées dans la même PR avant fusion : écran Jouer resté monté après navigation rapide
  (`tests/material.cjs`), crochet `__db` absent après rechargement (`tests/motifs.cjs`).
- Défaut d'affichage « En boucle » / « Mélanger » (PR #39), non corrigé.

### Non vérifié
- Aucun test sur iPad ni dans Safari/WebKit : les parcours Playwright tournent dans Chromium.
- Effet du premier démarrage sur les objectifs du propriétaire (maîtrise possible avec le nouveau seuil) et nombre de blocs
  de leçon passés « à revoir ».
- Les 37 scripts Playwright hors CI (`tests/*.cjs` sauf `ci-critical.cjs`) n'ont pas tous été relancés sur `main` après la dernière fusion.
- Chargement différé et service worker hors ligne sur iPad.

## 5. État de `main` et dernière publication
- `main` = `bfcb506` (fusion de la PR #40), protégé par le ruleset « protection-main ».
- Fusions et publications du 28/11/2026 (heures UTC, toutes les exécutions réussies) : #34 à 11:05 (n°152), #35 à 11:13
  (n°154), #36 à 11:24 (n°156), #37 à 11:37 (n°158), #38 à 12:18 (n°160), #39 à 12:23 (n°162), #40 à 12:31 (n°164).
- Exécution n°164 (« Tests et déploiement GitHub Pages », push sur `main`, `bfcb506`) : **réussie**. Job `build` : npm ci,
  lint, tests, build, installation de Chromium, parcours critiques, envoi de l'artefact, tous réussis ; job `deploy`
  (`actions/deploy-pages@v5`) réussi à 12:33 UTC. La version issue du brief est donc en production.
- Revérifié localement pour cette revue : `npx vitest run` → 48 fichiers, 475 tests, tous passent.

## 6. À vérifier sur l'iPad (propriétaire)

**Étape 1 — Règles et données**
1. Réglages : « Stockage protégé » affiche oui ou non, et « Dernière sauvegarde » une date.
2. Réglages → Exporter : un fichier `.json` se télécharge ; la date de dernière sauvegarde devient « aujourd'hui ».
3. Le nombre de cartes (820) et de parties est inchangé.

**Étape 2 — Mesures honnêtes**
1. Ouvrir une leçon déjà faite : noter les blocs passés « à revoir ».
2. Rejouer un bloc avec une erreur : « Bloc à revoir » ; le rejouer sans erreur : « Bloc réussi ».
3. Jouer une partie en demandant un indice : la revue affiche « avec aide ».
4. Carrefours : « Refaire » une carte déjà répondue aujourd'hui ne la fait pas avancer.

**Étape 3 — Explications et seuil**
1. Carte d'objectif : le seuil affiché (5, 6 ou 7 sur 10) et l'état (maîtrisé ou non) sont plausibles.
2. Lire trois « pourquoi » d'une leçon : aucune phrase fausse sur la position.
3. Un message « Objectif maîtrisé » inattendu est-il apparu au premier lancement ?

**Étape 4 — Fiabilité et vitesse**
1. Ouvrir chaque onglet : chargement rapide, pas d'écran blanc.
2. Jouer 10 coups contre Maia : elle répond toujours.
3. Couper le réseau, relancer l'appli : elle s'ouvre hors ligne.

**Étape 5 — Mémoire active et progrès**
1. Lignes : « Mélanger » change l'ordre (et vérifier le chevauchement avec « En boucle »).
2. Une ouverture → Examen : 10 positions, score /10 ; une position ratée revient dans le drill du jour.
3. Progrès : les trois courbes s'affichent avec des valeurs plausibles.

**Étape 6 — Captures**
1. Comparer 3 captures de `docs/captures/ipad-portrait/` avec l'écran réel de l'iPad.
2. Confirmer ou non les 3 défauts listés dans `docs/captures/CAPTURES.md`.
