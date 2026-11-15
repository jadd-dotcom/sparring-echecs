// Génère les icônes PNG à partir de public/icon.svg (Playwright).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFileSync } from 'node:fs';
const svg = readFileSync('public/icon.svg', 'utf8');
const b = await chromium.launch();
for (const s of [180, 192, 512]) {
  const p = await b.newPage({ viewport: { width: s, height: s } });
  await p.setContent(`<style>*{margin:0}svg{width:${s}px;height:${s}px;display:block}</style>${svg.replace('rx="96"', 'rx="0"')}`);
  await p.screenshot({ path: `public/icon-${s}.png` });
}
await b.close();
