# CLAUDE.md — Conventions agent (Monsieur Click rebuild)

Instructions pour tout agent Claude Code travaillant sur ce projet.

## Contexte

Agence SEO & Webdesign (Monsieur Click). Fondateur : Jean-Pierre Baguette. Ancrage NAP : 24 bis sentier des fosses rouges, 92240 Malakoff, France. Cible : TPE/PME, indépendants, particuliers. Deux marchés : francophone (.fr) et anglophone (.com).

## Règles d'or

1. **Une page = un sujet = un mot-clé principal.** Ne jamais fusionner deux intentions sur une page.
2. **On ne construit que là où la demande existe.** Voir `06-do-not-build.md`. Pas de page si volume ≈ 0.
3. **Contenu natif par langue.** Le .com n'est PAS une traduction du .fr. Entités, exemples, ton propres à US/UK.
4. **hreflang systématique** entre pages équivalentes .fr ↔ .com. Voir `01-architecture-hreflang.md`.
5. **Structure de dossiers, pas plat.** Services sous `/services/`, blog sous `/blog/` (301 depuis les vieux `/blog-xxx`).
6. **H1 orienté requête**, jamais slogan. Le H1 reprend le mot-clé principal de la page.
7. **NAP identique partout** (site, GBP, citations). Voir schema LocalBusiness.

## Ton & rédaction (méthode StoryBrand)

- Le client est le héros, Monsieur Click est le guide.
- Message clair en 5 secondes : ce qu'on fait, pour qui, quel résultat.
- Orienté conversion + SEO (entités sémantiques, mots saillants) + lisibilité IA (GEO).
- FR : vouvoiement, concret, orienté résultat business local.
- Pas de jargon inutile. Pas de promesses non tenables (pas de garantie de position 1).

## Interdits

- Pas de contenu dupliqué entre pages ou entre domaines.
- Pas de mass pages ville×service sur zones sans demande (doorway pages).
- Pas de traduction automatique FR→EN publiée telle quelle.
- Pas de H1 « slogan » (ex. « Une seule méthode »).

## Definition of Done (par page)

- [ ] URL conforme aux conventions (`01-architecture-hreflang.md`)
- [ ] H1 = mot-clé principal ; title ≤ 60 car. ; meta description 140–160 car.
- [ ] Structure StoryBrand complète (`08-page-template-storybrand.md`)
- [ ] Schema JSON-LD adapté au type de page (`07-technical-seo-schema.md`)
- [ ] Liens internes : ≥ 2 vers pages argent liées + 1 depuis le hub parent
- [ ] hreflang déclaré si équivalent existe dans l'autre langue
- [ ] Core Web Vitals verts (images optimisées, pas de render-blocking lourd)
