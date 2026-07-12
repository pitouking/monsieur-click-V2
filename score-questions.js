// Click First™ Score — question bank (single source of truth: weights + labels)
// Imported client-side (wizard) and server-side (functions/_lib/scoring.js).
// Never duplicate these weights elsewhere: the score must always come from here.
// Ids/weights/modules mirror the FR bank exactly, so scores stay comparable across locales.

export const MODULES = [
  { key: 'site', label: 'Website & Technical', icon: 'monitor' },
  { key: 'seo', label: 'Search Engine Optimization (SEO)', icon: 'search' },
  { key: 'gbp', label: 'Google Business Profile', icon: 'pin' },
  { key: 'ia', label: 'AI Visibility (GEO)', icon: 'spark' },
  { key: 'confiance', label: 'Trust', icon: 'shield' }
];

export const QUESTIONS = [
  { id: 'site-https', module: 'site', weight: 2, text: 'Is your website on HTTPS (secure padlock in the browser) ?' },
  { id: 'site-responsive', module: 'site', weight: 3, text: 'Does your website display perfectly on mobile (responsive) ?' },
  { id: 'site-cwv', module: 'site', weight: 5, text: 'Does your website pass Google\'s Core Web Vitals (speed, stability) ?' },
  { id: 'site-speed', module: 'site', weight: 4, text: 'Does your website load in under 3 seconds ?' },
  { id: 'site-nav', module: 'site', weight: 3, text: 'Is the navigation and page structure clear for a visitor ?' },
  { id: 'site-cta', module: 'site', weight: 4, text: 'Does every page have a clear, visible call to action (CTA) ?' },
  { id: 'site-storybrand', module: 'site', weight: 5, text: 'Can a visitor understand in 5 seconds what you do and who it\'s for ?' },

  { id: 'seo-title', module: 'seo', weight: 5, text: 'Does every page have a unique, optimized Title tag ?' },
  { id: 'seo-meta', module: 'seo', weight: 3, text: 'Does every page have a written meta description ?' },
  { id: 'seo-h1', module: 'seo', weight: 3, text: 'Does every page have a single, clear H1 ?' },
  { id: 'seo-hn', module: 'seo', weight: 2, text: 'Is the heading hierarchy (H2, H3...) consistent ?' },
  { id: 'seo-maillage', module: 'seo', weight: 5, text: 'Are your pages linked to each other with relevant internal links ?' },
  { id: 'seo-pages-services', module: 'seo', weight: 6, text: 'Do you have a dedicated page for each service ?' },
  { id: 'seo-pages-villes', module: 'seo', weight: 7, text: 'Do you have dedicated pages for each city or service area ?' },

  { id: 'gbp-revendiquee', module: 'gbp', weight: 8, text: 'Is your Google Business Profile claimed and verified ?' },
  { id: 'gbp-categorie', module: 'gbp', weight: 6, text: 'Does your primary category precisely describe your business ?' },
  { id: 'gbp-categories-sec', module: 'gbp', weight: 3, text: 'Have you added relevant secondary categories ?' },
  { id: 'gbp-photos', module: 'gbp', weight: 4, text: 'Does your profile have at least 10 recent photos ?' },
  { id: 'gbp-note', module: 'gbp', weight: 6, text: 'Is your average rating 4.5 or higher ?' },
  { id: 'gbp-reponses-avis', module: 'gbp', weight: 5, text: 'Do you systematically reply to reviews (positive and negative) ?' },
  { id: 'gbp-posts', module: 'gbp', weight: 4, text: 'Do you regularly publish posts on your Google profile ?' },

  { id: 'ia-schema', module: 'ia', weight: 8, text: 'Does your site contain Schema.org structured data (Organization/LocalBusiness) ?' },
  { id: 'ia-faq-schema', module: 'ia', weight: 4, text: 'Do your key pages have FAQPage markup ?' },
  { id: 'ia-breadcrumb', module: 'ia', weight: 3, text: 'Do your pages have BreadcrumbList markup ?' },
  { id: 'ia-llms-txt', module: 'ia', weight: 5, text: 'Does your site have an llms.txt file ?' },
  { id: 'ia-robots', module: 'ia', weight: 6, text: 'Does your robots.txt allow AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) ?' },
  { id: 'ia-cite', module: 'ia', weight: 5, text: 'Have you checked whether ChatGPT, Claude, Gemini or Perplexity cite you ?' },
  { id: 'ia-entites', module: 'ia', weight: 4, text: 'Are your name, brand and location written identically everywhere ?' },

  { id: 'confiance-nap', module: 'confiance', weight: 7, text: 'Is your Name, Address and Phone (NAP) identical everywhere (site, Google profile, directories) ?' },
  { id: 'confiance-social', module: 'confiance', weight: 3, text: 'Are your social media profiles active and up to date ?' },
  { id: 'confiance-citations', module: 'confiance', weight: 4, text: 'Is your business listed on relevant local directories ?' },
  { id: 'confiance-rgpd', module: 'confiance', weight: 2, text: 'Do you have a compliant privacy policy ?' },
  { id: 'confiance-tiers', module: 'confiance', weight: 3, text: 'Do you have mentions or reviews on third-party platforms (press, specialized directories) ?' },
  { id: 'confiance-avis-nb', module: 'confiance', weight: 5, text: 'Do you have at least 20 Google reviews in total ?' },
  { id: 'confiance-reactivite', module: 'confiance', weight: 2, text: 'Do you announce and honor a fast response time (under 24h) ?' }
];
