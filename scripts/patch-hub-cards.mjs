#!/usr/bin/env node
/** Patch hub listing cards without regenerating full pages. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FR = path.resolve(__dirname, '..');
const EN = path.resolve(FR, '../en');

import { hubCardsBlock } from './generate-cases-glossary.mjs';

function patchHub(file, lang, endMarker) {
  let html = fs.readFileSync(file, 'utf8');
  const start = html.indexOf('<h2 class="cat-title');
  const end = html.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Could not patch ${file}: markers not found`);
  }
  html = html.slice(0, start) + hubCardsBlock(lang) + '\n' + html.slice(end);
  fs.writeFileSync(file, html);
  console.log('Patched', file);
}

patchHub(path.join(FR, 'realisations/index.html'), 'fr', '    <p class="center reveal u-mt-14">');
patchHub(path.join(EN, 'case-studies/index.html'), 'en', '  </div>\n</section>');
