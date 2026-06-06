# PR Delivery Standard

This repository uses pull requests as the normal delivery path for code work.

## Required For Every Code Task

Every code task must:

1. Create a focused branch from latest remote `main`.
2. Commit the completed scoped change.
3. Push the branch.
4. Open a pull request against `main`.

No local-only completion is acceptable for code work.

If Codex cannot push or open a PR, it must stop and explain the exact blocker.

## Branch Rules

- Use the `codex/` prefix unless the user requests another branch name.
- Keep one task per branch.
- Do not mix unrelated modules in one branch.
- Do not include generated clutter or unrelated formatting churn.

## Commit Rules

- Commit only relevant files.
- Use a clear imperative commit message.
- Do not include unrelated local changes.
- Documentation-only commits must not include `src/`, CSS, Vite config, or localStorage logic changes.

## Pull Request Rules

Open PRs against `main`.

The PR body must include:

1. Summary
2. Files changed
3. Testing
4. Not implemented
5. Manual checklist

## PR Body Template

```md
## Summary

- 

## Files changed

- 

## Testing

- 

## Not implemented

- 

## Manual checklist

- [ ] Confirmed branch is based on latest remote `main`
- [ ] Confirmed no unrelated modules changed
- [ ] Confirmed localStorage keys are protected
- [ ] Confirmed app behavior is unchanged where not in scope
- [ ] Confirmed responsive layout if UI changed
- [ ] Confirmed Vercel preview if available
```

## Documentation-Only Tasks

Documentation-only tasks may still use a branch, commit, push, and PR when requested.

Testing should confirm:

- requested Markdown files exist
- no `src/` files changed
- no CSS files changed
- no Vite config changed
- no localStorage logic changed

## Failure Handling

If push or PR creation fails, Codex must report:

- branch name
- commit hash if one exists
- exact command or tool that failed
- likely reason
- safe next step for the user
