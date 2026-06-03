# Design System: Coach Command Centre / 教练罗盘

This document defines the long-term visual and UX direction for Coach Command Centre. It is a product design guide, not a CSS refactor request.

## Unified Design Language Goal

The app must feel like one unified coaching product, not a collection of page experiments.

Target feeling:

- premium football coaching workspace
- personal Coach HQ
- practical, modern, focused
- emotionally motivating but not decorative-heavy
- structured enough for serious coaching work
- dynamic enough to feel like the user's own team

## Hybrid Coach HQ Design Principles

The product uses a hybrid visual model:

- Light workspaces for planning, review, forms, and readable coaching documents.
- Dark workspaces for immersive team/player/tactical command environments.
- Club colour accents everywhere, derived from Team Setup.
- Consistent shell, navigation, spacing, typography, buttons, cards, and modal behavior.

## Light Workspace Rules

Use light workspaces when the coach is reading, planning, editing, or reviewing structured information.

Good fit:

- Dashboard content panels
- Session Planner dashboard/workspace
- Team Setup forms
- Reports
- future PDF/export previews

Rules:

- Use white or off-white surfaces.
- Keep typography clear and high contrast.
- Use club colour as accent, not as a wall of colour.
- Avoid giant forms on first load.
- Use tabs, sections, and progressive disclosure.

## Dark Workspace Rules

Use dark workspaces when the coach is managing the team like an operating system or presenting tactical ideas.

Good fit:

- Players OS
- Tactical Board
- tactical presentation states
- high-focus command panels

Rules:

- Dark surfaces must still inherit `--club-primary` and related theme variables.
- Avoid black-only or disconnected dark themes.
- Keep controls readable and compact.
- Use active/selected states clearly.
- Keep data panels dense but not cramped.

## Club Colour Theme Rules

Team identity colours come from `src/utils/teamIdentity.js` and are applied as CSS variables:

- `--club-primary`
- `--club-primary-dark`
- `--club-primary-soft`
- `--club-secondary`
- `--club-accent`
- `--club-on-primary`
- `--club-on-secondary`

Rules:

- Use these variables for accents and selected states.
- Do not hard-code a new page-specific brand palette unless it is a neutral support colour.
- Test multiple club colours: sky blue, red, orange, green, navy, white/light.
- Maintain contrast when user-selected colours are bright or dark.

## Dynamic Primary Colour Rules

The dynamic primary colour should control:

- active navigation accents
- primary action emphasis
- selected tabs
- key stat highlights
- pitch/team identity accents
- subtle glows or outlines in dark workspaces

It should not control:

- large unreadable background blocks without contrast checks
- long text backgrounds
- warning/danger states
- all charts or all cards at once

## Sidebar Rules

The sidebar is the app anchor.

Rules:

- Keep team identity visible.
- Keep navigation consistent.
- Future modules may appear disabled, but disabled states must be visually intentional.
- Club Setup / Settings should remain accessible.
- Avoid adding too many unrelated admin links.

## Header Rules

The header should show current page identity and workspace context.

Rules:

- Include team identity where useful.
- Primary actions should be page-relevant.
- Disabled future actions should not look broken.
- Avoid filling the header with low-priority controls.

## Card Rules

Cards should group real information or actions.

Rules:

- Do not nest cards inside cards unless absolutely necessary.
- Avoid decorative-only cards.
- Use compact cards for dense operational modules.
- Keep repeated card patterns consistent within a module.

## Button Rules

Buttons should clearly express action priority.

Suggested variants:

- Primary: main action, club colour or strong dark/primary style.
- Secondary: supporting action.
- Danger: delete/remove/destructive action.
- Disabled: future or unavailable action, visibly inactive.
- Text/subtle: low-emphasis action.

Rules:

- Do not use disabled buttons for actions that should work.
- Do not hide destructive intent.
- Use short, coach-friendly labels.

## Modal / Drawer Rules

Use modals and drawers for:

- adding/editing players
- player profile detail
- notes
- create session route selection
- player picker
- focused setup choices

Rules:

- Keep modal purpose narrow.
- Include clear close/cancel actions.
- Do not put full-page workflows into tiny modals.
- Use drawers for deeper editing when the context should remain visible.

## Tab Rules

Tabs are useful when a module has stable sub-workflows.

Current examples:

- Players: Player Centre, Squad Management, Development Plans.
- Squad Management: Lineup, Tactics, Assignments.
- Session workspace: basics, focus, activity.

Rules:

- Tab labels should be short.
- Tabs should preserve context.
- Avoid too many tabs at one level.

## Pitch / Tactical UI Rules

Pitch-based UI must feel visual and usable.

Rules:

- Pitch should be the main stage in Tactical Board.
- Object controls should be close to the pitch.
- Selected objects need clear visual state.
- Saved boards should be easy to scan.
- Presentation mode should feel clean and coach-facing.
- Session diagrams and Tactical Board diagrams should remain compatible.

## Dashboard Design Rules

Dashboard is Coach Mission Control.

It should prioritize:

- next session
- this week's coaching priorities
- squad/player attention
- next match context
- recent tactical board activity
- coach/team goals
- quick actions

Avoid:

- static hero sections that waste space
- vague metrics without next action
- confusing real data with future preview content

## Players Design Rules

Players is the Player Operating System.

It may use a dark workspace, but it must inherit club colour.

It should prioritize:

- squad overview
- player selection and profile detail
- fast search/filter
- notes and development focus
- lineup/tactics/assignments
- development plans over time

Avoid:

- turning Players into a spreadsheet
- one giant add/edit form on page load
- disconnected dark styling that ignores team theme

## Session Planner Design Rules

Session Planner is the Session Design Studio.

It should prioritize:

- session library and drafts
- create session workflow
- session timeline
- one activity editor at a time
- coaching points, questions, progressions/regressions
- diagrams close to activity context
- reflection and output readiness

Avoid:

- giant single-page session forms
- hidden draft state
- excessive scrolling without structure

## Tactical Board Design Rules

Tactical Board is a presentation-style tactical workstation.

It should prioritize:

- pitch clarity
- quick object placement
- saved board library
- object inspector controls
- board notes
- presentation mode
- future export/image/PDF path

Avoid:

- tiny pitch area
- controls scattered far from the pitch
- confusing selection/drag states

## Onboarding Design Rules

Onboarding is the take-charge flow.

It should make the coach feel they are creating their Team HQ, not filling admin.

It should prioritize:

- coach identity
- team identity
- club colour
- squad setup
- season setup
- coaching direction
- review and launch

Avoid:

- overwhelming first-time users
- unreliable import preview
- theme choices that are not reflected in the live preview
