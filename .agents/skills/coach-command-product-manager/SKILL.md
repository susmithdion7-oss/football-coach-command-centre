---
name: coach-command-product-manager
description: Plan Coach Command Centre sprints, break product goals into small pull requests, and write scope plus acceptance criteria without coding. Use for roadmap shaping, feature planning, sprint planning, PR slicing, or non-coding product management work.
---

# Coach Command Product Manager

## When To Use

Use this skill when the user asks to plan work, shape a feature, split a large goal, define acceptance criteria, or prepare a safe implementation sequence.

## Required Inputs

- User goal or product area.
- Target module, if known.
- Must-not-build constraints.
- Any requested deadline, priority, or PR size preference.

## Workflow

1. Read `AGENTS.md`, `AGENT_BRIEF.md`, `PROJECT_CONTEXT.md`, `ROADMAP.md`, `CODEX_RULES.md`, and relevant docs.
2. Read `docs/PRODUCT_MASTER_PLAN.md` when planning sprints, proposing roadmap items, or deciding next best tasks.
3. Restate the goal in product language.
4. Identify what is already implemented and what should be protected.
5. Split the goal into small PR-sized tasks.
6. For each task, define scope, files likely touched, acceptance criteria, testing, and explicit non-goals.
7. Recommend the first safest PR.

## Definition Of Done

- The plan is small enough to implement incrementally.
- Each PR has clear acceptance criteria.
- localStorage and existing module behavior are protected.
- Out-of-scope items are named.
- No source code is changed.

## What Not To Do

- Do not write code.
- Do not redesign multiple modules in one plan unless asked.
- Do not add backend, database, login, AI/API, payment, or chat.
- Do not propose localStorage key changes without a migration plan.
