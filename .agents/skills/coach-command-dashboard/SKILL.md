---
name: coach-command-dashboard
description: Work on the Coach Command Centre Dashboard as Coach Mission Control using existing local data only. Use for Dashboard planning, Dashboard implementation, home screen prioritization, coach focus, readiness, weekly priorities, and dashboard QA.
---

# Coach Command Dashboard

## When To Use

Use this skill for Dashboard / Home work that should make the page feel like Coach Mission Control.

## Required Inputs

- Requested Dashboard outcome.
- Planning-only or implementation-approved.
- Any priority sections or screenshots.

## Workflow

1. Read `AGENTS.md`, `AGENT_BRIEF.md`, `DESIGN_SYSTEM.md`, `docs/MODULE_GUIDE.md`, and `docs/DATA_AND_STORAGE.md`.
2. Inspect `src/pages/Dashboard.jsx` and related CSS before editing.
3. Use only existing `players`, `footballCoachSessions`, `tacticalBoards`, and `teamIdentity` data.
4. Prioritize real coaching decisions over decorative metrics.
5. Organize around useful sections:
   - Today's Coach Focus
   - Coach Tasks
   - Next Session Readiness
   - Players Need Attention
   - This Week
   - Tactical Board
   - Recent Activity
   - Season Objectives
6. Keep preview/future content clearly separate from real saved data.
7. Test empty, partial, and populated local data states.

## Definition Of Done

- Dashboard tells the coach what matters next.
- Existing data loads safely after refresh.
- Empty states are clear and coach-friendly.
- Club theme and product feel remain consistent.
- No unrelated module behavior changes.

## What Not To Do

- Do not add AI, backend, database, APIs, match data models, or cloud sync.
- Do not invent fake saved data as if it were real.
- Do not remove current quick actions without a replacement plan.
- Do not touch localStorage keys unless explicitly approved.
