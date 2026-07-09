# COMPONENTS.md

Composants réutilisables (classes CSS dans `styles.css`). JS partagé : `shared.js` (nav, reveal, faq, form GHL). La home a du JS inline en plus.

## Structure
- `nav#nav` + `.nav-inner` dans `.wrap-wide` : logo `logo-mc.webp` + « Monsieur Click », liens (Click First™, Réalisations, Offres, À propos) + bouton primary « Diagnostic gratuit ». Menu mobile `#menuToggle` / `.nav-links.show`. `.scrolled` au scroll.
- `footer` : `.foot-grid` (3 colonnes) + `.social` (LinkedIn, X, Instagram, Facebook, icônes SVG inline) + `.foot-bottom` (liens légaux).

## En-têtes
- `.pagehero` : hero compact des pages intérieures (image `hero-bg.webp` + overlay, breadcrumb, eyebrow, h1, `.sub`).
- `.shead` / `.shead.center` : en-tête de section (`.kick` = numéro + `.eyebrow`, h2, p).
- `.hero` (home) : image de fond + `.hero-inner` (max 900px), `.badge`, H1 multi-`span` reveal-up, `.grating` (Google ★ 15 avis), `.lead`, `.hero-cta`, `.hero-check`, `.scroll-cue`.

## Blocs de contenu
- `.marquee` / `.marquee-track` : bandeau défilant services + avantages (sous le hero).
- `.constat-head` : intro asymétrique (titre / paragraphe).
- `.checklist` + `.chip` : puces animées (fade séquentiel).
- `.q-strip` : bloc question (filet gauche — audit conseille de le remplacer).
- `.cards3` + `.icard` : 3 cartes (visual SVG + body). `.icard .num2` = gros numéro fantôme.
- `.showcase.s1` / `.showcase.s2` : bandes image pleine largeur en parallaxe (respiration).
- Parcours au scroll (home S3) : `.jtrack` (360vh) > `.jsticky` (sticky 100vh) > `.jstage` (`#jbig`, `#jtitle`, `#jdesc`), `.jbar#jprog`, `.jrail`. Piloté par le scroll (JS inline).
- Écosystème (home S4) : `.constellation` (`#ecoCenter`, `.eglow` turquoise, `.enode` en orbite rAF, lignes SVG `#ecoLinks`). Fallback `.eco-fallback` en mobile.
- Offres : `.offers` + `.offer(.featured)` (`.tier-ic` emoji, `.scope`, `.price`, `.eng`, ul). `.checkrow`/`.ck` (garanties). `.ctable`/`.ctable-wrap` (tableau comparatif 3 portées).
- `.fgrid` + `.fcard(.o)` : grille de features (icône + titre + texte + bullets).
- `.duo` + `.d.bad/.good` : deux cartes contrastées.
- `.vtl` + `.vitem` : timeline verticale (glow animé `.vtl::after`, à propos).
- International : `.intl-grid`, `.intl-big` (dégradé texte — audit conseille couleur pleine), `.flags`/`.flag`, `.pill-list`/`.p`.
- Avis (home S5) : widget EMR `emr-simple-carousel` + fallback `.rev-track`/`.review` (marquee) si le widget ne charge pas (JS inline, 2,8 s).
- Approche (home S6) : `#particles` canvas + `.approach-grid` + `.evo-card` (scan animé).
- `.brandcard` : carte logo (à propos, footer visuel).
- FAQ : `.faq-item`/`.faq-q`/`.faq-a` (accordéon, `shared.js`).
- `.rcase` (réalisations) : capture mobile `.shot` (alternance gauche/droite) + `.content` (head, sector, `.row2` problème/solution, `.res`, `.chips`/`.chip2`, blockquote).
- `.embed-wrap` / `.embed-wrap.booking` : conteneur iframes GHL (formulaire + agenda).
- `.ctaband` : bandeau CTA orange. `.cta-final` : CTA final home (image de fond).
- `.prose` : contenu long (pages légales, sections texte). Barre d'accent sur `h2`.

## Embeds GHL
- Formulaire : `link.monsieurclick.com/widget/form/LRwuW0fwfpv9MbsZVZvi` (home #parlons + contact).
- Agenda : `link.monsieurclick.com/widget/booking/TCQmnhBdiixkS0q4jeLh` (contact #rdv).
- Script : `link.monsieurclick.com/js/form_embed.js` (redimensionnement auto).
