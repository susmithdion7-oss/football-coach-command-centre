# Codex Workflow

This document explains how future Codex sessions should work on Coach Command Centre / 教练罗盘.

## Standard Task Start Template

Before doing any work, read:

- `README.md`
- `PRODUCT_BRIEF.md`
- `PROJECT_CONTEXT.md`
- `CODEX_RULES.md`
- `ROADMAP.md`
- `DESIGN_SYSTEM.md`
- `DEVELOPMENT_LOG.md`
- `docs/MODULE_GUIDE.md`
- `docs/DATA_AND_STORAGE.md`
- `docs/UI_DESIGN_GUIDE.md`

Use the latest remote `main` branch.
Do not use old local directories.
Follow `CODEX_RULES.md` strictly.
Do not break localStorage or existing saved data.
Do not add backend, database, login, AI, payment, chat, or API calls unless explicitly requested.
Work incrementally.
If this is a major UI or architecture task, start in planning mode first.
After finishing, explain changes in beginner-friendly Chinese and provide exact testing steps.

## Always Confirm Repository Truth

Use this repository:

```text
susmithdion7-oss/football-coach-command-centre
```

Rules:

- Use latest remote `main` as source truth.
- If local directory does not match the real repo, do not trust it.
- Do not use old generated directories.
- Do not recreate the project from scratch.

## When To Use Plan Mode

Use Plan Mode first for:

- major UI redesigns
- Dashboard Coach Mission Control work
- Players OS redesign/polish
- Session Planner architecture changes
- Tactical Board workflow changes
- data model changes
- localStorage migrations
- backend/cloud planning
- AI planning

Plan Mode should define:

- goal
- scope
- files likely touched
- data safety impact
- acceptance criteria
- testing checklist
- what not to do

## When To Write Code Directly

Direct implementation is acceptable for:

- small copy changes
- focused bug fixes
- documentation updates
- narrow CSS fixes
- small UI adjustments with clear scope

Even then, inspect the relevant source files first.

## PR / Commit Workflow

Preferred flow:

1. Create a focused branch when making product/code changes.
2. Commit only relevant files.
3. Open a PR for review.
4. Include summary, files changed, data safety notes, and testing steps.
5. Do not mix unrelated modules in one PR.

Documentation-only tasks may be committed directly when requested, but must not include source code changes.

## Testing Workflow

For code changes:

- run the app or build when possible
- test affected module manually
- test refresh persistence
- test existing localStorage data still loads
- test draft protection if Session Planner is touched
- test club theme colours if UI is touched
- test Vercel preview if a PR/deployment exists

For documentation-only changes:

- confirm requested files exist
- confirm README links are correct
- confirm no `src/` files changed
- confirm no localStorage/Vite files changed

## DEVELOPMENT_LOG Update

After meaningful work, add an entry near the top of `DEVELOPMENT_LOG.md`:

```md
## YYYY-MM-DD - Short Task Name

Date:
Task:
Scope:
Files changed:
What changed:
Testing:
Known issues:
Next step:
```

## Avoiding Old Directory Mistakes

A previous documentation pass used an old local folder and incorrectly described Players, Session Planner, and Tactical Board as placeholders. That must not happen again.

Before summarizing or editing:

- check remote repo name
- check default branch is `main`
- inspect `src/App.jsx`
- inspect relevant module files
- inspect current docs

## localStorage Safety Workflow

Before touching data logic:

1. Read `docs/DATA_AND_STORAGE.md`.
2. Identify exact keys affected.
3. Confirm no key rename is required.
4. If data shape changes, keep backward compatibility.
5. Add migration only with clear plan.
6. Test existing saved records after refresh.
7. Explain data safety in Chinese final response.

## Final Response Format

After finishing, explain in beginner-friendly Chinese:

1. 创建/更新了哪些文件。
2. 每个文件是做什么的。
3. 哪些内容基于最新 `main`。
4. 如何避免旧目录错误。
5. 如何测试或 review。
6. 已知风险或没有做的事情。
7. 是否创建了 commit 或 PR。
