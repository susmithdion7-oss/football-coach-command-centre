# Development Log

This file records important product and engineering work for Coach Command Centre / 教练罗盘.

Future Codex sessions should read this log before development, then add a short entry after meaningful changes.

## 2026-05-17 - Players UI Polish and Club Theme Integration

Date: 2026-05-17

Task: Polish the FC-inspired Players section and connect it to the dynamic club theme.

Files changed:

- `src/pages/PlayersOperatingSystem.jsx`
- `src/pages/PlayersOperatingSystemV2.jsx`
- `src/playersOperatingSystemPolish.css`
- `src/main.jsx`
- `DEVELOPMENT_LOG.md`

What changed:

- Routed the Players page to a polished v2 operating system component while preserving the existing Player Centre, Squad Management, and Development Plans structure.
- Compressed the Players top area into a compact control bar and replaced the large module cards with compact module tabs.
- Reworked the Player Centre list height, column sizing, selected row state, and overflow behavior to avoid horizontal scrolling.
- Strengthened the selected player detail panel into a player profile command panel with richer coach actions.
- Polished the dark grouped player action menu and kept Profile, Coaching, Squad, and Danger command groups.
- Reworked Squad Management so the pitch is the main stage, lineup slots open a player picker instead of showing select boxes, and the bench uses player cards.
- Added a player picker for lineup slots, bench additions, and assignments.
- Changed save feedback into a compact toast instead of a full-width green message bar.
- Added a Players polish CSS layer that derives primary highlights, tabs, borders, glow, selected states, buttons, pitch slots, and active states from the global club theme variables.

Testing:

- Code prepared on the existing Players PR branch for Vercel/build validation.
- Manual testing should cover club colour changes, Player Centre selection/action menu, lineup slot picker, bench cards, tactic preset states, assignments, refresh persistence, and unrelated pages.

Known issues:

- Development Plans remains an intentional placeholder.
- Lineup still uses click-to-pick rather than drag and drop.
- No automated tests currently cover the Players operating system flow.

Next step:

- Review the Vercel preview on a 1920x1080 desktop screen and test sky blue, red, orange, and green club themes.

## 2026-05-17 - Players Operating System Redesign v1

Date: 2026-05-17

Task: Redesign the Players section into an FC-inspired player operating system.

Files changed:

- `src/pages/Players.jsx`
- `src/pages/PlayersOperatingSystem.jsx`
- `src/playersOperatingSystem.css`
- `src/main.jsx`
- `DEVELOPMENT_LOG.md`

What changed:

- Replaced the old light Squad Hub entry with a dark, immersive Players workspace.
- Added three top-level Players modules: Player Centre, Squad Management, and Development Plans.
- Built Player Centre with a searchable player list, selected player detail panel, profile completeness, notes, training/match feedback summaries, and a grouped dark action menu.
- Built Squad Management with Lineup, Tactics, and Assignments subtabs using localStorage-backed lineup, tactic, and assignment state.
- Kept Add Player, Edit Player Details, player photo upload, coach notes, and existing player data shape compatible with the existing `players` localStorage data.
- Added Development Plans as a polished coming-soon placeholder without adding backend, AI, API, or database features.

Testing:

- Code prepared on a focused PR branch for build/Vercel validation.
- Manual testing should cover Player Centre selection, action menu, Add/Edit player, notes, Starting XI, bench, tactics, assignments, refresh persistence, and unrelated pages.

Known issues:

- Development Plans is intentionally a placeholder.
- Lineup management uses select-based assignment instead of drag and drop in this first version.
- No automated tests currently cover the Players operating system flow.

Next step:

- Review the Vercel preview on a 1920x1080 desktop screen and test the full Players workflow with existing saved players.

## 2026-05-15 - Onboarding Desktop Proportion Pass

Date: 2026-05-15

Task: Refine first-time onboarding wizard proportions for large desktop screens.

Files changed:

- `src/onboardingDesktopProportions.css`
- `src/main.jsx`
- `DEVELOPMENT_LOG.md`

What changed:

- Added a focused desktop-only proportion layer for the onboarding wizard.
- Increased the shared header, main content, and footer workspace width to 1420px on large screens.
- Adjusted the main desktop columns to a 900px setup panel, 380px live preview panel, and 28px gap.
- Increased setup panel padding, section spacing, preview panel presence, and bottom action button size.
- Preserved all onboarding functionality and localStorage behavior.

Testing:

- Prepared for Vercel/build validation on a focused PR branch.
- Manual testing should focus on 1920x1080 and 27-inch desktop proportions.

Known issues:

- This is a CSS-only proportion pass and still needs visual review on the target monitor.

Next step:

- Review the Vercel preview on a large desktop screen and compare the shell width, left panel, preview panel, and action bar alignment.

## 2026-05-15 - Onboarding Final Concept UI Match

Date: 2026-05-15

Task: Match the first-time onboarding wizard UI to the final concept reference.

Files changed:

- `src/onboardingFinalConcept.css`
- `src/main.jsx`
- `DEVELOPMENT_LOG.md`

What changed:

- Added a final concept CSS layer for the onboarding wizard only.
- Enlarged and rebalanced the desktop wizard canvas to better match the reference concept.
- Refined the dark stadium-like shell, top brand/header, horizontal stepper, white setup panel, dark live preview panel, and fixed bottom action bar.
- Added visual-only autosave text in the bottom action bar.
- Kept existing onboarding functionality, localStorage behavior, player import, image upload, and custom input logic intact.

Testing:

- Prepared on the existing onboarding PR branch for Vercel/build validation.
- Manual testing should focus on 1920x1080 desktop proportions, Step 1 visual match, all onboarding steps, 16-player import preview, and old-user data protection.

Known issues:

- This is a CSS-focused visual refinement; browser-based visual review is still needed before merging.
- Explore Demo remains a coming-soon modal.

Next step:

- Review the Vercel preview on a large screen and check the onboarding flow end to end.

## 2026-05-15 - Onboarding Polish and Squad Import Preview

Date: 2026-05-15

Task: Polish the first-time onboarding wizard and fix the Squad Setup import preview trust issue.

Files changed:

- `src/pages/OnboardingFlow.jsx`
- `src/pages/OnboardingFlowV2.jsx`
- `src/onboardingPolish.css`
- `src/main.jsx`
- `DEVELOPMENT_LOG.md`

What changed:

- Switched onboarding to a polished v2 wizard while keeping the existing app shell untouched.
- Made the wizard layout more compact on large screens with a focused setup card and step-specific Live Coach HQ Preview.
- Added custom role, coaching style, focus, age group, team type, match day, duration, playing style, training focus, and objective inputs.
- Simplified Team Identity to one Primary team colour, expanded named colour presets, and kept custom colour picker support.
- Fixed Squad Setup so pasted or CSV players show the full parsed count, a clear import trust note, and an internally scrollable preview table.
- Reworked Coaching Direction into three clear sections instead of a large button wall.

Testing:

- Code was prepared on a GitHub branch for Vercel/build validation.
- Manual testing should cover a fresh onboarding flow, 16-player paste import, image uploads, launch into Dashboard, Players data, and existing-user data protection.

Known issues:

- Explore Demo remains a polished coming-soon modal and does not create demo data yet.
- CSV import is supported; XLSX import is still out of scope.

Next step:

- Manually test the full onboarding flow from an incognito browser and confirm saved workspaces skip onboarding.

## 2026-05-15 - First-Time Onboarding Flow v1

Date: 2026-05-15

Task: Redesign the first-time user onboarding flow.

Files changed:

- `src/App.jsx`
- `src/pages/OnboardingFlow.jsx`
- `src/onboarding.css`
- `src/main.jsx`
- `DEVELOPMENT_LOG.md`

What changed:

- Added a full-screen first-time entry page with Create New Team and Explore Demo choices.
- Added a six-step onboarding wizard for Coach Profile, Team Identity, Squad Setup, Season Setup, Coaching Direction, and Review & Launch.
- Added front-end-only coach photo and team crest uploads.
- Added CSV and pasted player-list parsing with import preview before launch.
- Connected onboarding completion to the existing localStorage team identity and players patterns.
- Preserved the existing formal app shell for users whose team identity is already completed.

Testing:

- Vercel build check passed on the PR branch.
- Manual testing should cover new-user onboarding, image upload, player import preview, launch into Dashboard, and old-user data protection.

Known issues:

- Explore Demo currently shows a polished coming-soon modal instead of creating demo data.
- XLSX import is not included in this first version; CSV and paste list are supported.

Next step:

- Manually test the full onboarding flow in an incognito browser and then test an existing browser with saved data.

## Initial Log Entry

Date: 2026-05-13

Task: Establish long-term project documentation for future Codex development.

Files changed:

- `PROJECT_CONTEXT.md`
- `CODEX_RULES.md`
- `ROADMAP.md`
- `DEVELOPMENT_LOG.md`
- `README.md`

What changed:

- Added a permanent product context document for Coach Command Centre / 教练罗盘.
- Added development rules for future Codex sessions.
- Added a staged roadmap covering local MVP, cloud version, and future AI version.
- Added this development log and future log template.
- Added README links to the documentation set.

Testing:

- Documentation-only change.
- No React code changed.
- No UI logic changed.
- No localStorage logic changed.
- No app functionality changed.

Known issues:

- The local app was not changed or retested because this task is documentation-only.

Next step:

- Use these documents at the start of every future Codex development task.

## Current Existing Product Summary

The product is a frontend localStorage MVP for football coaches.

Existing modules:

- Dashboard / Home
- Club Setup / Team Identity
- Players
- Session Planner
- Tactical Board
- Match Centre placeholder
- Calendar placeholder
- Reports placeholder

Existing capabilities:

- dynamic team identity
- crest upload
- team colours and UI theme colours
- players saved in localStorage
- sessions saved in localStorage
- tactical boards saved in localStorage
- session activities can embed diagrams
- tactical boards can be drawn and saved
- draft protection exists to avoid losing unsaved work
- deployed to Vercel
- developed through multiple pull requests

## Recently Completed Major Modules

Recent product direction and implementation work includes:

- localStorage MVP foundation
- team identity and dynamic club theme
- player management foundation
- Players Squad Hub / Player Profile direction
- player avatar upload direction
- session planning foundation
- tactical board foundation
- diagrams embedded in session activities
- draft protection for important editing flows
- Vercel deployment

## Known Product Direction

The product should become a premium coach-first football workspace.

Near-term product focus:

- improve Players as a Player Development Hub
- improve Session Planner as a Session Design Studio
- strengthen tactical board usability
- build Match Centre foundation gradually
- connect match reflection to future session planning
- preserve all local data and draft protection

Do not rush into backend, AI, login, or payments.

## How To Record Future Development

Add a new entry near the top of this file after meaningful work.

Keep entries short but specific. The goal is to help the next Codex session understand what changed and why.

Template:

```md
## YYYY-MM-DD - Short Task Name

Date:
Task:
Files changed:
What changed:
Testing:
Known issues:
Next step:
```

Example:

```md
## 2026-05-13 - Improve Player Profile Modal

Date: 2026-05-13
Task: Improve Player Profile modal layout and notes timeline.
Files changed:
- `src/components/Players.jsx`
- `src/styles/players.css`
What changed:
- Added a clearer profile header.
- Improved notes timeline layout.
- Preserved existing player localStorage data.
Testing:
- Started the app locally.
- Opened Players page.
- Confirmed existing players still load.
- Added and edited a note.
Known issues:
- No automated tests cover this flow yet.
Next step:
- Add training feedback inside Player Profile.
```
