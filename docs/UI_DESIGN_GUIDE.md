# UI Design Guide

Coach Command Centre / 教练罗盘 should feel like a unified premium football coaching workspace. This guide documents the current UI diagnosis and the intended design direction.

## Current UI Diagnosis

The app has strong module foundations but should become more visually unified.

Current strengths:

- Strong Coach HQ product concept.
- Dynamic club identity and theme variables.
- Substantial Players OS, Session Planner, and Tactical Board workflows.
- Dark immersive Players workspace.
- Tactical Board presentation mode.
- Onboarding live preview and take-charge flow.

Current issues:

- Some modules feel like separate design experiments.
- Dashboard still mixes real data and future preview content.
- Session Planner needs stronger design-studio hierarchy.
- Tactical Board needs a more polished presentation-tool feel.
- Disabled future actions need consistent treatment.
- Some layouts need responsive and density review.

## Final UI Direction

The final product should feel like:

- Coach Mission Control for the dashboard.
- Player Operating System for Players.
- Session Design Studio for Session Planner.
- Tactical Workstation for Tactical Board.
- Take Charge Onboarding for first-time setup.

The whole app must feel like one product, not page-by-page experiments.

## Design Principles

- Coach-first, not admin-first.
- No giant forms on first load.
- No wasted whitespace.
- No disconnected page themes.
- Use club colours consistently.
- Use light surfaces for planning/review and dark surfaces for immersive command work.
- Keep dense modules scannable.
- Use modals/drawers/tabs for deeper information.
- Keep future features visibly disabled or clearly marked as preview.

## Spacing

- Use full-width workspace layouts for major modules.
- Use compact panels for dense information.
- Avoid large empty hero sections once real data exists.
- Keep action areas close to the content they affect.
- Prefer internal scroll areas for long lists.

## Colours

- Use team identity variables for accent and active states.
- Keep neutral surfaces readable.
- Use danger colours only for destructive actions.
- Avoid turning a whole page into one flat club-colour block.
- Test bright and dark team colours.

## Dark / Light Usage

Light workspaces:

- Dashboard content areas.
- Session Planner dashboard/workspace.
- Team Setup forms.
- Reports and future PDF previews.

Dark workspaces:

- Players OS.
- Tactical Board.
- Presentation-style command panels.

Dark modules must still inherit club colour accents.

## Club Theme Integration

`teamIdentity.js` provides:

- `--club-primary`
- `--club-primary-dark`
- `--club-primary-soft`
- `--club-secondary`
- `--club-accent`
- `--club-on-primary`
- `--club-on-secondary`

Use these for selected states, active tabs, primary highlights, pitch accents, and key callouts.

## Coach Mission Control Dashboard

Dashboard should show:

- what matters today
- next session
- this week's training priorities
- players needing attention
- next match context
- recent tactical boards
- coach/team goals
- quick actions

Avoid:

- static welcome panels that waste space
- unclear preview data
- metrics that do not guide action

## Player Operating System

Players should show:

- squad overview
- Player Centre list/detail
- profile modals
- notes timeline
- development focus
- lineup/tactics/assignments
- future Development Plans

Avoid:

- spreadsheet-first layout
- giant add-player form on load
- dark styling disconnected from club theme

## Session Design Studio

Session Planner should show:

- dashboard/library/drafts
- create session wizard
- session workspace
- session timeline
- one activity editor at a time
- diagram tools near activity context
- quality checklist
- reflection and output readiness

Avoid:

- one giant session form
- hidden draft state
- excessive page scrolling

## Tactical Workstation

Tactical Board should show:

- pitch as the main stage
- object toolbar
- saved board library
- inspector controls
- board notes
- presentation mode
- future export path

Avoid:

- small pitch area
- controls too far from the pitch
- unclear selected states

## Take Charge Onboarding

Onboarding should show:

- coach identity
- team identity
- squad setup
- season rhythm
- coaching direction
- review and launch

Avoid:

- overwhelming first-time users
- unreliable import preview
- theme choices that do not appear in preview

## Existing CSS References

| CSS file | Main role |
| --- | --- |
| `styles.css` | Global shell, shared base styles. |
| `dashboard.css` | Dashboard / Coach HQ. |
| `playersOperatingSystem.css` | Players OS structure. |
| `playersOperatingSystemPolish.css` | Players OS polish and club theme integration. |
| `sessionPlanner.css` | Session Planner base. |
| `sessionPlannerConcept.css` | Session Studio concept/workspace. |
| `tacticalBoard.css` | Tactical Board workstation. |
| `diagram.css` | Pitch and diagram objects. |
| `teamWizard.css` | Team setup wizard. |
| `crest.css` | Team badge/crest. |
| `onboarding*.css` | Onboarding layers and desktop proportions. |

## Review Checklist For UI Tasks

- Does the page still feel like Coach Command Centre?
- Does it inherit club colour correctly?
- Is the main coaching task obvious?
- Are future actions clearly disabled or marked preview?
- Are dense lists scrollable inside panels?
- Are modals/drawers focused and easy to close?
- Does the layout work on desktop and smaller screens?
- Did the task avoid unrelated module redesign?
