---
name: coach-command-players
description: Work on Players as the Coach Command Centre Player Operating System. Use for Player Centre, Squad Management, lineup, tactics, assignments, development plans shell, empty squad state, player action menus, and club theme integration.
---

# Coach Command Players

## When To Use

Use this skill for Players OS planning, implementation, polish, and review.

## Required Inputs

- Target Players area.
- Planning-only or implementation-approved.
- Any required player workflow or state.

## Workflow

1. Read `AGENTS.md`, `AGENT_BRIEF.md`, `DESIGN_SYSTEM.md`, `docs/MODULE_GUIDE.md`, and `docs/DATA_AND_STORAGE.md`.
2. Inspect current Players files before editing.
3. Protect `players`, `squadLineup`, `tacticalSetup`, and `playerAssignments`.
4. Preserve Player Centre, Squad Management, Lineup, Tactics, Assignments, profile details, notes, avatars, and development focus.
5. Improve or plan within these product areas:
   - Player Centre
   - Squad Management
   - Lineup
   - Tactics
   - Assignments
   - Development Plans shell
   - empty squad state
   - player action menu
   - club theme integration
6. Keep the dark workspace connected to club theme variables.
7. Test empty squad, one-player, and populated squad states.

## Definition Of Done

- Players still feels like a Player Operating System.
- Existing player records and related state remain compatible.
- Empty and populated states are usable.
- Club colours are respected.
- No unrelated module is changed.

## What Not To Do

- Do not add complex drag/drop unless explicitly requested.
- Do not turn Players into a spreadsheet-first admin page.
- Do not rename localStorage keys.
- Do not add backend, login, AI/API, payment, or chat.
