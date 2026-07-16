# 10 — Refonte frontend (HTML sémantique + CSS BEM + Design Tokens, standards 2026)

## Rôle

Développeur frontend senior spécialisé dans la **refonte et l'optimisation de sites existants**. Expertise : HTML sémantique moderne, méthodologies CSS avancées (BEM), systèmes de design tokens, meilleures pratiques de performance web. Ton **technique, précis, orienté solution**. Objectif : transformer un site obsolète en application web **moderne, performante et maintenable** reposant sur un socle de tokens universel.

## Contexte

- Base de code HTML ancienne, **styles CSS inline**, structure potentiellement désorganisée.
- Contraintes : suivre les standards HTML/CSS **actuels et futurs (cible 2026)**, excellente performance, maintenabilité accrue.
- Audience du code : les **développeurs frontend** qui maintiendront le site.
- Rappel projet : les pages actuelles sont déjà en Core Web Vitals verts (onpage 97–100, CLS 0), ne pas régresser. Stack cible : WordPress/Brizy ou statique/custom (voir `README`).

## Objectif

Refondre **entièrement la structure, le style et le système de tokens** du site existant pour le moderniser selon les standards HTML et CSS de 2026.

## Exigences

1. **Structure HTML sémantique moderne** : réécrire tout le HTML avec les balises sémantiques appropriées (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`), structure claire, remplacer les `<div>` génériques autant que possible. Accessible (a11y) et optimisé SEO.
2. **CSS avec BEM et classes** : éliminer **tout** le CSS inline. Méthodologie **BEM** (Block, Element, Modifier). Styles appliqués par classes. Séparation nette structure (HTML) / présentation (CSS).
3. **Système de design tokens complet** : **avant tout code de composant**, définir dans `:root` l'intégralité des tokens : typographie (échelle T-shirt fluide), couleurs (palette issue du site Monsieur Click, primary/secondary + toutes les shades), espacement (base 4 px), radius, ombres, transitions. Aucune valeur arbitraire dans les composants, tout doit référencer un token.
4. **Optimisation des performances** : HTML/CSS optimisés pour un chargement rapide, minification, élimination des redondances, meilleures pratiques web (CWV verts).
5. **Structuration & maintenabilité** : code logique et cohérent, fichiers CSS bien structurés et commentés si nécessaire.
6. **Conformité standards 2026** : anticiper les évolutions HTML/CSS, privilégier les approches modernes et pérennes.

## Système de Design Tokens (à implémenter en priorité)

### Architecture des fichiers CSS

```text
css/
├── tokens.css        ← UNIQUE source de vérité : toutes les variables :root
├── base.css          ← Reset, html, body, typographie de base
├── components/       ← Un fichier par composant BEM
│   ├── header.css
│   ├── hero.css
│   ├── card.css
│   ├── button.css
│   └── …
└── utilities.css     ← Classes utilitaires (spacing, visibility, etc.)
```

**Règle absolue** : aucune valeur brute (hex, px arbitraire, nom de fonte en dur) en dehors de `tokens.css`. Tout composant consomme un token.

### 1 — Tokens Typographie (échelle T-shirt fluide)

Utiliser `clamp()` pour une typographie fluide entre mobile (375 px) et desktop (1440 px). L'échelle T-shirt garantit des noms expressifs et stables quelle que soit l'évolution du design.

```css
/* tokens.css — TYPOGRAPHIE */

:root {
  /* Familles de fontes, à personnaliser selon audit du site actuel */
  --font-display: 'Outfit', 'Helvetica Neue', sans-serif; /* Titres, hero */
  --font-body:    'Inter',  'Helvetica Neue', sans-serif; /* Corps, UI     */
  --font-mono:    'JetBrains Mono', 'Courier New', monospace;

  /* Graisses sémantiques */
  --font-weight-regular:   400;
  --font-weight-medium:    500;
  --font-weight-semibold:  600;
  --font-weight-bold:      700;
  --font-weight-extrabold: 800;

  /* Hauteurs de ligne */
  --line-height-tight:   1.15;
  --line-height-snug:    1.35;
  --line-height-normal:  1.6;
  --line-height-relaxed: 1.75;

  /* Espacement de lettres */
  --letter-spacing-tight:  -0.02em;
  --letter-spacing-normal:  0em;
  --letter-spacing-wide:    0.04em;
  --letter-spacing-wider:   0.08em;
  --letter-spacing-widest:  0.15em;

  /* Échelle T-shirt fluide */
  --text-2xs:  clamp(0.625rem,  0.6rem  + 0.125vw, 0.75rem);   /* 10px → 12px  */
  --text-xs:   clamp(0.75rem,   0.7rem  + 0.25vw,  0.875rem);  /* 12px → 14px  */
  --text-sm:   clamp(0.875rem,  0.8rem  + 0.35vw,  1rem);      /* 14px → 16px  */
  --text-md:   clamp(1rem,      0.95rem + 0.25vw,  1.125rem);  /* 16px → 18px  */
  --text-lg:   clamp(1.125rem,  1rem    + 0.75vw,  1.5rem);    /* 18px → 24px  */
  --text-xl:   clamp(1.5rem,    1.2rem  + 1.25vw,  2.25rem);   /* 24px → 36px  */
  --text-2xl:  clamp(2rem,      1.2rem  + 2.5vw,   3.5rem);    /* 32px → 56px  */
  --text-3xl:  clamp(2.5rem,    1rem    + 4vw,     5rem);      /* 40px → 80px  */
  --text-4xl:  clamp(3rem,      0.5rem  + 7vw,     8rem);      /* 48px → 128px */

  /* Alias sémantiques */
  --text-body:     var(--text-md);
  --text-caption:  var(--text-xs);
  --text-label:    var(--text-sm);
  --text-subhead:  var(--text-lg);
  --text-heading:  var(--text-xl);
  --text-title:    var(--text-2xl);
  --text-hero:     var(--text-3xl);
  --text-display:  var(--text-4xl);
}
```

**Règles d'utilisation de l'échelle T-shirt**

| Alias / Token | Taille résolue | Usage recommandé |
|---|---|---|
| `--text-2xs` | 10–12 px | Mentions légales, micro-labels |
| `--text-xs` / `--text-caption` | 12–14 px | Légendes, métadonnées, badges |
| `--text-sm` / `--text-label` | 14–16 px | Boutons, liens nav, étiquettes formulaire |
| `--text-md` / `--text-body` | 16–18 px | **Corps de texte**, valeur par défaut |
| `--text-lg` / `--text-subhead` | 18–24 px | Sous-titres, introductions |
| `--text-xl` / `--text-heading` | 24–36 px | H2/H3, titres de section |
| `--text-2xl` / `--text-title` | 32–56 px | H1, titres de page |
| `--text-3xl` / `--text-hero` | 40–80 px | Hero section |
| `--text-4xl` / `--text-display` | 48–128 px | Déclarations typographiques extra-large |

### 2 — Tokens Couleurs (palette Monsieur Click + shades complètes)

#### Étape préalable : audit des couleurs du site actuel

Avant d'écrire les tokens, **extraire les valeurs hex exactes du site** :

```bash
# Audit rapide des couleurs CSS inline et stylesheets existantes
grep -oE '#[0-9a-fA-F]{3,8}|rgb[a]?\([^)]+\)' styles.css | sort | uniq -c | sort -rn
```

Identifier les couleurs dominantes et les mapper sur le système ci-dessous. Les valeurs de la palette Monsieur Click (bleu foncé corporate, orange/rouge accent, neutres gris) sont à substituer aux placeholders OKLCH.

#### Architecture des tokens couleur

```css
/* tokens.css — COULEURS */
/* Méthode : OKLCH pour le calcul des shades, hex en fallback */
/* Convention : --color-{rôle}-{shade} */
/* Shades : 50 (très clair) → 950 (très foncé) */

:root {
  /* PRIMARY */
  --color-primary-50:  oklch(0.97 0.02 245);
  --color-primary-100: oklch(0.94 0.04 245);
  --color-primary-200: oklch(0.87 0.08 245);
  --color-primary-300: oklch(0.78 0.13 245);
  --color-primary-400: oklch(0.68 0.17 245);
  --color-primary-500: oklch(0.58 0.20 245);
  --color-primary-600: oklch(0.50 0.20 245);
  --color-primary-700: oklch(0.42 0.18 245);
  --color-primary-800: oklch(0.34 0.15 245);
  --color-primary-900: oklch(0.26 0.11 245);
  --color-primary-950: oklch(0.16 0.07 245);

  /* SECONDARY */
  --color-secondary-50:  oklch(0.97 0.03 45);
  --color-secondary-100: oklch(0.93 0.06 45);
  --color-secondary-200: oklch(0.86 0.10 45);
  --color-secondary-300: oklch(0.78 0.15 45);
  --color-secondary-400: oklch(0.70 0.19 45);
  --color-secondary-500: oklch(0.63 0.22 45);
  --color-secondary-600: oklch(0.54 0.22 45);
  --color-secondary-700: oklch(0.46 0.20 45);
  --color-secondary-800: oklch(0.38 0.16 45);
  --color-secondary-900: oklch(0.30 0.12 45);
  --color-secondary-950: oklch(0.20 0.08 45);

  /* NEUTRAL */
  --color-neutral-0:   oklch(1 0 0);
  --color-neutral-50:  oklch(0.98 0.005 245);
  --color-neutral-100: oklch(0.95 0.008 245);
  --color-neutral-200: oklch(0.90 0.010 245);
  --color-neutral-300: oklch(0.82 0.012 245);
  --color-neutral-400: oklch(0.70 0.012 245);
  --color-neutral-500: oklch(0.58 0.010 245);
  --color-neutral-600: oklch(0.47 0.009 245);
  --color-neutral-700: oklch(0.38 0.008 245);
  --color-neutral-800: oklch(0.28 0.007 245);
  --color-neutral-900: oklch(0.19 0.006 245);
  --color-neutral-950: oklch(0.12 0.005 245);
  --color-neutral-1000: oklch(0 0 0);

  /* Tokens sémantiques light */
  --color-bg:              var(--color-neutral-50);
  --color-surface:         var(--color-neutral-0);
  --color-surface-raised:  var(--color-neutral-100);
  --color-surface-sunken:  var(--color-neutral-200);
  --color-border:          var(--color-neutral-200);
  --color-divider:         var(--color-neutral-100);

  --color-text:            var(--color-neutral-900);
  --color-text-muted:      var(--color-neutral-600);
  --color-text-faint:      var(--color-neutral-400);
  --color-text-inverse:    var(--color-neutral-0);
  --color-text-on-primary: var(--color-neutral-0);
  --color-text-on-secondary: var(--color-neutral-0);

  --color-primary:         var(--color-primary-500);
  --color-primary-hover:   var(--color-primary-600);
  --color-primary-active:  var(--color-primary-700);
  --color-primary-subtle:  var(--color-primary-50);
  --color-primary-muted:   var(--color-primary-100);

  --color-secondary:       var(--color-secondary-500);
  --color-secondary-hover: var(--color-secondary-600);
  --color-secondary-active: var(--color-secondary-700);
  --color-secondary-subtle: var(--color-secondary-50);
  --color-secondary-muted:  var(--color-secondary-100);

  --color-success:         oklch(0.52 0.17 145);
  --color-success-subtle:  oklch(0.95 0.05 145);
  --color-warning:         oklch(0.65 0.18 75);
  --color-warning-subtle:  oklch(0.97 0.04 75);
  --color-error:           oklch(0.55 0.22 25);
  --color-error-subtle:    oklch(0.96 0.04 25);
  --color-info:            var(--color-primary);
  --color-info-subtle:     var(--color-primary-subtle);
}

[data-theme="dark"] {
  --color-bg:              var(--color-neutral-950);
  --color-surface:         var(--color-neutral-900);
  --color-surface-raised:  var(--color-neutral-800);
  --color-surface-sunken:  oklch(0.10 0.005 245);
  --color-border:          var(--color-neutral-800);
  --color-divider:         var(--color-neutral-900);

  --color-text:            var(--color-neutral-100);
  --color-text-muted:      var(--color-neutral-400);
  --color-text-faint:      var(--color-neutral-600);
  --color-text-inverse:    var(--color-neutral-950);

  --color-primary:         var(--color-primary-400);
  --color-primary-hover:   var(--color-primary-300);
  --color-primary-active:  var(--color-primary-200);
  --color-primary-subtle:  oklch(from var(--color-primary-950) l c h / 0.5);
  --color-primary-muted:   var(--color-primary-900);

  --color-secondary:       var(--color-secondary-400);
  --color-secondary-hover: var(--color-secondary-300);
  --color-secondary-active: var(--color-secondary-200);
  --color-secondary-subtle: oklch(from var(--color-secondary-950) l c h / 0.5);
  --color-secondary-muted:  var(--color-secondary-900);
}
```

### 3 — Tokens Espacement, Radius, Ombres, Transitions

```css
/* tokens.css — ESPACEMENT, RADIUS, OMBRES, TRANSITIONS */

:root {
  --space-px:  1px;
  --space-0-5: 0.125rem;
  --space-1:   0.25rem;
  --space-1-5: 0.375rem;
  --space-2:   0.5rem;
  --space-3:   0.75rem;
  --space-4:   1rem;
  --space-5:   1.25rem;
  --space-6:   1.5rem;
  --space-8:   2rem;
  --space-10:  2.5rem;
  --space-12:  3rem;
  --space-16:  4rem;
  --space-20:  5rem;
  --space-24:  6rem;
  --space-32:  8rem;

  --section-padding-block: clamp(var(--space-8), 6vw, var(--space-24));
  --section-padding-inline: clamp(var(--space-4), 4vw, var(--space-12));

  --content-xs:      480px;
  --content-narrow:  640px;
  --content-default: 960px;
  --content-wide:    1200px;
  --content-full:    100%;

  --radius-none: 0;
  --radius-xs:   0.125rem;
  --radius-sm:   0.25rem;
  --radius-md:   0.375rem;
  --radius-lg:   0.5rem;
  --radius-xl:   0.75rem;
  --radius-2xl:  1rem;
  --radius-3xl:  1.5rem;
  --radius-full: 9999px;

  --shadow-xs:   0 1px 2px oklch(0.2 0.01 245 / 0.05);
  --shadow-sm:   0 1px 3px oklch(0.2 0.01 245 / 0.07), 0 1px 2px oklch(0.2 0.01 245 / 0.05);
  --shadow-md:   0 4px 6px oklch(0.2 0.01 245 / 0.06), 0 2px 4px oklch(0.2 0.01 245 / 0.04);
  --shadow-lg:   0 10px 15px oklch(0.2 0.01 245 / 0.07), 0 4px 6px oklch(0.2 0.01 245 / 0.04);
  --shadow-xl:   0 20px 25px oklch(0.2 0.01 245 / 0.08), 0 8px 10px oklch(0.2 0.01 245 / 0.04);
  --shadow-2xl:  0 25px 50px oklch(0.2 0.01 245 / 0.15);
  --shadow-inner: inset 0 2px 4px oklch(0.2 0.01 245 / 0.06);
  --shadow-focus: 0 0 0 3px oklch(from var(--color-primary) l c h / 0.35);

  --duration-instant:  50ms;
  --duration-fast:     100ms;
  --duration-normal:   180ms;
  --duration-slow:     300ms;
  --duration-slower:   500ms;

  --ease-default:      cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:           cubic-bezier(0.4, 0, 1, 1);
  --ease-out:          cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:       cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1);

  --transition-interactive: var(--duration-normal) var(--ease-default);
  --transition-fast:        var(--duration-fast) var(--ease-out);
  --transition-slow:        var(--duration-slow) var(--ease-in-out);

  --z-below:    -1;
  --z-base:      0;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-overlay:  300;
  --z-modal:    400;
  --z-toast:    500;
  --z-tooltip:  600;
}
```

## INCLUDE

- Balises sémantiques HTML5.
- Méthodologie BEM pour les classes CSS.
- Séparation stricte HTML/CSS, aucun CSS inline.
- **Fichier `tokens.css` unique**, source de vérité pour tous les tokens.
- **Échelle typographique T-shirt fluide** (`--text-xs` → `--text-display`) avec alias sémantiques.
- **Palette complète** primary + secondary + neutral, shades 50–950, tokens sémantiques light/dark.
- Modes clair/sombre via `data-theme` + `prefers-color-scheme`.
- Optimisation des performances de chargement.
- Code propre, commenté, maintenable.

## AVOID

- CSS inline.
- Valeurs arbitraires (hex, px, em) dans les composants, **tout passe par un token**.
- `<div>` en excès sans raison sémantique.
- Classes non descriptives ou non conformes à BEM.
- Code dupliqué ou redondant.
- Solutions temporaires ou non pérennes.
- Multiplier les shades sans les définir dans `tokens.css` d'abord.

## Approche (réfléchir étape par étape avant de coder)

1. **Auditer l'existant** : extraire toutes les couleurs, fontes, tailles, espacements du site actuel. Mapper chaque valeur sur l'échelle de tokens la plus proche.
2. **Construire `tokens.css`** en premier : y définir l'intégralité des variables, c'est la fondation. Valider la palette avec un `design-test.html` (surfaces, typographie, composants de base, dark mode).
3. **Définir la sémantique cible** : mapper chaque zone vers la bonne balise HTML5.
4. **Concevoir la nomenclature BEM** : blocs, éléments, modificateurs, tous consommant des tokens.
5. **Écrire `base.css`** : reset, `html`, `body`, liens, typographie de base, `focus-visible`, `prefers-reduced-motion`.
6. **Refondre page par page** : HTML sémantique + classes BEM, CSS externe utilisant uniquement les tokens.
7. **Optimiser** : minifier, purger le CSS mort, différer/lazy-load, contrôler LCP/CLS/INP.
8. **Documenter** : commenter `tokens.css` par sections, documenter la convention de nommage BEM pour les mainteneurs.

## Points de friction anticipés

- **CSS inline dispersé** : construire d'abord le système de tokens, puis extraire les valeurs inline en les remplaçant systématiquement par le token correspondant.
- **Couleurs non référencées** : toute couleur non présente dans les shades définies → créer le token manquant dans `tokens.css` plutôt que de coder en dur.
- **Fonte non tokenisée** : si le site actuel utilise des tailles arbitraires (`font-size: 17px`), les mapper sur le token T-shirt le plus proche (`--text-md`).
- **Structure HTML obsolète** : refonte de l'arbre DOM, pas un simple renommage de classes.
- **Régression de performance/CWV** : maintenir images optimisées (WebP/AVIF, dimensions explicites) et éviter le render-blocking.

## Definition of Done (frontend)

- [ ] 0 attribut `style=` inline dans le HTML livré.
- [ ] Balises sémantiques utilisées, `<div>` justifiés uniquement pour le layout.
- [ ] Classes 100 % BEM, descriptives.
- [ ] `tokens.css` complet et documenté : typographie T-shirt fluide, palette primary/secondary/neutral avec toutes les shades 50–950, espacement 4 px, radius, ombres, transitions.
- [ ] Zéro valeur brute (hex, px arbitraire, nom de fonte en dur) dans les fichiers de composants, 100 % tokens.
- [ ] CSS externe structuré (`tokens.css` → `base.css` → `components/*.css` → `utilities.css`), commenté.
- [ ] Dark mode fonctionnel via `data-theme` + `prefers-color-scheme`, tous les tokens sémantiques mis à jour.
- [ ] Pas de duplication (variables + composants réutilisables).
- [ ] Core Web Vitals verts (LCP < 2.5 s, CLS < 0.1, INP < 200 ms).
- [ ] A11y : landmarks, contrastes WCAG AA (4.5:1 corps, 3:1 grand texte), focus visible, alt d'images.
- [ ] Cohérent avec `07-technical-seo-schema.md` (schema, hreflang) et `08-page-template-storybrand.md`.

## Note d'implémentation

Ce prompt est conçu pour être **auto-suffisant** : l'agent ou le développeur peut reconstruire un site moderne, scalable et maintenable sans inventer de convention complémentaire. L'échelle T-shirt garantit des noms stables dans le temps, et la structure palette (primary/secondary + shades 50–950 + tokens sémantiques) permet de faire évoluer le branding sans toucher au code des composants, uniquement via `tokens.css`.
