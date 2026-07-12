<!-- barry-cache:start -->
## Barry Cache

Barry Cache remembers this repo through source-backed context files.

Use `barry-cache` directly. If it is unavailable, run it through your package runner, for example `npx barry-cache <command>`.

Repeated retrieval commands use the disposable parsed index in `.context-cache/context-index.json` when source context files have not changed.

Start task context with:

```bash
barry-cache resume --task "<task>"
```

Use focused retrieval during work:

```bash
barry-cache route --task "<task>"
barry-cache search --query "<query>"
barry-cache load --route "<route>"
```

`load` and `resume` return a relevance-ranked budgeted slice by default (~2000 tokens per pack), not the whole pack. Trust the slice — the result lists any `dropped` fact ids and an `expand_hint`. If a needed fact is missing, restore just that id with `--expand <id>`; use `--expand all` only when you genuinely need the full pack, or `--budget <N>` to resize.

Workspace context is optional. When `docs/context/workspaces.json` exists and you know relevant files or directories, include them so Barry can choose the right workspace:

```bash
barry-cache resume --task "<task>" --paths "path-a,path-b"
barry-cache workspace infer --task "<task>" --paths "path-a,path-b"
```

Use the workspace Barry selects. If Barry reports `workspace_decision.status: "ambiguous"`, do not guess — ask the user or rerun with `--workspace <slug>`.

When context files change, run:

```bash
barry-cache validate
```

Before handing off substantial work, record factual evidence:

```bash
barry-cache finalize --status success --summary "<summary>" --files "path-a,path-b"
```

When user validation shows previous work is broken, record the contradiction before or while fixing it:

```bash
barry-cache failure record --summary "<what failed>" --expected "<expected behavior>" --actual "<observed behavior>" --challenges "<handoff-or-fact-id>"
```

Memory policy:

- Private vs. canonical memory: your agent's own private memory — the local store only you can read (for Claude Code, `MEMORY.md` and its files; other agents have their own) — is invisible to every other agent. Use it only for cross-session *personal* context — user preferences, how to work with this user, and external references.
- Any decision, fact, or constraint another agent would need goes to Barry, never a private memory: an ADR, a `docs/context/features/*/FACTS.jsonl` fact, or a `finalize`/`failure` record. If you are about to write a `project`-type private memory, that is the signal to route it to Barry instead.
- `feedback`-type guidance splits on who it serves: keep it private only when it is about working with *this user* personally (explanation depth, tone, review style). Guidance that states a rule every agent on this repo should follow (e.g. "always run `barry-cache validate` before `finalize`") is a policy, not a preference — route it to Barry as an ADR/`AGENTS.md` policy or a `decision` fact.
- Finalize writes operational memory only.
- Failure records write operational validation memory only and should challenge stale handoffs or facts instead of rewriting history.
- Do not claim Barry canonical memory is updated unless `docs/context/` changed.
- If a task adds durable implementation behavior, add or update source-backed facts in `docs/context/features/*/FACTS.jsonl` and run `barry-cache validate`.
- Direct `FACTS.jsonl` edits remain supported; use `barry-cache fact draft --route "<route>" --prefix "<PREFIX>" ...` when a schema-checked JSONL draft or explicit `--write` append is safer.
- `fact draft` is an authoring guardrail, not broad canonical CRUD; review the resulting diff and run `barry-cache validate`.
- Use ISO 8601 timestamps in fact `updated_at` values when saving new facts, so same-day feature order is preserved in review timelines.
- Use collision-resistant fact IDs like `REV-20260526T160512Z-a8f3`; dense review UI may display them as `REV-a8f3`.

Shared KB (cq) — opt-in; act on this only when `barry-cache kb sharing status` is not local-only (the user connects with `barry-cache kb cq login`):

- Before non-trivial work, check the shared commons: `barry-cache kb search --source cq --query "<problem>"`.
- After a confirmed fix, give back: `barry-cache kb harvest` drafts a sanitized lesson; review it, then `barry-cache kb propose lesson ...` and `barry-cache kb contribute`.
- Do not enable sharing or contribute on your own — that is the user's explicit choice. If sharing is local-only, skip cq entirely.

Decision records:

- Create an ADR when a task introduces or changes durable architecture, repo policy, storage layout, agent protocol, or cross-module behavior.
- Use `barry-cache adr new --title "<decision>" --tags "<tags>"`.
- Add or update a `kind: "decision"` fact in `docs/context/features/*/FACTS.jsonl` with `src` pointing to the ADR file.
- Do not create ADRs for routine bug fixes, local refactors, temporary notes, or uncertain ideas.
<!-- barry-cache:end -->
