function Dashboard({
  nextSession,
  onNavigate,
  playerCount,
  recentPastSession,
  sessionCount,
  tacticalBoardCount,
  upcomingSessions,
}) {
  const hasUpcomingSessions = upcomingSessions.length > 0

  return (
    <section className="page-stack">
      <div className="welcome-panel">
        <div>
          <p className="section-kicker">Coach-only workspace</p>
          <h3>Plan the week from one simple place.</h3>
          <p>
            This foundation is ready for the core version 0.1 workflow:
            players, sessions, a basic tactical board, and later PDF export.
          </p>
        </div>
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
      </div>
    </section>
  )
}

export default Dashboard
