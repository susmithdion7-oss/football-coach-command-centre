import TeamBadge from '../components/TeamBadge.jsx'

function Dashboard({
  nextSession,
  onNavigate,
  playerCount,
  recentPastSession,
  sessionCount,
  tacticalBoardCount,
  teamIdentity,
  upcomingSessions,
}) {
  const hasUpcomingSessions = upcomingSessions.length > 0
  const coachName = teamIdentity?.coachName || 'Coach'
  const teamName = teamIdentity?.teamName || 'your team'
  const teamGoal = teamIdentity?.teamGoal
  const teamMotto = teamIdentity?.teamMotto

  return (
    <section className="page-stack">
      <div className="welcome-panel team-welcome-panel">
        <div className="dashboard-team-intro">
          <TeamBadge identity={teamIdentity} size="hero" label={`${teamName} crest`} />
          <div>
            <p className="section-kicker">Good to see you, {coachName}</p>
            <h3>{teamName} Coach HQ is ready.</h3>
            <p>
              Plan the week, track your squad, build sessions, and prepare tactical
              ideas from one calm team workspace.
            </p>
          </div>
        </div>

        {(teamGoal || teamMotto) && (
          <div className="team-dashboard-identity">
            {teamMotto && <strong>"{teamMotto}"</strong>}
            {teamGoal && <p>Season goal: {teamGoal}</p>}
          </div>
        )}
      </div>

      <div className="stats-grid" aria-label="Dashboard summary">
        <article className="stat-card">
          <span>Total players</span>
          <strong>{playerCount}</strong>
          <p>Saved locally in this browser.</p>
        </article>
        <article className="stat-card">
          <span>Saved sessions</span>
          <strong>{sessionCount}</strong>
          <p>Structured plans saved locally.</p>
        </article>
        <article className="stat-card">
          <span>Tactical boards</span>
          <strong>{tacticalBoardCount}</strong>
          <p>Standalone diagrams saved locally.</p>
        </article>
      </div>

      <section className="dashboard-sessions-card">
        <div className="dashboard-sessions-header">
          <div>
            <p className="section-kicker">
              {nextSession ? 'Next session' : 'Session schedule'}
            </p>
            {nextSession ? (
              <>
                <h3>{nextSession.sessionTitle}</h3>
                <p>
                  {nextSession.date} - {nextSession.primaryTopic || 'No topic set'} -{' '}
                  {nextSession.status || 'Draft'}
                </p>
              </>
            ) : (
              <>
                <h3>No upcoming sessions planned.</h3>
                {recentPastSession && (
                  <p>
                    Most recent session: {recentPastSession.sessionTitle} -{' '}
                    {recentPastSession.date}
                  </p>
                )}
              </>
            )}
          </div>
          <button type="button" onClick={() => onNavigate('sessions')}>
            Open Session Planner
          </button>
        </div>

        {hasUpcomingSessions && (
          <div className="upcoming-session-list">
            <span>Upcoming sessions</span>
            {upcomingSessions.map((session) => (
              <div className="upcoming-session-item" key={session.id}>
                <strong>{session.date}</strong>
                <div>
                  <p>{session.sessionTitle}</p>
                  <small>{session.primaryTopic || 'No topic set'}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="quick-actions">
        <button type="button" onClick={() => onNavigate('players')}>
          Open Players
        </button>
        <button type="button" onClick={() => onNavigate('sessions')}>
          Open Session Planner
        </button>
        <button type="button" onClick={() => onNavigate('tactics')}>
          Open Tactical Board
        </button>
        <button type="button" onClick={() => onNavigate('clubSetup')}>
          Edit Club Setup
        </button>
      </div>
    </section>
  )
}

export default Dashboard
