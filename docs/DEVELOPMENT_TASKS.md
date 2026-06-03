# Development Tasks

This is the long-term task board for Coach Command Centre / 教练罗盘. It is a planning document only. It does not change app behavior.

Status values:

- Planned
- In Progress
- Done
- Blocked
- Future

## Task Board Summary

| Task title | Module | Priority | Status |
| --- | --- | --- | --- |
| Dashboard Coach Mission Control v1 | Dashboard | High | Planned |
| Players UI Polish v2 + Club Theme Integration | Players | High | Planned |
| Session Planner Dashboard Redesign | Session Planner | High | Planned |
| Create Session Wizard | Session Planner | High | Planned |
| Session Workspace Redesign | Session Planner | High | Planned |
| Tactical Board UI Polish | Tactical Board | High | Planned |
| PDF Export | Session Planner / Reports | Medium | Planned |
| Data Export / Import Backup | Global Data | High | Planned |
| Match Centre Foundation | Match Centre | Medium | Planned |
| Player Feedback System | Players | Medium | Planned |
| Match Feedback System | Match Centre / Players | Medium | Planned |
| Reports Foundation | Reports | Medium | Planned |
| Supabase Migration Planning | Backend Planning | Future | Future |
| AI Assistant Planning | AI Planning | Future | Future |

## Dashboard Coach Mission Control v1

| Field | Detail |
| --- | --- |
| Module | Dashboard |
| Priority | High |
| Status | Planned |
| Scope | Redesign Dashboard information hierarchy into Coach Mission Control: next session, this week, player attention, tactical board activity, next match context, quick actions. |
| Do not do | Do not build Match Centre, Calendar, Reports, backend, AI, or new storage keys unless explicitly planned. |
| Acceptance criteria | Dashboard clearly separates real data from previews; coach can identify the next useful action within seconds; existing players/sessions/boards/team identity still load. |
| Testing checklist | Load existing saved data; test empty state; test with players/sessions/boards; test club colours; check desktop and mobile; confirm no localStorage wipe. |

## Players UI Polish v2 + Club Theme Integration

| Field | Detail |
| --- | --- |
| Module | Players |
| Priority | High |
| Status | Planned |
| Scope | Polish Player Operating System layout, selected player detail, action groups, dense list scanning, club colour accents, and Development Plans entry point. |
| Do not do | Do not replace Players with a table-only page; do not remove lineup/tactics/assignments; do not break player avatars, notes, or ratings. |
| Acceptance criteria | Players remains a dark club-themed operating system; Player Centre and Squad Management are easier to scan; Development Plans still clearly marked future unless implemented. |
| Testing checklist | Add/edit/delete player; upload avatar; add note; change lineup; save tactics; assign roles; refresh and verify persistence; test multiple club colours. |

## Session Planner Dashboard Redesign

| Field | Detail |
| --- | --- |
| Module | Session Planner |
| Priority | High |
| Status | Planned |
| Scope | Improve Session Studio dashboard: next session, drafts, recent sessions, focus areas, quality checklist, create entry points. |
| Do not do | Do not remove existing saved sessions or draft autosave; do not add AI/API calls. |
| Acceptance criteria | Session dashboard feels like a planning studio; saved sessions and drafts are easy to find; empty states guide the coach. |
| Testing checklist | Test no sessions; test many sessions; create session; duplicate session; delete session; refresh and verify saved sessions. |

## Create Session Wizard

| Field | Detail |
| --- | --- |
| Module | Session Planner |
| Priority | High |
| Status | Planned |
| Scope | Refine guided creation flow: squad needs, scratch, duplicate previous, basics, focus, activities, review. |
| Do not do | Do not make it a giant form; do not connect AI; do not overwrite current draft unexpectedly. |
| Acceptance criteria | Coach can choose a route and open a clean workspace; duplicate route is safe; unsaved changes are protected. |
| Testing checklist | Start from scratch; build from squad needs; duplicate session; cancel flow; test unsaved-change warning; refresh draft. |

## Session Workspace Redesign

| Field | Detail |
| --- | --- |
| Module | Session Planner |
| Priority | High |
| Status | Planned |
| Scope | Improve workspace layout: left timeline, centre activity editor, right coaching/diagram tools, clearer quality checklist. |
| Do not do | Do not remove activity diagrams; do not break copy-to-Tactical-Board; do not remove autosave. |
| Acceptance criteria | Coach edits one activity at a time; diagrams remain linked; draft state is visible; saved sessions update correctly. |
| Testing checklist | Edit basics/focus/activity; add diagram; copy to board; save; update; duplicate; delete; refresh restored draft. |

## Tactical Board UI Polish

| Field | Detail |
| --- | --- |
| Module | Tactical Board |
| Priority | High |
| Status | Planned |
| Scope | Improve tactical workstation layout, toolbar, saved boards list, selected object inspector, presets, and presentation feel. |
| Do not do | Do not replace object data shape without migration; do not remove presentation mode; do not break saved boards. |
| Acceptance criteria | Board creation is faster; selected object state is obvious; saved boards remain compatible; presentation mode feels coach-facing. |
| Testing checklist | Create board; add all object types; drag objects; edit inspector controls; duplicate board; delete board; presentation mode; refresh saved boards. |

## PDF Export

| Field | Detail |
| --- | --- |
| Module | Session Planner / Reports |
| Priority | Medium |
| Status | Planned |
| Scope | Plan and implement coach-facing session output with session details, activities, coaching points, and diagrams. |
| Do not do | Do not add backend; do not make export depend on cloud; do not expose broken download buttons. |
| Acceptance criteria | Coach can generate a readable output from a saved session; diagrams are included or clearly handled. |
| Testing checklist | Export short session; export long session; export with diagrams; export without diagrams; test browser download. |

## Data Export / Import Backup

| Field | Detail |
| --- | --- |
| Module | Global Data |
| Priority | High |
| Status | Planned |
| Scope | Add backup/restore for localStorage data before cloud sync exists. |
| Do not do | Do not clear data; do not overwrite without confirmation; do not silently rename keys. |
| Acceptance criteria | Coach can export a JSON backup and import it safely with clear warnings. |
| Testing checklist | Export empty workspace; export full workspace; import backup; reject invalid file; confirm existing data protection. |

## Match Centre Foundation

| Field | Detail |
| --- | --- |
| Module | Match Centre |
| Priority | Medium |
| Status | Planned |
| Scope | Build foundation for fixtures, opponent, venue, match plan, lineup notes, reflection, and next training focus. |
| Do not do | Do not build a full club admin fixture system; do not add league tables/payments/chat. |
| Acceptance criteria | Match Centre helps the coach prepare and reflect; match issues can become training priorities. |
| Testing checklist | Create fixture; add opponent/venue; add plan; add reflection; verify refresh persistence. |

## Player Feedback System

| Field | Detail |
| --- | --- |
| Module | Players |
| Priority | Medium |
| Status | Planned |
| Scope | Add structured training feedback and development history connected to player profiles. |
| Do not do | Do not add sensitive medical records; do not expose player accounts; do not remove existing notes. |
| Acceptance criteria | Coach can record useful feedback and see it inside player development context. |
| Testing checklist | Add feedback; edit feedback; filter by player; refresh persistence; check profile timeline. |

## Match Feedback System

| Field | Detail |
| --- | --- |
| Module | Match Centre / Players |
| Priority | Medium |
| Status | Planned |
| Scope | Add match feedback for team and individual players, linked to future training priorities. |
| Do not do | Do not build complex stats platform first; do not add player login. |
| Acceptance criteria | Coach can record match observations and create next-session focus from them. |
| Testing checklist | Add match feedback; link players; create training focus; refresh persistence. |

## Reports Foundation

| Field | Detail |
| --- | --- |
| Module | Reports |
| Priority | Medium |
| Status | Planned |
| Scope | Create simple coach-facing summaries for players, sessions, boards, and future match feedback. |
| Do not do | Do not build complex analytics or paid reporting yet. |
| Acceptance criteria | Reports summarize existing local data clearly and support future PDF/export work. |
| Testing checklist | View reports with empty data; with players; with sessions; with boards; check responsive layout. |

## Supabase Migration Planning

| Field | Detail |
| --- | --- |
| Module | Backend Planning |
| Priority | Future |
| Status | Future |
| Scope | Plan database tables, auth model, cloud storage, and localStorage migration path. |
| Do not do | Do not implement backend now; do not add API keys; do not remove localStorage compatibility. |
| Acceptance criteria | Written migration plan protects existing local users and defines stable data shapes. |
| Testing checklist | Documentation review only until implementation is explicitly requested. |

## AI Assistant Planning

| Field | Detail |
| --- | --- |
| Module | AI Planning |
| Priority | Future |
| Status | Future |
| Scope | Plan safe AI assistant use cases based on real coach data, after backend exists. |
| Do not do | Do not connect AI now; do not put API keys in frontend; do not auto-overwrite user data. |
| Acceptance criteria | AI plan defines read-only suggestions first and requires secure server-side API routes. |
| Testing checklist | Documentation review only until backend/API stage begins. |
