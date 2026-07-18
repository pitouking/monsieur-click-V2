#!/usr/bin/env node
/**
 * Convert static HTML → Astro pages via raw HTML import (preserves `{` in JSON-LD).
 *
 *   node scripts/html-to-astro.mjs --src . --out sites/fr --site fr
 *   node scripts/html-to-astro.mjs --src /tmp/mc-en --out sites/com --site com
 *
 * Layout:
 *   sites/<site>/legacy-html/...html  (source of truth for markup)
 *   sites/<site>/src/pages/...astro   (thin wrappers)
 */
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const args = {};
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[i + 1];
}

const srcRoot = path.resolve(args.src || '.');
const siteRoot = path.resolve(args.out || 'sites/fr');
const site = args.site || 'fr';
const legacyRoot = path.join(siteRoot, 'legacy-html');
const pagesRoot = path.join(siteRoot, 'src', 'pages');

const SKIP_DIRS = new Set([
  '.git', 'node_modules', 'sites', 'packages', 'scripts', 'assets', 'dist',
  '.astro', '.vexp', '.cursor', '.claude', '.impeccable', 'functions', 'docs',
  'tests', 'test-results', 'playwright-report', 'legacy-html', 'src',
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
      walk(full, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function routeFromRel(rel) {
  // Prefer directory index when both foo.html and foo/index.html exist — handled by dedupe later
  if (rel === 'blog.html') return { legacyRel: 'blog-hub-legacy.html', pageRel: 'blog-hub-legacy.astro' };
  if (rel.endsWith(`${path.sep}index.html`) || rel === 'index.html') {
    const dir = rel === 'index.html' ? '' : path.dirname(rel);
    const legacyRel = path.join(dir, 'index.html');
    const pageRel = path.join(dir, 'index.astro');
    return { legacyRel, pageRel };
  }
  return {
    legacyRel: rel,
    pageRel: rel.replace(/\.html$/, '.astro'),
  };
}

function astroWrapper(importPath) {
  // importPath uses POSIX separators for Vite
  return `---
import rawHtml from '${importPath}';
---
<Fragment set:html={rawHtml} />
`;
}

// Collect candidates; if both `x.html` and `x/index.html` exist, keep index only
const htmlFiles = walk(srcRoot);
const byRoute = new Map();

for (const file of htmlFiles) {
  const rel = path.relative(srcRoot, file);
  const { legacyRel, pageRel } = routeFromRel(rel);
  const routeKey = pageRel.replace(/\\/g, '/');

  const isIndex = /(?:^|\/)index\.astro$/.test(routeKey);
  const existing = byRoute.get(routeKey);
  if (!existing) {
    byRoute.set(routeKey, { file, legacyRel, pageRel, isIndex });
    continue;
  }
  // Prefer index.html variants
  if (isIndex && !existing.isIndex) {
    byRoute.set(routeKey, { file, legacyRel, pageRel, isIndex });
  }
}

// Also handle foo.html vs foo/index.html colliding on Astro output /foo/
const pageToSource = new Map();
for (const [pageRel, meta] of byRoute) {
  const outUrl = pageRel
    .replace(/\\/g, '/')
    .replace(/\/index\.astro$/, '/')
    .replace(/\.astro$/, '/');
  const prev = pageToSource.get(outUrl);
  if (!prev) {
    pageToSource.set(outUrl, { pageRel, ...meta });
  } else if (meta.isIndex && !prev.isIndex) {
    pageToSource.set(outUrl, { pageRel, ...meta });
  }
}

fs.mkdirSync(legacyRoot, { recursive: true });
fs.mkdirSync(pagesRoot, { recursive: true });

let converted = 0;
for (const { file, legacyRel, pageRel } of pageToSource.values()) {
  const legacyAbs = path.join(legacyRoot, legacyRel);
  const pageAbs = path.join(pagesRoot, pageRel);
  fs.mkdirSync(path.dirname(legacyAbs), { recursive: true });
  fs.mkdirSync(path.dirname(pageAbs), { recursive: true });
  fs.copyFileSync(file, legacyAbs);

  // Relative import from src/pages/... to legacy-html/...
  const fromDir = path.dirname(pageAbs);
  let relImport = path.relative(fromDir, legacyAbs).replace(/\\/g, '/');
  if (!relImport.startsWith('.')) relImport = `./${relImport}`;
  // Vite raw import
  const importPath = `${relImport}?raw`;
  fs.writeFileSync(pageAbs, astroWrapper(importPath), 'utf8');
  converted++;
}

console.log(`[${site}] ${converted} pages → ${pagesRoot}`);
console.log(`[${site}] legacy HTML → ${legacyRoot}`);
