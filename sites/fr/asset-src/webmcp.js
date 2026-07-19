/**
 * WebMCP tools for Monsieur Click (navigator.modelContext).
 * Exposes NAP, services hub, contact, and Click First score entrypoints.
 *
 * IMPORTANT: keep the literal `navigator.modelContext.registerTool(` /
 * `navigator.modelContext.provideContext(` call shapes so static scanners
 * (isitagentready) can detect WebMCP without executing JS.
 */
(function () {
  'use strict';
  if (typeof navigator === 'undefined') return;

  var locale = (document.documentElement.lang || 'en').toLowerCase().startsWith('fr')
    ? 'fr'
    : 'en';
  var origin = location.origin;

  var tools = [
    {
      name: 'get_business_profile',
      description:
        locale === 'fr'
          ? 'Retourne le NAP et les contacts Monsieur Click'
          : 'Return Monsieur Click NAP and contact details',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: async function () {
        return {
          name: 'Monsieur Click',
          address: '24 bis sentier des fosses rouges, 92240 Malakoff, France',
          phone: '+33 6 60 76 15 23',
          email: 'contact@monsieurclick.com',
          sites: {
            fr: 'https://monsieurclick.fr/',
            en: 'https://monsieurclick.com/',
          },
          method: 'Click First™',
        };
      },
    },
    {
      name: 'open_free_diagnostic',
      description:
        locale === 'fr'
          ? 'Ouvre la page de diagnostic SEO gratuit'
          : 'Open the free SEO diagnostic page',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: async function () {
        location.assign(origin + '/contact');
        return { ok: true, url: origin + '/contact' };
      },
    },
    {
      name: 'open_click_first_score',
      description:
        locale === 'fr'
          ? 'Ouvre le calculateur Click First™ Score'
          : 'Open the Click First™ Score calculator',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: async function () {
        location.assign(origin + '/click-first#score');
        return { ok: true, url: origin + '/click-first#score' };
      },
    },
    {
      name: 'list_primary_urls',
      description:
        locale === 'fr'
          ? 'Liste les URLs principales (services, offres, blog)'
          : 'List primary URLs (services, pricing, blog)',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: async function () {
        if (locale === 'fr') {
          return {
            home: origin + '/',
            services: origin + '/services/',
            offers: origin + '/offres',
            clickFirst: origin + '/click-first',
            contact: origin + '/contact',
            blog: origin + '/blog/',
            llms: origin + '/llms.txt',
            apiCatalog: origin + '/.well-known/api-catalog',
          };
        }
        return {
          home: origin + '/',
          services: origin + '/services/',
          pricing: origin + '/pricing',
          clickFirst: origin + '/click-first',
          contact: origin + '/contact',
          blog: origin + '/blog/',
          llms: origin + '/llms.txt',
          apiCatalog: origin + '/.well-known/api-catalog',
        };
      },
    },
  ];

  function register() {
    if (!navigator.modelContext) return false;
    var registered = false;
    if (typeof navigator.modelContext.registerTool === 'function') {
      for (var i = 0; i < tools.length; i++) {
        navigator.modelContext.registerTool(tools[i]);
      }
      registered = true;
    }
    if (typeof navigator.modelContext.provideContext === 'function') {
      navigator.modelContext.provideContext({ tools: tools });
      registered = true;
    }
    return registered;
  }

  if (!register()) {
    document.addEventListener(
      'modelcontextprompt',
      function () {
        register();
      },
      { once: true },
    );
  }
})();
