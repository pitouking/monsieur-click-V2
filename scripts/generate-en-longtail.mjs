#!/usr/bin/env node
/** Generate priority EN long-tail service pages (native EN). */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const EN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../en');

const nav = `<nav id="nav">
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

const foot = `<footer>
  <div class="wrap-wide">
    <div class="foot-grid">
      <div>
        <a href="/" class="logo"><img class="mk" src="/logo-mc.webp" alt="Monsieur Click" width="48" height="48"> Monsieur <b>Click</b></a>
        <p>Creator of Click First™. Google and AI visibility for small businesses in the US, UK and beyond.</p>
      </div>
      <div>
        <h4>Contact</h4>
        <p>24 bis sentier des fosses rouges<br>92240 Malakoff, France</p>
        <a href="mailto:contact@monsieurclick.com">contact@monsieurclick.com</a>
      </div>
      <div>
        <h4>Navigate</h4>
        <a href="/small-business-seo">Small business SEO</a>
        <a href="/services/local-seo">Local SEO</a>
        <a href="/services/generative-engine-optimization">GEO</a>
        <a href="/glossary/">Glossary</a>
        <a href="/contact">Free audit</a>
      </div>
    </div>
    <div class="foot-bottom">© 2026 Monsieur Click</div>
  </div>
</footer>
<script defer src="/perf.js?v=20260712b"></script>
<script src="/shared.js"></script>`;

const pages = [
  {
    file: 'small-business-seo/index.html',
    url: 'https://monsieurclick.com/small-business-seo',
    fr: null,
    title: 'Small Business SEO Services | Monsieur Click',
    meta: 'Affordable SEO for small businesses. Local SEO, Google Business Profile, and AI visibility. Free audit, no commitment.',
    h1: 'Small Business SEO — Get Found by Local Customers',
    eyebrow: 'Small business SEO',
    lead: 'You are busy running the business. Nearby buyers are already searching on Google and asking ChatGPT. We build the visibility system so they find you, trust you, and call you.',
    sections: [
      ['The problem', 'Most small businesses have a site that looks fine and a Google listing that is half-filled. Competitors with weaker offers still win the map pack and the AI answers.'],
      ['What you get', 'Local SEO, Google Business Profile optimization, review strategy, on-page SEO, and a GEO layer so AI assistants can cite you. One system: Click First™.'],
      ['How it works', '1) Free audit and Click First™ Score. 2) Fix the foundation (site + GBP + NAP). 3) Monthly optimization with clear reporting.'],
    ],
    links: [
      ['/services/local-seo', 'Local SEO services'],
      ['/services/generative-engine-optimization', 'GEO services'],
      ['/case-studies/', 'Case studies'],
      ['/glossary/local-seo', 'What is local SEO?'],
    ],
    faqs: [
      ['How much does small business SEO cost?', 'It depends on competition and scope. We start with a free audit so the plan matches your market, not a generic package.'],
      ['How long before I see results?', 'Local SEO often shows early signals in 2–3 months. Stronger positions typically build over 4–6 months.'],
    ],
  },
  {
    file: 'services/generative-engine-optimization/index.html',
    url: 'https://monsieurclick.com/services/generative-engine-optimization',
    fr: 'https://monsieurclick.fr/services/visibilite-ia-geo',
    title: 'Generative Engine Optimization (GEO) Services | Monsieur Click',
    meta: 'Get your business cited by ChatGPT, Gemini, Claude and Perplexity. Structured data, OKF, llms.txt, entity SEO. Be the source AI quotes.',
    h1: 'Generative Engine Optimization (GEO) — Get Cited by ChatGPT & Perplexity',
    eyebrow: 'GEO / AI visibility',
    lead: 'Buyers ask AI which plumber, coach or lawyer to hire. If your business is not structured as a clear entity with citable facts, you disappear from those answers.',
    sections: [
      ['Why GEO now', 'AI Overviews, ChatGPT search and Perplexity are changing discovery. Traditional SEO still matters; GEO makes the same assets readable and quotable by machines.'],
      ['How it works', 'We align Schema.org, entity consistency, FAQ content, llms.txt, crawler access (GPTBot, ClaudeBot, PerplexityBot) and proof signals (reviews, case studies).'],
      ['Deliverables', 'Entity home pages, structured FAQ, technical GEO checklist, content rewrites for citability, and monthly monitoring of AI mentions where measurable.'],
    ],
    links: [
      ['/glossary/generative-engine-optimization', 'GEO definition'],
      ['/small-business-seo', 'Small business SEO'],
      ['/ai-seo-agency', 'AI SEO agency'],
      ['/case-studies/', 'Case studies'],
    ],
    faqs: [
      ['Is GEO different from SEO?', 'GEO builds on SEO. Clear content, entities and structured data help Google and AI systems. We do not treat them as opposing channels.'],
      ['Can you guarantee ChatGPT will cite me?', 'No honest agency can. We improve the signals AI systems prefer so you become a stronger candidate for citation.'],
    ],
  },
  {
    file: 'services/local-seo/index.html',
    url: 'https://monsieurclick.com/services/local-seo',
    fr: 'https://monsieurclick.fr/services/seo-local',
    title: 'Local SEO Services — Map Pack & Google Business | Monsieur Click',
    meta: 'Rank in Google\'s local pack. Google Business Profile optimization, reviews, citations and local pages. Free audit.',
    h1: 'Local SEO Services — Rank in the Map Pack',
    eyebrow: 'Local SEO',
    lead: 'On mobile, three map results decide who gets the call. We help small businesses own proximity, relevance and prominence in their service area.',
    sections: [
      ['The problem', 'An incomplete Google Business Profile, inconsistent NAP citations and thin local content leave the map pack to competitors.'],
      ['What we deliver', 'GBP optimization, review acquisition system, citation cleanup, local landing pages where demand exists, and reporting tied to calls and directions.'],
      ['Fit with GEO', 'The same NAP, reviews and structured data that win Maps also feed AI answers. See our <a href="/glossary/local-seo">local SEO definition</a>.'],
    ],
    links: [
      ['/services/google-business-profile', 'Google Business Profile'],
      ['/small-business-seo', 'Small business SEO'],
      ['/glossary/google-business-profile', 'GBP definition'],
    ],
    faqs: [
      ['Do I need a website for local SEO?', 'Yes. The profile often starts the journey; the site converts and feeds Google and AI with clear information.'],
    ],
  },
  {
    file: 'services/web-design/index.html',
    url: 'https://monsieurclick.com/services/web-design',
    fr: 'https://monsieurclick.fr/services/creation-site-web',
    title: 'Web Design Agency — Fast, SEO-Ready Sites | Monsieur Click',
    meta: 'Custom websites built to convert and rank. Fast, mobile-first, Core Web Vitals green. WordPress or static. Free consultation.',
    h1: 'Web Design Agency — Conversion-Focused Websites',
    eyebrow: 'Web design',
    lead: 'A pretty site that does not rank or convert is expensive wallpaper. We build fast, StoryBrand-led sites ready for local SEO and GEO.',
    sections: [
      ['What you get', 'Clear positioning, mobile-first layout, Core Web Vitals targets, on-page SEO, Schema.org and a structure AI systems can parse.'],
      ['Stack', 'WordPress, static or hybrid depending on your ops. See also <a href="/services/wordpress-web-design">WordPress web design</a>.'],
    ],
    links: [
      ['/services/wordpress-web-design', 'WordPress web design'],
      ['/services/seo', 'SEO services'],
      ['/case-studies/', 'Case studies'],
    ],
    faqs: [],
  },
  {
    file: 'services/wordpress-web-design/index.html',
    url: 'https://monsieurclick.com/services/wordpress-web-design',
    fr: 'https://monsieurclick.fr/services/creation-site-wordpress',
    title: 'WordPress Web Design — Custom, Fast, SEO-Ready | Monsieur Click',
    meta: 'Custom WordPress websites for small businesses: fast, editable, SEO-ready and built to convert. Free consultation.',
    h1: 'WordPress Web Design',
    eyebrow: 'WordPress',
    lead: 'WordPress when you need editorial control without sacrificing speed or SEO. Built for small businesses, not bloated themes.',
    sections: [
      ['Approach', 'Lean theme or custom build, performance budget, Schema.org, and content structure aligned with Click First™.'],
      ['Next step', 'Compare with our broader <a href="/services/web-design">web design</a> offer if you prefer static.'],
    ],
    links: [
      ['/services/web-design', 'Web design agency'],
      ['/small-business-seo', 'Small business SEO'],
    ],
    faqs: [],
  },
  {
    file: 'services/seo/index.html',
    url: 'https://monsieurclick.com/services/seo',
    fr: 'https://monsieurclick.fr/services/seo',
    title: 'SEO Services for Small & Local Businesses | Monsieur Click',
    meta: 'Technical, on-page and content SEO for growing businesses. Measured monthly. Free SEO audit.',
    h1: 'SEO Services That Drive Qualified Traffic',
    eyebrow: 'SEO services',
    lead: 'Head terms like "SEO agency" are aspirational for a young domain. We win the long-tail and local demand that actually converts for small businesses.',
    sections: [
      ['Three pillars', 'Technical health, on-page clarity, and content that answers real questions with entities search engines and AI can trust.'],
      ['With local & GEO', 'Pair with <a href="/services/local-seo">local SEO</a> and <a href="/services/generative-engine-optimization">GEO</a> when buyers search nearby or ask AI.'],
    ],
    links: [
      ['/small-business-seo', 'Small business SEO'],
      ['/services/seo-audit', 'SEO audit'],
      ['/glossary/', 'Glossary'],
    ],
    faqs: [
      ['Do you guarantee #1 rankings?', 'No. We measure progress honestly: visibility, leads and citations, not vanity positions.'],
    ],
  },
  {
    file: 'services/seo-audit/index.html',
    url: 'https://monsieurclick.com/services/seo-audit',
    fr: 'https://monsieurclick.fr/services/audit-seo',
    title: 'SEO Audit — Technical, On-Page & Competitive | Monsieur Click',
    meta: 'Full SEO audit: technical, on-page, content and competitors. Prioritized action plan. Free diagnostic available.',
    h1: 'SEO Audit',
    eyebrow: 'SEO audit',
    lead: 'Know what blocks your visibility before you spend on tactics. We deliver a prioritized plan you can execute with us or in-house.',
    sections: [
      ['Scope', 'Crawl & indexation, Core Web Vitals, on-page, content gaps, local signals and AI/GEO readiness.'],
      ['Output', 'Scorecard, issues by impact, and a 30/60/90-day roadmap.'],
    ],
    links: [
      ['/services/seo', 'SEO services'],
      ['/contact', 'Book a free diagnostic'],
    ],
    faqs: [],
  },
  {
    file: 'services/google-business-profile/index.html',
    url: 'https://monsieurclick.com/services/google-business-profile',
    fr: 'https://monsieurclick.fr/services/google-business-profile',
    title: 'Google Business Profile Optimization | Monsieur Click',
    meta: 'Optimize your Google Business Profile for the map pack: categories, photos, posts, reviews and NAP consistency. Free audit.',
    h1: 'Google Business Profile Optimization',
    eyebrow: 'Google Business Profile',
    lead: 'Your GBP is often the first impression on mobile. We make it complete, consistent and review-ready.',
    sections: [
      ['What we optimize', 'Primary/secondary categories, services, photos, posts, Q&A, review replies and citation alignment.'],
      ['Learn more', '<a href="/glossary/google-business-profile">GBP definition</a> · <a href="/services/local-seo">Local SEO</a>'],
    ],
    links: [
      ['/services/local-seo', 'Local SEO'],
      ['/glossary/google-business-profile', 'GBP glossary'],
    ],
    faqs: [],
  },
  {
    file: 'ai-seo-agency/index.html',
    url: 'https://monsieurclick.com/ai-seo-agency',
    fr: null,
    title: 'AI SEO Agency — Rank on Google & AI Search | Monsieur Click',
    meta: 'AI SEO agency combining classic SEO with Generative Engine Optimization. Get found on Google and cited by ChatGPT.',
    h1: 'AI SEO Agency — SEO + Generative Engine Optimization',
    eyebrow: 'AI SEO agency',
    lead: 'We are not an "AI wrapper" agency. We combine proven SEO with GEO so small businesses show up in classic search and AI answers.',
    sections: [
      ['Positioning', 'Flagship work lives on our <a href="/services/generative-engine-optimization">GEO service</a>. This page captures "AI SEO agency" intent with native US/UK framing.'],
      ['Proof', 'See <a href="/case-studies/">case studies</a> where clients became visible to ChatGPT and Perplexity.'],
    ],
    links: [
      ['/services/generative-engine-optimization', 'GEO services'],
      ['/small-business-seo', 'Small business SEO'],
      ['/glossary/generative-engine-optimization', 'What is GEO?'],
    ],
    faqs: [],
  },
];

function pageHtml(p) {
  const hreflang = p.fr
    ? `<link rel="alternate" hreflang="en-us" href="${p.url}">
<link rel="alternate" hreflang="en-gb" href="${p.url}">
<link rel="alternate" hreflang="fr-fr" href="${p.fr}">
<link rel="alternate" hreflang="fr-be" href="${p.fr}">
<link rel="alternate" hreflang="fr-ch" href="${p.fr}">
<link rel="alternate" hreflang="x-default" href="${p.fr}">`
    : `<link rel="alternate" hreflang="en" href="${p.url}">
<link rel="alternate" hreflang="x-default" href="${p.url}">`;

  const sections = p.sections
    .map(([h, body]) => `<section class="u-section-tight"><div class="wrap prose" style="max-width:820px"><h2>${h}</h2><p>${body}</p></div></section>`)
    .join('\n');
  const links = p.links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('');
  const faqs =
    p.faqs.length === 0
      ? ''
      : `<section id="faq"><div class="wrap" style="max-width:820px"><h2>FAQ</h2>${p.faqs
          .map(
            ([q, a]) =>
              `<div class="faq-item"><button class="faq-q">${q}<span class="chev">+</span></button><div class="faq-a"><p>${a}</p></div></div>`
          )
          .join('')}</div></section>`;
  const faqSchema =
    p.faqs.length === 0
      ? ''
      : `<script type="application/ld+json">${JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: p.faqs.map(([q, a]) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        })}</script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/webp" href="/logo-mc.webp">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.title}</title>
<meta name="description" content="${p.meta}">
<link rel="canonical" href="${p.url}">
${hreflang}
<link rel="stylesheet" href="/styles.css?v=20260716g">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Service","name":"${p.h1}","provider":{"@type":"ProfessionalService","name":"Monsieur Click","url":"https://monsieurclick.com"},"url":"${p.url}","description":${JSON.stringify(p.meta)}}
</script>
${faqSchema}
</head>
<body>
${nav}
<main>
<header class="pagehero">
  <div class="wrap">
    <span class="eyebrow">${p.eyebrow}</span>
    <h1>${p.h1}</h1>
    <p class="sub">${p.lead}</p>
    <div style="margin-top:1.2rem"><a href="/contact" class="btn btn-primary">Get my free audit</a></div>
  </div>
</header>
${sections}
<section><div class="wrap" style="max-width:820px"><h2>Related</h2><ul>${links}</ul></div></section>
${faqs}
<section class="u-section-tight"><div class="wrap"><div class="ctaband">
  <h2>Ready to get found?</h2>
  <p>Free audit. No commitment.</p>
  <a href="/contact" class="btn">Get my free audit</a>
</div></div></section>
</main>
${foot}
</body>
</html>`;
}

for (const p of pages) {
  const out = path.join(EN, p.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, pageHtml(p));
  console.log('wrote', path.relative(EN, out));
}
console.log('done');
