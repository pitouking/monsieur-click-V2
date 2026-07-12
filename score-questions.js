// Click First™ Score — banque de questions (source unique : poids + libellés)
// Importé côté client (wizard) et côté serveur (functions/_lib/scoring.js).
// Ne jamais dupliquer ces poids ailleurs : le score doit toujours venir d'ici.

export const MODULES = [
  { key: 'site', label: 'Site & Technique', icon: 'monitor' },
  { key: 'seo', label: 'Référencement naturel (SEO)', icon: 'search' },
  { key: 'gbp', label: 'Google Business Profile', icon: 'pin' },
  { key: 'ia', label: 'Visibilité IA (GEO)', icon: 'spark' },
  { key: 'confiance', label: 'Confiance', icon: 'shield' }
];

export const QUESTIONS = [
  { id: 'site-https', module: 'site', weight: 2, text: 'Votre site est-il en HTTPS (cadenas sécurisé dans le navigateur) ?' },
  { id: 'site-responsive', module: 'site', weight: 3, text: 'Votre site s\'affiche-t-il parfaitement sur mobile (responsive) ?' },
  { id: 'site-cwv', module: 'site', weight: 5, text: 'Votre site passe-t-il les Core Web Vitals de Google (vitesse, stabilité) ?' },
  { id: 'site-speed', module: 'site', weight: 4, text: 'Votre site se charge-t-il en moins de 3 secondes ?' },
  { id: 'site-nav', module: 'site', weight: 3, text: 'La navigation et la structure des pages sont-elles claires pour un visiteur ?' },
  { id: 'site-cta', module: 'site', weight: 4, text: 'Chaque page a-t-elle un appel à l\'action (CTA) clair et visible ?' },
  { id: 'site-storybrand', module: 'site', weight: 5, text: 'Un visiteur comprend-il en 5 secondes ce que vous faites et pour qui ?' },

  { id: 'seo-title', module: 'seo', weight: 5, text: 'Chaque page a-t-elle une balise Title unique et optimisée ?' },
  { id: 'seo-meta', module: 'seo', weight: 3, text: 'Chaque page a-t-elle une meta description rédigée ?' },
  { id: 'seo-h1', module: 'seo', weight: 3, text: 'Chaque page a-t-elle un seul H1 clair ?' },
  { id: 'seo-hn', module: 'seo', weight: 2, text: 'La hiérarchie des titres (H2, H3...) est-elle cohérente ?' },
  { id: 'seo-maillage', module: 'seo', weight: 5, text: 'Vos pages sont-elles reliées entre elles par des liens internes pertinents ?' },
  { id: 'seo-pages-services', module: 'seo', weight: 6, text: 'Avez-vous une page dédiée par service ou prestation ?' },
  { id: 'seo-pages-villes', module: 'seo', weight: 7, text: 'Avez-vous des pages dédiées par ville ou zone d\'intervention ?' },

  { id: 'gbp-revendiquee', module: 'gbp', weight: 8, text: 'Votre fiche Google Business Profile est-elle revendiquée et vérifiée ?' },
  { id: 'gbp-categorie', module: 'gbp', weight: 6, text: 'Votre catégorie principale décrit-elle précisément votre activité ?' },
  { id: 'gbp-categories-sec', module: 'gbp', weight: 3, text: 'Avez-vous renseigné des catégories secondaires pertinentes ?' },
  { id: 'gbp-photos', module: 'gbp', weight: 4, text: 'Votre fiche contient-elle au moins 10 photos récentes ?' },
  { id: 'gbp-note', module: 'gbp', weight: 6, text: 'Votre note moyenne est-elle de 4,5 ou plus ?' },
  { id: 'gbp-reponses-avis', module: 'gbp', weight: 5, text: 'Répondez-vous systématiquement aux avis (positifs et négatifs) ?' },
  { id: 'gbp-posts', module: 'gbp', weight: 4, text: 'Publiez-vous régulièrement des posts sur votre fiche Google ?' },

  { id: 'ia-schema', module: 'ia', weight: 8, text: 'Votre site contient-il des données structurées Schema.org (Organization/LocalBusiness) ?' },
  { id: 'ia-faq-schema', module: 'ia', weight: 4, text: 'Vos pages clés ont-elles un balisage FAQPage ?' },
  { id: 'ia-breadcrumb', module: 'ia', weight: 3, text: 'Vos pages ont-elles un balisage BreadcrumbList (fil d\'Ariane) ?' },
  { id: 'ia-llms-txt', module: 'ia', weight: 5, text: 'Votre site a-t-il un fichier llms.txt ?' },
  { id: 'ia-robots', module: 'ia', weight: 6, text: 'Votre robots.txt autorise-t-il les robots IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) ?' },
  { id: 'ia-cite', module: 'ia', weight: 5, text: 'Avez-vous déjà vérifié si ChatGPT, Claude, Gemini ou Perplexity vous citent ?' },
  { id: 'ia-entites', module: 'ia', weight: 4, text: 'Votre nom, votre marque et votre localisation sont-ils écrits de façon identique partout ?' },

  { id: 'confiance-nap', module: 'confiance', weight: 7, text: 'Votre Nom, Adresse et Téléphone (NAP) sont-ils identiques partout (site, fiche Google, annuaires) ?' },
  { id: 'confiance-social', module: 'confiance', weight: 3, text: 'Vos réseaux sociaux sont-ils actifs et à jour ?' },
  { id: 'confiance-citations', module: 'confiance', weight: 4, text: 'Votre entreprise est-elle listée sur des annuaires locaux pertinents ?' },
  { id: 'confiance-rgpd', module: 'confiance', weight: 2, text: 'Avez-vous une politique de confidentialité conforme RGPD ?' },
  { id: 'confiance-tiers', module: 'confiance', weight: 3, text: 'Avez-vous des mentions ou avis sur des plateformes tierces (presse, annuaires spécialisés) ?' },
  { id: 'confiance-avis-nb', module: 'confiance', weight: 5, text: 'Avez-vous au moins 20 avis Google au total ?' },
  { id: 'confiance-reactivite', module: 'confiance', weight: 2, text: 'Annoncez-vous et respectez-vous un délai de réponse rapide (moins de 24h) ?' }
];
