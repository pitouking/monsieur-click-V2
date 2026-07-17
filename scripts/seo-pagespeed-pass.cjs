#!/usr/bin/env node
/**
 * SEO + pagespeed hygiene pass for EN (and light FR).
 * - Defer shared.js / unify perf.js + main.css cache bust
 * - Fix hub trailing slashes (case-studies, glossary, blog)
 * - Head cleanup (og meta stuck on stylesheet line, GTM preconnect)
 * - Ensure perf.js + shared.js present on public pages
 */
const fs = require('fs');
const path = require('path');

const EN = path.resolve(__dirname, '..');
const FR = path.resolve(EN, '..', 'monsieur-click-V2');
const CSS_V = '20260716ps';
const PERF_V = '20260716ps';
const HOME_V = '20260716ps';

const SKIP = new Set(['node_modules', '.git', '.wrangler', 'okf', 'texts', 'scripts', '.context-cache', '.context-state', '.impeccable', '.cursor']);

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function transformEn(html, file) {
  let out = html;

  // Fix stylesheet + og stuck on same line
  out = out.replace(
    /(<link rel="stylesheet" href="\/css\/main\.css\?v=[^"]+">)<meta /g,
    '$1\n<meta '
  );

  // Unify CSS / perf / home cache
  out = out.replace(/\/css\/main\.css\?v=[^"'\s>]+/g, `/css/main.css?v=${CSS_V}`);
  out = out.replace(/\/perf\.js\?v=[^"'\s>]+/g, `/perf.js?v=${PERF_V}`);
  out = out.replace(/\/home\.js\?v=[^"'\s>]+/g, `/home.js?v=${HOME_V}`);
  // bare perf.js without version
  out = out.replace(/src="\/perf\.js"/g, `src="/perf.js?v=${PERF_V}"`);
  out = out.replace(/src="\/home\.js"/g, `src="/home.js?v=${HOME_V}"`);

  // Defer shared.js
  out = out.replace(/<script src="\/shared\.js"><\/script>/g, `<script defer src="/shared.js?v=${PERF_V}"></script>`);
  out = out.replace(/<script defer src="\/shared\.js"><\/script>/g, `<script defer src="/shared.js?v=${PERF_V}"></script>`);
  out = out.replace(/src="\/shared\.js\?v=[^"]+"/g, `src="/shared.js?v=${PERF_V}"`);

  // Trailing slash hubs
  out = out.replace(/href="\/case-studies"/g, 'href="/case-studies/"');
  out = out.replace(/href="\/glossary"/g, 'href="/glossary/"');
  out = out.replace(/href="\/blog"/g, 'href="/blog/"');
  out = out.replace(/href="\/services"/g, 'href="/services/"');
  // Don't break /blog/slug already fine

  // Remove early GTM preconnect (trackers load late via perf.js) — keep dns-prefetch light ones
  out = out.replace(/<link rel="preconnect" href="https:\/\/www\.googletagmanager\.com"[^>]*>\n?/g, '');

  // Ensure footer scripts order: home (if any) → perf defer → shared defer; no missing perf on public pages
  const isPublic = !file.includes(`${path.sep}okf${path.sep}`) && !file.includes(`${path.sep}texts${path.sep}`);
  if (isPublic && out.includes('</body>') && !out.includes('/perf.js')) {
    out = out.replace('</body>', `<script defer src="/perf.js?v=${PERF_V}"></script>\n</body>`);
  }
  // Interior pages: if no home.js and no shared, add shared
  if (isPublic && !out.includes('/home.js') && !out.includes('/shared.js') && out.includes('</body>')) {
    out = out.replace(
      new RegExp(`(<script defer src="/perf\\.js\\?v=${PERF_V}"></script>)`),
      `$1\n<script defer src="/shared.js?v=${PERF_V}"></script>`
    );
    if (!out.includes('/shared.js')) {
      out = out.replace('</body>', `<script defer src="/shared.js?v=${PERF_V}"></script>\n</body>`);
    }
  }

  // Fix missing newline before </body> when scripts concatenated
  out = out.replace(/<\/script><\/body>/g, '</script>\n</body>');

  return out;
}

function transformFr(html) {
  let out = html;
  out = out.replace(/\/css\/main\.css\?v=[^"'\s>]+/g, `/css/main.css?v=${CSS_V}`);
  out = out.replace(/\/perf\.js\?v=[^"'\s>]+/g, `/perf.js?v=${PERF_V}`);
  out = out.replace(/\/home\.js\?v=[^"'\s>]+/g, `/home.js?v=${HOME_V}`);
  out = out.replace(/<script src="\/shared\.js"><\/script>/g, `<script defer src="/shared.js?v=${PERF_V}"></script>`);
  out = out.replace(/<script defer src="\/shared\.js"><\/script>/g, `<script defer src="/shared.js?v=${PERF_V}"></script>`);
  out = out.replace(/src="\/shared\.js\?v=[^"]+"/g, `src="/shared.js?v=${PERF_V}"`);
  out = out.replace(/href="\/realisations"/g, 'href="/realisations/"');
  out = out.replace(/href="\/glossaire"/g, 'href="/glossaire/"');
  out = out.replace(/href="\/blog"/g, 'href="/blog/"');
  out = out.replace(/href="\/services"/g, 'href="/services/"');
  return out;
}

// EN
let n = 0;
for (const file of walk(EN)) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transformEn(before, file);
  if (after !== before) {
    fs.writeFileSync(file, after);
    n++;
  }
}
console.log('EN html updated', n);

// FR (skip okf)
let nf = 0;
for (const file of walk(FR)) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transformFr(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    nf++;
  }
}
console.log('FR html updated', nf);

// EN _headers: add /css/*
const headersPath = path.join(EN, '_headers');
let headers = fs.readFileSync(headersPath, 'utf8');
if (!headers.includes('/css/*')) {
  headers = headers.replace(
    '/styles.css\n  Cache-Control: public, max-age=31536000, immutable\n',
    `/styles.css
  Cache-Control: public, max-age=31536000, immutable

/css/*
  Cache-Control: public, max-age=31536000, immutable

`
  );
  fs.writeFileSync(headersPath, headers);
  console.log('EN _headers css/* added');
}

// FR shared.js: add js class like EN
const frShared = path.join(FR, 'shared.js');
let fsj = fs.readFileSync(frShared, 'utf8');
if (!fsj.includes("document.documentElement.classList.add('js')")) {
  fs.writeFileSync(frShared, "document.documentElement.classList.add('js');\n" + fsj);
  console.log('FR shared.js js class added');
}

console.log('done');
