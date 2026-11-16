# Mats élémentaires — vérification Stockfish

Pour chaque niveau, 20 positions générées (graine fixe), toutes légales. Stockfish 19 lite joue mon camp (300 ms/coup) contre Stockfish en défense maximale (300 ms/coup). Réussite = mat en au plus « minimum + 10 » coups (minimum = mat en N calculé au départ, comme dans l'appli). Une position qui échoue est rejouée une fois à 1000 ms par coup (les deux essais sont notés).

## Dame + roi contre roi

20/20 dans la limite · 79 s

| # | Position | Légale | Mat en (min) | Coups joués | Issue | OK |
|---|---|---|---|---|---|---|
| 1 | `8/8/8/8/5k2/8/5K2/7Q w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 2 | `8/Q7/8/3k4/8/8/8/2K5 w - - 0 1` | oui | 7 | 8 | mate | ✅ |
| 3 | `8/8/4k3/8/1Q6/8/5K2/8 w - - 0 1` | oui | 8 | 8 | mate | ✅ |
| 4 | `8/8/8/4K3/8/Q7/4k3/8 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 5 | `8/8/8/6Q1/3k4/8/8/5K2 w - - 0 1` | oui | 7 | 7 | mate | ✅ |
| 6 | `8/8/7Q/8/8/5k2/3K4/8 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 7 | `8/8/1Q6/2K5/8/4k3/8/8 w - - 0 1` | oui | 7 | 7 | mate | ✅ |
| 8 | `5K2/8/8/5Q2/8/2k5/8/8 w - - 0 1` | oui | 8 | 8 | mate | ✅ |
| 9 | `8/8/8/K5Q1/8/5k2/8/8 w - - 0 1` | oui | 6 | 7 | mate | ✅ |
| 10 | `8/8/1k6/4Q3/K7/8/8/8 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 11 | `8/4K3/4Q3/8/8/5k2/8/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 12 | `8/8/8/8/5Q2/2k5/8/2K5 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 13 | `8/8/4k3/8/8/2Q5/8/2K5 w - - 0 1` | oui | 8 | 9 | mate | ✅ |
| 14 | `3K4/8/Q7/8/6k1/8/8/8 w - - 0 1` | oui | 7 | 8 | mate | ✅ |
| 15 | `8/2k5/8/8/3K4/8/8/1Q6 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 16 | `8/Q7/8/K7/8/3k4/8/8 w - - 0 1` | oui | 7 | 9 | mate | ✅ |
| 17 | `6K1/6Q1/8/8/8/4k3/8/8 w - - 0 1` | oui | 8 | 9 | mate | ✅ |
| 18 | `8/6k1/3KQ3/8/8/8/8/8 w - - 0 1` | oui | 3 | 3 | mate | ✅ |
| 19 | `8/2K4Q/8/4k3/8/8/8/8 w - - 0 1` | oui | 6 | 7 | mate | ✅ |
| 20 | `8/8/8/8/2k5/8/8/Q1K5 w - - 0 1` | oui | 6 | 6 | mate | ✅ |

## Deux tours contre roi (l’échelle)

20/20 dans la limite · 53 s

| # | Position | Légale | Mat en (min) | Coups joués | Issue | OK |
|---|---|---|---|---|---|---|
| 1 | `8/K7/2R5/8/5R2/3k4/8/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 2 | `6K1/8/2R5/4k3/8/5R2/8/8 w - - 0 1` | oui | 5 | 6 | mate | ✅ |
| 3 | `8/6R1/8/8/2k2K2/8/8/4R3 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 4 | `8/2K5/8/R7/8/4k3/8/2R5 w - - 0 1` | oui | 5 | 6 | mate | ✅ |
| 5 | `2R4R/8/8/4k3/8/8/8/K7 w - - 0 1` | oui | 6 | 7 | mate | ✅ |
| 6 | `R7/1R6/8/5k2/8/2K5/8/8 w - - 0 1` | oui | 4 | 5 | mate | ✅ |
| 7 | `8/8/3k4/8/8/8/1R6/K3R3 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 8 | `6R1/2K5/8/2k5/8/8/3R4/8 w - - 0 1` | oui | 3 | 3 | mate | ✅ |
| 9 | `8/2R5/K7/8/5k2/8/2R5/8 w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 10 | `8/8/8/2R5/5k2/8/6KR/8 w - - 0 1` | oui | 3 | 3 | mate | ✅ |
| 11 | `K4R2/8/4k3/8/8/8/8/7R w - - 0 1` | oui | 6 | 6 | mate | ✅ |
| 12 | `8/8/K7/1RR5/8/5k2/8/8 w - - 0 1` | oui | 6 | 7 | mate | ✅ |
| 13 | `8/5R2/R7/1K6/8/3k4/8/8 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 14 | `8/8/K7/8/4k3/8/R7/5R2 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 15 | `5K2/8/8/3k4/1R6/8/5R2/8 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 16 | `8/8/4K1R1/8/8/4k3/6R1/8 w - - 0 1` | oui | 3 | 3 | mate | ✅ |
| 17 | `8/8/8/5K2/2k5/8/4R3/1R6 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 18 | `7R/4K3/8/3k4/8/8/6R1/8 w - - 0 1` | oui | 4 | 4 | mate | ✅ |
| 19 | `1R1R4/3K4/8/8/2k5/8/8/8 w - - 0 1` | oui | 5 | 5 | mate | ✅ |
| 20 | `8/5R2/8/2k5/8/8/4K3/4R3 w - - 0 1` | oui | 4 | 4 | mate | ✅ |

## Tour + roi contre roi (la boîte)

20/20 dans la limite · 164 s

| # | Position | Légale | Mat en (min) | Coups joués | Issue | OK |
|---|---|---|---|---|---|---|
| 1 | `8/8/8/8/1RK1k3/8/8/8 w - - 0 1` | oui | 12 | 13 | mate | ✅ |
| 2 | `8/6K1/8/1k6/3R4/8/8/8 w - - 0 1` | oui | 11 | 11 | mate | ✅ |
| 3 | `8/2R5/8/8/5k2/8/2K5/8 w - - 0 1` | oui | 12 | 12 | mate | ✅ |
| 4 | `8/3K4/8/8/R7/2k5/8/8 w - - 0 1` | oui | 12 | 12 | mate | ✅ |
| 5 | `8/8/3k4/1R6/8/8/1K6/8 w - - 0 1` | oui | 13 | 13 | mate | ✅ |
| 6 | `8/2R5/8/8/8/3k4/7K/8 w - - 0 1` | oui | 18 | 17 | mate | ✅ |
| 7 | `8/6R1/8/8/8/4k3/8/3K4 w - - 0 1` | oui | 11 | 12 | mate | ✅ |
| 8 | `1R6/8/8/8/8/8/3K2k1/8 w - - 0 1` | oui | 6 | 7 | mate | ✅ |
| 9 | `7K/8/8/8/2k5/8/8/5R2 w - - 0 1` | oui | 16 | 13 | mate | ✅ |
| 10 | `8/8/KR6/8/2k5/8/8/8 w - - 0 1` | oui | 13 | 13 | mate | ✅ |
| 11 | `8/6R1/8/8/4k3/1K6/8/8 w - - 0 1` | oui | 14 | 14 | mate | ✅ |
| 12 | `8/8/8/8/8/R7/3k4/K7 w - - 0 1` | oui | 9 | 10 | mate | ✅ |
| 13 | `1R1K4/8/8/8/8/5k2/8/8 w - - 0 1` | oui | 15 | 15 | mate | ✅ |
| 14 | `8/8/8/5k2/3R4/4K3/8/8 w - - 0 1` | oui | 11 | 11 | mate | ✅ |
| 15 | `4R3/8/8/5k2/8/8/4K3/8 w - - 0 1` | oui | 10 | 10 | mate | ✅ |
| 16 | `8/5R2/8/3k4/8/6K1/8/8 w - - 0 1` | oui | 14 | 15 | mate | ✅ |
| 17 | `4R3/8/5k2/8/8/8/8/K7 w - - 0 1` | oui | 15 | 16 | mate | ✅ |
| 18 | `5R2/8/2k5/8/8/8/5K2/8 w - - 0 1` | oui | 14 | 14 | mate | ✅ |
| 19 | `8/8/8/8/4k3/8/8/K6R w - - 0 1` | oui | 16 | 15 | mate | ✅ |
| 20 | `8/7R/6K1/8/8/2k5/8/8 w - - 0 1` | oui | 14 | 14 | mate | ✅ |

## Deux fous + roi contre roi

20/20 dans la limite · 2263 s

| # | Position | Légale | Mat en (min) | Coups joués | Issue | OK |
|---|---|---|---|---|---|---|
| 1 | `7K/8/7B/3k4/8/8/8/1B6 w - - 0 1` | oui | 18 | 21 | mate | ✅ |
| 2 | `8/8/8/8/B1K1k3/8/8/4B3 w - - 0 1` | oui | 16 | 13 | mate | ✅ |
| 3 | `8/K7/2k5/8/8/8/2B5/4B3 w - - 0 1` | oui | 15 | 24 | mate | ✅ |
| 4 | `8/4K3/2k5/8/8/8/7B/3B4 w - - 0 1` | oui | 15 | 16 | mate | ✅ |
| 5 | `8/8/8/3k2B1/8/8/4B1K1/8 w - - 0 1` | oui | 19 | 16 | mate | ✅ |
| 6 | `8/8/K7/5k2/2B5/2B5/8/8 w - - 0 1` | oui | 19 | 19 | mate | ✅ |
| 7 | `8/8/8/3k4/8/3B4/6K1/4B3 w - - 0 1` | oui | 19 | 17 | mate | ✅ |
| 8 | `8/8/2k3B1/8/5B2/7K/8/8 w - - 0 1` | oui | 19 | 17 | mate | ✅ |
| 9 | `1B2B3/8/8/8/8/2k3K1/8/8 w - - 0 1` | oui | 19 | 15 | mate | ✅ |
| 10 | `8/K3B3/8/3k4/8/8/8/1B6 w - - 0 1` | oui | 17 | 18 | mate | ✅ |
| 11 | `8/8/8/8/B1k2K2/8/1B6/8 w - - 0 1` | oui | 15 | 19 | mate | ✅ |
| 12 | `8/8/B1k5/5K2/8/8/7B/8 w - - 0 1` | oui | 17 | 14 | mate | ✅ |
| 13 | `8/8/3k4/8/8/8/1B3K2/5B2 w - - 0 1` | oui | 17 | 15 | mate | ✅ |
| 14 | `8/2B5/K7/5k2/8/8/4B3/8 w - - 0 1` | oui | 23 | 14 | mate | ✅ |
| 15 | `8/5B2/8/5k2/1B6/8/8/5K2 w - - 0 1` | oui | 18 | 14 | mate | ✅ |
| 16 | `K7/6B1/8/5k2/8/1B6/8/8 w - - 0 1` | oui | 24 | 22 | mate | ✅ |
| 17 | `8/3B4/8/8/5BK1/2k5/8/8 w - - 0 1` | oui | 16 | 14 | mate | ✅ |
| 18 | `8/B7/B7/8/3K4/8/6k1/8 w - - 0 1` | oui | 11 | 11 | mate | ✅ |
| 19 | `1B6/8/K7/3B1k2/8/8/8/8 w - - 0 1` | oui | 16 | 14 | mate | ✅ |
| 20 | `8/B7/3k4/8/8/8/8/2K4B w - - 0 1` | oui | 20 | 17 | mate | ✅ |

**Toutes les positions sont matées dans la limite.**
