# TODO.md

## Avant mise en ligne (bloquant)
- [ ] Coller les scripts de suivi exacts dans le `<head>` (bloc commenté présent sur chaque page) : bandeau cookies (cookie-banner.ca), Sitebehaviour, Happierleads, NYTSYS, GA4/GTM éventuel. (IDs de compte requis, non récupérables au crawl.)
- [ ] Vérifier que les embeds GoHighLevel s'affichent bien en ligne (form `LRwuW0fwfpv9MbsZVZvi`, agenda `TCQmnhBdiixkS0q4jeLh`, `form_embed.js`).
- [ ] Faire valider les pages légales par un pro (mentions, confidentialité, conditions).

## Assets
- [ ] Localiser les captures d'études de cas (actuellement hotlink `monsieurclick.fr/images/case-studies/*`) → copier en local pour couper la dépendance au .fr.
- [ ] Portrait fondateur optionnel pour À propos (emplacement `brandcard`).
- [ ] Remplacer les avis d'exemple du fallback par de vrais avis (le widget EMR affiche les vrais en prod).

## Correctifs audit impeccable (voir audit-impeccable.md)
- [ ] P1 reveal-safety : contenu visible par défaut, animation seulement si JS (classe `.js` sur `<html>`).
- [ ] P1 longueur de ligne : `.prose` de 820px → ~68ch.
- [ ] P1 retirer le texte en dégradé `.intl-big` → couleur pleine.
- [ ] P1 retirer le filet gauche de `.q-strip` → carte / fond teinté.
- [ ] CHOIX à trancher : réduire la cadence des eyebrows (1/page) et des numéros 01→09 (garder sur vraies séquences).
- [ ] P2 : ghost-card (bordure OU ombre), rayons cartes 12–16px, `text-wrap:balance/pretty`, varier 1–2 entrées d'animation.

## Contenu / SEO
- [ ] Étendre le maillage interne à Click First et À propos.
- [ ] Rédiger de vrais articles de blog (autorité topique + citations IA).
- [ ] Ajouter `BreadcrumbList` sur les pages internes qui n'en ont pas encore.

## Version anglaise (monsieurclick.com)
- [ ] Décliner toutes les pages en EN (structure hreflang déjà prête).
