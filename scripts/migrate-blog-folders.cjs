#!/usr/bin/env node
/**
 * Migrate EN flat blog-*.html → /blog/{slug}/index.html (FR parity).
 * Also strip common blog inline styles → utility classes.
 */
const fs = require('fs');
const path = require('path');

const EN = path.resolve(__dirname, '..');
const FR = path.resolve(EN, '..', 'monsieur-click-V2');

const SLUGS = fs
  .readdirSync(EN)
  .filter((f) => f.startsWith('blog-') && f.endsWith('.html'))
  .map((f) => f.replace(/^blog-/, '').replace(/\.html$/, ''));

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function rewriteBlogUrls(html) {
  // /blog-slug → /blog/slug (and .html variants)
  let out = html.replace(/https:\/\/monsieurclick\.com\/blog-([a-z0-9-]+)(?:\.html)?/g, 'https://monsieurclick.com/blog/$1');
  out = out.replace(/href="\/blog-([a-z0-9-]+)(?:\.html)?"/g, 'href="/blog/$1"');
  out = out.replace(/url":\s*"https:\/\/monsieurclick\.com\/blog-([a-z0-9-]+)"/g, 'url": "https://monsieurclick.com/blog/$1"');
  out = out.replace(/"@id":\s*"https:\/\/monsieurclick\.com\/blog-([a-z0-9-]+)"/g, '"@id": "https://monsieurclick.com/blog/$1"');
  // Hub: /blog without trailing issues — keep /blog and /blog/
  return out;
}

function modernizeChrome(html) {
  let out = html;
  // Inline → utilities (FR pattern)
  out = out.replace(/<section style="padding-top:0"/g, '<section class="u-section-tight"');
  out = out.replace(/<section class="related" style="padding-top:0"/g, '<section class="related u-section-tight"');
  out = out.replace(/<div class="wrap" style="max-width:820px">/g, '<div class="wrap u-wrap-820">');
  out = out.replace(
    /<a href="\/click-first#score" style="color:#fff;text-decoration:underline">/g,
    '<a href="/click-first#score" class="u-link-white">'
  );
  out = out.replace(
    /<a href="\/" class="logo" style="margin-bottom:14px">/g,
    '<a href="/" class="logo u-logo-foot">'
  );
  // Prefer semantic footer/header when bare <footer>/<nav> at root of body posts
  if (!out.includes('class="site-footer"') && out.includes('<footer>')) {
    out = out.replace('<footer>', '<footer class="site-footer" role="contentinfo">');
  }
  if (!out.includes('<main') && out.includes('<header class="pagehero">')) {
    out = out.replace('<header class="pagehero">', '<main id="main">\n<header class="pagehero">');
    // close main before footer
    out = out.replace(/\n<footer/, '\n</main>\n\n<footer');
  }
  return out;
}

// —— Hub ——
const hubSrc = path.join(EN, 'blog.html');
if (!fs.existsSync(hubSrc)) throw new Error('blog.html missing');
ensureDir(path.join(EN, 'blog'));
let hub = fs.readFileSync(hubSrc, 'utf8');
hub = rewriteBlogUrls(hub);
hub = modernizeChrome(hub);
hub = hub.replace(
  /<link rel="canonical" href="https:\/\/monsieurclick\.com\/blog">/,
  '<link rel="canonical" href="https://monsieurclick.com/blog/">'
);
hub = hub.replace(
  /hreflang="en" href="https:\/\/monsieurclick\.com\/blog"/g,
  'hreflang="en" href="https://monsieurclick.com/blog/"'
);
// FR blog hub is /blog/
hub = hub.replace(
  /hreflang="fr" href="https:\/\/monsieurclick\.fr\/blog"/g,
  'hreflang="fr" href="https://monsieurclick.fr/blog/"'
);
hub = hub.replace(
  /hreflang="x-default" href="https:\/\/monsieurclick\.fr\/blog"/g,
  'hreflang="x-default" href="https://monsieurclick.fr/blog/"'
);
fs.writeFileSync(path.join(EN, 'blog', 'index.html'), hub);
console.log('wrote blog/index.html');

// —— Posts ——
for (const slug of SLUGS) {
  const src = path.join(EN, `blog-${slug}.html`);
  let html = fs.readFileSync(src, 'utf8');
  html = rewriteBlogUrls(html);
  html = modernizeChrome(html);
  // canonical / paths for this post
  const dir = path.join(EN, 'blog', slug);
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  fs.unlinkSync(src);
  console.log('moved', slug);
}

// Remove old hub
fs.unlinkSync(hubSrc);
console.log('removed flat blog.html');

// —— Sitewide link rewrite (remaining HTML) ——
function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === '.wrangler' || name === 'okf') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html') || name.endsWith('.xml') || name.endsWith('.txt') || name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

let rewritten = 0;
for (const file of walk(EN)) {
  const before = fs.readFileSync(file, 'utf8');
  if (!before.includes('/blog-') && !before.includes('blog-')) continue;
  // careful: don't rewrite img-blog- or class names
  let after = before.replace(/https:\/\/monsieurclick\.com\/blog-([a-z0-9-]+)(?:\.html)?/g, 'https://monsieurclick.com/blog/$1');
  after = after.replace(/href="\/blog-([a-z0-9-]+)(?:\.html)?"/g, 'href="/blog/$1"');
  after = after.replace(/url":\s*"https:\/\/monsieurclick\.com\/blog-([a-z0-9-]+)"/g, 'url": "https://monsieurclick.com/blog/$1"');
  after = after.replace(/"@id":\s*"https:\/\/monsieurclick\.com\/blog-([a-z0-9-]+)"/g, '"@id": "https://monsieurclick.com/blog/$1"');
  // sitemap <loc>
  after = after.replace(/<loc>https:\/\/monsieurclick\.com\/blog-([a-z0-9-]+)<\/loc>/g, '<loc>https://monsieurclick.com/blog/$1/</loc>');
  after = after.replace(/<loc>https:\/\/monsieurclick\.com\/blog<\/loc>/g, '<loc>https://monsieurclick.com/blog/</loc>');
  if (after !== before) {
    fs.writeFileSync(file, after);
    rewritten++;
  }
}
console.log('rewrote files:', rewritten);

// —— Redirects ——
const redirectsPath = path.join(EN, '_redirects');
let redirects = fs.readFileSync(redirectsPath, 'utf8');
if (!redirects.includes('# Blog migration blog-xxx → /blog/xxx')) {
  const lines = [
    '',
    '# Blog migration blog-xxx → /blog/xxx',
    ...SLUGS.flatMap((s) => [
      `/blog-${s} /blog/${s}/ 301`,
      `/blog-${s}.html /blog/${s}/ 301`,
    ]),
    '/blog /blog/ 301',
    '/blog.html /blog/ 301',
  ];
  redirects = redirects.trimEnd() + '\n' + lines.join('\n') + '\n';
  fs.writeFileSync(redirectsPath, redirects);
  console.log('redirects added');
} else {
  console.log('redirects already present');
}

// —— FR hreflang: point to /blog/slug/ ——
const twinMap = {
  'apparaitre-reponses-chatgpt-gemini-perplexity': 'appear-in-chatgpt-gemini-perplexity',
  'click-first-pas-une-prestation-seo': 'click-first-not-just-seo',
  'clients-utilisent-chatgpt-avant-google': 'clients-ask-chatgpt-before-google',
  'comment-google-classe-les-entreprises': 'how-google-ranks-businesses',
  'entreprise-reference-plutot-que-visible': 'become-a-reference-business',
  'fiche-google-business-profile-sans-appel': 'google-business-profile-no-calls',
  'geo-generative-engine-optimization': 'geo-generative-engine-optimization',
  'google-ads-ou-seo': 'google-ads-vs-seo',
  'ia-vont-elles-remplacer-google': 'will-ai-replace-google',
  'obtenir-plus-avis-google': 'get-more-google-reviews',
  'pourquoi-concurrents-devant-google': 'why-competitors-rank-ahead',
  'pourquoi-entreprise-invisible-google': 'why-business-not-on-google',
  'site-internet-perd-clients': 'is-your-website-losing-clients',
  'site-suffit-2026': 'is-a-website-enough-2026',
  'trouver-clients-sans-publicite': 'get-clients-without-advertising',
  'c-est-quoi-une-agence-seo': 'what-is-an-seo-agency',
  'comment-choisir-agence-seo-paris': 'how-to-choose-an-seo-agency',
  'prix-tarif-agence-seo-2026': 'seo-agency-pricing-2026',
};

let frUpdated = 0;
for (const [frSlug, enSlug] of Object.entries(twinMap)) {
  const frFile = path.join(FR, 'blog', frSlug, 'index.html');
  if (!fs.existsSync(frFile)) continue;
  let t = fs.readFileSync(frFile, 'utf8');
  const newUrl = `https://monsieurclick.com/blog/${enSlug}/`;
  const oldFlat = `https://monsieurclick.com/blog-${enSlug}`;
  let next = t
    .replaceAll(`${oldFlat}/`, newUrl)
    .replaceAll(oldFlat, newUrl.replace(/\/$/, '')); // may leave without slash
  // normalize to trailing slash form
  next = next.replace(
    new RegExp(`hreflang="en" href="https://monsieurclick\\.com/blog/${enSlug}"(?!/)`),
    `hreflang="en" href="${newUrl}"`
  );
  // If no en hreflang yet, insert
  if (!next.includes(`hreflang="en"`) || (!next.includes(`/blog/${enSlug}`) && !next.includes(`blog-${enSlug}`))) {
    if (!next.includes(`href="${newUrl}"`) && !next.includes(`/blog/${enSlug}`)) {
      next = next.replace(
        /(<link rel="alternate" hreflang="fr" href="[^"]+">)/,
        `$1\n<link rel="alternate" hreflang="en" href="${newUrl}">`
      );
    }
  }
  // Force correct EN URL if present as flat
  next = next.replace(
    new RegExp(`<link rel="alternate" hreflang="en" href="https://monsieurclick\\.com/blog-${enSlug}/?">`),
    `<link rel="alternate" hreflang="en" href="${newUrl}">`
  );
  next = next.replace(
    new RegExp(`<link rel="alternate" hreflang="en" href="https://monsieurclick\\.com/blog/${enSlug}">`),
    `<link rel="alternate" hreflang="en" href="${newUrl}">`
  );
  if (next !== t) {
    fs.writeFileSync(frFile, next);
    frUpdated++;
  }
}
console.log('FR hreflang updated:', frUpdated);

// FR blog hub EN link if any
const frHub = path.join(FR, 'blog', 'index.html');
if (fs.existsSync(frHub)) {
  let t = fs.readFileSync(frHub, 'utf8');
  const next = t
    .replace(/hreflang="en" href="https:\/\/monsieurclick\.com\/blog"/g, 'hreflang="en" href="https://monsieurclick.com/blog/"')
    .replace(/hreflang="en" href="https:\/\/monsieurclick\.com\/blog\.html"/g, 'hreflang="en" href="https://monsieurclick.com/blog/"');
  if (!next.includes('hreflang="en" href="https://monsieurclick.com/blog/"')) {
    // insert if missing
    if (!/hreflang="en"/.test(next.split('</head>')[0])) {
      const withEn = next.replace(
        /(<link rel="alternate" hreflang="fr" href="[^"]+">)/,
        '$1\n<link rel="alternate" hreflang="en" href="https://monsieurclick.com/blog/">'
      );
      fs.writeFileSync(frHub, withEn);
      console.log('FR hub hreflang inserted');
    }
  } else if (next !== t) {
    fs.writeFileSync(frHub, next);
    console.log('FR hub hreflang normalized');
  }
}

console.log('done. posts:', SLUGS.length);
