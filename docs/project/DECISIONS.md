# Décisions

| N° | Date | Décision | Justification |
|---|---|---|---|
| D-001 | 28/11/2026 | Travail dans le cloud, GitHub comme source de vérité ; l'iPad du propriétaire est l'appareil de référence pour les tests et les données. | Les agents travaillent dans des environnements éphémères ; seul le dépôt GitHub est durable, et les données réelles sont sur l'iPad. |
| D-002 | 28/11/2026 | Le tag `v1.0-avant-refonte` est le point de retour. | Il marque la dernière version stable publiée avant la refonte (`ad76851`). |
| D-003 | 28/11/2026 | Rien n'arrive sur `main` sans PR contrôlée et validée par le directeur de projet. | Toute fusion sur `main` publie le site en production. |
| D-004 | 28/11/2026 | Claude Code = technique et pédagogie ; Codex = design et UX. | Des domaines séparés évitent que deux agents modifient les mêmes fichiers sans coordination. |
| D-005 | 28/11/2026 | Le rapport d'audit V2 est une orientation, pas une spécification : chaque constat se vérifie sur le dépôt. | Un constat non vérifié peut être faux ou périmé. |
| D-006 | 28/11/2026 | La base actuelle est conservée ; pas de réécriture complète sans justification démontrée. | L'appli fonctionne (lint, typage, 439 tests et build passent) et contient la progression du propriétaire. |
| D-007 | 28/11/2026 | Aucune fusion sur contrôle rouge, même si la cause est connue. | Une fusion publie le site : seul un contrôle vert sur la version exacte de la PR prouve qu'elle passe. |
| D-008 | 28/11/2026 | La branche de session peut être réutilisée d'une mission à l'autre si elle repart de `main` à jour. | L'environnement cloud n'autorise les pushes que sur la branche de session ; repartir de `main` garde une PR par mission sans historique mêlé. |
