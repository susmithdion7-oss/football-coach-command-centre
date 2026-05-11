import { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import Players from './pages/Players.jsx'
import SessionPlanner from './pages/SessionPlanner.jsx'
import TacticalBoard from './pages/TacticalBoard.jsx'

const pages = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'players', label: 'Players' },
  { id: 'sessions', label: 'Session Planner' },
  { id: 'tactics', label: 'Tactical Board' },
]

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const pageTitle = pages.find((page) => page.id === activePage)?.label

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

        {activePage === 'dashboard' && <Dashboard onNavigate={setActivePage} />}
        {activePage === 'players' && <Players />}
        {activePage === 'sessions' && <SessionPlanner />}
        {activePage === 'tactics' && <TacticalBoard />}
      </main>
    </div>
  )
}

export default App
