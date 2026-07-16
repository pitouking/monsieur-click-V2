# 08 — Template de page (StoryBrand + SEO)

Structure réutilisable pour toute page **service** ou **ville**. Le client est le héros, Monsieur Click est le guide.

## Ordre des sections

1. **Hero** — H1 (mot-clé principal) + sous-titre bénéfice + CTA principal (diagnostic gratuit).
   - Le visiteur comprend en 5 s : ce qu'on fait, pour qui, quel résultat.
2. **Le problème** (héros) — la douleur concrète du client (ex. « invisible sur Google alors que vos concurrents, pas meilleurs, sont devant »).
3. **Le guide** (Monsieur Click) — empathie + autorité (preuves, méthode Click First™, E-E-A-T).
4. **Le plan** — 3 étapes simples (ex. Diagnostic → Mise en place → Optimisation mensuelle).
5. **Ce qu'on livre** — détail du service, orienté résultat (pas une liste de features sèche).
6. **Preuve** — avis Google, études de cas (`/realisations`), chiffres réels.
7. **Zones / portée** (pages ville) — areaServed, sans dupliquer les pages banlieue.
8. **FAQ** — 3–6 questions réelles (matière FAQPage + AI Overviews).
9. **CTA final** — enjeu si rien ne change + rappel diagnostic gratuit sans engagement.

## Checklist SEO par page (rappel Definition of Done)

- H1 unique = mot-clé principal. 1 seul H1.
- Title ≤ 60 car., meta description 140–160 car.
- Mot-clé principal dans : H1, title, 1er paragraphe, 1 H2, URL.
- Entités sémantiques + mots saillants du champ lexical (pas de bourrage).
- 2+ liens internes vers pages argent liées + lien depuis le hub parent.
- Schema JSON-LD adapté (voir `07`).
- hreflang si équivalent dans l'autre langue.
- Images optimisées (WebP, alt descriptif), CWV verts.
- Contenu original, ≥ ~700 mots pour une page argent, unique vs autres pages.

## Signaux « lisibilité IA » (GEO) à intégrer

- Réponses claires et autonomes (une question = un paragraphe citable).
- Chiffres et faits vérifiables, cohérents avec le reste du site.
- FAQPage structurée.
- Entités nommées cohérentes (nom, lieu, service) partout.

## Squelette HTML (indicatif)

```html
<h1>{{mot_cle_principal}}</h1>
<p class="lead">{{sous_titre_benefice}}</p>
<a class="cta" href="/contact">Diagnostic gratuit</a>

<section id="probleme"><h2>{{douleur_client}}</h2>…</section>
<section id="guide"><h2>{{empathie_autorite}}</h2>…</section>
<section id="plan"><h2>Votre plan en 3 étapes</h2>…</section>
<section id="livraison"><h2>Ce que nous livrons</h2>…</section>
<section id="preuve"><h2>Ils nous font confiance</h2>…</section>
<section id="faq"><h2>Questions fréquentes</h2>… <!-- FAQPage JSON-LD --></section>
<section id="cta-final"><h2>{{enjeu_si_rien_ne_change}}</h2>…</section>
<!-- JSON-LD : Service + BreadcrumbList (+ FAQPage) -->
```
