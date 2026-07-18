#!/usr/bin/env node
/**
 * Regenerate Astro pages from legacy HTML:
 * - site-header pages → BaseLayout + content partial
 * - other pages (OKF, tools) → full raw HTML wrapper
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

function attr(html, name) {
  const re = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`, 'i');
  return (html.match(re)?.[1] || html.match(re2)?.[1] || '').trim();
}

function prop(html, name) {
  const re = new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${name}["']`, 'i');
  return (html.match(re)?.[1] || html.match(re2)?.[1] || '').trim();
}

function extract(html) {
  const title = (html.match(/<title>([^<]*)<\/title>/i)?.[1] || '').trim();
  const description = attr(html, 'description') || prop(html, 'og:description');
  const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    || '').trim();
  const hreflang = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map((m) => ({ lang: m[1], href: m[2] }));
  if (!hreflang.length) {
    for (const m of html.matchAll(/<link[^>]+hreflang=["']([^"']+)["'][^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["'][^>]*>/gi)) {
      hreflang.push({ lang: m[1], href: m[2] });
    }
  }
  const ogImage = prop(html, 'og:image');
  const jsonLd = [...html.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1].trim());
  const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);

  const hasChrome = /class=["'][^"']*site-header/.test(html);
  let bodyInner = '';
  if (hasChrome) {
    const afterHeader = html.split(/<\/header>/i);
    // First site-header closes; content may include page-hero <header>
    let rest = afterHeader.slice(1).join('</header>');
    // Prefer <main>...</main>
    const main = rest.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
    if (main) {
      bodyInner = `<main id="main">${main[1]}</main>`;
    } else {
      // Between end of site-header and footer
      const beforeFooter = rest.split(/<footer\b[^>]*class=["'][^"']*site-footer/i)[0] || rest;
      bodyInner = beforeFooter.replace(/<script[\s\S]*$/i, '').trim();
      if (!/<main\b/i.test(bodyInner)) {
        bodyInner = `<main id="main">\n${bodyInner}\n</main>`;
      }
    }
  }

  return {
    title,
    description,
    canonical,
    hreflang,
    ogImage,
    jsonLd,
    scripts: scripts.length ? scripts : ['/perf.js?v=20260717ds2', '/shared.js?v=20260717ds2'],
    hasChrome,
    bodyInner,
  };
}

function jsString(value) {
  return JSON.stringify(value);
}

function toPagePath(legacyRel) {
  if (legacyRel === 'blog.html' || legacyRel === 'blog-hub-legacy.html') {
    return 'blog-hub-legacy.astro';
  }
  if (legacyRel.endsWith('/index.html') || legacyRel === 'index.html') {
    const dir = legacyRel === 'index.html' ? '' : path.dirname(legacyRel);
    return path.join(dir, 'index.astro');
  }
  return legacyRel.replace(/\.html$/, '.astro');
}

function writeLayoutPage({ pageAbs, contentRelImport, meta, site }) {
  const layoutImport = '@mc/shared/layouts/BaseLayout.astro';
  const chromeImport = '../'.repeat(
    path.relative(path.join(site, 'src/pages'), path.dirname(pageAbs)).split(path.sep).filter(Boolean).length + 1,
  ) + 'chrome.ts';

  // Fix chrome import: from src/pages/... to src/chrome.ts
  const fromPages = path.relative(path.dirname(pageAbs), path.join(site, 'src/chrome.ts')).replace(/\\/g, '/');
  const chromePath = fromPages.startsWith('.') ? fromPages : `./${fromPages}`;

  const content = `---
import BaseLayout from '${layoutImport}';
import { locale, nav, footer } from '${chromePath}';
import bodyHtml from '${contentRelImport}';

const title = ${jsString(meta.title)};
const description = ${jsString(meta.description)};
const canonical = ${jsString(meta.canonical)};
const hreflang = ${jsString(meta.hreflang)};
const ogImage = ${jsString(meta.ogImage || undefined)};
const jsonLd = ${jsString(meta.jsonLd)};
const scripts = ${jsString(meta.scripts)};
---
<BaseLayout
  locale={locale}
  title={title}
  description={description}
  canonical={canonical}
  hreflang={hreflang}
  ogImage={ogImage}
  jsonLd={jsonLd}
  scripts={scripts}
  nav={nav}
  footer={footer}
>
  <Fragment set:html={bodyHtml} />
</BaseLayout>
`;
  fs.mkdirSync(path.dirname(pageAbs), { recursive: true });
  fs.writeFileSync(pageAbs, content, 'utf8');
}

function writeRawPage(pageAbs, legacyAbs) {
  const fromDir = path.dirname(pageAbs);
  let rel = path.relative(fromDir, legacyAbs).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  const content = `---
import rawHtml from '${rel}?raw';
---
<Fragment set:html={rawHtml} />
`;
  fs.mkdirSync(path.dirname(pageAbs), { recursive: true });
  fs.writeFileSync(pageAbs, content, 'utf8');
}

function regen(siteLabel) {
  const site = path.resolve(`sites/${siteLabel}`);
  const legacyRoot = path.join(site, 'legacy-html');
  const contentRoot = path.join(site, 'content');
  const pagesRoot = path.join(site, 'src', 'pages');

  fs.rmSync(pagesRoot, { recursive: true, force: true });
  fs.rmSync(contentRoot, { recursive: true, force: true });
  fs.mkdirSync(pagesRoot, { recursive: true });
  fs.mkdirSync(contentRoot, { recursive: true });

  const files = walk(legacyRoot);
  // Dedupe foo.html vs foo/index.html → prefer index
  const byOut = new Map();
  for (const file of files) {
    const rel = path.relative(legacyRoot, file);
    const pageRel = toPagePath(rel).replace(/\\/g, '/');
    const outUrl = pageRel.replace(/\/index\.astro$/, '/').replace(/\.astro$/, '/');
    const isIndex = pageRel.endsWith('/index.astro') || pageRel === 'index.astro';
    const prev = byOut.get(outUrl);
    if (!prev || (isIndex && !prev.isIndex)) {
      byOut.set(outUrl, { file, rel, pageRel, isIndex });
    }
  }

  let layoutCount = 0;
  let rawCount = 0;

  for (const { file, rel, pageRel } of byOut.values()) {
    const html = fs.readFileSync(file, 'utf8');
    const meta = extract(html);
    const pageAbs = path.join(pagesRoot, pageRel);

    if (meta.hasChrome && meta.bodyInner) {
      const contentRel = pageRel.replace(/\.astro$/, '.html');
      const contentAbs = path.join(contentRoot, contentRel);
      fs.mkdirSync(path.dirname(contentAbs), { recursive: true });
      fs.writeFileSync(contentAbs, meta.bodyInner, 'utf8');

      let importPath = path.relative(path.dirname(pageAbs), contentAbs).replace(/\\/g, '/');
      if (!importPath.startsWith('.')) importPath = `./${importPath}`;
      writeLayoutPage({
        pageAbs,
        contentRelImport: `${importPath}?raw`,
        meta,
        site,
      });
      layoutCount++;
    } else {
      writeRawPage(pageAbs, file);
      rawCount++;
    }
  }

  console.log(`[${siteLabel}] layout pages=${layoutCount} raw pages=${rawCount}`);
}

// Ensure sites can resolve @mc/shared
for (const site of ['fr', 'com']) {
  const pkgPath = path.resolve(`sites/${site}/package.json`);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies['@mc/shared'] = '*';
  pkg.dependencies.astro = pkg.dependencies.astro || '^5.10.0';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  const astroPath = path.resolve(`sites/${site}/astro.config.mjs`);
  fs.writeFileSync(
    astroPath,
    `import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: ${site === 'fr' ? "'https://monsieurclick.fr'" : "'https://monsieurclick.com'"},
  output: 'static',
  build: { format: 'directory' },
  vite: {
    resolve: {
      alias: {
        '@mc/shared': path.resolve(root, '../../packages/shared'),
      },
    },
  },
});
`,
  );
}

regen('fr');
regen('com');
