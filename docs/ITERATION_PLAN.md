# Iteration Plan

This plan keeps future work focused on the local-first coaching loop before backend, cloud sync, or AI.

## Short-Term: Strengthen The Local MVP

Goal: make the existing localStorage app feel excellent and safer for real coach use.

| Iteration | Focus | Deliverables |
| --- | --- | --- |
| 1 | Documentation and data safety | Complete docs, exact storage key reference, local data protection rules. |
| 2 | Data backup | Export/import local data, clear backup instructions, safe restore behavior. |
| 3 | Dashboard clarity | Stronger next-action area, clearer distinction between real data and previews. |
| 4 | Players depth | Working Development Plans, better notes timeline, clearer player review states. |
| 5 | Session reflection | Delivered-session reflection, follow-up priorities, session-to-player feedback links. |
| 6 | Tactical Board ergonomics | Faster object workflows, better presets, improved board library scanning. |

## Mid-Term: Complete The Coaching Loop

Goal: connect players, sessions, tactical planning, and match reflection.

| Phase | Focus | Deliverables |
| --- | --- | --- |
| 1 | Match Centre foundation | Fixture records, opponent, venue, lineup notes, match plan, reflection. |
| 2 | Match-to-session loop | Convert match reflection into next training focus and follow-up session starter. |
| 3 | Reports foundation | Player development summaries, session history, tactical board library summary. |
| 4 | Calendar foundation | Date-based view for sessions and matches. |
| 5 | Output/export | Coach-facing session/report output, future PDF/image export path. |

## Long-Term: Infrastructure And AI

Goal: move beyond browser-only storage only when the local product loop is strong.

| Stage | Focus | Notes |
| --- | --- | --- |
| Cloud planning | Database model and migration | Start by documenting stable localStorage data shapes. |
| Authentication | Coach account model | Decide whether a coach owns one team or multiple teams. |
| Cloud sync | Multi-device persistence | Protect existing browser-local users during migration. |
| Image storage | Crest/avatar migration | Move data URLs to cloud storage carefully. |
| AI foundation | Server-side API only | Never expose provider keys in the frontend. |
| AI assistant | Read-only suggestions first | Use real team, player, session, and match context. |

## Module Milestones

### Dashboard / Coach HQ

Success criteria:

- Coach can quickly see next session, player priorities, tactical board activity, and match context.
- Preview/future content is clearly labelled or converted into real data-backed content.

### Players

Success criteria:

- Player Centre remains fast and scannable.
- Player profiles show useful development history.
- Development Plans becomes a real workflow.
- Lineup, tactics, and assignments remain compatible with existing data.

### Session Planner

Success criteria:

- Session Studio stays workspace-oriented, not a giant form.
- Draft recovery remains reliable.
- Delivered-session reflections can drive future training focus.
- Activity diagrams remain compatible with Tactical Board.

### Tactical Board

Success criteria:

- Coaches can create a board quickly.
- Saved board library is easy to scan.
- Drawing/editing controls feel direct and predictable.
- Presentation mode remains useful for explanation.

### Match Centre

Success criteria:

- Coaches can record fixture, opponent, lineup, match plan, and reflection.
- Match reflection can generate training focus for the next session.
- Module stays coach-first and avoids heavy club admin.

## Work To Avoid Until Stage Changes

- Backend.
- Cloud database.
- Login.
- AI/API calls.
- Payments.
- Team chat.
- Parent/player accounts.
- Complex permissions.
- Sensitive medical record systems.

## Review Rhythm

After each meaningful iteration:

1. Update `DEVELOPMENT_LOG.md`.
2. Update affected docs under `docs/`.
3. Confirm no localStorage keys were accidentally renamed.
4. Confirm existing data still loads.
5. Review Vercel preview when UI changes are included.
