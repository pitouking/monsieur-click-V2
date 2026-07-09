# AI_RULES.md

Règles pour toute IA qui reprend ce projet. Lire d'abord PROJECT.md, DESIGN_SYSTEM.md, COPYWRITING.md, SEO_RULES.md.

## Interlocuteur
Jean-Pierre, CEO de Monsieur Click. Répondre en **français**, **vouvoiement**, concis et actionnable, orienté résultats business. Pas de blabla.

## Marque & positionnement (non négociable)
- Vendre **Click First™** (méthode/package), jamais des services isolés, jamais « une agence ».
- Se présenter en « nous » / Monsieur Click. Nom fondateur = Baguette/JP, uniquement légal/schéma.
- 100 % à distance. Bilingue FR/EN, pays francophones + anglophones.

## Copy
- Zéro tiret long `—` (ni `--`). Virgule/point/parenthèses.
- Pas de garantie de position, pas de « référencement rapide », pas de buzzwords.
- SEO moderne : entités, triples entités, mots saillants (voir COPYWRITING.md). ~1200 mots sur pages piliers. FAQ style PAA.

## Honnêteté / exactitude (préférence forte du client)
- Ne jamais inventer sources, chiffres, citations. Marquer l'incertitude. Ne pas présenter des données non vérifiées comme des faits. Toute métrique « placeholder » doit être remplacée par du vérifiable.

## Design (skill impeccable, registre brand)
- Contraste corps ≥ 4,5:1. Ligne 65–75ch. Une famille (Montserrat), titres 700, letter-spacing ≥ -0,04em, hero clamp ≤ 6rem. `text-wrap:balance` sur titres.
- Motion intentionnel, easings sobres (ease-out), pas de bounce. `prefers-reduced-motion` obligatoire. Reveal = enhancement d'un contenu déjà visible (pas de contenu masqué par défaut sans JS).
- Bans à éviter (sauf choix de marque documenté) : texte en dégradé, bordure latérale accent, glassmorphism par défaut, eyebrow sur chaque section, numéros 01→09 par défaut, grilles de cartes identiques, hero-metric template, ghost-card (bordure + grosse ombre), sur-arrondi (> 16px sur cartes).
- Écarts assumés par le client : glassmorphism sur `.btn-ghost`. Eyebrows/numéros : à réduire (voir audit).
- Réutiliser les composants existants (COMPONENTS.md) avant d'en créer. Toujours garder les animations vivantes avec le reste.

## Technique
- HTML statique, `styles.css` + `shared.js` partagés. La home a du JS inline (parcours scroll, constellation, particules) : ne pas casser.
- Schéma 2 niveaux (SEO_RULES.md). NAP strictement cohérent partout.
- Formulaires/agenda = GoHighLevel (embeds). Meta Pixel posé ; autres scripts à coller (TODO).
- Le dossier peut refuser la suppression de fichiers (permissions) : préférer l'écrasement ou une redirection.
- Après édition : vérifier équilibre `<div>`/`<section>`, validité JSON-LD, `node --check` sur le JS inline.

## Process
- Utiliser AskUserQuestion quand une décision revient au client. Sinon, choisir un défaut sensé et l'indiquer.
- Vérifier (fichiers, contraste, rendu) avant de livrer. Présenter les fichiers via cartes.
