---
name: coach-command-ui-polish
description: Improve Coach Command Centre UI consistency, spacing, responsiveness, club theme usage, and product feel while protecting functionality. Use for UI polish, visual consistency, layout refinement, responsive review, or theme alignment tasks.
---

# Coach Command UI Polish

## When To Use

Use this skill for focused UI polish across existing Coach Command Centre modules.

## Required Inputs

- Target module or page.
- Desired polish outcome.
- Whether implementation is approved or planning-only.
- Any screenshots, preview notes, or user complaints.

## Workflow

1. Read `DESIGN_SYSTEM.md`, `docs/UI_DESIGN_GUIDE.md`, `AGENT_BRIEF.md`, and relevant module docs.
2. Read `docs/PRODUCT_MASTER_PLAN.md` together with `DESIGN_SYSTEM.md` for major UI direction, module redesign, or product-feel decisions.
3. Inspect current source and CSS for only the target module.
4. Preserve existing interactions and data flows.
5. Use club theme variables such as `--club-primary`, `--club-secondary`, and `--club-accent`.
6. Improve spacing, hierarchy, density, responsive behavior, and selected/disabled states.
7. Check the module still feels like Coach Command Centre, not a generic webpage.
8. Test affected states and responsive widths.

## Definition Of Done

- UI is more consistent with the design system.
- Club theme integration is preserved or improved.
- No giant empty panels are introduced.
- No disconnected page-specific theme is introduced.
- Existing functionality still works.
- No unrelated module is changed.

## What Not To Do

- Do not change localStorage keys or saved data shape.
- Do not add backend, AI/API calls, login, payment, or chat.
- Do not replace a working module with a new shell.
- Do not make broad CSS refactors unless explicitly requested.
