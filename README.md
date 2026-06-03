# Coach Command Centre

Coach Command Centre is a coach-first football workspace for managing a team identity, players, training sessions, tactical diagrams, and the weekly coaching loop from one local-first React app.

The current app is a working frontend localStorage MVP deployed through Vercel. It is not just a placeholder shell: Dashboard/Home, onboarding, club setup, Players OS, Session Studio, and Tactical Board are substantial working modules.

## Current App Status

| Area | Status | Notes |
| --- | --- | --- |
| Dashboard / Home | Implemented | Uses players, sessions, tactical boards, team identity, upcoming sessions, and quick actions. |
| Onboarding | Implemented | First-run coach/team/squad/season/direction wizard via `OnboardingFlowV2.jsx`. |
| Club Setup / Team Identity | Implemented | Team identity, colours, crest, coach profile, season details, and theme settings. |
| Players | Implemented | Player Centre, Squad Management, lineup, tactics, assignments, profiles, notes, avatars, and development focus. |
| Session Planner | Implemented | Session Studio dashboard, workspace, draft autosave, activities, diagrams, saved sessions, and copy-to-board flow. |
| Tactical Board | Implemented | Saved boards, pitch layouts, draggable objects, arrows, lines, areas, inspector controls, and presentation mode. |
| Match Centre | Future shell | Disabled navigation item / preview only. |
| Calendar | Future shell | Disabled navigation item. |
| Reports | Future shell | Disabled navigation item. |

## Tech Stack

- React 19
- Vite 7
- CSS module layers imported from `src/main.jsx`
- Browser localStorage for persistence
- GitHub repository source control
- Vercel deployment using the default Vite build flow

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Preview Build

```bash
npm run preview
```

## Documentation

Start here for future development work:

- [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) - product vision, current state, module direction, and what not to build yet.
- [`PRODUCT_BRIEF.md`](PRODUCT_BRIEF.md) - current product brief aligned to the live localStorage MVP.
- [`CODEX_RULES.md`](CODEX_RULES.md) - development rules, data protection, UI principles, testing expectations, and PR guidance.
- [`ROADMAP.md`](ROADMAP.md) - staged roadmap for local MVP, cloud version, and future AI.
- [`DEVELOPMENT_LOG.md`](DEVELOPMENT_LOG.md) - change history and future log template.

Detailed docs:

- [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md)
- [`docs/MODULE_GUIDE.md`](docs/MODULE_GUIDE.md)
- [`docs/DATA_AND_STORAGE.md`](docs/DATA_AND_STORAGE.md)
- [`docs/UI_DESIGN_GUIDE.md`](docs/UI_DESIGN_GUIDE.md)
- [`docs/DEVELOPMENT_TASKS.md`](docs/DEVELOPMENT_TASKS.md)
- [`docs/ITERATION_PLAN.md`](docs/ITERATION_PLAN.md)

## Important Development Rule

This is a localStorage MVP with real browser-saved user data. Do not rename storage keys, clear localStorage, break draft recovery, or overwrite saved records unless a migration plan is explicitly approved.
