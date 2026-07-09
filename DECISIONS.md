# DECISIONS.md

Décisions structurantes et leur raison.

- **Marque Click First™ au centre.** On vend le package/méthode, pas des prestations à la carte, ni « une agence ». Le menu et l'URL portent « Click First » (`click-first.html`). On parle de « méthode » surtout sur cette page.
- **Rename `methode.html` → `click-first.html`.** URL de marque, meilleur SEO. Ancienne URL conservée en redirection (meta refresh + `noindex`), car suppression impossible (permissions du dossier).
- **Hub-and-spoke.** Une page pilier Click First qui réunit toutes les composantes ; on détachera une composante en page dédiée seulement si un mot-clé commercial le justifie (phase 2), pour ne pas diluer.
- **CRM hors socle.** L'automatisation CRM est une option vendue à part, pas une composante de Click First™ (demande client).
- **Composantes ajoutées à la méthode :** Technical SEO (dans Site), Données structurées Schema.org + OKF, Citations & cohérence NAP.
- **100 % à distance.** Jamais de présentiel (téléphone, Zoom, email). Corrigé partout.
- **Nom du fondateur.** Uniquement « Jean-Pierre Baguette » (légal + schéma), ou « JP ». Jamais « Jean-Pierre Michaël ». En copy marketing : « Monsieur Click » / « nous ».
- **International.** Pays francophones (FR, BE, CH, CA) + anglophones (US, UK), bilingue FR/EN. `areaServed` élargi.
- **Design.** Thème sombre navy + accents orange (CTA) et cyan/turquoise (IA/liens), Montserrat unique (Philosopher retiré), pleine largeur sur hero/nav, rythme varié (bandes showcase, timeline, tableau comparatif). Glassmorphism conservé sur `.btn-ghost` (demande explicite).
- **Images.** `hero-bg.webp` (image fournie, logo 3D intégré) sert hero + bandes + CTA. `logo-mc.webp` (logo plat) header/footer. Captures d'études de cas hotlinkées depuis monsieurclick.fr (à localiser). Les uploads du chat n'atterrissent pas sur le disque : on passe par le dossier connecté.
- **Schéma 2 niveaux** (site-level identique partout + page-level spécifique). Repris de l'approche monsieurclick.fr.
- **Formulaires = GoHighLevel** (embeds), pas Web3Forms. Le fallback Web3Forms a été retiré des pages.
- **Pages légales** reprises fidèlement de monsieurclick.fr (plus complètes) : SIRET, hébergeur Cloudflare, RGPD.
- **Audit impeccable** appliqué à la main (le skill n'est pas installable de façon persistante dans Cowork). Certains « bans » du skill sont des choix de marque assumés (eyebrows, numéros, glass) : listés dans l'audit, à trancher.
