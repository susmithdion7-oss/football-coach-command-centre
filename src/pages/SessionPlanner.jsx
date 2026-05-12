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

function SessionPlanner({
  onAddSession,
  onCopyDiagramToBoard,
  onDeleteSession,
  onDuplicateSession,
  onUpdateSession,
  sessions,
}) {
  const [initialDraftState] = useState(() => getDraftInitialState(sessions))
  const [selectedSessionId, setSelectedSessionId] = useState(initialDraftState.selectedSessionId)
  const [formData, setFormData] = useState(initialDraftState.formData)
  const [message, setMessage] = useState(initialDraftState.restored ? 'Draft restored.' : '')
  const [draftStatus, setDraftStatus] = useState(initialDraftState.restored ? 'Unsaved changes' : '')
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

  function startNewSession() {
    if (!confirmDiscardUnsaved('You have unsaved changes. Do you want to discard them and start a new session?')) {
      return
    }

    clearSessionDraft()
    setCleanForm(emptySession, null, 'New session form ready.')
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

    setCleanForm(emptySession, null, 'Draft discarded. New session form ready.')
  }

  function selectSession(sessionId) {
    const session = sessions.find((savedSession) => savedSession.id === sessionId)

    if (!session || !confirmDiscardUnsaved('You have unsaved changes. Do you want to discard them and open another session?')) {
      return
    }

    clearSessionDraft()
    setCleanForm(session, sessionId, '')
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
    const nextSession = sortedSessions.find((session) => session.id !== selectedSession.id)
    setCleanForm(
      nextSession || emptySession,
      nextSession?.id ?? null,
      nextSession ? 'Session deleted.' : 'Session deleted. New session form ready.',
    )
  }

  function handleDuplicate() {
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
    }
  }

  return (
    <section className="session-page">
      <div className="sessions-header">
        <div>
          <p className="section-kicker">Guided session builder</p>
          <h3>Plan a training session</h3>
          <p>Choose the focus, structure the activities, then edit the detail by hand.</p>
        </div>
        <button className="primary-button" type="button" onClick={startNewSession}>
          New Session
        </button>
      </div>

      <div className="sessions-layout">
        <aside className="session-list-panel">
          <div className="panel-heading">
            <span>Saved sessions</span>
            <strong>{sessions.length}</strong>
          </div>

          {sessions.length === 0 ? (
            <p className="empty-message">No sessions saved yet.</p>
          ) : (
            <div className="session-list">
              {sortedSessions.map((session) => (
                <button
                  className={
                    session.id === selectedSessionId
                      ? 'session-list-item active'
                      : 'session-list-item'
                  }
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  type="button"
                >
                  <strong>{session.sessionTitle}</strong>
                  <small>
                    {session.date || 'No date'} - {session.primaryTopic || 'No topic'}
                  </small>
                  <span>{session.status || 'Draft'}</span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <form className="session-form" onSubmit={handleSave}>
          {(message || draftStatus) && <p className="form-message">{message || draftStatus}</p>}

          <FormSection kicker="Overview" title="Session details">
            <div className="form-grid">
              <label>
                Session title
                <input
                  name="sessionTitle"
                  onChange={handleFieldChange}
                  required
                  type="text"
                  value={formData.sessionTitle}
                />
              </label>
              <label>
                Date
                <input
                  name="date"
                  onChange={handleFieldChange}
                  required
                  type="date"
                  value={formData.date}
                />
              </label>
              <label>
                Age group
                <input
                  name="ageGroup"
                  onChange={handleFieldChange}
                  placeholder="U10, U14, Senior"
                  type="text"
                  value={formData.ageGroup}
                />
              </label>
              <label>
                Duration
                <input
                  name="duration"
                  onChange={handleFieldChange}
                  type="text"
                  value={formData.duration}
                />
              </label>
              <label>
                Number of players
                <input
                  min="1"
                  name="numberOfPlayers"
                  onChange={handleFieldChange}
                  type="number"
                  value={formData.numberOfPlayers}
                />
              </label>
              <label>
                Ability level
                <select
                  name="abilityLevel"
                  onChange={handleFieldChange}
                  value={formData.abilityLevel}
                >
                  <option>Beginner</option>
                  <option>Developing</option>
                  <option>Mixed</option>
                  <option>Advanced</option>
                  <option>Elite</option>
                </select>
              </label>
              <label>
                Pitch size
                <input
                  name="pitchSize"
                  onChange={handleFieldChange}
                  placeholder="30x20m, half pitch"
                  type="text"
                  value={formData.pitchSize}
                />
              </label>
              <label>
                Session status
                <select name="status" onChange={handleFieldChange} value={formData.status}>
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
              onToggle={toggleListValue}
            />
          </FormSection>

          <FormSection kicker="Training focus" title="Coach-led structure">
            <div className="form-grid">
              <label>
                Main game moment
                <select
                  name="mainGameMoment"
                  onChange={handleFieldChange}
                  value={formData.mainGameMoment}
                >
                  {gameMoments.map((moment) => (
                    <option key={moment}>{moment}</option>
                  ))}
                </select>
              </label>
              <label>
                Primary topic
                <select
                  name="primaryTopic"
                  onChange={handleFieldChange}
                  value={formData.primaryTopic}
                >
                  {primaryTopics.map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </label>
              <label>
                Session type
                <select
                  name="sessionType"
                  onChange={handleFieldChange}
                  value={formData.sessionType}
                >
                  {sessionTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                Coaching style
                <select
                  name="coachingStyle"
                  onChange={handleFieldChange}
                  value={formData.coachingStyle}
                >
                  {coachingStyles.map((style) => (
                    <option key={style}>{style}</option>
                  ))}
                </select>
              </label>
            </div>

            <CheckboxGroup
              fieldName="topicTags"
              options={topicTags}
              selectedValues={formData.topicTags}
              title="Topic tags"
              onToggle={toggleListValue}
            />
          </FormSection>

          <div className="activity-stack">
            {formData.activities.map((activity, index) => (
              <ActivitySection
                activity={activity}
                index={index}
                key={activityTemplates[index]}
                onChange={updateActivity}
                onCopyDiagramToBoard={onCopyDiagramToBoard}
                sessionTitle={formData.sessionTitle}
              />
            ))}
          </div>

          <div className="form-actions sticky-actions">
            <button className="primary-button" type="submit">
              Save session
            </button>
            <button className="secondary-button" type="button" onClick={startNewSession}>
              New Session
            </button>
            <button className="secondary-button" type="button" onClick={discardDraft}>
              Discard Draft
            </button>
            <button
              className="secondary-button"
              disabled={!selectedSession}
              type="button"
              onClick={handleDuplicate}
            >
              Duplicate
            </button>
            <button
              className="danger-button"
              disabled={!selectedSession}
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function FormSection({ children, kicker, title }) {
  return (
    <section className="session-card">
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
      <div className="checkbox-grid">
        {options.map((option) => (
          <label className="checkbox-pill" key={option}>
            <input
              checked={selectedValues.includes(option)}
              onChange={() => onToggle(fieldName, option)}
              type="checkbox"
            />
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
    <section className="session-card activity-card">
      <div className="form-heading">
        <div>
          <p className="section-kicker">Activity {index + 1}</p>
          <h3>{activityTemplates[index]}</h3>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Activity name
          <input
            onChange={(event) => onChange(index, 'name', event.target.value)}
            type="text"
            value={activity.name}
          />
        </label>
        <label>
          Duration
          <input
            onChange={(event) => onChange(index, 'duration', event.target.value)}
            placeholder="10 minutes"
            type="text"
            value={activity.duration}
          />
        </label>
      </div>

      <div className="notes-grid two-column-notes">
        <label>
          Setup
          <textarea
            onChange={(event) => onChange(index, 'setup', event.target.value)}
            rows="4"
            value={activity.setup}
          />
        </label>
        <label>
          Rules / organisation
          <textarea
            onChange={(event) => onChange(index, 'rules', event.target.value)}
            rows="4"
            value={activity.rules}
          />
        </label>
        <label>
          Coaching points
          <textarea
            onChange={(event) => onChange(index, 'coachingPoints', event.target.value)}
            rows="4"
            value={activity.coachingPoints}
          />
        </label>
        <label>
          Player questions
          <textarea
            onChange={(event) => onChange(index, 'playerQuestions', event.target.value)}
            rows="4"
            value={activity.playerQuestions}
          />
        </label>
        <label>
          Progression
          <textarea
            onChange={(event) => onChange(index, 'progression', event.target.value)}
            rows="4"
            value={activity.progression}
          />
        </label>
        <label>
          Regression
          <textarea
            onChange={(event) => onChange(index, 'regression', event.target.value)}
            rows="4"
            value={activity.regression}
          />
        </label>
        <label>
          Coach notes
          <textarea
            onChange={(event) => onChange(index, 'coachNotes', event.target.value)}
            rows="4"
            value={activity.coachNotes}
          />
        </label>
        <label>
          Diagram notes / tactical diagram placeholder
          <textarea
            onChange={(event) => onChange(index, 'diagramNotes', event.target.value)}
            rows="4"
            value={activity.diagramNotes}
          />
        </label>
      </div>

      <section className="activity-diagram-section">
        <div className="activity-diagram-header">
          <div>
            <p className="section-kicker">Activity Diagram</p>
            <h4>{hasDiagram ? diagram.title : 'No diagram added yet.'}</h4>
            <p>Create a visual setup for this activity. The diagram is saved with this session activity.</p>
          </div>
          <div className="activity-diagram-actions">
            {hasDiagram && (
              <button className="secondary-button" type="button" onClick={copyToTacticalBoard}>
                Copy to Tactical Board
              </button>
            )}
            <button
              className="secondary-button"
              type="button"
              onClick={() => setIsEditingDiagram(true)}
            >
              Edit Diagram
            </button>
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

export default SessionPlanner
