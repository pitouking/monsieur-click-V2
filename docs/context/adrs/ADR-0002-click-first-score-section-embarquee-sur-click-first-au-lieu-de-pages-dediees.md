---
id: ADR-0002
title: Click First Score: section embarquee sur /click-first au lieu de pages dediees
status: active
date: 2026-07-12
supersedes: []
tags: [click-first-score, architecture, ux]
---

# ADR-0002: Click First Score: section embarquee sur /click-first au lieu de pages dediees

## Context

ADR-0001 shipped Click First™ Score as two standalone pages: `/score` (quiz) and `/score-resultat` (results), briefly live in production. The client then asked explicitly not to have it as a separate page, but as a section embedded on the existing `/click-first` pillar page, on both `monsieurclick.fr` and `monsieurclick.com`. Reasons inferred from the request: keep the pillar page as the single authoritative destination for the method, avoid fragmenting SEO/link equity across an extra URL, and let visitors experience "the method" and "the score that proves it" in one continuous scroll rather than a separate detour.

## Decision

- Merged the quiz wizard and the result view (previously `score.html`/`score.js` + `score-resultat.html`/`score-resultat.js`) into a single new file pair per locale: `score-embed.js`, injected into `click-first.html` as `<section id="score">` right after the "Le constat"/"The reality" section (problem stated, then "measure where you stand", then the levers). No page navigation between quiz and result: the wizard hides and the result panel shows inline in the same section, using the `business_name`/scores already returned by `POST /api/score/submit` (added `business_name` to that response so no second `GET /api/score/result` round-trip is needed for the live-submission path).
- Deleted `score.html`, `score.js`, `score-resultat.html`/`score-result.html`, `score-resultat.js`/`score-result.js` on both worktrees.
- All 38 interlinking edits from the same day (nav links + body CTAs across ~19 pages per locale) were repointed from `/score` to `/click-first#score` (or bare `#score` on `click-first.html` itself).
- Added one-way 301 redirects (`/score`, `/score-resultat`/`score-result`, and their `.html` forms → `/click-first`) on both `_redirects` files, since the standalone pages were briefly live and could be indexed/bookmarked. One-way only, deliberately, to avoid recreating the ADR-0001 production redirect-loop incident.
- The backend from ADR-0001 (Pages Functions, shared D1 `clickfirst`, `score-questions.js` scoring source of truth) is **unchanged** — this ADR only changes how the frontend is delivered (embedded section vs. standalone pages), not the scoring architecture.

## Consequences

- `functions/api/score/result.js` (`GET ?id=`) is now unused by the live flow (the embed renders straight from the submit response) but is left in place for a possible future dashboard/history feature or shareable result link.
- The `/score` URL space no longer exists as a page; anyone who bookmarked or shared the brief live `/score` URL lands on `/click-first` (not deep-linked to the section, since redirects can't carry a `#fragment` server-side) — acceptable given the very short window that URL was live.
- Any future change to the quiz/result markup only touches `click-first.html` + `score-embed.js` per locale, not four separate page templates.
