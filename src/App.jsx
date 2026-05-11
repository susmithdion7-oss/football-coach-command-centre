import { useEffect, useState } from 'react'
import { normaliseDiagram } from './components/DiagramPreview.jsx'
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

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value))
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

function buildCopiedBoardNotes(activity, diagramNotes) {
  const noteSections = []

  if (diagramNotes) {
    noteSections.push(diagramNotes)
  }

  if (activity.setup) {
    noteSections.push(`Setup: ${activity.setup}`)
  }

  if (activity.rules) {
    noteSections.push(`Rules / organisation: ${activity.rules}`)
  }

  if (activity.coachingPoints) {
    noteSections.push(`Coaching points: ${activity.coachingPoints}`)
  }

  if (activity.coachNotes) {
    noteSections.push(`Coach notes: ${activity.coachNotes}`)
  }

  return noteSections.join('\n\n')
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [players, setPlayers] = useState(() => getStorageItem('players', []))
  const [sessions, setSessions] = useState(() =>
    getStorageItem('footballCoachSessions', []),
  )
  const [tacticalBoards, setTacticalBoards] = useState(() =>
    getStorageItem('tacticalBoards', []),
  )
  const [activeTacticalBoardId, setActiveTacticalBoardId] = useState(null)
  const [tacticalBoardNotice, setTacticalBoardNotice] = useState('')

  useEffect(() => {
    setStorageItem('players', players)
  }, [players])

  useEffect(() => {
    setStorageItem('footballCoachSessions', sessions)
  }, [sessions])

  useEffect(() => {
    setStorageItem('tacticalBoards', tacticalBoards)
  }, [tacticalBoards])

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

  function addTacticalBoard(board) {
    const now = new Date().toISOString()
    const newBoard = {
      ...board,
      id: createRecordId('board'),
      title: board.title.trim(),
      boardType: board.boardType || 'Training drill',
      pitchLayout: board.pitchLayout || 'fullPitch',
      notes: board.notes || '',
      objects: Array.isArray(board.objects) ? deepCopy(board.objects) : [],
      createdAt: board.createdAt || now,
      updatedAt: now,
    }

    setTacticalBoards((currentBoards) => [...currentBoards, newBoard])
    setActiveTacticalBoardId(newBoard.id)
    return newBoard.id
  }

  function updateTacticalBoard(boardId, updatedBoard) {
    setTacticalBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              ...updatedBoard,
              title: updatedBoard.title.trim(),
              objects: Array.isArray(updatedBoard.objects) ? deepCopy(updatedBoard.objects) : [],
              updatedAt: new Date().toISOString(),
            }
          : board,
      ),
    )
    setActiveTacticalBoardId(boardId)
  }

  function deleteTacticalBoard(boardId) {
    setTacticalBoards((currentBoards) => currentBoards.filter((board) => board.id !== boardId))

    if (activeTacticalBoardId === boardId) {
      setActiveTacticalBoardId(null)
    }
  }

  function duplicateTacticalBoard(boardId) {
    const boardToCopy = tacticalBoards.find((board) => board.id === boardId)

    if (!boardToCopy) {
      return null
    }

    const now = new Date().toISOString()
    const copiedBoard = {
      ...boardToCopy,
      id: createRecordId('board'),
      title: `${boardToCopy.title} copy`,
      objects: deepCopy(boardToCopy.objects || []),
      createdAt: now,
      updatedAt: now,
    }

    setTacticalBoards((currentBoards) => [...currentBoards, copiedBoard])
    setActiveTacticalBoardId(copiedBoard.id)
    return copiedBoard.id
  }

  function copyActivityDiagramToTacticalBoard({ activity, diagram, sessionTitle }) {
    const safeDiagram = normaliseDiagram(diagram, `${activity.name} diagram`)

    if (safeDiagram.objects.length === 0) {
      return null
    }

    const titleParts = [sessionTitle || 'Session', activity.name || 'Activity']
    const copiedBoardId = addTacticalBoard({
      title: titleParts.join(' - '),
      boardType: 'Training drill',
      pitchLayout: safeDiagram.pitchLayout,
      notes: buildCopiedBoardNotes(activity, safeDiagram.notes),
      objects: deepCopy(safeDiagram.objects),
    })

    setTacticalBoardNotice('Copied to Tactical Board.')
    setActivePage('tactics')
    return copiedBoardId
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
            tacticalBoardCount={tacticalBoards.length}
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
            onCopyDiagramToBoard={copyActivityDiagramToTacticalBoard}
            onDeleteSession={deleteSession}
            onDuplicateSession={duplicateSession}
            onUpdateSession={updateSession}
            sessions={sessions}
          />
        )}
        {activePage === 'tactics' && (
          <TacticalBoard
            activeBoardId={activeTacticalBoardId}
            boards={tacticalBoards}
            notice={tacticalBoardNotice}
            onAddBoard={addTacticalBoard}
            onClearNotice={() => setTacticalBoardNotice('')}
            onDeleteBoard={deleteTacticalBoard}
            onDuplicateBoard={duplicateTacticalBoard}
            onSelectBoard={setActiveTacticalBoardId}
            onUpdateBoard={updateTacticalBoard}
          />
        )}
      </main>
    </div>
  )
}

export default App
