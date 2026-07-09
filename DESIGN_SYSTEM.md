# DESIGN_SYSTEM.md

Source unique : `styles.css`. Thème sombre, éditorial-tech. Registre « brand » (le design EST le produit).

## Tokens couleur (CSS variables)
```
--navy:#081428  --navy-2:#0a1a33  --navy-3:#0c2148     (fonds)
--surface:rgba(255,255,255,.045)  --surface-2:rgba(255,255,255,.07)
--brd:rgba(255,255,255,.10)  --brd-2:rgba(255,255,255,.16)   (bordures)
--ink:#eef3fb   --muted:#9db0cc                        (texte)
--cyan:#35a7e6  --cyan-2:#5cc0f2  --turq:#49e0d0        (accent froid)
--orange:#f0522a  --orange-2:#ff6a3d                    (accent chaud / CTA)
--gold:#ffc24b                                          (étoiles avis)
--radius:14px   --maxw:1260px
```
Stratégie couleur : **committed** (navy dominant + double accent orange/cyan). Orange = action/CTA. Cyan/turquoise = liens, signaux, IA. Pas de crème/sable.

## Typographie
- Famille unique : **Montserrat** (400/500/600/700/800). Titres 700.
- Titres `h1-h4` : `font-family:Montserrat; font-weight:700; letter-spacing:-.02em`.
- Hero H1 : `clamp(2.4rem,5.4vw,4.5rem)` (plafond ≤ 6rem). Colonne hero `max-width:900px` pour tenir « Vos futurs clients / vous cherchent déjà. » sur 2 lignes.
- Eyebrow : `.eyebrow` (0.72rem, majuscule, letter-spacing .22em, cyan). NB : l'audit conseille d'en réduire la fréquence.
- Corps : Montserrat 400, `line-height:1.65`. **Audit P1** : viser 65–75ch (réduire `.prose` de 820px → ~68ch).

## Layout
- Conteneurs : `.wrap` (max 1260px, padding 24px) · `.wrap-wide` (pleine largeur, padding `clamp(40px,6vw,120px)`) pour nav + hero.
- Sections : `section{padding:120px 0}` (80px en mobile).
- Grilles responsives : `repeat(auto-fit,minmax(...,1fr))` où pertinent.
- Breakpoint principal : `@media(max-width:920px)`.

## Boutons
- `.btn` pill. `.btn-primary` (dégradé orange, CTA principal), `.btn-cyan` (dégradé cyan), `.btn-ghost` (verre : `backdrop-filter:blur(16px) saturate(1.3)`, demandé explicitement par le client — à conserver).

## Motion
- `.reveal` (opacity/translate via IntersectionObserver → `.in`). **Audit P1 reveal-safety** : prévoir fallback visible sans JS.
- Hero : `.reveal-up` staggered (rd1…rd6).
- Marquee services (`.marquee`), parcours au scroll (sticky), constellation en orbite (rAF), particules canvas, glow timeline (`.vtl::after`).
- `@media(prefers-reduced-motion:reduce)` désactive tout. Easings sobres, pas de bounce.

## Écarts assumés vs skill impeccable (voir audit-impeccable.md)
- Glassmorphism sur `.btn-ghost` : demandé par le client, conservé.
- Eyebrows + numéros 01→09 : choix de marque, à trancher (audit P1/CHOIX).
- Reste des correctifs : voir TODO.md.
