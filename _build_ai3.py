#!/usr/bin/env python3
"""Phase 3: OKF about, case-studies, contact, blog pages."""
import os

BASE = "/workspace/monsieur-click-V2"
DOMAIN = "https://monsieurclick.com"

def write(path, content):
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓ {path}")

def okf_page(title, desc, canonical_slug, res_type, tags, body_html, related_links=None):
    canonical = f"{DOMAIN}/okf/{canonical_slug}" if canonical_slug else f"{DOMAIN}/okf/"
    related = ""
    if related_links:
        related = '<nav class="related"><h2>Related Pages</h2><ul>\n'
        for label, href in related_links:
            related += f'<li><a href="{href}">{label}</a></li>\n'
        related += '</ul></nav>'
    
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | Monsieur Click OKF</title>
<meta name="type" content="{res_type}">
<meta name="title" content="{title}">
<meta name="description" content="{desc}">
<meta name="resource" content="{DOMAIN}/okf/">
<meta name="tags" content="{tags}">
<meta name="lang" content="en">
<link rel="canonical" href="{canonical}">
<meta name="robots" content="index, follow">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; line-height:1.7; color:#1a1a2e; background:#f8f9fa; max-width:800px; margin:0 auto; padding:2rem 1.5rem; }}
  h1 {{ font-size:2rem; margin-bottom:0.5rem; color:#0f3460; }}
  h2 {{ font-size:1.4rem; margin:2rem 0 0.75rem; color:#16213e; border-bottom:2px solid #5cc0f2; padding-bottom:0.3rem; }}
  h3 {{ font-size:1.15rem; margin:1.5rem 0 0.5rem; color:#1a1a2e; }}
  p {{ margin-bottom:1rem; }}
  ul, ol {{ margin:0.5rem 0 1rem 1.5rem; }}
  li {{ margin-bottom:0.4rem; }}
  a {{ color:#5cc0f2; text-decoration:none; }}
  a:hover {{ text-decoration:underline; }}
  nav.breadcrumb {{ font-size:0.9rem; color:#666; margin-bottom:1.5rem; }}
  nav.breadcrumb a {{ color:#5cc0f2; }}
  nav.related {{ background:#fff; border:1px solid #e0e0e0; border-radius:8px; padding:1.25rem; margin:2rem 0; }}
  nav.related h2 {{ margin-top:0; border:none; font-size:1.1rem; }}
  nav.related ul {{ list-style:none; margin:0.5rem 0 0; }}
  nav.related li {{ margin-bottom:0.3rem; }}
  .meta {{ font-size:0.85rem; color:#888; margin-bottom:2rem; padding:0.75rem; background:#eef5ff; border-radius:6px; }}
  .meta span {{ margin-right:1.5rem; }}
  footer {{ margin-top:3rem; padding-top:1rem; border-top:1px solid #ddd; font-size:0.85rem; color:#999; }}
  .case {{ background:#fff; border:1px solid #e0e0e0; border-radius:8px; padding:1.25rem; margin:1rem 0; }}
  .case h3 {{ margin-top:0; }}
  .service-card {{ background:#fff; border:1px solid #e0e0e0; border-radius:8px; padding:1.25rem; margin:1rem 0; }}
</style>
</head>
<body>
<nav class="breadcrumb">
  <a href="{DOMAIN}/okf/">OKF Bundle</a> › {title}
</nav>
<h1>{title}</h1>
<div class="meta">
  <span><strong>Type:</strong> {res_type}</span>
  <span><strong>Tags:</strong> {tags}</span>
  <span><strong>Lang:</strong> en</span>
  <span><strong>Canonical:</strong> {canonical}</span>
</div>
{body_html}
{related}
<footer>
  <p>© 2023–2026 Monsieur Click — SIRET 42953906700042 — 24 bis sentier des Fosses Rouges, 92240 Malakoff, France</p>
  <p><a href="{DOMAIN}/okf/">OKF Bundle Hub</a> | <a href="{DOMAIN}/">Main Site</a> | <a href="{DOMAIN}/llms.txt">llms.txt</a></p>
</footer>
</body>
</html>'''

# --- about.html ---
body = """<h2>About Monsieur Click</h2>
<p>Monsieur Click is a local SEO and web design agency created by Jean-Pierre Baguette in 2023. We help small businesses get found and chosen on Google, Google Maps, and AI assistants through the Click First™ method.</p>

<h2>Our Conviction</h2>
<p>The best businesses should also be the easiest to find. Visibility should reflect skill — not luck, not ad budgets, not manipulation. We bring together every lever of online visibility into one coherent system so that businesses who do great work get discovered by the people who need them.</p>

<h2>Why Click First™</h2>
<p>A website alone is no longer enough. SEO alone is not enough. A Google Business Profile alone is not enough. These elements must work together, reinforcing each other. Click First™ is the method that makes that coherence happen.</p>

<h2>Business Details</h2>
<ul>
  <li><strong>Founder:</strong> Jean-Pierre Baguette</li>
  <li><strong>Founded:</strong> 2023</li>
  <li><strong>SIRET:</strong> 42953906700042</li>
  <li><strong>Address:</strong> 24 bis sentier des Fosses Rouges, 92240 Malakoff, France</li>
  <li><strong>Phone:</strong> +33 6 60 76 15 23</li>
  <li><strong>Email:</strong> contact@monsieurclick.com</li>
  <li><strong>Languages:</strong> French (native), English (fluent)</li>
  <li><strong>Areas Served:</strong> France, Belgium, Switzerland, Canada, United States, United Kingdom</li>
  <li><strong>Rating:</strong> 5.0 ★ (15 reviews)</li>
  <li><strong>Work Mode:</strong> 100% remote — phone, Zoom, email</li>
</ul>"""
rel = [("OKF Hub", "/okf/"), ("Services", "/okf/services/"), ("Case Studies", "/okf/case-studies.html"), ("Contact", "/okf/contact.html"), ("Main About Page", f"{DOMAIN}/about.html")]
write("okf/about.html", okf_page("About Monsieur Click", "About Monsieur Click: local SEO and web design agency founded in 2023 by Jean-Pierre Baguette. Creator of Click First™. Based in Malakoff, France, serving FR and EN markets.", "about.html", "Page", "about, Monsieur Click, Jean-Pierre Baguette, founder, local SEO agency, Click First", body, rel))

# --- case-studies.html ---
body = """<h2>Case Studies — Real Results</h2>
<p>From invisible to obvious. These businesses adopted the Click First™ ecosystem — website, local SEO, Google Business Profile, reviews, and structured data — and here is what happened.</p>

<div class="case">
  <h3>Assogym — Sports Coaching</h3>
  <p>Complete website rebuild with local SEO and Google Business Profile optimization. From zero online presence to ranking in the top 3 for key local queries. Mobile-first design optimized for sports coaching audience.</p>
</div>

<div class="case">
  <h3>Dharma Massage — Wellness</h3>
  <p>SEO-first website with service pages for each massage type, location pages for each neighborhood served. Google Business Profile optimization with review generation system. Significant increase in booked appointments.</p>
</div>

<div class="case">
  <h3>Susan Filan — Legal Services</h3>
  <p>Professional services website with StoryBrand messaging, clear service descriptions, and local SEO targeting. Enhanced Google Business Profile for a competitive legal market.</p>
</div>

<div class="case">
  <h3>Bodyguard Paris — Security Services</h3>
  <p>Website and local visibility for a premium security service. Focused on establishing authority through structured content, reviews, and Google Business Profile in a high-trust industry.</p>
</div>

<div class="case">
  <h3>Heather Fillmore — Coaching</h3>
  <p>Personal brand website with Click First™ method. StoryBrand messaging, service pages, and AI GEO framework to appear in coach recommendation queries.</p>
</div>

<div class="case">
  <h3>Studio La Voix du 12 — Music Studio</h3>
  <p>Local SEO for a music studio. Google Maps visibility, service pages for each offering (recording, mixing, lessons), and review collection system.</p>
</div>

<div class="case">
  <h3>East Portland Sash — Trades</h3>
  <p>US-based tradesperson website. Multi-location local SEO, service pages for different window and door services, and Google Business Profile optimization for the Portland metro area.</p>
</div>

<h2>What These Cases Share</h2>
<p>Each business went from fragmented or nonexistent online visibility to a coherent ecosystem where every lever — website, SEO, Google Business Profile, reviews, and AI presence — reinforces the others. The result: they became easier to find, easier to recommend, and easier to choose.</p>"""
rel = [("OKF Hub", "/okf/"), ("Services", "/okf/services/"), ("About", "/okf/about.html"), ("Click First Method", f"{DOMAIN}/click-first.html"), ("Main Case Studies", f"{DOMAIN}/case-studies.html")]
write("okf/case-studies.html", okf_page("Case Studies", "Real case studies: Assogym, Dharma Massage, Susan Filan, Bodyguard Paris, Heather Fillmore, Studio La Voix du 12, East Portland Sash. From invisible to obvious with Click First™.", "case-studies.html", "Page", "case studies, results, local SEO, website, Google Business Profile, Click First, real examples", body, rel))

# --- contact.html ---
body = """<h2>Contact &amp; Free Audit</h2>
<p>Get a <strong>free 30-minute audit</strong> of your current visibility on Google, Google Maps, and AI. No pitch, no pressure — just an honest assessment and a clear plan.</p>

<h2>What You'll Get</h2>
<ul>
  <li><strong>Your current visibility status:</strong> Where you appear (and where you do not) on Google, Maps, and AI.</li>
  <li><strong>Your top 3 priorities:</strong> The highest-impact actions to improve your visibility.</li>
  <li><strong>A clear plan:</strong> The path to move forward, whether with us or on your own.</li>
</ul>

<h2>Contact Information</h2>
<ul>
  <li><strong>Email:</strong> contact@monsieurclick.com</li>
  <li><strong>Phone:</strong> +33 6 60 76 15 23</li>
  <li><strong>Address:</strong> 24 bis sentier des Fosses Rouges, 92240 Malakoff, France</li>
  <li><strong>Response Time:</strong> Within 24 business hours</li>
  <li><strong>Languages:</strong> French and English</li>
</ul>

<h2>How We Work</h2>
<p>100% remote — phone, Zoom, email. We support businesses across French-speaking countries (France, Belgium, Switzerland, Canada) and English-speaking countries (United States, United Kingdom).</p>"""
rel = [("OKF Hub", "/okf/"), ("Services", "/okf/services/"), ("About", "/okf/about.html"), ("Pricing", f"{DOMAIN}/pricing.html"), ("Main Contact Page", f"{DOMAIN}/contact.html")]
write("okf/contact.html", okf_page("Contact & Free Audit", "Contact Monsieur Click for a free 30-minute audit of your visibility on Google, Google Maps and AI. Email, phone, address. Reply within 24 hours.", "contact.html", "Page", "contact, free audit, SEO audit, Monsieur Click, phone, email", body, rel))

# --- blog/index.html ---
body = """<h2>Blog — Get Found and Chosen, Explained Simply</h2>
<p>Practical advice on local SEO, Google Business Profile, reviews, and visibility in AI — for small businesses who want to be found by their future customers.</p>

<h2>All Articles</h2>

<div class="service-card">
  <h3><a href="/okf/blog/click-first-not-just-seo.html">Click First™ Isn't Just Another SEO Service</a></h3>
  <p>Click First™ goes beyond traditional SEO by uniting website, Google Business Profile, Schema.org data, reviews and AI visibility in one coherent method.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/geo-generative-engine-optimization.html">GEO: Generative Engine Optimization</a></h3>
  <p>GEO prepares your business to be cited by AI engines like ChatGPT, Gemini, Claude and Perplexity.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/will-ai-replace-google.html">Will AI Replace Google?</a></h3>
  <p>AI is transforming search habits, but the smart strategy prepares for both — they share the same foundations.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/become-a-reference-business.html">Become a Reference Business, Not Just Visible</a></h3>
  <p>Visibility without credibility does not convert. Becoming a reference means Google and AI treat you as an authority.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/get-more-google-reviews.html">Get More Google Reviews (Without Being Pushy)</a></h3>
  <p>A simple, natural system for requesting reviews that directly influence your local ranking and conversion.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/is-your-website-losing-clients.html">Is Your Website Losing You Clients? 10 Signs</a></h3>
  <p>10 warning signs your website is driving clients away: slow loading, poor mobile, unclear messaging, and more.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/why-competitors-rank-ahead.html">Why Your Competitors Get Ahead of You on Google</a></h3>
  <p>Analysis of the 3 Google ranking pillars and how to close the gap with competitors.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/appear-in-chatgpt-gemini-perplexity.html">Show Up in ChatGPT, Gemini and Perplexity</a></h3>
  <p>How to structure your online presence so AI assistants can find and cite your business accurately.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/clients-ask-chatgpt-before-google.html">Your Clients Ask ChatGPT Before Google</a></h3>
  <p>Consumer behavior is shifting — more people start with AI. What this means for your visibility.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/google-ads-vs-seo.html">Google Ads vs Organic SEO: Where to Invest?</a></h3>
  <p>Ads deliver immediate visibility that stops when you stop paying. SEO builds lasting presence.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/get-clients-without-advertising.html">Win Clients Every Week Without Advertising</a></h3>
  <p>Organic visibility generates a steady stream of clients without ongoing ad spend. The compound effect.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/google-business-profile-no-calls.html">Google Business Profile Set Up But No Calls?</a></h3>
  <p>A profile alone does not generate calls. It needs optimization, posts, reviews, and website alignment.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/how-google-ranks-businesses.html">How Google Ranks Local Businesses</a></h3>
  <p>Google's local ranking: relevance, distance, and prominence explained simply.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/is-a-website-enough-2026.html">Is a Website Enough in 2026?</a></h3>
  <p>In 2026, you need an ecosystem: GBP, reviews, citations, Schema.org, and AI visibility.</p>
</div>

<div class="service-card">
  <h3><a href="/okf/blog/why-business-not-on-google.html">Why Your Business Isn't on Google</a></h3>
  <p>Common reasons businesses remain invisible and solutions for each.</p>
</div>"""
rel = [("OKF Hub", "/okf/"), ("Services", "/okf/services/"), ("Main Blog", f"{DOMAIN}/blog.html"), ("Click First Method", f"{DOMAIN}/click-first.html")]
write("okf/blog/index.html", okf_page("Blog", "Monsieur Click blog: practical advice on local SEO, Google Business Profile, reviews, and AI visibility for small businesses.", "blog/", "Page", "blog, local SEO, Google Business Profile, AI visibility, GEO, reviews", body, rel))

print("=== OKF about/case-studies/contact/blog-index done ===")
