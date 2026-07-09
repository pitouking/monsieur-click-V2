# Version anglaise (monsieurclick.com) — gabarit

Ce dossier `en/` est le **gabarit de la version anglaise**, destinée à la **racine de `monsieurclick.com`**.
Il est autoportant : les assets (`styles.css`, `.webp`, `img-*.svg`, logo) y sont copiés, donc il se prévisualise seul et se déploie tel quel.

## Déploiement

Copiez le **contenu** du dossier `en/` (pas le dossier lui-même) à la racine web de `monsieurclick.com`.
Les chemins d'assets sont relatifs (`styles.css`, `logo-mc.webp`…), donc tout fonctionne à la racine.

## Fait

- `index.html` — **homepage EN complète** (traduction intégrale : hero, parcours client, Click First, offres, international, avis, approche, FAQ, CTA, footer + JS).
- Head EN : `title` (46 car.), meta (141 car.), `canonical` `.com`, Open Graph, JSON-LD (Organization, WebSite, FAQPage, WebPage) en `en-US`.
- `hreflang` réciproque : `en` → `.com`, `fr` → `.fr`, `x-default` → `.fr`.
- Sélecteur de langue : EN actif, FR pointe vers `monsieurclick.fr`.

## À construire ensuite (EN)

Mêmes fichiers que la version FR, à traduire sur la même structure/classes :
`click-first.html`, `offres.html`, `realisations.html`, `a-propos.html`, `contact.html`,
`blog.html` + les 15 articles, `mentions-legales.html`, `confidentialite.html`, `conditions.html`.

Quand ces pages EN existeront :
1. remplacer les liens de nav/footer (déjà nommés `click-first.html`, etc.) — ils fonctionneront automatiquement ;
2. **ajouter `hreflang="en"` réciproque sur les pages FR** (`.fr` → page `.com` correspondante) ;
3. générer un `sitemap.xml` propre au `.com`.

## Points à adapter avant mise en ligne

- **Formulaire** : l'iframe GoHighLevel est le formulaire FR (`data-form-name="Contact form EN"`). Remplacez-le par un formulaire EN si vous en avez un.
- **Widget avis** : `review.monsieurclick.com` conservé (mêmes avis Google). Les avis de secours sont traduits.
- **Prix** : conservés en euros (€) — facturation en euros. Adaptez si vous facturez en USD/GBP pour le marché EN.
- **Pixel Meta / suivi** : mêmes IDs que le FR ; créez un flux séparé si vous voulez distinguer FR/EN.

## Glossaire de traduction (cohérence)

| Français | English |
|---|---|
| Click First™ | Click First™ (inchangé) |
| Diagnostic gratuit | Free audit |
| Offres | Pricing |
| Réalisations | Case studies |
| À propos | About |
| SEO local / Référencement local | Local SEO |
| Référencement naturel | Organic SEO |
| Fiche Google Business Profile | Google Business Profile |
| Avis Google | Google Reviews |
| Visibilité IA | AI visibility |
| Données structurées | Structured data |
| Pages de service | Service pages |
| Pages locales | Location pages |
| Veille permanente | Continuous monitoring |
| Le pack local | The local pack |
| Être trouvé / recommandé / choisi | Get found / recommended / chosen |
