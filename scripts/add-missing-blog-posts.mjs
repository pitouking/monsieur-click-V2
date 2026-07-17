#!/usr/bin/env node
/**
 * Add the 3 EN blog posts missing vs FR, update hub + sitemap + FR hreflang.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EN = join(__dirname, '..');
const FR = join(EN, '..', 'monsieur-click-V2');

const CHROME_ORG = `{"@context":"https://schema.org","@graph":[
{"@type":["Organization","ProfessionalService"],"@id":"https://monsieurclick.com/#org","name":"Monsieur Click","alternateName":"Creator of Click First\\u2122","url":"https://monsieurclick.com/","logo":"https://monsieurclick.com/logo-mc.webp","image":"https://monsieurclick.com/hero-mc-paris.webp","email":"contact@monsieurclick.com","telephone":"+33660761523","priceRange":"\\u20ac\\u20ac","foundingDate":"2023","knowsLanguage":["fr","en"],"founder":{"@type":"Person","name":"Jean-Pierre Baguette"},"address":{"@type":"PostalAddress","streetAddress":"24 bis sentier des Fosses Rouges","postalCode":"92240","addressLocality":"Malakoff","addressRegion":"\\u00cele-de-France","addressCountry":"FR"},"areaServed":[{"@type":"Country","name":"France"},{"@type":"Country","name":"Belgium"},{"@type":"Country","name":"Switzerland"},{"@type":"Country","name":"Canada"},{"@type":"Country","name":"United States"},{"@type":"Country","name":"United Kingdom"}],"sameAs":["https://www.linkedin.com/company/monsieur-click/","https://twitter.com/monsieurclick","https://www.instagram.com/monsieurclick/","https://facebook.com/monsieurclick"]},
{"@type":"WebSite","@id":"https://monsieurclick.com/#website","url":"https://monsieurclick.com/","name":"Monsieur Click","inLanguage":"en-US","publisher":{"@id":"https://monsieurclick.com/#org"}}
]}`;

const FOOTER = `<footer>
  <div class="wrap-wide">
    <div class="foot-grid">
      <div>
        <a href="/" class="logo" style="margin-bottom:14px"><img class="mk" src="/logo-mc.webp" alt="Monsieur Click" width="48" height="48"> Monsieur <b>Click</b></a>
        <p>Creator of Click First&trade;, the method that makes your business easy to find, easy to recommend and easy to choose, on Google as well as in AI. French and English-speaking markets.</p>
      </div>
      <div>
        <h4>Contact</h4>
        <p>24 bis sentier des Fosses Rouges<br>92240 Malakoff, France</p>
        <p>French &amp; English, remote everywhere</p>
        <a href="mailto:contact@monsieurclick.com">contact@monsieurclick.com</a>
        <a href="tel:+33660761523">+33 6 60 76 15 23</a>
      </div>
      <div>
        <h4>Navigation</h4>
        <a href="/click-first">Click First&trade;</a>
        <a href="/services/">Services</a>
        <a href="/case-studies/">Case studies</a>
        <a href="/pricing">Pricing</a>
        <a href="/about">About</a>
        <a href="/blog">Blog</a>
        <a href="/contact">Free audit</a>
      </div>
    </div>
    <div class="foot-bottom">&copy; 2026 Monsieur Click &middot; Creator of Click First&trade; &middot;
      <a href="/legal-notice">Legal notice</a> &middot; <a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a></div>
  </div>
</footer>
<script defer src="/perf.js?v=20260716en"></script>
<script src="/shared.js"></script>
</body>
</html>`;

const NAV = `<nav id="nav" class="site-header__nav" aria-label="Main navigation">
  <div class="wrap-wide nav-inner">
    <a href="/" class="logo"><img class="mk" src="/logo-mc.webp" alt="Monsieur Click" width="48" height="48"> Monsieur <b>Click</b></a>
    <div class="nav-links" id="navLinks">
      <a href="/click-first" class="link">Click First&trade;</a>
      <a href="/services/" class="link">Services</a>
      <a href="/case-studies/" class="link">Case studies</a>
      <a href="/pricing" class="link">Pricing</a>
      <a href="/about" class="link">About</a>
      <a href="/blog" class="link">Blog</a>
      <a href="/contact" class="btn btn-primary">Free diagnostic</a>
      <div class="lang" role="group" aria-label="Site language"><a href="https://monsieurclick.fr" hreflang="fr">FR</a><a href="https://monsieurclick.com" class="on" hreflang="en" aria-current="true">EN</a></div>
    </div>
    <button class="menu-toggle" id="menuToggle" aria-label="Open menu">&#9776;</button>
  </div>
</nav>`;

const TAKE = `<div class="cbox cbox-take"><div class="cbox-ic"><svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg></div><div><h4>In one sentence</h4><p>TAKEAWAY</p></div></div>`;

function page({ slug, frPath, title, description, ogTitle, ogDescription, section, sectionLabel, h1, tldr, image, headline, faqJson, body, related, date = '2026-07-16' }) {
  const url = `https://monsieurclick.com/${slug}`;
  const frUrl = `https://monsieurclick.fr${frPath}`;
  const faqHtml = faqJson.map(f =>
    `      <div class="faq-item"><button class="faq-q">${f.q}<span class="chev">+</span></button>
        <div class="faq-a"><p>${f.a}</p></div></div>`
  ).join('\n');
  const faqLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqJson.map(f => ({
      '@type': 'Question',
      name: f.q.replace(/&#x27;/g, "'"),
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/&#x27;/g, "'").replace(/&amp;/g, '&') }
    }))
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/webp" href="/logo-mc.webp">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="fr" href="${frUrl}">
<link rel="alternate" hreflang="x-default" href="${frUrl}">
<meta property="og:type" content="article">
<meta property="og:title" content="${ogTitle}">
<meta property="og:description" content="${ogDescription}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="https://monsieurclick.com/${image}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/css/main.css?v=20260717hero2">
<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
<link rel="dns-prefetch" href="https://connect.facebook.net">
<link rel="dns-prefetch" href="https://link.monsieurclick.com">
<link rel="dns-prefetch" href="https://www.cookie-banner.ca">
<script type="application/ld+json">
${CHROME_ORG}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","mainEntityOfPage":{"@type":"WebPage","@id":"${url}"},"headline":${JSON.stringify(headline)},"description":${JSON.stringify(ogDescription)},"image":"https://monsieurclick.com/${image}","author":{"@type":"Organization","name":"Monsieur Click"},"publisher":{"@type":"Organization","name":"Monsieur Click","logo":{"@type":"ImageObject","url":"https://monsieurclick.com/logo-mc.webp"}},"datePublished":"${date}","dateModified":"${date}","articleSection":"${sectionLabel}","inLanguage":"en-US"}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://monsieurclick.com/"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://monsieurclick.com/blog"},{"@type":"ListItem","position":3,"name":${JSON.stringify(headline)},"item":"${url}"}]}
</script>
<script type="application/ld+json">
${faqLd}
</script>
</head>
<body>

${NAV}

<header class="pagehero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Home</a> &middot; <a href="/blog">Blog</a> &middot; ${sectionLabel}</div>
    <span class="eyebrow">Article &middot; ${sectionLabel}</span>
    <h1>${h1}</h1>
    <p class="sub"><strong>TL;DR</strong> &ndash; ${tldr}</p>
  </div>
</header>

<section class="artsec">
  <div class="wrap">
    <figure class="artfig reveal"><img loading="lazy" decoding="async" src="/${image}" alt="${h1}"></figure>
    <div class="prose reveal">
${body}
    </div>
  </div>
</section>

<section style="padding-top:0" id="faq">
  <div class="wrap" style="max-width:820px">
    <div class="shead center reveal">
      <div class="kick"><span class="no">&middot;</span><span class="eyebrow">Frequently asked questions</span></div>
      <h2>Still unsure?</h2>
    </div>
    <div class="reveal">
${faqHtml}
    </div>
  </div>
</section>

<section class="related" style="padding-top:0">
  <div class="wrap">
    <div class="shead reveal">
      <div class="kick"><span class="no">&middot;</span><span class="eyebrow">Read next</span></div>
      <h2>Keep going on the same topic</h2>
    </div>
    <div class="blog-grid reveal">
${related}
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="ctaband reveal">
      <h2>Ready to build a real visibility system?</h2>
      <p>Get a free audit of your online presence: website, Google Business Profile, reviews and AI visibility. Want an instant snapshot first? <a href="/click-first#score" style="color:#fff;text-decoration:underline">Calculate your Click First™ Score</a> for free.</p>
      <a href="/contact" class="btn">Get my free audit</a>
    </div>
  </div>
</section>

${FOOTER}`;
}

const posts = [
  {
    slug: 'blog-what-is-an-seo-agency',
    frPath: '/blog/c-est-quoi-une-agence-seo',
    frSvg: 'img-blog-c-est-quoi-une-agence-seo.svg',
    image: 'img-blog-what-is-an-seo-agency.svg',
    title: 'What Is an SEO Agency? Role &amp; What They Actually Do',
    description: 'What is an SEO agency? Clear definition, day-to-day work, difference vs a web agency, and when a small business should hire one. Free diagnostic.',
    ogTitle: 'What is an SEO agency? | Monsieur Click',
    ogDescription: 'Plain-English definition: what an SEO agency does, what it does not, and how it helps a small business get found and chosen.',
    section: 'seo',
    sectionLabel: 'SEO',
    h1: 'What is an SEO agency?',
    headline: 'What is an SEO agency?',
    tldr: 'An <strong>SEO agency</strong> helps your business get found, understood and chosen in search engines (and increasingly in AI answers). It is not paid ads: it builds a lasting visibility asset.',
    cardTitle: 'What is an SEO agency?',
    cardExc: 'Role, missions and what it does not do.',
    cardCat: 'SEO',
    faqJson: [
      { q: 'SEO agency vs web agency: what&#x27;s the difference?', a: 'A web agency mainly builds the site. An SEO agency works on the visibility and relevance of that site (and your local presence) in search results. Ideally both work together.' },
      { q: 'Does an SEO agency guarantee first place?', a: 'No. A serious agency commits to a method, actions and metrics, not a magic ranking.' },
      { q: 'How long before the first results?', a: 'It depends on your market and starting point. SEO is a medium- and long-term lever, not an instant switch.' },
      { q: 'Is local SEO part of the job?', a: 'Yes, for any nearby business. Google Business Profile, reviews, NAP consistency and local pages sit at the core of the work.' },
      { q: 'Is Monsieur Click an SEO agency?', a: 'Yes. We combine SEO, web design and the Click First™ method so visibility turns into real inquiries.' }
    ],
    takeaway: 'A real SEO agency does not sell a ranking: it builds a visibility system that works for you month after month.',
    body: `
<p><strong>What is an SEO agency</strong>? In one sentence: a partner that improves your ability to be found, understood and chosen in search engines.</p>
<p class="money-link">See how we deliver it: <a href="/services/seo">SEO services</a>.</p>

<p>SEO means Search Engine Optimization. Unlike Google Ads, you are not paying for every click. You invest in signals that Google (and AI engines) can read, verify and reward over time.</p>

<h2>What an SEO agency does day to day</h2>
<p>The work usually spans several complementary levers:</p>
<ul>
<li><strong>Technical</strong>: speed, indexing, structure, structured data (schema), mobile.</li>
<li><strong>Content</strong>: service pages, articles, answers to the real questions your buyers ask.</li>
<li><strong>Local</strong>: Google Business Profile, reviews, NAP consistency, local pages.</li>
<li><strong>Trust &amp; authority</strong>: proof, citations, brand consistency, E-E-A-T signals.</li>
<li><strong>Measurement</strong>: useful rankings, qualified traffic and inquiries generated.</li>
</ul>

<h2>What an SEO agency is not</h2>
<p>It is not an advertising agency (even if it can advise on Ads vs SEO trade-offs). It is not a &ldquo;keyword magician&rdquo; who puts you in position one in two weeks. And it is not a vendor who disappears after delivering an 80-page PDF with no action.</p>

<h2>SEO agency vs SEO consultant</h2>
<p>A consultant is often a single point of contact, agile, a fit for small businesses. A large agency may have more process, but also more distance. The label matters less than the method, transparency and alignment with your business goals. Start with our <a href="/small-business-seo">small business SEO</a> approach if you want practical local outcomes.</p>

<h2>Why SEO is no longer only about Google</h2>
<p>More prospects ask ChatGPT, Gemini or Perplexity for a recommendation before they even open Google. A modern SEO partner also prepares you for those engines (GEO): clear content, citable facts, consistent entities. See also our <a href="/services/generative-engine-optimization">Generative Engine Optimization</a> service.</p>

<h2>When to hire an SEO agency</h2>
<p>You are a fit if:</p>
<ul>
<li>competitors show up before you on Google Maps or in organic results;</li>
<li>your site gets few inquiries despite a polished design;</li>
<li>you rely too heavily on ads to fill the calendar;</li>
<li>you want a lasting system instead of a one-off campaign.</li>
</ul>

${TAKE.replace('TAKEAWAY', 'A real SEO agency does not sell a ranking: it builds a visibility system that works for you month after month.')}
<p>Next: <a href="/blog-how-to-choose-an-seo-agency">how to choose an SEO agency</a>. For budgets: <a href="/blog-seo-agency-pricing-2026">SEO agency pricing in 2026</a>.</p>
`,
    related: `<a class="bcard reveal" href="/blog-how-google-ranks-businesses">
        <span class="bimg"><img loading="lazy" decoding="async" src="/img-blog-how-google-ranks-businesses.svg" alt="How Google ranks businesses"></span>
        <span class="bbody"><span class="cat">SEO</span><span class="bh3">How Google ranks businesses</span><span class="bexc">The 5 criteria that decide ranking.</span></span></a>
<a class="bcard reveal" href="/blog-seo-agency-pricing-2026">
        <span class="bimg"><img loading="lazy" decoding="async" src="/img-blog-seo-agency-pricing-2026.svg" alt="SEO agency pricing"></span>
        <span class="bbody"><span class="cat">Strategy</span><span class="bh3">SEO agency pricing in 2026</span><span class="bexc">Ranges and what justifies the price.</span></span></a>
<a class="bcard reveal" href="/blog-how-to-choose-an-seo-agency">
        <span class="bimg"><img loading="lazy" decoding="async" src="/img-blog-how-to-choose-an-seo-agency.svg" alt="How to choose an SEO agency"></span>
        <span class="bbody"><span class="cat">SEO</span><span class="bh3">How to choose an SEO agency</span><span class="bexc">Concrete criteria to avoid bad surprises.</span></span></a>`
  },
  {
    slug: 'blog-how-to-choose-an-seo-agency',
    frPath: '/blog/comment-choisir-agence-seo-paris',
    frSvg: 'img-blog-comment-choisir-agence-seo-paris.svg',
    image: 'img-blog-how-to-choose-an-seo-agency.svg',
    title: 'How to Choose an SEO Agency: 8 Criteria That Matter',
    description: 'How to choose an SEO agency for a small business? 8 concrete criteria, questions to ask, red flags. Local SEO, proof, no ranking guarantees. Free diagnostic.',
    ogTitle: 'How to choose an SEO agency | Monsieur Click',
    ogDescription: 'Criteria to pick an SEO partner without getting burned: method, local SEO, reporting, proof. A practical guide for small businesses.',
    section: 'seo',
    sectionLabel: 'SEO',
    h1: 'How to choose an SEO agency',
    headline: 'How to choose an SEO agency',
    tldr: 'Competition is real. Choose a partner that talks business results, masters <strong>local SEO</strong>, shows proof, and refuses ranking guarantees. A clear diagnostic beats a sales pitch.',
    cardTitle: 'How to choose an SEO agency',
    cardExc: 'Concrete criteria to avoid bad surprises.',
    cardCat: 'SEO',
    faqJson: [
      { q: 'Do I need an agency based in my city?', a: 'Helpful for market knowledge, not mandatory. Proximity helps; method and reporting matter more. Monsieur Click works remotely for US and UK small businesses.' },
      { q: 'What questions should I ask before signing?', a: 'Who does the work? Which KPIs? What happens at 3 and 6 months? Is local (Maps, reviews) included? Who owns Search Console and GBP access?' },
      { q: 'How do I spot a bad SEO agency?', a: 'Guarantees of position 1, opaque contracts, unreadable reporting, content with no strategy, and no local work for a nearby business.' },
      { q: 'Should I target every city at once?', a: 'Usually not. Better to own a realistic set of queries and areas than dilute the budget across too many locations.' },
      { q: 'Where should I start?', a: 'With a diagnostic of your site, Google Business Profile and competitors. Only then a plan and a price.' }
    ],
    body: `
<p>Choosing an <strong>SEO agency</strong> is not picking the flashiest pitch. It is selecting a partner who can handle dense competition, local search intent, and a buyer journey that now also runs through Maps and AI answers.</p>
<p class="money-link">See our <a href="/services/seo">SEO services</a> and <a href="/ai-seo-agency">AI SEO agency</a> positioning.</p>

<h2>1. They talk inquiries, not just rankings</h2>
<p>A ranking with no calls or forms does not pay the bills. Ask which metrics they track: calls, forms, Maps directions, qualified leads. Rankings remain useful; they are not the end goal.</p>

<h2>2. They master local SEO, not only &ldquo;national&rdquo; SEO</h2>
<p>For most small businesses, many searches are local. A credible agency works Google Business Profile, reviews, NAP consistency and local service pages. Otherwise you compete with one hand tied.</p>

<h2>3. They explain the method in plain English</h2>
<p>If you cannot understand the plan in five minutes, that is a red flag. A good method looks like: diagnostic, priorities, actions, measurement, iteration. We formalize that in <a href="/click-first">Click First™</a>.</p>

<h2>4. They show proof, without theater</h2>
<p>Ask for cases close to your reality (small local businesses). Browse our <a href="/case-studies/">case studies</a>. Be wary of miracle ranking screenshots with no context.</p>

<h2>5. They refuse #1 ranking guarantees</h2>
<p>Google changes. Competitors move. A guaranteed place is a sales argument, not professional practice. Demand a work and transparency commitment instead.</p>

<h2>6. You keep ownership of your assets</h2>
<p>Search Console, Analytics, Google Business Profile, domain, content: everything should stay yours. An agency that locks access creates a unhealthy dependency.</p>

<h2>7. Reporting is readable</h2>
<p>A good report answers three questions: what did we do, what moved, what is next? Not a novel of charts.</p>

<h2>8. The price matches the scope</h2>
<p>Compare what is in the quote, not only the number. See <a href="/blog-seo-agency-pricing-2026">SEO agency pricing in 2026</a> and our <a href="/pricing">pricing</a>.</p>

<h2>Questions to ask in the interview</h2>
<ul>
<li>Who actually does the work (and how many accounts do they handle)?</li>
<li>What happens in the first 30, 90 and 180 days?</li>
<li>How do you treat Google Maps and reviews?</li>
<li>How do you integrate AI visibility (GEO)?</li>
<li>What happens if I end the contract?</li>
</ul>

${TAKE.replace('TAKEAWAY', 'The right SEO agency diagnoses before it sells, measures inquiries, and builds a coherent local system.')}
<p>For the definition: <a href="/blog-what-is-an-seo-agency">what is an SEO agency?</a> For the method: <a href="/click-first">Click First™</a>.</p>
`,
    related: `<a class="bcard reveal" href="/blog-why-competitors-rank-ahead">
        <span class="bimg"><img loading="lazy" decoding="async" src="/img-blog-why-competitors-rank-ahead.svg" alt="Why competitors rank ahead"></span>
        <span class="bbody"><span class="cat">SEO</span><span class="bh3">Why your competitors get ahead</span><span class="bexc">They send Google more trust signals.</span></span></a>
<a class="bcard reveal" href="/blog-what-is-an-seo-agency">
        <span class="bimg"><img loading="lazy" decoding="async" src="/img-blog-what-is-an-seo-agency.svg" alt="What is an SEO agency"></span>
        <span class="bbody"><span class="cat">SEO</span><span class="bh3">What is an SEO agency?</span><span class="bexc">Role and missions, without jargon.</span></span></a>
<a class="bcard reveal" href="/blog-seo-agency-pricing-2026">
        <span class="bimg"><img loading="lazy" decoding="async" src="/img-blog-seo-agency-pricing-2026.svg" alt="SEO pricing"></span>
        <span class="bbody"><span class="cat">Strategy</span><span class="bh3">SEO agency pricing in 2026</span><span class="bexc">Read a quote without getting misled.</span></span></a>`
  },
  {
    slug: 'blog-seo-agency-pricing-2026',
    frPath: '/blog/prix-tarif-agence-seo-2026',
    frSvg: 'img-blog-prix-tarif-agence-seo-2026.svg',
    image: 'img-blog-seo-agency-pricing-2026.svg',
    title: 'SEO Agency Pricing 2026: Costs, Ranges &amp; What&#x27;s Included',
    description: 'How much does an SEO agency cost in 2026? Realistic ranges, what should be included, and Click First™ plans from €850/mo. Free diagnostic.',
    ogTitle: 'SEO agency pricing 2026 | Monsieur Click',
    ogDescription: 'Realistic SEO price ranges for small businesses, what justifies the fee, and how to read a quote without surprises.',
    section: 'strategie',
    sectionLabel: 'Strategy',
    h1: 'SEO agency pricing in 2026',
    headline: 'SEO agency pricing in 2026',
    tldr: 'SEO pricing depends on competition, area and scope (site, local SEO, reviews, content). At Monsieur Click, Click First™ plans start at <strong>€850/month</strong> all-inclusive. Final price is set after a free diagnostic.',
    cardTitle: 'SEO agency pricing in 2026',
    cardExc: 'Realistic ranges, what is included, Click First™ plans.',
    cardCat: 'Strategy',
    faqJson: [
      { q: 'What is the average SEO agency price in 2026?', a: 'There is no single price. For a local small business, serious retainers usually sit in a monthly range, while one-off projects are scoped by complexity. At Monsieur Click, plans start at €850/month.' },
      { q: 'Why do SEO prices vary so much?', a: 'Because competition, number of cities and services, site condition and ambition (Maps, organic, AI) completely change the workload.' },
      { q: 'Should I pay monthly or per project?', a: 'Lasting SEO needs continuity. A one-off project can fix foundations; a retainer funds the optimization, content and follow-up that keep results alive.' },
      { q: 'What does Click First™ pricing include?', a: 'Website (depending on plan), SEO, Google Business Profile, AI visibility and monthly optimization. No stacked packages. Details on the pricing page.' },
      { q: 'Is the diagnostic paid?', a: 'No. The diagnostic is free and no-obligation. It is how we cost a realistic plan before any invoice.' }
    ],
    body: `
<p>The question never goes away: <strong>how much does an SEO agency cost</strong>? In 2026, the honest answer starts with another question: what exactly do you want, and in which market?</p>
<p class="money-link">See our transparent ranges: <a href="/pricing">Click First™ pricing</a>.</p>

<p>An SEO quote is not a catalog price. Two businesses in the same industry can need very different work depending on local competition, how many cities you target, and the current state of the site and Google Business Profile.</p>

<h2>What really moves SEO agency pricing</h2>
<p>Four factors weigh more than the rest:</p>
<ul>
<li><strong>Competition</strong>: a saturated city market needs more work than a quiet local niche.</li>
<li><strong>Scope</strong>: technical SEO alone, or a full ecosystem (site, Maps, reviews, content, structured data, AI visibility).</li>
<li><strong>Starting point</strong>: slow site, missing pages, inconsistent NAP, incomplete Google listing… all of that increases correction volume.</li>
<li><strong>Duration</strong>: rankings are built over time. One month of &ldquo;optimization&rdquo; does not create the same asset as ongoing support.</li>
</ul>

<h2>Realistic 2026 ranges for small businesses</h2>
<p>Without inventing a magical national average, here is how to read the market:</p>
<div class="ptable-wrap"><table class="ptable"><thead><tr><th>Offer type</th><th>What it usually covers</th><th>Signal</th></tr></thead><tbody>
<tr><td>One-off project</td><td>Audit, technical fixes, a few pages</td><td>Project quote</td></tr>
<tr><td>Light monthly retainer</td><td>Limited follow-up, little production</td><td>Often cheapest… and least durable</td></tr>
<tr><td>Full system (recommended)</td><td>Site + SEO + GBP + content + follow-up</td><td>Structured monthly investment</td></tr>
</tbody></table></div>
<p>At Monsieur Click, Click First™ plans are published clearly:</p>
<ul>
<li><strong>Essential</strong>: €850/month (6-month commitment)</li>
<li><strong>Growth</strong>: €1,000/month (12 months)</li>
<li><strong>Expansion</strong>: €1,500/month (12 months)</li>
</ul>
<p>A full project, site and system included, usually lands between <strong>€2,000 and €20,000</strong> depending on scale, priced after diagnostic. After the setup phase, you can continue with SEO optimization at a lower rate, or move to hosting and maintenance at <strong>€59/month</strong>.</p>

<h2>What should be included (or walk away)</h2>
<p>A serious SEO fee is not &ldquo;a few keywords.&rdquo; Check for:</p>
<ul>
<li>an initial diagnostic and measurable priorities;</li>
<li>concrete technical and content actions;</li>
<li>local work (Google Business Profile, reviews, NAP) if you serve a geography;</li>
<li>readable reporting, without useless jargon.</li>
</ul>
<p>If the quote promises a &ldquo;guaranteed #1 ranking,&rdquo; change interlocutor. No serious professional can guarantee a fixed place on Google.</p>

<h2>How to compare two quotes without getting fooled</h2>
<p>Do not compare monthly price alone. Compare <em>scope</em>:</p>
<ul>
<li>How many pages / cities / services are covered?</li>
<li>Who produces content? Who manages the Google listing?</li>
<li>What happens if you stop after 3 months?</li>
<li>Is the website included, or billed separately?</li>
</ul>
<p>A cheaper quote that ignores Maps, reviews and conversion often costs more: you pay for an isolated lever that does not convert.</p>

<h2>Why we publish prices</h2>
<p>Because a small business does not have time for mystery theater. You can open <a href="/pricing">Pricing</a>, see what is included, then request a free diagnostic so we scale the plan to your real competition.</p>
${TAKE.replace('TAKEAWAY', 'The right SEO price is not the lowest: it is the one that funds a coherent, measurable system adapted to your market.')}
<p>Budget trade-offs: <a href="/blog-google-ads-vs-seo">Google Ads vs SEO</a>. Definition: <a href="/blog-what-is-an-seo-agency">what is an SEO agency?</a></p>
`,
    related: `<a class="bcard reveal" href="/blog-google-ads-vs-seo">
        <span class="bimg"><img loading="lazy" decoding="async" src="/img-blog-google-ads-vs-seo.svg" alt="Google Ads vs SEO"></span>
        <span class="bbody"><span class="cat">Strategy</span><span class="bh3">Google Ads or SEO: where to invest?</span><span class="bexc">Two levers, two logics. Where to place your budget.</span></span></a>
<a class="bcard reveal" href="/blog-what-is-an-seo-agency">
        <span class="bimg"><img loading="lazy" decoding="async" src="/img-blog-what-is-an-seo-agency.svg" alt="What is an SEO agency"></span>
        <span class="bbody"><span class="cat">SEO</span><span class="bh3">What is an SEO agency?</span><span class="bexc">Role, missions and what it does not do.</span></span></a>
<a class="bcard reveal" href="/blog-how-to-choose-an-seo-agency">
        <span class="bimg"><img loading="lazy" decoding="async" src="/img-blog-how-to-choose-an-seo-agency.svg" alt="How to choose an SEO agency"></span>
        <span class="bbody"><span class="cat">SEO</span><span class="bh3">How to choose an SEO agency</span><span class="bexc">Concrete criteria to avoid bad surprises.</span></span></a>`
  }
];

for (const p of posts) {
  const src = join(FR, p.frSvg);
  const dest = join(EN, p.image);
  if (existsSync(src)) copyFileSync(src, dest);
  writeFileSync(join(EN, `${p.slug}.html`), page(p));
  console.log('wrote', p.slug);
}

// Update blog.html hub
let hub = readFileSync(join(EN, 'blog.html'), 'utf8');
const cards = posts.map((p, i) => {
  const pos = 16 + i;
  return { pos, p };
});

// Expand ItemList JSON
const listMatch = hub.match(/\{"@context": "https:\/\/schema\.org", "@type": "ItemList", "itemListElement": \[([\s\S]*?)\]\}/);
if (!listMatch) throw new Error('ItemList not found in blog.html');
let items = listMatch[1];
// strip trailing if any
const newItems = posts.map((p, i) =>
  `{"@type": "ListItem", "position": ${16 + i}, "url": "https://monsieurclick.com/${p.slug}", "name": ${JSON.stringify(p.cardTitle)}}`
).join(', ');
const updatedList = `{"@context": "https://schema.org", "@type": "ItemList", "itemListElement": [${items.trim().replace(/,$/, '')}, ${newItems}]}`;
hub = hub.replace(listMatch[0], updatedList);

const cardHtml = posts.map(p => `<a class="bcard reveal" href="/${p.slug}" data-cat="${p.section}" data-title="${p.cardTitle.toLowerCase()} ${p.cardExc.toLowerCase()} ${p.cardCat.toLowerCase()}">
      <span class="bimg"><img loading="lazy" decoding="async" src="/${p.image}" alt="${p.h1}"></span>
      <span class="bbody"><span class="cat">${p.cardCat}</span><span class="bh3">${p.cardTitle}</span><span class="bexc">${p.cardExc}</span><span class="blink">Read the article &rarr;</span></span></a>`).join('\n');

if (!hub.includes('blog-what-is-an-seo-agency')) {
  hub = hub.replace(
    '</div>\n    <p class="noresult"',
    `${cardHtml}\n    </div>\n    <p class="noresult"`
  );
}
writeFileSync(join(EN, 'blog.html'), hub);
console.log('updated blog.html');

// Sitemap: ensure blog hub + all posts
let sm = readFileSync(join(EN, 'sitemap.xml'), 'utf8');
const blogUrls = [
  'https://monsieurclick.com/blog',
  ...[
    'blog-click-first-not-just-seo',
    'blog-geo-generative-engine-optimization',
    'blog-will-ai-replace-google',
    'blog-become-a-reference-business',
    'blog-get-more-google-reviews',
    'blog-is-your-website-losing-clients',
    'blog-why-competitors-rank-ahead',
    'blog-appear-in-chatgpt-gemini-perplexity',
    'blog-clients-ask-chatgpt-before-google',
    'blog-google-ads-vs-seo',
    'blog-get-clients-without-advertising',
    'blog-google-business-profile-no-calls',
    'blog-how-google-ranks-businesses',
    'blog-why-business-not-on-google',
    'blog-is-a-website-enough-2026',
    ...posts.map(p => p.slug)
  ].map(s => `https://monsieurclick.com/${s}`)
];
const missing = blogUrls.filter(u => !sm.includes(`<loc>${u}</loc>`));
if (missing.length) {
  const insert = missing.map(u =>
    `  <url><loc>${u}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
  ).join('\n');
  sm = sm.replace('</urlset>', `${insert}\n</urlset>`);
  writeFileSync(join(EN, 'sitemap.xml'), sm);
  console.log('sitemap +', missing.length);
}

// FR hreflang twins
for (const p of posts) {
  const frFile = join(FR, 'blog', p.frPath.replace('/blog/', ''), 'index.html');
  if (!existsSync(frFile)) {
    console.warn('missing FR', frFile);
    continue;
  }
  let fr = readFileSync(frFile, 'utf8');
  const enUrl = `https://monsieurclick.com/${p.slug}`;
  if (fr.includes(`hreflang="en"`) && fr.includes(enUrl)) {
    console.log('hreflang ok', p.frPath);
    continue;
  }
  // Insert EN alternate after FR alternate
  if (!fr.includes(`hreflang="en"`)) {
    fr = fr.replace(
      /(<link rel="alternate" hreflang="fr" href="[^"]+">)/,
      `$1\n<link rel="alternate" hreflang="en" href="${enUrl}">`
    );
    writeFileSync(frFile, fr);
    console.log('hreflang added', p.frPath);
  }
}

console.log('done');
