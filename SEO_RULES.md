# SEO_RULES.md

Objectif : site « top SEO » + GEO (citation-ready pour Google, Google Maps, ChatGPT, Gemini, Perplexity, Claude).

## Schéma JSON-LD, 2 niveaux (règle du client)
1. **Site-level** (identique sur toutes les pages) : `@graph` avec
   - `Organization` + `ProfessionalService` `@id=#org` : name, alternateName (Créateur de Click First™), url, logo, image, email, telephone `+33660761523`, priceRange €€, foundingDate, knowsLanguage [fr,en], founder (Jean-Pierre Baguette), address (NAP), areaServed (FR, BE, CH, CA, US, UK), sameAs (LinkedIn, X, Instagram, Facebook), aggregateRating 5 / 15 avis.
   - `WebSite` `@id=#website` (publisher → #org).
2. **Page-level** (spécifique, à adapter par page) :
   - Accueil : `FAQPage`.
   - click-first.html : `Service` (Click First™) + `BreadcrumbList` + `FAQPage`.
   - offres.html : `OfferCatalog` (3 offres).
   - realisations.html : `BreadcrumbList`.
   - a-propos.html : `AboutPage`.
   - contact.html : `ContactPage`.
   - Ajouter `BreadcrumbList` sur les pages internes manquantes.

## On-page / technique
- `<title>` orienté marque + mots-clés. `<meta description>` unique par page.
- `canonical` + `hreflang` fr/en/x-default sur chaque page.
- OG + Twitter cards.
- Montserrat préchargé, images WebP, mobile-first, Core Web Vitals au vert.
- `sitemap.xml` + `robots.txt` (autorise GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended). `llms.txt` résume entité + pages + offres.
- `methode.html` → redirection vers `click-first.html` (URL de marque).

## NAP (facteur SEO local, cohérence stricte)
Monsieur Click · 24 bis sentier des Fosses Rouges, 92240 Malakoff, France · +33 6 60 76 15 23 · contact@monsieurclick.com. **Identique partout** (site, fiche Google, annuaires).

## GEO (visibilité IA)
Contenus clairs et citables (Q/R, listes, définitions), entités nommées cohérentes, Schema + OKF/llms.txt, robots IA autorisés, ton factuel + preuves chiffrées.

## Contenu
- ~1200 mots sur les pages piliers, entités + triples entités + mots saillants (voir COPYWRITING.md).
- FAQ style PAA avec `FAQPage`.
- Maillage interne : accueil ↔ offres ↔ réalisations ↔ click-first, ancres descriptives (fait). Étendre à la Méthode et l'À propos ensuite.

## Suivi / analytics
- Meta Pixel `852496749984370` posé sur toutes les pages.
- À coller (IDs de compte requis, non récupérables au crawl) : bandeau cookies (cookie-banner.ca), Sitebehaviour, Happierleads, NYTSYS, GA4/GTM éventuel. Emplacement : bloc commenté dans le `<head>` de chaque page.
