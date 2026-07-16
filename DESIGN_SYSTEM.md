# DESIGN_SYSTEM.md (EN / monsieurclick.com)

Source of truth: `css/tokens.css` → bundled as `/css/main.css` via `npm run build:css`.

## Architecture

```text
css/
├── tokens.css           ← :root design tokens only
├── base.css             ← reset, body, type, containers
├── components/site.css  ← UI components
└── utilities.css        ← u-* helpers (no inline styles)
fonts/fonts.css          ← Montserrat self-hosted (inlined in bundle)
scripts/build-css.cjs    ← concatenates into css/main.css
```

`styles.css` is a compat shim that `@import`s `/css/main.css`. Prefer `/css/main.css?v=…` in HTML.

## Color tokens

| Token | Role |
|-------|------|
| `--navy` / `--navy-2` / `--navy-3` | Backgrounds |
| `--surface` / `--brd` | Elevated surfaces / borders |
| `--ink` / `--muted` | Text |
| `--orange` / `--orange-2` | Primary CTA / action |
| `--cyan` / `--cyan-2` / `--turq` | Links, AI signals |

Aliases: `--color-bg`, `--color-text`, `--color-action`, `--color-accent`.

## Typography

- Family: Montserrat (`--font-display`, `--font-body`)
- Fluid scale: `--text-2xs` … `--text-3xl` (T-shirt)
- Hero: `.hero-headline` with `.sub` for the 10-second Click First line

## Spacing & layout

- 4px scale: `--space-1` … `--space-24`
- Sections: `--space-section` (fluid)
- Containers: `.wrap` (`--maxw: 1260px`), `.wrap-wide`
- Prose: `--prose-width: 68ch`

## Buttons

- `.btn-primary` Score / main action (orange)
- `.btn-ghost` Diagnostic / secondary (glass)
- Avoid `.btn-cyan` for primary conversion (blog “see all” uses ghost)

## Motion

- `.reveal` / `.reveal-up` with IntersectionObserver
- Reveal-safety: content visible when `html` lacks `.js` (`home.js` adds `.js`)
- `prefers-reduced-motion` respected in components

## Conversion spine (PRODUCT.md)

1. Primary: Calculate my Click First™ Score → `/click-first#score`
2. Secondary: Get my free diagnostic → `#parlons` (homepage) or `/contact` (interior)

## Build

```bash
npm run build:css
```

Then bump `?v=` on `<link rel="stylesheet" href="/css/main.css?v=…">` sitewide.
