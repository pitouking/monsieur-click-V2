#!/usr/bin/env node
/**
 * Concatène + minifie le CSS pour chaque site (sans @import).
 * Sources par site: fonts/fonts.css + css/{tokens,base,components/site,utilities}.css
 * Sortie: sites/{fr,com}/asset-src/css/main.css (+ miroir racine css/main.css depuis COM)
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');

function readSite(siteDir, rel) {
  return fs.readFileSync(path.join(siteDir, rel), 'utf8');
}

function buildSite(label, siteDir) {
  const fontsCss = path.join(siteDir, 'fonts/fonts.css');
  const fonts = fs.existsSync(fontsCss)
    ? fs.readFileSync(fontsCss, 'utf8')
    : fs.readFileSync(path.join(root, 'fonts/fonts.css'), 'utf8');

  let tokens = readSite(siteDir, 'css/tokens.css').replace(
    /@import\s+url\(['"]?\/fonts\/fonts\.css['"]?\);\s*/g,
    '',
  );

  const parts = [
    '/* main.css — généré par scripts/build-css.cjs — éditer les sources, puis npm run build:css */',
    fonts,
    tokens,
    readSite(siteDir, 'css/base.css'),
    readSite(siteDir, 'css/components/site.css'),
    readSite(siteDir, 'css/utilities.css'),
  ];

  const joined = parts.join('\n\n');
  const minified = esbuild.transformSync(joined, {
    loader: 'css',
    minify: true,
    legalComments: 'none',
  }).code;

  const outPath = path.join(siteDir, 'css/main.css');
  fs.writeFileSync(outPath, minified);
  console.log(`[${label}] ${outPath} (${minified.length} bytes, was ${joined.length})`);
  return minified;
}

const comCss = buildSite('com', path.join(root, 'sites/com/asset-src'));
buildSite('fr', path.join(root, 'sites/fr/asset-src'));

// Keep root css/main.css in sync with COM for legacy scripts
fs.mkdirSync(path.join(root, 'css'), { recursive: true });
fs.writeFileSync(path.join(root, 'css/main.css'), comCss);
console.log(`[root] css/main.css (${comCss.length} bytes)`);
