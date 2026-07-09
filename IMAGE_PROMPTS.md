# Prompts image — Monsieur Click / Click First™

Objectif : remplacer progressivement les visuels un peu « banque d'images » par des visuels **éditoriaux et cinématographiques**, alignés sur l'identité du site (dark editorial-tech, navy profond, accents cyan/turquoise et orange, entreprises locales francophones).

Prompts rédigés en anglais (meilleur rendu sur Midjourney / Flux / Leonardo). À générer par vos soins, puis à exporter en **WebP** et à déposer dans le dossier sous le même nom que l'image remplacée (`hero-bg.webp`, `section-1.webp`, `section-2.webp`). Les résultats varient d'une génération à l'autre : régénérez jusqu'à obtenir le rendu marque, ce ne sont pas des visuels garantis du premier coup.

## Garde-fous de style (à garder dans chaque prompt)
- Palette : deep navy (#081428) dominant, cyan/teal glow (#35a7e6 / #49e0d0), warm orange accent (#f0522a) en touches.
- Ambiance : editorial, cinematic, moody, premium tech, subtle depth, soft volumetric light. **Pas** de sourires stock, pas de collègues qui se serrent la main, pas de graphiques 3D génériques.
- Lumière : low-key, directional, filmic. Grain fin, contraste maîtrisé.
- Cadrage : espace négatif à gauche pour le hero (le texte s'y superpose).

**Negative prompt commun :** `stock photo, cheesy, corporate handshake, fake smile, oversaturated, cluttered, watermark, text, logo, distorted hands, plastic skin, HDR, lens flare overkill`

---

## 1. `hero-bg.webp` — Hero + bandeau CTA + bandes parallax
Usage : fond du hero d'accueil et des en-têtes de pages, superposé d'un dégradé navy à gauche.

**Prompt :**
`Cinematic wide shot, a small French local business owner seen from behind at dusk, standing in a softly lit artisan workshop or boutique, warm interior light spilling out, deep navy blue tones dominating the frame, subtle cyan and teal rim light, faint orange glow from a shop sign, volumetric haze, shallow depth of field, editorial photography, filmic grain, moody premium atmosphere, large empty dark space on the left for text overlay --ar 16:9 --style raw`

## 2. `section-1.webp` — Bande showcase 1 (proximité / commerce local)
Usage : bande pleine largeur en parallaxe, respiration après la Section 2.

**Prompt :**
`Cinematic street-level view of a charming French neighborhood shopfront at blue hour, Malakoff / Paris suburb vibe, glowing window, a passerby checking their phone in the foreground bokeh, deep navy and teal color grade, warm orange interior light, documentary editorial style, filmic, atmospheric depth, no text --ar 21:9 --style raw`

## 3. `section-2.webp` — Bande showcase 2 (écosystème / visibilité)
Usage : bande pleine largeur en parallaxe, avant les avis.

**Prompt :**
`Abstract editorial macro of interconnected light nodes and thin glowing lines forming a constellation over a dark navy background, teal and cyan luminous points, one warm orange node standing out, sense of a living network, cinematic depth, soft focus falloff, premium tech aesthetic, no text, no UI --ar 21:9 --style raw`

## 4. (Option) Portrait fondateur — `a-propos` (emplacement `brandcard`)
Usage : humaniser la page À propos. Portrait, pas selfie.

**Prompt :**
`Editorial environmental portrait of a confident French digital consultant in his 40s, working late in a dark minimalist home office, screen glow lighting his face in cyan and navy tones, warm desk lamp accent, candid focused expression, cinematic, shallow depth of field, filmic grain, premium magazine style --ar 4:5 --style raw`
> Note : à n'utiliser que si Jean-Pierre souhaite apparaître. Sinon, garder la carte logo actuelle.

## 5. (Option) Visuel « parcours client » — Section 3
Usage : renforcer le mini-film du parcours au scroll (si vous voulez un fond dédié).

**Prompt :**
`Cinematic close-up of a hand holding a smartphone showing a maps search at night, glowing screen reflecting on the face, deep navy environment, teal and cyan light, warm orange notification glow, moody editorial, bokeh city lights background, filmic, no readable text on screen --ar 16:9 --style raw`

---

## Après génération
1. Export en WebP (qualité ~80), largeur cible ≈ 1920 px pour les bandes, ≈ 2400 px pour le hero.
2. Compresser (Squoosh, ou `cwebp -q 80`).
3. Déposer dans le dossier sous le nom exact du fichier remplacé. Aucun changement de code nécessaire, les chemins restent identiques.
4. Vérifier le contraste du texte hero après remplacement (le dégradé navy à gauche doit rester lisible).
