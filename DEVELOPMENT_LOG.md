# Development Log

This file records important product and engineering work for Coach Command Centre / 教练罗盘.

Future Codex sessions should read this log before development, then add a short entry after meaningful changes.

## 2026-05-15 - First-Time Onboarding Flow v1

Date: 2026-05-15

Task: Redesign the first-time user onboarding flow.

Files changed:

- `src/App.jsx`
- `src/pages/OnboardingFlow.jsx`
- `src/onboarding.css`
- `src/main.jsx`
- `DEVELOPMENT_LOG.md`

What changed:

- Added a full-screen first-time entry page with Create New Team and Explore Demo choices.
- Added a six-step onboarding wizard for Coach Profile, Team Identity, Squad Setup, Season Setup, Coaching Direction, and Review & Launch.
- Added front-end-only coach photo and team crest uploads.
- Added CSV and pasted player-list parsing with import preview before launch.
- Connected onboarding completion to the existing localStorage team identity and players patterns.
- Preserved the existing formal app shell for users whose team identity is already completed.

Testing:

- Vercel build check passed on the PR branch.
- Manual testing should cover new-user onboarding, image upload, player import preview, launch into Dashboard, and old-user data protection.

Known issues:

- Explore Demo currently shows a polished coming-soon modal instead of creating demo data.
- XLSX import is not included in this first version; CSV and paste list are supported.

Next step:

- Manually test the full onboarding flow in an incognito browser and then test an existing browser with saved data.

## Initial Log Entry

Date: 2026-05-13

Task: Establish long-term project documentation for future Codex development.

Files changed:

- `PROJECT_CONTEXT.md`
- `CODEX_RULES.md`
- `ROADMAP.md`
- `DEVELOPMENT_LOG.md`
- `README.md`

What changed:

- Added a permanent product context document for Coach Command Centre / 教练罗盘.
- Added development rules for future Codex sessions.
- Added a staged roadmap covering local MVP, cloud version, and future AI version.
- Added this development log and future log template.
- Added README links to the documentation set.

Testing:

- Documentation-only change.
- No React code changed.
- No UI logic changed.
- No localStorage logic changed.
- No app functionality changed.

Known issues:

- The local app was not changed or retested because this task is documentation-only.

Next step:

- Use these documents at the start of every future Codex development task.

## Current Existing Product Summary

The product is a frontend localStorage MVP for football coaches.

Existing modules:

- Dashboard / Home
- Club Setup / Team Identity
- Players
- Session Planner
- Tactical Board
- Match Centre placeholder
- Calendar placeholder
- Reports placeholder

Existing capabilities:

- dynamic team identity
- crest upload
- team colours and UI theme colours
- players saved in localStorage
- sessions saved in localStorage
- tactical boards saved in localStorage
- session activities can embed diagrams
- tactical boards can be drawn and saved
- draft protection exists to avoid losing unsaved work
- deployed to Vercel
- developed through multiple pull requests

## Recently Completed Major Modules

Recent product direction and implementation work includes:

- localStorage MVP foundation
- team identity and dynamic club theme
- player management foundation
- Players Squad Hub / Player Profile direction
- player avatar upload direction
- session planning foundation
- tactical board foundation
- diagrams embedded in session activities
- draft protection for important editing flows
- Vercel deployment

## Known Product Direction

The product should become a premium coach-first football workspace.

Near-term product focus:

- improve Players as a Player Development Hub
- improve Session Planner as a Session Design Studio
- strengthen tactical board usability
- build Match Centre foundation gradually
- connect match reflection to future session planning
- preserve all local data and draft protection

Do not rush into backend, AI, login, or payments.

## How To Record Future Development

Add a new entry near the top of this file after meaningful work.

Keep entries short but specific. The goal is to help the next Codex session understand what changed and why.

Template:

```md
## YYYY-MM-DD - Short Task Name

Date:
Task:
Files changed:
What changed:
Testing:
Known issues:
Next step:
```

Example:

```md
## 2026-05-13 - Improve Player Profile Modal

Date: 2026-05-13
Task: Improve Player Profile modal layout and notes timeline.
Files changed:
- `src/components/Players.jsx`
- `src/styles/players.css`
What changed:
- Added a clearer profile header.
- Improved notes timeline layout.
- Preserved existing player localStorage data.
Testing:
- Started the app locally.
- Opened Players page.
- Confirmed existing players still load.
- Added and edited a note.
Known issues:
- No automated tests cover this flow yet.
Next step:
- Add training feedback inside Player Profile.
```
