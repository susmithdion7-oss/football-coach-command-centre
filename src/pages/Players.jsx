import { useEffect, useMemo, useRef, useState } from 'react'
import { getStorageItem, removeStorageItem, setStorageItem } from '../utils/storage.js'

const playerStatuses = ['Improving', 'On Track', 'Stable', 'Needs Support', 'Injured', 'Returning']
const noteTypes = ['General', 'Training', 'Match', 'Development']
const avatarFileTypes = ['image/png', 'image/jpeg', 'image/webp']
const maxAvatarFileSize = 2 * 1024 * 1024
const avatarOutputSize = 512

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
  avatarDataUrl: '',
  notes: [],
}

const emptyPlayerSnapshot = JSON.stringify(emptyPlayer)
const playerDraftKey = 'playerDraft'

const ratingFields = [
  { key: 'technical', name: 'technicalRating', label: 'Technical' },
  { key: 'physical', name: 'physicalRating', label: 'Physical' },
  { key: 'tactical', name: 'tacticalRating', label: 'Tactical understanding' },
  { key: 'mental', name: 'mentalRating', label: 'Mentality / attitude' },
]

function createRecordId(prefix) {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${prefix}-${Date.now()}`
}

function getPlayerForForm(player = {}) {
  return {
    ...emptyPlayer,
    ...player,
    avatarDataUrl: player.avatarDataUrl || player.avatar?.dataUrl || '',
    notes: Array.isArray(player.notes) ? player.notes : [],
    tacticalRating: player.tacticalRating || player.tacticalUnderstandingRating || emptyPlayer.tacticalRating,
    mentalRating: player.mentalRating || player.mentalityRating || emptyPlayer.mentalRating,
  }
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

  if (normalisedPosition.includes('def') || normalisedPosition.includes('back') || normalisedPosition.includes('cb') || normalisedPosition.includes('rb') || normalisedPosition.includes('lb')) {
    return 'DEF'
  }

  if (normalisedPosition.includes('mid') || normalisedPosition.includes('wing') || normalisedPosition.includes('cm') || normalisedPosition.includes('dm') || normalisedPosition.includes('am')) {
    return 'MID'
  }

  if (normalisedPosition.includes('fwd') || normalisedPosition.includes('for') || normalisedPosition.includes('striker') || normalisedPosition.includes('st')) {
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

function formatDate(value) {
  if (!value) {
    return 'Recently'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Recently'
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getPlayerNotes(player) {
  const savedNotes = Array.isArray(player.notes)
    ? player.notes
        .filter((note) => note?.text)
        .map((note) => ({ type: 'General', ...note }))
    : []

  if (savedNotes.length > 0) {
    return savedNotes.sort((firstNote, secondNote) => {
      const firstDate = new Date(firstNote.createdAt || 0).getTime()
      const secondDate = new Date(secondNote.createdAt || 0).getTime()
      return secondDate - firstDate
    })
  }

  if (player.coachNotes) {
    return [
      {
        id: `${player.id || 'player'}-legacy-note`,
        type: 'General',
        text: player.coachNotes,
        createdAt: player.updatedAt || player.createdAt || '',
        isLegacy: true,
      },
    ]
  }

  return []
}

function getRecentNoteEntries(players) {
  return players
    .flatMap((player) => getPlayerNotes(player).map((note) => ({ player, note })))
    .sort((firstEntry, secondEntry) => {
      const firstDate = new Date(firstEntry.note.createdAt || 0).getTime()
      const secondDate = new Date(secondEntry.note.createdAt || 0).getTime()
      return secondDate - firstDate
    })
    .slice(0, 5)
}

function getProfileCompleteness(player) {
  const checks = [
    player.fullName,
    player.shirtNumber,
    player.age,
    player.mainPosition,
    player.preferredFoot,
    player.developmentFocus,
    player.strengths,
    player.areasToImprove,
    player.coachNotes || getPlayerNotes(player).length > 0,
    ...ratingFields.map((field) => getRatingValue(player, field.key)),
  ]

  const completed = checks.filter((value) => value !== null && value !== undefined && value !== '').length
  return Math.round((completed / checks.length) * 100)
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
      items.push({ player, reason: 'Development focus missing' })
      return
    }

    if (!player.coachNotes && getPlayerNotes(player).length === 0) {
      items.push({ player, reason: 'No coach note yet' })
      return
    }

    if (averageRating !== null && averageRating <= 4) {
      items.push({ player, reason: 'Low average rating' })
    }
  })

  return items.slice(0, 6)
}

function getFocusAreas(players) {
  const focusCounts = players.reduce((focusMap, player) => {
    if (!player.developmentFocus) {
      return focusMap
    }

    focusMap[player.developmentFocus] = (focusMap[player.developmentFocus] || 0) + 1
    return focusMap
  }, {})

  return Object.entries(focusCounts)
    .map(([label, count]) => ({ label, count }))
    .sort((firstFocus, secondFocus) => secondFocus.count - firstFocus.count)
    .slice(0, 4)
}

function processAvatarFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('')
      return
    }

    if (!avatarFileTypes.includes(file.type)) {
      reject(new Error('Please upload a PNG, JPG or WebP image.'))
      return
    }

    if (file.size > maxAvatarFileSize) {
      reject(new Error('Please choose an image under 2MB.'))
      return
    }

    const reader = new FileReader()

    reader.onerror = () => reject(new Error('The image could not be read. Please try another file.'))
    reader.onload = () => {
      const image = new Image()

      image.onerror = () => reject(new Error('The image could not be loaded. Please try another file.'))
      image.onload = () => {
        const largestSide = Math.max(image.width, image.height)
        const scale = largestSide > avatarOutputSize ? avatarOutputSize / largestSide : 1
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))

        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/webp', 0.82))
      }
      image.src = reader.result
    }

    reader.readAsDataURL(file)
  })
}

function Players({ players, onAddPlayer, onDeletePlayer, onUpdatePlayer }) {
  const [initialDraftState] = useState(() => getDraftInitialState(players))
  const [selectedPlayerId, setSelectedPlayerId] = useState(initialDraftState.selectedPlayerId)
  const [activeProfilePlayerId, setActiveProfilePlayerId] = useState(null)
  const [activeProfileTab, setActiveProfileTab] = useState('profile')
  const [formMode, setFormMode] = useState(initialDraftState.formMode)
  const [formData, setFormData] = useState(initialDraftState.formData)
  const [message, setMessage] = useState(initialDraftState.restored ? 'Draft restored.' : '')
  const [draftStatus, setDraftStatus] = useState(initialDraftState.restored ? 'Unsaved changes' : '')
  const [avatarMessage, setAvatarMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('All positions')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [squadView, setSquadView] = useState('board')
  const [notePlayerId, setNotePlayerId] = useState(null)
  const [noteForm, setNoteForm] = useState({ type: 'General', text: '' })
  const [noteMessage, setNoteMessage] = useState('')
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
  const activeProfilePlayer = useMemo(
    () => players.find((player) => player.id === activeProfilePlayerId),
    [activeProfilePlayerId, players],
  )
  const notePlayer = useMemo(
    () => players.find((player) => player.id === notePlayerId),
    [notePlayerId, players],
  )

  const squadAverageRating = getSquadAverageRating(players)
  const watchlistItems = getWatchlistItems(players)
  const recentNotes = getRecentNoteEntries(players)
  const focusAreas = getFocusAreas(players)
  const needReviewCount = watchlistItems.length
  const overviewStats = [
    { label: 'Players', value: players.length, detail: 'Squad size', icon: 'PL' },
    { label: 'Need Review', value: needReviewCount, detail: 'Coach attention', icon: 'NR' },
    {
      label: 'Improving',
      value: players.filter((player) => getPlayerStatus(player) === 'Improving').length,
      detail: 'Strong growth',
      icon: 'UP',
    },
    { label: 'Focus Areas', value: focusAreas.length, detail: 'Active themes', icon: 'FA' },
    {
      label: 'Average Rating',
      value: squadAverageRating === null ? '--' : squadAverageRating.toFixed(1),
      detail: 'Across ratings',
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

  useEffect(() => {
    if (!activeProfilePlayerId) {
      return
    }

    if (!players.some((player) => player.id === activeProfilePlayerId)) {
      setActiveProfilePlayerId(null)
    }
  }, [activeProfilePlayerId, players])

  useEffect(() => {
    const shouldLockScroll = activeProfilePlayerId || notePlayerId || formMode !== 'view'

    if (!shouldLockScroll) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [activeProfilePlayerId, formMode, notePlayerId])

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
    setAvatarMessage('')
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

  async function handleAvatarFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    setAvatarMessage('')
    setMessage('')

    try {
      const avatarDataUrl = await processAvatarFile(file)
      setFormData((currentData) => ({ ...currentData, avatarDataUrl }))
      setDraftStatus('Unsaved changes')
      setAvatarMessage('Avatar ready to save.')
    } catch (error) {
      setAvatarMessage(error.message)
    }
  }

  function removeAvatar() {
    setFormData((currentData) => ({ ...currentData, avatarDataUrl: '' }))
    setDraftStatus('Unsaved changes')
    setAvatarMessage('Avatar removed. Save the player to keep this change.')
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
      preferredFoot: formData.preferredFoot || 'Right',
      status: formData.status || 'On Track',
      developmentFocus: formData.developmentFocus.trim(),
      strengths: formData.strengths.trim(),
      areasToImprove: formData.areasToImprove.trim(),
      coachNotes: formData.coachNotes.trim(),
      avatarDataUrl: formData.avatarDataUrl || '',
      notes: Array.isArray(formData.notes) ? formData.notes : [],
      updatedAt: now,
    }

    if (formMode === 'edit' && selectedPlayer) {
      onUpdatePlayer(selectedPlayer.id, cleanPlayer)
      clearPlayerDraft()
      setCleanPlayerForm(cleanPlayer, selectedPlayer.id, 'view', 'Player updated and saved locally.')
      setActiveProfilePlayerId(selectedPlayer.id)
      setActiveProfileTab('profile')
      setDraftStatus('Saved')
      return
    }

    const newPlayerId = onAddPlayer(cleanPlayer)
    clearPlayerDraft()
    setCleanPlayerForm(emptyPlayer, newPlayerId, 'view', 'Player created and saved locally.')
    setActiveProfilePlayerId(newPlayerId)
    setActiveProfileTab('profile')
    setDraftStatus('Saved')
  }

  function startAddingPlayer() {
    if (!confirmDiscardUnsaved('You have unsaved player changes. Do you want to discard them and start a new player?')) {
      return
    }

    clearPlayerDraft()
    setActiveProfilePlayerId(null)
    setNotePlayerId(null)
    setCleanPlayerForm(emptyPlayer, selectedPlayerId, 'add', 'New player form ready.')
  }

  function openPlayerProfile(playerId) {
    if (!confirmDiscardUnsaved('You have unsaved player changes. Do you want to discard them and open another player?')) {
      return
    }

    clearPlayerDraft()
    setCleanPlayerForm(emptyPlayer, playerId, 'view', '')
    setActiveProfilePlayerId(playerId)
    setActiveProfileTab('profile')
  }

  function startEditingPlayer(playerId = activeProfilePlayerId || selectedPlayerId) {
    const targetPlayer = players.find((player) => player.id === playerId)

    if (!targetPlayer || !confirmDiscardUnsaved('You have unsaved player changes. Do you want to discard them and edit this player?')) {
      return
    }

    clearPlayerDraft()
    setCleanPlayerForm(getPlayerForForm(targetPlayer), targetPlayer.id, 'edit', '')
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

  function handleDeletePlayer(playerId = activeProfilePlayerId || selectedPlayerId) {
    const targetPlayer = players.find((player) => player.id === playerId)

    if (!targetPlayer) {
      return
    }

    const shouldDelete = window.confirm(`Delete ${getPlayerName(targetPlayer)}?`)

    if (!shouldDelete) {
      return
    }

    clearPlayerDraft()
    onDeletePlayer(targetPlayer.id)
    const nextPlayer = players.find((player) => player.id !== targetPlayer.id)
    setActiveProfilePlayerId(null)
    setNotePlayerId(null)
    setCleanPlayerForm(
      emptyPlayer,
      nextPlayer?.id ?? null,
      'view',
      nextPlayer ? 'Player deleted.' : 'Player deleted. Add your next player when ready.',
    )
  }

  function openAddNote(playerId = activeProfilePlayerId || selectedPlayerId) {
    if (!playerId) {
      setMessage('Select a player before adding a note.')
      return
    }

    if (!confirmDiscardUnsaved('You have unsaved player changes. Do you want to discard them and add a note?')) {
      return
    }

    clearPlayerDraft()
    setNoteForm({ type: 'General', text: '' })
    setNoteMessage('')
    setNotePlayerId(playerId)
  }

  function closeAddNote() {
    if (noteForm.text.trim() && !window.confirm('Discard this unsaved note?')) {
      return
    }

    setNotePlayerId(null)
    setNoteForm({ type: 'General', text: '' })
    setNoteMessage('')
  }

  function handleNoteChange(event) {
    const { name, value } = event.target
    setNoteMessage('')
    setNoteForm((currentNote) => ({ ...currentNote, [name]: value }))
  }

  function saveNote(event) {
    event.preventDefault()

    if (!notePlayer) {
      return
    }

    if (!noteForm.text.trim()) {
      setNoteMessage('Please write a note before saving.')
      return
    }

    const now = new Date().toISOString()
    const nextNote = {
      id: createRecordId('note'),
      type: noteForm.type || 'General',
      text: noteForm.text.trim(),
      createdAt: now,
      updatedAt: now,
    }
    const existingNotes = Array.isArray(notePlayer.notes) ? notePlayer.notes : []

    onUpdatePlayer(notePlayer.id, {
      notes: [nextNote, ...existingNotes],
      updatedAt: now,
    })
    setActiveProfilePlayerId(notePlayer.id)
    setActiveProfileTab('notes')
    setSelectedPlayerId(notePlayer.id)
    setNotePlayerId(null)
    setNoteForm({ type: 'General', text: '' })
    setNoteMessage('')
    setMessage('Coach note saved locally.')
  }

  return (
    <section className="players-page squad-hub-page">
      <div className="squad-hub-header">
        <div>
          <p className="section-kicker">Players</p>
          <h3>Squad Hub</h3>
          <p>Build, track and develop your squad. Open a player profile only when you need deeper detail.</p>
        </div>
        <button className="primary-button" type="button" onClick={startAddingPlayer}>
          Add Player
        </button>
      </div>

      {(message || draftStatus) && <p className="form-message squad-hub-message">{message || draftStatus}</p>}

      <section className="squad-hero-card compact-squad-hero">
        <div className="squad-hero-copy">
          <span>Squad management centre</span>
          <h4>Build confident players. Track growth with clarity.</h4>
          <p>See the whole squad at a glance, spot who needs attention, and keep player detail one click away.</p>
        </div>
        <div className="squad-hero-metrics" aria-label="Squad summary">
          {overviewStats.slice(0, 4).map((stat) => (
            <article key={stat.label}>
              <span>{stat.icon}</span>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      {players.length === 0 ? (
        <section className="squad-empty-state">
          <p className="section-kicker">Start your squad</p>
          <h3>Build your first squad</h3>
          <p>Add your first player to start tracking development, notes and ability snapshots.</p>
          <button className="primary-button" type="button" onClick={startAddingPlayer}>Add Player</button>
        </section>
      ) : (
        <div className="squad-hub-workspace">
          <aside className="squad-list-panel">
            <div className="panel-heading squad-panel-heading">
              <span>Squad list</span>
              <button type="button" onClick={clearFilters}>View full squad</button>
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
              <div className="squad-player-list squad-list-scroll">
                {filteredPlayers.map((player) => (
                  <PlayerListItem
                    isActive={player.id === selectedPlayerId}
                    key={player.id}
                    onSelect={() => openPlayerProfile(player.id)}
                    player={player}
                  />
                ))}
              </div>
            )}
          </aside>

          <main className="squad-board-panel">
            <div className="squad-board-toolbar">
              <div>
                <p className="section-kicker">Whole squad</p>
                <h4>Squad Overview</h4>
              </div>
              <div className="squad-view-toggle" aria-label="Squad view">
                <button className={squadView === 'board' ? 'active' : ''} type="button" onClick={() => setSquadView('board')}>Board View</button>
                <button className={squadView === 'list' ? 'active' : ''} type="button" onClick={() => setSquadView('list')}>List View</button>
              </div>
            </div>

            {filteredPlayers.length === 0 ? (
              <div className="squad-empty-state compact">
                <h3>No players match this search</h3>
                <p>Clear filters to return to your squad board.</p>
                <button className="secondary-button" type="button" onClick={clearFilters}>Clear filters</button>
              </div>
            ) : squadView === 'board' ? (
              <div className="squad-card-grid">
                {filteredPlayers.map((player) => (
                  <SquadCard key={player.id} onOpen={() => openPlayerProfile(player.id)} player={player} />
                ))}
              </div>
            ) : (
              <div className="squad-compact-table" role="table" aria-label="Full squad list">
                {filteredPlayers.map((player) => (
                  <SquadCompactRow key={player.id} onOpen={() => openPlayerProfile(player.id)} player={player} />
                ))}
              </div>
            )}

            <div className="squad-board-lower-grid">
              <DevelopmentFocusBoard focusAreas={focusAreas} players={players} />
              <RecentActivityCard notes={recentNotes} onOpen={openPlayerProfile} />
            </div>
          </main>

          <aside className="squad-coach-panel">
            <CoachWatchlist items={watchlistItems} onSelect={openPlayerProfile} />
            <RecentNotes notes={recentNotes} onSelect={openPlayerProfile} />
            <QuickActions
              hasSelectedPlayer={Boolean(selectedPlayer)}
              onAdd={startAddingPlayer}
              onAddNote={() => openAddNote(selectedPlayer?.id)}
            />
          </aside>
        </div>
      )}

      {activeProfilePlayer && (
        <PlayerProfileModal
          activeTab={activeProfileTab}
          onAddNote={() => openAddNote(activeProfilePlayer.id)}
          onChangeTab={setActiveProfileTab}
          onClose={() => setActiveProfilePlayerId(null)}
          onDelete={() => handleDeletePlayer(activeProfilePlayer.id)}
          onEdit={() => startEditingPlayer(activeProfilePlayer.id)}
          player={activeProfilePlayer}
        />
      )}

      {(formMode === 'add' || formMode === 'edit') && (
        <div className="player-editor-overlay" role="presentation">
          <div className="player-editor-drawer" role="dialog" aria-modal="true" aria-label={formMode === 'edit' ? 'Edit player' : 'Add player'}>
            <PlayerForm
              avatarMessage={avatarMessage}
              formData={formData}
              formMode={formMode}
              onAvatarFile={handleAvatarFile}
              onCancel={cancelEditor}
              onChange={handleChange}
              onDiscardDraft={discardDraft}
              onRemoveAvatar={removeAvatar}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}

      {notePlayer && (
        <AddNoteModal
          message={noteMessage}
          noteForm={noteForm}
          onChange={handleNoteChange}
          onClose={closeAddNote}
          onSave={saveNote}
          player={notePlayer}
        />
      )}
    </section>
  )
}

function PlayerAvatar({ player, size = 'md', className = '' }) {
  const avatarClassName = ['player-avatar', `player-avatar-${size}`, className].filter(Boolean).join(' ')

  return (
    <span className={avatarClassName}>
      {player.avatarDataUrl ? (
        <img alt={`${getPlayerName(player)} avatar`} src={player.avatarDataUrl} />
      ) : (
        <strong>{player.shirtNumber || getPlayerInitials(player)}</strong>
      )}
    </span>
  )
}

function PlayerListItem({ isActive, onSelect, player }) {
  return (
    <button className={isActive ? 'squad-player-row active' : 'squad-player-row'} onClick={onSelect} type="button">
      <PlayerAvatar player={player} size="sm" />
      <span className="squad-player-copy">
        <strong>{getPlayerName(player)}</strong>
        <small>{player.mainPosition || 'No position set'}</small>
      </span>
      <span className={`player-status-chip status-${getPlayerStatus(player).toLowerCase().replaceAll(' ', '-')}`}>{getPlayerStatus(player)}</span>
    </button>
  )
}

function SquadCard({ onOpen, player }) {
  const averageRating = getAverageRating(player)
  const completeness = getProfileCompleteness(player)

  return (
    <article className="squad-profile-card">
      <button className="squad-card-main" type="button" onClick={onOpen}>
        <div className="squad-card-topline">
          <span className="shirt-number-pill">{player.shirtNumber || '--'}</span>
          <span className={`player-status-chip status-${getPlayerStatus(player).toLowerCase().replaceAll(' ', '-')}`}>{getPlayerStatus(player)}</span>
        </div>
        <PlayerAvatar player={player} size="lg" />
        <strong>{getPlayerName(player)}</strong>
        <small>{player.mainPosition || 'No position set'}</small>
        <p>{player.developmentFocus || 'No development focus set'}</p>
      </button>
      <div className="profile-completeness">
        <span>{averageRating === null ? 'Rating not set' : `Avg. ${averageRating.toFixed(1)}/10`}</span>
        <span>{completeness}% complete</span>
        <div className="completion-track"><i style={{ width: `${completeness}%` }} /></div>
      </div>
      <button className="open-profile-button" type="button" onClick={onOpen}>Open Profile</button>
    </article>
  )
}

function SquadCompactRow({ onOpen, player }) {
  const averageRating = getAverageRating(player)

  return (
    <button className="squad-compact-row" type="button" onClick={onOpen} role="row">
      <PlayerAvatar player={player} size="sm" />
      <span><strong>{getPlayerName(player)}</strong><small>#{player.shirtNumber || '--'}</small></span>
      <span>{player.mainPosition || 'No position set'}</span>
      <span>{player.age ? `Age ${player.age}` : 'Age not set'}</span>
      <span className={`player-status-chip status-${getPlayerStatus(player).toLowerCase().replaceAll(' ', '-')}`}>{getPlayerStatus(player)}</span>
      <span>{averageRating === null ? '--' : averageRating.toFixed(1)}</span>
    </button>
  )
}

function DevelopmentFocusBoard({ focusAreas, players }) {
  return (
    <section className="squad-mini-panel">
      <div className="squad-section-heading">
        <h4>Development Focus Board</h4>
        <span>{focusAreas.length || 0} focus areas</span>
      </div>
      {focusAreas.length > 0 ? (
        <div className="focus-area-grid">
          {focusAreas.map((focus) => (
            <article key={focus.label}>
              <strong>{focus.label}</strong>
              <small>{focus.count} player{focus.count === 1 ? '' : 's'}</small>
              <div className="completion-track"><i style={{ width: `${Math.min(100, (focus.count / Math.max(players.length, 1)) * 100)}%` }} /></div>
            </article>
          ))}
        </div>
      ) : (
        <p className="side-empty-copy">Development focus themes will appear here once player profiles include them.</p>
      )}
    </section>
  )
}

function RecentActivityCard({ notes, onOpen }) {
  return (
    <section className="squad-mini-panel">
      <div className="squad-section-heading">
        <h4>Recent Player Activity</h4>
        <span>{notes.length} notes</span>
      </div>
      {notes.length > 0 ? (
        <div className="activity-stack">
          {notes.slice(0, 3).map(({ player, note }) => (
            <button key={`${player.id}-${note.id}`} type="button" onClick={() => onOpen(player.id)}>
              <PlayerAvatar player={player} size="xs" />
              <span><strong>{getPlayerName(player)}</strong><small>{truncateText(note.text, 54)}</small></span>
              <em>{formatDate(note.createdAt)}</em>
            </button>
          ))}
        </div>
      ) : (
        <p className="side-empty-copy">Player notes and profile updates will appear here.</p>
      )}
    </section>
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
        <h4>Needs Review</h4>
        <button type="button" disabled>View all</button>
      </div>
      {items.length > 0 ? (
        <div className="watchlist-stack">
          {items.map((item) => (
            <button key={item.player.id} type="button" onClick={() => onSelect(item.player.id)}>
              <PlayerAvatar player={item.player} size="xs" />
              <div>
                <strong>{getPlayerName(item.player)}</strong>
                <small>{item.reason}</small>
              </div>
              <span className="review-chip">Review</span>
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
        <button type="button" disabled>View all</button>
      </div>
      {notes.length > 0 ? (
        <div className="recent-notes-stack">
          {notes.map(({ player, note }) => (
            <button key={`${player.id}-${note.id}`} type="button" onClick={() => onSelect(player.id)}>
              <PlayerAvatar player={player} size="xs" />
              <span>
                <strong>{getPlayerName(player)}</strong>
                <p>{truncateText(note.text, 80)}</p>
              </span>
              <em>{formatDate(note.createdAt)}</em>
            </button>
          ))}
        </div>
      ) : (
        <p className="side-empty-copy">No recent notes yet. Add a note from a player profile.</p>
      )}
    </section>
  )
}

function QuickActions({ hasSelectedPlayer, onAdd, onAddNote }) {
  return (
    <section className="squad-side-card">
      <div className="squad-section-heading">
        <h4>Quick Actions</h4>
      </div>
      <div className="squad-quick-actions">
        <button type="button" onClick={onAdd}>Add Player</button>
        <button disabled={!hasSelectedPlayer} type="button" onClick={onAddNote}>Add Note</button>
        <button disabled type="button">Log Training Feedback</button>
        <button disabled type="button">Log Match Feedback</button>
      </div>
    </section>
  )
}

function PlayerProfileModal({ activeTab, onAddNote, onChangeTab, onClose, onDelete, onEdit, player }) {
  const averageRating = getAverageRating(player)
  const notes = getPlayerNotes(player)
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'development', label: 'Development' },
    { id: 'notes', label: 'Notes' },
    { id: 'history', label: 'History' },
  ]

  return (
    <div className="player-profile-overlay" role="presentation">
      <article className="player-profile-modal" role="dialog" aria-modal="true" aria-label={`${getPlayerName(player)} player profile`}>
        <button className="modal-close-button" type="button" onClick={onClose} aria-label="Close player profile">x</button>

        <header className="player-profile-header">
          <div className="profile-shirt-number">{player.shirtNumber || '--'}</div>
          <PlayerAvatar player={player} size="xl" />
          <div className="profile-title-block">
            <span className={`player-status-chip status-${getPlayerStatus(player).toLowerCase().replaceAll(' ', '-')}`}>{getPlayerStatus(player)}</span>
            <h3>{getPlayerName(player)}</h3>
            <p>{player.mainPosition || 'No main position'}{player.secondaryPosition ? ` - ${player.secondaryPosition}` : ''}</p>
            <div className="profile-meta-strip">
              <DetailPill label="Age" value={player.age || 'Not set'} />
              <DetailPill label="Foot" value={player.preferredFoot || 'Not set'} />
              <DetailPill label="Average" value={averageRating === null ? '--' : `${averageRating.toFixed(1)}/10`} />
            </div>
          </div>
          <div className="profile-action-stack">
            <button className="primary-button" type="button" onClick={onEdit}>Edit Player</button>
            <button className="secondary-button" type="button" onClick={onAddNote}>Add Note</button>
            <button className="danger-button" type="button" onClick={onDelete}>Delete</button>
          </div>
        </header>

        <nav className="profile-tabs" aria-label="Player profile sections">
          {tabs.map((tab) => (
            <button className={activeTab === tab.id ? 'active' : ''} key={tab.id} type="button" onClick={() => onChangeTab(tab.id)}>{tab.label}</button>
          ))}
        </nav>

        <div className="profile-modal-body">
          {activeTab === 'profile' && <ProfileTab player={player} />}
          {activeTab === 'development' && <DevelopmentTab player={player} />}
          {activeTab === 'notes' && <NotesTab notes={notes} onAddNote={onAddNote} />}
          {activeTab === 'history' && <HistoryTab />}
        </div>
      </article>
    </div>
  )
}

function ProfileTab({ player }) {
  return (
    <div className="profile-tab-grid">
      <section className="profile-info-card">
        <div className="squad-section-heading"><h4>Player Information</h4></div>
        <dl className="profile-info-list">
          <div><dt>Full name</dt><dd>{getPlayerName(player)}</dd></div>
          <div><dt>Shirt number</dt><dd>{player.shirtNumber || 'Not set'}</dd></div>
          <div><dt>Age</dt><dd>{player.age || 'Not set'}</dd></div>
          <div><dt>Main position</dt><dd>{player.mainPosition || 'Not set'}</dd></div>
          <div><dt>Secondary position</dt><dd>{player.secondaryPosition || 'Not set'}</dd></div>
          <div><dt>Preferred foot</dt><dd>{player.preferredFoot || 'Not set'}</dd></div>
        </dl>
      </section>
      <section className="profile-info-card profile-ratings-card">
        <div className="squad-section-heading"><h4>Attributes</h4><span>1-10 ratings</span></div>
        <div className="ability-list">
          {ratingFields.map((field) => <RatingBar field={field} key={field.key} player={player} />)}
        </div>
      </section>
      <section className="profile-info-card profile-text-grid">
        <PlayerTextBlock label="Strengths" value={player.strengths} />
        <PlayerTextBlock label="Areas to improve" value={player.areasToImprove} />
        <PlayerTextBlock label="Coach notes summary" value={player.coachNotes} />
      </section>
    </div>
  )
}

function DevelopmentTab({ player }) {
  return (
    <div className="profile-tab-grid development-tab-grid">
      <section className="profile-info-card development-spotlight-card">
        <span className="section-kicker">Current development focus</span>
        <h4>{player.developmentFocus || 'No development focus set yet'}</h4>
        <p>Status: {getPlayerStatus(player)}</p>
      </section>
      <section className="profile-info-card profile-ratings-card">
        <div className="squad-section-heading"><h4>Ability Overview</h4></div>
        <div className="ability-list">
          {ratingFields.map((field) => <RatingBar field={field} key={field.key} player={player} />)}
        </div>
      </section>
      <section className="profile-info-card coming-soon-panel">
        <h4>Training feedback coming soon</h4>
        <p>Future training notes and session feedback will sit here.</p>
      </section>
      <section className="profile-info-card coming-soon-panel">
        <h4>Match feedback coming soon</h4>
        <p>Future match reflections and review notes will sit here.</p>
      </section>
    </div>
  )
}

function NotesTab({ notes, onAddNote }) {
  return (
    <section className="profile-info-card notes-tab-card">
      <div className="squad-section-heading">
        <h4>Coach Notes</h4>
        <button type="button" onClick={onAddNote}>Add Note</button>
      </div>
      {notes.length > 0 ? (
        <div className="profile-notes-timeline">
          {notes.map((note) => (
            <article key={note.id}>
              <span>{note.type}{note.isLegacy ? ' legacy note' : ''}</span>
              <p>{note.text}</p>
              <small>{formatDate(note.createdAt)}</small>
            </article>
          ))}
        </div>
      ) : (
        <p className="side-empty-copy">No notes yet. Add a note to build this player profile over time.</p>
      )}
    </section>
  )
}

function HistoryTab() {
  return (
    <section className="profile-info-card history-placeholder-card">
      <h4>Training and match history will appear here later.</h4>
      <p>This version keeps history as a future module preview and does not add feedback tracking yet.</p>
    </section>
  )
}

function PlayerForm({ avatarMessage, formData, formMode, onAvatarFile, onCancel, onChange, onDiscardDraft, onRemoveAvatar, onSubmit }) {
  return (
    <form className="player-form player-editor-form" onSubmit={onSubmit}>
      <div className="form-heading">
        <div>
          <p className="section-kicker">{formMode === 'edit' ? 'Edit player' : 'New player'}</p>
          <h3>{formMode === 'edit' ? 'Update player profile' : 'Add player profile'}</h3>
        </div>
      </div>

      <section className="avatar-upload-card">
        <PlayerAvatar player={formData} size="xl" />
        <div>
          <h4>Player photo</h4>
          <p>Optional. PNG, JPG or WebP, max 2MB. The image is resized and saved only in this browser.</p>
          <div className="avatar-upload-actions">
            <label className="secondary-button" htmlFor="player-avatar-input">{formData.avatarDataUrl ? 'Replace Avatar' : 'Upload Avatar'}</label>
            <input accept="image/png,image/jpeg,image/webp" id="player-avatar-input" onChange={onAvatarFile} type="file" />
            {formData.avatarDataUrl && <button className="secondary-button" type="button" onClick={onRemoveAvatar}>Remove Avatar</button>}
          </div>
          {avatarMessage && <small className="avatar-message">{avatarMessage}</small>}
        </div>
      </section>

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

function AddNoteModal({ message, noteForm, onChange, onClose, onSave, player }) {
  return (
    <div className="note-modal-overlay" role="presentation">
      <form className="note-modal-card" role="dialog" aria-modal="true" aria-label="Add player note" onSubmit={onSave}>
        <div className="squad-section-heading">
          <div>
            <p className="section-kicker">Coach note</p>
            <h4>Add note for {getPlayerName(player)}</h4>
          </div>
          <button className="modal-icon-button" type="button" onClick={onClose} aria-label="Close note modal">x</button>
        </div>
        <label>
          Note type
          <select name="type" onChange={onChange} value={noteForm.type}>
            {noteTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <label>
          Note
          <textarea name="text" rows="6" onChange={onChange} value={noteForm.text} placeholder="What did you notice about this player?" />
        </label>
        {message && <p className="form-message">{message}</p>}
        <div className="form-actions">
          <button className="primary-button" type="submit">Save Note</button>
          <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default Players
