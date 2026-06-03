# Development Tasks

This backlog is documentation-only guidance. It does not change app behavior.

## Functional Improvements

| Priority | Task | Module | Outcome |
| --- | --- | --- | --- |
| High | Add local data export/import | Global | Coaches can back up and restore localStorage data before cloud sync exists. |
| High | Strengthen Player Profile development timeline | Players | Notes, focus, ratings, and future feedback become easier to review. |
| High | Improve Session Planner delivered-session reflection | Session Planner | Coaches can record what happened and create follow-up priorities. |
| High | Improve Tactical Board object workflow | Tactical Board | Faster object placement, editing, selection, and board setup. |
| Medium | Build Match Centre foundation | Match Centre | Fixtures, opponent, match notes, lineup, and reflection have a real module. |
| Medium | Add basic Reports foundation | Reports | Coaches can summarize players, sessions, boards, and future match reflections. |
| Medium | Add Calendar foundation | Calendar | Sessions and matches can be viewed by date. |

## UI / UX Improvements

| Priority | Task | Module | Outcome |
| --- | --- | --- | --- |
| High | Clarify Dashboard real vs preview data | Dashboard | Coach can tell what is actionable now and what is future-facing. |
| High | Make Dashboard next-action area stronger | Dashboard | More useful daily/weekly coaching decisions. |
| High | Refine Players dense layout responsiveness | Players | Better large-screen and smaller-screen usability. |
| Medium | Improve Tactical Board toolbar density | Tactical Board | Drawing tools are easier to scan and use. |
| Medium | Improve Session Studio empty states | Session Planner | Coaches get clearer next actions when no sessions exist. |
| Medium | Standardize disabled future actions | Global | Future actions feel intentional, not broken. |

## Code Refactoring Candidates

Do not refactor broadly unless tied to a specific product task.

| Priority | Task | Area | Outcome |
| --- | --- | --- | --- |
| Medium | Extract shared storage collection hook | Data | Reduce repeated localStorage state patterns. |
| Medium | Document stable data shapes before cloud planning | Data | Safer future database migration. |
| Medium | Consolidate shared button/card styles | UI | More consistent design system after current CSS layers stabilize. |
| Low | Consider route library only when deep linking is needed | App shell | Avoid adding routing complexity too early. |
| Low | Add lightweight test coverage around storage helpers | Testing | Safer localStorage compatibility. |

## Documentation Tasks

| Priority | Task | Document | Outcome |
| --- | --- | --- | --- |
| High | Keep storage keys current | `docs/DATA_AND_STORAGE.md` | Prevent accidental localStorage data breaks. |
| High | Update module status after every major feature | `docs/MODULE_GUIDE.md` | Future work starts from accurate module facts. |
| Medium | Add screenshots or visual references | `docs/UI_DESIGN_GUIDE.md` | Easier design review. |
| Medium | Add data backup instructions once implemented | `README.md` / `docs/DATA_AND_STORAGE.md` | Coaches know how to protect local data. |
| Medium | Keep `DEVELOPMENT_LOG.md` current | `DEVELOPMENT_LOG.md` | Future sessions understand what changed and why. |

## Safety Rules For Future Tasks

- Do not modify localStorage keys without migration.
- Do not clear or overwrite saved records.
- Keep new fields optional and backward compatible.
- Preserve team crests, coach photos, player avatars, diagrams, saved boards, and session drafts.
- Do not add backend, AI, login, or cloud sync until the project stage changes.
- For documentation-only tasks, do not include source code changes.

## Suggested Next Work Order

1. Add local data export/import documentation and then implementation.
2. Refine Dashboard to separate real current state from future previews.
3. Deepen Players Development Plans into a working section.
4. Add session reflection and follow-up-session workflow.
5. Improve Tactical Board presets and tool ergonomics.
6. Build Match Centre foundation.
7. Add Reports and Calendar only after Match Centre has useful data.
