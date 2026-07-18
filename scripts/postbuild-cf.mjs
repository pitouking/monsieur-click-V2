#!/usr/bin/env node
/** Copy Cloudflare Pages extras into dist after Astro build. */
import fs from 'node:fs';
import path from 'node:path';

const site = process.argv[2];
if (!site) {
  console.error('Usage: node scripts/postbuild-cf.mjs <fr|com>');
  process.exit(1);
}

const siteDir = path.resolve(`sites/${site === 'com' ? 'com' : 'fr'}`);
const dist = path.join(siteDir, 'dist');
const pub = path.join(siteDir, 'public');

if (!fs.existsSync(dist)) {
  console.error(`[${site}] missing dist — run astro build first`);
  process.exit(1);
}

for (const name of ['_redirects', '_headers']) {
  const src = path.join(pub, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, name));
    console.log(`[${site}] ${name} → dist/`);
  }
}

console.log(`[${site}] Cloudflare extras synced`);
