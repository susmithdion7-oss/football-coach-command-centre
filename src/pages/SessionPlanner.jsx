import { useMemo, useState } from 'react'
import DiagramEditor from '../components/DiagramEditor.jsx'
import DiagramPreview, { createEmptyDiagram, normaliseDiagram } from '../components/DiagramPreview.jsx'

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
  onDeleteSession,
  onDuplicateSession,
  onUpdateSession,
  sessions,
}) {
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id ?? null)
  const [formData, setFormData] = useState(emptySession)
  const [message, setMessage] = useState('')
  const sortedSessions = useMemo(() => sortSessionsByDate(sessions), [sessions])

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId),
    [sessions, selectedSessionId],
  )

  function getSessionForForm(session) {
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

  function startNewSession() {
    setSelectedSessionId(null)
    setFormData(emptySession)
    setMessage('New session form ready.')
  }

  function selectSession(sessionId) {
    const session = sessions.find((savedSession) => savedSession.id === sessionId)

    if (!session) {
      return
    }

    setSelectedSessionId(sessionId)
    setFormData(getSessionForForm(session))
    setMessage('')
  }

  function handleFieldChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function toggleListValue(fieldName, value) {
    setFormData((currentData) => {
      const currentValues = currentData[fieldName]
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return { ...currentData, [fieldName]: nextValues }
    })
  }

  function updateActivity(index, fieldName, value) {
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
      setMessage('Session updated and saved locally.')
      return
    }

    const newSessionId = onAddSession(sessionToSave)
    setSelectedSessionId(newSessionId)
    setMessage('Session created and saved locally.')
  }

  function handleDelete() {
    if (!selectedSession) {
      return
    }

    const shouldDelete = window.confirm(`Delete ${selectedSession.sessionTitle}?`)

    if (!shouldDelete) {
      return
    }

    onDeleteSession(selectedSession.id)
    const nextSession = sortedSessions.find((session) => session.id !== selectedSession.id)
    setSelectedSessionId(nextSession?.id ?? null)
    setFormData(nextSession ? getSessionForForm(nextSession) : emptySession)
    setMessage(nextSession ? 'Session deleted.' : 'Session deleted. New session form ready.')
  }

  function handleDuplicate() {
    if (!selectedSession) {
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

      setSelectedSessionId(duplicateId)
      setFormData(getSessionForForm(copiedSession))
      setMessage('Session duplicated as a new draft.')
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
          {message && <p className="form-message">{message}</p>}

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

function ActivitySection({ activity, index, onChange }) {
  const [isEditingDiagram, setIsEditingDiagram] = useState(false)
  const diagram = normaliseDiagram(activity.diagram, `${activity.name} diagram`)
  const hasDiagram = diagram.objects.length > 0

  function saveActivityDiagram(nextDiagram) {
    onChange(index, 'diagram', nextDiagram)
    setIsEditingDiagram(false)
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
          <button
            className="secondary-button"
            type="button"
            onClick={() => setIsEditingDiagram(true)}
          >
            Edit Diagram
          </button>
        </div>

        <DiagramPreview diagram={diagram} />

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
