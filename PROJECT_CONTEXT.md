# Project Context: Coach Command Centre / 教练罗盘

Coach Command Centre, working name 教练罗盘, is a coach-first football coaching workspace. It helps youth, grassroots, amateur, school, and community football coaches design training, manage player development, build tactical ideas, reflect on matches, and gradually shape their own coaching system.

This document exists so future Codex sessions can understand the product before making changes.

## Product Vision

Coach Command Centre should feel like a personal headquarters for a developing football coach.

The product should help a coach feel that:

- I am operating like a real head coach.
- My team has identity, goals, and direction.
- My players are developing over time.
- My training sessions have logic, feedback, and reflection.
- Every time I open the app, I am moving the team forward, not just filling forms.

The emotional target is achievement, identity, control, growth, and immersion. The product can borrow the feeling of a football manager mode plus professional coaching tools, but it must stay practical and realistic.

## Product Positioning

Coach Command Centre is not a generic grassroots administration app. It is not intended to copy products focused on club admin, parent communication, payments, or fixtures operations.

It is not:

- a normal team administration system
- a parent chat app
- a team fee collection tool
- a club back-office platform
- a referee, fixture, or payment management tool
- a direct copy of grassroots admin apps such as Centre Circle

It is intended to become:

- Coach HQ
- Player Development Hub
- Session Design Studio
- Tactical Board
- Match Reflection Centre
- Coach Notes / Feedback Loop
- future AI Assistant for coaches

## Target Users

Primary users are:

- youth football coaches
- grassroots football coaches
- amateur football coaches
- young developing coaches
- school football coaches
- community football coaches

These users are not only trying to manage information. They want to feel that they are building a team, developing players, preparing training, reviewing matches, and improving their own coaching ability.

## Current Technical State

Current stage: frontend localStorage MVP.

Technology:

- React
- Vite
- CSS
- localStorage
- GitHub repository
- Vercel deployment

Currently not present:

- backend
- database
- login
- cloud sync
- AI/API calls
- payments
- chat

## Current Product State

The project already has a running local-storage MVP.

Current modules:

1. Dashboard / Home
2. Club Setup / Team Identity
3. Players
4. Session Planner
5. Tactical Board
6. Match Centre placeholder
7. Calendar placeholder
8. Reports placeholder

Current capabilities:

- dynamic team identity
- crest upload
- home, away, and UI theme colours
- UI changes based on club colours
- players stored in localStorage
- sessions stored in localStorage
- tactical boards stored in localStorage
- session activities can embed diagrams
- tactical boards can be drawn and saved
- draft protection for unsaved work
- deployed on Vercel
- iterated through multiple pull requests

## Core Product Principles

- Coach-first, not admin-first.
- Productive and emotional, not just functional.
- Full-width workspace, not cramped forms.
- Show the most important information first.
- Details should open through clicks, modals, drawers, tabs, or dedicated pages.
- Avoid giant default forms.
- Avoid endless page scrolling.
- If there is a lot of data, scroll inside lists or panels rather than making the whole page feel infinite.

Core UX pattern:

- Home shows the whole system.
- Lists show objects.
- Clicks show detail.
- Modals or drawers perform actions.
- Workspaces support design work.
- Preview pages create usable output.

## UI / UX Direction

The interface should feel like a premium football coaching workspace, not a spreadsheet or boring admin panel.

Keywords:

- premium
- modern
- Apple-inspired
- football-specific
- coach-focused
- clean
- emotional
- practical
- full-width workspace
- low unnecessary scrolling
- dynamic club identity
- dark left sidebar
- clean white cards
- rounded corners
- subtle shadows
- strong hierarchy

Avoid:

- spreadsheet-like layouts
- huge default forms
- generic admin panels
- unnecessary scrolling
- UI that feels like data entry instead of coaching work

## Module Direction

### Dashboard / Coach HQ

Dashboard should be a coach headquarters, not a basic landing page.

It should eventually show:

- team identity
- current season
- player count
- this week's training
- next match
- recent player development
- recent tactical boards
- quick actions
- coach goals
- team goals

It should help the coach understand what to do today or this week, what state the team is in, which players need attention, and what training or match is next.

### Club Setup / Team Identity

Club Setup is where the coach builds team identity.

It should include:

- team name
- club name
- age group
- season
- coach name
- coach role
- home kit colour
- away kit colour
- UI primary and secondary colours
- crest upload
- team goals
- coach goals
- team motto / identity
- playing style or development direction

Team colours should influence the whole UI so the coach feels this is their own team headquarters.

### Players / Player Development Hub

Players is one of the core modules. It should be a Squad Hub plus Player Profile system, not just a player table or large form.

Correct information architecture:

- Players page = squad-level overview and management
- Player Profile modal/page = individual player detail
- Add, edit, and note actions = modal or drawer actions

Players home should show:

- squad overview
- full squad cards/list
- search and filters
- players needing review
- recent notes
- quick actions
- development focus overview

Player Profile should show:

- avatar
- shirt number
- name
- position
- age
- preferred foot
- status
- current development focus
- ability overview
- strengths
- areas to improve
- coach notes
- notes timeline
- future training feedback
- future match feedback
- future stats
- future development trends

Long-term Players features:

- Player Profile Modal
- player avatar upload
- coach notes timeline
- training feedback
- match feedback
- player stats
- development focus
- development trends
- player milestones
- coach suggestions
- future AI player summary

### Session Planner / Session Design Studio

Session Planner is one of the strongest differentiators. It should become a Session Design Studio, not a large form.

Long-term architecture:

1. Session Planner Dashboard: training library, drafts, this week's sessions, focus areas, recently delivered sessions.
2. Create Session Wizard: guided modal or wizard, not a giant form.
3. Session Workspace: left timeline, centre activity editor, right diagram/coaching tools.
4. Session Preview / PDF: formal plan output for the coach.

Session Dashboard should eventually show:

- This Week
- Next Session
- Saved Sessions / Session Library
- Drafts
- Quick Create
- Create from Scratch
- Build from Squad Needs
- Duplicate Previous Session
- Focus Areas
- Session Quality Checklist
- Recently Delivered
- Add Reflection
- Create Follow-up Session

Create Session Wizard steps:

1. Choose creation type: start from scratch, build from squad needs, duplicate previous session.
2. Session basics: title, date, age group, duration, player count, pitch size, ability level, equipment.
3. Training focus: game moment, topic, session type, coaching style, tags.
4. Session structure: simple 3-part, standard 5-part, match prep, technical, low numbers.
5. Activities: arrival activity, warm-up, main practice, opposed practice, small-sided game, reflection/cool-down.
6. Review and create: create skeleton and open workspace.

Session Workspace should edit one activity at a time, show a session timeline, and keep diagrams, coaching points, questions, and checklist close to the activity.

Future features:

- session templates
- squad needs builder
- match-to-session link
- player groups
- coaching questions bank
- progression/regression suggestions
- session quality checklist
- session reflection
- PDF export
- future AI session draft

### Tactical Board

Tactical Board is the visual coaching and training explanation tool.

Current capabilities include basic drawing, saving boards, and embedding diagrams in session activities.

Long-term direction:

- better UI
- presentation mode
- more pitch layouts
- half pitch, full pitch, third pitch
- better mini goals
- improved drawing controls
- resize, rotate, drag
- copy session diagram to tactical board
- export image or PDF

### Match Centre

Match Centre is currently a placeholder. It should become a preparation and reflection centre.

Future scope:

- fixtures
- opponent
- venue
- formation
- lineup
- bench
- minutes
- goals and assists
- player ratings
- player match feedback
- team performance notes
- match reflection
- next training focus
- create follow-up session from match problems

The core purpose is to turn match performance into next week's training content.

### Calendar and Reports

Calendar and Reports are currently placeholders. They should stay light until the core coaching loop is stronger.

They should support the coach workflow rather than becoming heavy admin modules.

## Future AI Vision

AI is a long-term core direction, but it must not be implemented in the current frontend-only stage.

AI should not be a generic prompt generator. It should read real coach data and make useful suggestions based on:

- team identity
- squad/player data
- player notes
- development focus
- sessions
- match feedback
- coach goals
- team style
- previous reflections

Future AI scenarios:

1. AI Session Draft: generate a session draft from squad needs, player development priorities, and match problems.
2. AI Session Improvement: improve an existing session so it is more game realistic, age appropriate, simpler, or harder.
3. AI Player Development Summary: summarise recent development from notes and feedback.
4. AI Match Review to Training Focus: convert match reflection into next-week training priorities.
5. AI Coach Suggestions: suggest questions, progressions, regressions, and feedback language.

Important: future AI requires backend/API infrastructure. Do not place API keys in the frontend.

## What Not To Build Now

Do not add these in the current stage:

- login
- cloud database
- backend
- AI / OpenAI API / Claude API / Gemini API
- API calls
- payment
- team chat
- parent/player accounts
- complex permissions
- medical sensitive records
- full commercial SaaS architecture

Long-term possible, but not now:

- Supabase or Firebase backend
- authentication
- multi-device sync
- cloud image storage
- AI session generation
- AI player summaries
- AI match review
- paid plans
- multi-user permissions
- player/parent app
