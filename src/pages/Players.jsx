import { useEffect, useMemo, useRef, useState } from 'react'
import { getStorageItem, removeStorageItem, setStorageItem } from '../utils/storage.js'

const playerStatuses = ['Improving', 'On Track', 'Stable', 'Needs Support', 'Injured', 'Returning']

const emptyPlayer = {
  fullName: '',
  shirtNumber: '',
  age: '',
  mainPosition: '',
  secondaryPosition: '',
  preferredFoot: 'Right',
  status: 'On Track',
  developmentFocus: '',
  technicalRating: '5',
  physicalRating: '5',
  tacticalRating: '5',
  mentalRating: '5',
  strengths: '',
  areasToImprove: '',
  coachNotes: '',
}

const emptyPlayerSnapshot = JSON.stringify(emptyPlayer)
const playerDraftKey = 'playerDraft'

const ratingFields = [
  { key: 'technical', name: 'technicalRating', label: 'Technical' },
  { key: 'physical', name: 'physicalRating', label: 'Physical' },
  { key: 'tactical', name: 'tacticalRating', label: 'Tactical understanding' },
  { key: 'mental', name: 'mentalRating', label: 'Mentality / attitude' },
]

function getPlayerForForm(player = {}) {
  return { ...emptyPlayer, ...player }
}

function getPlayerSnapshot(player) {
  return JSON.stringify(getPlayerForForm(player))
}

function getDraftInitialState(players) {
  const draft = getStorageItem(playerDraftKey, null)

  if (draft?.formData) {
    const restoredFormData = getPlayerForForm(draft.formData)
    const restoredSnapshot = getPlayerSnapshot(restoredFormData)
    const savedSnapshot = draft.savedSnapshot || emptyPlayerSnapshot
    const restoredMode = draft.formMode === 'edit' ? 'edit' : 'add'

    if (restoredSnapshot !== emptyPlayerSnapshot || draft.selectedPlayerId) {
      return {
        formData: restoredFormData,
        formMode: restoredMode,
        restored: true,
        savedSnapshot,
        selectedPlayerId: draft.selectedPlayerId ?? null,
      }
    }
  }

  return {
    formData: emptyPlayer,
    formMode: 'view',
    restored: false,
    savedSnapshot: emptyPlayerSnapshot,
    selectedPlayerId: players[0]?.id ?? null,
  }
}

function getPlayerName(player) {
  return player.fullName || player.name || 'Unnamed player'
}

function getPlayerInitials(player) {
  const nameParts = getPlayerName(player).split(' ').filter(Boolean)

  if (nameParts.length === 0) {
    return 'PL'
  }

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase()
  }

  return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
}

function getPlayerStatus(player) {
  return player.status || 'On Track'
}

function getRatingValue(player, key) {
  const ratingMap = {
    technical: player.technicalRating,
    physical: player.physicalRating,
    tactical: player.tacticalRating || player.tacticalUnderstandingRating,
    mental: player.mentalRating || player.mentalityRating,
  }
  const value = Number(ratingMap[key])
  return Number.isFinite(value) ? value : null
}

function getAverageRating(player) {
  const ratings = ratingFields
    .map((field) => getRatingValue(player, field.key))
    .filter((value) => value !== null)

  if (ratings.length === 0) {
    return null
  }

  return ratings.reduce((total, value) => total + value, 0) / ratings.length
}

function getSquadAverageRating(players) {
  const averages = players
    .map((player) => getAverageRating(player))
    .filter((value) => value !== null)

  if (averages.length === 0) {
    return null
  }

  return averages.reduce((total, value) => total + value, 0) / averages.length
}

function getPositionGroup(position = '') {
  const normalisedPosition = position.toLowerCase()

  if (normalisedPosition.includes('gk') || normalisedPosition.includes('goal')) {
    return 'GK'
  }

  if (normalisedPosition.includes('def') || normalisedPosition.includes('back')) {
    return 'DEF'
  }

  if (normalisedPosition.includes('mid') || normalisedPosition.includes('wing')) {
    return 'MID'
  }

  if (normalisedPosition.includes('fwd') || normalisedPosition.includes('for') || normalisedPosition.includes('striker')) {
    return 'FWD'
  }

  return position || 'No position set'
}

function getPositionOptions(players) {
  const customPositions = [...new Set(players.map((player) => player.mainPosition).filter(Boolean))]
  return ['All positions', 'GK', 'DEF', 'MID', 'FWD', ...customPositions]
}

function playerMatchesPosition(player, positionFilter) {
  if (positionFilter === 'All positions') {
    return true
  }

  const playerPosition = player.mainPosition || ''
  const positionGroup = getPositionGroup(playerPosition)

  if (['GK', 'DEF', 'MID', 'FWD'].includes(positionFilter)) {
    return positionGroup === positionFilter
  }

  return playerPosition === positionFilter
}

function truncateText(value, maxLength = 150) {
  if (!value) {
    return ''
  }

  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength).trim()}...`
}

function getWatchlistItems(players) {
  const items = []

  players.forEach((player) => {
    const averageRating = getAverageRating(player)
    const status = getPlayerStatus(player)

    if (status === 'Needs Support') {
      items.push({ player, reason: 'Needs support status' })
      return
    }

    if (!player.mainPosition) {
      items.push({ player, reason: 'Main position missing' })
      return
    }

    if (!player.developmentFocus) {
      items.push({ player, reason: 'No development focus set' })
      return
    }

    if (!player.coachNotes) {
      items.push({ player, reason: 'Needs coach notes' })
      return
    }

    if (averageRating !== null && averageRating <= 4) {
      items.push({ player, reason: 'Low average rating' })
    }
  })

  return items.slice(0, 5)
}

function Players({ players, onAddPlayer, onDeletePlayer, onUpdatePlayer }) {
  const [initialDraftState] = useState(() => getDraftInitialState(players))
  const [selectedPlayerId, setSelectedPlayerId] = useState(initialDraftState.selectedPlayerId)
  const [formMode, setFormMode] = useState(initialDraftState.formMode)
  const [formData, setFormData] = useState(initialDraftState.formData)
  const [message, setMessage] = useState(initialDraftState.restored ? 'Draft restored.' : '')
  const [draftStatus, setDraftStatus] = useState(initialDraftState.restored ? 'Unsaved changes' : '')
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('All positions')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const savedSnapshotRef = useRef(initialDraftState.savedSnapshot)
  const currentSnapshot = getPlayerSnapshot(formData)
  const hasUnsavedChanges =
    currentSnapshot !== savedSnapshotRef.current &&
    (currentSnapshot !== emptyPlayerSnapshot || formMode === 'edit')

  const positionOptions = useMemo(() => getPositionOptions(players), [players])
  const filteredPlayers = useMemo(() => {
    const normalisedSearch = searchTerm.trim().toLowerCase()

    return players.filter((player) => {
      const name = getPlayerName(player).toLowerCase()
      const shirtNumber = String(player.shirtNumber || '').toLowerCase()
      const matchesSearch =
        !normalisedSearch ||
        name.includes(normalisedSearch) ||
        shirtNumber.includes(normalisedSearch)
      const matchesPosition = playerMatchesPosition(player, positionFilter)
      const matchesStatus =
        statusFilter === 'All statuses' || getPlayerStatus(player) === statusFilter

      return matchesSearch && matchesPosition && matchesStatus
    })
  }, [players, positionFilter, searchTerm, statusFilter])

  const selectedPlayer = useMemo(
    () => players.find((player) => player.id === selectedPlayerId),
    [players, selectedPlayerId],
  )

  const squadAverageRating = getSquadAverageRating(players)
  const watchlistItems = getWatchlistItems(players)
  const recentNotes = players
    .filter((player) => player.coachNotes)
    .slice(0, 4)
  const overviewStats = [
    { label: 'Total Players', value: players.length, detail: 'Squad size', icon: 'PL' },
    {
      label: 'Improving',
      value: players.filter((player) => getPlayerStatus(player) === 'Improving').length,
      detail: 'Marked as improving',
      icon: 'UP',
    },
    {
      label: 'On Track',
      value: players.filter((player) => getPlayerStatus(player) === 'On Track').length,
      detail: 'Default healthy status',
      icon: 'OK',
    },
    {
      label: 'Needs Support',
      value: players.filter((player) => getPlayerStatus(player) === 'Needs Support').length,
      detail: 'Coach attention needed',
      icon: 'NS',
    },
    {
      label: 'No Position Set',
      value: players.filter((player) => !player.mainPosition).length,
      detail: 'Profiles to complete',
      icon: 'NP',
    },
    {
      label: 'Average Rating',
      value: squadAverageRating === null ? '--' : squadAverageRating.toFixed(1),
      detail: 'Across saved ratings',
      icon: 'AR',
    },
  ]

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return
    }

    setStorageItem(playerDraftKey, {
      formData,
      formMode,
      lastDraftSavedAt: new Date().toISOString(),
      savedSnapshot: savedSnapshotRef.current,
      selectedPlayerId,
    })
    setDraftStatus('Draft saved automatically')
  }, [formData, formMode, hasUnsavedChanges, selectedPlayerId])

  useEffect(() => {
    if (formMode !== 'view') {
      return
    }

    if (selectedPlayerId && players.some((player) => player.id === selectedPlayerId)) {
      return
    }

    setSelectedPlayerId(filteredPlayers[0]?.id ?? players[0]?.id ?? null)
  }, [filteredPlayers, formMode, players, selectedPlayerId])

  function confirmDiscardUnsaved(messageText) {
    return !hasUnsavedChanges || window.confirm(messageText)
  }

  function setCleanPlayerForm(nextFormData, nextSelectedPlayerId, nextFormMode, nextMessage) {
    const normalisedForm = getPlayerForForm(nextFormData)
    savedSnapshotRef.current = getPlayerSnapshot(normalisedForm)
    setSelectedPlayerId(nextSelectedPlayerId)
    setFormData(normalisedForm)
    setFormMode(nextFormMode)
    setDraftStatus('')
    setMessage(nextMessage)
  }

  function clearPlayerDraft() {
    removeStorageItem(playerDraftKey)
    setDraftStatus('')
  }

  function handleChange(event) {
    const { name, value } = event.target
    setMessage('')
    setDraftStatus('Unsaved changes')
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formData.fullName.trim()) {
      setMessage('Please add a player name before saving.')
      return
    }

    const now = new Date().toISOString()
    const cleanPlayer = {
      ...formData,
      fullName: formData.fullName.trim(),
      shirtNumber: String(formData.shirtNumber || '').trim(),
      age: String(formData.age || '').trim(),
      mainPosition: formData.mainPosition.trim(),
      secondaryPosition: formData.secondaryPosition.trim(),
      status: formData.status || 'On Track',
      developmentFocus: formData.developmentFocus.trim(),
      strengths: formData.strengths.trim(),
      areasToImprove: formData.areasToImprove.trim(),
      coachNotes: formData.coachNotes.trim(),
      updatedAt: now,
    }

    if (formMode === 'edit' && selectedPlayer) {
      onUpdatePlayer(selectedPlayer.id, cleanPlayer)
      clearPlayerDraft()
      setCleanPlayerForm(cleanPlayer, selectedPlayer.id, 'view', 'Player updated and saved locally.')
      setDraftStatus('Saved')
      return
    }

    const newPlayerId = onAddPlayer(cleanPlayer)
    clearPlayerDraft()
    setCleanPlayerForm(emptyPlayer, newPlayerId, 'view', 'Player created and saved locally.')
    setDraftStatus('Saved')
  }

  function startAddingPlayer() {
    if (!confirmDiscardUnsaved('You have unsaved player changes. Do you want to discard them and start a new player?')) {
      return
    }

    clearPlayerDraft()
    setCleanPlayerForm(emptyPlayer, selectedPlayerId, 'add', 'New player form ready.')
  }

  function selectPlayer(playerId) {
    if (!confirmDiscardUnsaved('You have unsaved player changes. Do you want to discard them and view another player?')) {
      return
    }

    clearPlayerDraft()
    setCleanPlayerForm(emptyPlayer, playerId, 'view', '')
  }

  function startEditingPlayer() {
    if (!selectedPlayer || !confirmDiscardUnsaved('You have unsaved player changes. Do you want to discard them and edit this player?')) {
      return
    }

    clearPlayerDraft()
    setCleanPlayerForm(getPlayerForForm(selectedPlayer), selectedPlayer.id, 'edit', '')
  }

  function cancelEditor() {
    if (!confirmDiscardUnsaved('You have unsaved player changes. Do you want to discard them and close the editor?')) {
      return
    }

    clearPlayerDraft()
    setCleanPlayerForm(emptyPlayer, selectedPlayer?.id ?? null, 'view', '')
  }

  function discardDraft() {
    const shouldDiscard = window.confirm('Discard the current unsaved player draft?')

    if (!shouldDiscard) {
      return
    }

    clearPlayerDraft()
    setCleanPlayerForm(emptyPlayer, selectedPlayer?.id ?? null, 'view', 'Draft discarded.')
  }

  function clearFilters() {
    setSearchTerm('')
    setPositionFilter('All positions')
    setStatusFilter('All statuses')
  }

  function handleDeletePlayer() {
    if (!selectedPlayer) {
      return
    }

    const shouldDelete = window.confirm(`Delete ${getPlayerName(selectedPlayer)}?`)

    if (!shouldDelete) {
      return
    }

    clearPlayerDraft()
    onDeletePlayer(selectedPlayer.id)
    const nextPlayer = players.find((player) => player.id !== selectedPlayer.id)
    setCleanPlayerForm(
      emptyPlayer,
      nextPlayer?.id ?? null,
      'view',
      nextPlayer ? 'Player deleted.' : 'Player deleted. Add your next player when ready.',
    )
  }

  return (
    <section className="players-page squad-hub-page">
      <div className="squad-hub-header">
        <div>
          <p className="section-kicker">Players</p>
          <h3>Squad Hub</h3>
          <p>Build, track and develop your squad without turning player management into a database chore.</p>
        </div>
        <button className="primary-button" type="button" onClick={startAddingPlayer}>
          Add Player
        </button>
      </div>

      {(message || draftStatus) && <p className="form-message squad-hub-message">{message || draftStatus}</p>}

      <section className="squad-hero-card">
        <div>
          <span>Squad development workspace</span>
          <h4>Build confident players. Track growth with clarity.</h4>
          <p>Search your squad, open a player snapshot, and keep coach notes close to the work you do every week.</p>
        </div>
        <div className="squad-hero-badge">
          <strong>{players.length}</strong>
          <span>saved players</span>
        </div>
      </section>

      <section className="squad-overview-grid" aria-label="Squad overview">
        {overviewStats.map((stat) => (
          <article className="squad-stat-card" key={stat.label}>
            <span>{stat.icon}</span>
            <div>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
              <small>{stat.detail}</small>
            </div>
          </article>
        ))}
      </section>

      {players.length === 0 ? (
        <section className="squad-empty-state">
          <p className="section-kicker">Start your squad</p>
          <h3>Build your first squad</h3>
          <p>Add your first player to start tracking development, notes and ability snapshots.</p>
          <button className="primary-button" type="button" onClick={startAddingPlayer}>Add Player</button>
        </section>
      ) : (
        <div className="squad-hub-layout">
          <aside className="squad-list-panel">
            <div className="panel-heading squad-panel-heading">
              <span>Squad list</span>
              <strong>{filteredPlayers.length}/{players.length}</strong>
            </div>

            <div className="squad-filter-stack">
              <label>
                Search players
                <input
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search name or shirt number"
                  type="search"
                  value={searchTerm}
                />
              </label>
              <div className="squad-filter-row">
                <label>
                  Position
                  <select onChange={(event) => setPositionFilter(event.target.value)} value={positionFilter}>
                    {positionOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Status
                  <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                    <option>All statuses</option>
                    {playerStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {filteredPlayers.length === 0 ? (
              <div className="squad-no-results">
                <strong>No players match this search</strong>
                <p>Clear filters to return to the full squad.</p>
                <button type="button" onClick={clearFilters}>Clear filters</button>
              </div>
            ) : (
              <div className="squad-player-list">
                {filteredPlayers.map((player) => (
                  <PlayerListItem
                    isActive={player.id === selectedPlayerId}
                    key={player.id}
                    onSelect={() => selectPlayer(player.id)}
                    player={player}
                  />
                ))}
              </div>
            )}
          </aside>

          <main className="selected-player-panel">
            {selectedPlayer ? (
              <SelectedPlayerPreview
                onDelete={handleDeletePlayer}
                onEdit={startEditingPlayer}
                player={selectedPlayer}
              />
            ) : (
              <div className="squad-empty-state compact">
                <p className="section-kicker">Player snapshot</p>
                <h3>Select a player</h3>
                <p>Choose a player from the squad list to view their development snapshot.</p>
              </div>
            )}
          </main>

          <aside className="squad-side-panel">
            <CoachWatchlist items={watchlistItems} onSelect={selectPlayer} />
            <RecentNotes notes={recentNotes} onSelect={selectPlayer} />
            <QuickActions
              hasSelectedPlayer={Boolean(selectedPlayer)}
              onAdd={startAddingPlayer}
              onEdit={startEditingPlayer}
            />
          </aside>
        </div>
      )}

      {(formMode === 'add' || formMode === 'edit') && (
        <div className="player-editor-overlay" role="presentation">
          <div className="player-editor-drawer" role="dialog" aria-modal="true" aria-label={formMode === 'edit' ? 'Edit player' : 'Add player'}>
            <PlayerForm
              formData={formData}
              formMode={formMode}
              onCancel={cancelEditor}
              onChange={handleChange}
              onDiscardDraft={discardDraft}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </section>
  )
}

function PlayerListItem({ isActive, onSelect, player }) {
  const averageRating = getAverageRating(player)

  return (
    <button className={isActive ? 'squad-player-card active' : 'squad-player-card'} onClick={onSelect} type="button">
      <span className="player-avatar-badge">{player.shirtNumber || getPlayerInitials(player)}</span>
      <span className="squad-player-copy">
        <strong>{getPlayerName(player)}</strong>
        <small>{player.mainPosition || 'No position set'} {player.age ? `- Age ${player.age}` : ''}</small>
      </span>
      <span className={`player-status-chip status-${getPlayerStatus(player).toLowerCase().replaceAll(' ', '-')}`}>{getPlayerStatus(player)}</span>
      <span className="player-card-rating">{averageRating === null ? '--' : averageRating.toFixed(1)}</span>
    </button>
  )
}

function SelectedPlayerPreview({ onDelete, onEdit, player }) {
  return (
    <article className="selected-player-card">
      <div className="selected-player-hero">
        <div className="selected-shirt-badge">#{player.shirtNumber || '-'}</div>
        <div>
          <span className="player-status-chip">{getPlayerStatus(player)}</span>
          <h3>{getPlayerName(player)}</h3>
          <p>
            {player.mainPosition || 'No main position'}
            {player.secondaryPosition ? ` - ${player.secondaryPosition}` : ''}
          </p>
        </div>
      </div>

      <div className="selected-player-meta">
        <DetailPill label="Age" value={player.age || 'Not set'} />
        <DetailPill label="Preferred foot" value={player.preferredFoot || 'Not set'} />
        <DetailPill label="Average rating" value={getAverageRating(player) === null ? '--' : getAverageRating(player).toFixed(1)} />
      </div>

      <section className="ability-overview-card">
        <div className="squad-section-heading">
          <h4>Ability overview</h4>
          <span>Saved ratings</span>
        </div>
        <div className="ability-list">
          {ratingFields.map((field) => (
            <RatingBar field={field} key={field.key} player={player} />
          ))}
        </div>
      </section>

      <section className="development-focus-card">
        <div className="squad-section-heading">
          <h4>Current development focus</h4>
        </div>
        <p>{player.developmentFocus || 'No development focus set yet.'}</p>
      </section>

      <div className="selected-notes-grid">
        <PlayerTextBlock label="Strengths" value={player.strengths} />
        <PlayerTextBlock label="Areas to improve" value={player.areasToImprove} />
        <PlayerTextBlock label="Coach notes" value={player.coachNotes} />
      </div>

      <div className="selected-player-actions">
        <button className="primary-button" type="button" onClick={onEdit}>Edit Player</button>
        <button className="secondary-button" disabled type="button">Add Note</button>
        <button className="secondary-button" disabled type="button">Log Training Feedback</button>
        <button className="secondary-button" disabled type="button">Open Full Profile</button>
        <button className="danger-button" type="button" onClick={onDelete}>Delete Player</button>
      </div>
    </article>
  )
}

function DetailPill({ label, value }) {
  return (
    <div className="detail-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function RatingBar({ field, player }) {
  const value = getRatingValue(player, field.key)

  return (
    <div className="ability-row">
      <span>{field.label}</span>
      <div className="ability-track"><span style={{ width: `${value === null ? 0 : value * 10}%` }} /></div>
      <strong>{value === null ? 'Not set' : `${value}/10`}</strong>
    </div>
  )
}

function PlayerTextBlock({ label, value }) {
  return (
    <div className="player-text-block">
      <span>{label}</span>
      <p>{truncateText(value) || 'Nothing added yet.'}</p>
    </div>
  )
}

function CoachWatchlist({ items, onSelect }) {
  return (
    <section className="squad-side-card">
      <div className="squad-section-heading">
        <h4>Coach Watchlist</h4>
        <span>{items.length} to review</span>
      </div>
      {items.length > 0 ? (
        <div className="watchlist-stack">
          {items.map((item) => (
            <button key={item.player.id} type="button" onClick={() => onSelect(item.player.id)}>
              <span>{getPlayerInitials(item.player)}</span>
              <div>
                <strong>{getPlayerName(item.player)}</strong>
                <small>{item.reason}</small>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="side-empty-copy">No urgent player review items yet.</p>
      )}
    </section>
  )
}

function RecentNotes({ notes, onSelect }) {
  return (
    <section className="squad-side-card">
      <div className="squad-section-heading">
        <h4>Recent Notes</h4>
        <span>Coach notes</span>
      </div>
      {notes.length > 0 ? (
        <div className="recent-notes-stack">
          {notes.map((player) => (
            <button key={player.id} type="button" onClick={() => onSelect(player.id)}>
              <strong>{getPlayerName(player)}</strong>
              <p>{truncateText(player.coachNotes, 88)}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="side-empty-copy">Coach notes will appear here as you build player profiles.</p>
      )}
    </section>
  )
}

function QuickActions({ hasSelectedPlayer, onAdd, onEdit }) {
  return (
    <section className="squad-side-card">
      <div className="squad-section-heading">
        <h4>Quick Actions</h4>
      </div>
      <div className="squad-quick-actions">
        <button type="button" onClick={onAdd}>Add Player</button>
        <button disabled={!hasSelectedPlayer} type="button" onClick={onEdit}>Edit Selected Player</button>
        <button disabled type="button">Add Coach Note</button>
        <button disabled type="button">Log Training Feedback</button>
        <button disabled type="button">Log Match Feedback</button>
      </div>
    </section>
  )
}

function PlayerForm({ formData, formMode, onCancel, onChange, onDiscardDraft, onSubmit }) {
  return (
    <form className="player-form player-editor-form" onSubmit={onSubmit}>
      <div className="form-heading">
        <div>
          <p className="section-kicker">{formMode === 'edit' ? 'Edit player' : 'New player'}</p>
          <h3>{formMode === 'edit' ? 'Update player profile' : 'Add player profile'}</h3>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Full name
          <input
            name="fullName"
            onChange={onChange}
            required
            type="text"
            value={formData.fullName}
          />
        </label>
        <label>
          Shirt number
          <input
            min="0"
            name="shirtNumber"
            onChange={onChange}
            type="number"
            value={formData.shirtNumber}
          />
        </label>
        <label>
          Age
          <input
            min="1"
            name="age"
            onChange={onChange}
            type="number"
            value={formData.age}
          />
        </label>
        <label>
          Main position
          <input
            name="mainPosition"
            onChange={onChange}
            type="text"
            value={formData.mainPosition}
          />
        </label>
        <label>
          Secondary position
          <input
            name="secondaryPosition"
            onChange={onChange}
            type="text"
            value={formData.secondaryPosition}
          />
        </label>
        <label>
          Preferred foot
          <select
            name="preferredFoot"
            onChange={onChange}
            value={formData.preferredFoot}
          >
            <option>Right</option>
            <option>Left</option>
            <option>Both</option>
          </select>
        </label>
        <label>
          Player status
          <select name="status" onChange={onChange} value={formData.status}>
            {playerStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label>
          Development focus
          <input
            name="developmentFocus"
            onChange={onChange}
            placeholder="Example: Scanning before receiving"
            type="text"
            value={formData.developmentFocus}
          />
        </label>
      </div>

      <div className="ratings-grid">
        {ratingFields.map((field) => (
          <label key={field.name}>
            <span>
              {field.label}
              <strong>{formData[field.name]}/10</strong>
            </span>
            <input
              max="10"
              min="1"
              name={field.name}
              onChange={onChange}
              type="range"
              value={formData[field.name]}
            />
          </label>
        ))}
      </div>

      <div className="notes-grid">
        <label>
          Strengths
          <textarea
            name="strengths"
            onChange={onChange}
            rows="4"
            value={formData.strengths}
          />
        </label>
        <label>
          Areas to improve
          <textarea
            name="areasToImprove"
            onChange={onChange}
            rows="4"
            value={formData.areasToImprove}
          />
        </label>
        <label>
          Coach notes
          <textarea
            name="coachNotes"
            onChange={onChange}
            rows="4"
            value={formData.coachNotes}
          />
        </label>
      </div>

      <div className="form-actions player-editor-actions">
        <button className="primary-button" type="submit">
          {formMode === 'edit' ? 'Save changes' : 'Save player'}
        </button>
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="secondary-button" type="button" onClick={onDiscardDraft}>
          Discard Draft
        </button>
      </div>
    </form>
  )
}

export default Players
