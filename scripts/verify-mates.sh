#!/bin/sh
# Usage : sh scripts/verify-mates.sh   (N=20 par défaut)
npx esbuild scripts/verify-mates.ts --bundle --platform=node --format=esm --packages=external --outfile=scripts/.verify-mates.tmp.mjs --log-level=warning
node scripts/.verify-mates.tmp.mjs; status=$?
rm -f scripts/.verify-mates.tmp.mjs
exit $status
