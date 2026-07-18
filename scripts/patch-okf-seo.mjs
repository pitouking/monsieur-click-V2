#!/usr/bin/env node
/** OKF mirror pages: noindex + canonical to main site (keep okf/index.html indexable). */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FR = path.resolve(__dirname, '..');
const EN = path.resolve(FR, '../en');

const FR_BLOG = {
  'blog-apparaitre-reponses-chatgpt-gemini-perplexity.html': '/blog/apparaitre-reponses-chatgpt-gemini-perplexity/',
  'blog-c-est-quoi-une-agence-seo.html': '/blog/c-est-quoi-une-agence-seo/',
  'blog-click-first-pas-une-prestation-seo.html': '/blog/click-first-pas-une-prestation-seo/',
  'blog-clients-utilisent-chatgpt-avant-google.html': '/blog/clients-utilisent-chatgpt-avant-google/',
  'blog-comment-choisir-agence-seo-paris.html': '/blog/comment-choisir-agence-seo-paris/',
  'blog-comment-google-classe-les-entreprises.html': '/blog/comment-google-classe-les-entreprises/',
  'blog-entreprise-reference-plutot-que-visible.html': '/blog/entreprise-reference-plutot-que-visible/',
  'blog-fiche-google-business-profile-sans-appel.html': '/blog/fiche-google-business-profile-sans-appel/',
  'blog-geo-generative-engine-optimization.html': '/blog/geo-generative-engine-optimization/',
  'blog-google-ads-ou-seo.html': '/blog/google-ads-ou-seo/',
  'blog-ia-vont-elles-remplacer-google.html': '/blog/ia-vont-elles-remplacer-google/',
  'blog-obtenir-plus-avis-google.html': '/blog/obtenir-plus-avis-google/',
  'blog-pourquoi-concurrents-devant-google.html': '/blog/pourquoi-concurrents-devant-google/',
  'blog-pourquoi-entreprise-invisible-google.html': '/blog/pourquoi-entreprise-invisible-google/',
  'blog-prix-tarif-agence-seo-2026.html': '/blog/prix-tarif-agence-seo-2026/',
  'blog-site-internet-perd-clients.html': '/blog/site-internet-perd-clients/',
  'blog-site-suffit-2026.html': '/blog/site-suffit-2026/',
  'blog-trouver-clients-sans-publicite.html': '/blog/trouver-clients-sans-publicite/',
};

const EN_BLOG = {
  'blog-appear-in-chatgpt-gemini-perplexity.html': '/blog/appear-in-chatgpt-gemini-perplexity/',
  'blog-become-a-reference-business.html': '/blog/become-a-reference-business/',
  'blog-click-first-not-just-seo.html': '/blog/click-first-not-just-seo/',
  'blog-clients-ask-chatgpt-before-google.html': '/blog/clients-ask-chatgpt-before-google/',
  'blog-geo-generative-engine-optimization.html': '/blog/geo-generative-engine-optimization/',
  'blog-get-clients-without-advertising.html': '/blog/get-clients-without-advertising/',
  'blog-get-more-google-reviews.html': '/blog/get-more-google-reviews/',
  'blog-google-ads-vs-seo.html': '/blog/google-ads-vs-seo/',
  'blog-google-business-profile-no-calls.html': '/blog/google-business-profile-no-calls/',
  'blog-how-google-ranks-businesses.html': '/blog/how-google-ranks-businesses/',
  'blog-how-to-choose-an-seo-agency.html': '/blog/how-to-choose-an-seo-agency/',
  'blog-is-a-website-enough-2026.html': '/blog/is-a-website-enough-2026/',
  'blog-is-your-website-losing-clients.html': '/blog/is-your-website-losing-clients/',
  'blog-seo-agency-pricing-2026.html': '/blog/seo-agency-pricing-2026/',
  'blog-what-is-an-seo-agency.html': '/blog/what-is-an-seo-agency/',
  'blog-why-business-not-on-google.html': '/blog/why-business-not-on-google/',
  'blog-why-competitors-rank-ahead.html': '/blog/why-competitors-rank-ahead/',
  'blog-will-ai-replace-google.html': '/blog/will-ai-replace-google/',
};

const FR_SERVICE = {
  'services/creation-site-web/index.html': '/services/creation-site-web/',
  'services/creation-site-web.html': '/services/creation-site-web/',
  'services/seo/index.html': '/services/seo/',
  'services/seo-local/index.html': '/services/seo-local/',
  'services/seo-local.html': '/services/seo-local/',
  'services/seo-local-site-web.html': '/services/seo-local/',
  'services/google-business-profile/index.html': '/services/google-business-profile/',
  'services/audit-seo/index.html': '/services/audit-seo/',
  'services/refonte-site-web/index.html': '/services/refonte-site-web/',
  'services/creation-site-wordpress/index.html': '/services/creation-site-wordpress/',
  'services/visibilite-ia-geo/index.html': '/services/visibilite-ia-geo/',
  'services/framework-geo-ia.html': '/services/visibilite-ia-geo/',
  'services/seo-chatgpt.html': '/services/visibilite-ia-geo/',
  'services/copywriting-storybrand.html': '/services/creation-site-web/',
  'services/optimisation-mensuelle.html': '/offres',
  'services/index.html': '/services/',
};

const EN_SERVICE = {
  'services/web-design/index.html': '/services/web-design/',
  'services/seo/index.html': '/services/seo/',
  'services/local-seo/index.html': '/services/local-seo/',
  'services/google-business-profile/index.html': '/services/google-business-profile/',
  'services/seo-audit/index.html': '/services/seo-audit/',
  'services/wordpress-web-design/index.html': '/services/wordpress-web-design/',
  'services/generative-engine-optimization/index.html': '/services/generative-engine-optimization/',
  'services/ai-seo-agency/index.html': '/ai-seo-agency/',
  'services/small-business-seo/index.html': '/small-business-seo/',
  'services/seo-agency-london/index.html': '/seo-agency-london/',
  'services/index.html': '/services/',
};

function canonicalFor(rel, baseUrl, maps) {
  const base = rel.replace(/^okf\//, '');
  if (base === 'index.html') return null;
  if (maps.SERVICE[base]) return baseUrl + maps.SERVICE[base];
  if (base.startsWith('blog/') && base.endsWith('.html') && base !== 'blog/index.html') {
    const slug = path.basename(base, '.html');
    return `${baseUrl}/blog/${slug}/`;
  }
  if (/^(agence-|consultant-|creation-site-)/.test(base)) {
    const slug = base.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    return `${baseUrl}/${slug}/`;
  }
  if (base === 'blog/index.html') return baseUrl + '/blog/';
  if (base === 'a-propos.html') return baseUrl + '/a-propos';
  if (base === 'about.html') return baseUrl + '/about';
  if (base === 'realisations.html') return baseUrl + '/realisations/';
  if (base === 'case-studies.html' || base === 'case-studies/index.html') return baseUrl + '/case-studies/';
  if (base === 'contact.html') return baseUrl + '/contact';
  if (base === 'offres/index.html') return baseUrl + '/offres';
  if (base === 'pricing/index.html') return baseUrl + '/pricing';
  if (base === 'click-first/index.html') return baseUrl + '/click-first';
  return null;
}

function patchFile(file, canonical) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<meta name="robots" content="[^"]*">/i, '');
  html = html.replace(/<link rel="canonical" href="[^"]*">/i, '');
  const insert = `<link rel="canonical" href="${canonical}">\n<meta name="robots" content="noindex, follow">`;
  html = html.replace(/<meta charset="UTF-8">/i, (m) => `${m}\n${insert}`);
  fs.writeFileSync(file, html);
}

function walkHtml(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, acc);
    else if (ent.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function walkOkf(root, baseUrl, maps) {
  const okfDir = path.join(root, 'okf');
  if (!fs.existsSync(okfDir)) return 0;
  let n = 0;
  for (const file of walkHtml(okfDir)) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    if (rel === 'okf/index.html') continue;
    const canonical = canonicalFor(rel, baseUrl, maps);
    if (!canonical) {
      console.warn('skip (no map):', rel);
      continue;
    }
    patchFile(file, canonical);
    n++;
  }
  return n;
}

const frN = walkOkf(FR, 'https://monsieurclick.fr', { BLOG: FR_BLOG, SERVICE: FR_SERVICE });
const enN = walkOkf(EN, 'https://monsieurclick.com', { BLOG: EN_BLOG, SERVICE: EN_SERVICE });
console.log(`Patched ${frN} FR OKF + ${enN} EN OKF pages (noindex + canonical)`);
