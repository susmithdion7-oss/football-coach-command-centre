# Roadmap: Coach Command Centre / 教练罗盘

This roadmap keeps future work focused. It should be read together with `PROJECT_CONTEXT.md` and `CODEX_RULES.md` before development.

## Current Stage

Current stage: frontend localStorage MVP.

The product already proves the basic coaching loop:

- set up team identity
- manage players
- plan sessions
- create tactical diagrams
- embed diagrams in session activities
- protect drafts
- save data locally
- deploy to Vercel

Current technical limits:

- no backend
- no database
- no login
- no cloud sync
- no AI/API calls
- no payments
- no chat

The current stage should focus on making the local product loop feel excellent before adding infrastructure.

## Current Most Important Priorities

1. Protect existing localStorage data and draft protection.
2. Improve the coach-first product loop.
3. Make Players feel like a Player Development Hub.
4. Make Session Planner feel like a Session Design Studio.
5. Strengthen the link between players, sessions, tactical diagrams, and future match reflection.
6. Keep UI premium, focused, and practical.
7. Avoid adding backend, login, AI, or payment too early.

## Short-Term Roadmap: Better Local MVP

Short-term work should stay frontend-only unless explicitly changed by the user.

Priority candidates:

1. Players Squad Hub refinements
   - stronger squad overview
   - Player Profile modal/page improvements
   - avatar upload polish
   - notes timeline improvements
   - development focus overview
   - players needing review

2. Session Planner Dashboard
   - better session library
   - drafts area
   - this week / next session
   - focus areas
   - session quality checklist
   - recently delivered sessions
   - reflection entry points

3. Create Session Wizard
   - guided create flow
   - start from scratch
   - build from squad needs
   - duplicate previous session
   - session basics
   - focus and structure
   - activities
   - review and create

4. Session Workspace redesign
   - left session timeline
   - centre activity editor
   - right diagram/coaching tools
   - edit one activity at a time
   - reduce endless scrolling

5. PDF / Preview output
   - practical coach-facing training plan output
   - readable activity structure
   - embedded diagrams
   - clear coaching points

6. Match Centre foundation
   - fixtures/opponent basics
   - lineup and formation foundation
   - team performance notes
   - match reflection
   - next training focus

7. Feedback loops
   - training feedback
   - match feedback
   - player development notes
   - reflection-to-next-session workflow

8. Data backup
   - export local data
   - import local data
   - simple recovery path before cloud sync exists

## Medium-Term Roadmap: Cloud Version

Only start this after the local MVP has a stronger product loop.

Possible infrastructure:

- Supabase or Firebase
- authentication
- database
- storage
- multi-device sync
- cloud image storage
- safer backup and restore

Medium-term product questions to answer first:

- Which localStorage data shapes are stable enough to become database tables?
- What should a user account own: one team, multiple teams, or a coach workspace?
- How should images move from base64/local storage to cloud storage?
- What migration path protects existing local users?

Do not rush into cloud infrastructure before the local UX is worth syncing.

## Long-Term Roadmap: AI Version

AI is a major future direction, but it should come after backend/API infrastructure exists.

AI must not be added by putting an API key in the frontend.

Future AI features:

1. AI Session Draft
   - use squad needs, player focus, coach goals, match problems, and team style
   - produce editable session skeletons

2. AI Session Improvement
   - improve an existing session
   - make it more game realistic
   - adapt it for age group, player number, equipment, or ability level

3. AI Player Development Summary
   - summarise recent notes and feedback
   - identify trends and next focus areas

4. AI Match Review to Training Focus
   - turn match reflection into training themes
   - suggest follow-up sessions

5. AI Coach Suggestions
   - coaching questions
   - progression/regression ideas
   - player feedback language
   - session quality checks

AI should use real product context:

- team identity
- player data
- coach notes
- development focus
- sessions
- tactical diagrams where possible
- match feedback
- coach goals
- team style
- previous reflections

## Future Feature List

Possible future features, grouped by product area.

### Coach HQ

- weekly coaching dashboard
- team goals and coach goals
- next action suggestions
- recent player development
- recent tactical boards
- upcoming session/match overview

### Player Development Hub

- richer Player Profile
- notes timeline
- training feedback
- match feedback
- player stats
- milestones
- development trends
- coach suggestions
- future AI summaries

### Session Design Studio

- session templates
- squad needs builder
- match-to-session link
- player groups
- coaching questions bank
- progression/regression suggestions
- session quality checklist
- reflection flow
- PDF export
- future AI session draft

### Tactical Board

- presentation mode
- more pitch layouts
- improved drawing controls
- resize/rotate/drag
- better mini goals
- copy session diagram to board
- export image/PDF

### Match Centre

- fixtures
- opponent
- venue
- formation
- lineup
- bench
- minutes
- goals/assists
- ratings
- player feedback
- match reflection
- next training focus
- create follow-up session from match problems

### Reports

- coach-facing development reports
- player progress summaries
- session history reports
- match reflection summaries
- future PDF output

## Features To Avoid For Now

Do not build these in the current local MVP stage:

- login
- cloud database
- backend
- API calls
- AI integration
- OpenAI/Claude/Gemini keys
- payment/subscription
- team chat
- parent accounts
- player accounts
- advanced permissions
- medical sensitive records
- full SaaS architecture

## Backend / Database Route

When the product is ready for backend work, the likely route is:

1. Document current localStorage keys and data shapes.
2. Decide the database model.
3. Add authentication.
4. Add database persistence.
5. Add image storage.
6. Add export/import migration support.
7. Add cloud sync carefully.
8. Only then consider AI API routes.

Protect local users during migration. Never assume data can be discarded.

## AI Route

The likely AI route is:

1. Backend/API route foundation.
2. Secure AI provider key on the server side.
3. Usage limits and basic safety controls.
4. Read-only AI suggestions first.
5. Editable AI drafts, never auto-overwriting user data.
6. Session generation.
7. Player summaries.
8. Match review to training focus.
9. Paid plans later if needed.

AI should assist the coach, not replace the coach.
