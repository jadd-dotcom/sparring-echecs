#!/bin/sh
# Usage : sh scripts/verify-traps.sh   (ENGINE=/usr/games/stockfish par défaut s'il existe, MS=1000)
npx esbuild scripts/verify-traps.ts --bundle --platform=node --format=esm --packages=external --outfile=scripts/.verify-traps.tmp.mjs --log-level=warning
node scripts/.verify-traps.tmp.mjs; status=$?
rm -f scripts/.verify-traps.tmp.mjs
exit $status
