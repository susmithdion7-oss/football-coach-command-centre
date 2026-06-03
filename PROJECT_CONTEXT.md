# Project Context: Coach Command Centre / 教练罗盘

Coach Command Centre, working name 教练罗盘, is a coach-first football coaching workspace. It is a personal coaching operating system for building team identity, managing player development, designing training, creating tactical diagrams, and connecting future match reflection back into the next session.

This is not a club administration product. It should feel like a practical, lightweight, real-world version of a Football Manager-style coaching workspace, while staying professional, focused, and usable for real coaches.

## Product Vision

Coach Command Centre should help a coach feel:

- I am leading a real team.
- I have my own Coach HQ.
- My players are growing over time.
- My training is becoming more systematic.
- My tactical ideas are easier to explain.
- My match problems can become next-session priorities.
- I am improving as a coach, not just filling forms.

The emotional target is achievement, identity, control, growth, immersion, and professional confidence.

## Target Users

Primary users are:

- youth football coaches
- grassroots football coaches
- amateur football coaches
- school and university team coaches
- young developing coaches
- coaches who want to systematize their own coaching work

## What This Product Is Not

Coach Command Centre is not:

- a Centre Circle-style grassroots admin app
- a parent chat tool
- a team fee collection tool
- a club back-office platform
- a fixture/referee/payment administration system
- a simple spreadsheet manager
- a generic session form generator

The product should avoid drifting into heavy admin work unless that admin directly supports the coach's preparation, delivery, reflection, or player development loop.

## What This Product Is

Coach Command Centre is intended to become:

- Coach HQ
- Player Operating System
- Player Development Hub
- Session Design Studio
- Tactical Workstation
- Match Reflection Centre
- Coach Notes / Feedback Loop
- future AI coaching assistant powered by real saved coaching context

## Current Technical State

Current stage: Frontend localStorage MVP / Coach HQ product refinement.

Technology:

- React 19
- Vite 7
- CSS
- browser localStorage
- GitHub repository
- Vercel deployment

Currently not present:

- backend
- database
- login
- cloud sync
- AI/API calls
- payments
- chat

## Current Modules

| Module | Source | Status | Summary |
| --- | --- | --- | --- |
| App shell | `src/App.jsx` | Implemented | Owns navigation, topbar/sidebar shell, app state, storage writes, onboarding gate, and cross-module callbacks. |
| Dashboard / Home | `src/pages/Dashboard.jsx` | Implemented / substantial | Uses players, sessions, tactical boards, team identity, upcoming sessions, and quick actions. Needs evolution into Coach Mission Control. |
| Onboarding | `src/pages/OnboardingFlow.jsx`, `src/pages/OnboardingFlowV2.jsx` | Implemented / substantial | Coach/team/squad/season/direction onboarding with CSV/paste import and launch flow. |
| Team Setup / Club Setup | `src/pages/TeamSetup.jsx` | Implemented / substantial | Team identity, theme colours, crest upload, coach profile, season details, and settings. |
| Players OS | `src/pages/Players.jsx`, `src/pages/PlayersOperatingSystem.jsx`, `src/pages/PlayersOperatingSystemV2.jsx` | Implemented / substantial | Player Centre, Squad Management, Lineup, Tactics, Assignments, avatars, notes, development focus. Development Plans is future/coming soon. |
| Session Planner | `src/pages/SessionPlanner.jsx` | Implemented / substantial | Session Studio, draft autosave, saved sessions, activity editor, diagrams, copy diagram to Tactical Board. Needs full Session Design Studio refinement. |
| Tactical Board | `src/pages/TacticalBoard.jsx` | Implemented / substantial | Saved boards, pitch layouts, draggable objects, arrows/lines/areas, inspector controls, presentation mode. Needs presentation-workstation polish. |
| Diagram Editor | `src/components/DiagramEditor.jsx` | Implemented | Edits activity diagrams in Session Planner. |
| Diagram Preview | `src/components/DiagramPreview.jsx` | Implemented | Normalizes and renders pitch layouts and diagram objects. |
| Team Badge | `src/components/TeamBadge.jsx` | Implemented | Renders crest/initial badge across app shell, dashboard, and setup. |
| Storage utilities | `src/utils/storage.js` | Implemented | localStorage get/set/remove helpers with app prefix. |
| Team identity utilities | `src/utils/teamIdentity.js` | Implemented | Identity normalization, crest validation, theme variable generation, theme application. |

## Implemented / Substantial Modules

- Dashboard / Home.
- Onboarding / OnboardingFlowV2.
- Team Setup / Club Setup / Team Identity.
- Players Operating System.
- Session Planner / Session Studio.
- Tactical Board.
- DiagramEditor, DiagramPreview, TeamBadge.
- storage and team identity utilities.

## Partial / Preview Modules

- Dashboard Match Centre preview.
- Dashboard Club Announcements preview.
- Dashboard Player Progress preview.
- Players Development Plans section.
- Session Planner AI assistant shell.
- Disabled actions: New Announcement, Add Fixture, Record Availability, View Match Centre.

## Future Shell Modules

- Match Centre.
- Calendar.
- Reports.

## Current Data Storage

All current product data is browser-local. The storage prefix is `footballCoachCommandCentre:`.

Important current keys:

- `footballCoachCommandCentre:players`
- `footballCoachCommandCentre:footballCoachSessions`
- `footballCoachCommandCentre:tacticalBoards`
- `footballCoachCommandCentre:teamIdentity`
- `footballCoachCommandCentre:sessionDraft`
- `footballCoachCommandCentre:squadLineup`
- `footballCoachCommandCentre:tacticalSetup`
- `footballCoachCommandCentre:playerAssignments`
- `footballCoachCommandCentre:coachCommandCentre:onboardingComplete`

Team crests, coach photos, and player avatars are stored as data objects / data URLs inside saved records.

## Core Product Principles

- Coach-first, not admin-first.
- Productive and emotional, not just functional.
- The app should feel like one unified product, not disconnected page experiments.
- Dashboard is Coach Mission Control.
- Players is the Player Operating System.
- Session Planner is the Session Design Studio.
- Tactical Board is a presentation-style tactical workstation.
- Onboarding is a take-charge flow.
- Lists show objects; clicks open detail; modals/drawers handle actions; workspaces support design.
- Avoid giant forms on initial page load.
- Avoid wasted whitespace and endless page scrolling.
- Use scrollable panels for dense lists.
- Preserve localStorage data and draft protection.

## UI / UX Principles

- Premium, modern, coach-focused, football-specific.
- Strong hierarchy and full-width workspaces.
- Dark left sidebar and clean content frames.
- Club colour integration across all modules.
- Players and Tactical Board can use dark workspaces but must inherit club colours.
- Session Planner can stay lighter but must feel like a design studio.
- Dashboard should show the coach what matters today or this week.
- Onboarding should make the coach feel they are taking charge of their team.

## AI Long-Term Direction

AI is a long-term direction, not a current frontend feature. It should only be added after backend/API infrastructure exists.

Future AI should use real product context:

- team identity
- player data
- player notes
- development focus
- session history
- tactical diagrams
- match feedback
- coach goals
- team style
- previous reflections

Do not put AI provider keys in frontend code.

## Backend / Database Long-Term Direction

A future cloud version may use Supabase or Firebase for:

- authentication
- database persistence
- cloud image storage
- multi-device sync
- backup and restore
- server-side AI routes

Before backend work begins, document current localStorage data shapes and create a migration plan that protects existing browser-local users.

## Current Things Not To Build

Do not add these unless the user explicitly changes the project stage:

- backend
- database
- login
- cloud sync
- AI/API calls
- payments
- team chat
- parent/player accounts
- complex permissions
- medical sensitive records
- full club admin system
- full SaaS architecture
