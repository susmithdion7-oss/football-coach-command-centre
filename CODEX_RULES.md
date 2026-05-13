# Codex Development Rules

These rules protect Coach Command Centre / 教练罗盘 during future development. Every Codex session should read this file before changing the app.

## Required Reading Before Development

Before making product or code changes, read:

1. `PROJECT_CONTEXT.md`
2. `CODEX_RULES.md`
3. `ROADMAP.md`
4. `DEVELOPMENT_LOG.md`
5. `README.md`

If the task touches an existing module, also inspect the relevant source files before editing.

## Current Stage

The project is currently a frontend localStorage MVP. Treat it as a working product with real local user data.

Allowed by default:

- small, clear frontend improvements
- focused UI/UX refinements
- localStorage-safe data shape extensions
- documentation updates
- bug fixes that preserve existing data

Not allowed unless the user explicitly changes the project stage:

- backend
- database
- login
- cloud sync
- AI/API calls
- payments
- chat
- parent/player accounts
- complex permissions

## Non-Negotiable Data Protection Rules

Do not break or delete existing local user data.

Protect:

- players
- sessions
- tactical boards
- team identity
- crest/avatar images
- diagrams
- drafts
- draft protection

Rules:

1. Do not casually rename localStorage keys.
2. Do not clear localStorage.
3. Do not remove migration compatibility for old saved data.
4. Do not overwrite saved records with incomplete defaults.
5. Do not break player, session, tactical board, or team identity loading.
6. Do not break crest/avatar image storage.
7. Do not break unsaved draft recovery or draft warnings.
8. If adding fields, make them optional and backward compatible.
9. If changing data shape, add careful migration or compatibility logic.
10. Explain data-safety impact in the final response.

## Features Not Allowed Now

Do not add:

- login
- cloud database
- backend
- Supabase/Firebase setup
- AI / OpenAI API / Claude API / Gemini API
- any API calls
- payment/subscription
- team chat
- parent accounts
- player accounts
- complex role permissions
- medical sensitive record systems
- full SaaS architecture

These may be future roadmap items, but they are not part of the current local MVP stage.

## Incremental Development Rules

- Do one clear task at a time.
- Avoid full-project rewrites.
- Avoid broad refactors unless directly required.
- Keep changes close to the files/modules involved.
- Preserve existing behavior unless the user asked to change it.
- Prefer established project patterns over new abstractions.
- Do not delete existing files unless the user explicitly asks.
- Do not redesign unrelated pages while working on one module.
- If a task becomes larger than expected, stop and explain the split before continuing.

## UI / UX Rules

The UI should feel like a premium football coaching workspace, not a generic admin panel.

Use these principles:

- Coach-first, not admin-first.
- Show the most important information first.
- Avoid giant forms on initial page load.
- Use modals, drawers, tabs, or detail pages for deeper information.
- Keep pages full-width and workspace-like.
- Keep list areas scrollable when needed instead of making the whole page endlessly scroll.
- Use dynamic club identity when relevant.
- Keep visual hierarchy strong and practical.
- Avoid spreadsheet-like interfaces.
- Avoid adding unnecessary decorative UI.

Core UX pattern:

- Dashboard shows global coaching status.
- Lists show objects.
- Clicking opens details.
- Modals/drawers handle actions.
- Workspaces support design.
- Previews produce useful output.

## Module Safety Notes

### Players

Players should remain a Squad Hub and Player Profile system. Do not turn it back into a giant form or spreadsheet.

Protect player data, avatars, notes, ratings, development focus, and saved drafts.

### Session Planner

Session Planner should evolve toward Session Design Studio. Do not make it a single giant form.

Protect saved sessions, activities, embedded diagrams, and drafts.

### Tactical Board

Protect saved boards, diagrams, drawing data, and session-embedded diagrams.

### Team Identity

Protect team name, club name, colours, season, coach identity, crest, and theme behaviour.

### Match Centre

Currently placeholder/foundation. Build gradually and keep the purpose focused on turning matches into coaching insight and future training focus.

## Testing Requirements

After every change, test the narrow area touched by the task.

For code changes, usually check:

- app starts locally
- no build errors
- affected page loads
- existing localStorage data still appears
- create/edit/save flow still works if touched
- draft protection still works if touched
- responsive layout if UI was changed

For documentation-only changes, verify:

- files are created/updated correctly
- README links point to the right documents
- no app source files were changed

## Final Response Requirements

Every completed task should be explained in beginner-friendly Chinese.

Include:

1. What files changed.
2. What each changed file is for.
3. What changed in simple terms.
4. How the user can test or review it.
5. Any known risks or things not done.
6. Whether a commit or pull request was created.

Keep the explanation clear and calm. Avoid assuming the user is technical.

## Commit and PR Rules

When possible:

- create a focused branch
- commit only the relevant files
- open a pull request for review
- describe the task clearly in the PR body

Do not mix unrelated feature work into one PR.

For documentation-only tasks, do not include app source code changes.

## Development Log Rule

After meaningful work, update `DEVELOPMENT_LOG.md` with:

- date
- task
- files changed
- what changed
- testing
- known issues
- next step

If the user asks for a tiny change, a short log entry is enough.
