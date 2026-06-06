# Agent Brief

## Product Name

Coach Command Centre / 教练罗盘

For the full product blueprint, read `docs/PRODUCT_MASTER_PLAN.md`.

## Positioning

Coach Command Centre is a coach-first football coaching operating system. It helps coaches manage team identity, players, sessions, tactical diagrams, and the weekly coaching loop from one local-first workspace.

This is not a generic admin dashboard. It should feel like a personal Coach HQ / Coach Mission Control for real football preparation, delivery, review, and player development.

## Target Users

- grassroots football coaches
- youth football coaches
- amateur football coaches
- school, college, and community coaches
- developing coaches who want a more systematic workflow

## Product Feeling

The app should feel:

- focused, premium, and practical
- coach-first rather than admin-first
- like Coach HQ / Coach Mission Control
- structured enough for serious coaching work
- emotionally motivating where appropriate, with light FC manager mode energy
- unified across modules, not like separate page experiments

## Design Direction

Use Apple-inspired clarity, football-specific workflow, and coach-facing product emotion.

- Light workspaces for planning, review, readable forms, session outputs, and reports.
- Dark workspaces for immersive player, team, and tactical command surfaces.
- Club theme variables should connect the app to the user's team identity.
- Avoid generic SaaS dashboard patterns when a coaching-specific workflow would be clearer.

## Core Modules

| Module | Product Role |
| --- | --- |
| Dashboard | Coach Mission Control for today, this week, readiness, priorities, and recent work. |
| Players | Player Operating System for squad overview, profiles, notes, lineup, tactics, assignments, and development direction. |
| Session Planner | Session Design Studio for planning, activities, diagrams, draft protection, and future PDF-ready output. |
| Tactical Board | Tactical Workstation for saved boards, pitch diagrams, presentation, and session diagram compatibility. |
| Team Setup / Onboarding | Take-charge flow for coach identity, team identity, season setup, squad setup, and club theme. |
| Match Centre | Future match reflection centre, not heavy fixture admin. |
| Reports | Future coach-facing summaries after enough player, session, board, and match data exists. |

## Protect

- Current localStorage MVP data.
- Existing module functionality.
- Club theme consistency.
- Session draft recovery.
- Tactical board and embedded session diagram compatibility.
- Existing English app UI text.
- The product's coach-first identity.

## Do Not Build Yet

Do not build these unless explicitly requested:

- backend
- database
- login/authentication
- cloud sync
- AI/API calls
- payment/subscription
- team chat
- parent/player accounts
- complex permissions
- medical sensitive records
- full SaaS architecture
