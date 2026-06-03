# Product Brief: Coach Command Centre

Coach Command Centre is a coach-first football workspace for head coaches and developing coaches. It brings team identity, player management, session planning, tactical diagrams, and future match reflection into one local-first web app.

The current product is a frontend React + Vite MVP using browser localStorage. It is already beyond a basic placeholder build: the app includes working onboarding, club setup, Dashboard/Home, Players OS, Session Studio, and Tactical Board modules.

## Product Summary

| Item | Current decision |
| --- | --- |
| Product type | Football coaching management web app |
| Primary user | Head coach / developing coach |
| Current stage | Frontend localStorage MVP |
| Storage | Browser localStorage only |
| Deployment | Vercel using default Vite build setup |
| Backend | Not present |
| AI/API | Not present |
| Cloud sync | Not present |

## Target Users

Primary users are:

- youth football coaches
- grassroots football coaches
- amateur football coaches
- school and college coaches
- community football coaches
- young developing coaches

These users need more than admin. They want to feel that they are building a team, developing players, planning better sessions, explaining tactics, and improving as coaches.

## Current Implemented Product

### Dashboard / Home

The Dashboard is the Coach HQ landing area. It uses team identity, players, sessions, tactical boards, upcoming sessions, quick actions, and preview sections.

### Onboarding

The onboarding flow guides the coach through coach profile, team identity, squad setup, season setup, coaching direction, and review/launch. It supports CSV and pasted player import, image upload, and a localStorage launch flow.

### Club Setup / Team Identity

Club Setup manages team name, club name, season, age group, coach profile, colours, crest, motto, goals, training rhythm, match day, and dynamic theme values.

### Players

Players is a Player Operating System. It includes Player Centre, Squad Management, lineup, tactics, assignments, profiles, notes, avatar upload, ratings, development focus, and a Development Plans preview section.

### Session Planner

Session Planner is a Session Studio. It includes a dashboard, create flow, saved sessions, draft autosave, workspace tabs, session timeline, activity editor, diagrams, quality checklist, and a future AI assistant shell.

### Tactical Board

Tactical Board is a tactical workstation. It includes saved boards, board types, pitch layouts, draggable markers, balls, cones, mini goals, arrows, lines, areas, inspector controls, notes, duplication, clearing, deletion, and presentation mode.

## Partial / Preview Areas

These areas exist but are not complete production modules yet:

- Dashboard Match Centre preview.
- Dashboard Club Announcements preview.
- Dashboard Player Progress preview.
- Players Development Plans section.
- Session Planner AI assistant shell.
- Disabled actions: New Announcement, Add Fixture, Record Availability, View Match Centre.

## Future / Placeholder Modules

These are shown as disabled future navigation items or preview concepts:

- Match Centre.
- Calendar.
- Reports.

## Core Product Workflow

The current working workflow is:

1. Coach completes onboarding or updates Club Setup.
2. App stores team identity and applies club theme.
3. Coach adds or imports players.
4. Coach manages player profiles, notes, lineup, tactics, and assignments.
5. Coach creates or edits sessions in Session Studio.
6. Coach adds activity diagrams and can copy them to Tactical Board.
7. Coach creates saved tactical boards for training or match preparation.
8. Dashboard summarizes the current local workspace.

## Storage Principle

The app is local-first. All records are stored in the browser under the `footballCoachCommandCentre:` key prefix. This keeps the MVP simple, but it means data is browser-specific and can be lost if browser storage is cleared.

Existing local data must be protected. Do not rename keys, clear localStorage, or overwrite saved records without a migration plan.

## Current Out of Scope

Do not build these in the current stage unless the project stage changes:

- backend
- database
- login
- cloud sync
- AI/API calls
- payment system
- team chat
- player/parent accounts
- complex permissions
- medical sensitive records
- full SaaS architecture

## Success Criteria For The Current Local MVP

The local MVP is successful when a coach can:

- create and save a team identity
- import or add players
- manage player profiles and notes
- manage lineup/tactics/assignments locally
- create and save sessions
- recover unsaved session drafts
- draw and save tactical boards
- copy activity diagrams into Tactical Board
- use Dashboard to understand the current coaching workspace
- keep data after refresh in the same browser

## Future Product Direction

Short-term: improve the existing local MVP, especially Players, Session Planner, Tactical Board usability, and data backup/export.

Mid-term: build Match Centre and reporting foundations that connect match reflection to future training focus.

Long-term: add backend, authentication, cloud sync, image storage, and then AI assistant features using secure server-side API routes.
