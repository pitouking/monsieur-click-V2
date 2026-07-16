---
id: ADR-0001
title: Click First Score: Cloudflare Pages Functions + shared D1 for FR/EN scoring engine
status: active
date: 2026-07-11
supersedes: []
tags: [click-first-score, architecture, d1, pages-functions]
---

# ADR-0001: Click First Score: Cloudflare Pages Functions + shared D1 for FR/EN scoring engine

## Context

Monsieur Click asked for the Click First™ Score to be built as a proprietary product (scoring engine + GBP analyzer + visibility report + checklist), not another lead-magnet quiz. The site (`monsieur-click-V2` = branch `fr`, `monsieur-click-V2-en` = branch `en`, same repo via git worktrees) was 100% static HTML/CSS/JS on Cloudflare Pages with no backend, no database, and no prior scoring logic. A real product needs server-side scoring (never trust client-submitted scores), persistence for the results page / future dashboard, and parity between the FR and EN sites.

## Decision

- **Cloudflare Pages Functions** (plain JS in `functions/`, no bundler) host the API: `POST /api/score/submit` (recompute + persist) and `GET /api/score/result?id=` (reload). Chosen over a separate Worker to stay co-located with the static deploy and avoid CORS.
- **One shared D1 database** (`clickfirst`, uuid `0c84490b-c751-4641-a8f0-bbd2b2c9682a`, single `submissions` table with a `locale` column) is bound via `wrangler.toml` in *both* worktrees (`monsieurclick-fr` and `monsieurclick-com` Pages projects), so FR and EN leads/scores live in one place instead of two silos.
- **`score-questions.js`** (35 questions, 5 modules: site/seo/gbp/ia/confiance) is the single source of truth for weights, imported by both the client wizard and the server scoring function — the server always recomputes from raw answers, the client score is never trusted.
- **Scope simplification for V1**: the question bank is a fixed reduced set (35, not the ~80 envisioned long-term), shown in full rather than adaptively sub-sampled — adaptive selection only makes sense once the bank is actually large. The GBP module is self-reported via the quiz in V1, not yet pulled from the Google Places API — flagged in the UI ("Estimation déclarative" / "Self-reported estimate") per the project's honesty rule (AI_RULES.md).
- **Brand badges** (Click First™ Score, AI Readiness, Local Authority, Trust Score, Google Business Profile Score) are derived metrics computed in `functions/_lib/scoring.js`, not stored redundantly.

## Consequences

- Follow-up phases (not built yet): Google Places API-backed GBP analysis (replaces the self-reported badge), printable magazine-style visibility report (`@media print`), a history dashboard (`GET /api/score/history?email=`), 3-tier checklists, and a GoHighLevel webhook to push captured leads into the existing CRM.
- Because FR and EN are separate git worktrees (not a shared file tree), the scoring logic, question bank, and Functions had to be duplicated (translated) rather than shared by import — any future weight/scoring change must be applied to both `monsieur-click-V2/score-questions.js` and `monsieur-click-V2-en/score-questions.js` (and the two `functions/_lib/scoring.js` copies) to keep scores comparable across locales.
- **Confirmed production incident (fixed same day):** adding `functions/` + `wrangler.toml` made Cloudflare Pages compile a Functions worker for `monsieurclick-fr`, and once that worker was in the request path, the FR site's legacy `_redirects` pairs (`/foo.html -> /foo` 301 + `/foo -> /foo.html` 200, present for every top-level page) caused a real 308 self-redirect loop in production — not just a local `wrangler pages dev` artifact. This broke `/click-first`, `/offres`, `/contact`, `/realisations`, `/mentions-legales`, `/score` and others site-wide for a short window. **Fix applied:** removed those redundant legacy pairs from `monsieur-click-V2/_redirects` entirely, keeping only the OKF and `/texts` structural rewrites, and now rely on Cloudflare Pages' built-in automatic clean-URL handling — the same approach the EN worktree already used successfully (EN's `_redirects` never had these pairs and was never affected). See the failure record logged the same day for the full repro. **Takeaway:** any project that adds Pages Functions to a previously Function-less Pages project must audit `_redirects` for this exact pattern before deploying, not just test the new routes.
