---
name: coach-command-session-studio
description: Work on Session Planner as the Coach Command Centre Session Design Studio. Use for session dashboard, create session wizard, session workspace, activity timeline, diagram panel, PDF-ready structure, and draft protection tasks.
---

# Coach Command Session Studio

## When To Use

Use this skill for Session Planner planning, implementation, polish, and review.

## Required Inputs

- Requested Session Planner outcome.
- Planning-only or implementation-approved.
- Whether draft, saved session, activity, or diagram behavior is touched.

## Workflow

1. Read `AGENTS.md`, `AGENT_BRIEF.md`, `DESIGN_SYSTEM.md`, `docs/MODULE_GUIDE.md`, and `docs/DATA_AND_STORAGE.md`.
2. Inspect `src/pages/SessionPlanner.jsx`, `DiagramEditor`, and `DiagramPreview` when relevant.
3. Protect `footballCoachSessions`, `sessionDraft`, embedded diagrams, and copy-to-board flow.
4. Improve or plan around:
   - Session Dashboard
   - Create Session Wizard
   - Session Workspace
   - activity timeline
   - diagram panel
   - session preview / PDF-ready structure
   - draft protection
5. Keep one activity editing context clear at a time.
6. Make draft state visible and recoverable.
7. Test saved session, unsaved draft, refresh recovery, and embedded diagram behavior if touched.

## Definition Of Done

- Session Planner feels like a Session Design Studio.
- Draft protection still works.
- Saved sessions and diagrams remain compatible.
- Future PDF structure is clearer if in scope.
- No unrelated module is changed.

## What Not To Do

- Do not connect the AI assistant shell to APIs.
- Do not clear or overwrite `sessionDraft`.
- Do not rename session storage keys.
- Do not build backend, database, login, payment, or chat.
