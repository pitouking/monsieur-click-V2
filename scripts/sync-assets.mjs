#!/usr/bin/env node
/**
 * Sync static assets into sites/{fr,com}/public from each site's asset-src/.
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
  'llms-full.txt', 'manifest.json', 'favicon.ico', 'browserconfig.xml',
  'tracking-head.txt', 'styles.css', 'styles.reference.css',
  'auth.md',
  'AUTH.md',
]);

/** Never ship npm metadata into public/dist */
const SKIP_FILES = new Set([
  'package.json',
  'package-lock.json',
  'npm-shrinkwrap.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'tsconfig.json',
  'astro.config.mjs',
  'wrangler.toml',
]);

const SKIP_DIR_NAMES = new Set([
  '.git', 'node_modules', 'sites', 'packages', 'scripts', 'dist',
  '.astro', '.vexp', '.cursor', '.claude', '.impeccable',
  'docs', 'tests', 'test-results', 'playwright-report', 'src', 'legacy-html',
  'assets', 'asset-src', 'content', 'archive', 'functions',
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
      // RFC well-known + agent API docs under asset-src
      if (entry.name === '.well-known' || entry.name === 'docs') {
        walkAssets(full, dstRoot, base);
        continue;
      }
      if (SKIP_DIR_NAMES.has(entry.name) || entry.name.startsWith('.')) continue;
      walkAssets(full, dstRoot, base);
      continue;
    }
    if (entry.name.endsWith('.html')) continue;
    if (SKIP_FILES.has(entry.name)) continue;

    const inWellKnown = rel === '.well-known' || rel.startsWith('.well-known/');
    const allowMd =
      entry.name === 'auth.md' ||
      entry.name === 'AUTH.md' ||
      entry.name === 'SKILL.md' ||
      (entry.name.endsWith('.md') && (inWellKnown || rel.startsWith('docs/')));
    if (entry.name.endsWith('.md') && !allowMd) continue;

    const ext = path.extname(entry.name).toLowerCase();
    const extensionlessWellKnown = inWellKnown && ext === '';
    if (!ASSET_EXTS.has(ext) && !ROOT_SPECIAL.has(entry.name) && !allowMd && !extensionlessWellKnown) {
      continue;
    }
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
  const fnDst = path.join(siteDir, 'functions');
  if (fs.existsSync(fnSrc)) {
    fs.cpSync(fnSrc, fnDst, { recursive: true });
  }

  // Pages Functions resolve score-questions.js relative to the site root
  // (sites/<site>/score-questions.js), not public/dist.
  const scoreSrc = path.join(srcRoot, 'score-questions.js');
  if (fs.existsSync(scoreSrc)) {
    copyFile(scoreSrc, path.join(siteDir, 'score-questions.js'));
  }

  console.log(`[${label}] assets → ${pub}`);
}

const frAssetSrc = path.join(root, 'sites/fr/asset-src');
const comAssetSrc = path.join(root, 'sites/com/asset-src');

if (!fs.existsSync(frAssetSrc)) {
  console.error('Missing sites/fr/asset-src — run scripts/seed-fr-assets.mjs first');
  process.exit(1);
}
if (!fs.existsSync(comAssetSrc)) {
  console.error('Missing sites/com/asset-src');
  process.exit(1);
}

syncSite('fr', frAssetSrc, path.join(root, 'sites/fr'));
syncSite('com', comAssetSrc, path.join(root, 'sites/com'));
