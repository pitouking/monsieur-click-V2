#!/usr/bin/env node
/**
 * Concatène les CSS sources en un seul css/main.css (sans @import).
 * Évite la cascade render-blocking mesurée par Lighthouse.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

let tokens = read('css/tokens.css').replace(
  /@import\s+url\(['"]?\/fonts\/fonts\.css['"]?\);\s*/g,
  ''
);

const parts = [
  '/* main.css — généré par scripts/build-css.cjs — éditer les sources, puis npm run build:css */',
  '/* Sources: fonts/fonts.css, css/tokens.css, base.css, components/site.css, utilities.css */',
  read('fonts/fonts.css'),
  tokens,
  read('css/base.css'),
  read('css/components/site.css'),
  read('css/utilities.css'),
];

const out = parts.join('\n\n');
fs.writeFileSync(path.join(root, 'css/main.css'), out);
console.log('Wrote css/main.css (' + out.length + ' bytes)');
