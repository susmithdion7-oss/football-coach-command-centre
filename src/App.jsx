import { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import Players from './pages/Players.jsx'
import SessionPlanner from './pages/SessionPlanner.jsx'
import TacticalBoard from './pages/TacticalBoard.jsx'
import { getStorageItem, setStorageItem } from './utils/storage.js'

const pages = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'players', label: 'Players' },
  { id: 'sessions', label: 'Session Planner' },
  { id: 'tactics', label: 'Tactical Board' },
]

function createRecordId(prefix) {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${prefix}-${Date.now()}`
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

function getDashboardSessionSummary(sessions) {
  const today = getTodayDate()
  const datedSessions = sortSessionsByDate(sessions).filter((session) =>
    parseSessionDate(session),
  )
  const upcomingSessions = datedSessions
    .filter((session) => parseSessionDate(session) >= today)
    .slice(0, 3)
  const recentPastSession = [...datedSessions]
    .reverse()
    .find((session) => parseSessionDate(session) < today)

  return {
    nextSession: upcomingSessions[0],
    recentPastSession,
    upcomingSessions,
  }
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [players, setPlayers] = useState(() => getStorageItem('players', []))
  const [sessions, setSessions] = useState(() =>
    getStorageItem('footballCoachSessions', []),
  )

  useEffect(() => {
    setStorageItem('players', players)
  }, [players])

  useEffect(() => {
    setStorageItem('footballCoachSessions', sessions)
  }, [sessions])

  const pageTitle = pages.find((page) => page.id === activePage)?.label
  const { nextSession, recentPastSession, upcomingSessions } =
    getDashboardSessionSummary(sessions)

  function addPlayer(player) {
    const newPlayer = {
      ...player,
      id: createRecordId('player'),
      createdAt: new Date().toISOString(),
    }

    setPlayers((currentPlayers) => [...currentPlayers, newPlayer])
    return newPlayer.id
  }

  function updatePlayer(playerId, updatedPlayer) {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === playerId ? { ...player, ...updatedPlayer } : player,
      ),
    )
  }

  function deletePlayer(playerId) {
    setPlayers((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== playerId),
    )
  }

  function addSession(session) {
    const newSession = {
      ...session,
      id: createRecordId('session'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setSessions((currentSessions) => [...currentSessions, newSession])
    return newSession.id
  }

  function updateSession(sessionId, updatedSession) {
    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === sessionId
          ? { ...session, ...updatedSession, updatedAt: new Date().toISOString() }
          : session,
      ),
    )
  }

  function deleteSession(sessionId) {
    setSessions((currentSessions) =>
      currentSessions.filter((session) => session.id !== sessionId),
    )
  }

  function duplicateSession(sessionId) {
    const sessionToCopy = sessions.find((session) => session.id === sessionId)

    if (!sessionToCopy) {
      return null
    }

    const copiedSession = {
      ...sessionToCopy,
      id: createRecordId('session'),
      sessionTitle: `${sessionToCopy.sessionTitle} copy`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setSessions((currentSessions) => [...currentSessions, copiedSession])
    return copiedSession.id
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">FC</div>
          <div>
            <p className="brand-kicker">Coach Command</p>
            <h1>Centre</h1>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {pages.map((page) => (
            <button
              className={activePage === page.id ? 'nav-item active' : 'nav-item'}
              key={page.id}
              onClick={() => setActivePage(page.id)}
              type="button"
            >
              {page.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="section-kicker">Version 0.1 foundation</p>
            <h2>{pageTitle}</h2>
          </div>
          <span className="status-pill">Local only</span>
        </header>

        {activePage === 'dashboard' && (
          <Dashboard
            nextSession={nextSession}
            onNavigate={setActivePage}
            playerCount={players.length}
            recentPastSession={recentPastSession}
            sessionCount={sessions.length}
            upcomingSessions={upcomingSessions}
          />
        )}
        {activePage === 'players' && (
          <Players
            players={players}
            onAddPlayer={addPlayer}
            onDeletePlayer={deletePlayer}
            onUpdatePlayer={updatePlayer}
          />
        )}
        {activePage === 'sessions' && (
          <SessionPlanner
            onAddSession={addSession}
            onDeleteSession={deleteSession}
            onDuplicateSession={duplicateSession}
            onUpdateSession={updateSession}
            sessions={sessions}
          />
        )}
        {activePage === 'tactics' && <TacticalBoard />}
      </main>
    </div>
  )
}

export default App
