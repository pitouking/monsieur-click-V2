#!/usr/bin/env node
/**
 * Generate indexable sitemaps for FR + COM from legacy-html.
 * Excludes noindex, 404, admin, redirects stubs, OKF mirrors.
 */
import fs from 'node:fs';
import path from 'node:path';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function isNoindex(html) {
  return /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)
    || /content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(html);
}

function toUrl(rel) {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -10)}`;
  return `/${rel.replace(/\.html$/, '')}`;
}

function priorityFor(url) {
  if (url === '/') return '1.0';
  if (url === '/services' || url === '/services/' || url.startsWith('/services/')) return '0.9';
  if (['/click-first', '/offres', '/pricing', '/contact', '/small-business-seo'].includes(url)) return '0.9';
  if (url.startsWith('/agence-') || url.startsWith('/consultant-') || url.startsWith('/creation-') || url === '/seo-agency-london' || url === '/ai-seo-agency') return '0.8';
  if (url.startsWith('/blog')) return '0.7';
  if (url.startsWith('/realisations') || url.startsWith('/case-studies')) return '0.7';
  if (url.startsWith('/mentions') || url.startsWith('/confidential') || url.startsWith('/conditions') || url.startsWith('/legal') || url.startsWith('/privacy') || url.startsWith('/terms') || url === '/about' || url === '/a-propos') return '0.5';
  return '0.8';
}

function normalizeLoc(url) {
  // Prefer trailing slash for directory-style hubs already using it in live
  const slashDirs = ['/services', '/blog', '/realisations', '/case-studies', '/okf'];
  if (slashDirs.some((d) => url === d || url.startsWith(`${d}/`))) {
    if (!url.endsWith('/')) return `${url}/`;
  }
  return url;
}

function generate(siteLabel, origin) {
  const legacyRoot = path.resolve(`sites/${siteLabel}/legacy-html`);
  const outPath = path.resolve(`sites/${siteLabel}/asset-src/sitemap.xml`);
  const skipNames = new Set(['404.html', 'admin-scores.html', 'blog-hub-legacy.html', 'methode.html']);

  const urls = [];
  for (const file of walk(legacyRoot)) {
    const rel = path.relative(legacyRoot, file).replace(/\\/g, '/');
    if (skipNames.has(path.basename(rel)) || rel.includes('blog-hub-legacy')) continue;
    if (rel.startsWith('okf/')) continue; // OKF mirrors are noindex / tool copies
    const html = fs.readFileSync(file, 'utf8');
    if (isNoindex(html)) continue;
    let url = toUrl(rel);
    url = normalizeLoc(url === '/services' ? '/services/' : url);
    urls.push(url);
  }

  // Stable unique sort
  const unique = [...new Set(urls)].sort((a, b) => a.localeCompare(b));

  const body = unique.map((url) => {
    const loc = `${origin}${url === '/' ? '/' : url}`;
    const pri = priorityFor(url.replace(/\/$/, '') || '/');
    const freq = pri === '0.5' ? 'yearly' : 'monthly';
    return `  <url><loc>${loc}</loc><changefreq>${freq}</changefreq><priority>${pri}</priority></url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(`[${siteLabel}] sitemap → ${unique.length} URLs → ${outPath}`);
  return unique;
}

generate('fr', 'https://monsieurclick.fr');
generate('com', 'https://monsieurclick.com');
