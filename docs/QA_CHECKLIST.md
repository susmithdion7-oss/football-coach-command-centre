# QA Checklist

Use this checklist before merging or finishing meaningful product changes. For documentation-only tasks, use the documentation section at the bottom.

## Onboarding Testing

- Start with no saved `teamIdentity`.
- Confirm onboarding entry page appears.
- Complete coach profile step.
- Complete team identity step.
- Upload or skip team crest.
- Import squad via pasted list.
- Import squad via CSV if the task touches import.
- Start with empty squad.
- Complete season setup.
- Complete coaching direction.
- Launch Coach HQ.
- Refresh and confirm onboarding does not restart unexpectedly.

## Team Identity Testing

- Open Club Setup / Settings.
- Change team name.
- Change club name.
- Change season.
- Change coach name/role.
- Change home and away colours.
- Upload crest.
- Remove crest.
- Save changes.
- Refresh and confirm identity persists.

## Theme Colour Testing

Test at least these colour styles when UI is changed:

- sky blue
- red
- orange
- green
- navy/dark
- white/light

Check:

- sidebar readability
- active nav state
- primary buttons
- selected tabs
- Players OS dark workspace
- Tactical Board dark workspace
- Dashboard accents
- Onboarding preview

## Players Testing

- Load Players with no players.
- Add a player.
- Edit player details.
- Delete player after confirmation.
- Upload player avatar.
- Remove/change avatar if touched.
- Search players.
- Filter by position/status.
- Open player profile.
- Add a note.
- Save development focus.
- Use Player Centre action menu.
- Use Squad Management tabs.
- Assign starting XI slot.
- Add bench player.
- Save tactic preset/settings.
- Set matchday assignments.
- Refresh and confirm players, lineup, tactics, and assignments persist.

## Session Planner Testing

- Load Session Planner with no sessions.
- Create a session from scratch.
- Create from squad needs if touched.
- Duplicate a session.
- Edit basics.
- Edit training focus.
- Edit activity details.
- Add or edit activity diagram.
- Save session.
- Update existing session.
- Delete session.
- Confirm draft autosave message/behavior.
- Refresh with unsaved changes and confirm draft recovery.
- Copy diagram to Tactical Board.
- Confirm copied board appears in Tactical Board.

## Tactical Board Testing

- Load Tactical Board with no boards.
- Create a new board.
- Save board.
- Select saved board.
- Add home player.
- Add away player.
- Add neutral player.
- Add ball.
- Add cone.
- Add mini goal.
- Add arrow.
- Add line.
- Add area/zone.
- Drag objects.
- Resize supported objects.
- Rotate mini goal.
- Edit line handles or line settings.
- Duplicate selected object.
- Delete selected object.
- Duplicate board.
- Clear board.
- Delete board.
- Enter and exit presentation mode.
- Refresh and confirm saved boards persist.

## localStorage Persistence

Confirm these keys still work after any data-related change:

- `footballCoachCommandCentre:players`
- `footballCoachCommandCentre:footballCoachSessions`
- `footballCoachCommandCentre:tacticalBoards`
- `footballCoachCommandCentre:teamIdentity`
- `footballCoachCommandCentre:sessionDraft`
- `footballCoachCommandCentre:squadLineup`
- `footballCoachCommandCentre:tacticalSetup`
- `footballCoachCommandCentre:playerAssignments`
- `footballCoachCommandCentre:coachCommandCentre:onboardingComplete`

Do not clear localStorage during normal QA unless specifically testing first-run onboarding in an isolated browser/incognito profile.

## Draft Protection

- Create unsaved session changes.
- Navigate within Session Planner.
- Try opening another session.
- Confirm warning/confirmation appears where expected.
- Refresh and confirm draft restores.
- Save draft as session.
- Discard draft and confirm saved session returns.

## Responsive Layout

Check at least:

- desktop 1920x1080
- laptop width around 1366px
- tablet-ish width around 900px
- mobile width around 390px

Focus modules:

- Dashboard
- Onboarding
- Players
- Session Planner
- Tactical Board

Check:

- no major overlap
- no unwanted horizontal scroll
- buttons remain usable
- dense panels scroll predictably
- text remains readable

## No Data Wipe Checklist

Before finishing any task:

- Did any localStorage key change? If yes, document migration.
- Did any saved record shape change? If yes, keep backwards compatibility.
- Did any default state overwrite saved data? It must not.
- Did images/data URLs remain intact?
- Did session drafts remain intact?
- Did lineup/tactic/assignment state remain intact?

## Vercel Preview Testing

When a PR or preview exists:

- Open the Vercel preview.
- Test first-run onboarding in a clean browser/incognito profile.
- Test existing-user behavior with saved localStorage if possible.
- Test affected modules.
- Test theme colours.
- Check console for obvious errors.
- Confirm no API/backend errors were introduced.

## Documentation-Only QA

For documentation-only tasks:

- Confirm requested Markdown files exist.
- Confirm README links point to real files.
- Confirm no `src/` files changed.
- Confirm no `package.json` or `vite.config.js` changes occurred.
- Confirm no localStorage logic changed.
- Confirm DEVELOPMENT_LOG has an entry.
- No app build is required unless specifically requested.
