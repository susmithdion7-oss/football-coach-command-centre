# Iteration Plan

This plan organizes future work into clear phases. It keeps the product focused on the coach-first local MVP before backend, cloud sync, or AI.

## Phase 1: Stabilise And Unify Design

| Field | Detail |
| --- | --- |
| Goals | Make the app feel like one unified Coach HQ product; clarify design system; protect localStorage data; improve documentation and QA workflow. |
| Tasks | Maintain docs; use `DESIGN_SYSTEM.md`; review Dashboard, Players, Session Planner, Tactical Board for theme consistency; plan Dashboard Coach Mission Control v1; standardize disabled future actions. |
| Success criteria | All future work starts from docs; no old-directory mistakes; modules inherit club colours; no source changes break saved data. |
| Risks | Over-polishing without improving coaching workflow; accidentally redesigning unrelated modules. |

## Phase 2: Core Coaching Workflow

| Field | Detail |
| --- | --- |
| Goals | Strengthen the daily coach workflow across Dashboard, Players, Sessions, and Tactical Board. |
| Tasks | Dashboard Coach Mission Control v1; Players UI Polish v2; Session Planner Dashboard Redesign; Create Session Wizard; Session Workspace Redesign; Tactical Board UI Polish. |
| Success criteria | Coach can see priorities, manage players, plan a session, create diagrams, and save work with a clear workflow. |
| Risks | Breaking draft autosave; confusing real data with preview data; making pages too heavy. |

## Phase 3: Output And Reporting

| Field | Detail |
| --- | --- |
| Goals | Help coaches produce usable outputs and protect local data. |
| Tasks | Data Export / Import Backup; PDF Export; Reports Foundation; export-ready session preview; backup instructions. |
| Success criteria | Coach can back up data and create useful session/report output. |
| Risks | Export complexity; browser compatibility; large data URLs increasing backup size. |

## Phase 4: Match And Feedback Loop

| Field | Detail |
| --- | --- |
| Goals | Connect match problems, player feedback, and future training focus. |
| Tasks | Match Centre Foundation; Player Feedback System; Match Feedback System; Session Review; Player Development Trends. |
| Success criteria | Coach can record feedback and turn it into next-session priorities. |
| Risks | Drifting into full club admin; adding too many stats before feedback workflow is clear. |

## Phase 5: Cloud Backend

| Field | Detail |
| --- | --- |
| Goals | Move from browser-only storage to safer multi-device persistence after local product loop is stable. |
| Tasks | Supabase/Firebase migration planning; auth model; database schema; cloud image storage; import/export migration; local user protection plan. |
| Success criteria | Cloud plan protects current localStorage users and defines stable data ownership. |
| Risks | Starting backend too early; losing local data; creating unnecessary SaaS complexity. |

## Phase 6: AI Assistant

| Field | Detail |
| --- | --- |
| Goals | Add secure, coach-assistive AI only after backend/API infrastructure exists. |
| Tasks | AI Assistant Planning; server-side API routes; read-only suggestions; editable session drafts; player summaries; match review to training focus. |
| Success criteria | AI uses real coaching context and never auto-overwrites user data. |
| Risks | Frontend API key exposure; generic prompt generator behavior; replacing coach judgment instead of supporting it. |

## Recommended Immediate Next Step

Start with **Dashboard Coach Mission Control v1** in Plan Mode. It is the best next step because it makes the existing working modules feel connected without adding backend, AI, or new data infrastructure.

## Phase Review Checklist

At the end of each phase:

- Update `DEVELOPMENT_LOG.md`.
- Update affected `docs/` files.
- Confirm no localStorage keys were renamed.
- Confirm existing saved data still loads.
- Confirm disabled future modules remain clearly labelled.
- Review Vercel preview for UI changes.
