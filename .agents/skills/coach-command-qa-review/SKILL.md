---
name: coach-command-qa-review
description: Review Coach Command Centre pull requests or local changes for safety, build health, localStorage protection, UI regressions, responsive layout, module scope, and delivery discipline.
---

# Coach Command QA Review

## When To Use

Use this skill to review a PR, branch, preview deployment, or local change before merge.

## Required Inputs

- PR link, branch name, or local diff.
- Target module or task goal.
- Whether review should be findings-only or include fixes.

## Workflow

1. Read `AGENTS.md`, `CODEX_RULES.md`, `docs/DATA_AND_STORAGE.md`, `docs/UI_DESIGN_GUIDE.md`, and `docs/PR_DELIVERY_STANDARD.md`.
2. Confirm the branch is based on latest remote `main`.
3. Inspect changed files and reject unrelated module churn.
4. For code changes, run `npm run build` when possible.
5. Check localStorage keys and data compatibility.
6. Check for console-risky undefined/null paths in touched flows.
7. Review responsive layout and club theme behavior for UI changes.
8. Confirm docs or `DEVELOPMENT_LOG.md` were updated when needed.
9. Produce findings first, then testing status and residual risk.

## Definition Of Done

- Build status is reported for code changes.
- localStorage safety is explicitly assessed.
- Unrelated changes are identified.
- UI theme and responsive risks are checked.
- Manual testing checklist is clear.

## What Not To Do

- Do not approve changes that rename storage keys without migration.
- Do not treat local-only completion as enough for code work.
- Do not ignore preview-only or disabled future states.
- Do not make fixes unless the user asks for implementation.
