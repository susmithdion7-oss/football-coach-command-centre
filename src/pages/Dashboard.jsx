function Dashboard({ latestSession, onNavigate, playerCount, sessionCount }) {
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
          <span>Tactical board</span>
          <strong>Ready</strong>
          <p>The page exists as a placeholder for now.</p>
        </article>
      </div>

      {latestSession && (
        <article className="latest-session-card">
          <div>
            <p className="section-kicker">Latest saved session</p>
            <h3>{latestSession.sessionTitle}</h3>
            <p>
              {latestSession.date || 'No date set'} - {latestSession.primaryTopic || 'No topic set'} -{' '}
              {latestSession.status || 'Draft'}
            </p>
          </div>
          <button type="button" onClick={() => onNavigate('sessions')}>
            Open Session Planner
          </button>
        </article>
      )}

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
