# PROJECT.md — Monsieur Click / Click First™

## But
Site vitrine + acquisition pour **Monsieur Click**, créateur de la méthode **Click First™** (package SEO local + visibilité IA). Objectif : générer des diagnostics gratuits (leads) et installer la marque Click First™.

## Entreprise
- Nom commercial : Monsieur Click (créateur de Click First™). Ne jamais se définir comme « une agence ».
- Éditeur légal : entreprise individuelle Jean-Pierre Baguette. SIRET 42953906700042. (Nom légal uniquement dans schéma + pages légales, jamais en copy marketing.)
- Adresse (NAP) : 24 bis sentier des Fosses Rouges, 92240 Malakoff, France.
- Téléphone : +33 6 60 76 15 23 · Email : contact@monsieurclick.com.
- **100 % à distance** (téléphone, Zoom, email). Jamais de présentiel.
- Zones : pays francophones (France, Belgique, Suisse, Canada) + anglophones (États-Unis, Royaume-Uni). Bilingue FR/EN.
- Domaines : monsieurclick.fr (FR), monsieurclick.com (EN, à construire).
- Devise : EUR. Hébergeur (légal) : Cloudflare.

## Produit
**Click First™** = une seule méthode, jamais des prestations à la carte. Composantes : Site + Technical SEO, SEO local, Google Business Profile, Citations & NAP, Avis Google, Données structurées Schema.org + OKF, Visibilité IA (GEO : ChatGPT/Claude/Gemini/Perplexity), Contenus StoryBrand, Optimisation continue. **Automatisation CRM = option** (hors socle).

## Offres (3 portées)
| Offre | Cible | Prix | Engagement |
|---|---|---|---|
| Click First™ Essentiel | Site petit ou coach | 850 €/mois | 6 mois |
| Click First™ Développement (mise en avant) | Site artisan | 1 000 €/mois | 12 mois |
| Click First™ Expansion | Site entreprise | 1 500 €/mois | 12 mois |

Projet complet : 2 000 € à 20 000 €. Aucun paiement en ligne. Tout commence par un diagnostic gratuit (30 min).

## Stack technique
- HTML statique multi-pages + `styles.css` partagé + `shared.js` partagé.
- La home (`index.html`) a son propre JS inline (parcours au scroll, constellation, particules).
- Police : Montserrat (Google Fonts). Un seul système typographique.
- CRM / formulaires / agenda : **GoHighLevel (GHL)** via `link.monsieurclick.com` (embeds iframe + `form_embed.js`).
- Suivi : Meta Pixel `852496749984370` (posé). Autres à coller (voir TODO).
- Déploiement cible : Netlify / Vercel / OVH. Pousser tous les fichiers du dossier tels quels.

## Arborescence des fichiers
Pages : `index.html`, `click-first.html` (page pilier), `offres.html`, `realisations.html`, `a-propos.html`, `contact.html`, `blog.html`, `mentions-legales.html`, `confidentialite.html`, `conditions.html`. `methode.html` = redirection 301-like (meta refresh) vers `click-first.html`.
Assets partagés : `styles.css`, `shared.js`, `robots.txt`, `sitemap.xml`, `llms.txt`.
Images : `hero-bg.webp` (hero + CTA + bandes parallax), `logo-mc.webp` (logo plat header/footer), `section-1.webp` & `section-2.webp` (bandes showcase). Originaux conservés dans le dossier.
Docs : `audit-impeccable.md` + les fichiers de passation (ce set).

## État
Version FR complète et fonctionnelle. Reste : brancher les scripts de suivi, valider le légal, localiser les captures d'études de cas, appliquer les correctifs P1 de l'audit, puis version EN. Voir TODO.md.
