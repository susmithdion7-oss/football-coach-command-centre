# Roadmap: Coach Command Centre / 教练罗盘

This roadmap keeps future work focused on the coach-first product loop. It should be read with `PROJECT_CONTEXT.md`, `CODEX_RULES.md`, `DESIGN_SYSTEM.md`, and the `docs/` folder before development.

## Current Stage

Current stage: Frontend localStorage MVP / Coach HQ product refinement.

The product already proves the local coaching loop:

- create team identity
- import/add players
- manage player profiles, notes, lineup, tactics, and assignments
- plan sessions
- autosave session drafts
- create activity diagrams
- copy diagrams to Tactical Board
- create and save tactical boards
- apply club theme colours
- deploy to Vercel

Current technical limits:

- no backend
- no database
- no login
- no cloud sync
- no AI/API calls
- no payments
- no chat

## Short-Term Roadmap

Short-term work should stay frontend-only unless the user explicitly changes the project stage.

| Priority | Focus | Goal |
| --- | --- | --- |
| High | Dashboard -> Coach Mission Control | Make Home show the coach's next action, weekly priorities, squad state, session state, and tactical/match context. |
| High | Players -> Player Operating System polish | Improve visual unity, club theme integration, player review states, profile depth, and Development Plans path. |
| High | Session Planner -> Session Design Studio | Refine dashboard, create flow, session workspace, activity editor, reflection, and output readiness. |
| High | Tactical Board -> Presentation-style workstation | Improve toolbar, saved board library, object controls, presets, and presentation feel. |
| Medium | Onboarding polish | Keep the take-charge flow clear, compact, and trustworthy for first-time coaches. |
| Medium | Data export/import backup | Add local data backup and restore before cloud sync exists. |
| Medium | PDF export | Produce coach-facing session outputs with diagrams when ready. |

## Medium-Term Roadmap

| Focus | Goal |
| --- | --- |
| Match Centre foundation | Fixtures, opponent, venue, match plan, lineup, reflection, and next training focus. |
| Training feedback | Connect delivered sessions to player development and future planning. |
| Match feedback | Record player/team match feedback and turn it into next-session priorities. |
| Session review | Add reflection and follow-up workflow after sessions. |
| Player development trends | Turn notes, ratings, and feedback into visible development history. |
| Reports | Coach-facing summaries for players, sessions, boards, and match reflection. |
| Better responsive layout | Review major modules across desktop, tablet, and mobile. |

## Long-Term Roadmap

Long-term work starts only after the local product loop is strong.

| Focus | Goal |
| --- | --- |
| Supabase/Firebase backend | Add persistent cloud data when local data shapes are stable. |
| Authentication | Add coach accounts and workspace ownership. |
| Cloud database | Store teams, players, sessions, boards, match records, and reports. |
| Image storage | Move crest, coach photo, and player avatars from data URLs to cloud storage. |
| AI assistant | Add secure server-side AI suggestions based on real coaching context. |
| Paid plans | Consider only after product value and cloud cost are clear. |
| Multi-team/workspace support | Let a coach manage multiple teams or seasons. |

## Do Not Build Yet

Do not build these in the current local MVP stage:

- chat
- parent/player accounts
- payments
- full club admin system
- AI API now
- database now
- backend now
- complex permissions
- medical sensitive record system

## Module Direction

### Dashboard / Coach Mission Control

Next goal: make Dashboard the coach's daily command screen. It should make the next session, next match, player priorities, tactical board activity, and team goals immediately clear.

### Players / Player Operating System

Next goal: polish the current Players OS and deepen development tracking. Keep Player Centre, Squad Management, Lineup, Tactics, Assignments, and profile modals.

### Session Planner / Session Design Studio

Next goal: strengthen the studio flow. Improve create session wizard, workspace layout, activity design, session reflection, and future PDF output.

### Tactical Board / Presentation Workstation

Next goal: make the board faster and more presentation-ready. Improve object workflows, saved boards, pitch controls, and export path.

### Match Centre

Next goal: create foundation only when requested. Match Centre should connect match problems to future training, not become heavy fixture admin.

## Backend Route

When ready:

1. Freeze and document stable localStorage data shapes.
2. Plan migration from localStorage to cloud records.
3. Add authentication.
4. Add database persistence.
5. Add image storage.
6. Add export/import recovery.
7. Add cloud sync carefully.
8. Add server-side AI routes later.

## AI Route

AI should assist the coach, not replace the coach.

Safe route:

1. Backend/API foundation first.
2. Provider key stored server-side only.
3. Read-only suggestions first.
4. Editable drafts, never automatic overwrites.
5. Session suggestions.
6. Player development summaries.
7. Match review to training focus.
8. Paid plans later if needed.
