# 01 — Architecture & hreflang

## Principes d'URL

- Services sous `/services/[slug]` (dossier thématique).
- Pages de ville/pays à la **racine** : `/agence-seo-[ville]` (pattern gagnant du secteur, cf. Eskimoz).
- Blog sous `/blog/[slug]` — **301** depuis les anciens `/blog-xxx`.
- Slugs en minuscule, tirets, sans accents, courts, avec le mot-clé.
- Canonical auto-référent sur chaque page.

## Arborescence — monsieurclick.fr (FR)

```
/                                   → agence seo · agence web (30 300)
/services/
  /services/creation-site-web       → création site internet (6 600)
  /services/seo                     → référencement naturel (2 900)
  /services/audit-seo               → audit seo (1 600)
  /services/seo-local               → référencement local (1 600)
  /services/refonte-site-web        → refonte site internet (880)
  /services/creation-site-wordpress → création site wordpress (320)
  /services/google-business-profile → GBP (local pack)
  /services/visibilite-ia-geo       → GEO / visibilité IA (émergent)
/agence-seo-paris                   → agence seo paris + seo paris + réf. paris (4 030)
/agence-web-paris                   → agence web paris (1 900)
/consultant-seo-paris               → consultant seo + consultant seo paris (3 900)
/creation-site-internet-paris       → création site internet paris (720)
/agence-seo-ile-de-france           → agence seo ile-de-france (110)
/agence-seo-belgique                → agence seo BE (480) + hub
/agence-seo-bruxelles               → agence seo bruxelles (260)
/agence-seo-suisse                  → agence seo CH (260) + hub
/agence-seo-geneve                  → agence seo genève (210)
/blog/                              → 15 articles (migrés) + nouveaux
/offres  /realisations  /click-first  /a-propos  /contact   (existent)
/mentions-legales  /confidentialite  /conditions
```

## Arborescence — monsieurclick.com (EN)

```
/                                     → seo agency · seo company (aspirationnel)
/services/
  /services/seo                       → seo services (78 400 US+UK)
  /services/local-seo                 → local seo (13 700)
  /services/web-design                → web design agency (16 500)
  /services/wordpress-web-design      → wordpress web design (2 400)
  /services/google-business-profile   → GBP
  /services/generative-engine-optimization → GEO (premier entrant)
/small-business-seo                   → small business seo (4 190)  ✅ entrée
/ai-seo-agency                        → ai seo agency (1 000)
/seo-agency-london                    → test géo UK
/blog/                                → EN natif
/pricing  /case-studies  /about  /contact
```

## Règles hreflang

- Chaque page déclare **toutes** ses variantes + `x-default` :
```html
<link rel="alternate" hreflang="fr-fr" href="https://monsieurclick.fr/services/seo" />
<link rel="alternate" hreflang="fr-be" href="https://monsieurclick.fr/services/seo" />
<link rel="alternate" hreflang="fr-ch" href="https://monsieurclick.fr/services/seo" />
<link rel="alternate" hreflang="en-us" href="https://monsieurclick.com/services/seo" />
<link rel="alternate" hreflang="en-gb" href="https://monsieurclick.com/services/seo" />
<link rel="alternate" hreflang="x-default" href="https://monsieurclick.com/services/seo" />
```
- Correspondances .fr ↔ .com (paires hreflang) :

| .fr | .com |
|---|---|
| `/` | `/` |
| `/services/seo` | `/services/seo` |
| `/services/seo-local` | `/services/local-seo` |
| `/services/creation-site-web` | `/services/web-design` |
| `/services/creation-site-wordpress` | `/services/wordpress-web-design` |
| `/services/google-business-profile` | `/services/google-business-profile` |
| `/services/visibilite-ia-geo` | `/services/generative-engine-optimization` |
| `/services/audit-seo` | (à créer EN : `/services/seo-audit`) |

- Pages **sans équivalent** (ex. `/agence-seo-paris`, `/small-business-seo`) : pas de hreflang croisé forcé. Auto-référent uniquement.
- Ne jamais mélanger FR et EN sur le même domaine.

## Maillage interne

- Chaque hub `/services/` liste et lie ses pages enfants.
- Chaque page ville lie vers 2–3 services pertinents + retour au hub régional.
- Chaque article de blog lie vers **1 page argent** cible (voir `05-blog-map.md`).
- Breadcrumb sur toutes les pages profondes (+ schema BreadcrumbList).
