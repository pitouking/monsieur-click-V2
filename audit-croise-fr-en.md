# Audit croisé FR + EN — monsieurclick.fr & monsieurclick.com

_Audit technique, SEO et cohérence bilingue des deux sites._
_Date : 9 juillet 2026._

## Verdict global

Les deux sites sont **impeccables**. Après reconstruction de l'accueil FR (corrompu par un formateur), aucune anomalie ne subsiste : structure, données structurées, liens, images, SEO on-page et internationalisation sont tous conformes.

| Contrôle | FR (26 pages) | EN (27 pages) |
|---|---|---|
| JSON-LD valide | 0 erreur | 0 erreur |
| Liens internes | 0 lien mort | 0 lien mort |
| Images locales | 0 manquante | 0 manquante |
| Attribut `alt` | 168/168 | 165/165 |
| Emojis dans le contenu | 0 | 0 |
| `lang` correct | fr partout | en partout |
| `viewport` | présent partout | présent partout |
| `canonical` | `.fr` partout | `.com` partout |
| `hreflang` (fr / en / x-default) | complet | complet |
| Titles ≤ 60 caractères | conforme | conforme |
| Meta descriptions ≤ 155 | conforme | conforme |
| Titres / metas dupliqués | aucun | aucun |
| CSS (équilibre accolades) | OK | OK |

## Parité bilingue

Appariement **fr ↔ en complet** : chaque page FR a son équivalent EN et inversement (accueil, Click First, offres/pricing, contact, à-propos/about, réalisations/case studies, blog + 15 articles, mentions/legal, confidentialité/privacy, conditions/terms, redirection methode). Les balises `hreflang` sont réciproques : les pages FR pointent vers `.com`, les pages EN vers `.fr`, avec `x-default` sur le FR.

`en/tracking-head.html` n'est pas une page : c'est le bloc de tracking de référence (à coller dans le `<head>`), volontairement hors périmètre d'audit.

## Incident accueil FR — résolu

L'`index.html` FR a été **gravement corrompu** par un formateur automatique (éditeur / format-on-save) :

- tout le `<head>` avait été vidé (plus de `title`, meta, `canonical`, `hreflang`, Open Graph, JSON-LD, Meta Pixel) ;
- `lang="en"` au lieu de `fr` ;
- feuille de style pointée sur `styles.reference.css` (la sauvegarde) au lieu de `styles.css` ;
- **tout le JavaScript inline supprimé** (parcours client, révélation au scroll, menu mobile, constellation, particules) → page non fonctionnelle.

L'accueil a été **entièrement reconstruit** depuis la version propre : head complet (SEO + schémas + pixel), `lang="fr"`, `styles.css`, et JavaScript restauré (parcours à 7 scènes, animations, menu). JS revalidé, JSON-LD valide.

**Recommandation forte** : désactivez le formatage HTML automatique à l'enregistrement pour ce dossier (Prettier / format-on-save de l'éditeur), ou excluez `index.html`. C'est la même cause que l'incident CSS précédent (`top` parasite). En cas de rechute, restaurez avec la copie de référence `styles.reference.css` pour le CSS.

## Images des case studies

Les 7 images (Assogym, Dharma, Susan Filan, Bodyguard Paris, Heather Fillmore, Studio La Voix du 12, East Portland Sash) sont désormais **locales et référencées en chemin racine relatif**, présentes à la racine du `.fr` et de `en/` (`.com`). Les deux sites sont autonomes (affichage garanti hors ligne, aucune dépendance cross-domaine).

## Tracking (EN)

Chaque page EN embarque le stack complet : GA4 `G-F3D55VM422`, Meta Pixel, cookie-banner, GoHighLevel (token), NYTSYS, Sitebehaviour, Happierleads. Formulaire EN GoHighLevel `K7GBz…` sur l'accueil et le contact.

## Rappels avant / après mise en ligne

- Déployer le contenu de `en/` à la racine de `monsieurclick.com`.
- Pousser les `img-*.svg` et les 7 `*.webp` de case studies à la racine de chaque domaine.
- Resoumettre les deux `sitemap.xml` (`.fr` et `.com`) dans Search Console.
- Désactiver le formateur HTML destructeur pour éviter une nouvelle corruption de l'accueil.
