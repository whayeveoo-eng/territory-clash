// Bundles the modular game into ONE self-contained index.html that runs over
// file:// (no ES modules, no fetch) — so it can be AirDropped to a phone and
// opened in the browser fully offline.
//
// Run:  node tools/build-standalone.mjs
// Out:  dist/index.html
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// dependency order: things used at module-eval time must come first
const ORDER = [
  'src/data/constants.js',
  'src/data/teams.js',
  'src/core/events.js',
  'src/core/grid.js',
  'src/core/damage.js',
  'src/core/physics.js',
  'src/core/match.js',
  'src/core/stats.js',
  'src/core/loop.js',
  'src/render/arena.js',
  'src/render/cannons.js',
  'src/render/bullets.js',
  'src/render/effects.js',
  'src/render/ui.js',
  'src/main.js',
];

// strip ES module syntax so everything can live in one classic <script> scope
function strip(code) {
  return code
    .replace(/^\s*import\b.*$/gm, '') // drop import lines (all single-line here)
    .replace(/^(\s*)export\s+/gm, '$1'); // `export const/function` -> `const/function`
}

const bundle = ORDER.map((rel) => {
  const code = strip(readFileSync(join(root, rel), 'utf8')).trim();
  return `// ===== ${rel} =====\n${code}`;
}).join('\n\n');

const html = readFileSync(join(root, 'index.html'), 'utf8');
const inlined = html.replace(
  /<script\s+type="module"\s+src="\.\/src\/main\.js"><\/script>/,
  `<script>\n(function(){\n${bundle}\n})();\n</script>`
);

if (inlined === html) {
  console.error('ERROR: module script tag not found in index.html — bundle aborted.');
  process.exit(1);
}

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist', 'index.html'), inlined);
console.log(`Wrote dist/index.html (${(inlined.length / 1024).toFixed(1)} KB, ${ORDER.length} modules inlined).`);
