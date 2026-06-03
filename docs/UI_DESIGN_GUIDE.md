# UI Design Guide

Coach Command Centre should feel like a premium football coaching workspace: practical, immersive, coach-first, and shaped by the user's team identity.

## Design Principles

- Coach-first, not admin-first.
- Full-width workspace layouts.
- Strong hierarchy and quick scanning.
- Avoid giant default forms.
- Use tabs, modals, drawers, panels, and workspaces for depth.
- Keep lists scrollable inside panels where needed.
- Preserve dynamic club identity across the app.
- Avoid spreadsheet-like layouts unless the data truly needs a table.

## CSS Import Order

`src/main.jsx` imports CSS in this order:

| CSS file | Purpose |
| --- | --- |
| `styles.css` | Global app shell, base tokens, sidebar, topbar, buttons, shared cards/forms. |
| `diagram.css` | Diagram pitch and diagram object styling. |
| `tacticalBoard.css` | Tactical Board workstation layout, saved boards, inspector, presentation mode. |
| `teamWizard.css` | Team setup wizard styles. |
| `crest.css` | Team badge and crest rendering. |
| `dashboard.css` | Dashboard / Coach HQ layouts and cards. |
| `playersHub.css` | Earlier players hub styles kept for compatibility. |
| `playersOperatingSystem.css` | Players OS dark workspace and module structure. |
| `playersOperatingSystemPolish.css` | Polished Players OS layer tied to club theme variables. |
| `sessionPlanner.css` | Session Planner core styles. |
| `sessionPlannerConcept.css` | Session Studio concept/workspace styles. |
| `onboarding.css` | Onboarding base flow. |
| `onboardingPolish.css` | Onboarding polish layer. |
| `onboardingFinalConcept.css` | Final concept visual layer for onboarding. |
| `onboardingDesktopProportions.css` | Large desktop onboarding proportions. |

## Theme Variables

`src/utils/teamIdentity.js` sets CSS variables on `document.documentElement`:

| Variable | Meaning |
| --- | --- |
| `--club-primary` | Main team UI colour. |
| `--club-primary-dark` | Darker primary shade. |
| `--club-primary-soft` | Soft transparent primary shade. |
| `--club-secondary` | Secondary team UI colour. |
| `--club-accent` | Home kit / accent colour. |
| `--club-on-primary` | Text colour on primary backgrounds. |
| `--club-on-secondary` | Text colour on secondary backgrounds. |

Use these variables for module accents instead of hard-coding new brand colours.

## Shared UI Patterns

| Pattern | Current examples | Guidance |
| --- | --- | --- |
| App shell | Sidebar, topbar, content frame | Keep navigation stable and avoid page logic in the shell. |
| Cards/panels | Dashboard cards, studio panels, Players dark panels | Use for grouped data and actions, not nested decoration. |
| Modals/drawers | Player editor, profile modal, note modal, create session modal | Use for focused actions and detail. |
| Workspaces | Session Planner workspace, Tactical Board workstation | Use for design-heavy coaching work. |
| Preview panels | Onboarding live preview, dashboard tactical preview | Use to make data feel real and visual. |
| Disabled future actions | Dashboard and sidebar future items | Keep disabled states clear and intentional. |

## Module UI Notes

### Dashboard

Dashboard currently mixes real data with preview/future areas. Keep real coaching priorities above decorative content. Future improvements should make the next action, next session, player attention, and next match more actionable.

### Players

Players OS uses a darker, immersive workspace. Maintain the Player Centre / Squad Management / Development Plans structure. Avoid turning Players back into a flat table or giant form.

### Session Planner

Session Planner should remain a studio. Keep the dashboard, create route, workspace tabs, timeline, activity editor, quality checklist, and diagram tools close together.

### Tactical Board

Tactical Board should prioritize the pitch and object controls. Keep saved board list, pitch, and inspector visible at the same time on desktop.

### Onboarding and Team Setup

These modules use team identity and live preview to make setup feel personal. Preserve image upload limits and readable step layouts.

## Accessibility and Usability Guidance

- Keep button labels clear.
- Ensure disabled actions look disabled and explain future intent where possible.
- Maintain readable contrast when club colours change.
- Keep scroll containers predictable.
- Avoid horizontal overflow in dense modules.
- Preserve keyboard-safe modal close controls where present.

## Improvement Opportunities

- Add a small visual regression checklist for major modules.
- Standardize button variants across CSS layers.
- Consolidate repeated panel/card styles after the feature set stabilizes.
- Add responsive review passes for Players, Session Planner, and Tactical Board.
- Add an export/print style once report/PDF work begins.
