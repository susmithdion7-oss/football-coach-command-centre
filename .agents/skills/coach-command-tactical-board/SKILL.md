---
name: coach-command-tactical-board
description: Work on Tactical Board as a coaching presentation surface and tactical workstation. Use for pitch canvas, board library, toolbar, object inspector, presentation mode, saved boards, and session diagram compatibility.
---

# Coach Command Tactical Board

## When To Use

Use this skill for Tactical Board planning, implementation, polish, and review.

## Required Inputs

- Requested tactical workflow or UI outcome.
- Planning-only or implementation-approved.
- Whether saved boards or diagram compatibility are touched.

## Workflow

1. Read `AGENTS.md`, `AGENT_BRIEF.md`, `DESIGN_SYSTEM.md`, `docs/MODULE_GUIDE.md`, and `docs/DATA_AND_STORAGE.md`.
2. Inspect `src/pages/TacticalBoard.jsx`, `DiagramPreview`, and related CSS before editing.
3. Protect `tacticalBoards` and object data compatibility.
4. Preserve compatibility with embedded/session diagrams.
5. Improve or plan around:
   - pitch canvas
   - board library
   - toolbar
   - object inspector
   - presentation mode
   - saved boards
   - embedded/session diagram compatibility
6. Keep the pitch as the main stage.
7. Test create, select, move, inspect, save, duplicate, delete, clear, and presentation flows if touched.

## Definition Of Done

- Tactical Board feels like a tactical workstation.
- Saved boards still load and save correctly.
- Session diagram compatibility is preserved.
- Presentation mode stays clean and coach-facing.
- No unrelated module is changed.

## What Not To Do

- Do not shrink the pitch into a secondary preview.
- Do not scatter controls away from the pitch without reason.
- Do not rename storage keys or object fields without migration.
- Do not add backend, database, AI/API, login, payment, or chat.
