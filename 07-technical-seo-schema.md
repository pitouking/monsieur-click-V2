# 07 — Technique, Schema & GEO

## Schema JSON-LD par type de page

| Type de page | Schemas à poser |
|---|---|
| Accueil | `Organization` + `LocalBusiness` + `WebSite` (avec `SearchAction`) |
| Page service | `Service` (+ `areaServed`) + `BreadcrumbList` + `FAQPage` si FAQ |
| Page ville/pays | `Service` (`areaServed` = ville/pays) + `LocalBusiness` + `BreadcrumbList` |
| Consultant / à propos | `Person` + `ProfessionalService` |
| Article blog | `Article` (+ `author` = Person) + `BreadcrumbList` |
| Offres/tarifs | `Service` + `Offer` (fourchette de prix) |
| Réalisations | `CreativeWork` / `CaseStudy` (via `Article`) |

### LocalBusiness (base NAP — identique partout)
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Monsieur Click",
  "image": "https://monsieurclick.fr/logo-mc.webp",
  "url": "https://monsieurclick.fr",
  "telephone": "",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "24 bis sentier des fosses rouges",
    "addressLocality": "Malakoff",
    "postalCode": "92240",
    "addressCountry": "FR"
  },
  "areaServed": ["Paris","Île-de-France","France","Belgique","Suisse"],
  "founder": {"@type":"Person","name":"Jean-Pierre Baguette"},
  "sameAs": []
}
```
> Renseigner `telephone` et `sameAs` (profils GBP, réseaux) avant publication. NAP **strictement identique** sur site, GBP et citations.

## hreflang

Voir `01-architecture-hreflang.md`. Déclarer toutes les variantes + `x-default`. Contrôler la réciprocité (chaque page pointe vers l'autre et inversement).

## Sitemaps

- `sitemap.xml` par domaine, segmenté si volumineux (pages / blog).
- `lastmod` réel. Exclure les pages OKF thin de l'index (rester crawlables via robots + llms.txt).
- Soumettre les 2 domaines à Google Search Console + Bing Webmaster.

## Core Web Vitals (garder le vert)

- Images WebP/AVIF, `loading=lazy`, dimensions explicites (CLS 0).
- Minimiser le render-blocking CSS/JS. Cloudflare cache + CDN.
- Objectif : onpage ≥ 95, LCP < 2.5 s, CLS < 0.1, INP < 200 ms.

## GEO — visibilité IA (différenciateur)

- **llms.txt** à la racine de chaque domaine (résumé + liens des pages clés pour agents IA).
- **OKF bundle** (AI-readable knowledge) : faits structurés, entity homes cohérentes.
- **Crawlers IA** : autoriser `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` dans `robots.txt`.
- Contenu **citable** : réponses claires, chiffrées, sourcées ; entités nommées cohérentes.
- FAQ structurées (FAQPage) sur chaque page argent → matière aux AI Overviews / réponses IA.

### robots.txt (extrait)
```
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
Sitemap: https://monsieurclick.fr/sitemap.xml
```

## Redirections (301) — migration .fr

Anciennes URL `/blog-xxx` → `/blog/xxx`. Table complète dans `05-blog-map.md`. Vérifier zéro 404, canonical mis à jour, liens internes pointant vers les nouvelles URL.
