# Agent Workflow

This guide explains how to use Codex on Coach Command Centre with less repeated prompting.

## Start Every Task

Ask Codex to use:

- latest remote `main`
- repository `susmithdion7-oss/football-coach-command-centre`
- `AGENTS.md`
- `AGENT_BRIEF.md`
- the relevant module skill
- `docs/PRODUCT_MASTER_PLAN.md` for major product direction, roadmap, feature planning, or redesign decisions

Do not let Codex use old local directories. If there is doubt, ask it to clone or fetch fresh from GitHub before planning.

## When To Use Plan Mode

Use Plan Mode first for:

- major Dashboard, Players, Session Planner, or Tactical Board work
- UI redesign or layout changes
- localStorage or data shape changes
- architecture decisions
- backend, cloud, or AI planning
- large roadmap tasks that need to become small PRs

Plan Mode should answer:

- files likely touched
- source code impact
- localStorage impact
- acceptance criteria
- testing checklist
- branch name
- PR delivery plan

## When To Use PRODUCT_MASTER_PLAN.md

Read `docs/PRODUCT_MASTER_PLAN.md` before:

- major UI redesigns
- module redesigns
- roadmap planning
- new feature planning
- product direction review

Use it with `DESIGN_SYSTEM.md`, `PROJECT_CONTEXT.md`, and the relevant module skill so implementation stays aligned with the long-term Coach HQ vision.

## When To Use Each Skill

| Skill | Use For |
| --- | --- |
| `coach-command-product-manager` | Plan sprints, split goals into small PRs, write acceptance criteria, no coding. |
| `coach-command-ui-polish` | UI consistency, spacing, responsive polish, club theme alignment. |
| `coach-command-dashboard` | Dashboard as Coach Mission Control. |
| `coach-command-players` | Players as Player Operating System. |
| `coach-command-session-studio` | Session Planner as Session Design Studio. |
| `coach-command-tactical-board` | Tactical Board as coaching presentation and tactical workstation. |
| `coach-command-qa-review` | PR review, localStorage safety checks, build checks, responsive review. |

## Requesting Implementation

Use a clear request:

```text
Use latest remote main.
Use AGENTS.md and the relevant skill.
Create a branch.
Implement only this scoped task:
[task]
Do not touch unrelated modules.
Protect localStorage.
Commit, push, and open a PR against main.
Explain the result in beginner-friendly Chinese.
```

For code work, no local-only completion is acceptable.

## Requesting QA Review

Use:

```text
Use coach-command-qa-review.
Review this PR/branch:
[link or branch]
Check build, localStorage safety, unrelated changes, UI theme, responsive layout, and delivery checklist.
Findings first.
Do not fix unless I approve.
```

## Reviewing Vercel Preview

After a PR creates a Vercel preview:

1. Open the preview URL.
2. Test the changed module first.
3. Check desktop and mobile widths.
4. Confirm existing saved data still appears.
5. For Session Planner, test draft recovery if touched.
6. For Players, test empty and populated squad states if touched.
7. For Tactical Board, test saving and presentation mode if touched.
8. Report screenshots or notes back to Codex for follow-up fixes.

## Updating DEVELOPMENT_LOG

After meaningful work, ask Codex to add a short entry near the top of `DEVELOPMENT_LOG.md`.

The entry should include:

- Date
- Task
- Scope
- Files changed
- What changed
- Testing
- Known issues
- Next step

Documentation-only tasks should say that no `src/`, CSS, Vite config, or localStorage logic changed.

## Avoiding Old Directory Mistakes

Use this safety phrase in important tasks:

```text
Do not use old local directories. If the current directory is not a fresh checkout of susmithdion7-oss/football-coach-command-centre on latest remote main, fetch or clone the real repo first.
```

Before implementation, Codex should confirm:

- remote repository name
- current branch
- base commit from `origin/main`
- changed files are only the intended scope

## PR Delivery Reminder

For code work:

- branch required
- commit required
- push required
- PR against `main` required

If Codex cannot push or open a PR, it must stop and explain the blocker instead of claiming the task is complete.
