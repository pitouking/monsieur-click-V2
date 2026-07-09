# Audit « impeccable » — monsieurclick.com

_Audit technique, SEO et accessibilité de l'ensemble du site (26 pages HTML)._
_Date : 8 juillet 2026._

## Verdict global

Site **sain et cohérent**. Aucune anomalie bloquante après réparation du CSS. Les points restants sont des optimisations SEO (longueurs de balises, hreflang) et des micro-corrections d'accessibilité, sans urgence critique.

| Domaine | État | Note |
|---|---|---|
| Structure HTML (doctype, lang, viewport) | Impeccable | 26/26 pages conformes |
| Données structurées JSON-LD | Impeccable | 0 bloc invalide sur l'ensemble du site |
| Liens internes | Impeccable | 0 lien mort |
| Images référencées | Impeccable | 0 image manquante |
| Sitemap / robots.txt | Impeccable | 25 URLs cohérentes, bots IA autorisés |
| CSS | Réparé | Équilibré (563/563), copie de référence créée |
| Balises title / meta description | Corrigé | 26/26 : titles ≤ 60, meta ≤ 155 (méthode Jordan Pearce) |
| Internationalisation (hreflang / canonical) | Résolu | canonical `.fr` + hreflang fr/x-default sur les 26 pages |
| Accessibilité images | Corrigé | 0 image sans `alt` (167/167) |
| Open Graph pages légales | Corrigé | og:title / description / url ajoutés |

## Ce qui est déjà impeccable

Toutes les pages ont un `<!DOCTYPE>`, `lang="fr"`, une balise `viewport`, un `canonical` (sauf la redirection `methode.html`, ce qui est normal), et des données structurées valides. Le maillage interne est complet et sans lien cassé. Le sitemap liste bien les 25 pages indexables et n'inclut aucune URL morte. Le fichier `robots.txt` autorise explicitement GPTBot, OAI-SearchBot, ChatGPT-User et ClaudeBot, cohérent avec la stratégie GEO. Les 15 articles ont chacun 7 questions FAQ ou plus, avec schémas `FAQPage`, `Article` et `BreadcrumbList`.

## Corrections appliquées (8 juillet 2026)

- **Titles réécrits** sur les 26 pages selon la méthode Jordan Pearce : sujet / service en tête, longueur ≤ 60 caractères, unique par page. Pages principales : service + géo (Malakoff / SEO local) ; articles : question-clé porteuse de mots-clés.
- **Meta descriptions réécrites** ≤ 155 caractères : différenciateur concret en première phrase, preuve + appel à l'action (« Diagnostic gratuit ») en seconde.
- **`alt=""` ajouté** sur tous les pixels de tracking Meta → 0 image sans alt (167/167).
- **Open Graph** ajouté sur les pages légales (mentions, confidentialité, conditions).
- **Vérifié** : 0 title > 60, 0 meta > 155, 0 JSON-LD invalide, 0 lien mort, 0 image manquante.

## Internationalisation — résolu

Décision : **ce site est la version française, servie sur `monsieurclick.fr`** ; la version anglaise arrivera sur `monsieurclick.com`. Appliqué sur les 26 pages :

- `canonical` basculé vers `https://monsieurclick.fr/…` (0 canonical en `.com`, sitemap 25 URLs `.fr`).
- `hreflang="fr"` + `hreflang="x-default"` ajoutés partout, pointant vers l'URL `.fr`.
- Schémas JSON-LD, Open Graph et images self-hébergées passés en `.fr`.
- Bouton de langue **EN conservé vers `monsieurclick.com`** (version anglaise future).
- Adresse e-mail `contact@monsieurclick.com` laissée inchangée (c'est un e-mail, pas une URL).

**À faire quand la version EN sera en ligne sur `.com`** : ajouter `hreflang="en"` pointant vers les pages `.com` correspondantes (fr ↔ en réciproques).

<details><summary>Détail des optimisations initialement détectées (désormais corrigées)</summary>

### Priorité 1 — SEO on-page (impact direct sur le taux de clic)

**Meta descriptions trop longues (> 160 caractères, tronquées dans Google).** À raccourcir à 150-155 caractères :

| Page | Longueur actuelle |
|---|---|
| click-first.html | 251 |
| index.html | 216 |
| realisations.html | 206 |
| a-propos.html | 195 |
| blog-geo-generative-engine-optimization.html | 185 |
| blog.html | 184 |
| 7 articles entre 164 et 175 | légèrement au-dessus |

**Balises title trop longues (> 60-62 caractères, tronquées).** Les plus critiques :

| Page | Longueur | Recommandation |
|---|---|---|
| click-first.html | 99 | Raccourcir fortement |
| index.html | 92 | Raccourcir |
| blog.html | 80 | Raccourcir |
| blog-site-suffit-2026.html | 78 | Alléger |
| Articles à 65-73 | légèrement long | Le suffixe « \| Monsieur Click » pousse au-delà de 60 |

### Priorité 2 — Internationalisation (FR/EN)

Les pages FR pointent leur `canonical` vers `https://monsieurclick.com/…`, alors que le sélecteur de langue désigne `monsieurclick.fr` comme version française active. Si le site FR est servi sur le domaine `.fr`, le canonical devrait pointer vers `.fr`, sinon Google risque de considérer la version `.com` comme prioritaire. **À arbitrer.** Recommandation complémentaire : ajouter de vraies balises `<link rel="alternate" hreflang="fr" …>` et `hreflang="en"` dans le `<head>` (actuellement les attributs `hreflang` ne figurent que sur les liens du menu, pas en tête de page).

### Priorité 3 — Accessibilité & légal (mineur)

- **Pixels de tracking sans `alt`** : les 25 occurrences sont toutes le pixel Meta 1×1 caché (`<noscript>`). Ajouter `alt=""` pour un score d'accessibilité parfait.
- **Pages légales** (mentions, conditions, confidentialité) : meta description courte (84-88 caractères) et pas de balises Open Graph. Non bloquant, mais un `og:title` / `og:description` améliorerait le partage social.

</details>

## Incident CSS — résolu

Deux corruptions détectées et corrigées dans `styles.css` :

1. un token `top` parasite en tête de fichier, avant `:root{`, qui neutralisait toutes les variables de marque (site affiché sans style) ;
2. la ligne d'ouverture `@media (max-width: 920px){` avait disparu, laissant ~20 règles mobiles orphelines et une accolade `}` en trop.

Les deux sont réparées. Une **copie de référence** a été créée : `styles.reference.css`. En cas de nouvel incident, restaurer avec :

```bash
cp styles.reference.css styles.css
```

Pensez aussi à supprimer manuellement `styles.css.bak` (créé pendant la réparation, non supprimable automatiquement).

## Rappels avant / après mise en ligne

- Pousser tous les fichiers `img-*.svg` à la racine du site (référencés en URL absolue dans les schémas Article).
- Resoumettre `sitemap.xml` dans Google Search Console.
- Vérifier le rendu avec cache vidé (Cmd+Shift+R).
