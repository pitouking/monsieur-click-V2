# Monsieur Click — conversion FR + EN (2026-11-12)

## Statut
Travail sur **branche de préparation uniquement**. Ne pas merger/déployer sans identifier le dépôt qui produit les artefacts Cloudflare actuels, puis lancer tests/builds et comparer avec le site live. Les deux productions restent inchangées.

## Production / restauration
- FR: Cloudflare Pages `monsieurclick-fr`, déploiement initial constaté `0874ccfd-97e4-42fe-8123-70b46fba0a78`, URL https://0874ccfd.monsieurclick-fr.pages.dev ; domaine monsieurclick.fr
- US: Cloudflare Pages `monsieurclick-com`, déploiement initial constaté `4edb38d6-bfa2-4027-a396-eced26951d96`, URL https://4edb38d6.monsieurclick-com.pages.dev ; domaine monsieurclick.com
- Les deux déploiements déclarent le commit `aa9fc14f93106ed9bddc9d0be1bef8b3cfc3f2c1` avec `commit_dirty=true`, absent de plusieurs dépôts GitHub Monsieur Click consultés. **Source de vérité non établie.**
- À conserver: IDs Cloudflare, export de la configuration Pages, branche et SHA du code réellement publié. Ne jamais remplacer les bindings D1, secrets ni routes de production au cours d'un rollback.
- Un retour arrière doit restaurer l'artefact Cloudflare précédent après vérification des règles de promotion du projet, et non simplement un vieux commit GitHub.

## Changements préparés
- FR et US : hero plus direct, CTA diagnostic en premier, outil Score Click First en deuxième.
- FR et US : bloc de réassurance ancré sur une référence réelle Dharma, sans allégation non vérifiée de réservations supplémentaires.
- Non traité: refonte complète de l'architecture et des prix, GHL booking, GA4 tracking, CRO tests, migration sur code live.

## Preuves Dharma
Source : SEO Crawl / Google Search Console, comparaison de périodes successives fournies par la plateforme :
- Période récente 2026-08-11 au 2026-11-11 : 561 clics, 13 229 impressions, position moyenne 10,5945.
- Période antérieure 2026-05-10 au 2026-08-10 : 498 clics, 13 173 impressions, position moyenne 11,4264.
- Évolution calculée : clics +63 soit +12,65%, impressions +56 soit +0,43%, amélioration de position moyenne ~0,83. Attention, les données récentes peuvent être partielles (dernière journée synchronisée 2026-11-08).
- Ce n'est **pas** une comparaison propre avant/après fin mai puisque les périodes sont postérieures/chevauchantes.
- GA4 Dharma 2026-08-01..10-31 vs 2026-05-01..07-31 : 11 vs 5 conversions GA4 mais ces fenêtres se chevauchent et l'événement « conversion » n'est pas confirmé comme réservation. NE PAS affirmer « +120% de rendez-vous ».
- Pour démontrer les rendez-vous : extraire de l'outil de booking les réservations nettes (hors annulations/doublons/spam), avec source/UTM et période comparable, puis publier seulement les chiffres corroborés.

## Mesures à instrumenter sur les deux sites
1. GA4 `cta_click`: `site_locale`, `cta_position`, `cta_label`, `destination`, `page_path`.
2. `booking_widget_open` (ou `booking_page_view`) quand le calendrier s'ouvre réellement.
3. `booking_confirmed` uniquement sur confirmation serveur/GHL, avec ID d'événement dédupliqué et pas de PII dans GA4.
4. `lead_qualified`, `proposal_sent`, `deal_won` par CRM, avec attribution conservée. Ne pas envoyer d'informations personnelles à GA4.
5. Vérifier CMP / Consent Mode avant toute émission d'événements destinés à Google.
6. UTM source/medium/campaign et gclid/fbclid sauvegardés si autorisés, sans stockage abusif.
7. GA4 Exploration par page d'entrée, appareil et source ; Clarity pour repérer hésitations et faux clics, avec masquage des données sensibles.

KPI de succès principal: rendez-vous confirmés et qualifiés / sessions qualifiées. KPI secondaires: taux clic CTA, ouvertures agenda, abandons agenda, prise de contact, devis, contrats signés.

## Plan de vérification pré-production (FR + EN)
- Vérifier `npm ci && npm run build:fr && npm run build:com` sur la branche et l'absence d'erreurs Astro.
- Faire comparer par un diff de contenu les pages de production actuelles vs HTML généré; ne pas écraser des changements présents uniquement sur la prod.
- Tester manuellement desktop/mobile les H1, CTA, ancres `#parlons`, calculateur Score, pages réalisations/case-studies, navigation.
- Vérifier la présence et le fonctionnement des formulaires, consentement cookies, calendrier GHL, événements GA4, et état des appels CRM.
- Lighthouse/axe WCAG, responsive 320/375/768/1440px, CLS, navigation clavier, reduced-motion.
- Crawl: GET automatisé de https://monsieurclick.fr/ retournait 403 le 2026-11-11 vers 23:12 UTC ; tester Cloudflare WAF et Googlebot vérifié avant modifications SEO. L'accès utilisateur et le crawl Google ne sont pas prouvés bloqués par ce seul résultat.
- Appliquer test A/B séquentiel si volume suffisant; sinon sessions/entretiens utilisateurs.

## Priorités de prochaine intégration
P0 déterminer repo/commit actuel et traiter éventuel faux blocage bot de Cloudflare.
P1 preuve Dharma vérifiable, CTA principal, offre de diagnostic et instrumenter la réservation réelle.
P2 page offres (coûts totaux et conditions de propriété), étude de cas complète, navigation et mobile.
P3 variantes, tests A/B, animations respectant reduced-motion.

Aucune publication en production tant que P0 + build + QA ne sont pas validés.
