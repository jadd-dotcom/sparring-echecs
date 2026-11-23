#!/bin/sh
# Usage : DEPTH=20 sh scripts/validate-repertoire.sh   (ONLY=english : une seule ouverture ; ARCHIVES=1 : aussi les archivées)
set -e
npx esbuild scripts/validate-repertoire.ts --bundle --platform=node --format=esm --packages=external --outfile=scripts/.validate.tmp.mjs --log-level=warning
node scripts/.validate.tmp.mjs; status=$?
rm -f scripts/.validate.tmp.mjs
exit $status
