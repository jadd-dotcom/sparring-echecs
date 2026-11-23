# Sparring Échecs

Appli web (PWA) d'entraînement aux échecs pour tablette, 100 % dans le navigateur :

- **Adversaire humain** : Maia-3 (variante 5M, paquet `maia3-js`) jouant ~50 points au-dessus de ton niveau estimé.
- **Niveau adaptatif** (échelle de l'appli proche de Lichess, 550–2600, départ 900, K = 80 pendant 10 parties puis 32 ;
  réglable à la main, ce qui relance la calibration). Couleur : Blancs, Noirs ou Alterner.
- **Analyse d'après-partie** par Stockfish 19 lite (single-thread) : imprécisions / erreurs / gaffes selon la chute de % de gain.
- **Paquet de révision** (J+1, J+3, J+7, J+14, J+30 ; raté → J+1).
- **Stats** : courbe de niveau, V/N/D, gaffes par partie. Export/import JSON.
- **Rapport pour Claude (V1.5)** : rapport Markdown (résumé, phases, motifs d'erreur, 10 pires erreurs avec FEN/ASCII/suites
  Stockfish, PGN annotés, cartes ratées) à copier ou partager. Exemple : `docs/exemple-rapport.md`.
- **Mats élémentaires** : D+R, deux tours (échelle), T+R (boîte), deux fous — leçon en 5 étapes puis exercices contre
  Stockfish en défense maximale, validation par niveau, positions ratées dans le paquet de révision.
- **Ouvertures (V2)** : répertoire en PGN à variantes vérifié par Stockfish — Blancs : Anglaise, système fermé ;
  Noirs : système …c5/…g6 (Dragon accéléré contre 1.e4) ; l'ancien répertoire (Londres, GDR, Française) est dans l'onglet
  « Archives ». Leçons, parties à thème, sorties signalées en revue, trous du répertoire, drill, stats par ouverture.
- **Import Chess.com** : pseudo dans Réglages, « Importer mes parties » (API publique, seulement les nouvelles ; plan B :
  coller un PGN). Parties analysées comme celles contre Maia (automatiquement depuis le 16/11/2026, les plus récentes
  d'abord ; les anciennes à la demande ; progression et temps restant), marquées « Chess.com », sans effet sur le niveau Maia,
  avec le suivi de mon répertoire. Incluses dans le rapport pour Claude (par source et par ouverture).

## Développement

```bash
npm ci
npm run dev        # copie les binaires (modèle, Stockfish) puis lance Vite
npm test           # tests unitaires (niveau, intervalles, classement, tirage Maia)
npm run build      # build de production dans dist/
npx vite preview --port 4173
node tests/selftest20.cjs   # 20 parties Maia vs aléatoire dans Chromium (Playwright)
node tests/e2e.cjs <dossier-captures>   # parcours tactile complet sur iPad émulé
node tests/offline.cjs <url>            # mesures + test hors ligne
node tests/v2.cjs <dossier-captures>    # parcours Ouvertures (V2)
node tests/report.cjs <dossier-captures> # 3 parties de test → docs/exemple-rapport.md (V1.5)
node tests/mates.cjs <dossier-captures>  # onglet Mats élémentaires
npm run verify-mates                    # 20 positions/niveau, Stockfish joue mon camp → docs/MATS.md
node tests/settings.cjs <dossier-captures> # réglages : niveau, couleur, alternance
node tests/cancel.cjs <dossier-captures>   # annulation et partie non comptée
node tests/lessons.cjs <dossier-captures>  # mode Leçon (Anglaise) et onglet Archives
node tests/chesscom.cjs <dossier-captures> # import Chess.com sur des réponses enregistrées (aucun réseau)
node tests/ingame.cjs <dossier-captures>   # navigation en partie, sons, assistance (non comptée)
node tests/review2.cjs <dossier-captures>  # revue : raison, Réessayer, courbe, précision
node tests/appearance.cjs <dossier-captures> # thème, pièces, zones tactiles ≥ 48 px, aucun emoji
node tests/coords.cjs <dossier-captures>     # coordonnées jamais sous les pièces (3 jeux, 5 écrans, au pixel)
node tests/screens.cjs <dossier> [url]     # captures accueil/partie/revue/Mats (iPhone, iPad ; sombre, clair)
npm run lessons-doc                     # docs/LECONS-OUVERTURES.md depuis les données
node tests/public.cjs <url>             # test de l'URL publique (chargement, Maia, analyse, hors ligne)
npm run validate-repertoire             # vérif Stockfish du répertoire pré-chargé → docs/REPERTOIRE.md
```

Déploiement : GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`).

## Licences

Code de l'appli : GPL-3.0 (imposée par Stockfish). Maia3-js : MIT. Stockfish.js : GPL-3.0.
chess.js : BSD-2-Clause. react-chessboard : MIT. onnxruntime-web : MIT. Dexie : Apache-2.0.

Apparence (toutes compatibles avec la GPL-3.0 de l'appli) :
- **Pièces** — jeux libres repris du dépôt de Lichess (`lila/public/piece`), dans `public/pieces/` :
  - *Celtic* (par défaut) : © Maurizio Monge, [chess-art](https://github.com/maurimo/chess-art), licence MIT ;
  - *Merida* : © Armando Hernandez Marroquin, licence GPLv2 ou ultérieure ;
  - *Cburnett* : © Colin M.L. Burnett, licence GPLv2 ou ultérieure.
- **Police** : Inter, © The Inter Project Authors, SIL Open Font License 1.1 (sous-ensemble latin, `src/assets/fonts/`,
  licence dans `src/assets/fonts/Inter-OFL.txt`), servie avec l'appli pour le hors ligne.
- **Icônes** : [Lucide](https://lucide.dev), licence ISC. Les pastilles de classement des coups sont dessinées pour l'appli.
- Aucune pièce, icône, image, son ni logo de Chess.com n'est utilisé.
