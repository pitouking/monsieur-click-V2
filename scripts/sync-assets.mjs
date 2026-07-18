#!/usr/bin/env node
/**
 * Sync static assets into site public/ folders.
 * - FR: from repo root (legacy static tree)
 * - COM: from sites/com/asset-src (exported EN static tree, committed)
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const ASSET_EXTS = new Set([
  '.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.eot',
  '.js', '.css', '.txt', '.xml', '.json', '.webmanifest',
  '.mp4', '.webm', '.map',
]);

const ROOT_SPECIAL = new Set([
  '_redirects', '_headers', 'robots.txt', 'sitemap.xml', 'llms.txt',
  'manifest.json', 'favicon.ico', 'browserconfig.xml',
]);

const SKIP_DIR_NAMES = new Set([
  '.git', 'node_modules', 'sites', 'packages', 'scripts', 'dist',
  '.astro', '.vexp', '.cursor', '.claude', '.impeccable', 'functions',
  'docs', 'tests', 'test-results', 'playwright-report', 'src', 'legacy-html',
  'assets', 'asset-src',
]);

function copyFile(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

function walkAssets(srcDir, dstRoot, base) {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const full = path.join(srcDir, entry.name);
    const rel = path.relative(base, full).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name) || entry.name.startsWith('.')) continue;
      walkAssets(full, dstRoot, base);
      continue;
    }
    if (entry.name.endsWith('.html') || entry.name.endsWith('.md')) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!ASSET_EXTS.has(ext) && !ROOT_SPECIAL.has(entry.name)) continue;
    copyFile(full, path.join(dstRoot, rel));
  }
}

function syncSite(label, srcRoot, siteDir) {
  if (!fs.existsSync(srcRoot)) {
    console.error(`[${label}] missing source ${srcRoot}`);
    process.exit(1);
  }
  const pub = path.join(siteDir, 'public');
  fs.rmSync(pub, { recursive: true, force: true });
  fs.mkdirSync(pub, { recursive: true });
  walkAssets(srcRoot, pub, srcRoot);

  const fnSrc = path.join(srcRoot, 'functions');
  if (fs.existsSync(fnSrc)) {
    fs.cpSync(fnSrc, path.join(siteDir, 'functions'), { recursive: true });
  }
  console.log(`[${label}] assets → ${pub}`);
}

// Ensure EN asset-src exists (seed from /tmp/mc-en once if needed)
const comAssetSrc = path.join(root, 'sites/com/asset-src');
if (!fs.existsSync(comAssetSrc)) {
  const tmp = '/tmp/mc-en';
  if (!fs.existsSync(tmp)) {
    console.error('Missing sites/com/asset-src and /tmp/mc-en — export origin/en first');
    process.exit(1);
  }
  fs.mkdirSync(comAssetSrc, { recursive: true });
  // Seed non-html assets + functions into asset-src
  walkAssets(tmp, comAssetSrc, tmp);
  const fn = path.join(tmp, 'functions');
  if (fs.existsSync(fn)) fs.cpSync(fn, path.join(comAssetSrc, 'functions'), { recursive: true });
  console.log('[com] seeded sites/com/asset-src from /tmp/mc-en');
}

syncSite('fr', root, path.join(root, 'sites/fr'));
syncSite('com', comAssetSrc, path.join(root, 'sites/com'));
