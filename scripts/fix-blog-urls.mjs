#!/usr/bin/env node
/**
 * fix-blog-urls.mjs : realigne les URLs des articles de blog sur les fichiers
 * reellement produits par le build.
 *
 * Probleme corrige : le build FR emet les articles en /blog-<slug> (fichier
 * blog-<slug>.html) alors que le canonical, les hreflang, og:url, le JSON-LD et
 * le sitemap declarent /blog/<slug>/ , une URL qui n'existe pas (404).
 * Resultat : 15 articles declarent a Google un canonical mort et le sitemap
 * soumet 15 URLs en 404.
 *
 * Usage (dans le repo monsieur-click-V2, apres le build Astro) :
 *   node scripts/fix-blog-urls.mjs fr
 *   node scripts/fix-blog-urls.mjs com
 *
 * A placer dans la chaine de build juste avant postbuild-cf.mjs :
 *   "build:fr": "... && node scripts/fix-blog-urls.mjs fr && node scripts/postbuild-cf.mjs fr"
 *
 * Le script est idempotent : il ne touche qu'une URL /blog/<slug>/ si le fichier
 * plat blog-<slug>.html existe bien dans dist. Relancer ne casse rien.
 */
import fs from 'node:fs';
import path from 'node:path';

const site = process.argv[2];
if (!['fr', 'com'].includes(site)) {
  console.error('Usage: node scripts/fix-blog-urls.mjs <fr|com>');
  process.exit(1);
}

const host = site === 'fr' ? 'monsieurclick.fr' : 'monsieurclick.com';
const dist = path.resolve(`sites/${site}/dist`);
if (!fs.existsSync(dist)) {
  console.error(`[${site}] dist introuvable, lancer le build Astro d'abord`);
  process.exit(1);
}

// 1) inventaire des articles reellement produits : blog-<slug>.html a la racine de dist
const slugs = fs
  .readdirSync(dist)
  .map((f) => /^blog-([a-z0-9-]+)\.html$/.exec(f))
  .filter(Boolean)
  .map((m) => m[1]);

if (slugs.length === 0) {
  console.error(`[${site}] aucun blog-<slug>.html dans dist, rien a faire`);
  process.exit(1);
}
console.log(`[${site}] ${slugs.length} articles plats detectes`);

// /blog/<slug>/ ou /blog/<slug>  ->  /blog-<slug>
const re = /https:\/\/(www\.)?(monsieurclick\.(?:fr|com))\/blog\/([a-z0-9-]+)\/?/g;

let files = 0;
let replacements = 0;
let leftOver = 0;

function fix(file, body) {
  const next = body.replace(re, (full, www, domain, slug) => {
    const flat = `${path.dirname(file)}/blog-${slug}.html`;
    if (slug !== '' && fs.existsSync(flat)) {
      replacements += 1;
      return `https://${www || ''}${domain}/blog-${slug}`;
    }
    leftOver += 1;
    return full;
  });
  if (next !== body) {
    fs.writeFileSync(file, next);
    files += 1;
  }
}

// 2) pages HTML (articles + hub + sitemap), en ignorant les dossiers d'assets
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['_astro', 'fonts', 'img', 'images'].includes(entry.name)) continue;
      walk(p);
    } else if (entry.name.endsWith('.html') || entry.name === 'sitemap.xml') {
      fix(p, fs.readFileSync(p, 'utf8'));
    }
  }
}
walk(dist);

// 2b) liens internes du hub ecrits en relatif (href="blog-<slug>") : ils ne
// resolvent vers /blog-<slug> que parce que le hub est servi sans slash final.
// On les rend absolus pour ne plus dependre de ce detail de routage.
const reRel = /href="(blog-([a-z0-9-]+))"/g;
function absolutise(file) {
  const body = fs.readFileSync(file, 'utf8');
  const next = body.replace(reRel, (full, rel, slug) => {
    if (fs.existsSync(`${path.dirname(file)}/blog-${slug}.html`)) {
      replacements += 1;
      return `href="/blog-${slug}"`;
    }
    return full;
  });
  if (next !== body) {
    fs.writeFileSync(file, next);
    files += 1;
  }
}
for (const name of ['blog.html', 'blog', 'index.html']) {
  const p = path.join(dist, name);
  if (fs.existsSync(p) && fs.statSync(p).isFile()) absolutise(p);
  const nested = path.join(dist, name, 'index.html');
  if (fs.existsSync(nested)) absolutise(nested);
}

console.log(`[${site}] ${replacements} URL(s) corrigee(s) dans ${files} fichier(s)`);
if (leftOver > 0) {
  console.warn(`[${site}] ${leftOver} reference(s) /blog/<slug>/ laissee(s) telle(s) quelle(s) (pas de fichier plat correspondant)`);
}

// 3) verification finale : plus aucune reference a /blog/<slug>/ pour un article existant
let remaining = 0;
function verify(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['_astro', 'fonts', 'img', 'images'].includes(entry.name)) continue;
      verify(p);
    } else if (entry.name.endsWith('.html') || entry.name === 'sitemap.xml') {
      const body = fs.readFileSync(p, 'utf8');
      for (const slug of slugs) {
        if (body.includes(`/blog/${slug}/`) || body.includes(`/blog/${slug}"`) || body.includes(`/blog/${slug}<`)) {
          remaining += 1;
        }
      }
    }
  }
}
verify(dist);

if (remaining > 0) {
  console.error(`[${site}] ECHEC : ${remaining} reference(s) imbriquee(s) subsistent`);
  process.exit(1);
}
console.log(`[${site}] OK, canonicals et sitemap alignes sur les URLs servies`);
