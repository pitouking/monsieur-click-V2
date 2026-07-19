#!/usr/bin/env python3
"""Punchy EN metas — local CTR formula, no filler pads."""
import json
import re
from pathlib import Path

ROOT = Path(
    "/Users/jpm/Library/Mobile Documents/com~apple~CloudDocs/CoworkOS/"
    "Client Work/Monsieur Click V2 EN-FR/en"
)
APPLIED = Path(
    "/Users/jpm/Library/Mobile Documents/com~apple~CloudDocs/CoworkOS/"
    "Client Work/Monsieur Click V2 EN-FR/monsieur-click-V2/scripts/metas-applied.json"
)

TAIL = " Rated 5/5 by 15+ clients. Free diagnostic."  # 43
TAIL_BOOK = " Rated 5/5 by 15+ clients. Book now."  # 36


def L(s: str) -> int:
    return len(s.replace("&amp;", "&").replace("&#39;", "'").replace("&apos;", "'"))


def t(title: str) -> str:
    n = L(title)
    if n > 60:
        raise ValueError(f"T{n}: {title}")
    return title


def d(s1: str, tail: str = TAIL, lo: int = 110, hi: int = 155) -> str:
    s1 = s1.rstrip()
    if not s1.endswith((".", "!", "?")):
        s1 += "."
    out = s1 + tail
    n = L(out)
    if not (lo <= n <= hi):
        raise ValueError(f"D{n} need {lo}-{hi} (s1={L(s1)}): {out}")
    return out


# s1 target ~95–112 chars so total lands 138–155 with TAIL
EN = {
    "index.html": {
        "title": t("Local SEO Agency near Paris | Monsieur Click"),
        "description": d(
            "Local SEO, web design and AI visibility for SMBs near Paris — one Click First™ system, measured monthly"
        ),
    },
    "click-first.html": {
        "title": t("Click First™ SEO Method near Paris | MC"),
        "description": d(
            "Website, Maps and AI visibility in one system near Paris — not isolated SEO deliverables that stall"
        ),
    },
    "methode.html": {
        "title": t("Click First™ SEO Method near Paris | MC"),
        "description": d(
            "Website, Maps and AI visibility in one system near Paris — not isolated SEO deliverables that stall"
        ),
    },
    "pricing.html": {
        "title": t("Local SEO Pricing near Paris | Monsieur Click"),
        "description": d(
            "Plans from €850/mo near Paris: website, local SEO and Google Business Profile in one measured system"
        ),
    },
    "contact.html": {
        "title": t("Free SEO Diagnostic near Paris | Monsieur Click"),
        "description": d(
            "Book a free 30-minute SEO audit of your Google Search, Maps and AI visibility. Remote from Malakoff near Paris. Rated 5/5 by 15+ clients — book now.",
            TAIL_BOOK,
        ),
    },
    "about.html": {
        "title": t("Local SEO Agency near Paris | About Us"),
        "description": d(
            "Jean-Pierre Baguette built Click First™ in Malakoff near Paris. Google and AI for SMBs who want calls"
        ),
    },
    "blog/index.html": {
        "title": t("Local SEO & GEO Blog near Paris | MC"),
        "description": d(
            "Straight-talk guides on Maps, GBP and AI visibility for small businesses near Paris"
        ),
    },
    "services/index.html": {
        "title": t("SEO & Web Design near Paris | Monsieur Click"),
        "description": d(
            "Web design, local SEO, GBP and GEO near Paris — built for US and UK small businesses"
        ),
    },
    "services/web-design/index.html": {
        "title": t("Web Design near Paris | Monsieur Click"),
        "description": d(
            "Fast, conversion-first websites built to rank near Paris. Core Web Vitals stay green"
        ),
    },
    "services/seo/index.html": {
        "title": t("SEO Services near Paris | Monsieur Click"),
        "description": d(
            "Technical, on-page and content SEO with monthly proof for small businesses near Paris. Rated 5/5 by 15+ clients. Book your free diagnostic now."
        ),
    },
    "services/local-seo/index.html": {
        "title": t("Local SEO near Paris | Monsieur Click"),
        "description": d(
            "Rank in the Google map pack near Paris: GBP, reviews, citations and local landing pages"
        ),
    },
    "services/google-business-profile/index.html": {
        "title": t("Google Business Profile near Paris | MC"),
        "description": d(
            "GBP that gets calls near Paris: reviews, photos and posts optimized every single month"
        ),
    },
    "services/seo-audit/index.html": {
        "title": t("SEO Audit near Paris | Monsieur Click"),
        "description": d(
            "Technical, on-page and competitor audit near Paris — prioritized plan, zero fluff"
        ),
    },
    "services/wordpress-web-design/index.html": {
        "title": t("WordPress Design near Paris | Monsieur Click"),
        "description": d(
            "Custom WordPress that stays fast, editable and SEO-ready after launch near Paris"
        ),
    },
    "services/generative-engine-optimization/index.html": {
        "title": t("GEO near Paris | AI Visibility Monsieur Click"),
        "description": d(
            "Get cited by ChatGPT, Gemini and Perplexity. Practical GEO for SMBs near Paris"
        ),
    },
    "small-business-seo/index.html": {
        "title": t("Small Business SEO near Paris | Monsieur Click"),
        "description": d(
            "Practical local SEO for owners near Paris: Maps, GBP and a website that converts leads"
        ),
    },
    "small-business-seo.html": {
        "title": t("Small Business SEO near Paris | Monsieur Click"),
        "description": d(
            "Practical local SEO for owners near Paris: Maps, GBP and a website that converts leads"
        ),
    },
    "ai-seo-agency/index.html": {
        "title": t("AI SEO Agency near Paris | Monsieur Click"),
        "description": d(
            "SEO plus GEO near Paris so you show up on Google and in AI answers — not just one channel"
        ),
    },
    "ai-seo-agency.html": {
        "title": t("AI SEO Agency near Paris | Monsieur Click"),
        "description": d(
            "SEO plus GEO near Paris so you show up on Google and in AI answers — not just one channel"
        ),
    },
    "seo-agency-london.html": {
        "title": t("SEO Agency in London | Monsieur Click"),
        "description": d(
            "Local SEO and GBP for London small businesses. Remote Click First™ delivery from Paris"
        ),
    },
    "case-studies/index.html": {
        "title": t("Local SEO Case Studies | Monsieur Click"),
        "description": d(
            "7 real Click First™ builds near Paris and beyond: websites, Maps and AI visibility wins"
        ),
    },
    "case-studies/assogym/index.html": {
        "title": t("Assogym Local SEO Case Study | Monsieur Click"),
        "description": d(
            "Fitness club that finally showed up on Google Maps. Full Click First™ case study inside"
        ),
    },
    "case-studies/dharma-massage-therapy/index.html": {
        "title": t("Dharma Massage SEO Case | Monsieur Click"),
        "description": d(
            "Premium massage practice: site and local SEO matched to the brand. Full case study"
        ),
    },
    "case-studies/susan-filan/index.html": {
        "title": t("Susan Filan SEO Case Study | Monsieur Click"),
        "description": d(
            "Senior attorney site rebuilt for authority and organic search. Full case study inside"
        ),
    },
    "case-studies/bodyguard-paris/index.html": {
        "title": t("Bodyguard Paris SEO Case Study | Monsieur Click"),
        "description": d(
            "Paris security agency: Google demand beyond word of mouth. Full Click First™ case study"
        ),
    },
    "case-studies/heather-fillmore-coaching/index.html": {
        "title": t("Heather Fillmore SEO Case | Monsieur Click"),
        "description": d(
            "Coach site: +200% organic traffic with Click First™. See the full case study now"
        ),
    },
    "case-studies/studio-la-voix-du-12/index.html": {
        "title": t("Studio La Voix du 12 SEO Case | Monsieur Click"),
        "description": d(
            "Montpellier studio: from empty page to credible Google presence. Full case study"
        ),
    },
    "case-studies/east-portland-sash/index.html": {
        "title": t("East Portland Sash SEO Case | Monsieur Click"),
        "description": d(
            "Portland craftsperson: local SEO for wood window restoration. Full case study inside"
        ),
    },
    "glossary/index.html": {
        "title": t("SEO & GEO Glossary | Monsieur Click Paris"),
        "description": d(
            "Plain-English definitions of local SEO, GEO and Google Business Profile for owners"
        ),
    },
    "glossary/local-seo/index.html": {
        "title": t("What Is Local SEO? | Monsieur Click Glossary"),
        "description": d(
            "Local SEO means Maps and the local pack. Clear definition for business owners who want calls"
        ),
    },
    "glossary/generative-engine-optimization/index.html": {
        "title": t("What Is GEO? | Monsieur Click Glossary"),
        "description": d(
            "GEO prepares your business to be cited by ChatGPT, Gemini and Perplexity answers"
        ),
    },
    "glossary/google-business-profile/index.html": {
        "title": t("What Is GBP? | Monsieur Click Glossary"),
        "description": d(
            "Google Business Profile: why Maps depends on it and how SMBs use it every day"
        ),
    },
    "blog/click-first-not-just-seo/index.html": {
        "title": t("Click First™ vs Isolated SEO | Monsieur Click"),
        "description": d(
            "Why siloed SEO plateaus near Paris. One system for site, Maps and AI visibility"
        ),
    },
    "blog/geo-generative-engine-optimization/index.html": {
        "title": t("GEO for Small Business 2026 | Monsieur Click"),
        "description": d(
            "Get cited by ChatGPT, Gemini and Perplexity in 2026. Practical GEO steps for SMBs"
        ),
    },
    "blog/will-ai-replace-google/index.html": {
        "title": t("Will AI Replace Google? | Monsieur Click"),
        "description": d(
            "AI changes how buyers choose — not Google alone. What small businesses should do next"
        ),
    },
    "blog/become-a-reference-business/index.html": {
        "title": t("Become a Local Reference Business | MC"),
        "description": d(
            "Visibility is not enough. Become the business Google and AI recommend in your market"
        ),
    },
    "blog/get-more-google-reviews/index.html": {
        "title": t("Get More Google Reviews | Monsieur Click"),
        "description": d(
            "A simple review system that does not feel pushy. Stronger local reputation, fast"
        ),
    },
    "blog/is-your-website-losing-clients/index.html": {
        "title": t("Is Your Website Losing Clients? | Monsieur Click"),
        "description": d(
            "10 signs your site kills inquiries — and the concrete fix for each one today"
        ),
    },
    "blog/why-competitors-rank-ahead/index.html": {
        "title": t("Why Competitors Rank Ahead of You | MC"),
        "description": d(
            "They send stronger trust signals. Five levers to catch up on Google Maps this quarter"
        ),
    },
    "blog/appear-in-chatgpt-gemini-perplexity/index.html": {
        "title": t("Appear in ChatGPT & Gemini | Monsieur Click"),
        "description": d(
            "Become a cited source in AI answers. Practical GEO steps for small businesses"
        ),
    },
    "blog/clients-ask-chatgpt-before-google/index.html": {
        "title": t("Clients Ask ChatGPT Before Google | MC"),
        "description": d(
            "Buyers ask AI first. How to stay the recommended local choice in your market"
        ),
    },
    "blog/google-ads-vs-seo/index.html": {
        "title": t("Google Ads vs SEO for SMBs | Monsieur Click"),
        "description": d(
            "Ads for speed, SEO for lasting demand. Where to put your 2026 marketing budget"
        ),
    },
    "blog/get-clients-without-advertising/index.html": {
        "title": t("Get Clients Without Advertising | Monsieur Click"),
        "description": d(
            "Build lasting demand with local SEO, reviews and GBP — not only paid ads that stop"
        ),
    },
    "blog/google-business-profile-no-calls/index.html": {
        "title": t("GBP Visible but No Calls? | Monsieur Click"),
        "description": d(
            "On Maps but silent? Fix reviews, photos, posts and NAP consistency this month"
        ),
    },
    "blog/how-google-ranks-businesses/index.html": {
        "title": t("How Google Ranks Local Businesses | MC"),
        "description": d(
            "Five local ranking criteria explained for owners who want more phone calls"
        ),
    },
    "blog/why-business-not-on-google/index.html": {
        "title": t("Why You're Invisible on Google | Monsieur Click"),
        "description": d(
            "Seven reasons local businesses stay hidden — and how to fix each one this month"
        ),
    },
    "blog/is-a-website-enough-2026/index.html": {
        "title": t("Is a Website Enough in 2026? | Monsieur Click"),
        "description": d(
            "A site alone is not enough. Add local SEO, GBP, reviews and GEO together now"
        ),
    },
    "blog/what-is-an-seo-agency/index.html": {
        "title": t("What Is an SEO Agency? | Monsieur Click"),
        "description": d(
            "What an SEO agency actually does for small businesses — without the sales hype"
        ),
    },
    "blog/how-to-choose-an-seo-agency/index.html": {
        "title": t("How to Choose an SEO Agency | Monsieur Click"),
        "description": d(
            "Eight criteria to pick an SEO partner. No ranking promises, no agency fluff"
        ),
    },
    "blog/seo-agency-pricing-2026/index.html": {
        "title": t("SEO Agency Pricing 2026 | Monsieur Click"),
        "description": d(
            "Realistic SEO price ranges and plans from €850/mo. Read every quote clearly"
        ),
    },
    "legal-notice.html": {
        "title": t("Legal Notice | Monsieur Click Malakoff"),
        "description": (
            "Legal notice for Monsieur Click, Malakoff (92) near Paris. "
            "SIRET 42953906700042. Host and contact."
        ),
    },
    "privacy.html": {
        "title": t("Privacy Policy | Monsieur Click"),
        "description": (
            "How Monsieur Click collects and protects personal data on monsieurclick.com. "
            "Cookies and GDPR."
        ),
    },
    "terms.html": {
        "title": t("Terms of Service | Monsieur Click"),
        "description": (
            "Terms for Click First™ plans near Paris: commitments, billing, "
            "cancellation and service conditions."
        ),
    },
    "404.html": {
        "title": t("Page Not Found | Monsieur Click"),
        "description": (
            "This page does not exist. Return to Monsieur Click or book a free "
            "SEO diagnostic near Paris."
        ),
    },
}


def set_meta(html: str, title: str, description: str) -> str:
    assert '"' not in title and '"' not in description
    html = re.sub(
        r"<title>[\s\S]*?</title>",
        f"<title>{title}</title>",
        html,
        count=1,
        flags=re.I,
    )
    pat = r'(<meta\s+name=["\']description["\']\s+content=)(["\'])(.*?)\2(\s*/?>)'
    if re.search(pat, html, flags=re.I | re.S):
        html = re.sub(pat, rf'\1"{description}"\4', html, count=1, flags=re.I | re.S)
    else:
        html = re.sub(
            r"<title>[\s\S]*?</title>",
            lambda m: m.group(0) + f'\n<meta name="description" content="{description}">',
            html,
            count=1,
            flags=re.I,
        )
    for prop, val in (("og:title", title), ("og:description", description)):
        p2 = rf'(<meta\s+property=["\']{prop}["\']\s+content=)(["\'])(.*?)\2(\s*/?>)'
        if re.search(p2, html, flags=re.I | re.S):
            html = re.sub(p2, rf'\1"{val}"\4', html, count=1, flags=re.I | re.S)
    return html


def main() -> None:
    legal = {"legal-notice.html", "privacy.html", "terms.html", "404.html"}
    for k, v in EN.items():
        tl, dl = L(v["title"]), L(v["description"])
        if tl > 60:
            raise SystemExit(f"T{tl} {k}")
        if k not in legal and (dl < 110 or dl > 155):
            raise SystemExit(f"D{dl} {k}: {v['description']}")
        for filler in (
            "Monthly reporting",
            "Direct owner support",
            "Clear monthly plan",
            "For local SMBs",
            "No jargon",
        ):
            if filler in v["description"]:
                raise SystemExit(f"FILLER {k}: {filler}")

    n = 0
    for rel, meta in EN.items():
        path = ROOT / rel
        before = path.read_text(encoding="utf-8")
        after = set_meta(before, meta["title"], meta["description"])
        if after != before:
            path.write_text(after, encoding="utf-8")
            n += 1
    print(f"Updated {n}/{len(EN)}")

    miss = 0
    for rel, meta in EN.items():
        h = (ROOT / rel).read_text(encoding="utf-8")
        title = re.search(r"<title>(.*?)</title>", h, re.S).group(1)
        desc = re.search(
            r'<meta\s+name=["\']description["\']\s+content=(["\'])(.*?)\1',
            h,
            re.S | re.I,
        ).group(2)
        if title != meta["title"] or desc != meta["description"]:
            print("MISMATCH", rel)
            miss += 1
    if miss:
        raise SystemExit(f"{miss} mismatches")

    data = json.loads(APPLIED.read_text()) if APPLIED.exists() else {"FR": {}, "EN": {}}
    data["EN"] = EN
    APPLIED.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    print("SAMPLES")
    for rel in (
        "index.html",
        "services/local-seo/index.html",
        "pricing.html",
        "seo-agency-london.html",
        "contact.html",
    ):
        print(f"T{L(EN[rel]['title'])} D{L(EN[rel]['description'])} {rel}")
        print(" ", EN[rel]["title"])
        print(" ", EN[rel]["description"])


if __name__ == "__main__":
    main()
