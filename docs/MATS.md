# Mats élémentaires — vérification Stockfish

Pour chaque niveau, 20 positions précalculées (src/data/matePositions.json, symétrie tirée au hasard, graine fixe) ; minimum = distance exacte au mat (analyse rétrograde). Stockfish natif (/usr/games/stockfish) joue mon camp (300 ms/coup) contre lui-même en défense maximale (300 ms/coup). Réussite = position légale et mat en au plus « minimum + 10 » coups. Une position qui échoue est rejouée une fois à 1000 ms par coup (les deux essais sont notés).

## Dame + roi contre roi

20/20 dans la limite · 34 s

| # | Position | Légale | Mat en (min) | Coups joués | Issue | OK |
|---|---|---|---|---|---|---|
| 1 | `8/8/8/4k3/8/Q7/5K2/8 w - - 0 1` | oui | 8 | 8 | mate | ✅ |
| 2 | `8/8/8/Q7/6k1/8/8/7K w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 3 | `8/7Q/2k5/5K2/8/8/8/8 w - - 0 1` | oui | 7 | 7 | mate | ✅ |
| 4 | `8/8/5k2/8/8/8/2K5/1Q6 w - - 0 1` | oui | 8 | 8 | mate | ✅ |
| 5 | `8/8/8/4k3/Q7/1K6/8/8 w - - 0 1` | oui | 8 | 8 | mate | ✅ |
| 6 | `8/2K5/5k2/7Q/8/8/8/8 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 7 | `8/8/4k3/8/6K1/8/8/6Q1 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 8 | `5Q2/3K4/8/3k4/8/8/8/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 9 | `8/8/3k4/8/2K5/7Q/8/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 10 | `8/Q7/3K4/8/5k2/8/8/8 w - - 0 1` | oui | 7 | 7 | mate | ✅ |
| 11 | `8/8/5k2/Q7/8/8/4K3/8 w - - 0 1` | oui | 7 | 8 | mate | ✅ |
| 12 | `1Q6/8/8/8/8/2k5/4K3/8 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 13 | `8/8/3k4/7Q/8/K7/8/8 w - - 0 1` | oui | 7 | 7 | mate | ✅ |
| 14 | `8/7Q/8/8/2k5/8/8/2K5 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 15 | `7Q/8/4k3/8/8/8/7K/8 w - - 0 1` | oui | 7 | 9 | mate | ✅ |
| 16 | `8/8/8/8/2k3K1/4Q3/8/8 w - - 0 1` | oui | 7 | 8 | mate | ✅ |
| 17 | `8/Q7/8/5k2/8/8/5K2/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 18 | `8/8/8/2K5/8/5k2/2Q5/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 19 | `6Q1/7K/8/4k3/8/8/8/8 w - - 0 1` | oui | 7 | 7 | mate | ✅ |
| 20 | `7K/2Q5/8/8/3k4/8/8/8 w - - 0 1` | oui | 9 | 9 | mate | ✅ |

## Deux tours contre roi (l’échelle)

20/20 dans la limite · 21 s

| # | Position | Légale | Mat en (min) | Coups joués | Issue | OK |
|---|---|---|---|---|---|---|
| 1 | `7K/8/4R3/8/1k6/7R/8/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 2 | `6K1/8/8/5R2/8/3k4/R7/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 3 | `6R1/8/8/4k3/8/8/3K4/3R4 w - - 0 1` | oui | 5 | 6 | mate | ✅ |
| 4 | `8/2K5/3R4/5k2/8/8/7R/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 5 | `8/8/2R5/8/8/3k4/R6K/8 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 6 | `8/8/8/K5R1/3k4/8/8/2R5 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 7 | `8/8/R6R/5k2/8/2K5/8/8 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 8 | `1RK5/8/8/5k2/8/1R6/8/8 w - - 0 1` | oui | 5 | 6 | mate | ✅ |
| 9 | `2R5/2R5/8/8/4k3/7K/8/8 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 10 | `8/8/8/4k3/7R/8/1K1R4/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 11 | `R7/8/3k4/8/3K4/8/1R6/8 w - - 0 1` | oui | 3 | 3 | mate | ✅ |
| 12 | `8/8/8/6R1/8/3k3K/8/R7 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 13 | `1K6/8/7R/8/5k2/8/8/2R5 w - - 0 1` | oui | 6 | 7 | mate | ✅ |
| 14 | `8/8/6k1/8/KR1R4/8/8/8 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 15 | `3R4/8/8/2k5/5K2/8/7R/8 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 16 | `8/8/8/2k5/8/6R1/8/R6K w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 17 | `8/8/3k4/1R5R/8/8/8/6K1 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 18 | `K7/8/8/3k4/8/8/4R3/4R3 w - - 0 1` | oui | 5 | 6 | mate | ✅ |
| 19 | `1R6/8/4k3/8/8/7R/2K5/8 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 20 | `8/8/4k3/8/8/KR6/8/2R5 w - - 0 1` | oui | 6 | 6 | mate | ✅ |

## Tour + roi contre roi (la boîte)

20/20 dans la limite · 132 s

| # | Position | Légale | Mat en (min) | Coups joués | Issue | OK |
|---|---|---|---|---|---|---|
| 1 | `8/8/7K/8/8/2k5/8/4R3 w - - 0 1` | oui | 14 | 22 | mate | ✅ |
| 2 | `7R/8/3k4/8/8/8/8/1K6 w - - 0 1` | oui | 14 | 17 | mate | ✅ |
| 3 | `8/8/8/5k2/1R6/1K6/8/8 w - - 0 1` | oui | 13 | 17 | mate | ✅ |
| 4 | `8/8/1R6/4k3/8/8/6K1/8 w - - 0 1` | oui | 14 | 17 | mate | ✅ |
| 5 | `8/8/5k2/1K6/6R1/8/8/8 w - - 0 1` | oui | 13 | 14 | mate | ✅ |
| 6 | `8/8/2K4R/8/2k5/8/8/8 w - - 0 1` | oui | 10 | 17 | mate | ✅ |
| 7 | `8/8/5R2/7K/2k5/8/8/8 w - - 0 1` | oui | 14 | 19 | mate | ✅ |
| 8 | `8/1K6/8/3k4/8/8/8/R7 w - - 0 1` | oui | 14 | 16 | mate | ✅ |
| 9 | `7R/8/2k5/8/8/8/1K6/8 w - - 0 1` | oui | 12 | 16 | mate | ✅ |
| 10 | `8/8/8/4k3/8/4K3/4R3/8 w - - 0 1` | oui | 12 | 12 | mate | ✅ |
| 11 | `5R2/8/8/8/8/6k1/8/4K3 w - - 0 1` | oui | 11 | 11 | mate | ✅ |
| 12 | `7K/8/5R2/8/2k5/8/8/8 w - - 0 1` | oui | 16 | 19 | mate | ✅ |
| 13 | `8/8/8/8/2k5/4K3/8/5R2 w - - 0 1` | oui | 9 | 9 | mate | ✅ |
| 14 | `8/8/4R3/8/K1k5/8/8/8 w - - 0 1` | oui | 12 | 20 | mate | ✅ |
| 15 | `8/5k2/2R5/8/8/8/3K4/8 w - - 0 1` | oui | 12 | 12 | mate | ✅ |
| 16 | `8/1K6/8/8/8/3k4/8/4R3 w - - 0 1` | oui | 12 | 12 | mate | ✅ |
| 17 | `8/2R5/4k3/8/7K/8/8/8 w - - 0 1` | oui | 14 | 17 | mate | ✅ |
| 18 | `8/R7/3k4/8/2K5/8/8/8 w - - 0 1` | oui | 12 | 11 | mate | ✅ |
| 19 | `6K1/8/6R1/8/4k3/8/8/8 w - - 0 1` | oui | 15 | 18 | mate | ✅ |
| 20 | `8/8/3R4/8/8/5K2/2k5/8 w - - 0 1` | oui | 9 | 11 | mate | ✅ |

## Deux fous + roi contre roi

20/20 dans la limite · 155 s

| # | Position | Légale | Mat en (min) | Coups joués | Issue | OK |
|---|---|---|---|---|---|---|
| 1 | `8/8/2k5/7B/8/B7/5K2/8 w - - 0 1` | oui | 14 | 14 | mate | ✅ |
| 2 | `8/3BB3/1K6/8/8/2k5/8/8 w - - 0 1` | oui | 14 | 14 | mate | ✅ |
| 3 | `8/3B4/8/8/1B6/4k3/8/7K w - - 0 1` | oui | 18 | 21 | mate | ✅ |
| 4 | `6K1/8/B7/8/8/6k1/8/6B1 w - - 0 1` | oui | 15 | 15 | mate | ✅ |
| 5 | `8/8/2K2BB1/8/8/4k3/8/8 w - - 0 1` | oui | 14 | 17 | mate | ✅ |
| 6 | `2B5/8/1K6/B7/3k4/8/8/8 w - - 0 1` | oui | 16 | 19 | mate | ✅ |
| 7 | `5BB1/1K6/8/8/3k4/8/8/8 w - - 0 1` | oui | 16 | 19 | mate | ✅ |
| 8 | `8/2B5/4k3/1K6/4B3/8/8/8 w - - 0 1` | oui | 14 | 15 | mate | ✅ |
| 9 | `8/8/3k4/8/8/4B3/K7/5B2 w - - 0 1` | oui | 16 | 17 | mate | ✅ |
| 10 | `2K5/8/8/7B/5k2/8/8/B7 w - - 0 1` | oui | 17 | 21 | mate | ✅ |
| 11 | `8/5k2/8/7K/8/B7/8/1B6 w - - 0 1` | oui | 13 | 21 | mate | ✅ |
| 12 | `8/8/1B6/3B1k1K/8/8/8/8 w - - 0 1` | oui | 13 | 15 | mate | ✅ |
| 13 | `2B5/8/2k4K/8/8/8/1B6/8 w - - 0 1` | oui | 16 | 16 | mate | ✅ |
| 14 | `8/8/5k2/8/B4B2/8/1K6/8 w - - 0 1` | oui | 15 | 16 | mate | ✅ |
| 15 | `8/6K1/8/2k4B/8/8/3B4/8 w - - 0 1` | oui | 16 | 17 | mate | ✅ |
| 16 | `8/8/7K/6B1/8/5k2/8/5B2 w - - 0 1` | oui | 13 | 14 | mate | ✅ |
| 17 | `8/8/8/8/2k2BB1/6K1/8/8 w - - 0 1` | oui | 15 | 17 | mate | ✅ |
| 18 | `8/8/3k4/8/B1K5/8/1B6/8 w - - 0 1` | oui | 14 | 15 | mate | ✅ |
| 19 | `8/6B1/3k2B1/8/8/8/8/4K3 w - - 0 1` | oui | 16 | 19 | mate | ✅ |
| 20 | `8/8/K7/8/4k3/7B/1B6/8 w - - 0 1` | oui | 16 | 17 | mate | ✅ |

**Toutes les positions sont matées dans la limite.**

_Vérification précédente (positions du générateur, minimum calculé par Stockfish lite dans le navigateur) : 80/80 aussi, dont une position des deux fous au 2e essai à 1 s/coup._
