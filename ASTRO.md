# Astro monorepo — monsieurclick.fr + monsieurclick.com

Les deux sites sont passés sur **Astro 5** (output statique), avec contenu natif par langue (pas de traduction auto).

## Structure

```text
sites/fr/                 → monsieurclick.fr
  src/pages/              → routes Astro (wrappers)
  legacy-html/            → HTML source (SEO 1:1)
  public/                 → assets (généré par sync)
  functions/              → Cloudflare Pages Functions
  dist/                   → build (gitignored)

sites/com/                → monsieurclick.com
  src/pages/
  legacy-html/
  asset-src/              → assets EN versionnés
  public/                 → assets (généré par sync)
  functions/
  dist/

scripts/
  html-to-astro.mjs       → HTML → wrappers Astro
  sync-assets.mjs         → copie les assets vers public/
  postbuild-cf.mjs        → _redirects / _headers → dist/
```

## Commandes

```bash
npm install
npm run bootstrap     # sync assets + (re)génère les wrappers si besoin
npm run dev:fr        # http://localhost:4321
npm run dev:com       # http://localhost:4322
npm run build:fr
npm run build:com
npm run deploy:fr     # Cloudflare Pages → monsieurclick-fr
npm run deploy:com    # Cloudflare Pages → monsieurclick-com
```

## Principes SEO conservés

- URLs inchangées (`format: 'directory'`)
- Canonical + hreflang dans le HTML d’origine
- Schema JSON-LD intact (import `?raw` + `set:html`)
- `_redirects` / `_headers` / `functions` reportés au build

## Prochaine étape (composants)

Les pages sont encore des wrappers autour du HTML legacy. Refactor progressif :

1. Extraire `BaseLayout`, `Header`, `Footer` dans `packages/shared`
2. Migrer page par page le `<main>` vers du vrai markup Astro
3. Retirer le HTML racine historique une fois le cutover Cloudflare fait
