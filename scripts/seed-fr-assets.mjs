#!/usr/bin/env node
/** One-shot: seed sites/fr/asset-src from repo root static files. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dst = path.join(root, 'sites/fr/asset-src');

const ASSET_EXTS = new Set([
  '.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.eot',
  '.js', '.css', '.txt', '.xml', '.json', '.webmanifest',
  '.mp4', '.webm', '.map',
]);
const ROOT_SPECIAL = new Set([
  '_redirects', '_headers', 'robots.txt', 'sitemap.xml', 'llms.txt',
  'llms-full.txt', 'manifest.json', 'favicon.ico', 'browserconfig.xml',
  'tracking-head.txt', 'styles.css', 'styles.reference.css',
]);
const SKIP = new Set([
  '.git', 'node_modules', 'sites', 'packages', 'scripts', 'dist', 'archive',
  '.astro', '.vexp', '.cursor', '.claude', '.impeccable', 'docs', 'tests',
  'test-results', 'playwright-report', 'functions',
]);

fs.rmSync(dst, { recursive: true, force: true });
fs.mkdirSync(dst, { recursive: true });

function walk(srcDir, base = root) {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const full = path.join(srcDir, entry.name);
    const rel = path.relative(base, full).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (SKIP.has(entry.name) || entry.name.startsWith('.')) continue;
      // Only descend into asset-like / known static dirs at root content trees for nested assets
      walk(full, base);
      continue;
    }
    if (entry.name.endsWith('.html') || entry.name.endsWith('.md')) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!ASSET_EXTS.has(ext) && !ROOT_SPECIAL.has(entry.name)) continue;
    const out = path.join(dst, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.copyFileSync(full, out);
  }
}

walk(root);
const fn = path.join(root, 'functions');
if (fs.existsSync(fn)) fs.cpSync(fn, path.join(dst, 'functions'), { recursive: true });
console.log('seeded', dst, 'files', walk.count || '');
console.log('files', [...walkDir(dst)].length);

function* walkDir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) yield* walkDir(f);
    else yield f;
  }
}
