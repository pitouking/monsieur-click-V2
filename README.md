# Monsieur Click — Reconstruction du site (spec Claude Code)

Pack de specs pour (re)construire l'écosystème **Monsieur Click** sur deux domaines :

- **monsieurclick.fr** — marché francophone (France, Belgique, Suisse, Canada FR)
- **monsieurclick.com** — marché anglophone (US, UK, Canada EN)

Les deux sont reliés en `hreflang`. Structure miroir, contenu **rédigé nativement** dans chaque langue.

## Objectif business

Passer d'un site plat à **0 mot-clé positionné** à une architecture pilotée par la demande réelle qui cible :

| Marché | Demande adressable/mois |
|---|---|
| Francophone (.fr) | ≈ 59 100 |
| Anglophone (.com) | ≈ 175 700 |
| **Total** | **≈ 235 000** |

Source : DataForSEO Google Ads (FR/BE/CH/US/UK), SERP live, sitemaps concurrents — juillet 2026. Volumes susceptibles de varier, à revérifier à l'exécution.

## Ordre de lecture des fichiers

1. `CLAUDE.md` — conventions & garde-fous pour l'agent (lire en premier)
2. `00-project-brief.md` — contexte, marchés, positionnement
3. `01-architecture-hreflang.md` — arborescence 2 domaines + règles hreflang/URL
4. `02-keyword-map.md` — données de demande complètes + mapping mot-clé → page
5. `03-pages-fr.md` — briefs page par page (.fr)
6. `04-pages-en.md` — briefs page par page (.com)
7. `05-blog-map.md` — maillage blog → page argent + idées d'articles
8. `06-do-not-build.md` — pages à NE PAS créer (et pourquoi)
9. `07-technical-seo-schema.md` — schema JSON-LD, sitemap, hreflang, GEO/llms.txt, Core Web Vitals
10. `08-page-template-storybrand.md` — template section par section réutilisable

## Stack

- CMS cible : WordPress (+ Brizy Cloud) ou statique/custom. Specs stack-agnostiques.
- Hébergement/CDN : Cloudflare (compte « Monsieur Click » disponible).
- Les pages doivent rester en Core Web Vitals verts (déjà le cas : onpage 97–100, CLS 0).

## Séquence de build recommandée

1. Socle **.fr France** : les 5 pages P1 FR (cash court terme).
2. Hubs francophones BE/CH.
3. Lancement **.com** par le long-tail EN (small business seo, GEO, wordpress web design) — **pas** les têtes « seo agency ».
4. Montée en autorité .com → viser les têtes à 12–24 mois.

> Le GEO (Generative Engine Optimization) est le meilleur pari des deux côtés : demande émergente, concurrence quasi nulle, expertise déjà en place.
