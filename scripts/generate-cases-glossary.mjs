#!/usr/bin/env node
/**
 * Generates /realisations/* case pages, hub, /glossaire/* and EN mirrors.
 * Run from monsieur-click-V2: node scripts/generate-cases-glossary.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FR = path.resolve(__dirname, '..');
const EN = path.resolve(FR, '../en');

const cases = [
  {
    slug: 'assogym',
    name: 'Assogym',
    site: 'assogym.fr · Score 93.4 · TTI 697 ms',
    sectorFr: 'Club de fitness · Coulombs, France',
    sectorEn: 'Fitness club · Coulombs, France',
    img: '/assogym-mobile.webp',
    catFr: 'Bien-être & Santé',
    catEn: 'Wellness & Health',
    problemFr: 'Un club de fitness local invisible sur Google, qui perdait des membres au profit de concurrents mieux référencés dans le même département.',
    problemEn: 'A local fitness club invisible on Google, losing members to better-ranked competitors in the same area.',
    solutionFr: 'Écosystème complet : site WordPress sur mesure avec horaires des cours, SEO local ciblant « club de sport + département », optimisation Google Business Profile et framework GEO pour la visibilité ChatGPT.',
    solutionEn: 'A complete ecosystem: a custom WordPress site with class schedules, local SEO targeting "sports club + area", Google Business Profile optimization and a GEO framework for ChatGPT visibility.',
    resultsFr: ['#1 Google', '+300 % visibilité', '+40 % inscriptions', 'Cité par ChatGPT'],
    resultsEn: ['#1 Google', '+300% visibility', '+40% sign-ups', 'Cited by ChatGPT'],
    quoteFr: 'Notre club est maintenant premier dans les recherches Google sur tout le département. Jean a compris exactement ce dont nous avions besoin et a livré un site que nos membres adorent.',
    quoteEn: 'Our club is now first in Google searches across the whole area. Jean understood exactly what we needed and delivered a site our members love.',
    who: 'Assogym, Coulombs',
    tldrFr: 'Invisible sur Google → #1 département, +40 % inscriptions',
    tldrEn: 'Invisible on Google → #1 in area, +40% sign-ups',
    tagsFr: ['SEO local', 'Google Business Profile', 'GEO', 'WordPress'],
    tagsEn: ['Local SEO', 'Google Business Profile', 'GEO', 'WordPress'],
  },
  {
    slug: 'dharma-massage-therapy',
    name: 'Dharma Massage Therapy',
    site: 'dharmamassagetherapy.com · Score 96.3 · TTI 779 ms',
    sectorFr: 'Massage thérapeutique · États-Unis',
    sectorEn: 'Therapeutic massage · United States',
    img: '/dharma-massage-mobile.webp',
    catFr: 'Bien-être & Santé',
    catEn: 'Wellness & Health',
    problemFr: 'Un cabinet de massage médical haut de gamme dont le site ne reflétait pas le calibre du travail, se classant sur des termes génériques de « spa massage » au lieu des mots-clés médicaux premium.',
    problemEn: 'A high-end medical massage practice whose site did not reflect the quality of the work, ranking for generic "spa massage" terms instead of premium medical keywords.',
    solutionFr: 'Refonte StoryBrand, repositionnement vers le travail corporel de qualité médicale, SEO sur « thérapie neuromusculaire » et « massothérapeute médical », Google Business Profile et réservation.',
    solutionEn: 'StoryBrand rewrite, repositioning toward medical-grade bodywork, SEO for neuromuscular therapy and medical massage therapist, Google Business Profile and booking.',
    resultsFr: ['Mots-clés médicaux #1', 'Bonne clientèle', 'Cabinet en croissance', 'Propulsé par StoryBrand'],
    resultsEn: ['Medical keywords #1', 'Ideal clientele', 'Growing practice', 'StoryBrand-powered'],
    quoteFr: 'Avant Monsieur Click, mon site disait "massage", et j\'attirais des clients de spa. Maintenant mon site dit "massage médical" et attire exactement les patients que je suis formé à aider.',
    quoteEn: 'Before Monsieur Click, my site said "massage" and attracted spa clients. Now it says "medical massage" and attracts exactly the patients I am trained to help.',
    who: 'Dharma Massage Therapy',
    tldrFr: 'Site « spa » → mots-clés médicaux #1, bonne clientèle',
    tldrEn: '"Spa" positioning → medical keywords #1, ideal clientele',
    tagsFr: ['StoryBrand', 'SEO local', 'Google Business Profile', 'Réservation'],
    tagsEn: ['StoryBrand', 'Local SEO', 'Google Business Profile', 'Booking'],
  },
  {
    slug: 'susan-filan',
    name: 'Susan Filan',
    site: 'susanfilan.com',
    sectorFr: 'Avocate · Westport, CT, États-Unis',
    sectorEn: 'Attorney · Westport, CT, United States',
    img: '/susan-filan-mobile.webp',
    catFr: 'Services Professionnels',
    catEn: 'Professional Services',
    problemFr: 'Une avocate senior avec des décennies d\'expérience, mais un site qui ne reflétait pas sa stature et zéro visibilité Google pour sa niche.',
    problemEn: 'A senior attorney with decades of experience, but a site that did not match her stature and zero Google visibility for her niche.',
    solutionFr: 'Site de marque personnelle, SEO avancé sur sa niche juridique, et framework GEO IA : elle est citée par ChatGPT pour les requêtes de sa spécialité.',
    solutionEn: 'Personal brand site, advanced SEO for her legal niche, and an AI GEO framework: she is now cited by ChatGPT for specialty queries.',
    resultsFr: ['Première page Google', 'Citée par ChatGPT', 'Marque personnelle', '2-3 recommandations/mois'],
    resultsEn: ['Google first page', 'Cited by ChatGPT', 'Personal brand', '2-3 referrals/month'],
    quoteFr: 'Si vous cherchez quelqu\'un pour créer votre site web, arrêtez de chercher. JP est patient, brillant, et comprend instinctivement ce que vous essayez de créer.',
    quoteEn: 'If you are looking for someone to build your website, stop looking. JP is patient, brilliant, and instinctively understands what you are trying to create.',
    who: 'Susan Filan, Avocate',
    tldrFr: 'Zéro visibilité niche → 1re page Google, citée par ChatGPT',
    tldrEn: 'Zero niche visibility → Google page 1, cited by ChatGPT',
    tagsFr: ['Marque personnelle', 'SEO niche', 'GEO', 'Avocat'],
    tagsEn: ['Personal brand', 'Niche SEO', 'GEO', 'Attorney'],
  },
  {
    slug: 'bodyguard-paris',
    name: 'Bodyguard Paris',
    site: 'bodyguard-paris.com · Score 93.8 · TTI 812 ms',
    sectorFr: 'Protection rapprochée · Paris, France',
    sectorEn: 'Close protection · Paris, France',
    img: '/bodyguard-paris-mobile.webp',
    catFr: 'Services Professionnels',
    catEn: 'Professional Services',
    problemFr: 'Une agence de sécurité premium à Paris dépendant entièrement du bouche-à-oreille. Pas de site, pas de présence Google.',
    problemEn: 'A premium security agency in Paris depending entirely on word of mouth. No site, no Google presence.',
    solutionFr: 'Site élégant avec une page par niveau de protection, SEO local sur « protection rapprochée Paris », Google Business Profile et GEO pour les clients internationaux.',
    solutionEn: 'Elegant site with a page per protection level, local SEO for close protection Paris, Google Business Profile and GEO for international clients.',
    resultsFr: ['#1-3 Google FR', 'Clients internationaux', 'Visible sur ChatGPT', 'Signaux de confiance'],
    resultsEn: ['#1-3 Google FR', 'International clients', 'Visible on ChatGPT', 'Trust signals'],
    quoteFr: 'Notre réputation a toujours été solide, mais nous n\'avions rien pour le montrer en ligne. Maintenant, quand les clients nous googlent, ils voient exactement qui nous sommes.',
    quoteEn: 'Our reputation was always strong, but we had nothing to show online. Now when clients Google us, they see exactly who we are.',
    who: 'Bodyguard Paris',
    tldrFr: 'Bouche-à-oreille seul → #1-3 Google, clients internationaux',
    tldrEn: 'Word of mouth only → #1-3 Google, international clients',
    tagsFr: ['SEO local', 'Google Business Profile', 'GEO', 'Site sur mesure'],
    tagsEn: ['Local SEO', 'Google Business Profile', 'GEO', 'Custom site'],
  },
  {
    slug: 'heather-fillmore-coaching',
    name: 'Heather Fillmore Coaching',
    site: 'heatherfillmorecoaching.com',
    sectorFr: 'Coach de vie & business · États-Unis',
    sectorEn: 'Life & business coach · United States',
    img: '/heather-fillmore-mobile.webp',
    catFr: 'Coaching & Créatif',
    catEn: 'Coaching & Creative',
    problemFr: 'Une coach talentueuse avec une clientèle solide, mais un site qui ne communiquait pas ce qui rendait son approche différente.',
    problemEn: 'A talented coach with a solid client base, but a site that did not communicate what made her approach different.',
    solutionFr: 'Refonte StoryBrand recentrée sur la transformation du client, site mobile-first, et framework GEO pour ChatGPT et Perplexity.',
    solutionEn: 'StoryBrand rewrite centered on client transformation, mobile-first site, and a GEO framework for ChatGPT and Perplexity.',
    resultsFr: ['+200 % trafic', 'Visible sur ChatGPT', 'Meilleure conversion', 'Propulsé par StoryBrand'],
    resultsEn: ['+200% traffic', 'Visible on ChatGPT', 'Better conversion', 'StoryBrand-powered'],
    quoteFr: 'Mon business allait bien, mais mon site ne racontait pas mon histoire. Trafic organique +200 %. ChatGPT me recommande.',
    quoteEn: 'My business was fine, but my site was not telling my story. Organic traffic +200%. ChatGPT recommends me.',
    who: 'Heather Fillmore Coaching',
    tldrFr: 'Site sans histoire → +200 % trafic, visible sur ChatGPT',
    tldrEn: 'Site without a story → +200% traffic, visible on ChatGPT',
    tagsFr: ['StoryBrand', 'Mobile-first', 'GEO', 'Coaching'],
    tagsEn: ['StoryBrand', 'Mobile-first', 'GEO', 'Coaching'],
  },
  {
    slug: 'studio-la-voix-du-12',
    name: 'Studio La Voix du 12',
    site: 'studiolavoixdu12.fr · Score 96.3 · TTI 1.1 s',
    sectorFr: 'Studio d\'enregistrement voix · Montpellier, France',
    sectorEn: 'Voice recording studio · Montpellier, France',
    img: '/studio-voix-result.webp',
    catFr: 'Coaching & Créatif',
    catEn: 'Coaching & Creative',
    problemFr: 'Un studio professionnel à Montpellier sans vrai site, juste une page placeholder. Impossible à découvrir.',
    problemEn: 'A professional studio in Montpellier with no real site, just a placeholder page. Impossible to discover.',
    solutionFr: 'Premier vrai site vitrine avec échantillons audio, SEO local Montpellier, Google Business Profile et GEO pour la découverte nationale.',
    solutionEn: 'First real showcase site with audio samples, Montpellier local SEO, Google Business Profile and GEO for national discovery.',
    resultsFr: ['Mots-clés clés #1', '×3 réservations', 'Visible sur ChatGPT', 'Premier vrai site'],
    resultsEn: ['Key keywords #1', '×3 bookings', 'Visible on ChatGPT', 'First real site'],
    quoteFr: 'J\'ai passé des années à investir dans l\'équipement, mais nous n\'avions qu\'un placeholder. Maintenant, ce sont les studios et les agences qui nous appellent.',
    quoteEn: 'I spent years investing in equipment, but we only had a placeholder. Now studios and agencies call us.',
    who: 'Studio La Voix du 12',
    tldrFr: 'Page placeholder → mots-clés #1, ×3 réservations',
    tldrEn: 'Placeholder page → #1 keywords, 3× bookings',
    tagsFr: ['SEO local', 'Google Business Profile', 'GEO', 'Studio audio'],
    tagsEn: ['Local SEO', 'Google Business Profile', 'GEO', 'Recording studio'],
  },
  {
    slug: 'east-portland-sash',
    name: 'East Portland Sash',
    site: 'eastportlandsash.com · Portland, OR',
    sectorFr: 'Restauration de fenêtres bois · Portland, Oregon, États-Unis',
    sectorEn: 'Wood window restoration · Portland, Oregon, United States',
    img: '/eastportlandsash-mobile.webp',
    catFr: 'Artisanat & Habitat',
    catEn: 'Craft & Home',
    problemFr: 'Un artisan unique à Portland sur la restauration de fenêtres bois, mais difficile à trouver sur les requêtes locales pertinentes.',
    problemEn: 'The only Portland craftsperson offering wood window restoration, replication and install, but hard to find on the right local queries.',
    solutionFr: 'Site orienté conversion, SEO local « wood window restoration Portland », Google Business Profile et GEO pour les requêtes de fenêtres anciennes.',
    solutionEn: 'Conversion-focused site, local SEO for wood window restoration Portland, Google Business Profile and GEO for historic window queries.',
    resultsFr: ['Restauration + réplication + pose', 'Devis le jour même', 'SEO local Portland', 'Prêt pour les IA'],
    resultsEn: ['Restore + replicate + install', 'Same-day quotes', 'Portland local SEO', 'AI-ready'],
    quoteFr: 'The only window business in Portland offering restoration, replication and installation.',
    quoteEn: 'The only window business in Portland offering restoration, replication and installation.',
    who: 'East Portland Sash, Portland OR',
    tldrFr: 'Introuvable localement → devis le jour même, SEO Portland',
    tldrEn: 'Hard to find locally → same-day quotes, Portland SEO',
    tagsFr: ['SEO local', 'Google Business Profile', 'GEO', 'Artisan'],
    tagsEn: ['Local SEO', 'Google Business Profile', 'GEO', 'Craftsman'],
  },
];

function parseSiteMeta(site) {
  const parts = site.split(' · ').map((s) => s.trim());
  const domain = parts[0];
  let score = '';
  let tti = '';
  for (const part of parts.slice(1)) {
    const scoreMatch = part.match(/^Score\s+(.+)$/);
    const ttiMatch = part.match(/^TTI\s+(.+)$/);
    if (scoreMatch) score = scoreMatch[1];
    if (ttiMatch) tti = ttiMatch[1];
  }
  return { domain, score, tti };
}

function hubBadges(c) {
  const { score, tti } = parseSiteMeta(c.site);
  const bits = [];
  if (score) bits.push(`<span class="rcase-badge rcase-badge--score">Score ${score}</span>`);
  if (tti) bits.push(`<span class="rcase-badge rcase-badge--perf">TTI ${tti}</span>`);
  return bits.length ? `<div class="rcase-meta">${bits.join('')}</div>` : '';
}

function hubChips(items) {
  return items
    .slice(0, 4)
    .map((label, index) => `<span class="chip2${index === 0 ? ' chip2--lead' : ''}">${label}</span>`)
    .join('');
}

function hubTags(tags) {
  return tags.map((tag) => `<span class="rcase-tag">${tag}</span>`).join('');
}

const frNav = `header class="site-header" role="banner">
<nav id="nav" class="site-header__nav" aria-label="Navigation principale">
  <div class="wrap-wide nav-inner">
    <a href="/" class="logo"><img class="mk" src="/logo-mc.webp" alt="Monsieur Click" width="48" height="48"> Monsieur <b>Click</b></a>
    <div class="nav-links" id="navLinks" aria-hidden="true">
      <a href="/click-first" class="link">Click First™</a>
      <a href="/services/" class="link">Services</a>
      <a href="/realisations/" class="link">Réalisations</a>
      <a href="/glossaire/" class="link">Glossaire</a>
      <a href="/offres" class="link">Offres</a>
      <a href="/a-propos" class="link">À propos</a>
      <a href="/blog" class="link">Blog</a>
      <a href="/contact" class="btn btn-primary">Diagnostic gratuit</a>
      <div class="lang" role="group" aria-label="Langue du site"><a href="https://monsieurclick.fr" class="on" hreflang="fr" aria-current="true">FR</a><a href="https://monsieurclick.com" hreflang="en">EN</a></div>
    </div>
    <button class="menu-toggle" id="menuToggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="navLinks">☰</button>
  </div>
</nav>
</header>`;

const frFoot = `<footer class="site-footer" role="contentinfo">
  <div class="wrap-wide">
    <div class="foot-grid">
      <div>
        <a href="/" class="logo u-logo-foot"><img class="mk" src="/logo-mc.webp" alt="Monsieur Click" width="48" height="48"> Monsieur <b>Click</b></a>
        <p>Créateur de Click First™. Visibilité Google et IA pour TPE/PME. Malakoff (92), France et francophonie.</p>
      </div>
      <div>
        <h4>Coordonnées</h4>
        <p>24 bis sentier des fosses rouges<br>92240 Malakoff, France</p>
        <a href="mailto:contact@monsieurclick.com">contact@monsieurclick.com</a>
        <a href="tel:+33660761523">+33 6 60 76 15 23</a>
      </div>
      <div>
        <h4>Navigation</h4>
        <a href="/services/">Services</a>
        <a href="/realisations/">Réalisations</a>
        <a href="/glossaire/">Glossaire</a>
        <a href="/offres">Offres</a>
        <a href="/contact">Diagnostic gratuit</a>
      </div>
    </div>
    <div class="foot-bottom">© 2026 Monsieur Click · SIRET 429 539 067 00042 ·
      <a href="/mentions-legales">Mentions légales</a> · <a href="/confidentialite">Confidentialité</a></div>
  </div>
</footer>
<script defer src="/perf.js?v=20260712b"></script>
<script src="/shared.js"></script>`;

const enNav = `<nav id="nav">
  <div class="wrap-wide nav-inner">
    <a href="/" class="logo"><img class="mk" src="/logo-mc.webp" alt="Monsieur Click" width="48" height="48"> Monsieur <b>Click</b></a>
    <div class="nav-links" id="navLinks">
      <a href="/click-first" class="link">Click First™</a>
      <a href="/case-studies/" class="link">Case studies</a>
      <a href="/glossary/" class="link">Glossary</a>
      <a href="/pricing" class="link">Pricing</a>
      <a href="/about" class="link">About</a>
      <a href="/blog" class="link">Blog</a>
      <a href="/contact" class="btn btn-primary">Free audit</a>
      <div class="lang" role="group" aria-label="Site language"><a href="https://monsieurclick.fr" hreflang="fr">FR</a><a href="https://monsieurclick.com" class="on" hreflang="en" aria-current="true">EN</a></div>
    </div>
    <button class="menu-toggle" id="menuToggle" aria-label="Open menu">☰</button>
  </div>
</nav>`;

const enFoot = `<footer>
  <div class="wrap-wide">
    <div class="foot-grid">
      <div>
        <a href="/" class="logo"><img class="mk" src="/logo-mc.webp" alt="Monsieur Click" width="48" height="48"> Monsieur <b>Click</b></a>
        <p>Creator of Click First™. Google and AI visibility for small businesses.</p>
      </div>
      <div>
        <h4>Contact</h4>
        <p>24 bis sentier des fosses rouges<br>92240 Malakoff, France</p>
        <a href="mailto:contact@monsieurclick.com">contact@monsieurclick.com</a>
      </div>
      <div>
        <h4>Navigate</h4>
        <a href="/case-studies/">Case studies</a>
        <a href="/glossary/">Glossary</a>
        <a href="/small-business-seo">Small business SEO</a>
        <a href="/contact">Free audit</a>
      </div>
    </div>
    <div class="foot-bottom">© 2026 Monsieur Click</div>
  </div>
</footer>
<script defer src="/perf.js?v=20260712b"></script>
<script src="/shared.js"></script>`;

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log('wrote', path.relative(FR, file).startsWith('..') ? path.relative(path.dirname(FR), file) : path.relative(FR, file));
}

function casePageFr(c) {
  const chips = c.resultsFr.map((t) => `<span class="chip2">${t}</span>`).join('');
  const others = cases
    .filter((x) => x.slug !== c.slug)
    .slice(0, 3)
    .map((x) => `<li><a href="/realisations/${x.slug}/">${x.name}</a></li>`)
    .join('');
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/webp" href="/logo-mc.webp">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${c.name} — étude de cas SEO &amp; site | Monsieur Click</title>
<meta name="description" content="Étude de cas ${c.name} : ${c.problemFr.slice(0, 110)}… Méthode Click First™.">
<link rel="canonical" href="https://monsieurclick.fr/realisations/${c.slug}/">
<link rel="alternate" hreflang="fr" href="https://monsieurclick.fr/realisations/${c.slug}/">
<link rel="alternate" hreflang="en" href="https://monsieurclick.com/case-studies/${c.slug}/">
<link rel="alternate" hreflang="x-default" href="https://monsieurclick.fr/realisations/${c.slug}/">
<meta property="og:title" content="${c.name} | Réalisations Monsieur Click">
<meta property="og:type" content="article">
<link rel="stylesheet" href="/css/main.css?v=20260717hero2">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Accueil","item":"https://monsieurclick.fr/"},
{"@type":"ListItem","position":2,"name":"Réalisations","item":"https://monsieurclick.fr/realisations/"},
{"@type":"ListItem","position":3,"name":"${c.name}","item":"https://monsieurclick.fr/realisations/${c.slug}/"}]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"${c.name} — étude de cas","name":"${c.name}","description":${JSON.stringify(c.problemFr)},"author":{"@type":"Organization","name":"Monsieur Click"},"publisher":{"@type":"Organization","name":"Monsieur Click","logo":{"@type":"ImageObject","url":"https://monsieurclick.fr/logo-mc.webp"}},"mainEntityOfPage":"https://monsieurclick.fr/realisations/${c.slug}/","image":"https://monsieurclick.fr${c.img}"}
</script>
</head>
<body>
<${frNav}
<main id="main">
<header class="pagehero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Accueil</a> · <a href="/realisations/">Réalisations</a> · ${c.name}</div>
    <span class="eyebrow">${c.catFr}</span>
    <h1>${c.name}</h1>
    <p class="sub">${c.sectorFr} · ${c.site}</p>
  </div>
</header>
<section>
  <div class="wrap">
    <article class="rcase reveal in">
      <div class="shot"><img src="${c.img}" alt="Aperçu ${c.name}" loading="eager" width="400" height="800"></div>
      <div class="content">
        <div class="row2">
          <div><h2>Le problème</h2><p>${c.problemFr}</p></div>
          <div><h2>La solution</h2><p>${c.solutionFr}</p></div>
        </div>
        <div class="res"><h2>Résultats</h2>
          <div class="chips">${chips}</div>
          <blockquote>« ${c.quoteFr} »</blockquote>
          <div class="who">${c.who}</div>
        </div>
      </div>
    </article>
    <div class="prose reveal u-wrap-820-mb u-mt-xl">
      <h2>Ce que Click First™ a aligné</h2>
      <p>Site, SEO local, Google Business Profile, avis, données structurées et visibilité IA (GEO) ont travaillé ensemble. Voir aussi le <a href="/glossaire/seo-local">SEO local</a>, le <a href="/glossaire/optimisation-moteurs-generatifs">GEO</a> et <a href="/services/visibilite-ia-geo">notre service visibilité IA</a>.</p>
      <h2>Autres réalisations</h2>
      <ul>${others}</ul>
      <p><a href="/realisations/">Toutes les réalisations</a> · <a href="/contact">Diagnostic gratuit</a></p>
    </div>
  </div>
</section>
<section class="u-section-tight"><div class="wrap"><div class="ctaband reveal">
  <h2>Vous voulez le même système ?</h2>
  <p>Diagnostic gratuit, sans engagement.</p>
  <a href="/contact" class="btn">Commencer mon diagnostic</a>
</div></div></section>
</main>
${frFoot}
</body>
</html>`;
}

function casePageEn(c) {
  const chips = c.resultsEn.map((t) => `<span class="chip2">${t}</span>`).join('');
  const others = cases
    .filter((x) => x.slug !== c.slug)
    .slice(0, 3)
    .map((x) => `<li><a href="/case-studies/${x.slug}/">${x.name}</a></li>`)
    .join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/webp" href="/logo-mc.webp">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${c.name} — SEO &amp; website case study | Monsieur Click</title>
<meta name="description" content="Case study: ${c.name}. ${c.problemEn.slice(0, 110)}… Click First™ method.">
<link rel="canonical" href="https://monsieurclick.com/case-studies/${c.slug}/">
<link rel="alternate" hreflang="en" href="https://monsieurclick.com/case-studies/${c.slug}/">
<link rel="alternate" hreflang="fr" href="https://monsieurclick.fr/realisations/${c.slug}/">
<link rel="alternate" hreflang="x-default" href="https://monsieurclick.fr/realisations/${c.slug}/">
<link rel="stylesheet" href="/styles.css?v=20260717hero2">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Home","item":"https://monsieurclick.com/"},
{"@type":"ListItem","position":2,"name":"Case studies","item":"https://monsieurclick.com/case-studies/"},
{"@type":"ListItem","position":3,"name":"${c.name}","item":"https://monsieurclick.com/case-studies/${c.slug}/"}]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"${c.name} — case study","name":"${c.name}","description":${JSON.stringify(c.problemEn)},"author":{"@type":"Organization","name":"Monsieur Click"},"mainEntityOfPage":"https://monsieurclick.com/case-studies/${c.slug}/","image":"https://monsieurclick.com${c.img}"}
</script>
</head>
<body>
${enNav}
<main>
<header class="pagehero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Home</a> · <a href="/case-studies/">Case studies</a> · ${c.name}</div>
    <span class="eyebrow">${c.catEn}</span>
    <h1>${c.name}</h1>
    <p class="sub">${c.sectorEn} · ${c.site}</p>
  </div>
</header>
<section>
  <div class="wrap">
    <article class="rcase reveal in">
      <div class="shot"><img src="${c.img}" alt="${c.name} preview" loading="eager" width="400" height="800"></div>
      <div class="content">
        <div class="row2">
          <div><h2>The problem</h2><p>${c.problemEn}</p></div>
          <div><h2>The solution</h2><p>${c.solutionEn}</p></div>
        </div>
        <div class="res"><h2>Results</h2>
          <div class="chips">${chips}</div>
          <blockquote>"${c.quoteEn}"</blockquote>
          <div class="who">${c.who}</div>
        </div>
      </div>
    </article>
    <div class="prose" style="max-width:820px;margin-top:2rem">
      <h2>What Click First™ aligned</h2>
      <p>Website, local SEO, Google Business Profile, reviews, structured data and AI visibility (GEO) worked together. See also <a href="/glossary/local-seo">local SEO</a>, <a href="/glossary/generative-engine-optimization">GEO</a> and <a href="/services/generative-engine-optimization">our GEO service</a>.</p>
      <h2>More case studies</h2>
      <ul>${others}</ul>
      <p><a href="/case-studies/">All case studies</a> · <a href="/contact">Free audit</a></p>
    </div>
  </div>
</section>
</main>
${enFoot}
</body>
</html>`;
}

function hubCardFr(c) {
  const { domain } = parseSiteMeta(c.site);
  return `<article class="rcase rcase--hub reveal">
  <div class="shot"><a href="/realisations/${c.slug}/"><img src="${c.img}" alt="${c.name}" loading="lazy" width="400" height="800"></a></div>
  <div class="content">
    ${hubBadges(c)}
    <div class="head"><h3><a href="/realisations/${c.slug}/">${c.name}</a></h3><span class="site">${domain}</span></div>
    <div class="sector">${c.sectorFr}</div>
    <div class="rcase-tldr">
      <span class="rcase-tldr-label">En bref</span>
      <p>${c.tldrFr}</p>
    </div>
    <div class="rcase-problem">
      <h4>Le problème</h4>
      <p>${c.problemFr}</p>
    </div>
    <div class="rcase-results"><div class="chips">${hubChips(c.resultsFr)}</div></div>
    <div class="rcase-tags">${hubTags(c.tagsFr)}</div>
    <div class="rcase-foot"><a class="rcase-cta" href="/realisations/${c.slug}/">Lire l'étude de cas →</a></div>
  </div>
</article>`;
}

function hubCardEn(c) {
  const { domain } = parseSiteMeta(c.site);
  return `<article class="rcase rcase--hub reveal">
  <div class="shot"><a href="/case-studies/${c.slug}/"><img src="${c.img}" alt="${c.name}" loading="lazy" width="400" height="800"></a></div>
  <div class="content">
    ${hubBadges(c)}
    <div class="head"><h3><a href="/case-studies/${c.slug}/">${c.name}</a></h3><span class="site">${domain}</span></div>
    <div class="sector">${c.sectorEn}</div>
    <div class="rcase-tldr">
      <span class="rcase-tldr-label">TL;DR</span>
      <p>${c.tldrEn}</p>
    </div>
    <div class="rcase-problem">
      <h4>The problem</h4>
      <p>${c.problemEn}</p>
    </div>
    <div class="rcase-results"><div class="chips">${hubChips(c.resultsEn)}</div></div>
    <div class="rcase-tags">${hubTags(c.tagsEn)}</div>
    <div class="rcase-foot"><a class="rcase-cta" href="/case-studies/${c.slug}/">Read the case study →</a></div>
  </div>
</article>`;
}

function hubCardsBlock(lang) {
  const key = lang === 'fr' ? 'catFr' : 'catEn';
  const cardFn = lang === 'fr' ? hubCardFr : hubCardEn;
  return [...groupBy(cases, key)]
    .map(([cat, list]) => `    <h2 class="cat-title reveal">${cat}</h2>\n${list.map(cardFn).join('\n')}`)
    .join('\n');
}

function groupBy(arr, key) {
  const m = new Map();
  for (const c of arr) {
    const k = c[key];
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(c);
  }
  return m;
}

const frHub = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/webp" href="/logo-mc.webp">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Réalisations SEO local &amp; sites web de PME</title>
<meta name="description" content="7 études de cas SEO local, création de sites et visibilité IA. Résultats concrets de la méthode Click First™. Diagnostic gratuit.">
<link rel="canonical" href="https://monsieurclick.fr/realisations/">
<link rel="alternate" hreflang="fr" href="https://monsieurclick.fr/realisations/">
<link rel="alternate" hreflang="en" href="https://monsieurclick.com/case-studies/">
<link rel="alternate" hreflang="x-default" href="https://monsieurclick.fr/realisations/">
<link rel="stylesheet" href="/css/main.css?v=20260717hero2">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Accueil","item":"https://monsieurclick.fr/"},
{"@type":"ListItem","position":2,"name":"Réalisations","item":"https://monsieurclick.fr/realisations/"}]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ItemList","name":"Réalisations Monsieur Click","itemListElement":${JSON.stringify(
  cases.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `https://monsieurclick.fr/realisations/${c.slug}/`,
    name: c.name,
  }))
)}}
</script>
</head>
<body>
<${frNav}
<main id="main">
<header class="pagehero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Accueil</a> · Réalisations</div>
    <span class="eyebrow">Preuves</span>
    <h1>Réalisations SEO local &amp; sites web</h1>
    <p class="sub">Sept entreprises passées d'invisibles à évidentes sur Google et sur les IA, grâce à Click First™.</p>
  </div>
</header>
<section>
  <div class="wrap">
    <div class="prose reveal u-wrap-820-mb">
      <p>Chaque étude de cas détaille le problème, la solution et les résultats. Un système unique : site, SEO local, Google Business Profile, avis, Schema.org et <a href="/glossaire/optimisation-moteurs-generatifs">GEO</a>.</p>
    </div>
${hubCardsBlock('fr')}
    <p class="center reveal u-mt-14"><a href="/glossaire/" class="u-text-cyan">Glossaire SEO &amp; GEO</a> · <a href="/offres" class="u-text-cyan">Offres</a> · <a href="/contact" class="u-text-cyan">Diagnostic gratuit</a></p>
  </div>
</section>
<section class="u-section-tight"><div class="wrap"><div class="ctaband reveal">
  <h2>Vous voulez être la prochaine réalisation ?</h2>
  <p>Diagnostic gratuit, ou <a href="/click-first#score" class="u-link-white">votre Score Click First™</a>.</p>
  <a href="/contact" class="btn">Commencer mon diagnostic gratuit</a>
</div></div></section>
</main>
${frFoot}
</body>
</html>`;

const enHub = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/webp" href="/logo-mc.webp">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Local SEO Case Studies: Real Results for Small Businesses</title>
<meta name="description" content="7 case studies: local SEO, websites and AI visibility. Real Click First™ results. Free audit.">
<link rel="canonical" href="https://monsieurclick.com/case-studies/">
<link rel="alternate" hreflang="en" href="https://monsieurclick.com/case-studies/">
<link rel="alternate" hreflang="fr" href="https://monsieurclick.fr/realisations/">
<link rel="alternate" hreflang="x-default" href="https://monsieurclick.fr/realisations/">
<link rel="stylesheet" href="/styles.css?v=20260717hero2">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ItemList","name":"Monsieur Click case studies","itemListElement":${JSON.stringify(
  cases.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `https://monsieurclick.com/case-studies/${c.slug}/`,
    name: c.name,
  }))
)}}
</script>
</head>
<body>
${enNav}
<main>
<header class="pagehero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Home</a> · Case studies</div>
    <span class="eyebrow">Proof</span>
    <h1>Local SEO &amp; website case studies</h1>
    <p class="sub">Seven businesses that went from invisible to obvious on Google and AI with Click First™.</p>
  </div>
</header>
<section>
  <div class="wrap">
${hubCardsBlock('en')}
  </div>
</section>
</main>
${enFoot}
</body>
</html>`;

const glossaryFr = [
  {
    slug: 'seo-local',
    h1: 'SEO local',
    title: 'SEO local : définition | Glossaire Monsieur Click',
    meta: 'Le SEO local, c\'est la visibilité sur Google Maps et le pack local. Définition claire, exemples et lien vers notre service SEO local.',
    def: 'Le SEO local (référencement local) regroupe les actions qui font apparaître une entreprise dans les recherches géolocalisées : Google Maps, le pack local (les trois fiches en haut des résultats) et les requêtes du type « métier + ville ».',
    body: `<p>Il repose surtout sur trois signaux : proximité, pertinence et notoriété. En pratique : une fiche <a href="/glossaire/google-business-profile">Google Business Profile</a> complète, des avis réguliers, une cohérence NAP (nom, adresse, téléphone), un site aligné et des contenus locaux.</p>
<p>Contrairement au référencement national, le SEO local cible des clients près de vous. C'est le levier n°1 pour les TPE/PME de proximité.</p>
<p><strong>Page service :</strong> <a href="/services/seo-local">SEO local — Google Maps &amp; pack local</a>.</p>`,
    related: '/services/seo-local',
  },
  {
    slug: 'optimisation-moteurs-generatifs',
    h1: 'Optimisation pour les moteurs génératifs (GEO)',
    title: 'GEO : définition | Glossaire Monsieur Click',
    meta: 'Le GEO (optimisation pour les moteurs génératifs) prépare votre entreprise à être citée par ChatGPT, Gemini et Perplexity. Définition et méthode.',
    def: 'Le GEO (Generative Engine Optimization), ou optimisation pour les moteurs génératifs, consiste à structurer votre présence en ligne pour que les intelligences artificielles vous citent comme source fiable.',
    body: `<p>ChatGPT, Gemini, Perplexity et les AI Overviews de Google s'appuient sur des contenus clairs, des entités cohérentes, des données structurées Schema.org, des avis et des faits vérifiables. Le GEO n'est pas l'opposé du SEO : il s'appuie sur le même socle, rendu plus citable.</p>
<p>Pour Monsieur Click, le GEO fait partie de Click First™ aux côtés du site, du SEO et de Google Business Profile.</p>
<p><strong>Page service :</strong> <a href="/services/visibilite-ia-geo">Visibilité IA (GEO)</a> · <a href="/blog/geo-generative-engine-optimization">Article GEO</a>.</p>`,
    related: '/services/visibilite-ia-geo',
  },
  {
    slug: 'google-business-profile',
    h1: 'Google Business Profile',
    title: 'Google Business Profile : définition | Glossaire Monsieur Click',
    meta: 'Google Business Profile (ex Google My Business) est la fiche qui alimente Google Maps et le pack local. Définition et bonnes pratiques.',
    def: 'Google Business Profile (anciennement Google My Business) est la fiche officielle d\'une entreprise sur Google : Maps, pack local, panneau de connaissances et souvent le premier contact mobile.',
    body: `<p>Une fiche bien remplie (catégories, horaires, photos, description, services, posts) + des avis récents renforce la confiance de Google et des clients. C'est un pilier du <a href="/glossaire/seo-local">SEO local</a>.</p>
<p><strong>Page service :</strong> <a href="/services/google-business-profile">Optimisation Google Business Profile</a>.</p>`,
    related: '/services/google-business-profile',
  },
];

const glossaryEn = [
  {
    slug: 'local-seo',
    h1: 'Local SEO',
    title: 'Local SEO: definition | Monsieur Click Glossary',
    meta: 'Local SEO is visibility in Google Maps and the local pack. Clear definition, examples, and link to our local SEO service.',
    def: 'Local SEO is the set of actions that help a business appear in location-based search: Google Maps, the local pack (the three map results at the top), and queries like "service + city".',
    body: `<p>It mainly rests on proximity, relevance and prominence. In practice: a complete <a href="/glossary/google-business-profile">Google Business Profile</a>, steady reviews, consistent NAP (name, address, phone), an aligned website and local content.</p>
<p><strong>Service page:</strong> <a href="/services/local-seo">Local SEO services</a>.</p>`,
    related: '/services/local-seo',
  },
  {
    slug: 'generative-engine-optimization',
    h1: 'Generative Engine Optimization (GEO)',
    title: 'GEO: definition | Monsieur Click Glossary',
    meta: 'GEO (Generative Engine Optimization) prepares your business to be cited by ChatGPT, Gemini and Perplexity. Definition and method.',
    def: 'Generative Engine Optimization (GEO) structures your online presence so AI systems cite you as a trustworthy source when people ask for recommendations.',
    body: `<p>ChatGPT, Gemini, Perplexity and Google AI Overviews lean on clear content, consistent entities, Schema.org structured data, reviews and verifiable facts. GEO is not the opposite of SEO: it builds on the same foundation, made more citable.</p>
<p><strong>Service page:</strong> <a href="/services/generative-engine-optimization">GEO services</a>.</p>`,
    related: '/services/generative-engine-optimization',
  },
  {
    slug: 'google-business-profile',
    h1: 'Google Business Profile',
    title: 'Google Business Profile: definition | Monsieur Click Glossary',
    meta: 'Google Business Profile (formerly Google My Business) powers Maps and the local pack. Definition and best practices.',
    def: 'Google Business Profile (formerly Google My Business) is a business\'s official listing on Google: Maps, the local pack, the knowledge panel and often the first mobile touchpoint.',
    body: `<p>A complete profile (categories, hours, photos, description, services, posts) plus fresh reviews builds trust with Google and with customers. It is a pillar of <a href="/glossary/local-seo">local SEO</a>.</p>
<p><strong>Service page:</strong> <a href="/services/google-business-profile">Google Business Profile optimization</a>.</p>`,
    related: '/services/google-business-profile',
  },
];

function glossEntryFr(g) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/webp" href="/logo-mc.webp">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${g.title}</title>
<meta name="description" content="${g.meta}">
<link rel="canonical" href="https://monsieurclick.fr/glossaire/${g.slug}/">
<link rel="alternate" hreflang="fr" href="https://monsieurclick.fr/glossaire/${g.slug}/">
<link rel="alternate" hreflang="en" href="https://monsieurclick.com/glossary/${g.slug === 'seo-local' ? 'local-seo' : g.slug === 'optimisation-moteurs-generatifs' ? 'generative-engine-optimization' : g.slug}/">
<link rel="alternate" hreflang="x-default" href="https://monsieurclick.fr/glossaire/${g.slug}/">
<link rel="stylesheet" href="/css/main.css?v=20260717hero2">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"DefinedTerm","name":"${g.h1}","description":${JSON.stringify(g.def)},"inDefinedTermSet":"https://monsieurclick.fr/glossaire/","url":"https://monsieurclick.fr/glossaire/${g.slug}/"}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Accueil","item":"https://monsieurclick.fr/"},
{"@type":"ListItem","position":2,"name":"Glossaire","item":"https://monsieurclick.fr/glossaire/"},
{"@type":"ListItem","position":3,"name":"${g.h1}","item":"https://monsieurclick.fr/glossaire/${g.slug}/"}]}
</script>
</head>
<body>
<${frNav}
<main id="main">
<header class="pagehero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Accueil</a> · <a href="/glossaire/">Glossaire</a> · ${g.h1}</div>
    <span class="eyebrow">Définition</span>
    <h1>${g.h1}</h1>
    <p class="sub">${g.def}</p>
  </div>
</header>
<section><div class="wrap prose u-wrap-820">${g.body}
<p><a href="/glossaire/">← Retour au glossaire</a> · <a href="${g.related}">Voir le service</a></p>
</div></section>
</main>
${frFoot}
</body>
</html>`;
}

function glossEntryEn(g) {
  const frSlug =
    g.slug === 'local-seo'
      ? 'seo-local'
      : g.slug === 'generative-engine-optimization'
        ? 'optimisation-moteurs-generatifs'
        : g.slug;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/webp" href="/logo-mc.webp">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${g.title}</title>
<meta name="description" content="${g.meta}">
<link rel="canonical" href="https://monsieurclick.com/glossary/${g.slug}/">
<link rel="alternate" hreflang="en" href="https://monsieurclick.com/glossary/${g.slug}/">
<link rel="alternate" hreflang="fr" href="https://monsieurclick.fr/glossaire/${frSlug}/">
<link rel="alternate" hreflang="x-default" href="https://monsieurclick.fr/glossaire/${frSlug}/">
<link rel="stylesheet" href="/styles.css?v=20260717hero2">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"DefinedTerm","name":"${g.h1}","description":${JSON.stringify(g.def)},"inDefinedTermSet":"https://monsieurclick.com/glossary/","url":"https://monsieurclick.com/glossary/${g.slug}/"}
</script>
</head>
<body>
${enNav}
<main>
<header class="pagehero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Home</a> · <a href="/glossary/">Glossary</a> · ${g.h1}</div>
    <span class="eyebrow">Definition</span>
    <h1>${g.h1}</h1>
    <p class="sub">${g.def}</p>
  </div>
</header>
<section><div class="wrap prose" style="max-width:820px">${g.body}
<p><a href="/glossary/">← Back to glossary</a> · <a href="${g.related}">See the service</a></p>
</div></section>
</main>
${enFoot}
</body>
</html>`;
}

const glossHubFr = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/webp" href="/logo-mc.webp">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Glossaire SEO &amp; GEO | Monsieur Click</title>
<meta name="description" content="Définitions claires du SEO local, du GEO et de Google Business Profile. Le format le plus cité par les IA génératives.">
<link rel="canonical" href="https://monsieurclick.fr/glossaire/">
<link rel="alternate" hreflang="fr" href="https://monsieurclick.fr/glossaire/">
<link rel="alternate" hreflang="en" href="https://monsieurclick.com/glossary/">
<link rel="alternate" hreflang="x-default" href="https://monsieurclick.fr/glossaire/">
<link rel="stylesheet" href="/css/main.css?v=20260717hero2">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"DefinedTermSet","name":"Glossaire SEO & GEO Monsieur Click","url":"https://monsieurclick.fr/glossaire/","hasDefinedTerm":[
{"@type":"DefinedTerm","name":"SEO local","url":"https://monsieurclick.fr/glossaire/seo-local/"},
{"@type":"DefinedTerm","name":"Optimisation pour les moteurs génératifs (GEO)","url":"https://monsieurclick.fr/glossaire/optimisation-moteurs-generatifs/"},
{"@type":"DefinedTerm","name":"Google Business Profile","url":"https://monsieurclick.fr/glossaire/google-business-profile/"}
]}
</script>
</head>
<body>
<${frNav}
<main id="main">
<header class="pagehero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Accueil</a> · Glossaire</div>
    <span class="eyebrow">Définitions</span>
    <h1>Glossaire SEO &amp; GEO</h1>
    <p class="sub">Des définitions nettes, citables par Google et par les IA. Trois entrées pour commencer.</p>
  </div>
</header>
<section><div class="wrap">
  <ul class="belief-list">
    ${glossaryFr
      .map(
        (g) => `<li class="belief reveal"><h2><a href="/glossaire/${g.slug}/">${g.h1}</a></h2><p>${g.def}</p></li>`
      )
      .join('\n')}
  </ul>
  <p class="u-mt-xl"><a href="/services/visibilite-ia-geo">Service visibilité IA</a> · <a href="/services/seo-local">Service SEO local</a> · <a href="/realisations/">Réalisations</a></p>
</div></section>
</main>
${frFoot}
</body>
</html>`;

const glossHubEn = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/webp" href="/logo-mc.webp">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SEO &amp; GEO Glossary | Monsieur Click</title>
<meta name="description" content="Clear definitions of local SEO, GEO and Google Business Profile. The format AI engines cite most often.">
<link rel="canonical" href="https://monsieurclick.com/glossary/">
<link rel="alternate" hreflang="en" href="https://monsieurclick.com/glossary/">
<link rel="alternate" hreflang="fr" href="https://monsieurclick.fr/glossaire/">
<link rel="alternate" hreflang="x-default" href="https://monsieurclick.fr/glossaire/">
<link rel="stylesheet" href="/styles.css?v=20260717hero2">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"DefinedTermSet","name":"Monsieur Click SEO & GEO Glossary","url":"https://monsieurclick.com/glossary/"}
</script>
</head>
<body>
${enNav}
<main>
<header class="pagehero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Home</a> · Glossary</div>
    <span class="eyebrow">Definitions</span>
    <h1>SEO &amp; GEO Glossary</h1>
    <p class="sub">Clear, citable definitions for Google and AI engines. Three entries to start.</p>
  </div>
</header>
<section><div class="wrap">
  <ul>
    ${glossaryEn
      .map((g) => `<li><h2><a href="/glossary/${g.slug}/">${g.h1}</a></h2><p>${g.def}</p></li>`)
      .join('\n')}
  </ul>
</div></section>
</main>
${enFoot}
</body>
</html>`;

// Write all (only when run directly)
const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
write(path.join(FR, 'realisations/index.html'), frHub);
write(path.join(EN, 'case-studies/index.html'), enHub);
for (const c of cases) {
  write(path.join(FR, `realisations/${c.slug}/index.html`), casePageFr(c));
  write(path.join(EN, `case-studies/${c.slug}/index.html`), casePageEn(c));
}
write(path.join(FR, 'glossaire/index.html'), glossHubFr);
write(path.join(EN, 'glossary/index.html'), glossHubEn);
for (const g of glossaryFr) write(path.join(FR, `glossaire/${g.slug}/index.html`), glossEntryFr(g));
for (const g of glossaryEn) write(path.join(EN, `glossary/${g.slug}/index.html`), glossEntryEn(g));

// Remove flat realisations.html to avoid conflict with folder (keep redirect in _redirects)
const flat = path.join(FR, 'realisations.html');
if (fs.existsSync(flat)) {
  fs.unlinkSync(flat);
  console.log('removed realisations.html (hub is now /realisations/)');
}
const flatEn = path.join(EN, 'case-studies.html');
if (fs.existsSync(flatEn)) {
  fs.unlinkSync(flatEn);
  console.log('removed en/case-studies.html (hub is now /case-studies/)');
}

console.log('done');
}

export { hubCardsBlock, hubCardFr, hubCardEn, cases };
