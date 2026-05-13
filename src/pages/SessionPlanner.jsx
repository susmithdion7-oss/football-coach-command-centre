import { useEffect, useMemo, useRef, useState } from 'react'
import DiagramEditor from '../components/DiagramEditor.jsx'
import DiagramPreview, { createEmptyDiagram, normaliseDiagram } from '../components/DiagramPreview.jsx'
import { getStorageItem, removeStorageItem, setStorageItem } from '../utils/storage.js'

const gameMoments = [
  'In possession',
  'Out of possession',
  'Transition to attack',
  'Transition to defend',
  'Set pieces',
  'Goalkeeping',
  'Physical',
  'Psychological / social',
]

const primaryTopics = [
  'Possession',
  'Passing and receiving',
  'Creating space',
  'Dribbling and 1v1 attacking',
  'Defending',
  'Pressing',
  'Finishing',
  'Crossing',
  'Counter-attacking',
  'Set pieces',
  'Goalkeeping',
  'Match preparation',
]

const topicTags = [
  'Retaining possession',
  'Playing out from the back',
  'Build-up play',
  'Progressing through thirds',
  'Breaking lines',
  'Support angles',
  'Scanning before receiving',
  'Receiving on the half-turn',
  'Width and depth',
  'Movement off the ball',
  'Combination play',
  'Overlaps',
  'Underlaps',
  'Switching play',
  '1v1 attacking',
  'Ball mastery',
  'Running with the ball',
  'Individual defending',
  '1v1 defending',
  'Pressing triggers',
  'Defensive compactness',
  'Cover and balance',
  'Recovery runs',
  'Counter-attacking',
  'Counter-pressing',
  'Finishing under pressure',
  'Crossing and finishing',
  'Defending crosses',
  'Attacking corners',
  'Defending corners',
  'Free kicks',
  'Throw-ins',
  'Communication',
  'Decision-making',
  'Confidence',
  'Teamwork',
]

const sessionTypes = [
  'Technical practice',
  'Skill practice',
  'Rondo',
  'Possession game',
  'Small-sided game',
  'Conditioned game',
  'Phase of play',
  'Pattern practice',
  'Set-piece practice',
  'Match preparation',
]

const coachingStyles = [
  'Democratic coaching',
  'Guided discovery',
  'Question-based coaching',
  'Game-based learning',
  'Command style',
  'Technical repetition',
  'High-intensity coaching',
]

const equipmentOptions = [
  'Balls',
  'Cones',
  'Bibs',
  'Mini goals',
  'Full-size goals',
  'Flat markers',
  'Poles',
  'Ladders',
]

const activityTemplates = [
  'Arrival activity / warm-up',
  'Main practice',
  'Opposed practice or skill practice',
  'Small-sided game',
  'Reflection / cool-down',
]

const creationRoutes = [
  {
    id: 'squad',
    title: 'Build from Squad Needs',
    label: 'Recommended',
    icon: 'PL',
    description: 'Start with the squad context, current development focus and recent coaching priorities.',
  },
  {
    id: 'scratch',
    title: 'Start from Scratch',
    icon: 'DR',
    description: 'Open a clean session workspace and design every activity by hand.',
  },
  {
    id: 'duplicate',
    title: 'Duplicate Previous Session',
    icon: 'CP',
    description: 'Use an existing plan as the base, then adapt it for the next training objective.',
  },
]

const sessionStructureOptions = [
  'Arrival',
  'Warm-up',
  'Main practice',
  'Opposed practice',
  'Game',
  'Reflection',
]

const sessionDraftKey = 'sessionDraft'

function createEmptyActivity(name) {
  return {
    name,
    duration: '',
    setup: '',
    rules: '',
    coachingPoints: '',
    playerQuestions: '',
    progression: '',
    regression: '',
    coachNotes: '',
    diagramNotes: '',
    diagram: createEmptyDiagram(`${name} diagram`),
  }
}

const emptySession = {
  sessionTitle: '',
  date: '',
  ageGroup: '',
  duration: '60 minutes',
  numberOfPlayers: '',
  abilityLevel: 'Mixed',
  pitchSize: '',
  equipmentAvailable: [],
  status: 'Draft',
  mainGameMoment: 'In possession',
  primaryTopic: 'Possession',
  topicTags: [],
  sessionType: 'Technical practice',
  coachingStyle: 'Guided discovery',
  activities: activityTemplates.map(createEmptyActivity),
}

const emptySessionSnapshot = JSON.stringify(emptySession)

function getSessionForForm(session = {}) {
  return {
    ...emptySession,
    ...session,
    equipmentAvailable: session.equipmentAvailable || [],
    topicTags: session.topicTags || [],
    activities: activityTemplates.map((activityName, index) => {
      const savedActivity = session.activities?.[index] || {}
      const activityTitle = savedActivity.name || activityName

      return {
        ...createEmptyActivity(activityName),
        ...savedActivity,
        name: activityTitle,
        diagram: normaliseDiagram(savedActivity.diagram, `${activityTitle} diagram`),
      }
    }),
  }
}

function getSessionSnapshot(session) {
  return JSON.stringify(getSessionForForm(session))
}

function getDraftInitialState(sessions) {
  const draft = getStorageItem(sessionDraftKey, null)

  if (draft?.formData) {
    const restoredFormData = getSessionForForm(draft.formData)
    const restoredSnapshot = getSessionSnapshot(restoredFormData)
    const savedSnapshot = draft.savedSnapshot || emptySessionSnapshot

    if (restoredSnapshot !== emptySessionSnapshot || draft.selectedSessionId) {
      return {
        formData: restoredFormData,
        restored: true,
        savedSnapshot,
        selectedSessionId: draft.selectedSessionId ?? null,
      }
    }
  }

  return {
    formData: emptySession,
    restored: false,
    savedSnapshot: emptySessionSnapshot,
    selectedSessionId: sessions[0]?.id ?? null,
  }
}

function parseSessionDate(session) {
  if (!session.date) {
    return null
  }

  const date = new Date(`${session.date}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function getTodayDate() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function sortSessionsByDate(sessions) {
  return [...sessions].sort((firstSession, secondSession) => {
    const firstDate = parseSessionDate(firstSession)
    const secondDate = parseSessionDate(secondSession)

    if (firstDate && secondDate) {
      const dateDifference = firstDate - secondDate

      if (dateDifference !== 0) {
        return dateDifference
      }
    }

    if (firstDate && !secondDate) {
      return -1
    }

    if (!firstDate && secondDate) {
      return 1
    }

    const firstCreatedAt = new Date(firstSession.createdAt || 0).getTime()
    const secondCreatedAt = new Date(secondSession.createdAt || 0).getTime()

    if (firstCreatedAt !== secondCreatedAt) {
      return firstCreatedAt - secondCreatedAt
    }

    return (firstSession.sessionTitle || '').localeCompare(secondSession.sessionTitle || '')
  })
}

function formatSessionDate(session) {
  const date = parseSessionDate(session)

  if (!date) {
    return 'No date set'
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getSessionMinutes(session) {
  const durationMatch = String(session.duration || '').match(/\d+/)
  return durationMatch ? Number(durationMatch[0]) : 0
}

function getFocusAreasFromSessions(sessions) {
  const focusCounts = sessions.reduce((focusMap, session) => {
    const focus = session.primaryTopic || session.mainGameMoment

    if (!focus) {
      return focusMap
    }

    focusMap[focus] = (focusMap[focus] || 0) + 1
    return focusMap
  }, {})

  return Object.entries(focusCounts)
    .map(([label, count]) => ({ label, count }))
    .sort((firstFocus, secondFocus) => secondFocus.count - firstFocus.count)
    .slice(0, 4)
}

function getPlayerFocusAreas(players) {
  const focusCounts = players.reduce((focusMap, player) => {
    if (!player.developmentFocus) {
      return focusMap
    }

    focusMap[player.developmentFocus] = (focusMap[player.developmentFocus] || 0) + 1
    return focusMap
  }, {})

  return Object.entries(focusCounts)
    .map(([label, count]) => ({ label, count }))
    .sort((firstFocus, secondFocus) => secondFocus.count - firstFocus.count)
    .slice(0, 3)
}

function getSessionQualityItems(session) {
  return [
    { label: 'Clear objective', complete: Boolean(session.primaryTopic && session.mainGameMoment) },
    { label: 'Realistic organisation', complete: session.activities.some((activity) => activity.setup || activity.rules) },
    { label: 'Coaching points', complete: session.activities.some((activity) => activity.coachingPoints) },
    { label: 'Coach questions', complete: session.activities.some((activity) => activity.playerQuestions) },
    { label: 'Progression / regression', complete: session.activities.some((activity) => activity.progression || activity.regression) },
    { label: 'Diagram ready', complete: session.activities.some((activity) => normaliseDiagram(activity.diagram).objects.length > 0) },
  ]
}

function getSessionStarter(route, players) {
  const playerFocusAreas = getPlayerFocusAreas(players)
  const topPlayerFocus = playerFocusAreas[0]?.label

  if (route === 'squad' && topPlayerFocus) {
    return getSessionForForm({
      ...emptySession,
      primaryTopic: primaryTopics.includes(topPlayerFocus) ? topPlayerFocus : emptySession.primaryTopic,
      topicTags: topicTags.includes(topPlayerFocus) ? [topPlayerFocus] : [],
    })
  }

  return getSessionForForm(emptySession)
}

function SessionPlanner({
  onAddSession,
  onCopyDiagramToBoard,
  onDeleteSession,
  onDuplicateSession,
  onUpdateSession,
  players = [],
  sessions,
  teamIdentity,
}) {
  const [initialDraftState] = useState(() => getDraftInitialState(sessions))
  const [selectedSessionId, setSelectedSessionId] = useState(initialDraftState.selectedSessionId)
  const [formData, setFormData] = useState(initialDraftState.formData)
  const [message, setMessage] = useState(initialDraftState.restored ? 'Draft restored.' : '')
  const [draftStatus, setDraftStatus] = useState(initialDraftState.restored ? 'Unsaved changes' : '')
  const [viewMode, setViewMode] = useState(initialDraftState.restored ? 'workspace' : 'dashboard')
  const [workspaceTab, setWorkspaceTab] = useState('basics')
  const [activeActivityIndex, setActiveActivityIndex] = useState(0)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCreationRoute, setSelectedCreationRoute] = useState('squad')
  const [assistantDraft, setAssistantDraft] = useState('')
  const savedSnapshotRef = useRef(initialDraftState.savedSnapshot)
  const sortedSessions = useMemo(() => sortSessionsByDate(sessions), [sessions])
  const currentSnapshot = getSessionSnapshot(formData)
  const hasUnsavedChanges =
    currentSnapshot !== savedSnapshotRef.current &&
    (currentSnapshot !== emptySessionSnapshot || Boolean(selectedSessionId))

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId),
    [sessions, selectedSessionId],
  )

  const today = getTodayDate()
  const upcomingSessions = sortedSessions
    .filter((session) => {
      const date = parseSessionDate(session)
      return date && date >= today
    })
    .slice(0, 4)
  const recentSessions = [...sessions]
    .sort((firstSession, secondSession) => new Date(secondSession.updatedAt || secondSession.createdAt || 0) - new Date(firstSession.updatedAt || firstSession.createdAt || 0))
    .slice(0, 4)
  const draftSessions = sessions.filter((session) => (session.status || 'Draft') === 'Draft')
  const usedSessions = sessions.filter((session) => session.status === 'Used')
  const focusAreas = getFocusAreasFromSessions(sessions)
  const playerFocusAreas = getPlayerFocusAreas(players)
  const totalMinutes = sessions.reduce((total, session) => total + getSessionMinutes(session), 0)
  const nextSession = upcomingSessions[0]
  const qualityItems = getSessionQualityItems(formData)
  const completedQualityItems = qualityItems.filter((item) => item.complete).length

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return
    }

    setStorageItem(sessionDraftKey, {
      formData,
      lastDraftSavedAt: new Date().toISOString(),
      savedSnapshot: savedSnapshotRef.current,
      selectedSessionId,
    })
    setDraftStatus('Draft saved automatically')
  }, [formData, hasUnsavedChanges, selectedSessionId])

  useEffect(() => {
    if (activeActivityIndex > formData.activities.length - 1) {
      setActiveActivityIndex(0)
    }
  }, [activeActivityIndex, formData.activities.length])

  function confirmDiscardUnsaved(messageText) {
    return !hasUnsavedChanges || window.confirm(messageText)
  }

  function setCleanForm(nextFormData, nextSelectedSessionId, nextMessage) {
    const normalisedForm = getSessionForForm(nextFormData)
    savedSnapshotRef.current = getSessionSnapshot(normalisedForm)
    setSelectedSessionId(nextSelectedSessionId)
    setFormData(normalisedForm)
    setDraftStatus('')
    setMessage(nextMessage)
  }

  function clearSessionDraft() {
    removeStorageItem(sessionDraftKey)
    setDraftStatus('')
  }

  function startNewSession(route = 'scratch') {
    if (!confirmDiscardUnsaved('You have unsaved changes. Do you want to discard them and start a new session?')) {
      return false
    }

    clearSessionDraft()
    setCleanForm(
      getSessionStarter(route, players),
      null,
      route === 'squad' ? 'Squad-needs session workspace ready.' : 'New session workspace ready.',
    )
    setActiveActivityIndex(0)
    setWorkspaceTab('basics')
    setViewMode('workspace')
    setIsCreateModalOpen(false)
    return true
  }

  function discardDraft() {
    const shouldDiscard = window.confirm('Discard the current unsaved session draft?')

    if (!shouldDiscard) {
      return
    }

    clearSessionDraft()

    if (selectedSession) {
      setCleanForm(selectedSession, selectedSession.id, 'Draft discarded. Saved session restored.')
      return
    }

    setCleanForm(emptySession, null, 'Draft discarded. New session workspace ready.')
  }

  function selectSession(sessionId, shouldOpenWorkspace = false) {
    const session = sessions.find((savedSession) => savedSession.id === sessionId)

    if (!session || !confirmDiscardUnsaved('You have unsaved changes. Do you want to discard them and open another session?')) {
      return false
    }

    clearSessionDraft()
    setCleanForm(session, sessionId, '')

    if (shouldOpenWorkspace) {
      setActiveActivityIndex(0)
      setWorkspaceTab('activity')
      setViewMode('workspace')
    }

    return true
  }

  function handleCreateRoute() {
    if (selectedCreationRoute === 'duplicate') {
      handleDuplicate(true)
      return
    }

    startNewSession(selectedCreationRoute)
  }

  function handleFieldChange(event) {
    const { name, value } = event.target
    setMessage('')
    setDraftStatus('Unsaved changes')
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function toggleListValue(fieldName, value) {
    setMessage('')
    setDraftStatus('Unsaved changes')
    setFormData((currentData) => {
      const currentValues = currentData[fieldName]
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return { ...currentData, [fieldName]: nextValues }
    })
  }

  function updateActivity(index, fieldName, value) {
    setMessage('')
    setDraftStatus('Unsaved changes')
    setFormData((currentData) => ({
      ...currentData,
      activities: currentData.activities.map((activity, activityIndex) =>
        activityIndex === index ? { ...activity, [fieldName]: value } : activity,
      ),
    }))
  }

  function cleanSessionData() {
    return {
      ...formData,
      sessionTitle: formData.sessionTitle.trim(),
      date: formData.date,
      ageGroup: formData.ageGroup.trim(),
      duration: formData.duration.trim(),
      numberOfPlayers: formData.numberOfPlayers.trim(),
      pitchSize: formData.pitchSize.trim(),
      activities: formData.activities.map((activity) => ({
        ...activity,
        name: activity.name.trim(),
        duration: activity.duration.trim(),
        setup: activity.setup.trim(),
        rules: activity.rules.trim(),
        coachingPoints: activity.coachingPoints.trim(),
        playerQuestions: activity.playerQuestions.trim(),
        progression: activity.progression.trim(),
        regression: activity.regression.trim(),
        coachNotes: activity.coachNotes.trim(),
        diagramNotes: activity.diagramNotes.trim(),
        diagram: normaliseDiagram(activity.diagram, `${activity.name || 'Activity'} diagram`),
      })),
    }
  }

  function handleSave(event) {
    event.preventDefault()

    if (!formData.sessionTitle.trim() || !formData.date) {
      setMessage('Please add a session title and date before saving.')
      return
    }

    const sessionToSave = cleanSessionData()

    if (selectedSession) {
      onUpdateSession(selectedSession.id, sessionToSave)
      clearSessionDraft()
      setCleanForm(sessionToSave, selectedSession.id, 'Session updated and saved locally.')
      setDraftStatus('Saved')
      return
    }

    const newSessionId = onAddSession(sessionToSave)
    clearSessionDraft()
    setCleanForm(sessionToSave, newSessionId, 'Session created and saved locally.')
    setDraftStatus('Saved')
  }

  function handleDelete() {
    if (!selectedSession) {
      return
    }

    const shouldDelete = window.confirm(`Delete ${selectedSession.sessionTitle}?`)

    if (!shouldDelete) {
      return
    }

    clearSessionDraft()
    onDeleteSession(selectedSession.id)
    const nextSessionAfterDelete = sortedSessions.find((session) => session.id !== selectedSession.id)
    setCleanForm(
      nextSessionAfterDelete || emptySession,
      nextSessionAfterDelete?.id ?? null,
      nextSessionAfterDelete ? 'Session deleted.' : 'Session deleted. New session workspace ready.',
    )
  }

  function handleDuplicate(shouldOpenWorkspace = false) {
    if (!selectedSession || !confirmDiscardUnsaved('You have unsaved changes. Do you want to discard them and duplicate this session?')) {
      return
    }

    const duplicateId = onDuplicateSession(selectedSession.id)

    if (duplicateId) {
      const copiedSession = {
        ...selectedSession,
        id: duplicateId,
        sessionTitle: `${selectedSession.sessionTitle} copy`,
        status: 'Draft',
      }

      clearSessionDraft()
      setCleanForm(copiedSession, duplicateId, 'Session duplicated as a new draft.')
      setActiveActivityIndex(0)
      setWorkspaceTab('activity')
      setIsCreateModalOpen(false)

      if (shouldOpenWorkspace) {
        setViewMode('workspace')
      }
    }
  }

  return (
    <section className="session-page session-studio-page">
      {viewMode === 'dashboard' ? (
        <SessionStudioDashboard
          draftSessions={draftSessions}
          focusAreas={focusAreas}
          nextSession={nextSession}
          onCreateSession={() => setIsCreateModalOpen(true)}
          onOpenSession={(sessionId) => selectSession(sessionId, true)}
          playerFocusAreas={playerFocusAreas}
          players={players}
          recentSessions={recentSessions}
          sessions={sessions}
          teamIdentity={teamIdentity}
          totalMinutes={totalMinutes}
          upcomingSessions={upcomingSessions}
          usedSessions={usedSessions}
        />
      ) : (
        <form className="session-workspace-shell" onSubmit={handleSave}>
          <WorkspaceHeader
            completedQualityItems={completedQualityItems}
            formData={formData}
            hasUnsavedChanges={hasUnsavedChanges}
            onBack={() => setViewMode('dashboard')}
            onCreateSession={() => setIsCreateModalOpen(true)}
            onDelete={handleDelete}
            onDiscardDraft={discardDraft}
            onDuplicate={() => handleDuplicate(false)}
            selectedSession={selectedSession}
            totalQualityItems={qualityItems.length}
            message={message || draftStatus}
          />

          <div className="session-workspace-grid">
            <SessionTimeline
              activeActivityIndex={activeActivityIndex}
              activities={formData.activities}
              onAddActivity={() => setMessage('Custom activity adding will come after the workspace shell is stable.')}
              onSelectActivity={(index) => {
                setActiveActivityIndex(index)
                setWorkspaceTab('activity')
              }}
            />

            <main className="session-workbench-panel">
              <div className="workspace-tabs" aria-label="Session workspace sections">
                {['basics', 'focus', 'activity'].map((tab) => (
                  <button
                    className={workspaceTab === tab ? 'active' : ''}
                    key={tab}
                    type="button"
                    onClick={() => setWorkspaceTab(tab)}
                  >
                    {tab === 'basics' ? 'Session basics' : tab === 'focus' ? 'Training focus' : 'Activity editor'}
                  </button>
                ))}
              </div>

              {workspaceTab === 'basics' && (
                <SessionBasicsPanel
                  formData={formData}
                  onFieldChange={handleFieldChange}
                  onToggle={toggleListValue}
                />
              )}

              {workspaceTab === 'focus' && (
                <SessionFocusPanel
                  formData={formData}
                  onFieldChange={handleFieldChange}
                  onToggle={toggleListValue}
                />
              )}

              {workspaceTab === 'activity' && (
                <ActivitySection
                  activity={formData.activities[activeActivityIndex]}
                  index={activeActivityIndex}
                  onChange={updateActivity}
                  onCopyDiagramToBoard={onCopyDiagramToBoard}
                  sessionTitle={formData.sessionTitle}
                />
              )}
            </main>

            <aside className="session-coach-panel">
              <SessionQualityPanel qualityItems={qualityItems} />
              <AiAssistantShell
                assistantDraft={assistantDraft}
                formData={formData}
                onAssistantDraftChange={setAssistantDraft}
                playerFocusAreas={playerFocusAreas}
                teamIdentity={teamIdentity}
              />
            </aside>
          </div>
        </form>
      )}

      {isCreateModalOpen && (
        <CreateSessionModal
          canDuplicate={Boolean(selectedSession)}
          selectedRoute={selectedCreationRoute}
          onCancel={() => setIsCreateModalOpen(false)}
          onConfirm={handleCreateRoute}
          onSelectRoute={setSelectedCreationRoute}
          playerFocusAreas={playerFocusAreas}
          players={players}
          sessions={sessions}
        />
      )}
    </section>
  )
}

function SessionStudioDashboard({
  draftSessions,
  focusAreas,
  nextSession,
  onCreateSession,
  onOpenSession,
  playerFocusAreas,
  players,
  recentSessions,
  sessions,
  teamIdentity,
  totalMinutes,
  upcomingSessions,
  usedSessions,
}) {
  const dashboardStats = [
    { label: 'This Week', value: upcomingSessions.length, detail: 'planned sessions', icon: 'CA' },
    { label: 'Draft Sessions', value: draftSessions.length, detail: 'in progress', icon: 'DR' },
    { label: 'Saved Sessions', value: sessions.length, detail: 'local library', icon: 'LB' },
    { label: 'Delivered', value: usedSessions.length, detail: 'ready for review', icon: 'RV' },
    { label: 'Training Minutes', value: totalMinutes || '--', detail: 'planned total', icon: 'TM' },
  ]

  return (
    <div className="session-studio-dashboard">
      <section className="session-studio-hero">
        <div>
          <span>Session Design Studio</span>
          <h3>Design smarter sessions. Build clearer training weeks.</h3>
          <p>Plan from squad needs, create purposeful activities, review delivery, then turn feedback into the next session.</p>
        </div>
        <div className="studio-hero-card">
          <span>{teamIdentity?.seasonName || 'Current season'}</span>
          <strong>{teamIdentity?.teamName || 'Your team'}</strong>
          <p>{players.length} players in your current coaching context.</p>
          <button className="primary-button" type="button" onClick={onCreateSession}>Create Session</button>
        </div>
      </section>

      <section className="studio-stat-strip" aria-label="Session planner overview">
        {dashboardStats.map((stat) => (
          <article className="studio-stat-card" key={stat.label}>
            <span>{stat.icon}</span>
            <div>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
              <small>{stat.detail}</small>
            </div>
          </article>
        ))}
      </section>

      <div className="studio-dashboard-grid">
        <section className="studio-panel next-session-panel">
          <PanelHeading title="Next Session" action="View all" />
          {nextSession ? (
            <article className="next-session-card">
              <div>
                <span>{formatSessionDate(nextSession)}</span>
                <h4>{nextSession.sessionTitle || 'Untitled session'}</h4>
                <p>{nextSession.primaryTopic || nextSession.mainGameMoment || 'No focus set'}</p>
                <dl>
                  <div><dt>Age</dt><dd>{nextSession.ageGroup || '--'}</dd></div>
                  <div><dt>Players</dt><dd>{nextSession.numberOfPlayers || '--'}</dd></div>
                  <div><dt>Duration</dt><dd>{nextSession.duration || '--'}</dd></div>
                </dl>
              </div>
              <MiniSessionPitch />
              <button className="primary-button" type="button" onClick={() => onOpenSession(nextSession.id)}>Open Workspace</button>
            </article>
          ) : (
            <EmptyStudioState
              title="No upcoming session yet"
              copy="Create the next session from squad needs or start from a blank workspace."
              action="Create Session"
              onAction={onCreateSession}
            />
          )}
        </section>

        <section className="studio-panel">
          <PanelHeading title="Quick Start" />
          <div className="quick-start-grid">
            {creationRoutes.map((route) => (
              <button key={route.id} type="button" onClick={onCreateSession}>
                <span>{route.icon}</span>
                <strong>{route.title}</strong>
                <small>{route.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="studio-panel">
          <PanelHeading title="Upcoming Sessions" />
          <SessionListPreview sessions={upcomingSessions} emptyText="No dated sessions are planned yet." onOpenSession={onOpenSession} />
        </section>

        <section className="studio-panel">
          <PanelHeading title="Session Quality Checklist" />
          <div className="quality-preview-list">
            {['Clear objective', 'Game realism', 'Coaching points', 'Progression', 'Reflection link'].map((item) => (
              <div key={item}>
                <span>OK</span>
                <strong>{item}</strong>
                <small>Review before delivery</small>
              </div>
            ))}
          </div>
        </section>

        <section className="studio-panel">
          <PanelHeading title="Training Focus" />
          <FocusPreview focusAreas={focusAreas} fallback="No session focus history yet." />
        </section>

        <section className="studio-panel">
          <PanelHeading title="Squad Needs Signal" />
          <FocusPreview focusAreas={playerFocusAreas} fallback="Add player development focus to build sessions from squad needs." />
        </section>

        <section className="studio-panel">
          <PanelHeading title="Recent Drafts" />
          <SessionListPreview sessions={draftSessions.slice(0, 4)} emptyText="No draft sessions yet." onOpenSession={onOpenSession} />
        </section>

        <section className="studio-panel">
          <PanelHeading title="Session Library" />
          <SessionListPreview sessions={recentSessions} emptyText="Saved sessions will appear here." onOpenSession={onOpenSession} />
        </section>

        <section className="studio-panel ai-entry-panel">
          <PanelHeading title="AI Coaching Assistant" />
          <div className="ai-entry-card">
            <span>Future AI layer</span>
            <strong>Ask for a session draft from your real team context.</strong>
            <p>This shell is ready for a future backend. No API call or AI key is used now.</p>
            <button className="secondary-button" type="button" onClick={onCreateSession}>Open planning workflow</button>
          </div>
        </section>
      </div>
    </div>
  )
}

function WorkspaceHeader({
  completedQualityItems,
  formData,
  hasUnsavedChanges,
  message,
  onBack,
  onCreateSession,
  onDelete,
  onDiscardDraft,
  onDuplicate,
  selectedSession,
  totalQualityItems,
}) {
  return (
    <section className="workspace-header-card">
      <div className="workspace-title-row">
        <button className="secondary-button compact-button" type="button" onClick={onBack}>Studio Home</button>
        <div>
          <p className="section-kicker">Session Workspace</p>
          <h3>{formData.sessionTitle || 'Untitled training session'}</h3>
          <span>{formData.primaryTopic} - {formData.mainGameMoment} - {formData.status}</span>
        </div>
        <div className="workspace-action-row">
          <span className={hasUnsavedChanges ? 'save-state-pill unsaved' : 'save-state-pill'}>{hasUnsavedChanges ? 'Unsaved' : 'Saved'}</span>
          <button className="secondary-button" type="button" onClick={onDuplicate} disabled={!selectedSession}>Duplicate</button>
          <button className="secondary-button" type="button" onClick={onDiscardDraft}>Discard Draft</button>
          <button className="secondary-button" type="button" onClick={onCreateSession}>New</button>
          <button className="danger-button" type="button" onClick={onDelete} disabled={!selectedSession}>Delete</button>
          <button className="primary-button" type="submit">Save Session</button>
        </div>
      </div>

      {message && <p className="form-message workspace-message">{message}</p>}

      <div className="workspace-summary-strip">
        <SummaryItem icon="TM" label="Total Duration" value={formData.duration || '--'} />
        <SummaryItem icon="AG" label="Age Group" value={formData.ageGroup || '--'} />
        <SummaryItem icon="PL" label="Players" value={formData.numberOfPlayers || '--'} />
        <SummaryItem icon="FC" label="Focus" value={formData.primaryTopic || '--'} />
        <SummaryItem icon="QC" label="Quality" value={`${completedQualityItems}/${totalQualityItems}`} />
      </div>
    </section>
  )
}

function SummaryItem({ icon, label, value }) {
  return (
    <div className="workspace-summary-item">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  )
}

function SessionTimeline({ activeActivityIndex, activities, onAddActivity, onSelectActivity }) {
  return (
    <aside className="session-timeline-panel">
      <div className="timeline-heading">
        <div>
          <p className="section-kicker">Session Timeline</p>
          <h4>{activities.length} activities</h4>
        </div>
        <span>{activities.reduce((total, activity) => total + getSessionMinutes(activity), 0) || '--'} mins</span>
      </div>
      <div className="timeline-activity-list">
        {activities.map((activity, index) => (
          <button
            className={activeActivityIndex === index ? 'timeline-activity active' : 'timeline-activity'}
            key={`${activity.name}-${index}`}
            type="button"
            onClick={() => onSelectActivity(index)}
          >
            <span>{index + 1}</span>
            <div>
              <strong>{activity.name || activityTemplates[index]}</strong>
              <small>{activity.duration || 'Add duration'}</small>
            </div>
          </button>
        ))}
      </div>
      <button className="secondary-button timeline-add-button" type="button" onClick={onAddActivity}>Add Activity</button>
    </aside>
  )
}

function SessionBasicsPanel({ formData, onFieldChange, onToggle }) {
  return (
    <FormSection kicker="Overview" title="Session details">
      <div className="form-grid">
        <label>
          Session title
          <input name="sessionTitle" onChange={onFieldChange} required type="text" value={formData.sessionTitle} />
        </label>
        <label>
          Date
          <input name="date" onChange={onFieldChange} required type="date" value={formData.date} />
        </label>
        <label>
          Age group
          <input name="ageGroup" onChange={onFieldChange} placeholder="U10, U14, Senior" type="text" value={formData.ageGroup} />
        </label>
        <label>
          Duration
          <input name="duration" onChange={onFieldChange} type="text" value={formData.duration} />
        </label>
        <label>
          Number of players
          <input min="1" name="numberOfPlayers" onChange={onFieldChange} type="number" value={formData.numberOfPlayers} />
        </label>
        <label>
          Ability level
          <select name="abilityLevel" onChange={onFieldChange} value={formData.abilityLevel}>
            <option>Beginner</option>
            <option>Developing</option>
            <option>Mixed</option>
            <option>Advanced</option>
            <option>Elite</option>
          </select>
        </label>
        <label>
          Pitch size
          <input name="pitchSize" onChange={onFieldChange} placeholder="30x20m, half pitch" type="text" value={formData.pitchSize} />
        </label>
        <label>
          Session status
          <select name="status" onChange={onFieldChange} value={formData.status}>
            <option>Draft</option>
            <option>Ready</option>
            <option>Used</option>
          </select>
        </label>
      </div>

      <CheckboxGroup
        fieldName="equipmentAvailable"
        options={equipmentOptions}
        selectedValues={formData.equipmentAvailable}
        title="Equipment available"
        onToggle={onToggle}
      />
    </FormSection>
  )
}

function SessionFocusPanel({ formData, onFieldChange, onToggle }) {
  return (
    <FormSection kicker="Training focus" title="Coach-led structure">
      <div className="structure-strip">
        {sessionStructureOptions.map((item) => <span key={item}>{item}</span>)}
      </div>

      <div className="form-grid">
        <label>
          Main game moment
          <select name="mainGameMoment" onChange={onFieldChange} value={formData.mainGameMoment}>
            {gameMoments.map((moment) => <option key={moment}>{moment}</option>)}
          </select>
        </label>
        <label>
          Primary topic
          <select name="primaryTopic" onChange={onFieldChange} value={formData.primaryTopic}>
            {primaryTopics.map((topic) => <option key={topic}>{topic}</option>)}
          </select>
        </label>
        <label>
          Session type
          <select name="sessionType" onChange={onFieldChange} value={formData.sessionType}>
            {sessionTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <label>
          Coaching style
          <select name="coachingStyle" onChange={onFieldChange} value={formData.coachingStyle}>
            {coachingStyles.map((style) => <option key={style}>{style}</option>)}
          </select>
        </label>
      </div>

      <CheckboxGroup
        fieldName="topicTags"
        options={topicTags}
        selectedValues={formData.topicTags}
        title="Topic tags"
        onToggle={onToggle}
      />
    </FormSection>
  )
}

function SessionQualityPanel({ qualityItems }) {
  return (
    <section className="studio-panel compact-side-panel">
      <PanelHeading title="Session Review" />
      <div className="quality-preview-list live-quality-list">
        {qualityItems.map((item) => (
          <div className={item.complete ? 'complete' : ''} key={item.label}>
            <span>{item.complete ? 'OK' : '--'}</span>
            <strong>{item.label}</strong>
            <small>{item.complete ? 'Ready' : 'Needs detail'}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

function AiAssistantShell({ assistantDraft, formData, onAssistantDraftChange, playerFocusAreas, teamIdentity }) {
  const contextItems = [
    teamIdentity?.teamName || 'Your team',
    formData.primaryTopic || 'No topic set',
    playerFocusAreas[0]?.label || 'No squad need yet',
  ]

  return (
    <section className="studio-panel compact-side-panel ai-assistant-panel">
      <PanelHeading title="AI Assistant" />
      <div className="assistant-context-row">
        {contextItems.map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="assistant-chat-shell">
        <div className="assistant-message assistant-message-ai">
          <strong>Future assistant</strong>
          <p>I will eventually use your squad, session history and match feedback to suggest an editable plan. No API is connected yet.</p>
        </div>
        <div className="assistant-message assistant-message-coach">
          <p>Help me design a session from the current squad needs.</p>
        </div>
      </div>
      <label className="assistant-input-label">
        Ask later
        <textarea
          onChange={(event) => onAssistantDraftChange(event.target.value)}
          placeholder="Example: We struggled to finish chances after regaining possession. Build a realistic U18 session."
          rows="4"
          value={assistantDraft}
        />
      </label>
      <button className="secondary-button" disabled type="button">AI needs backend later</button>
    </section>
  )
}

function CreateSessionModal({
  canDuplicate,
  onCancel,
  onConfirm,
  onSelectRoute,
  playerFocusAreas,
  players,
  selectedRoute,
  sessions,
}) {
  return (
    <div className="create-session-overlay" role="presentation">
      <section className="create-session-modal" role="dialog" aria-modal="true" aria-labelledby="create-session-title">
        <div className="create-session-header">
          <div>
            <h3 id="create-session-title">Create Session</h3>
            <p>Choose the best starting point. The detailed AI layer can come later, but the workflow starts here.</p>
          </div>
          <button className="modal-close-button" type="button" onClick={onCancel}>x</button>
        </div>

        <div className="wizard-step-strip" aria-label="Create session steps">
          {['Choose route', 'Basics', 'Focus', 'Activities', 'Review'].map((step, index) => (
            <span className={index === 0 ? 'active' : ''} key={step}>{index + 1}. {step}</span>
          ))}
        </div>

        <div className="create-session-body">
          <div className="create-route-list">
            {creationRoutes.map((route) => {
              const disabled = route.id === 'duplicate' && !canDuplicate

              return (
                <button
                  className={selectedRoute === route.id ? 'create-route-card active' : 'create-route-card'}
                  disabled={disabled}
                  key={route.id}
                  type="button"
                  onClick={() => onSelectRoute(route.id)}
                >
                  <span>{route.icon}</span>
                  <div>
                    <strong>{route.title}</strong>
                    {route.label && <em>{route.label}</em>}
                    <p>{disabled ? 'Open a saved session first to duplicate it.' : route.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <aside className="create-context-panel">
            <strong>Squad context</strong>
            <div className="context-metric-row">
              <span>{players.length} Players</span>
              <span>{sessions.length} Sessions</span>
            </div>
            <div className="context-chip-stack">
              {(playerFocusAreas.length > 0 ? playerFocusAreas : [{ label: 'Add player focus areas', count: 0 }]).map((focus) => (
                <span key={focus.label}>{focus.label}</span>
              ))}
            </div>
            <div className="session-preview-card">
              <strong>What happens next?</strong>
              <p>The workspace opens with basics, focus, activity editor, diagram tools, quality review and an AI assistant shell.</p>
            </div>
          </aside>
        </div>

        <div className="create-session-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>
          <button className="primary-button" type="button" onClick={onConfirm}>Open Workspace</button>
        </div>
      </section>
    </div>
  )
}

function FormSection({ children, kicker, title }) {
  return (
    <section className="session-card studio-form-card">
      <div className="form-heading">
        <div>
          <p className="section-kicker">{kicker}</p>
          <h3>{title}</h3>
        </div>
      </div>
      {children}
    </section>
  )
}

function CheckboxGroup({ fieldName, options, selectedValues, title, onToggle }) {
  return (
    <div className="checkbox-group">
      <span>{title}</span>
      <div className="checkbox-grid compact-checkbox-grid">
        {options.map((option) => (
          <label className="checkbox-pill" key={option}>
            <input checked={selectedValues.includes(option)} onChange={() => onToggle(fieldName, option)} type="checkbox" />
            {option}
          </label>
        ))}
      </div>
    </div>
  )
}

function ActivitySection({ activity, index, onChange, onCopyDiagramToBoard, sessionTitle }) {
  const [isEditingDiagram, setIsEditingDiagram] = useState(false)
  const diagram = normaliseDiagram(activity.diagram, `${activity.name} diagram`)
  const hasDiagram = diagram.objects.length > 0
  const diagramNotes = diagram.notes.trim()

  function saveActivityDiagram(nextDiagram) {
    onChange(index, 'diagram', nextDiagram)
    setIsEditingDiagram(false)
  }

  function copyToTacticalBoard() {
    if (!onCopyDiagramToBoard || !hasDiagram) {
      return
    }

    onCopyDiagramToBoard({ activity, diagram, sessionTitle })
  }

  return (
    <section className="session-card activity-card studio-activity-card">
      <div className="form-heading activity-workspace-heading">
        <div>
          <p className="section-kicker">Activity {index + 1}</p>
          <h3>{activityTemplates[index]}</h3>
        </div>
        <span>{activity.duration || 'Add duration'}</span>
      </div>

      <div className="form-grid">
        <label>
          Activity name
          <input onChange={(event) => onChange(index, 'name', event.target.value)} type="text" value={activity.name} />
        </label>
        <label>
          Duration
          <input onChange={(event) => onChange(index, 'duration', event.target.value)} placeholder="10 minutes" type="text" value={activity.duration} />
        </label>
      </div>

      <div className="notes-grid two-column-notes">
        <label>
          Setup
          <textarea onChange={(event) => onChange(index, 'setup', event.target.value)} rows="4" value={activity.setup} />
        </label>
        <label>
          Rules / organisation
          <textarea onChange={(event) => onChange(index, 'rules', event.target.value)} rows="4" value={activity.rules} />
        </label>
        <label>
          Coaching points
          <textarea onChange={(event) => onChange(index, 'coachingPoints', event.target.value)} rows="4" value={activity.coachingPoints} />
        </label>
        <label>
          Player questions
          <textarea onChange={(event) => onChange(index, 'playerQuestions', event.target.value)} rows="4" value={activity.playerQuestions} />
        </label>
        <label>
          Progression
          <textarea onChange={(event) => onChange(index, 'progression', event.target.value)} rows="4" value={activity.progression} />
        </label>
        <label>
          Regression
          <textarea onChange={(event) => onChange(index, 'regression', event.target.value)} rows="4" value={activity.regression} />
        </label>
        <label>
          Coach notes
          <textarea onChange={(event) => onChange(index, 'coachNotes', event.target.value)} rows="4" value={activity.coachNotes} />
        </label>
        <label>
          Diagram notes / tactical diagram placeholder
          <textarea onChange={(event) => onChange(index, 'diagramNotes', event.target.value)} rows="4" value={activity.diagramNotes} />
        </label>
      </div>

      <section className="activity-diagram-section studio-diagram-section">
        <div className="activity-diagram-header">
          <div>
            <p className="section-kicker">Activity Diagram</p>
            <h4>{hasDiagram ? diagram.title : 'No diagram added yet.'}</h4>
            <p>Create a visual setup for this activity. The diagram is saved with this session activity.</p>
          </div>
          <div className="activity-diagram-actions">
            {hasDiagram && (
              <button className="secondary-button" type="button" onClick={copyToTacticalBoard}>Copy to Tactical Board</button>
            )}
            <button className="secondary-button" type="button" onClick={() => setIsEditingDiagram(true)}>Edit Diagram</button>
          </div>
        </div>

        <DiagramPreview diagram={diagram} />

        {diagramNotes && (
          <div className="diagram-notes-preview">
            <span>Diagram notes</span>
            <p>{diagramNotes}</p>
          </div>
        )}

        {isEditingDiagram && (
          <DiagramEditor
            activityName={activity.name || activityTemplates[index]}
            diagram={diagram}
            onCancel={() => setIsEditingDiagram(false)}
            onSave={saveActivityDiagram}
          />
        )}
      </section>
    </section>
  )
}

function PanelHeading({ action, title }) {
  return (
    <div className="studio-panel-heading">
      <h4>{title}</h4>
      {action && <span>{action}</span>}
    </div>
  )
}

function SessionListPreview({ emptyText, onOpenSession, sessions }) {
  if (sessions.length === 0) {
    return <p className="studio-empty-text">{emptyText}</p>
  }

  return (
    <div className="studio-session-list">
      {sessions.map((session) => (
        <button key={session.id} type="button" onClick={() => onOpenSession(session.id)}>
          <span>{session.status || 'Draft'}</span>
          <div>
            <strong>{session.sessionTitle || 'Untitled session'}</strong>
            <small>{formatSessionDate(session)} - {session.primaryTopic || 'No topic'}</small>
          </div>
        </button>
      ))}
    </div>
  )
}

function FocusPreview({ fallback, focusAreas }) {
  if (focusAreas.length === 0) {
    return <p className="studio-empty-text">{fallback}</p>
  }

  return (
    <div className="focus-preview-grid">
      {focusAreas.map((focus) => (
        <article key={focus.label}>
          <strong>{focus.label}</strong>
          <small>{focus.count} linked item{focus.count === 1 ? '' : 's'}</small>
        </article>
      ))}
    </div>
  )
}

function EmptyStudioState({ action, copy, onAction, title }) {
  return (
    <div className="empty-studio-state">
      <strong>{title}</strong>
      <p>{copy}</p>
      <button className="primary-button" type="button" onClick={onAction}>{action}</button>
    </div>
  )
}

function MiniSessionPitch() {
  return (
    <div className="studio-mini-pitch" aria-hidden="true">
      <span className="pitch-player p1">6</span>
      <span className="pitch-player p2">8</span>
      <span className="pitch-player p3">10</span>
      <span className="pitch-player p4">9</span>
      <i className="pitch-run r1" />
      <i className="pitch-run r2" />
    </div>
  )
}

export default SessionPlanner
