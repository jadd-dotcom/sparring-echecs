// Copie les binaires lourds (modèle Maia, runtime ONNX, Stockfish) dans public/vendor.
// Ils ne sont pas versionnés : ils proviennent des paquets npm.
import { cpSync, mkdirSync } from 'node:fs';
const out = 'public/vendor';
mkdirSync(out, { recursive: true });
const files = [
  ['node_modules/maia3-js/models/maia3_5m.onnx', 'maia3_5m.onnx'],
  ['node_modules/stockfish/bin/stockfish-19-lite-single.js', 'stockfish-19-lite-single.js'],
  ['node_modules/stockfish/bin/stockfish-19-lite-single.wasm', 'stockfish-19-lite-single.wasm'],
];
for (const [from, to] of files) cpSync(from, `${out}/${to}`);
console.log(`copié ${files.length} fichiers dans ${out}`);
