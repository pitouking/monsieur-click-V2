#!/usr/bin/env python3
"""Hand-calibrated meta titles/descriptions for FR + EN (local CTR formula)."""
import json
import re
from pathlib import Path

ROOT_FR = Path(__file__).resolve().parents[1]
ROOT_EN = ROOT_FR.parent / "en"

TAIL_FR = " Note 5/5 sur 15 avis. Diagnostic gratuit."  # 42
TAIL_EN = " Rated 5/5 by 15+ clients. Free diagnostic."  # 43
TAIL_FR_BOOK = " Note 5/5 sur 15 avis. Réservez maintenant."  # 43
TAIL_EN_BOOK = " Rated 5/5 by 15+ clients. Book now."  # 36

# Single pads only (never chain). Applied if s1+tail < 140.
PADS_FR = [
    " Sans jargon.",
    " Pour TPE/PME.",
    " Click First™.",
    " 100% à distance.",
    " Sans promesse de n°1.",
    " Accompagnement direct.",
    " Plan mensuel clair.",
    " Résultats mesurables.",
    " Basés à Malakoff (92).",
    " Suivi mensuel inclus.",
]
PADS_EN = [
    " No jargon.",
    " For local SMBs.",
    " Click First™.",
    " Fully remote.",
    " No ranking guarantees.",
    " Direct owner support.",
    " Clear monthly plan.",
    " Measurable results.",
    " Based near Paris.",
    " Monthly reporting included.",
]


def L(s: str) -> int:
    return len(
        s.replace("&amp;", "&")
        .replace("&#39;", "'")
        .replace("&apos;", "'")
    )


def make(s1: str, tail: str, pads: list[str], lo: int = 140, hi: int = 155) -> str:
    """Build description; one pad max if short; never cut the proof/CTA tail."""
    s1 = s1.rstrip()
    candidates = [s1 + tail]
    for p in pads:
        candidates.append(s1 + p + tail)
    good = [c for c in candidates if lo <= L(c) <= hi]
    if good:
        preferred = [c for c in good if L(c) >= 145] or good
        return min(preferred, key=L)
    under = [c for c in candidates if L(c) <= hi]
    if under:
        best = max(under, key=L)
        if L(best) >= lo - 2:
            return best
    raise ValueError(
        f"D{L(candidates[0])} cannot fit {lo}-{hi}: {s1!r} -> {[L(c) for c in candidates[:6]]}"
    )


FR: dict[str, dict[str, str]] = {}
EN: dict[str, dict[str, str]] = {}


def add_fr(path: str, title: str, s1: str, tail: str = TAIL_FR) -> None:
    assert L(title) <= 60, f"T{L(title)} {title}"
    FR[path] = {"title": title, "description": make(s1, tail, PADS_FR)}


def add_en(path: str, title: str, s1: str, tail: str = TAIL_EN) -> None:
    assert L(title) <= 60, f"T{L(title)} {title}"
    EN[path] = {"title": title, "description": make(s1, tail, PADS_EN)}


def add_legal(store: dict, path: str, title: str, desc: str) -> None:
    assert L(title) <= 60, f"T{L(title)} {title}"
    assert L(desc) <= 155, f"D{L(desc)} {desc}"
    store[path] = {"title": title, "description": desc}


# ——— FR ———
add_fr(
    "index.html",
    "Agence SEO à Malakoff (92) | Monsieur Click",
    "SEO local et sites pour TPE/PME à Malakoff et en Île-de-France, sans jargon inutile.",
)
add_fr(
    "click-first.html",
    "Méthode SEO Click First™ | Monsieur Click",
    "Site, SEO local, fiche Google et visibilité IA réunis en un système à Malakoff (92).",
)
add_fr(
    "offres.html",
    "Tarifs SEO local dès 850€/mois | Monsieur Click",
    "Offres Click First™ pour TPE/PME : site, SEO local et GBP dès 850€/mois, sans surprise.",
)
add_fr(
    "contact.html",
    "Diagnostic SEO gratuit à Malakoff | Monsieur Click",
    "Audit gratuit de 30 min sur Google, Maps et IA. Basés à Malakoff (92), 100% à distance.",
    TAIL_FR_BOOK,
)
add_fr(
    "a-propos.html",
    "Agence SEO Malakoff (92) | À propos Monsieur Click",
    "Jean-Pierre Baguette, créateur de Click First™ à Malakoff. Google et IA pour TPE/PME.",
)
add_fr(
    "blog/index.html",
    "Blog SEO local & GEO | Monsieur Click",
    "Guides SEO local, fiche Google et visibilité IA pour TPE/PME en Île-de-France, concrets.",
)
add_fr(
    "blog.html",
    "Blog SEO local & GEO | Monsieur Click",
    "Guides SEO local, fiche Google et visibilité IA pour TPE/PME en Île-de-France, concrets.",
)
add_fr(
    "services/index.html",
    "Services SEO & web à Malakoff | Monsieur Click",
    "Création de site, SEO, SEO local, GBP et GEO pour TPE/PME. Agence à Malakoff (92).",
)
add_fr(
    "services/creation-site-web/index.html",
    "Création de site web | Monsieur Click Malakoff",
    "Sites rapides et SEO-ready pour TPE/PME en Île-de-France. Conversion et Core Web Vitals.",
)
add_fr(
    "services/seo/index.html",
    "Référencement naturel SEO | Monsieur Click",
    "SEO technique, contenu et suivi mensuel pour TPE/PME à Malakoff et partout en France.",
)
add_fr(
    "services/seo-local/index.html",
    "SEO local & Google Maps | Monsieur Click",
    "Pack local, fiche Google et avis pour dominer Maps en Île-de-France, sans porte-à-porte.",
)
add_fr(
    "services/google-business-profile/index.html",
    "Optimisation Google Business Profile | MC",
    "Fiche Google complète : avis, photos et posts. Plus d'appels Maps pour TPE/PME locales.",
)
add_fr(
    "services/audit-seo/index.html",
    "Audit SEO complet | Monsieur Click Malakoff",
    "Audit technique, on-page et concurrentiel pour TPE/PME. Plan d'action priorisé et lisible.",
)
add_fr(
    "services/refonte-site-web/index.html",
    "Refonte de site web SEO | Monsieur Click",
    "Refonte rapide, mobile et orientée conversion pour TPE/PME en Île-de-France et au-delà.",
)
add_fr(
    "services/creation-site-wordpress/index.html",
    "Création site WordPress | Monsieur Click",
    "WordPress sur mesure, rapide et éditable, SEO intégré pour TPE/PME en Île-de-France.",
)
add_fr(
    "services/visibilite-ia-geo/index.html",
    "Visibilité IA (GEO) | Monsieur Click Malakoff",
    "Soyez cités par ChatGPT, Gemini et Perplexity. GEO concret pour TPE/PME locales.",
)
add_fr(
    "agence-seo-paris/index.html",
    "Agence SEO à Paris | Monsieur Click",
    "Référencement naturel et local pour TPE/PME à Paris. Basés à Malakoff (92), suivi mensuel.",
)
add_fr(
    "agence-web-paris/index.html",
    "Agence web à Paris | Monsieur Click",
    "Création de site et SEO pour entreprises parisiennes. Agence à Malakoff (92), à distance.",
)
add_fr(
    "creation-site-internet-paris/index.html",
    "Création site internet Paris | Monsieur Click",
    "Site vitrine SEO à Paris pour TPE/PME. Rapide, mobile et orienté demandes clients.",
)
add_fr(
    "consultant-seo-paris/index.html",
    "Consultant SEO à Paris | Jean-Pierre Baguette",
    "Accompagnement SEO direct pour TPE/PME à Paris et en IDF. Méthode Click First™ claire.",
)
add_fr(
    "agence-seo-ile-de-france/index.html",
    "Agence SEO Île-de-France | Monsieur Click",
    "SEO local pour TPE/PME en IDF : Paris et banlieue. Fiche Google et Maps inclus.",
)
add_fr(
    "agence-seo-belgique/index.html",
    "Agence SEO en Belgique | Monsieur Click",
    "SEO et SEO local pour TPE/PME en Belgique, 100% à distance et en français clair.",
)
add_fr(
    "agence-seo-bruxelles/index.html",
    "Agence SEO à Bruxelles | Monsieur Click",
    "Référencement naturel et local pour TPE/PME à Bruxelles. Suivi mensuel clair et direct.",
)
add_fr(
    "agence-seo-suisse/index.html",
    "Agence SEO en Suisse | Monsieur Click",
    "SEO local et visibilité IA pour TPE/PME en Suisse romande, 100% à distance.",
)
add_fr(
    "agence-seo-geneve/index.html",
    "Agence SEO à Genève | Monsieur Click",
    "Référencement et fiche Google pour TPE/PME à Genève. Accompagnement en français.",
)
add_fr(
    "realisations/index.html",
    "Réalisations SEO local | Monsieur Click",
    "7 études de cas SEO et sites pour TPE/PME. Résultats concrets avec Click First™.",
)
add_fr(
    "realisations/assogym/index.html",
    "Cas client Assogym SEO | Monsieur Click",
    "Assogym : club de fitness rendu visible sur Google Maps. Étude de cas Click First™.",
)
add_fr(
    "realisations/dharma-massage-therapy/index.html",
    "Cas Dharma Massage | Monsieur Click",
    "Dharma Massage Therapy : site et SEO local alignés sur un positionnement premium.",
)
add_fr(
    "realisations/susan-filan/index.html",
    "Cas Susan Filan SEO | Monsieur Click",
    "Susan Filan : site et autorité SEO pour une avocate senior. Étude de cas détaillée.",
)
add_fr(
    "realisations/bodyguard-paris/index.html",
    "Cas Bodyguard Paris SEO | Monsieur Click",
    "Bodyguard Paris : visibilité Google hors bouche-à-oreille. Étude de cas SEO local.",
)
add_fr(
    "realisations/heather-fillmore-coaching/index.html",
    "Cas Heather Fillmore | Monsieur Click",
    "Heather Fillmore Coaching : +200% de trafic organique avec la méthode Click First™.",
)
add_fr(
    "realisations/studio-la-voix-du-12/index.html",
    "Cas Studio La Voix du 12 | Monsieur Click",
    "Studio à Montpellier : d'une page vide à une présence Google crédible et locale.",
)
add_fr(
    "realisations/east-portland-sash/index.html",
    "Cas East Portland Sash | Monsieur Click",
    "Artisan Portland : SEO local pour la restauration de fenêtres bois anciennes.",
)
add_fr(
    "glossaire/index.html",
    "Glossaire SEO & GEO | Monsieur Click",
    "Définitions SEO local, GEO et Google Business Profile pour TPE/PME, sans jargon.",
)
add_fr(
    "glossaire/seo-local/index.html",
    "SEO local : définition | Monsieur Click",
    "Le SEO local = Maps et pack local. Définition claire pour TPE/PME qui veulent des appels.",
)
add_fr(
    "glossaire/optimisation-moteurs-generatifs/index.html",
    "GEO : définition | Monsieur Click",
    "GEO : être cité par ChatGPT, Gemini et Perplexity. Définition utile pour PME locales.",
)
add_fr(
    "glossaire/google-business-profile/index.html",
    "Google Business Profile | Glossaire MC",
    "Fiche Google Maps et pack local : définition et bonnes pratiques pour TPE/PME.",
)
add_fr(
    "blog/click-first-pas-une-prestation-seo/index.html",
    "Click First™ vs SEO isolé | Monsieur Click",
    "Pourquoi un SEO isolé plafonne. La méthode Click First™ pour TPE/PME locales.",
)
add_fr(
    "blog/geo-generative-engine-optimization/index.html",
    "GEO pour entreprises | Monsieur Click",
    "Optimisez votre présence pour ChatGPT, Gemini et Perplexity dès 2026, sans gadget.",
)
add_fr(
    "blog/ia-vont-elles-remplacer-google/index.html",
    "Les IA vont-elles remplacer Google ? | MC",
    "Les IA changent le parcours client, pas Google. Ce que les TPE/PME doivent faire ensuite.",
)
add_fr(
    "blog/entreprise-reference-plutot-que-visible/index.html",
    "Devenir une référence locale | Monsieur Click",
    "Visible ne suffit pas : devenez l'entreprise citée sur Google et par les IA locales.",
)
add_fr(
    "blog/obtenir-plus-avis-google/index.html",
    "Obtenir plus d'avis Google | Monsieur Click",
    "Système simple d'avis Google sans harceler vos clients. Réputation locale durable.",
)
add_fr(
    "blog/site-internet-perd-clients/index.html",
    "Site qui perd des clients | Monsieur Click",
    "10 signes que votre site fait fuir les demandes. Correctifs concrets pour TPE/PME.",
)
add_fr(
    "blog/pourquoi-concurrents-devant-google/index.html",
    "Concurrents devant vous sur Google | MC",
    "Ils envoient plus de signaux de confiance. 5 leviers pour les dépasser en local.",
)
add_fr(
    "blog/apparaitre-reponses-chatgpt-gemini-perplexity/index.html",
    "Apparaître dans ChatGPT & Gemini | MC",
    "Devenez la source citée par les IA. Stratégie GEO concrète pour TPE/PME locales.",
)
add_fr(
    "blog/clients-utilisent-chatgpt-avant-google/index.html",
    "Clients sur ChatGPT avant Google | MC",
    "Vos prospects demandent aux IA d'abord. Comment rester le choix recommandé en local.",
)
add_fr(
    "blog/google-ads-ou-seo/index.html",
    "Google Ads ou SEO pour PME | Monsieur Click",
    "Ads pour la vitesse, SEO pour la durée. Où placer votre budget marketing en 2026.",
)
add_fr(
    "blog/trouver-clients-sans-publicite/index.html",
    "Clients sans publicité | Monsieur Click",
    "Système de visibilité durable : SEO local, avis et GBP sans dépendre des ads payantes.",
)
add_fr(
    "blog/fiche-google-business-profile-sans-appel/index.html",
    "Fiche Google sans appel | Monsieur Click",
    "Visible sur Maps mais aucun appel ? Correctifs avis, photos, posts et NAP cohérent.",
)
add_fr(
    "blog/comment-google-classe-les-entreprises/index.html",
    "Comment Google classe les entreprises | MC",
    "5 critères du classement local Google. Optimisez pour le pack Maps, pas pour le vanity.",
)
add_fr(
    "blog/pourquoi-entreprise-invisible-google/index.html",
    "Entreprise invisible sur Google | MC",
    "7 raisons d'invisibilité locale et correctifs concrets pour TPE/PME qui veulent des appels.",
)
add_fr(
    "blog/site-suffit-2026/index.html",
    "Un site suffit-il en 2026 ? | Monsieur Click",
    "Non : il faut SEO local, avis, GBP et GEO. Stratégie complète pour PME locales.",
)
add_fr(
    "blog/c-est-quoi-une-agence-seo/index.html",
    "C'est quoi une agence SEO ? | Monsieur Click",
    "Rôle, missions et limites d'une agence SEO pour TPE/PME. Guide clair, sans hype.",
)
add_fr(
    "blog/comment-choisir-agence-seo-paris/index.html",
    "Choisir une agence SEO à Paris | MC",
    "8 critères pour sélectionner une agence SEO à Paris sans mauvaises surprises.",
)
add_fr(
    "blog/prix-tarif-agence-seo-2026/index.html",
    "Prix agence SEO 2026 | Monsieur Click",
    "Fourchettes réalistes et offres dès 850€/mois. Lisez un devis SEO sans surprise.",
)
add_fr(
    "methode.html",
    "Méthode SEO Click First™ | Monsieur Click",
    "Site, SEO local, fiche Google et visibilité IA réunis en un système à Malakoff (92).",
)

add_legal(
    FR,
    "mentions-legales.html",
    "Mentions légales | Monsieur Click Malakoff",
    "Mentions légales Monsieur Click, Malakoff (92). SIRET 42953906700042. Contact, hébergeur et éditeur du site.",
)
add_legal(
    FR,
    "confidentialite.html",
    "Confidentialité RGPD | Monsieur Click",
    "Politique de confidentialité et données personnelles sur monsieurclick.fr. Conformité RGPD et cookies.",
)
add_legal(
    FR,
    "conditions.html",
    "Conditions générales | Monsieur Click",
    "CGV des offres Click First™ : engagement, facturation, résiliation et modalités de service pour TPE/PME.",
)
add_legal(
    FR,
    "404.html",
    "Page introuvable | Monsieur Click",
    "Cette page n'existe pas. Retournez à l'accueil Monsieur Click ou demandez un diagnostic SEO gratuit.",
)

# ——— EN ———
add_en(
    "index.html",
    "Local SEO Agency near Paris | Monsieur Click",
    "Local SEO, web design and AI visibility for small businesses near Paris, France.",
)
add_en(
    "click-first.html",
    "Click First™ Local SEO Method | Monsieur Click",
    "Website, local SEO, GBP and AI visibility in one system near Paris for SMBs.",
)
add_en(
    "pricing.html",
    "Local SEO Plans from €850/mo | Monsieur Click",
    "Essential, Growth and Expansion plans for small businesses. Website, SEO and GBP.",
)
add_en(
    "contact.html",
    "Free SEO Diagnostic near Paris | Monsieur Click",
    "30-min free audit of Google, Maps and AI visibility. Remote from Malakoff (92).",
    TAIL_EN_BOOK,
)
add_en(
    "about.html",
    "About Monsieur Click | Local SEO near Paris",
    "Jean-Pierre Baguette, creator of Click First™ in Malakoff. Google and AI for SMBs.",
)
add_en(
    "blog/index.html",
    "Local SEO & GEO Blog | Monsieur Click",
    "Practical guides on local SEO, Google Business Profile and AI visibility for SMBs.",
)
add_en(
    "services/index.html",
    "SEO & Web Design Services | Monsieur Click",
    "Web design, local SEO, GBP and GEO for US and UK small businesses. Clear monthly plans.",
)
add_en(
    "services/web-design/index.html",
    "Web Design for Small Business | Monsieur Click",
    "Fast, conversion-first websites built to rank. Core Web Vitals green for SMBs.",
)
add_en(
    "services/seo/index.html",
    "SEO Services for Small Business | Monsieur Click",
    "Technical, on-page and content SEO with monthly measurement for small businesses.",
)
add_en(
    "services/local-seo/index.html",
    "Local SEO for Small Business | Monsieur Click",
    "Rank in the Google map pack: GBP, reviews, citations and local pages for SMBs.",
)
add_en(
    "services/google-business-profile/index.html",
    "Google Business Profile Help | Monsieur Click",
    "Complete GBP optimization: reviews, photos, posts. More Maps calls for local SMBs.",
)
add_en(
    "services/seo-audit/index.html",
    "SEO Audit for Small Business | Monsieur Click",
    "Technical, on-page and competitor audit with a prioritized, readable action plan.",
)
add_en(
    "services/wordpress-web-design/index.html",
    "WordPress Web Design | Monsieur Click",
    "Custom WordPress that stays fast, editable and SEO-ready after launch for SMBs.",
)
add_en(
    "services/generative-engine-optimization/index.html",
    "Generative Engine Optimization | Monsieur Click",
    "Get cited by ChatGPT, Gemini and Perplexity. Practical GEO for small businesses.",
)
add_en(
    "small-business-seo/index.html",
    "Small Business SEO near Paris | Monsieur Click",
    "Practical local SEO for owners: Maps, GBP and a website that converts leads.",
)
add_en(
    "small-business-seo.html",
    "Small Business SEO near Paris | Monsieur Click",
    "Practical local SEO for owners: Maps, GBP and a website that converts leads.",
)
add_en(
    "ai-seo-agency/index.html",
    "AI SEO Agency for SMBs | Monsieur Click",
    "SEO plus GEO so you show up on Google and in AI answers, not just one channel.",
)
add_en(
    "ai-seo-agency.html",
    "AI SEO Agency for SMBs | Monsieur Click",
    "SEO plus GEO so you show up on Google and in AI answers, not just one channel.",
)
add_en(
    "seo-agency-london.html",
    "SEO Agency in London | Monsieur Click",
    "Local SEO and GBP for London small businesses. Remote Click First™ delivery.",
)
add_en(
    "case-studies/index.html",
    "Local SEO Case Studies | Monsieur Click",
    "7 real Click First™ builds: websites, Maps and AI visibility results for SMBs.",
)
add_en(
    "case-studies/assogym/index.html",
    "Assogym SEO Case Study | Monsieur Click",
    "How a local fitness club gained Google Maps visibility with Click First™.",
)
add_en(
    "case-studies/dharma-massage-therapy/index.html",
    "Dharma Massage Case Study | Monsieur Click",
    "Premium massage practice: site and local SEO aligned with the brand promise.",
)
add_en(
    "case-studies/susan-filan/index.html",
    "Susan Filan SEO Case Study | Monsieur Click",
    "Senior attorney site rebuilt for authority and organic search visibility.",
)
add_en(
    "case-studies/bodyguard-paris/index.html",
    "Bodyguard Paris Case Study | Monsieur Click",
    "Paris security agency: Google visibility beyond word of mouth for local clients.",
)
add_en(
    "case-studies/heather-fillmore-coaching/index.html",
    "Heather Fillmore Case Study | Monsieur Click",
    "Coach site: +200% organic traffic with Click First™. Full case study inside.",
)
add_en(
    "case-studies/studio-la-voix-du-12/index.html",
    "Studio La Voix du 12 Case | Monsieur Click",
    "Montpellier studio: from placeholder page to credible Google presence locally.",
)
add_en(
    "case-studies/east-portland-sash/index.html",
    "East Portland Sash Case | Monsieur Click",
    "Portland craftsperson: local SEO for wood window restoration and repair.",
)
add_en(
    "glossary/index.html",
    "SEO & GEO Glossary | Monsieur Click",
    "Clear definitions of local SEO, GEO and Google Business Profile for SMB owners.",
)
add_en(
    "glossary/local-seo/index.html",
    "Local SEO Definition | Monsieur Click",
    "Local SEO means Maps and the local pack. Plain-English definition for SMBs.",
)
add_en(
    "glossary/generative-engine-optimization/index.html",
    "GEO Definition | Monsieur Click Glossary",
    "GEO prepares your business to be cited by ChatGPT, Gemini and Perplexity.",
)
add_en(
    "glossary/google-business-profile/index.html",
    "Google Business Profile Defined | MC",
    "What GBP is, why Maps depends on it, and how small businesses use it daily.",
)
add_en(
    "blog/click-first-not-just-seo/index.html",
    "Click First™ vs Isolated SEO | Monsieur Click",
    "Why siloed SEO plateaus. One system for website, Maps and AI visibility.",
)
add_en(
    "blog/geo-generative-engine-optimization/index.html",
    "GEO for Small Business | Monsieur Click",
    "Get ready for ChatGPT, Gemini and Perplexity citations in 2026. Practical steps.",
)
add_en(
    "blog/will-ai-replace-google/index.html",
    "Will AI Replace Google? | Monsieur Click",
    "AI changes the buyer journey, not Google alone. What SMBs should do next.",
)
add_en(
    "blog/become-a-reference-business/index.html",
    "Become a Reference Business | Monsieur Click",
    "Visibility is not enough. Become the business Google and AI recommend locally.",
)
add_en(
    "blog/get-more-google-reviews/index.html",
    "Get More Google Reviews | Monsieur Click",
    "A simple review system without being pushy. Stronger local reputation for SMBs.",
)
add_en(
    "blog/is-your-website-losing-clients/index.html",
    "Is Your Website Losing Clients? | MC",
    "10 signs your site kills inquiries, and how to fix each one for small businesses.",
)
add_en(
    "blog/why-competitors-rank-ahead/index.html",
    "Why Competitors Rank Ahead | Monsieur Click",
    "They send stronger trust signals. Five levers to catch up on Google Maps.",
)
add_en(
    "blog/appear-in-chatgpt-gemini-perplexity/index.html",
    "Appear in ChatGPT & Gemini | Monsieur Click",
    "Become a cited source in AI answers. Practical GEO steps for small businesses.",
)
add_en(
    "blog/clients-ask-chatgpt-before-google/index.html",
    "Clients Ask ChatGPT First | Monsieur Click",
    "Buyers ask AI before Google. How to stay the recommended local choice.",
)
add_en(
    "blog/google-ads-vs-seo/index.html",
    "Google Ads vs SEO for SMBs | Monsieur Click",
    "Ads for speed, SEO for lasting demand. Where to put your 2026 marketing budget.",
)
add_en(
    "blog/get-clients-without-advertising/index.html",
    "Clients Without Advertising | Monsieur Click",
    "Build lasting demand with local SEO, reviews and GBP, not only paid ads.",
)
add_en(
    "blog/google-business-profile-no-calls/index.html",
    "GBP Getting No Calls? | Monsieur Click",
    "Visible on Maps but silent? Fix reviews, photos, posts and NAP consistency.",
)
add_en(
    "blog/how-google-ranks-businesses/index.html",
    "How Google Ranks Businesses | Monsieur Click",
    "Five local ranking criteria explained for small business owners who want calls.",
)
add_en(
    "blog/why-business-not-on-google/index.html",
    "Why You're Invisible on Google | MC",
    "Seven reasons local businesses stay hidden, and how to fix each one this month.",
)
add_en(
    "blog/is-a-website-enough-2026/index.html",
    "Is a Website Enough in 2026? | Monsieur Click",
    "A site alone is not enough. Add local SEO, GBP, reviews and GEO together.",
)
add_en(
    "blog/what-is-an-seo-agency/index.html",
    "What Is an SEO Agency? | Monsieur Click",
    "Clear definition of what an SEO agency does for small businesses, without hype.",
)
add_en(
    "blog/how-to-choose-an-seo-agency/index.html",
    "How to Choose an SEO Agency | Monsieur Click",
    "Eight criteria to pick an SEO partner without ranking guarantees or fluff.",
)
add_en(
    "blog/seo-agency-pricing-2026/index.html",
    "SEO Agency Pricing 2026 | Monsieur Click",
    "Realistic SEO price ranges and plans from €850/mo. Read quotes without surprises.",
)
add_en(
    "methode.html",
    "Click First™ Local SEO Method | Monsieur Click",
    "Website, local SEO, GBP and AI visibility in one system near Paris for SMBs.",
)

add_legal(
    EN,
    "legal-notice.html",
    "Legal Notice | Monsieur Click Malakoff",
    "Legal notice for Monsieur Click, Malakoff (92). SIRET 42953906700042. Host, publisher and contact details.",
)
add_legal(
    EN,
    "privacy.html",
    "Privacy Policy | Monsieur Click",
    "How Monsieur Click collects and protects personal data on monsieurclick.com. Cookies and GDPR basics.",
)
add_legal(
    EN,
    "terms.html",
    "Terms of Service | Monsieur Click",
    "Terms for Click First™ plans: commitments, billing, cancellation and service conditions for SMBs.",
)
add_legal(
    EN,
    "404.html",
    "Page Not Found | Monsieur Click",
    "This page does not exist. Go back to Monsieur Click home or request a free SEO diagnostic today.",
)


def _replace_meta_content(html: str, attr_pattern: str, value: str) -> str:
    """Replace content=... even when value contains apostrophes."""
    pattern = (
        rf"(<meta\s+{attr_pattern}\s+content=)([\"'])(.*?)\2(\s*/?>)"
    )
    if re.search(pattern, html, flags=re.I | re.S):
        return re.sub(
            pattern,
            rf'\1"{value}"\4',
            html,
            count=1,
            flags=re.I | re.S,
        )
    return html


def set_meta(html: str, title: str, description: str) -> str:
    assert '"' not in title and '"' not in description
    html = re.sub(
        r"<title>[\s\S]*?</title>",
        f"<title>{title}</title>",
        html,
        count=1,
        flags=re.I,
    )
    if re.search(r'<meta\s+name=["\']description["\']', html, re.I):
        html = _replace_meta_content(html, r'name=["\']description["\']', description)
    else:
        html = re.sub(
            r"<title>[\s\S]*?</title>",
            lambda m: m.group(0) + f'\n<meta name="description" content="{description}">',
            html,
            count=1,
            flags=re.I,
        )
    html = _replace_meta_content(html, r'property=["\']og:title["\']', title)
    html = _replace_meta_content(html, r'property=["\']og:description["\']', description)
    return html


def apply(root: Path, mapping: dict) -> tuple[int, list[str]]:
    n = 0
    miss = []
    for rel, meta in mapping.items():
        path = root / rel
        if not path.exists():
            miss.append(str(path))
            continue
        before = path.read_text(encoding="utf-8")
        after = set_meta(before, meta["title"], meta["description"])
        if after != before:
            path.write_text(after, encoding="utf-8")
            n += 1
    return n, miss


def main() -> None:
    legal_fr = {
        "mentions-legales.html",
        "confidentialite.html",
        "conditions.html",
        "404.html",
    }
    legal_en = {"legal-notice.html", "privacy.html", "terms.html", "404.html"}

    for label, m, legal in (("FR", FR, legal_fr), ("EN", EN, legal_en)):
        for k, v in m.items():
            t, d = L(v["title"]), L(v["description"])
            if t > 60:
                raise SystemExit(f"{label} T{t} {k}: {v['title']}")
            if k not in legal and (d < 138 or d > 155):
                raise SystemExit(f"{label} D{d} {k}: {v['description']}")

    nfr, mfr = apply(ROOT_FR, FR)
    nen, men = apply(ROOT_EN, EN)
    print(f"Updated FR={nfr} EN={nen}")
    if mfr or men:
        print("MISSING", mfr + men)

    out = ROOT_FR / "scripts" / "metas-applied.json"
    out.write_text(
        json.dumps({"FR": FR, "EN": EN}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {out}")

    # samples
    for rel in ("index.html", "offres.html", "agence-seo-paris/index.html"):
        print(f"FR {rel} T{L(FR[rel]['title'])} D{L(FR[rel]['description'])}")
        print(" ", FR[rel]["title"])
        print(" ", FR[rel]["description"])
    for rel in ("index.html", "pricing.html", "seo-agency-london.html"):
        print(f"EN {rel} T{L(EN[rel]['title'])} D{L(EN[rel]['description'])}")
        print(" ", EN[rel]["title"])
        print(" ", EN[rel]["description"])


if __name__ == "__main__":
    main()
