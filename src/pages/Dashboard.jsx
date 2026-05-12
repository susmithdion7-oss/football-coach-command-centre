import TeamBadge from '../components/TeamBadge.jsx'

function formatDisplayDate(dateValue) {
  if (!dateValue) {
    return { day: '--', month: 'TBC', weekday: 'TBC' }
  }

  const date = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return { day: '--', month: 'TBC', weekday: 'TBC' }
  }

  return {
    day: new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date).toUpperCase(),
    weekday: new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(date).toUpperCase(),
  }
}

function formatFriendlyDate(dateValue) {
  if (!dateValue) {
    return 'Date to be confirmed'
  }

  const date = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return 'Date to be confirmed'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatUpdatedDate(dateValue) {
  if (!dateValue) {
    return 'Not saved yet'
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return 'Not saved yet'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getSessionTopic(session) {
  return session.primaryTopic || session.mainMoment || 'No topic set'
}

function getSessionMeta(session) {
  const duration = session.duration ? `${session.duration}` : 'Duration TBC'
  const players = session.numberOfPlayers ? `${session.numberOfPlayers} players` : 'Players TBC'
  return `${duration} - ${players}`
}

function getLatestBoard(tacticalBoards = []) {
  return [...tacticalBoards].sort((firstBoard, secondBoard) => {
    const firstDate = new Date(firstBoard.updatedAt || firstBoard.createdAt || 0).getTime()
    const secondDate = new Date(secondBoard.updatedAt || secondBoard.createdAt || 0).getTime()
    return secondDate - firstDate
  })[0]
}

function getDevelopmentPlayers(players = []) {
  const placeholderProgress = [12, 8, 5, 4]

  return players.slice(0, 4).map((player, index) => ({
    id: player.id,
    name: player.fullName || 'Player',
    position: player.mainPosition || player.secondaryPosition || 'Squad player',
    progress: placeholderProgress[index] || 3,
  }))
}

function Dashboard({
  nextSession,
  onNavigate,
  playerCount,
  recentPastSession,
  sessionCount,
  tacticalBoardCount,
  tacticalBoards = [],
  teamIdentity,
  upcomingSessions,
}) {
  const hasUpcomingSessions = upcomingSessions.length > 0
  const coachName = teamIdentity?.coachName || 'Coach'
  const teamName = teamIdentity?.teamName || 'your team'
  const seasonName = teamIdentity?.seasonName || 'Current season'
  const teamGoal = teamIdentity?.teamGoal
  const teamMotto = teamIdentity?.teamMotto
  const playingStyle = teamIdentity?.playingStyle || 'Balanced'
  const latestBoard = getLatestBoard(tacticalBoards)
  const developmentPlayers = getDevelopmentPlayers([])
  const realDevelopmentPlayers = getDevelopmentPlayers(arguments[0]?.players || [])
  const visibleDevelopmentPlayers = realDevelopmentPlayers.length > 0 ? realDevelopmentPlayers : developmentPlayers
  const nextSessionDate = formatDisplayDate(nextSession?.date)
  const nextMatchLabel = teamIdentity?.matchDay || 'Match day TBC'

  return (
    <section className="coach-hq-dashboard">
      <section className="coach-hero-card">
        <div className="coach-hero-copy">
          <p className="section-kicker">{seasonName} Coach HQ</p>
          <h3>Welcome back, {coachName}</h3>
          <p>Here&apos;s what&apos;s happening at {teamName} today.</p>
          {(teamMotto || teamGoal) && (
            <div className="coach-hero-message">
              {teamMotto && <strong>&quot;{teamMotto}&quot;</strong>}
              {teamGoal && <span>Season goal: {teamGoal}</span>}
            </div>
          )}
        </div>
        <div className="coach-hero-identity">
          <TeamBadge identity={teamIdentity} size="hero" label={`${teamName} crest`} />
          <span>{playingStyle}</span>
        </div>
      </section>

      <section className="hq-stat-grid" aria-label="Coach HQ summary">
        <StatCard eyebrow="Squad Size" value={playerCount} detail="Players" note="Saved squad profiles" icon="PL" />
        <StatCard eyebrow="Upcoming Sessions" value={upcomingSessions.length} detail="Planned" note={`${sessionCount} saved total`} icon="SP" />
        <StatCard eyebrow="Next Match" value={nextSession ? nextSessionDate.day : '--'} detail={nextMatchLabel} note="Match Centre coming soon" icon="MC" />
        <StatCard eyebrow="Availability" value="82%" detail="Squad available" note="Placeholder preview" icon="AV" />
        <StatCard eyebrow="Player Progress" value={playerCount > 0 ? '+8%' : '0%'} detail="Avg. improvement" note="Development module preview" icon="PG" />
      </section>

      <div className="hq-main-grid">
        <section className="hq-card hq-upcoming-card">
          <SectionHeader title="Upcoming Sessions" action="Open Planner" onAction={() => onNavigate('sessions')} />
          {hasUpcomingSessions ? (
            <div className="hq-session-list">
              {upcomingSessions.map((session) => {
                const dateParts = formatDisplayDate(session.date)
                return (
                  <article className="hq-session-row" key={session.id}>
                    <div className="hq-date-block">
                      <span>{dateParts.weekday}</span>
                      <strong>{dateParts.day}</strong>
                      <small>{dateParts.month}</small>
                    </div>
                    <div>
                      <span>{getSessionTopic(session)}</span>
                      <strong>{session.sessionTitle}</strong>
                      <small>{getSessionMeta(session)}</small>
                    </div>
                    <span className="hq-status-badge">{session.status || 'Draft'}</span>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="hq-empty-state">
              <strong>Plan your first session</strong>
              <p>Build a structured training plan and it will appear here.</p>
              {recentPastSession && <small>Most recent: {recentPastSession.sessionTitle}</small>}
              <button type="button" onClick={() => onNavigate('sessions')}>Create Session</button>
            </div>
          )}
        </section>

        <section className="hq-card hq-match-card">
          <SectionHeader title="Next Match" action="Match Centre" disabled />
          <div className="match-preview-panel">
            <div>
              <TeamBadge identity={teamIdentity} size="large" label={`${teamName} crest`} />
              <strong>{teamName}</strong>
              <span>{teamIdentity?.ageGroup || teamIdentity?.teamType || 'Team'}</span>
            </div>
            <b>VS</b>
            <div>
              <div className="opponent-badge">OP</div>
              <strong>Opponent TBC</strong>
              <span>Future Match Centre</span>
            </div>
          </div>
          <div className="match-meta-row">
            <span>{nextMatchLabel}</span>
            <span>Kick-off TBC</span>
            <span>{teamIdentity?.homeVenue || 'Venue TBC'}</span>
          </div>
          <button className="outline-action" disabled type="button">View Match Centre</button>
        </section>

        <section className="hq-card hq-development-card">
          <SectionHeader title="Recent Player Development" action="Open Players" onAction={() => onNavigate('players')} />
          {visibleDevelopmentPlayers.length > 0 ? (
            <div className="development-list">
              {visibleDevelopmentPlayers.map((player) => (
                <article className="development-row" key={player.id || player.name}>
                  <div className="development-avatar">{player.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <strong>{player.name}</strong>
                    <span>{player.position}</span>
                    <div className="development-bar"><span style={{ width: `${Math.min(player.progress * 4, 90)}%` }} /></div>
                  </div>
                  <b>+{player.progress}%</b>
                </article>
              ))}
            </div>
          ) : (
            <div className="hq-empty-state compact">
              <strong>Add players to start tracking development</strong>
              <p>Player progress is a visual preview until the development module is built.</p>
            </div>
          )}
        </section>
      </div>

      <div className="hq-lower-grid">
        <section className="hq-card tactical-preview-card">
          <SectionHeader title="Tactical Board" action="Open Boards" onAction={() => onNavigate('tactics')} />
          <div className="mini-pitch-preview" aria-hidden="true">
            <span className="pitch-dot home one" />
            <span className="pitch-dot home two" />
            <span className="pitch-dot away one" />
            <span className="pitch-dot away two" />
            <span className="pitch-line-preview" />
          </div>
          <div className="board-summary-row">
            <span>Latest board</span>
            <strong>{latestBoard?.title || 'Build your tactical library'}</strong>
            <small>{latestBoard ? `Updated: ${formatUpdatedDate(latestBoard.updatedAt || latestBoard.createdAt)}` : `${tacticalBoardCount} boards saved`}</small>
          </div>
          <button className="outline-action" type="button" onClick={() => onNavigate('tactics')}>Open Tactical Board</button>
        </section>

        <section className="hq-card announcements-card">
          <SectionHeader title="Club Announcements" action="Coming soon" disabled />
          <AnnouncementItem title="Training Tonight" detail="Bring boots, water, and full training kit." />
          <AnnouncementItem title="Match Day Reminder" detail="Arrive 45 minutes before kick-off when fixtures are added." />
          <AnnouncementItem title="Equipment Reminder" detail="Cones, bibs, balls, and mini goals checklist preview." />
        </section>

        <section className="hq-card quick-actions-card">
          <SectionHeader title="Quick Actions" />
          <div className="hq-action-grid">
            <button type="button" onClick={() => onNavigate('players')}>Add Player</button>
            <button type="button" onClick={() => onNavigate('sessions')}>Create Session</button>
            <button type="button" onClick={() => onNavigate('tactics')}>Open Tactical Board</button>
            <button disabled type="button">Add Fixture</button>
            <button disabled type="button">Record Availability</button>
            <button disabled type="button">View Reports</button>
          </div>
        </section>
      </div>
    </section>
  )
}

function StatCard({ detail, eyebrow, icon, note, value }) {
  return (
    <article className="hq-stat-card">
      <div className="stat-topline">
        <span>{icon}</span>
        <strong>{eyebrow}</strong>
      </div>
      <b>{value}</b>
      <p>{detail}</p>
      <small>{note}</small>
    </article>
  )
}

function SectionHeader({ action, disabled = false, onAction, title }) {
  return (
    <div className="hq-section-header">
      <h3>{title}</h3>
      {action && (
        <button disabled={disabled} onClick={onAction} type="button">
          {action}
        </button>
      )}
    </div>
  )
}

function AnnouncementItem({ detail, title }) {
  return (
    <article className="announcement-item">
      <div>!</div>
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
    </article>
  )
}

export default Dashboard
