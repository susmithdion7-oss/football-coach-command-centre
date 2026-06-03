# Project Overview

Coach Command Centre / 教练罗盘 is a coach-first football coaching workspace. It helps coaches build a team identity, manage players, plan sessions, create tactical diagrams, and prepare for future match reflection.

The product is not a grassroots admin platform. It is a personal Coach HQ for managing coaching work.

## Project Summary

| Item | Current state |
| --- | --- |
| Product name | Coach Command Centre |
| Chinese working name | 教练罗盘 |
| Product type | Coach-first football coaching workspace |
| Current stage | Frontend localStorage MVP / Coach HQ product refinement |
| Main user | Head coach / developing coach |
| Repository | `susmithdion7-oss/football-coach-command-centre` |
| Source of truth | Latest remote `main` branch |

## Tech Stack

| Area | Current setup |
| --- | --- |
| Frontend | React 19 |
| Build tool | Vite 7 |
| Styling | CSS files imported from `src/main.jsx` |
| Persistence | Browser localStorage via `src/utils/storage.js` |
| Theme | Team identity CSS variables via `src/utils/teamIdentity.js` |
| Components | React functional components |
| Deployment | Vercel default Vite flow |
| Backend | Not present |
| Database | Not present |
| Login | Not present |
| AI/API | Not present |

## Running Locally

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

## Deployment

The repository does not currently include `vercel.json`. Vercel should detect the Vite app automatically.

Expected Vercel settings:

- install command: `npm install`
- build command: `npm run build`
- output directory: `dist`

## Current Capabilities

Implemented / substantial:

- App shell navigation and data flow in `App.jsx`.
- Dashboard / Home using saved players, sessions, tactical boards, team identity, upcoming sessions, and quick actions.
- OnboardingFlowV2 for coach/team/squad/season/direction setup.
- TeamSetup for team identity, colours, crest, coach details, and settings.
- Players OS with Player Centre, Squad Management, Lineup, Tactics, Assignments, notes, avatars, and development focus.
- Session Planner with Session Studio, saved sessions, draft autosave, activities, diagrams, and copy diagram to Tactical Board.
- Tactical Board with saved boards, pitch layouts, draggable objects, arrows, lines, areas, inspector controls, and presentation mode.
- DiagramEditor, DiagramPreview, TeamBadge, storage utilities, and team identity utilities.

Partial / preview:

- Dashboard Match Centre preview.
- Dashboard Club Announcements preview.
- Dashboard Player Progress preview.
- Players Development Plans.
- Session Planner AI Assistant shell.
- Disabled future actions: New Announcement, Add Fixture, Record Availability, View Match Centre.

Future / placeholder:

- Match Centre.
- Calendar.
- Reports.

## Current Limitations

- Data is stored only in the current browser.
- No cloud backup or sync exists yet.
- No backend/database/login exists.
- AI assistant is UI shell only; there are no API calls.
- Match Centre, Calendar, and Reports are disabled/future modules.
- localStorage data can be lost if the browser storage is cleared.

## Repository Structure

```text
football-coach-command-centre/
  README.md
  PRODUCT_BRIEF.md
  PROJECT_CONTEXT.md
  CODEX_RULES.md
  ROADMAP.md
  DESIGN_SYSTEM.md
  DEVELOPMENT_LOG.md
  package.json
  vite.config.js
  index.html
  src/
    App.jsx
    main.jsx
    components/
      DiagramEditor.jsx
      DiagramPreview.jsx
      TeamBadge.jsx
    pages/
      Dashboard.jsx
      OnboardingFlow.jsx
      OnboardingFlowV2.jsx
      Players.jsx
      PlayersOperatingSystem.jsx
      PlayersOperatingSystemV2.jsx
      SessionPlanner.jsx
      TacticalBoard.jsx
      TeamSetup.jsx
    utils/
      storage.js
      teamIdentity.js
    CSS files for dashboard, onboarding, players, sessions, tactics, diagrams, crest, team wizard
  docs/
    PROJECT_OVERVIEW.md
    MODULE_GUIDE.md
    DATA_AND_STORAGE.md
    UI_DESIGN_GUIDE.md
    DEVELOPMENT_TASKS.md
    ITERATION_PLAN.md
    CODEX_WORKFLOW.md
    FEATURE_BACKLOG.md
    QA_CHECKLIST.md
```

## Future Direction

Short-term:

- Dashboard Coach Mission Control v1.
- Players UI polish v2 and Development Plans path.
- Session Planner Dashboard and workspace refinement.
- Tactical Board UI polish.
- Data export/import backup.
- PDF export planning and implementation.

Mid-term:

- Match Centre foundation.
- Training feedback.
- Match feedback.
- Session review.
- Player development trends.
- Reports foundation.
- Better responsive layout.

Long-term:

- Supabase/Firebase backend.
- Authentication.
- Cloud database.
- Cloud image storage.
- AI assistant with secure server-side APIs.
- Multi-team/workspace support.
- Paid plans only if product value and infrastructure justify it.
