# Repository Agent Instructions

These instructions apply to all Codex work in this repository.

## Source Of Truth

- Repository: `susmithdion7-oss/football-coach-command-centre`.
- Always use the latest remote `main` branch as source truth.
- Do not use old local directories or earlier generated folders.
- Do not rebuild the project from scratch.
- If local files disagree with remote `main`, inspect remote `main` before deciding.

## Required Reading

Before planning or implementation, read:

1. `README.md`
2. `PRODUCT_BRIEF.md`
3. `PROJECT_CONTEXT.md`
4. `CODEX_RULES.md`
5. `ROADMAP.md`
6. `DESIGN_SYSTEM.md`
7. `DEVELOPMENT_LOG.md`
8. `AGENT_BRIEF.md`
9. `docs/PRODUCT_MASTER_PLAN.md` for major product direction, module redesign, UI/UX redesign, roadmap planning, or feature prioritisation
10. `docs/MODULE_GUIDE.md`
11. `docs/DATA_AND_STORAGE.md`
12. `docs/UI_DESIGN_GUIDE.md`
13. `docs/CODEX_WORKFLOW.md` if it exists
14. `docs/AGENT_WORKFLOW.md` if it exists
15. `docs/PR_DELIVERY_STANDARD.md` if it exists

For module work, also inspect the current module source files on latest remote `main`.

## Product Boundaries

Current stage: frontend localStorage MVP / Coach HQ product refinement.

Do not add these unless the user explicitly requests a project-stage change:

- backend
- database
- login/authentication
- cloud sync
- AI or API calls
- payment/subscription
- chat
- parent/player portals
- complex permissions
- full SaaS architecture

## localStorage Protection

Protect real browser-saved coaching data.

- Do not clear localStorage.
- Do not casually rename storage keys.
- Do not remove compatibility for existing saved data.
- Do not overwrite saved records with incomplete defaults.
- Preserve players, sessions, tactical boards, team identity, crests, avatars, coach photos, diagrams, lineup, tactics, assignments, and session drafts.
- If data shape changes are explicitly approved, keep new fields optional and provide compatibility or migration notes.

## Work Style

- Work incrementally.
- Keep changes scoped to the requested module or documentation.
- Use existing project patterns before introducing new abstractions.
- Do not redesign unrelated modules during a focused task.
- Use Plan Mode first for major UI, data, workflow, or architecture work.
- For major product direction, module redesign, UI/UX redesign, roadmap planning, or feature prioritisation, read `docs/PRODUCT_MASTER_PLAN.md` first.
- For documentation-only work, do not touch `src/`, CSS, Vite config, or localStorage logic.

## Delivery Rules

- Every code task must create a branch, commit, push, and open a pull request against `main`.
- No local-only completion is acceptable for code work.
- If Codex cannot push or open a PR, stop and explain why.
- PRs must follow `docs/PR_DELIVERY_STANDARD.md`.
- Update `DEVELOPMENT_LOG.md` after meaningful changes when appropriate.

## Language Rules

- Explain completed work to the user in beginner-friendly Chinese.
- Keep app UI text, code, filenames, route ids, CSS class names, docs headings, and PR structure in English unless Chinese is explicitly useful for user-facing explanation.
