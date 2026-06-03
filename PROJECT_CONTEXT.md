# Project Context: Coach Command Centre / 教练罗盘

Coach Command Centre, working name 教练罗盘, is a coach-first football workspace. It helps youth, grassroots, amateur, school, and community coaches build a team identity, manage players, design sessions, create tactical explanations, and prepare for future match reflection.

This document exists so future Codex sessions can understand the current product before making changes.

## Product Vision

Coach Command Centre should feel like a personal headquarters for a developing football coach.

The product should help a coach feel that:

- I am operating like a real head coach.
- My team has identity, goals, and direction.
- My players are developing over time.
- My sessions have logic, diagrams, feedback, and reflection.
- Every time I open the app, I know what coaching work matters next.

The emotional target is achievement, identity, control, growth, and immersion. The product can borrow the feeling of football manager mode plus professional coaching tools, while staying practical and realistic.

## Current Technical State

Current stage: frontend localStorage MVP.

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

## Current Product State

The app already has a running localStorage MVP with substantial working modules.

### Implemented / Substantial

| Module | Source | Current behavior |
| --- | --- | --- |
| Dashboard / Home | `src/pages/Dashboard.jsx` | Uses team identity, players, sessions, tactical boards, upcoming sessions, quick actions, and dashboard previews. |
| Onboarding | `src/pages/OnboardingFlowV2.jsx` | First-run coach/team/squad/season/direction wizard with CSV/paste squad import and launch flow. |
| Club Setup / Team Identity | `src/pages/TeamSetup.jsx` | Team identity, colours, crest upload, coach profile, season setup, and theme preview/settings. |
| Players | `src/pages/PlayersOperatingSystemV2.jsx` | Player Centre, Squad Management, lineup, tactics, assignments, player profiles, notes, avatars, and development focus. |
| Session Planner | `src/pages/SessionPlanner.jsx` | Session Studio dashboard, workspace, draft autosave, activities, diagrams, saved sessions, and copy diagram to Tactical Board. |
| Tactical Board | `src/pages/TacticalBoard.jsx` | Saved boards, pitch layouts, draggable objects, arrows/lines/areas, object inspector, notes, duplication, and presentation mode. |

### Partial / Preview

- Dashboard Match Centre preview.
- Dashboard Club Announcements preview.
- Dashboard Player Progress preview.
- Players Development Plans section.
- Session Planner AI assistant shell.
- Disabled actions: New Announcement, Add Fixture, Record Availability, View Match Centre.

### Future / Placeholder

- Match Centre.
- Calendar.
- Reports.

## Core Product Principles

- Coach-first, not admin-first.
- Productive and emotional, not just functional.
- Full-width workspace, not cramped forms.
- Show the most important information first.
- Details should open through clicks, modals, drawers, tabs, or dedicated pages.
- Avoid giant default forms.
- Avoid endless page scrolling.
- Keep list areas scrollable inside panels when the data grows.
- Preserve local user data and draft protection.

Core UX pattern:

- Home shows the whole system.
- Lists show objects.
- Clicks show detail.
- Modals or drawers perform actions.
- Workspaces support design work.
- Preview pages create useful output.

## Module Direction

### Dashboard / Coach HQ

Dashboard should remain the coaching headquarters. It should surface team identity, current season, player count, this week's sessions, next match context, recent player development, tactical boards, coach goals, and quick actions.

### Club Setup / Team Identity

Club Setup is where the coach builds and updates team identity. Team colours influence the whole UI through CSS variables, so changes here should keep the app feeling like the coach's own team headquarters.

### Players / Player Development Hub

Players should remain a Squad Hub plus Player Profile system, not a spreadsheet or giant form. The current operating system structure includes Player Centre, Squad Management, and Development Plans. Future work should deepen development tracking without breaking player records, avatars, notes, ratings, lineup, tactics, or assignments.

### Session Planner / Session Design Studio

Session Planner should continue as a Session Design Studio: dashboard, create flow, workspace, activity timeline, activity editor, diagram tools, coaching checklist, and future output/AI layers. Protect saved sessions, embedded diagrams, and draft autosave.

### Tactical Board

Tactical Board is the visual coaching and training explanation tool. It already supports saved boards, pitch layouts, drawing objects, inspector controls, and presentation mode. Future work should improve usability and export without changing saved board compatibility.

### Match Centre

Match Centre is still future-facing. Its purpose should be match preparation and reflection, especially turning match observations into next training focus.

### Calendar and Reports

Calendar and Reports should stay lightweight until the core coaching loop is stronger. They should support coaching workflow, not become heavy club administration modules.

## Future AI Vision

AI is a long-term direction, but it must not be implemented in the current frontend-only stage. Future AI requires backend/API infrastructure and must never place provider keys in the frontend.

Future AI should use real product context: team identity, player data, notes, sessions, tactical diagrams, match feedback, coach goals, and team style.

## What Not To Build Now

Do not add these in the current stage unless the project stage is explicitly changed:

- login
- cloud database
- backend
- AI/API calls
- payments
- team chat
- parent/player accounts
- complex permissions
- medical sensitive records
- full SaaS architecture
