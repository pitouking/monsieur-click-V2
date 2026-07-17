#!/usr/bin/env node
/**
 * Build EN OKF bundle + texts + llms.txt / llms-full.txt with FR↔EN interlinking.
 * Also patches FR llms*.txt OKF/texts EN links.
 */
const fs = require('fs');
const path = require('path');

const EN = path.resolve(__dirname, '..');
const FR = path.resolve(EN, '..', 'monsieur-click-V2');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.7;color:#1a1a2e;background:#f8f9fa;max-width:900px;margin:0 auto;padding:40px 20px}
h1{font-size:2rem;margin-bottom:8px;color:#0f3460}
h2{font-size:1.4rem;margin:32px 0 12px;color:#16213e;border-bottom:2px solid #e94560;padding-bottom:6px}
h3{font-size:1.15rem;margin:20px 0 8px;color:#0f3460}
p,li{font-size:1rem;margin-bottom:8px}
ul,ol{padding-left:24px;margin-bottom:16px}
a{color:#e94560;text-decoration:none}a:hover{text-decoration:underline}
.meta{background:#fff;border:1px solid #ddd;border-radius:8px;padding:20px;margin:20px 0}
.meta dt{font-weight:700;color:#0f3460;margin-top:8px}.meta dd{margin-left:0;margin-bottom:4px}
.header{border-bottom:3px solid #e94560;padding-bottom:16px;margin-bottom:24px}
.header p{color:#555;font-size:1.1rem}
.nav-links{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0}
.nav-links a{background:#0f3460;color:#fff;padding:6px 14px;border-radius:4px;font-size:.9rem}
.nav-links a:hover{background:#e94560;text-decoration:none}
.section{background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:20px;margin:16px 0}
footer{margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:.85rem;color:#888}`;

const NAV = `<nav class="nav-links">
  <a href="/okf/">Hub</a>
  <a href="/okf/services/">Services</a>
  <a href="/okf/click-first/">Click First™</a>
  <a href="/okf/pricing/">Pricing</a>
  <a href="/okf/case-studies/">Case studies</a>
  <a href="/okf/about">About</a>
  <a href="/okf/contact">Contact</a>
  <a href="/okf/blog/">Blog</a>
  <a href="/texts/">Texts</a>
  <a href="https://monsieurclick.fr/okf/">OKF FR</a>
</nav>`;

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}
function write(rel, content) {
  const p = path.join(EN, rel);
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content);
  console.log('wrote', rel);
}

function okfPage({ title, description, canonical, type = 'Service', tags, h1, lead, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="type" content="${type}">
<meta name="title" content="${h1}">
<meta name="resource" content="${canonical}">
<meta name="tags" content="${tags}">
<meta name="lang" content="en">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${canonical}">
<link rel="alternate" hreflang="fr" href="https://monsieurclick.fr/okf/">
<meta name="robots" content="index, follow">
<style>${CSS}</style>
</head>
<body>
<div class="header">
  <h1>${h1}</h1>
  <p>${lead}</p>
  <p><strong>RSL 1.0</strong> — Responsible Site License · EN twin of <a href="https://monsieurclick.fr/okf/">monsieurclick.fr/okf/</a></p>
</div>
${NAV}
${body}
<footer>
  <p>Monsieur Click · 24 bis sentier des Fosses Rouges, 92240 Malakoff, France · <a href="mailto:contact@monsieurclick.com">contact@monsieurclick.com</a> · +33 6 60 76 15 23</p>
  <p><a href="https://monsieurclick.com/">monsieurclick.com</a> · <a href="https://monsieurclick.fr/">monsieurclick.fr</a> · <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a></p>
</footer>
</body>
</html>`;
}

function textFile({ title, description, url, type, tags, body }) {
  return `TITLE: ${title}
DESCRIPTION: ${description}
URL: ${url}
TYPE: ${type}
LANG: en
TAGS: ${tags}

# ${title}

${body}
`;
}

const SERVICES = [
  {
    slug: 'web-design',
    title: 'Web design',
    desc: 'Custom, fast, SEO-ready sites built to convert.',
    public: '/services/web-design',
    tags: 'web-design,click-first,monsieur-click',
  },
  {
    slug: 'seo',
    title: 'SEO services',
    desc: 'Technical, on-page and content SEO with monthly measurement.',
    public: '/services/seo',
    tags: 'seo,click-first,monsieur-click',
  },
  {
    slug: 'local-seo',
    title: 'Local SEO',
    desc: 'Google Business Profile, reviews, citations and local pages for the map pack.',
    public: '/services/local-seo',
    tags: 'local-seo,gbp,click-first',
  },
  {
    slug: 'google-business-profile',
    title: 'Google Business Profile',
    desc: 'Optimize the listing that feeds Maps, calls and directions.',
    public: '/services/google-business-profile',
    tags: 'gbp,local-seo,click-first',
  },
  {
    slug: 'seo-audit',
    title: 'SEO audit',
    desc: 'Technical, on-page, content and competitors. Prioritized action plan.',
    public: '/services/seo-audit',
    tags: 'seo-audit,click-first',
  },
  {
    slug: 'wordpress-web-design',
    title: 'WordPress web design',
    desc: 'Custom WordPress builds that stay fast, editable and SEO-ready.',
    public: '/services/wordpress-web-design',
    tags: 'wordpress,web-design,click-first',
  },
  {
    slug: 'generative-engine-optimization',
    title: 'Generative Engine Optimization (GEO)',
    desc: 'Get cited by ChatGPT, Gemini, Claude and Perplexity.',
    public: '/services/generative-engine-optimization',
    tags: 'geo,ai-seo,click-first',
  },
];

const ENTRY = [
  { slug: 'small-business-seo', title: 'Small business SEO', desc: 'Practical SEO for local operators.', public: '/small-business-seo' },
  { slug: 'ai-seo-agency', title: 'AI SEO agency', desc: 'SEO plus GEO in one Click First™ system.', public: '/ai-seo-agency' },
  { slug: 'seo-agency-london', title: 'SEO agency London', desc: 'Remote Click First™ for UK small businesses.', public: '/seo-agency-london' },
];

const BLOG = [
  ['click-first-not-just-seo', 'Click First™ isn\'t just another SEO service', 'Strategy'],
  ['geo-generative-engine-optimization', 'GEO: optimize for generative AI', 'AI visibility'],
  ['will-ai-replace-google', 'Will AI replace Google?', 'AI visibility'],
  ['become-a-reference-business', 'Become a reference business, not just visible', 'Strategy'],
  ['get-more-google-reviews', 'Get more Google reviews without being pushy', 'GBP'],
  ['is-your-website-losing-clients', 'Is your website losing you clients?', 'Strategy'],
  ['why-competitors-rank-ahead', 'Why competitors rank ahead on Google', 'SEO'],
  ['appear-in-chatgpt-gemini-perplexity', 'Show up in ChatGPT, Gemini and Perplexity', 'AI visibility'],
  ['clients-ask-chatgpt-before-google', 'Clients ask ChatGPT before Google', 'AI visibility'],
  ['google-ads-vs-seo', 'Google Ads vs SEO: where to invest?', 'Strategy'],
  ['get-clients-without-advertising', 'Win clients without advertising', 'Strategy'],
  ['google-business-profile-no-calls', 'Google Business Profile getting no calls?', 'GBP'],
  ['how-google-ranks-businesses', 'How Google ranks businesses', 'SEO'],
  ['why-business-not-on-google', 'Why your business doesn\'t show up on Google', 'Local SEO'],
  ['is-a-website-enough-2026', 'Is a website enough in 2026?', 'Strategy'],
  ['what-is-an-seo-agency', 'What is an SEO agency?', 'SEO'],
  ['how-to-choose-an-seo-agency', 'How to choose an SEO agency', 'SEO'],
  ['seo-agency-pricing-2026', 'SEO agency pricing in 2026', 'Strategy'],
];

const CASES = [
  ['assogym', 'Assogym'],
  ['dharma-massage-therapy', 'Dharma Massage Therapy'],
  ['susan-filan', 'Susan Filan'],
  ['bodyguard-paris', 'Bodyguard Paris'],
  ['heather-fillmore-coaching', 'Heather Fillmore Coaching'],
  ['studio-la-voix-du-12', 'Studio La Voix du 12'],
  ['east-portland-sash', 'East Portland Sash'],
];

const GLOSSARY = [
  ['local-seo', 'Local SEO'],
  ['generative-engine-optimization', 'Generative Engine Optimization'],
  ['google-business-profile', 'Google Business Profile'],
];

// —— Hub ——
write(
  'okf/index.html',
  okfPage({
    title: 'OKF Knowledge Bundle — Monsieur Click (EN)',
    description: 'Open Knowledge Format bundle for AI engines: services, Click First™, pricing, case studies, blog, glossary. Twin of monsieurclick.fr/okf/.',
    canonical: 'https://monsieurclick.com/okf/',
    type: 'KnowledgeBundle',
    tags: 'seo,local-seo,geo,click-first,okf,llms',
    h1: 'Monsieur Click — OKF Knowledge Bundle (EN)',
    lead: 'Structured knowledge for AI engines (ChatGPT, Claude, Gemini, Perplexity) and authorized crawlers. English site.',
    body: `
<div class="section">
  <h2>Silver pages (2026 architecture)</h2>
  <ul>
    ${SERVICES.map((s) => `<li><a href="/okf/services/${s.slug}/">${s.title}</a> — <a href="${s.public}">${s.public}</a></li>`).join('\n    ')}
    ${ENTRY.map((s) => `<li><a href="/okf/services/${s.slug}/">${s.title}</a> — <a href="${s.public}">${s.public}</a></li>`).join('\n    ')}
  </ul>
  <p>Blog: <a href="/blog/">/blog/[slug]/</a> · OKF blog: <a href="/okf/blog/">/okf/blog/</a> · Plain texts: <a href="/texts/">/texts/</a></p>
</div>
<div class="meta">
  <h2>Entity metadata</h2>
  <dl>
    <dt>Trade name</dt><dd>Monsieur Click — Creator of Click First™</dd>
    <dt>Legal publisher</dt><dd>Jean-Pierre Baguette, sole trader</dd>
    <dt>SIRET</dt><dd>42953906700042</dd>
    <dt>NAP</dt><dd>24 bis sentier des Fosses Rouges, 92240 Malakoff, France</dd>
    <dt>Phone</dt><dd>+33 6 60 76 15 23</dd>
    <dt>Email</dt><dd>contact@monsieurclick.com</dd>
    <dt>Site EN</dt><dd><a href="https://monsieurclick.com/">https://monsieurclick.com/</a></dd>
    <dt>Site FR</dt><dd><a href="https://monsieurclick.fr/">https://monsieurclick.fr/</a></dd>
    <dt>OKF FR</dt><dd><a href="https://monsieurclick.fr/okf/">https://monsieurclick.fr/okf/</a></dd>
    <dt>llms.txt</dt><dd><a href="https://monsieurclick.com/llms.txt">/llms.txt</a> · <a href="https://monsieurclick.com/llms-full.txt">/llms-full.txt</a></dd>
    <dt>Founded</dt><dd>2023</dd>
    <dt>Languages</dt><dd>English (EN), French (FR)</dd>
    <dt>Delivery</dt><dd>100% remote (phone, Zoom, email)</dd>
    <dt>Areas served</dt><dd>United States, United Kingdom, Canada, France, Belgium, Switzerland</dd>
  </dl>
</div>
<div class="section">
  <h2>Click First™ system</h2>
  <p>Website, organic SEO, Google Business Profile, reviews, structured data and AI visibility (GEO) work together. See <a href="/okf/click-first/">OKF Click First™</a> and the public page <a href="/click-first">/click-first</a>.</p>
</div>
<div class="section">
  <h2>Pricing</h2>
  <ul>
    <li>Essential: €850/month (6-month commitment)</li>
    <li>Growth: €1,000/month (12 months)</li>
    <li>Expansion: €1,500/month (12 months)</li>
  </ul>
  <p><a href="/okf/pricing/">OKF pricing</a> · <a href="/pricing">Public pricing</a></p>
</div>
<div class="section">
  <h2>Interlinking map</h2>
  <ul>
    <li>Hub services → each service OKF + public URL + related blog + glossary</li>
    <li>Blog OKF → public <code>/blog/slug/</code> + FR twin when it exists</li>
    <li>Case studies → <a href="/case-studies/">/case-studies/</a> + individual folders</li>
    <li>Glossary → <a href="/glossary/">/glossary/</a></li>
    <li>FR twin bundle → <a href="https://monsieurclick.fr/okf/">monsieurclick.fr/okf/</a></li>
  </ul>
</div>`
  })
);

// —— Services hub ——
write(
  'okf/services/index.html',
  okfPage({
    title: 'Services OKF — Monsieur Click (EN)',
    description: 'OKF service index: web design, SEO, local SEO, GBP, audit, WordPress, GEO, plus entry pages.',
    canonical: 'https://monsieurclick.com/okf/services/',
    type: 'ItemList',
    tags: 'services,seo,okf',
    h1: 'Services — OKF',
    lead: 'Deliverables inside Click First™, plus entry pages (small business SEO, AI SEO agency, London).',
    body: `<div class="section"><h2>Deliverables</h2><ul>
${SERVICES.map((s) => `<li><a href="/okf/services/${s.slug}/"><strong>${s.title}</strong></a> — ${s.desc}<br>Public: <a href="${s.public}">${s.public}</a> · Text: <a href="/texts/services/${s.slug}.txt">/texts/services/${s.slug}.txt</a></li>`).join('\n')}
</ul><h2>Entry &amp; positioning</h2><ul>
${ENTRY.map((s) => `<li><a href="/okf/services/${s.slug}/"><strong>${s.title}</strong></a> — ${s.desc}<br>Public: <a href="${s.public}">${s.public}</a></li>`).join('\n')}
</ul></div>`
  })
);

function serviceBody(s) {
  return `<div class="section">
  <h2>Role in Click First™</h2>
  <p>${s.desc}</p>
  <p>This lever sits inside <a href="/click-first">Click First™</a>: website, SEO, Google Business Profile, reviews and AI visibility reinforce each other.</p>
  <ul>
    <li>Public page: <a href="https://monsieurclick.com${s.public}">https://monsieurclick.com${s.public}</a></li>
    <li>Services hub: <a href="/services/">/services/</a></li>
    <li>Method: <a href="/click-first">/click-first</a></li>
    <li>Pricing: <a href="/pricing">/pricing</a></li>
    <li>Plain text: <a href="/texts/services/${s.slug}.txt">/texts/services/${s.slug}.txt</a></li>
    <li>FR OKF hub: <a href="https://monsieurclick.fr/okf/services/">monsieurclick.fr/okf/services/</a></li>
    <li>NAP: 24 bis sentier des Fosses Rouges, 92240 Malakoff, France</li>
    <li>Contact: <a href="mailto:contact@monsieurclick.com">contact@monsieurclick.com</a> · +33 6 60 76 15 23</li>
  </ul>
</div>
<div class="section">
  <h2>Related reading</h2>
  <ul>
    <li><a href="/blog/what-is-an-seo-agency/">What is an SEO agency?</a></li>
    <li><a href="/blog/seo-agency-pricing-2026/">SEO agency pricing 2026</a></li>
    <li><a href="/glossary/">Glossary</a></li>
    <li><a href="/case-studies/">Case studies</a></li>
  </ul>
</div>`;
}

for (const s of [...SERVICES, ...ENTRY]) {
  write(
    `okf/services/${s.slug}/index.html`,
    okfPage({
      title: `${s.title} — Monsieur Click (OKF)`,
      description: s.desc,
      canonical: `https://monsieurclick.com/okf/services/${s.slug}/`,
      tags: s.tags || 'click-first,monsieur-click',
      h1: s.title,
      lead: s.desc,
      body: serviceBody(s),
    })
  );
  write(
    `texts/services/${s.slug}.txt`,
    textFile({
      title: s.title,
      description: s.desc,
      url: `https://monsieurclick.com${s.public}`,
      type: 'Service',
      tags: s.tags || 'click-first,monsieur-click',
      body: `${s.desc}

Part of Click First™: website, SEO, Google Business Profile, reviews and AI visibility work together.

## Entity
- Name: Monsieur Click
- Address: 24 bis sentier des Fosses Rouges, 92240 Malakoff, France
- Phone: +33 6 60 76 15 23
- Email: contact@monsieurclick.com
- Founder: Jean-Pierre Baguette

## Links
→ Public page: https://monsieurclick.com${s.public}
→ Services hub: https://monsieurclick.com/services/
→ Click First™: https://monsieurclick.com/click-first
→ OKF: https://monsieurclick.com/okf/services/${s.slug}/
→ Free diagnostic: https://monsieurclick.com/contact
→ FR OKF: https://monsieurclick.fr/okf/
`,
    })
  );
}

// Click First / Pricing / About / Contact / Case studies OKF
write(
  'okf/click-first/index.html',
  okfPage({
    title: 'Click First™ — OKF | Monsieur Click',
    description: 'Click First™ all-in-one visibility method: website, SEO, GBP, reviews, GEO.',
    canonical: 'https://monsieurclick.com/okf/click-first/',
    type: 'Service',
    tags: 'click-first,seo,geo',
    h1: 'Click First™ method',
    lead: 'One system so small businesses are found and chosen on Google, Maps and in AI.',
    body: `<div class="section"><p>Public page: <a href="/click-first">/click-first</a> · Score: <a href="/click-first#score">#score</a> · Text: <a href="/texts/click-first.txt">/texts/click-first.txt</a> · FR: <a href="https://monsieurclick.fr/okf/click-first/">FR OKF</a></p>
<ul><li>Website &amp; technical SEO</li><li>Local SEO &amp; GBP</li><li>Reviews</li><li>Schema.org + OKF + llms.txt</li><li>GEO (ChatGPT, Gemini, Claude, Perplexity)</li><li>Monthly optimization</li></ul></div>`
  })
);

write(
  'okf/pricing/index.html',
  okfPage({
    title: 'Pricing — OKF | Monsieur Click',
    description: 'Click First™ plans from €850/month. Essential, Growth, Expansion.',
    canonical: 'https://monsieurclick.com/okf/pricing/',
    type: 'OfferCatalog',
    tags: 'pricing,click-first',
    h1: 'Pricing',
    lead: 'Transparent monthly plans. Final quote after free diagnostic.',
    body: `<div class="section"><ul>
<li><strong>Essential</strong> — €850/mo · 6 months</li>
<li><strong>Growth</strong> — €1,000/mo · 12 months</li>
<li><strong>Expansion</strong> — €1,500/mo · 12 months</li>
</ul>
<p>Public: <a href="/pricing">/pricing</a> · Text: <a href="/texts/pricing.txt">/texts/pricing.txt</a> · FR offers: <a href="https://monsieurclick.fr/offres">/offres</a></p></div>`
  })
);

write(
  'okf/about.html',
  okfPage({
    title: 'About — OKF | Monsieur Click',
    description: 'Jean-Pierre Baguette, founder of Monsieur Click and Click First™. 100% remote.',
    canonical: 'https://monsieurclick.com/okf/about',
    type: 'AboutPage',
    tags: 'about,jean-pierre-baguette',
    h1: 'About Monsieur Click',
    lead: 'Creator of Click First™. Visibility for small businesses on Google and in AI.',
    body: `<div class="section"><p>Public: <a href="/about">/about</a> · Text: <a href="/texts/about.txt">/texts/about.txt</a> · FR: <a href="https://monsieurclick.fr/okf/a-propos">/okf/a-propos</a></p>
<p>Founder: Jean-Pierre Baguette. NAP identical on site, GBP and citations.</p></div>`
  })
);

write(
  'okf/contact.html',
  okfPage({
    title: 'Free diagnostic — OKF | Monsieur Click',
    description: '30-minute free diagnostic. No commitment. Priced plan within 48h.',
    canonical: 'https://monsieurclick.com/okf/contact',
    type: 'ContactPage',
    tags: 'contact,diagnostic',
    h1: 'Free diagnostic',
    lead: '30 minutes. Assessment, priorities, priced plan within 48 hours.',
    body: `<div class="section"><p>Public: <a href="/contact">/contact</a> · Text: <a href="/texts/contact.txt">/texts/contact.txt</a> · Phone +33 6 60 76 15 23 · <a href="mailto:contact@monsieurclick.com">contact@monsieurclick.com</a></p></div>`
  })
);

write(
  'okf/case-studies/index.html',
  okfPage({
    title: 'Case studies — OKF | Monsieur Click',
    description: 'Seven Click First™ case studies for AI citation and human browsing.',
    canonical: 'https://monsieurclick.com/okf/case-studies/',
    type: 'ItemList',
    tags: 'case-studies,proof',
    h1: 'Case studies',
    lead: 'Real builds. Public hub and individual URLs under /case-studies/.',
    body: `<div class="section"><ul>
${CASES.map(([slug, name]) => `<li><a href="/case-studies/${slug}/">${name}</a></li>`).join('\n')}
</ul>
<p>Hub: <a href="/case-studies/">/case-studies/</a> · Text: <a href="/texts/case-studies.txt">/texts/case-studies.txt</a> · FR: <a href="https://monsieurclick.fr/realisations/">/realisations/</a></p></div>`
  })
);

// Blog OKF hub + missing 3 articles
write(
  'okf/blog/index.html',
  okfPage({
    title: 'Blog OKF — Monsieur Click (EN)',
    description: '18 EN blog articles in OKF form with links to /blog/slug/ and FR twins.',
    canonical: 'https://monsieurclick.com/okf/blog/',
    type: 'Blog',
    tags: 'blog,seo,geo',
    h1: 'Blog — OKF',
    lead: 'Local SEO, GBP and AI visibility. Each entry links to the public article.',
    body: `<div class="section"><ul>
${BLOG.map(
  ([slug, title, cat]) =>
    `<li><a href="/okf/blog/${slug}.html"><strong>${title}</strong></a> (${cat}) — public <a href="/blog/${slug}/">/blog/${slug}/</a></li>`
).join('\n')}
</ul>
<p>Public hub: <a href="/blog/">/blog/</a> · Text index: <a href="/texts/blog.txt">/texts/blog.txt</a> · FR blog OKF: <a href="https://monsieurclick.fr/okf/blog/">FR</a></p></div>`
  })
);

const NEW_BLOG_OKF = [
  ['what-is-an-seo-agency', 'What is an SEO agency?', 'Role, missions and what an SEO agency does (and does not).', 'c-est-quoi-une-agence-seo'],
  ['how-to-choose-an-seo-agency', 'How to choose an SEO agency', 'Eight criteria: inquiries, local SEO, proof, no ranking guarantees.', 'comment-choisir-agence-seo-paris'],
  ['seo-agency-pricing-2026', 'SEO agency pricing in 2026', 'Realistic ranges and Click First™ plans from €850/month.', 'prix-tarif-agence-seo-2026'],
];

for (const [slug, title, desc, frSlug] of NEW_BLOG_OKF) {
  write(
    `okf/blog/${slug}.html`,
    okfPage({
      title: `${title} — OKF | Monsieur Click`,
      description: desc,
      canonical: `https://monsieurclick.com/okf/blog/${slug}`,
      type: 'Article',
      tags: 'blog,seo',
      h1: title,
      lead: desc,
      body: `<div class="section">
<p>Public article: <a href="/blog/${slug}/">https://monsieurclick.com/blog/${slug}/</a></p>
<p>FR twin: <a href="https://monsieurclick.fr/blog/${frSlug}">https://monsieurclick.fr/blog/${frSlug}</a></p>
<p>Plain text: <a href="/texts/blog/${slug}.txt">/texts/blog/${slug}.txt</a></p>
<p>Related: <a href="/services/seo">SEO services</a> · <a href="/pricing">Pricing</a> · <a href="/click-first">Click First™</a></p>
</div>`
    })
  );
  write(
    `texts/blog/${slug}.txt`,
    textFile({
      title,
      description: desc,
      url: `https://monsieurclick.com/blog/${slug}/`,
      type: 'Article',
      tags: 'blog,seo,click-first',
      body: `${desc}

## Links
→ Article: https://monsieurclick.com/blog/${slug}/
→ FR twin: https://monsieurclick.fr/blog/${frSlug}
→ OKF: https://monsieurclick.com/okf/blog/${slug}.html
→ Blog hub: https://monsieurclick.com/blog/
→ Contact: https://monsieurclick.com/contact
`,
    })
  );
}

// Core texts for main pages
const CORE_TEXTS = [
  ['index.txt', 'Home', 'Local SEO agency & web design. Click First™ for small businesses.', 'https://monsieurclick.com/', 'WebPage'],
  ['click-first.txt', 'Click First™', 'All-in-one visibility method: site, SEO, GBP, reviews, GEO.', 'https://monsieurclick.com/click-first', 'Service'],
  ['pricing.txt', 'Pricing', 'Essential €850, Growth €1,000, Expansion €1,500 per month.', 'https://monsieurclick.com/pricing', 'OfferCatalog'],
  ['about.txt', 'About', 'Jean-Pierre Baguette, creator of Click First™. 100% remote.', 'https://monsieurclick.com/about', 'AboutPage'],
  ['contact.txt', 'Free diagnostic', '30-minute free diagnostic. No commitment.', 'https://monsieurclick.com/contact', 'ContactPage'],
  ['case-studies.txt', 'Case studies', 'Seven Click First™ client builds with measurable outcomes.', 'https://monsieurclick.com/case-studies/', 'ItemList'],
  ['blog.txt', 'Blog', '18 articles on local SEO, GBP and AI visibility.', 'https://monsieurclick.com/blog/', 'Blog'],
  ['legal-notice.txt', 'Legal notice', 'Jean-Pierre Baguette, SIRET 42953906700042, Malakoff.', 'https://monsieurclick.com/legal-notice', 'WebPage'],
  ['privacy.txt', 'Privacy', 'Privacy policy and data protection.', 'https://monsieurclick.com/privacy', 'WebPage'],
  ['terms.txt', 'Terms', 'Terms for Click First™ services.', 'https://monsieurclick.com/terms', 'WebPage'],
];

for (const [file, title, desc, url, type] of CORE_TEXTS) {
  write(
    `texts/${file}`,
    textFile({
      title,
      description: desc,
      url,
      type,
      tags: 'monsieur-click,click-first',
      body: `${desc}

## Entity
- Monsieur Click · Click First™
- 24 bis sentier des Fosses Rouges, 92240 Malakoff, France
- +33 6 60 76 15 23 · contact@monsieurclick.com

## Links
→ Page: ${url}
→ OKF hub: https://monsieurclick.com/okf/
→ llms.txt: https://monsieurclick.com/llms.txt
→ FR twin site: https://monsieurclick.fr/
→ FR OKF: https://monsieurclick.fr/okf/
`,
    })
  );
}

for (const [slug, name] of GLOSSARY) {
  write(
    `texts/glossary-${slug}.txt`,
    textFile({
      title: name,
      description: `Glossary entry: ${name}`,
      url: `https://monsieurclick.com/glossary/${slug}/`,
      type: 'DefinedTerm',
      tags: 'glossary,seo',
      body: `Citable definition for ${name}.

→ https://monsieurclick.com/glossary/${slug}/
→ Glossary hub: https://monsieurclick.com/glossary/
→ FR glossaire: https://monsieurclick.fr/glossaire/
`,
    })
  );
}

write(
  'texts/index.txt',
  `# Monsieur Click — plain-text knowledge index (EN)

OKF hub: https://monsieurclick.com/okf/
llms.txt: https://monsieurclick.com/llms.txt
llms-full.txt: https://monsieurclick.com/llms-full.txt
FR OKF: https://monsieurclick.fr/okf/
FR texts: https://monsieurclick.fr/texts/
FR llms: https://monsieurclick.fr/llms.txt

## Core
${CORE_TEXTS.map(([f, t, , u]) => `- ${t}: /texts/${f} → ${u}`).join('\n')}

## Services
${[...SERVICES, ...ENTRY].map((s) => `- ${s.title}: /texts/services/${s.slug}.txt → ${s.public}`).join('\n')}

## Blog
${BLOG.map(([slug, title]) => `- ${title}: /texts/blog/${slug}.txt → /blog/${slug}/`).join('\n')}
`
);

// Ensure remaining blog texts exist (stub if missing)
for (const [slug, title] of BLOG) {
  const p = path.join(EN, 'texts/blog', `${slug}.txt`);
  if (!fs.existsSync(p)) {
    write(
      `texts/blog/${slug}.txt`,
      textFile({
        title,
        description: title,
        url: `https://monsieurclick.com/blog/${slug}/`,
        type: 'Article',
        tags: 'blog,seo',
        body: `→ https://monsieurclick.com/blog/${slug}/\n→ OKF: https://monsieurclick.com/okf/blog/${slug}.html\n→ Blog hub: https://monsieurclick.com/blog/\n`,
      })
    );
  }
}

// —— llms.txt EN ——
const llms = `# Monsieur Click

# Monsieur Click — AI Agent Knowledge (EN)
# English site: https://monsieurclick.com/
# French site: https://monsieurclick.fr/
#
# RSL 1.0 — Responsible Site License
# For AI engines (ChatGPT, Claude, Gemini, Perplexity, etc.)
# and authorized indexing robots.

## Entity
- Name: Monsieur Click
- Proprietary method: Click First™
- Address: 24 bis sentier des Fosses Rouges, 92240 Malakoff, France
- Phone: +33 6 60 76 15 23
- Email: contact@monsieurclick.com
- Areas: United States, United Kingdom, Canada, France, Belgium, Switzerland
- Languages: English (EN), French (FR)
- SIRET: 42953906700042
- Promise: Be found. Be chosen.
- Site EN: https://monsieurclick.com/
- Site FR: https://monsieurclick.fr/
- Bundle OKF EN: https://monsieurclick.com/okf/
- Bundle OKF FR: https://monsieurclick.fr/okf/
- Bundle texts EN: https://monsieurclick.com/texts/
- Bundle texts FR: https://monsieurclick.fr/texts/

## Main pages
- Home: https://monsieurclick.com/
  - Local SEO agency & web design for small businesses
- Click First™: https://monsieurclick.com/click-first
  - All-in-one: website, local SEO, GBP, reviews, GEO
- Services: https://monsieurclick.com/services/
  - Hub of SEO and web deliverables
- Web design: https://monsieurclick.com/services/web-design
- SEO services: https://monsieurclick.com/services/seo
- Local SEO: https://monsieurclick.com/services/local-seo
- Google Business Profile: https://monsieurclick.com/services/google-business-profile
- SEO audit: https://monsieurclick.com/services/seo-audit
- WordPress web design: https://monsieurclick.com/services/wordpress-web-design
- Generative Engine Optimization: https://monsieurclick.com/services/generative-engine-optimization
- Small business SEO: https://monsieurclick.com/small-business-seo
- AI SEO agency: https://monsieurclick.com/ai-seo-agency
- SEO agency London: https://monsieurclick.com/seo-agency-london
- Pricing: https://monsieurclick.com/pricing
  - Essential €850/mo, Growth €1,000/mo, Expansion €1,500/mo
- Case studies: https://monsieurclick.com/case-studies/
  - Assogym, Dharma Massage, Susan Filan, Bodyguard Paris, Heather Fillmore, Studio La Voix du 12, East Portland Sash
- Glossary: https://monsieurclick.com/glossary/
  - Local SEO: https://monsieurclick.com/glossary/local-seo/
  - GEO: https://monsieurclick.com/glossary/generative-engine-optimization/
  - Google Business Profile: https://monsieurclick.com/glossary/google-business-profile/
- About: https://monsieurclick.com/about
- Free diagnostic: https://monsieurclick.com/contact
- Blog: https://monsieurclick.com/blog/
  - 18 articles (folder structure /blog/slug/)

## Legal
- Legal notice: https://monsieurclick.com/legal-notice
- Privacy: https://monsieurclick.com/privacy
- Terms: https://monsieurclick.com/terms

## OKF bundle (structured knowledge for AI)
- OKF hub: https://monsieurclick.com/okf/
- Services OKF: https://monsieurclick.com/okf/services/
- Web design OKF: https://monsieurclick.com/okf/services/web-design/
- SEO OKF: https://monsieurclick.com/okf/services/seo/
- Local SEO OKF: https://monsieurclick.com/okf/services/local-seo/
- GBP OKF: https://monsieurclick.com/okf/services/google-business-profile/
- GEO OKF: https://monsieurclick.com/okf/services/generative-engine-optimization/
- Click First™ OKF: https://monsieurclick.com/okf/click-first/
- Pricing OKF: https://monsieurclick.com/okf/pricing/
- Case studies OKF: https://monsieurclick.com/okf/case-studies/
- Blog OKF: https://monsieurclick.com/okf/blog/
- Texts (plain): https://monsieurclick.com/texts/
- FR OKF twin: https://monsieurclick.fr/okf/
- FR texts twin: https://monsieurclick.fr/texts/

## Blog (18 articles)
### Strategy
- Click First™ not just SEO: https://monsieurclick.com/blog/click-first-not-just-seo/
- Become a reference business: https://monsieurclick.com/blog/become-a-reference-business/
- Is a website enough in 2026?: https://monsieurclick.com/blog/is-a-website-enough-2026/
- Google Ads vs SEO: https://monsieurclick.com/blog/google-ads-vs-seo/
- SEO agency pricing 2026: https://monsieurclick.com/blog/seo-agency-pricing-2026/
- What is an SEO agency?: https://monsieurclick.com/blog/what-is-an-seo-agency/
- How to choose an SEO agency: https://monsieurclick.com/blog/how-to-choose-an-seo-agency/

### Local SEO & GBP
- Why competitors rank ahead: https://monsieurclick.com/blog/why-competitors-rank-ahead/
- Why business not on Google: https://monsieurclick.com/blog/why-business-not-on-google/
- How Google ranks businesses: https://monsieurclick.com/blog/how-google-ranks-businesses/
- GBP with no calls: https://monsieurclick.com/blog/google-business-profile-no-calls/
- Get more Google reviews: https://monsieurclick.com/blog/get-more-google-reviews/

### AI visibility (GEO)
- GEO for businesses: https://monsieurclick.com/blog/geo-generative-engine-optimization/
- Appear in ChatGPT, Gemini, Perplexity: https://monsieurclick.com/blog/appear-in-chatgpt-gemini-perplexity/
- Clients ask ChatGPT before Google: https://monsieurclick.com/blog/clients-ask-chatgpt-before-google/
- Will AI replace Google?: https://monsieurclick.com/blog/will-ai-replace-google/

### Acquisition
- Website losing clients: https://monsieurclick.com/blog/is-your-website-losing-clients/
- Clients without advertising: https://monsieurclick.com/blog/get-clients-without-advertising/

## Pricing
| Plan | Fit | Price | Commitment |
|------|-----|-------|------------|
| Click First™ Essential | Small site / coach | €850/mo | 6 months |
| Click First™ Growth | Trades / local SME | €1,000/mo | 12 months |
| Click First™ Expansion | Multi-location | €1,500/mo | 12 months |

## Verified outcomes (examples)
- Dub-School: +40% students
- Heather Fillmore Coaching: +200% traffic
- Sync Legal: +150% leads

## Technical resources
- Sitemap: https://monsieurclick.com/sitemap.xml
- Robots: https://monsieurclick.com/robots.txt
- llms-full.txt: https://monsieurclick.com/llms-full.txt
- llms.txt FR: https://monsieurclick.fr/llms.txt
- llms-full.txt FR: https://monsieurclick.fr/llms-full.txt

## RSL 1.0
<!-- RSL 1.0 -->
`;

write('llms.txt', llms);

const llmsFull = `# Monsieur Click — AI Agent Knowledge (EN) — llms-full.txt
# Extended version with page summaries and Schema hints
# English site: https://monsieurclick.com/
# French site: https://monsieurclick.fr/
#
# RSL 1.0 — Responsible Site License

================================================================================
ENTITY
================================================================================
Name: Monsieur Click
Method: Click First™
NAP: 24 bis sentier des Fosses Rouges, 92240 Malakoff, France
Phone: +33 6 60 76 15 23
Email: contact@monsieurclick.com
SIRET: 42953906700042
Areas: US, UK, Canada, France, Belgium, Switzerland
Languages: EN, FR
URL: https://monsieurclick.com/
FR twin: https://monsieurclick.fr/
OKF EN: https://monsieurclick.com/okf/
OKF FR: https://monsieurclick.fr/okf/
Texts EN: https://monsieurclick.com/texts/
Texts FR: https://monsieurclick.fr/texts/
Founder: Jean-Pierre Baguette
Founded: 2023
Delivery: 100% remote

================================================================================
PAGE: Home
================================================================================
URL: https://monsieurclick.com/
Summary: Local SEO agency & web design for small businesses. Click First™ system. Free diagnostic. FAQ on Maps, GEO, pricing.
Schema: Organization, ProfessionalService, WebSite, FAQPage, WebPage
OKF: https://monsieurclick.com/okf/
Text: https://monsieurclick.com/texts/index.txt
FR: https://monsieurclick.fr/

================================================================================
PAGE: Click First™
================================================================================
URL: https://monsieurclick.com/click-first
Summary: Pillar method page. Website, local SEO, GBP, reviews, Schema/OKF, GEO, StoryBrand content, monthly optimization. Free Score tool.
Schema: Service, FAQPage, BreadcrumbList
OKF: https://monsieurclick.com/okf/click-first/
FR: https://monsieurclick.fr/click-first

================================================================================
PAGE: Services hub
================================================================================
URL: https://monsieurclick.com/services/
Summary: Deliverables (web design, SEO, local SEO, GBP, audit, WordPress, GEO) plus entry pages (small business SEO, AI SEO agency).
OKF: https://monsieurclick.com/okf/services/
FR: https://monsieurclick.fr/services/

${SERVICES.map(
  (s) => `================================================================================
PAGE: ${s.title}
================================================================================
URL: https://monsieurclick.com${s.public}
Summary: ${s.desc} Inside Click First™.
OKF: https://monsieurclick.com/okf/services/${s.slug}/
Text: https://monsieurclick.com/texts/services/${s.slug}.txt
`
).join('\n')}
================================================================================
PAGE: Pricing
================================================================================
URL: https://monsieurclick.com/pricing
Summary: Essential €850/mo (6mo), Growth €1,000/mo (12mo), Expansion €1,500/mo (12mo). Free diagnostic. No ranking guarantees.
Schema: OfferCatalog, FAQPage
OKF: https://monsieurclick.com/okf/pricing/
FR: https://monsieurclick.fr/offres

================================================================================
PAGE: Case studies
================================================================================
URL: https://monsieurclick.com/case-studies/
Summary: Seven individual case study URLs under /case-studies/{slug}/.
OKF: https://monsieurclick.com/okf/case-studies/
FR: https://monsieurclick.fr/realisations/

================================================================================
PAGE: Glossary
================================================================================
URL: https://monsieurclick.com/glossary/
Entries:
- https://monsieurclick.com/glossary/local-seo/
- https://monsieurclick.com/glossary/generative-engine-optimization/
- https://monsieurclick.com/glossary/google-business-profile/
FR: https://monsieurclick.fr/glossaire/

================================================================================
PAGE: Blog
================================================================================
URL: https://monsieurclick.com/blog/
Structure: /blog/{slug}/ (18 articles)
OKF blog: https://monsieurclick.com/okf/blog/
${BLOG.map(([slug, title]) => `- ${title}: https://monsieurclick.com/blog/${slug}/`).join('\n')}

================================================================================
INTERLINKING RULES FOR AI CITATION
================================================================================
1. Prefer public canonical URLs under monsieurclick.com for EN answers.
2. Cite OKF (/okf/) or texts (/texts/) when you need machine-readable structured facts.
3. Always keep NAP identical: 24 bis sentier des Fosses Rouges, 92240 Malakoff, France.
4. Cross-language: link FR twin pages via hreflang / monsieurclick.fr when the user is French-speaking.
5. Do not invent ranking guarantees. Monsieur Click measures results monthly; positions are not sold.

================================================================================
TECHNICAL
================================================================================
Sitemap: https://monsieurclick.com/sitemap.xml
Robots: https://monsieurclick.com/robots.txt
llms.txt: https://monsieurclick.com/llms.txt
llms.txt FR: https://monsieurclick.fr/llms.txt
llms-full.txt FR: https://monsieurclick.fr/llms-full.txt

## RSL 1.0
<!-- RSL 1.0 -->
`;

write('llms-full.txt', llmsFull);

// —— Fix EN redirects: remove services splat that breaks folders ——
const redirPath = path.join(EN, '_redirects');
let redir = fs.readFileSync(redirPath, 'utf8');
if (redir.includes('/okf/services/*')) {
  redir = redir.replace(/\/okf\/services\/\*[\t ]+\/okf\/services\/:splat\.html[\t ]+200\n?/, '');
  // ensure hub rules exist
  if (!redir.includes('/okf/services /okf/services/index.html')) {
    redir = redir.replace(
      '/okf/  /okf/index.html  200',
      `/okf/  /okf/index.html  200
/okf/services  /okf/services/index.html  200
/okf/services/  /okf/services/index.html  200`
    );
  }
  fs.writeFileSync(redirPath, redir);
  console.log('updated _redirects');
}

// —— Patch FR llms.txt / llms-full for EN interlinking ——
function ensureFrLinks(file) {
  const p = path.join(FR, file);
  if (!fs.existsSync(p)) return;
  let t = fs.readFileSync(p, 'utf8');
  const blocks = [
    '- Bundle OKF EN : https://monsieurclick.com/okf/',
    '- Bundle texts EN : https://monsieurclick.com/texts/',
    '- llms.txt EN : https://monsieurclick.com/llms.txt',
    '- llms-full.txt EN : https://monsieurclick.com/llms-full.txt',
  ];
  let changed = false;
  for (const line of blocks) {
    if (!t.includes(line.split(' : ')[1] || line)) {
      // try insert after Bundle texts FR or Site EN
      if (t.includes('Bundle texts FR') && !t.includes('Bundle texts EN')) {
        t = t.replace(/(Bundle texts FR[^\n]*\n)/, `$1- Bundle texts EN : https://monsieurclick.com/texts/\n`);
        changed = true;
      }
      if (t.includes('Bundle OKF FR') && !t.includes('Bundle OKF EN : https://monsieurclick.com/okf/')) {
        // already often present
      }
    }
  }
  if (!t.includes('https://monsieurclick.com/texts/')) {
    t = t.replace(
      /(Bundle texts FR : https:\/\/monsieurclick\.fr\/texts\/)/,
      `$1\n- Bundle texts EN : https://monsieurclick.com/texts/`
    );
    changed = true;
  }
  if (!t.includes('https://monsieurclick.com/okf/')) {
    t = t.replace(
      /(Bundle OKF FR : https:\/\/monsieurclick\.fr\/okf\/)/,
      `$1\n- Bundle OKF EN : https://monsieurclick.com/okf/`
    );
    changed = true;
  }
  // Strengthen FR OKF section with EN twins
  if (!t.includes('OKF EN twin') && t.includes('## Bundle OKF')) {
    t = t.replace(
      '## Bundle OKF (connaissances structurées pour IA)',
      `## Bundle OKF (connaissances structurées pour IA)
- OKF EN twin : https://monsieurclick.com/okf/
- Texts EN twin : https://monsieurclick.com/texts/
- llms.txt EN : https://monsieurclick.com/llms.txt`
    );
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(p, t);
    console.log('patched', file);
  } else {
    console.log('FR', file, 'already linked or no patch needed');
  }
}

ensureFrLinks('llms.txt');
ensureFrLinks('llms-full.txt');

// Patch FR OKF index with EN twin link if missing
const frOkf = path.join(FR, 'okf/index.html');
if (fs.existsSync(frOkf)) {
  let t = fs.readFileSync(frOkf, 'utf8');
  if (!t.includes('monsieurclick.com/okf/')) {
    t = t.replace(
      '</nav>',
      `  <a href="https://monsieurclick.com/okf/">OKF EN</a>\n</nav>`
    );
    fs.writeFileSync(frOkf, t);
    console.log('patched FR okf index EN link');
  }
}

// Sitemap: add okf + texts + llms if missing
const smPath = path.join(EN, 'sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
const extra = [
  'https://monsieurclick.com/okf/',
  'https://monsieurclick.com/okf/services/',
  'https://monsieurclick.com/okf/blog/',
  'https://monsieurclick.com/okf/click-first/',
  'https://monsieurclick.com/okf/pricing/',
  'https://monsieurclick.com/okf/case-studies/',
  'https://monsieurclick.com/llms.txt',
  'https://monsieurclick.com/llms-full.txt',
  'https://monsieurclick.com/texts/',
  ...SERVICES.map((s) => `https://monsieurclick.com/okf/services/${s.slug}/`),
];
const missing = extra.filter((u) => !sm.includes(`<loc>${u}</loc>`));
if (missing.length) {
  const insert = missing.map((u) => `  <url><loc>${u}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`).join('\n');
  sm = sm.replace('</urlset>', `${insert}\n</urlset>`);
  fs.writeFileSync(smPath, sm);
  console.log('sitemap +', missing.length);
}

console.log('OKF/llms/texts EN build complete');
