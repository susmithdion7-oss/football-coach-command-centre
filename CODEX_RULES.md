# Codex Development Rules

These rules protect Coach Command Centre / 教练罗盘 during future development. Every Codex session should use the latest remote `main` branch as the source of truth and avoid old local directories.

## Required Reading Before Development

Before doing any work, read:

1. `README.md`
2. `PRODUCT_BRIEF.md`
3. `PROJECT_CONTEXT.md`
4. `CODEX_RULES.md`
5. `ROADMAP.md`
6. `DESIGN_SYSTEM.md`
7. `DEVELOPMENT_LOG.md`
8. `docs/MODULE_GUIDE.md`
9. `docs/DATA_AND_STORAGE.md`
10. `docs/UI_DESIGN_GUIDE.md`

If the task touches a module, also inspect the current source files for that module on the latest remote `main` branch before editing.

## Repository Truth Rule

- Use `susmithdion7-oss/football-coach-command-centre`.
- Use the latest remote `main` branch.
- Do not use old local directories.
- If the current local directory is not the real repository, do not treat it as source truth.
- Do not rebuild the project from zero.
- Do not overwrite the live app with an old placeholder version.

## Current Stage

Current stage: Frontend localStorage MVP / Coach HQ product refinement.

Allowed by default:

- focused documentation updates
- small frontend improvements
- UI/UX refinements that preserve data
- localStorage-safe data shape extensions
- bug fixes that preserve existing behavior and saved records

Not allowed unless the user explicitly asks:

- backend
- database
- login
- cloud sync
- AI/API calls
- payments
- chat
- parent/player accounts
- complex permissions
- full SaaS architecture

## Non-Negotiable Data Protection Rules

Protect real browser-saved user data:

- players
- sessions
- tactical boards
- team identity
- crest/avatar/coach photo data URLs
- diagrams
- session drafts
- lineup, tactic, and assignment state

Rules:

1. Do not clear localStorage.
2. Do not casually rename localStorage keys.
3. Do not remove compatibility for old saved data.
4. Do not overwrite saved records with incomplete defaults.
5. Do not break player, session, tactical board, or team identity loading.
6. Do not break crest, avatar, coach photo, or diagram storage.
7. Do not break unsaved draft recovery or warnings.
8. If adding fields, make them optional and backward compatible.
9. If changing data shape, add a careful migration or compatibility layer.
10. Explain data-safety impact in the final response.

## Feature Boundaries

Do not add these now unless explicitly requested:

- Supabase/Firebase setup
- authentication
- OpenAI/Claude/Gemini/API calls
- server routes
- payment/subscription
- team chat
- parent/player portals
- sensitive medical record systems
- broad club admin features

## Incremental Development Rules

- Do one clear task at a time.
- Prefer planning first for major UI or architecture tasks.
- Do not redesign unrelated modules while working on one module.
- Do not perform broad refactors unless directly required.
- Keep changes close to the files/modules involved.
- Preserve existing behavior unless the user asked to change it.
- Prefer established project patterns over new abstractions.
- Do not delete existing files unless the user explicitly asks.
- If unsure, plan first instead of directly changing code.

## UI / UX Rules

The app should feel like a unified premium football coaching workspace.

Core direction:

- Dashboard = Coach Mission Control.
- Players = Player Operating System.
- Session Planner = Session Design Studio.
- Tactical Board = presentation-style tactical workstation.
- Onboarding = take-charge team creation flow.

Rules:

- Coach-first, not admin-first.
- Avoid giant forms on initial page load.
- Avoid spreadsheet-like layouts unless data truly requires it.
- Use modals, drawers, tabs, panels, and workspaces for depth.
- Keep pages full-width and workspace-like.
- Use internal panel scrolling for dense lists.
- Use dynamic club identity when relevant.
- Keep Players and Tactical Board dark styles tied to club colours.
- Keep Session Planner lighter but still studio-like.
- Do not make each page feel like a disconnected experiment.

## Module Safety Notes

### Dashboard

Dashboard is implemented and should evolve into Coach Mission Control. Do not treat it as a blank landing page.

### Players

Players is implemented and substantial. Do not call it a placeholder. Protect player data, avatars, notes, ratings, development focus, lineup, tactics, and assignments.

### Session Planner

Session Planner is implemented and substantial. Protect saved sessions, activities, embedded diagrams, copy-to-board flow, and `sessionDraft` recovery.

### Tactical Board

Tactical Board is implemented and substantial. Protect saved boards, pitch layouts, object data, diagrams, drawing controls, and presentation mode.

### Match Centre / Calendar / Reports

These are future / disabled / placeholder modules. Build gradually only when requested.

## Testing Requirements

For code changes, usually check:

- app starts locally
- build passes when relevant
- affected page loads
- existing localStorage data still appears
- create/edit/save flow still works if touched
- draft protection still works if touched
- responsive layout if UI was changed
- Vercel preview if deployed through PR

For documentation-only changes, verify:

- requested Markdown files exist
- README links point to the right documents
- no `src/` files changed
- no localStorage logic changed
- no Vite/build config changed

## Commit and PR Rules

When possible:

- create a focused branch for feature work
- commit only relevant files
- open a PR for review
- describe scope clearly in the PR body
- include testing steps

For documentation-only tasks, commits may touch only Markdown/docs files. Do not include app source code changes.

## Development Log Rule

After meaningful work, update `DEVELOPMENT_LOG.md` with:

```md
Date:
Task:
Scope:
Files changed:
What changed:
Testing:
Known issues:
Next step:
```

## Final Response Rule

Every completed task should be explained in beginner-friendly Chinese.

Include:

1. 创建/更新了哪些文件。
2. 每个文件是做什么的。
3. 哪些内容基于最新远端 `main`。
4. 如何确认没有使用旧目录。
5. 如何测试或 review。
6. 已知风险或没有做的事情。
7. 是否创建了 commit 或 PR。
