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

| Projet | Build command | Output dir |
|--------|---------------|------------|
| `monsieurclick-fr` | `npm run build:fr` | `sites/fr/dist` |
| `monsieurclick-com` | `npm run build:com` | `sites/com/dist` |

Root directory = repo root. Functions vivent dans `sites/<site>/functions`.

## SEO

- URLs directory (`/services/seo/`)
- Canonical + hreflang + JSON-LD repris du legacy
- Pages marketing → `BaseLayout` (Header/Footer partagés)
- OKF / outils → HTML raw préservé
