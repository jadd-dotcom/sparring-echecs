# Captures — vérification visuelle (brief de clôture, étape 6)

Prises le 28/11/2026 sur `main` après l’étape 5, par `node tests/captures.cjs docs/captures` (Playwright, Chromium, thème sombre,
facteur d’échelle 2, JPEG qualité 70). Données d’exemple créées par le script : 8 parties Chess.com Rapid analysées, une partie à revoir,
une carte de révision due, une partie en cours avec du matériel pris des deux côtés.

Relevé automatique des défauts (`defauts.json`) : défilement horizontal de la page, élément qui déborde de l’écran, texte coupé
(débordement masqué), textes qui se chevauchent. Le contenu qui défile sous une barre fixe (onglets) n’est pas compté.

## iPad portrait (820×1180)

| # | Écran | Capture | Défauts relevés |
|---|---|---|---|
| 1 | Aujourd’hui | [01-aujourdhui.jpg](ipad-portrait/01-aujourdhui.jpg) | aucun |
| 2 | Partie en cours (matériel) | [02-partie-en-cours.jpg](ipad-portrait/02-partie-en-cours.jpg) | aucun |
| 3 | Ouvertures | [03-ouvertures.jpg](ipad-portrait/03-ouvertures.jpg) | aucun |
| 4 | Page d’une ouverture : onglet Leçon | [04-ouverture-lecon.jpg](ipad-portrait/04-ouverture-lecon.jpg) | aucun |
| 5 | Page d’une ouverture : onglet Lignes | [05-ouverture-lignes.jpg](ipad-portrait/05-ouverture-lignes.jpg) | textes qui se chevauchent : &lt;label .unrated-toggle&gt; « En boucle » et &lt;label .unrated-toggle&gt; « Mélanger » |
| 6 | Page d’une ouverture : onglet Carrefours | [06-ouverture-carrefours.jpg](ipad-portrait/06-ouverture-carrefours.jpg) | aucun |
| 7 | Page d’une ouverture : onglet Pièges | [07-ouverture-pieges.jpg](ipad-portrait/07-ouverture-pieges.jpg) | aucun |
| 8 | Bloc de leçon | [08-bloc-lecon.jpg](ipad-portrait/08-bloc-lecon.jpg) | aucun |
| 9 | Jouer les lignes | [09-jouer-lignes.jpg](ipad-portrait/09-jouer-lignes.jpg) | aucun |
| 10 | Examen | [10-examen.jpg](ipad-portrait/10-examen.jpg) | aucun |
| 11 | Carte Carrefours | [11-carte-carrefours.jpg](ipad-portrait/11-carte-carrefours.jpg) | aucun |
| 12 | Pièges | [12-pieges.jpg](ipad-portrait/12-pieges.jpg) | aucun |
| 13 | Mats | [13-mats.jpg](ipad-portrait/13-mats.jpg) | aucun |
| 14 | Échiquier (maîtrise) | [14-echiquier.jpg](ipad-portrait/14-echiquier.jpg) | aucun |
| 15 | Carte de révision | [15-carte-revision.jpg](ipad-portrait/15-carte-revision.jpg) | aucun |
| 16 | Revue de partie | [16-revue.jpg](ipad-portrait/16-revue.jpg) | aucun |
| 17 | Explorer | [17-explorer.jpg](ipad-portrait/17-explorer.jpg) | aucun |
| 18 | Progrès (courbes) | [18-progres.jpg](ipad-portrait/18-progres.jpg) | aucun |
| 19 | Réglages | [19-reglages.jpg](ipad-portrait/19-reglages.jpg) | aucun |

## iPhone (390×844)

| # | Écran | Capture | Défauts relevés |
|---|---|---|---|
| 1 | Aujourd’hui | [01-aujourdhui.jpg](iphone/01-aujourdhui.jpg) | aucun |
| 2 | Partie en cours (matériel) | [02-partie-en-cours.jpg](iphone/02-partie-en-cours.jpg) | aucun |
| 3 | Ouvertures | [03-ouvertures.jpg](iphone/03-ouvertures.jpg) | aucun |
| 4 | Page d’une ouverture : onglet Leçon | [04-ouverture-lecon.jpg](iphone/04-ouverture-lecon.jpg) | aucun |
| 5 | Page d’une ouverture : onglet Lignes | [05-ouverture-lignes.jpg](iphone/05-ouverture-lignes.jpg) | déborde de l’écran à droite de 33 px : &lt;button&gt; « Validées »<br>textes qui se chevauchent : &lt;label .unrated-toggle&gt; « En boucle » et &lt;label .unrated-toggle&gt; « Mélanger » |
| 6 | Page d’une ouverture : onglet Carrefours | [06-ouverture-carrefours.jpg](iphone/06-ouverture-carrefours.jpg) | aucun |
| 7 | Page d’une ouverture : onglet Pièges | [07-ouverture-pieges.jpg](iphone/07-ouverture-pieges.jpg) | aucun |
| 8 | Bloc de leçon | [08-bloc-lecon.jpg](iphone/08-bloc-lecon.jpg) | aucun |
| 9 | Jouer les lignes | [09-jouer-lignes.jpg](iphone/09-jouer-lignes.jpg) | aucun |
| 10 | Examen | [10-examen.jpg](iphone/10-examen.jpg) | aucun |
| 11 | Carte Carrefours | [11-carte-carrefours.jpg](iphone/11-carte-carrefours.jpg) | aucun |
| 12 | Pièges | [12-pieges.jpg](iphone/12-pieges.jpg) | aucun |
| 13 | Mats | [13-mats.jpg](iphone/13-mats.jpg) | aucun |
| 14 | Échiquier (maîtrise) | [14-echiquier.jpg](iphone/14-echiquier.jpg) | aucun |
| 15 | Carte de révision | [15-carte-revision.jpg](iphone/15-carte-revision.jpg) | textes qui se chevauchent : &lt;p .muted.small&gt; « Solution : après 2 essais ratés ou 2 indices · Pas » et &lt;button .ghost&gt; « Toutes mes cartes » |
| 16 | Revue de partie | [16-revue.jpg](iphone/16-revue.jpg) | aucun |
| 17 | Explorer | [17-explorer.jpg](iphone/17-explorer.jpg) | aucun |
| 18 | Progrès (courbes) | [18-progres.jpg](iphone/18-progres.jpg) | aucun |
| 19 | Réglages | [19-reglages.jpg](iphone/19-reglages.jpg) | aucun |

## Défauts d’affichage vus (non corrigés)

1. **« En boucle » et « Mélanger » se chevauchent** dans la barre d’entraînement de l’onglet Lignes, sur iPad et sur iPhone
   (`ipad-portrait/05-ouverture-lignes.jpg`, `iphone/05-ouverture-lignes.jpg`). Introduit à l’étape 5 (case « Mélanger » ajoutée
   dans la même cellule de grille que « En boucle »).
2. **Filtre « Validées » coupé** sur iPhone : la rangée de filtres (Toutes, À refaire, Jamais jouées, Validées) défile
   horizontalement à l’intérieur de la page sans indication ; le dernier filtre déborde de 33 px (`iphone/05-ouverture-lignes.jpg`).
3. **Carte de révision sur iPhone : bas du panneau masqué** par la barre « Toutes mes cartes » ; la ligne « Solution : après 2
   essais ratés… » et le bas des boutons Indice / Solution / Passer sont recouverts (`iphone/15-carte-revision.jpg`).

Aucun défilement horizontal de page ni texte coupé (débordement masqué) relevé sur les 38 captures.

