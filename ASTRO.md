# Astro monorepo — monsieurclick.fr + monsieurclick.com

Les deux sites tournent sur **Astro 5** (SSG), contenu natif par langue.

## Structure

```text
packages/shared/
  layouts/BaseLayout.astro
  components/Header.astro
  components/Footer.astro

sites/fr/                    → monsieurclick.fr
  src/pages/                 → routes Astro (layout ou raw OKF)
  src/chrome.ts              → nav/footer FR
  content/                   → partials <main> extraits
  legacy-html/               → HTML source complet
  asset-src/                 → CSS/JS/images/fonts versionnés
  functions/                 → Cloudflare Pages Functions
  dist/                      → build

sites/com/                   → monsieurclick.com (même schéma)

archive/pre-astro-root/      → ancien HTML plat (rollback)

scripts/
  regen-astro-pages.mjs      → legacy → pages Astro + content/
  sync-assets.mjs            → asset-src → public/
  postbuild-cf.mjs           → _redirects/_headers → dist/
```

## Commandes

```bash
npm install
npm run bootstrap     # sync assets + regen pages
npm run dev:fr        # :4321
npm run dev:com       # :4322
npm run build:fr      # → sites/fr/dist
npm run build:com     # → sites/com/dist
npm run deploy:fr
npm run deploy:com
```

## Cloudflare Pages (cutover)

| Projet | Build command | Output dir | Root |
|--------|---------------|------------|------|
| `monsieurclick-fr` | `npm run build:fr` | `sites/fr/dist` | repo root |
| `monsieurclick-com` | `npm run build:com` | `sites/com/dist` | repo root |

- Node version : 20+ (Astro 5)
- Functions : `sites/<site>/functions` (déployées avec `wrangler pages deploy` depuis `sites/<site>`)
- D1 binding `DB` → database `clickfirst` (FR + COM) — requis pour le score Click First™
- Branch de prod recommandée : `cursor/astro-sites-a34f` (puis `main` après merge)

### Checklist pré-prod

1. `npm run bootstrap && npm run build`
2. Vérifier H1 + `page-hero` sur pages marketing (surtout EN)
3. Vérifier `_redirects` / `_headers` dans chaque `dist/`
4. Smoke : `/`, `/services/`, `/click-first`, `/contact`, score API
5. Déployer en preview CF → comparer design vs live
6. Pointer domaines custom

## SEO

- URLs directory (`/services/seo/`)
- Canonical + hreflang + JSON-LD repris du legacy
- Pages marketing → `BaseLayout` (Header/Footer partagés)
- OKF / outils → HTML raw préservé

## Inventaires (natifs, pas 1:1 FR↔EN)

| Site | Pages HTML | Note |
|------|------------|------|
| `.fr` | ~105 | geos FR/BE/CH, glossaire, réalisations |
| `.com` | ~85 | long-tail EN, GEO, London test |

Design system partagé (mêmes tokens CSS). Contenu natif par langue — pas de traduction auto.
