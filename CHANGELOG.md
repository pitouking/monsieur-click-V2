# CHANGELOG.md

Historique des itérations (ordre chronologique).

- **v1** Blueprint stratégique + première page HTML premium (générique SEO/webdesign).
- **v2** Réalignement sur le brief : positionnement **Click First™** (pas « agence »), visibilité Google + IA, hero navy + monogramme MC, StoryBrand, chiffres réels, 3 offres, international.
- **v3** Reconstruction depuis le nouveau texte (récit unique). Copy finale au mot près, animations premium par section.
- **v4** Fixes : logo MC recréé en SVG (puis remplacé par les vrais PNG), section internationale, FAQ PAA, JSON-LD.
- **v5 (full-width / rythme)** Hero/nav pleine largeur, parcours au **scroll** (sticky), glow turquoise derrière Click First, pricing corrigé (milieu 12 mois) + labels descriptifs, FAQ 2 colonnes, refonte du rythme.
- **Vrais assets** Intégration de `hero-bg.webp` (hero + bandes + CTA) et `logo-mc.webp` (header/footer) depuis le dossier connecté. Bundle déployable.
- **Section Offres + pricing** ajoutés ; international élargi aux pays francophones + anglophones.
- **Full images + embeds** Captures mobiles réelles sur Réalisations (hotlink monsieurclick.fr), bandes showcase `section-1/2.webp`, marges hero, glassmorphism renforcé sur `.btn-ghost`, **tous les titres en Montserrat** (Philosopher retiré), agenda + formulaire **GoHighLevel** (contact + home), **Meta Pixel**, **pages légales reprises de monsieurclick.fr** (SIRET, Cloudflare), **schéma 2 niveaux** (site + page), NAP réel propagé.
- **Multi-pages** Extraction `styles.css` + `shared.js`, nav multi-pages, pages Click First (pilier), Offres, Réalisations, À propos, Contact, Blog, légales, `robots.txt`, `sitemap.xml`, `llms.txt`.
- **Enrichissement** ~1200 mots StoryBrand + entités sur pages piliers ; 6 études de cas réelles ; À propos refondu premium (split, duo, cartes, timeline à glow).
- **Corrections client** : hero H1 sur 2 lignes ; glow animé sur la timeline ; **100 % à distance** (présentiel retiré) ; nom fondateur = Baguette/JP uniquement (légal/schéma).
- **Interlinking** contextuel accueil ↔ offres ↔ réalisations (ancres descriptives).
- **Rebrand Click First** : menu « Méthode » → « Click First™ », `methode.html` → `click-first.html` (redirection), liens + sitemap + llms mis à jour.
- **Offres v2** : icônes par palier (🌱📈🚀), bandeau garanties `.checkrow`, **tableau comparatif** `.ctable`.
- **Réseaux sociaux** ajoutés au footer (LinkedIn, X, Instagram, Facebook).
- **Audit impeccable** produit (`audit-impeccable.md`).
- **Docs de passation** : ce set de fichiers .md.
- **Sprint optimisations finales (14 priorités)** :
  - P1 Structure : footer pleine largeur (`.wrap-wide`), badge sélecteur de langue FR/EN (FR→.fr, EN→.com) dans le header sur toutes les pages, SIRET au footer, mention Click First™ marque déposée dans les CGV.
  - P2 Offres : tableau comparatif recentré (seules les 4 premières lignes diffèrent, le reste strictement identique ✓), FAQ 3→10 (PAA), dernière section refondue (cartes, duo, icon boxes, q-strip).
  - P3 Click First : début en icon boxes + bloc de rupture, FAQ 5→12, JSON-LD FAQPage synchronisé.
  - P5 StoryBrand : fil rouge narratif (Vous développez → Internet/Google/IA évoluent → Click First évolue → Vous restez visible) + phrases émotionnelles dirigeant.
  - P4 Fond : texture points 2 %, halos radiaux doux, profondeur derrière la constellation.
  - P6 Section 3 : parcours au scroll transformé en mini-film (Scène 1/7, scénario recherche→appel).
  - P7 : phrase de transition avant la constellation. P8 : section Founder réécrite (conviction incarnée). P9 : trims ciblés des redondances.
  - P11 : icônes uniformisées (même tuile, taille, glow) via CSS. P12 : +2 FAQ objections (SEO mort avec IA ? / investir maintenant ?).
  - P13 SEO technique : `WebPage` par page + `BreadcrumbList` sur les pages internes manquantes (Org+ProfessionalService = nœud `#org` unique, pas de doublon).
  - P14 Perfs : `loading="lazy"`, `decoding="async"`, preload de l'image LCP `hero-bg.webp` sur toutes les pages.
  - P10 : prompts image éditoriaux livrés dans `IMAGE_PROMPTS.md` (à générer et déposer par JP).
