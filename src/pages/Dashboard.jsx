import TeamBadge from '../components/TeamBadge.jsx'

const defaultMatch = {
  day: 'Saturday Morning',
  opponent: 'Opponent TBC',
  status: 'Preparation not started',
}

function parseLocalDate(dateValue) {
  if (!dateValue) {
    return null
  }

  const date = new Date(`${dateValue}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDisplayDate(dateValue) {
  const date = parseLocalDate(dateValue)

  if (!date) {
    return { day: '--', month: 'TBC', weekday: 'TBC', label: 'Date TBC' }
  }

  return {
    day: new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date).toUpperCase(),
    weekday: new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(date).toUpperCase(),
    label: new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    }).format(date),
  }
}

function formatUpdatedDate(dateValue) {
  if (!dateValue) {
    return 'No saved date'
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return 'No saved date'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getSessionTitle(session) {
  return session?.sessionTitle || 'Untitled session'
}

function getSessionTopic(session) {
  return session?.primaryTopic || session?.mainGameMoment || 'Topic not set'
}

function getSessionDuration(session) {
  return session?.duration || 'Duration TBC'
}

function getSessionTime(session) {
  return session?.startTime || session?.time || session?.trainingTime || ''
}

function getSessionDateTime(session) {
  const dateLabel = formatDisplayDate(session?.date).label
  const timeLabel = getSessionTime(session)

  return timeLabel ? `${dateLabel} - ${timeLabel}` : dateLabel
}

function getDisplayStatus(statusValue) {
  const status = statusValue || 'Draft'

  if (status === 'Used') {
    return 'Delivered'
  }

  return status
}

function getLatestByDate(items = []) {
  return [...items]
    .filter(Boolean)
    .sort((firstItem, secondItem) => {
      const firstDate = new Date(firstItem.updatedAt || firstItem.createdAt || 0).getTime()
      const secondDate = new Date(secondItem.updatedAt || secondItem.createdAt || 0).getTime()
      return secondDate - firstDate
    })[0]
}

function getLatestBoard(tacticalBoards = []) {
  return getLatestByDate(tacticalBoards)
}

function hasCoachNote(player = {}) {
  const hasLegacyNote = Boolean(String(player.coachNotes || '').trim())
  const hasSavedNote = Array.isArray(player.notes) && player.notes.some((note) => String(note?.text || '').trim())
  return hasLegacyNote || hasSavedNote
}

function getPlayerName(player = {}) {
  const combinedName = [player.firstName, player.lastName].filter(Boolean).join(' ')
  return player.fullName || player.name || combinedName || 'Unnamed player'
}

function getPlayerInitials(player = {}) {
  const words = getPlayerName(player).split(' ').filter(Boolean)

  if (words.length === 0) {
    return 'PL'
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

function getPlayerCompleteness(player = {}) {
  const ratingFields = [
    player.technicalRating,
    player.physicalRating,
    player.tacticalRating || player.tacticalUnderstandingRating,
    player.mentalRating,
  ]
  const checks = [
    getPlayerName(player) !== 'Unnamed player',
    Boolean(player.age),
    Boolean(player.mainPosition),
    Boolean(player.preferredFoot),
    Boolean(player.developmentFocus),
    Boolean(player.strengths || player.areasToImprove),
    hasCoachNote(player),
    ratingFields.some(Boolean),
  ]

  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

function getPlayerAttention(players = []) {
  return players
    .map((player) => {
      const issues = []

      if (player.status === 'Needs Support') {
        issues.push('Needs support')
      }

      if (!player.mainPosition) {
        issues.push('Position missing')
      }

      if (!player.developmentFocus) {
        issues.push('Development focus missing')
      }

      if (!hasCoachNote(player)) {
        issues.push('No coach note yet')
      }

      if (getPlayerCompleteness(player) < 60 && issues.length < 3) {
        issues.push('Profile incomplete')
      }

      return {
        id: player.id || getPlayerName(player),
        issues,
        name: getPlayerName(player),
        player,
        status: player.status || 'Review',
      }
    })
    .filter((player) => player.issues.length > 0)
}

function getAttentionSummary(attentionPlayers = []) {
  const issueCounts = attentionPlayers.reduce((counts, player) => {
    player.issues.slice(0, 2).forEach((issue) => {
      counts[issue] = (counts[issue] || 0) + 1
    })
    return counts
  }, {})

  return Object.entries(issueCounts)
    .sort((firstIssue, secondIssue) => secondIssue[1] - firstIssue[1])
    .slice(0, 3)
    .map(([issue, count]) => `${count} ${issue.toLowerCase()}`)
}

function hasActivityContent(activity = {}) {
  return Boolean(
    activity.name ||
    activity.duration ||
    activity.setup ||
    activity.rules ||
    activity.coachNotes,
  )
}

function hasActivityDiagram(activity = {}) {
  return Array.isArray(activity.diagram?.objects) && activity.diagram.objects.length > 0
}

function getReadinessChecklist(session) {
  const activities = Array.isArray(session?.activities) ? session.activities : []

  return [
    {
      label: 'Objective',
      complete: Boolean(session?.primaryTopic || session?.mainGameMoment),
    },
    {
      label: 'Activities',
      complete: activities.some(hasActivityContent),
    },
    {
      label: 'Diagram',
      complete: activities.some(hasActivityDiagram),
    },
    {
      label: 'Coaching Points',
      complete: activities.some((activity) => String(activity.coachingPoints || '').trim()),
    },
    {
      label: 'Player Questions',
      complete: activities.some((activity) => String(activity.playerQuestions || '').trim()),
    },
  ]
}

function getReadinessPercentage(session) {
  const checklist = getReadinessChecklist(session)
  const completedItems = checklist.filter((item) => item.complete).length
  return Math.round((completedItems / checklist.length) * 100)
}

function getCoachTasks({ attentionPlayers, players, tacticalBoards, upcomingSessions }) {
  const tasks = []
  const playersMissingPosition = players.filter((player) => !player.mainPosition).length
  const playersMissingFocus = players.filter((player) => !player.developmentFocus).length
  const draftSessions = upcomingSessions.filter((session) => getDisplayStatus(session.status) === 'Draft')

  if (players.length === 0) {
    tasks.push({ label: 'Add your first player', target: 'players' })
  }

  if (playersMissingPosition > 0) {
    tasks.push({ label: 'Complete player positions', target: 'players' })
  }

  if (playersMissingFocus > 0) {
    tasks.push({ label: 'Set development focus', target: 'players' })
  }

  if (upcomingSessions.length === 0) {
    tasks.push({ label: 'Create your next session', target: 'sessions' })
  }

  if (draftSessions.length > 0) {
    tasks.push({ label: 'Finish draft sessions', target: 'sessions' })
  }

  if (tacticalBoards.length === 0) {
    tasks.push({ label: 'Create your first tactical board', target: 'tactics' })
  }

  if (attentionPlayers.some((player) => player.issues.includes('Needs support'))) {
    tasks.push({ label: 'Review support players', target: 'players' })
  }

  tasks.push({ label: 'Prepare your next match', target: 'matchCentre', disabled: true })

  return tasks
}

function isSessionThisWeek(session) {
  const sessionDate = parseLocalDate(session?.date)

  if (!sessionDate) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(today)
  const dayOffset = (today.getDay() + 6) % 7
  startOfWeek.setDate(today.getDate() - dayOffset)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return sessionDate >= startOfWeek && sessionDate <= endOfWeek
}

function getWeekSessions(upcomingSessions = []) {
  return upcomingSessions.filter(isSessionThisWeek).slice(0, 5)
}

function getRecentActivity({ players, recentPastSession, tacticalBoards, upcomingSessions }) {
  const sessionCandidates = [
    ...upcomingSessions,
    recentPastSession,
  ].filter(Boolean)
  const latestSession = getLatestByDate(sessionCandidates)
  const latestPlayer = getLatestByDate(players)
  const latestBoard = getLatestBoard(tacticalBoards)
  const activity = []

  if (latestSession?.createdAt || latestSession?.updatedAt) {
    const timestamp = latestSession.updatedAt || latestSession.createdAt
    activity.push({
      id: `session-${latestSession.id || latestSession.sessionTitle}`,
      label: 'Session saved',
      timestamp,
      title: getSessionTitle(latestSession),
      meta: formatUpdatedDate(timestamp),
    })
  }

  if (latestPlayer?.createdAt || latestPlayer?.updatedAt) {
    const timestamp = latestPlayer.updatedAt || latestPlayer.createdAt
    activity.push({
      id: `player-${latestPlayer.id || getPlayerName(latestPlayer)}`,
      label: 'Player updated',
      timestamp,
      title: getPlayerName(latestPlayer),
      meta: formatUpdatedDate(timestamp),
    })
  }

  if (latestBoard?.createdAt || latestBoard?.updatedAt) {
    const timestamp = latestBoard.updatedAt || latestBoard.createdAt
    activity.push({
      id: `board-${latestBoard.id || latestBoard.title}`,
      label: 'Board saved',
      timestamp,
      title: latestBoard.title || 'Untitled board',
      meta: formatUpdatedDate(timestamp),
    })
  }

  return activity
    .sort((firstItem, secondItem) => {
      const firstDate = new Date(firstItem.timestamp || 0).getTime()
      const secondDate = new Date(secondItem.timestamp || 0).getTime()
      return secondDate - firstDate
    })
    .slice(0, 3)
}

function normaliseListValue(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ')
  }

  return value || ''
}

function getSeasonObjectives(teamIdentity = {}) {
  return [
    { label: 'Team goal', value: teamIdentity.teamGoal },
    { label: 'Coach goal', value: teamIdentity.coachGoal },
    { label: 'Playing style', value: teamIdentity.playingStyle },
    {
      label: 'Training priorities',
      value: normaliseListValue(teamIdentity.trainingPriorities) || teamIdentity.trainingDays,
    },
  ].filter((item) => item.value)
}

function Dashboard({
  nextSession,
  onNavigate,
  playerCount,
  players = [],
  recentPastSession,
  sessionCount,
  tacticalBoardCount,
  tacticalBoards = [],
  teamIdentity,
  upcomingSessions = [],
}) {
  const coachName = teamIdentity?.coachName || 'Coach'
  const teamName = teamIdentity?.teamName || 'Your Team'
  const seasonName = teamIdentity?.seasonName || 'Current season'
  const attentionPlayers = getPlayerAttention(players)
  const attentionSummary = getAttentionSummary(attentionPlayers)
  const latestBoard = getLatestBoard(tacticalBoards)
  const weekSessions = getWeekSessions(upcomingSessions)
  const coachTasks = getCoachTasks({ attentionPlayers, players, tacticalBoards, upcomingSessions })
  const draftUpcomingSessions = upcomingSessions.filter((session) => getDisplayStatus(session.status) === 'Draft')
  const readinessPercentage = nextSession ? getReadinessPercentage(nextSession) : 0
  const recentActivity = getRecentActivity({ players, recentPastSession, tacticalBoards, upcomingSessions })
  const seasonObjectives = getSeasonObjectives(teamIdentity)
  const nextMatch = {
    ...defaultMatch,
    day: teamIdentity?.matchDay || defaultMatch.day,
  }

  return (
    <section className="coach-mission-control dashboard-workspace">
      <MissionHeader
        coachName={coachName}
        onNavigate={onNavigate}
        seasonName={seasonName}
        teamIdentity={teamIdentity}
        teamName={teamName}
      />

      <TodayCoachFocus
        attentionPlayers={attentionPlayers}
        attentionSummary={attentionSummary}
        coachName={coachName}
        nextMatch={nextMatch}
        nextSession={nextSession}
        onNavigate={onNavigate}
      />

      <section className="mission-status-grid" aria-label="Coach Mission Control status">
        <StatusCard
          detail={`${attentionPlayers.length} need attention`}
          icon="SQ"
          label="Squad"
          note={attentionPlayers.length > 0 ? 'Review profiles and support needs' : 'Profiles look healthy'}
          value={`${playerCount} players`}
        />
        <StatusCard
          detail={`${draftUpcomingSessions.length} drafts`}
          icon="SP"
          label="Sessions"
          note={`${sessionCount} saved total`}
          value={`${upcomingSessions.length} planned`}
        />
        <StatusCard
          detail="Lineup not set"
          icon="MP"
          label="Match Prep"
          note={nextMatch.status}
          value={nextMatch.day}
        />
        <StatusCard
          detail={coachTasks.slice(0, 2).map((task) => task.label).join(', ') || 'No open tasks'}
          icon="CT"
          label="Coach Tasks"
          note={coachTasks.some((task) => task.disabled) ? 'Match prep is placeholder' : 'Ready for today'}
          value={`${coachTasks.length} open`}
        />
      </section>

      <section className="mission-work-grid" aria-label="Main coaching work">
        <NextSessionReadiness
          nextSession={nextSession}
          onNavigate={onNavigate}
          readinessPercentage={readinessPercentage}
        />
        <PlayersAttentionPanel
          attentionPlayers={attentionPlayers}
          onNavigate={onNavigate}
        />
        <ThisWeekPanel
          onNavigate={onNavigate}
          weekSessions={weekSessions}
        />
      </section>

      <section className="mission-support-grid" aria-label="Supporting coach panels">
        <TacticalBoardPanel
          latestBoard={latestBoard}
          onNavigate={onNavigate}
          tacticalBoardCount={tacticalBoardCount}
        />
        <RecentActivityPanel activity={recentActivity} />
        <SeasonObjectivesPanel
          objectives={seasonObjectives}
          onNavigate={onNavigate}
        />
      </section>
    </section>
  )
}

function MissionHeader({ coachName, onNavigate, seasonName, teamIdentity, teamName }) {
  return (
    <header className="mission-header">
      <div className="mission-team-block">
        <TeamBadge identity={teamIdentity} size="header" label={`${teamName} crest`} />
        <div>
          <p className="mission-kicker">Coach HQ</p>
          <h2>{teamName}</h2>
          <span>{seasonName}</span>
        </div>
      </div>

      <div className="mission-header-actions" aria-label="Dashboard actions">
        <button className="mission-action primary" onClick={() => onNavigate('sessions')} type="button">
          Create Session
        </button>
        <button className="mission-action secondary" onClick={() => onNavigate('players')} type="button">
          Add Player
        </button>
        <button className="mission-icon-action" onClick={() => onNavigate('tactics')} type="button">
          TB
        </button>
        <span className="mission-profile-chip">{coachName}</span>
      </div>
    </header>
  )
}

function TodayCoachFocus({
  attentionPlayers,
  attentionSummary,
  coachName,
  nextMatch,
  nextSession,
  onNavigate,
}) {
  return (
    <section className="today-focus-panel" aria-labelledby="today-focus-title">
      <div className="today-focus-heading">
        <div>
          <p className="mission-kicker">Today</p>
          <h2 id="today-focus-title">Today&apos;s Coach Focus</h2>
          <span>Good to see you, {coachName}. Here&apos;s what needs your attention.</span>
        </div>
        <div className="focus-task-count">
          <strong>{attentionPlayers.length}</strong>
          <span>player reviews</span>
        </div>
      </div>

      <div className="focus-columns">
        <article className="focus-column">
          <span className="focus-label">Next Session</span>
          {nextSession ? (
            <>
              <h3>{getSessionTitle(nextSession)}</h3>
              <p>{getSessionDateTime(nextSession)}</p>
              <dl className="focus-facts">
                <div><dt>Topic</dt><dd>{getSessionTopic(nextSession)}</dd></div>
                <div><dt>Duration</dt><dd>{getSessionDuration(nextSession)}</dd></div>
                <div><dt>Status</dt><dd>{getDisplayStatus(nextSession.status)}</dd></div>
              </dl>
              <button className="focus-button" onClick={() => onNavigate('sessions')} type="button">
                Continue Planning
              </button>
            </>
          ) : (
            <>
              <h3>Plan your next session</h3>
              <p>Create a session from squad needs or start from a blank workspace.</p>
              <button className="focus-button" onClick={() => onNavigate('sessions')} type="button">
                Create Session
              </button>
            </>
          )}
        </article>

        <article className="focus-column">
          <span className="focus-label">Players Need Attention</span>
          <h3>{attentionPlayers.length} player{attentionPlayers.length === 1 ? '' : 's'} to review</h3>
          {attentionSummary.length > 0 ? (
            <ul className="focus-reason-list">
              {attentionSummary.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          ) : (
            <p>All player profiles look healthy. Keep adding feedback after training.</p>
          )}
          <button className="focus-button" onClick={() => onNavigate('players')} type="button">
            Review Players
          </button>
        </article>

        <article className="focus-column">
          <span className="focus-label">Next Match</span>
          <h3>{nextMatch.day}</h3>
          <p>{nextMatch.opponent}</p>
          <strong className="match-prep-state">{nextMatch.status}</strong>
          <button className="focus-button disabled" disabled type="button">
            Prepare Match
          </button>
          <small>Match Centre is a safe placeholder for Phase 1.</small>
        </article>
      </div>
    </section>
  )
}

function StatusCard({ detail, icon, label, note, value }) {
  return (
    <article className="mission-status-card">
      <div className="status-card-topline">
        <span>{icon}</span>
        <strong>{label}</strong>
      </div>
      <b>{value}</b>
      <p>{detail}</p>
      <small>{note}</small>
    </article>
  )
}

function PanelHeader({ action, disabled = false, onAction, title }) {
  return (
    <div className="mission-panel-header">
      <h3>{title}</h3>
      {action && (
        <button disabled={disabled} onClick={onAction} type="button">
          {action}
        </button>
      )}
    </div>
  )
}

function NextSessionReadiness({ nextSession, onNavigate, readinessPercentage }) {
  const checklist = nextSession ? getReadinessChecklist(nextSession) : []

  return (
    <article className="mission-panel next-session-panel">
      <PanelHeader
        action={nextSession ? 'Continue Planning' : 'Create Session'}
        onAction={() => onNavigate('sessions')}
        title="Next Session Readiness"
      />

      {nextSession ? (
        <>
          <div className="session-readiness-top">
            <div>
              <span>{getSessionDateTime(nextSession)}</span>
              <h4>{getSessionTitle(nextSession)}</h4>
              <p>{getSessionTopic(nextSession)} - {getSessionDuration(nextSession)} - {getDisplayStatus(nextSession.status)}</p>
            </div>
            <div className="readiness-score">
              <strong>{readinessPercentage}%</strong>
              <span>ready</span>
            </div>
          </div>

          <div className="readiness-meter" style={{ '--readiness-progress': `${readinessPercentage}%` }}>
            <span />
          </div>

          <div className="readiness-checklist">
            {checklist.map((item) => (
              <div className={item.complete ? 'readiness-item complete' : 'readiness-item'} key={item.label}>
                <span>{item.complete ? 'OK' : '--'}</span>
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          action="Create Session"
          onAction={() => onNavigate('sessions')}
          text="Create the next session from squad needs or start from a blank workspace."
          title="Plan your next session"
        />
      )}
    </article>
  )
}

function PlayersAttentionPanel({ attentionPlayers, onNavigate }) {
  return (
    <article className="mission-panel players-attention-panel">
      <PanelHeader action="Open Player Centre" onAction={() => onNavigate('players')} title="Players Need Attention" />

      {attentionPlayers.length > 0 ? (
        <div className="attention-list">
          {attentionPlayers.slice(0, 4).map((player) => (
            <article className="attention-row" key={player.id}>
              <div className="attention-avatar">
                {player.player.avatarDataUrl ? (
                  <img alt="" src={player.player.avatarDataUrl} />
                ) : (
                  <span>{getPlayerInitials(player.player)}</span>
                )}
              </div>
              <div>
                <strong>{player.name}</strong>
                <p>{player.issues[0]}</p>
              </div>
              <small>{player.status === 'Needs Support' ? 'Support' : 'Review'}</small>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          text="Keep adding feedback after training."
          title="All player profiles look healthy."
        />
      )}
    </article>
  )
}

function ThisWeekPanel({ onNavigate, weekSessions }) {
  return (
    <article className="mission-panel this-week-panel">
      <PanelHeader action="Create Session" onAction={() => onNavigate('sessions')} title="This Week" />

      {weekSessions.length > 0 ? (
        <div className="week-list">
          {weekSessions.map((session) => {
            const dateParts = formatDisplayDate(session.date)

            return (
              <article className="week-row" key={session.id || session.sessionTitle}>
                <div className="week-date">
                  <span>{dateParts.weekday}</span>
                  <strong>{dateParts.day}</strong>
                </div>
                <div>
                  <span>{dateParts.label}{getSessionTime(session) ? ` - ${getSessionTime(session)}` : ''}</span>
                  <strong>{getSessionTitle(session)}</strong>
                  <p>{session.sessionType || 'Training'} - {getSessionTopic(session)}</p>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState
          action="Create Session"
          onAction={() => onNavigate('sessions')}
          text="Create a session and it will appear in your weekly coaching rhythm."
          title="No sessions planned this week."
        />
      )}
    </article>
  )
}

function TacticalBoardPanel({ latestBoard, onNavigate, tacticalBoardCount }) {
  return (
    <article className="mission-panel tactical-board-panel">
      <PanelHeader action={latestBoard ? 'Open Board' : 'Create Board'} onAction={() => onNavigate('tactics')} title="Tactical Board" />
      <div className="mission-mini-pitch" aria-hidden="true">
        <span className="pitch-marker home one" />
        <span className="pitch-marker home two" />
        <span className="pitch-marker away one" />
        <span className="pitch-marker away two" />
        <span className="pitch-pass-line" />
      </div>
      {latestBoard ? (
        <div className="support-summary">
          <span>{tacticalBoardCount} board{tacticalBoardCount === 1 ? '' : 's'} saved</span>
          <strong>{latestBoard.title || 'Untitled board'}</strong>
          <p>Updated {formatUpdatedDate(latestBoard.updatedAt || latestBoard.createdAt)}</p>
        </div>
      ) : (
        <EmptyState
          action="Open Tactical Board"
          onAction={() => onNavigate('tactics')}
          text="Create your first tactical board."
          title="Build your tactical library."
        />
      )}
    </article>
  )
}

function RecentActivityPanel({ activity }) {
  return (
    <article className="mission-panel recent-activity-panel">
      <PanelHeader title="Recent Activity" />
      {activity.length > 0 ? (
        <div className="activity-list">
          {activity.map((item) => (
            <article className="activity-row" key={item.id}>
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.meta}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          text="Recent changes will appear here as you build your team."
          title="No recent activity yet."
        />
      )}
    </article>
  )
}

function SeasonObjectivesPanel({ objectives, onNavigate }) {
  return (
    <article className="mission-panel season-objectives-panel">
      <PanelHeader action="Club Setup" onAction={() => onNavigate('clubSetup')} title="Season Objectives" />
      {objectives.length > 0 ? (
        <div className="objective-list">
          {objectives.map((objective) => (
            <article className="objective-row" key={objective.label}>
              <span>{objective.label}</span>
              <strong>{objective.value}</strong>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          action="Open Club Setup"
          onAction={() => onNavigate('clubSetup')}
          text="Set your season direction in Club Setup."
          title="No season direction set yet."
        />
      )}
    </article>
  )
}

function EmptyState({ action, onAction, text, title }) {
  return (
    <div className="mission-empty-state">
      <strong>{title}</strong>
      <p>{text}</p>
      {action && (
        <button onClick={onAction} type="button">
          {action}
        </button>
      )}
    </div>
  )
}

export default Dashboard
