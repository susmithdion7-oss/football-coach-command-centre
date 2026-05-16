import { useEffect, useMemo, useRef, useState } from 'react'
import { getStorageItem, setStorageItem } from '../utils/storage.js'

const playerStatuses = ['Improving', 'On Track', 'Stable', 'Needs Support', 'Injured', 'Returning']
const noteTypes = ['General', 'Training', 'Match', 'Development']
const avatarFileTypes = ['image/png', 'image/jpeg', 'image/webp']
const maxAvatarFileSize = 2 * 1024 * 1024
const avatarOutputSize = 512

const lineupStorageKey = 'squadLineup'
const tacticalStorageKey = 'tacticalSetup'
const assignmentsStorageKey = 'playerAssignments'

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

const ratingFields = [
  { key: 'technical', name: 'technicalRating', label: 'Technical' },
  { key: 'physical', name: 'physicalRating', label: 'Physical' },
  { key: 'tactical', name: 'tacticalRating', label: 'Tactical' },
  { key: 'mental', name: 'mentalRating', label: 'Mental' },
]

const sections = [
  { id: 'playerCentre', label: 'Player Centre', subtitle: 'Profiles, notes and status' },
  { id: 'squadManagement', label: 'Squad Management', subtitle: 'Lineups, tactics and roles' },
  { id: 'developmentPlans', label: 'Development Plans', subtitle: 'Progress plans coming soon' },
]

const squadTabs = [
  { id: 'lineup', label: 'Lineup' },
  { id: 'tactics', label: 'Tactics' },
  { id: 'assignments', label: 'Assignments' },
]

const formationNames = [
  '4-4-2',
  '4-4-2 Diamond',
  '4-3-3 Holding',
  '4-3-3 Attack',
  '4-2-3-1',
  '4-1-4-1',
  '3-5-2',
  '3-4-3',
  '3-4-2-1',
  '5-3-2',
  '5-4-1',
  '4-5-1',
  '4-1-2-1-2',
  '4-2-2-2',
]

const formationLines = {
  '4-4-2': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LM', 'LCM', 'RCM', 'RM'], ['ST', 'ST']],
  '4-4-2 Diamond': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM'], ['LCM', 'RCM'], ['CAM'], ['ST', 'ST']],
  '4-3-3 Holding': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM'], ['LCM', 'RCM'], ['LW', 'ST', 'RW']],
  '4-3-3 Attack': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LCM', 'CM', 'RCM'], ['LW', 'ST', 'RW']],
  '4-2-3-1': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LDM', 'RDM'], ['LAM', 'CAM', 'RAM'], ['ST']],
  '4-1-4-1': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM'], ['LM', 'LCM', 'RCM', 'RM'], ['ST']],
  '3-5-2': [['GK'], ['LCB', 'CB', 'RCB'], ['LWB', 'LCM', 'CM', 'RCM', 'RWB'], ['ST', 'ST']],
  '3-4-3': [['GK'], ['LCB', 'CB', 'RCB'], ['LM', 'LCM', 'RCM', 'RM'], ['LW', 'ST', 'RW']],
  '3-4-2-1': [['GK'], ['LCB', 'CB', 'RCB'], ['LWB', 'LCM', 'RCM', 'RWB'], ['LAM', 'RAM'], ['ST']],
  '5-3-2': [['GK'], ['LWB', 'LCB', 'CB', 'RCB', 'RWB'], ['LCM', 'CM', 'RCM'], ['ST', 'ST']],
  '5-4-1': [['GK'], ['LWB', 'LCB', 'CB', 'RCB', 'RWB'], ['LM', 'LCM', 'RCM', 'RM'], ['ST']],
  '4-5-1': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LM', 'LCM', 'CM', 'RCM', 'RM'], ['ST']],
  '4-1-2-1-2': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM'], ['LCM', 'RCM'], ['CAM'], ['ST', 'ST']],
  '4-2-2-2': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LDM', 'RDM'], ['LAM', 'RAM'], ['ST', 'ST']],
}

const tacticPresets = [
  'Balanced',
  'Possession',
  'High Press',
  'Counter Attack',
  'Direct Play',
  'Long Ball',
  'Low Block',
  'Build from the Back',
  'Wide Play',
  'Fast Transition',
  'Compact Defending',
]

const defaultLineup = {
  lineupName: 'Default XI',
  formation: '4-3-3 Attack',
  startingXI: {},
  bench: [],
}

const defaultTactic = {
  formation: '4-3-3 Attack',
  preset: 'Balanced',
  settings: {
    buildUpStyle: 'Mixed',
    defensiveApproach: 'Balanced',
    pressingIntensity: 'Medium',
    teamWidth: 'Balanced',
    tempo: 'Balanced',
    focusArea: 'Mixed',
  },
}

const assignmentRoles = [
  { id: 'captain', label: 'Captain' },
  { id: 'viceCaptain', label: 'Vice Captain' },
  { id: 'penaltyTaker', label: 'Penalty Taker' },
  { id: 'leftFreeKick', label: 'Left Free Kick' },
  { id: 'rightFreeKick', label: 'Right Free Kick' },
  { id: 'longFreeKick', label: 'Long Free Kick' },
  { id: 'leftCorner', label: 'Left Corner' },
  { id: 'rightCorner', label: 'Right Corner' },
  { id: 'leftThrowIn', label: 'Left Throw-in' },
  { id: 'rightThrowIn', label: 'Right Throw-in' },
]

function createRecordId(prefix) {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${prefix}-${Date.now()}`
}

function getPlayerId(player, index = 0) {
  return player.id || `${getPlayerName(player).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`
}

function getPlayerName(player = {}) {
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

function getPlayerStatus(player) {
  if (player.status) {
    return player.status
  }

  if (!player.mainPosition || !player.preferredFoot) {
    return 'Needs Details'
  }

  return 'On Track'
}

function getMorale(player) {
  const status = getPlayerStatus(player)

  if (status === 'Needs Support' || status === 'Injured') {
    return 'Needs Support'
  }

  if (status === 'Improving' || status === 'Returning') {
    return 'Very High'
  }

  if (status === 'Needs Details') {
    return 'Neutral'
  }

  return 'Good'
}

function getPositionGroup(position = '') {
  const normalisedPosition = position.toLowerCase()

  if (normalisedPosition.includes('gk') || normalisedPosition.includes('goal')) {
    return 'GK'
  }

  if (normalisedPosition.includes('def') || normalisedPosition.includes('back') || normalisedPosition.includes('cb') || normalisedPosition.includes('rb') || normalisedPosition.includes('lb')) {
    return 'DEF'
  }

  if (normalisedPosition.includes('mid') || normalisedPosition.includes('wing') || normalisedPosition.includes('cm') || normalisedPosition.includes('dm') || normalisedPosition.includes('am') || normalisedPosition.includes('lm') || normalisedPosition.includes('rm')) {
    return 'MID'
  }

  if (normalisedPosition.includes('fwd') || normalisedPosition.includes('for') || normalisedPosition.includes('striker') || normalisedPosition.includes('st') || normalisedPosition.includes('lw') || normalisedPosition.includes('rw')) {
    return 'FWD'
  }

  return position || 'No position set'
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

function getLatestNoteByType(player, type) {
  return getPlayerNotes(player).find((note) => note.type === type)
}

function getProfileCompleteness(player) {
  const notes = getPlayerNotes(player)
  const checks = [
    player.fullName,
    player.shirtNumber,
    player.age,
    player.mainPosition,
    player.preferredFoot,
    player.developmentFocus,
    player.strengths,
    player.areasToImprove,
    notes.length > 0,
    ...ratingFields.map((field) => getRatingValue(player, field.key)),
  ]

  const completed = checks.filter((value) => value !== null && value !== undefined && value !== '').length
  return Math.round((completed / checks.length) * 100)
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

function getFormationSlots(formation) {
  const lines = formationLines[formation] || formationLines[defaultLineup.formation]
  const yPositions = lines.length === 6 ? [89, 72, 58, 44, 30, 15] : lines.length === 5 ? [89, 70, 53, 36, 17] : [89, 66, 43, 18]

  return lines.flatMap((line, lineIndex) => line.map((label, index) => {
    const count = line.length
    const x = count === 1 ? 50 : 12 + (index * (76 / Math.max(count - 1, 1)))

    return {
      id: `${lineIndex}-${index}-${label}`,
      label,
      x,
      y: yPositions[lineIndex] || 50,
    }
  }))
}

function getPlayerById(players, playerId) {
  return players.find((player, index) => getPlayerId(player, index) === playerId || player.id === playerId)
}

function normaliseLineup(savedLineup) {
  return {
    ...defaultLineup,
    ...(savedLineup || {}),
    startingXI: savedLineup?.startingXI && typeof savedLineup.startingXI === 'object' ? savedLineup.startingXI : {},
    bench: Array.isArray(savedLineup?.bench) ? savedLineup.bench : [],
  }
}

function normaliseTactic(savedTactic) {
  return {
    ...defaultTactic,
    ...(savedTactic || {}),
    settings: {
      ...defaultTactic.settings,
      ...(savedTactic?.settings || {}),
    },
  }
}

function getPlayerSummaryCounts(players) {
  return players.reduce((counts, player) => {
    const group = getPositionGroup(player.mainPosition)
    const key = ['GK', 'DEF', 'MID', 'FWD'].includes(group) ? group : 'Other'
    counts[key] += 1
    return counts
  }, { GK: 0, DEF: 0, MID: 0, FWD: 0, Other: 0 })
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

function PlayersOperatingSystem({ players, onAddPlayer, onDeletePlayer, onUpdatePlayer, teamIdentity }) {
  const [activeSection, setActiveSection] = useState('playerCentre')
  const [activeSquadTab, setActiveSquadTab] = useState('lineup')
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0] ? getPlayerId(players[0], 0) : null)
  const [selectedLineupPlayerId, setSelectedLineupPlayerId] = useState(players[0] ? getPlayerId(players[0], 0) : null)
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('All positions')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [actionMenu, setActionMenu] = useState(null)
  const [profilePlayerId, setProfilePlayerId] = useState(null)
  const [formMode, setFormMode] = useState('view')
  const [formData, setFormData] = useState(emptyPlayer)
  const [avatarMessage, setAvatarMessage] = useState('')
  const [message, setMessage] = useState('')
  const [notePlayerId, setNotePlayerId] = useState(null)
  const [noteForm, setNoteForm] = useState({ type: 'General', text: '' })
  const [focusPlayerId, setFocusPlayerId] = useState(null)
  const [focusValue, setFocusValue] = useState('')
  const [lineup, setLineup] = useState(() => normaliseLineup(getStorageItem(lineupStorageKey, null)))
  const [tactic, setTactic] = useState(() => normaliseTactic(getStorageItem(tacticalStorageKey, null)))
  const [assignments, setAssignments] = useState(() => getStorageItem(assignmentsStorageKey, {}))
  const menuRef = useRef(null)

  const playerOptions = useMemo(
    () => players.map((player, index) => ({ player, id: getPlayerId(player, index) })),
    [players],
  )
  const positionOptions = useMemo(() => getPositionOptions(players), [players])
  const filteredPlayers = useMemo(() => {
    const normalisedSearch = searchTerm.trim().toLowerCase()

    return players.filter((player) => {
      const name = getPlayerName(player).toLowerCase()
      const shirtNumber = String(player.shirtNumber || '').toLowerCase()
      const matchesSearch = !normalisedSearch || name.includes(normalisedSearch) || shirtNumber.includes(normalisedSearch)
      const matchesPosition = playerMatchesPosition(player, positionFilter)
      const status = getPlayerStatus(player)
      const matchesStatus = statusFilter === 'All statuses' || status === statusFilter

      return matchesSearch && matchesPosition && matchesStatus
    })
  }, [players, positionFilter, searchTerm, statusFilter])

  const selectedPlayer = getPlayerById(players, selectedPlayerId) || filteredPlayers[0] || players[0] || null
  const profilePlayer = getPlayerById(players, profilePlayerId)
  const notePlayer = getPlayerById(players, notePlayerId)
  const focusPlayer = getPlayerById(players, focusPlayerId)
  const selectedLineupPlayer = getPlayerById(players, selectedLineupPlayerId) || selectedPlayer
  const squadCounts = getPlayerSummaryCounts(players)
  const focusAreas = getFocusAreas(players)

  useEffect(() => {
    if (!players.length) {
      setSelectedPlayerId(null)
      return
    }

    if (!selectedPlayerId || !getPlayerById(players, selectedPlayerId)) {
      setSelectedPlayerId(getPlayerId(players[0], 0))
    }
  }, [players, selectedPlayerId])

  useEffect(() => {
    if (!actionMenu) {
      return undefined
    }

    function handlePointerDown(event) {
      if (menuRef.current?.contains(event.target)) {
        return
      }

      setActionMenu(null)
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setActionMenu(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [actionMenu])

  function clearFilters() {
    setSearchTerm('')
    setPositionFilter('All positions')
    setStatusFilter('All statuses')
  }

  function openActionMenu(event, playerId) {
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()
    const menuWidth = 286
    const left = Math.min(Math.max(16, rect.right - menuWidth), window.innerWidth - menuWidth - 16)
    const top = Math.min(rect.bottom + 8, window.innerHeight - 430)

    setActionMenu({ playerId, left, top })
  }

  function startAddingPlayer() {
    setFormMode('add')
    setFormData(emptyPlayer)
    setAvatarMessage('')
    setMessage('')
    setActionMenu(null)
  }

  function startEditingPlayer(playerId = selectedPlayerId) {
    const targetPlayer = getPlayerById(players, playerId)

    if (!targetPlayer) {
      return
    }

    setSelectedPlayerId(playerId)
    setFormMode('edit')
    setFormData(getPlayerForForm(targetPlayer))
    setAvatarMessage('')
    setMessage('')
    setActionMenu(null)
  }

  function closeEditor() {
    setFormMode('view')
    setFormData(emptyPlayer)
    setAvatarMessage('')
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
    setMessage('')
  }

  async function handleAvatarFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    setAvatarMessage('')

    try {
      const avatarDataUrl = await processAvatarFile(file)
      setFormData((currentData) => ({ ...currentData, avatarDataUrl }))
      setAvatarMessage('Avatar ready to save.')
    } catch (error) {
      setAvatarMessage(error.message)
    }
  }

  function savePlayer(event) {
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

    if (formMode === 'edit') {
      const targetPlayer = getPlayerById(players, selectedPlayerId)

      if (targetPlayer?.id) {
        onUpdatePlayer(targetPlayer.id, cleanPlayer)
        setMessage('Player updated and saved locally.')
      }
      closeEditor()
      return
    }

    const newPlayerId = onAddPlayer(cleanPlayer)
    setSelectedPlayerId(newPlayerId)
    setSelectedLineupPlayerId(newPlayerId)
    setMessage('Player created and saved locally.')
    closeEditor()
  }

  function deletePlayer(playerId = selectedPlayerId) {
    const targetPlayer = getPlayerById(players, playerId)

    if (!targetPlayer?.id) {
      return
    }

    const shouldDelete = window.confirm(`Remove ${getPlayerName(targetPlayer)} from this squad?`)

    if (!shouldDelete) {
      return
    }

    onDeletePlayer(targetPlayer.id)
    setActionMenu(null)
    setProfilePlayerId(null)
    setMessage('Player removed locally.')
  }

  function openNoteForPlayer(playerId, type = 'General') {
    const targetPlayer = getPlayerById(players, playerId)

    if (!targetPlayer) {
      return
    }

    setNotePlayerId(playerId)
    setNoteForm({ type, text: '' })
    setActionMenu(null)
  }

  function saveNote(event) {
    event.preventDefault()

    if (!notePlayer || !noteForm.text.trim()) {
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

    if (notePlayer.id) {
      onUpdatePlayer(notePlayer.id, {
        notes: [nextNote, ...existingNotes],
        updatedAt: now,
      })
    }

    setSelectedPlayerId(notePlayer.id || notePlayerId)
    setNotePlayerId(null)
    setNoteForm({ type: 'General', text: '' })
    setMessage(`${nextNote.type} note saved locally.`)
  }

  function openDevelopmentFocus(playerId) {
    const targetPlayer = getPlayerById(players, playerId)

    if (!targetPlayer) {
      return
    }

    setFocusPlayerId(playerId)
    setFocusValue(targetPlayer.developmentFocus || '')
    setActionMenu(null)
  }

  function saveDevelopmentFocus(event) {
    event.preventDefault()

    if (!focusPlayer?.id) {
      setFocusPlayerId(null)
      return
    }

    onUpdatePlayer(focusPlayer.id, {
      developmentFocus: focusValue.trim(),
      updatedAt: new Date().toISOString(),
    })
    setMessage('Development focus updated locally.')
    setFocusPlayerId(null)
  }

  function saveLineup(nextLineup, nextMessage = 'Lineup saved locally.') {
    setLineup(nextLineup)
    setStorageItem(lineupStorageKey, nextLineup)
    setMessage(nextMessage)
  }

  function assignPlayerToSlot(slotId, playerId) {
    const nextStartingXI = Object.entries(lineup.startingXI || {}).reduce((slots, [currentSlotId, currentPlayerId]) => {
      if (currentPlayerId !== playerId && currentSlotId !== slotId) {
        slots[currentSlotId] = currentPlayerId
      }
      return slots
    }, {})

    if (playerId) {
      nextStartingXI[slotId] = playerId
    }

    const nextLineup = {
      ...lineup,
      startingXI: nextStartingXI,
      bench: (lineup.bench || []).filter((benchPlayerId) => benchPlayerId !== playerId),
    }

    saveLineup(nextLineup, 'Starting XI updated locally.')
    setSelectedLineupPlayerId(playerId || selectedLineupPlayerId)
  }

  function addPlayerToStartingXI(playerId) {
    const slots = getFormationSlots(lineup.formation)
    const alreadyAssignedSlot = Object.entries(lineup.startingXI || {}).find(([, currentPlayerId]) => currentPlayerId === playerId)?.[0]
    const targetSlot = alreadyAssignedSlot || slots.find((slot) => !lineup.startingXI?.[slot.id])?.id

    if (!targetSlot) {
      setMessage('Starting XI is full. Remove a player before adding another one.')
      return
    }

    assignPlayerToSlot(targetSlot, playerId)
    setActiveSection('squadManagement')
    setActiveSquadTab('lineup')
    setActionMenu(null)
  }

  function addPlayerToBench(playerId) {
    const nextStartingXI = Object.entries(lineup.startingXI || {}).reduce((slots, [slotId, currentPlayerId]) => {
      if (currentPlayerId !== playerId) {
        slots[slotId] = currentPlayerId
      }
      return slots
    }, {})
    const nextBench = [...new Set([...(lineup.bench || []), playerId])]

    saveLineup({ ...lineup, startingXI: nextStartingXI, bench: nextBench }, 'Bench updated locally.')
    setSelectedLineupPlayerId(playerId)
    setActiveSection('squadManagement')
    setActiveSquadTab('lineup')
    setActionMenu(null)
  }

  function removeFromBench(playerId) {
    saveLineup({ ...lineup, bench: (lineup.bench || []).filter((benchPlayerId) => benchPlayerId !== playerId) }, 'Bench updated locally.')
  }

  function resetLineup() {
    const shouldReset = window.confirm('Reset this lineup? Player profiles will not be affected.')

    if (!shouldReset) {
      return
    }

    saveLineup({ ...defaultLineup, formation: lineup.formation }, 'Lineup reset locally.')
  }

  function setLineupFormation(formation) {
    saveLineup({ ...lineup, formation }, 'Formation updated locally.')
  }

  function saveTactic(nextTactic = tactic, nextMessage = 'Tactic saved locally.') {
    setTactic(nextTactic)
    setStorageItem(tacticalStorageKey, nextTactic)
    setMessage(nextMessage)
  }

  function updateTacticSetting(settingName, value) {
    setTactic((currentTactic) => ({
      ...currentTactic,
      settings: {
        ...currentTactic.settings,
        [settingName]: value,
      },
    }))
  }

  function updateAssignment(roleId, playerId) {
    const nextAssignments = {
      ...assignments,
      [roleId]: playerId,
    }

    setAssignments(nextAssignments)
    setStorageItem(assignmentsStorageKey, nextAssignments)
    setMessage('Assignments saved locally.')
  }

  return (
    <section className="players-os-page">
      <div className="players-os-backdrop" aria-hidden="true" />
      <header className="players-os-header">
        <div className="players-os-title-block">
          <span className="players-os-kicker">Players module</span>
          <h3>Players</h3>
          <p>Manage your squad, lineups and player development.</p>
        </div>

        <div className="players-os-top-tools">
          <label className="players-os-search">
            <span>Search</span>
            <input
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search players"
              type="search"
              value={searchTerm}
            />
          </label>
          <button className="players-os-secondary" type="button" onClick={clearFilters}>Filter</button>
          <button className="players-os-primary" type="button" onClick={startAddingPlayer}>Add Player</button>
        </div>
      </header>

      {(message) && <p className="players-os-message">{message}</p>}

      <nav className="players-os-tabs" aria-label="Players sections">
        {sections.map((section, index) => (
          <button
            className={activeSection === section.id ? 'active' : ''}
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{section.label}</strong>
            <small>{section.subtitle}</small>
          </button>
        ))}
      </nav>

      {activeSection === 'playerCentre' && (
        <PlayerCentre
          actionMenu={actionMenu}
          filteredPlayers={filteredPlayers}
          onActionMenu={openActionMenu}
          onAddPlayer={startAddingPlayer}
          onClearFilters={clearFilters}
          onEditPlayer={startEditingPlayer}
          onOpenNote={openNoteForPlayer}
          onOpenProfile={setProfilePlayerId}
          onPositionFilter={setPositionFilter}
          onSearch={setSearchTerm}
          onSelectPlayer={setSelectedPlayerId}
          onStatusFilter={setStatusFilter}
          players={players}
          positionFilter={positionFilter}
          positionOptions={positionOptions}
          searchTerm={searchTerm}
          selectedPlayer={selectedPlayer}
          selectedPlayerId={selectedPlayerId}
          statusFilter={statusFilter}
        />
      )}

      {activeSection === 'squadManagement' && (
        <SquadManagement
          activeSquadTab={activeSquadTab}
          assignments={assignments}
          focusAreas={focusAreas}
          lineup={lineup}
          onAddBench={addPlayerToBench}
          onAssignSlot={assignPlayerToSlot}
          onChangeAssignment={updateAssignment}
          onChangeLineupFormation={setLineupFormation}
          onChangeSquadTab={setActiveSquadTab}
          onRemoveBench={removeFromBench}
          onResetLineup={resetLineup}
          onSaveLineup={() => saveLineup(lineup)}
          onSaveTactic={() => saveTactic(tactic)}
          onSelectLineupPlayer={setSelectedLineupPlayerId}
          onTacticChange={setTactic}
          onTacticSettingChange={updateTacticSetting}
          players={players}
          selectedLineupPlayer={selectedLineupPlayer}
          selectedLineupPlayerId={selectedLineupPlayerId}
          tactic={tactic}
        />
      )}

      {activeSection === 'developmentPlans' && <DevelopmentPlans focusAreas={focusAreas} players={players} />}

      {actionMenu && (
        <PlayerActionMenu
          menuRef={menuRef}
          onAddBench={addPlayerToBench}
          onAddNote={openNoteForPlayer}
          onAddStartingXI={addPlayerToStartingXI}
          onClose={() => setActionMenu(null)}
          onDelete={deletePlayer}
          onEdit={startEditingPlayer}
          onOpenFocus={openDevelopmentFocus}
          onOpenProfile={setProfilePlayerId}
          onOpenSquadManagement={(playerId) => {
            setSelectedLineupPlayerId(playerId)
            setActiveSection('squadManagement')
            setActiveSquadTab('lineup')
            setActionMenu(null)
          }}
          player={getPlayerById(players, actionMenu.playerId)}
          playerId={actionMenu.playerId}
          style={{ left: `${actionMenu.left}px`, top: `${Math.max(12, actionMenu.top)}px` }}
        />
      )}

      {profilePlayer && (
        <FullProfileModal
          onAddNote={() => openNoteForPlayer(profilePlayerId, 'General')}
          onClose={() => setProfilePlayerId(null)}
          onDelete={() => deletePlayer(profilePlayerId)}
          onEdit={() => startEditingPlayer(profilePlayerId)}
          player={profilePlayer}
        />
      )}

      {(formMode === 'add' || formMode === 'edit') && (
        <PlayerEditorModal
          avatarMessage={avatarMessage}
          formData={formData}
          formMode={formMode}
          onAvatarFile={handleAvatarFile}
          onCancel={closeEditor}
          onChange={handleFormChange}
          onRemoveAvatar={() => setFormData((currentData) => ({ ...currentData, avatarDataUrl: '' }))}
          onSubmit={savePlayer}
        />
      )}

      {notePlayer && (
        <NoteModal
          noteForm={noteForm}
          onChange={(event) => setNoteForm((currentNote) => ({ ...currentNote, [event.target.name]: event.target.value }))}
          onClose={() => setNotePlayerId(null)}
          onSave={saveNote}
          player={notePlayer}
        />
      )}

      {focusPlayer && (
        <FocusModal
          focusValue={focusValue}
          onChange={setFocusValue}
          onClose={() => setFocusPlayerId(null)}
          onSave={saveDevelopmentFocus}
          player={focusPlayer}
        />
      )}
    </section>
  )
}

function PlayerCentre({ filteredPlayers, onActionMenu, onAddPlayer, onClearFilters, onEditPlayer, onOpenNote, onOpenProfile, onPositionFilter, onSearch, onSelectPlayer, onStatusFilter, players, positionFilter, positionOptions, searchTerm, selectedPlayer, selectedPlayerId, statusFilter }) {
  return (
    <div className="player-centre-grid">
      <aside className="player-list-panel dark-panel">
        <div className="panel-topline">
          <div>
            <span className="players-os-kicker">Player list</span>
            <h4>{players.length} players</h4>
          </div>
          <button type="button" onClick={onClearFilters}>View all</button>
        </div>

        <div className="player-list-filters">
          <input onChange={(event) => onSearch(event.target.value)} placeholder="Search name or number" type="search" value={searchTerm} />
          <select onChange={(event) => onPositionFilter(event.target.value)} value={positionFilter}>
            {positionOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select onChange={(event) => onStatusFilter(event.target.value)} value={statusFilter}>
            <option>All statuses</option>
            {playerStatuses.map((status) => <option key={status}>{status}</option>)}
            <option>Needs Details</option>
          </select>
        </div>

        <div className="player-list-table-head" role="row">
          <span>#</span>
          <span>POS</span>
          <span>PLAYER</span>
          <span>MORALE</span>
          <span>STATUS</span>
          <span>ACTIONS</span>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="players-os-empty">
            <h4>No players yet.</h4>
            <p>Add players to start building your squad.</p>
            <button className="players-os-primary" type="button" onClick={onAddPlayer}>Add Player</button>
          </div>
        ) : (
          <div className="player-row-scroll">
            {filteredPlayers.map((player, index) => {
              const playerId = getPlayerId(player, index)

              return (
                <PlayerRow
                  isSelected={playerId === selectedPlayerId || player.id === selectedPlayerId}
                  key={playerId}
                  onActionMenu={onActionMenu}
                  onSelect={() => onSelectPlayer(playerId)}
                  player={player}
                  playerId={playerId}
                />
              )
            })}
          </div>
        )}
      </aside>

      <SelectedPlayerPanel
        onAddNote={() => selectedPlayer && onOpenNote(selectedPlayer.id || selectedPlayerId, 'General')}
        onEdit={() => selectedPlayer && onEditPlayer(selectedPlayer.id || selectedPlayerId)}
        onOpenProfile={() => selectedPlayer && onOpenProfile(selectedPlayer.id || selectedPlayerId)}
        player={selectedPlayer}
      />
    </div>
  )
}

function PlayerRow({ isSelected, onActionMenu, onSelect, player, playerId }) {
  return (
    <button className={isSelected ? 'player-row selected' : 'player-row'} type="button" onClick={onSelect}>
      <span className="player-number">{player.shirtNumber || '--'}</span>
      <span className="player-position">{player.mainPosition || 'N/A'}</span>
      <span className="player-row-name">
        <PlayerAvatar player={player} size="sm" />
        <span>
          <strong>{getPlayerName(player)}</strong>
          <small>{player.developmentFocus || 'No development focus'}</small>
        </span>
      </span>
      <MoralePill morale={getMorale(player)} />
      <span className={`player-os-status status-${getPlayerStatus(player).toLowerCase().replaceAll(' ', '-')}`}>{getPlayerStatus(player)}</span>
      <span
        aria-label={`Open actions for ${getPlayerName(player)}`}
        className="row-action-button"
        onClick={(event) => onActionMenu(event, playerId)}
        role="button"
        tabIndex="0"
      >
        ...
      </span>
    </button>
  )
}

function SelectedPlayerPanel({ onAddNote, onEdit, onOpenProfile, player }) {
  if (!player) {
    return (
      <section className="selected-player-panel dark-panel players-os-empty">
        <h4>Select a player</h4>
        <p>Your selected player profile will appear here.</p>
      </section>
    )
  }

  const notes = getPlayerNotes(player)
  const coachNote = notes[0]
  const trainingNote = getLatestNoteByType(player, 'Training')
  const matchNote = getLatestNoteByType(player, 'Match')
  const completeness = getProfileCompleteness(player)
  const averageRating = getAverageRating(player)

  return (
    <section className="selected-player-panel dark-panel">
      <header className="selected-player-hero">
        <div className="shirt-ghost">{player.shirtNumber || '--'}</div>
        <PlayerAvatar player={player} size="xl" className="hero-avatar" />
        <div className="selected-player-title">
          <span className={`player-os-status status-${getPlayerStatus(player).toLowerCase().replaceAll(' ', '-')}`}>{getPlayerStatus(player)}</span>
          <h4>{getPlayerName(player)}</h4>
          <p>{player.mainPosition || 'No position set'}{player.secondaryPosition ? ` / ${player.secondaryPosition}` : ''}</p>
        </div>
      </header>

      <div className="player-fact-strip">
        <Fact label="No." value={player.shirtNumber || '--'} />
        <Fact label="Age" value={player.age || 'Not set'} />
        <Fact label="Foot" value={player.preferredFoot || 'Not set'} />
        <Fact label="Average" value={averageRating === null ? '--' : averageRating.toFixed(1)} />
      </div>

      <div className="player-status-strip">
        <StatusTile label="Availability" value={getPlayerStatus(player) === 'Injured' ? 'Unavailable' : 'Available'} tone="green" />
        <StatusTile label="Morale" value={getMorale(player)} tone="green" />
        <StatusTile label="Training Status" value={getPlayerStatus(player) === 'Needs Details' ? 'Needs details' : 'On Track'} tone="cyan" />
        <StatusTile label="Development Focus" value={player.developmentFocus || 'Not set'} tone="blue" />
      </div>

      <div className="player-detail-card-grid">
        <article className="detail-card coach-note-card">
          <span className="players-os-kicker">Coach note summary</span>
          <p>{coachNote ? truncateText(coachNote.text, 170) : 'No coach notes yet.'}</p>
          <small>{coachNote ? formatDate(coachNote.createdAt) : 'Add a note to start a feedback trail.'}</small>
        </article>

        <article className="detail-card completeness-card">
          <span className="players-os-kicker">Profile completeness</span>
          <div className="completion-ring" style={{ '--completion': `${completeness}%` }}>
            <strong>{completeness}%</strong>
          </div>
          <small>Profile Complete</small>
        </article>

        <FeedbackCard title="Latest Training Feedback" note={trainingNote} fallback="No training feedback yet." />
        <FeedbackCard title="Latest Match Feedback" note={matchNote} fallback="No match feedback yet." />
      </div>

      <section className="recent-notes-panel detail-card">
        <div className="panel-topline compact">
          <span className="players-os-kicker">Recent notes</span>
          <button type="button" onClick={onAddNote}>Add Coach Note</button>
        </div>
        {notes.length > 0 ? (
          <div className="recent-note-list">
            {notes.slice(0, 3).map((note) => (
              <article key={note.id}>
                <strong>{note.type}</strong>
                <p>{truncateText(note.text, 92)}</p>
                <small>{formatDate(note.createdAt)}</small>
              </article>
            ))}
          </div>
        ) : (
          <p>No recent notes yet.</p>
        )}
      </section>

      <div className="selected-player-actions">
        <button className="players-os-primary" type="button" onClick={onOpenProfile}>Open Full Profile</button>
        <button className="players-os-secondary" type="button" onClick={onEdit}>Edit Player Details</button>
      </div>
    </section>
  )
}

function SquadManagement({ activeSquadTab, assignments, focusAreas, lineup, onAddBench, onAssignSlot, onChangeAssignment, onChangeLineupFormation, onChangeSquadTab, onRemoveBench, onResetLineup, onSaveLineup, onSaveTactic, onSelectLineupPlayer, onTacticChange, onTacticSettingChange, players, selectedLineupPlayer, selectedLineupPlayerId, tactic }) {
  return (
    <section className="squad-management-section">
      <div className="squad-management-header dark-panel">
        <div>
          <span className="players-os-kicker">Squad Management</span>
          <h4>Build your best XI, tailor tactics and assign key roles.</h4>
        </div>
        <nav className="squad-subtabs" aria-label="Squad management sections">
          {squadTabs.map((tab) => (
            <button className={activeSquadTab === tab.id ? 'active' : ''} key={tab.id} type="button" onClick={() => onChangeSquadTab(tab.id)}>{tab.label}</button>
          ))}
        </nav>
      </div>

      {activeSquadTab === 'lineup' && (
        <LineupTab
          lineup={lineup}
          onAddBench={onAddBench}
          onAssignSlot={onAssignSlot}
          onChangeFormation={onChangeLineupFormation}
          onRemoveBench={onRemoveBench}
          onReset={onResetLineup}
          onSave={onSaveLineup}
          onSelectPlayer={onSelectLineupPlayer}
          players={players}
          selectedLineupPlayer={selectedLineupPlayer}
          selectedLineupPlayerId={selectedLineupPlayerId}
        />
      )}

      {activeSquadTab === 'tactics' && (
        <TacticsTab
          onSave={onSaveTactic}
          onTacticChange={onTacticChange}
          onTacticSettingChange={onTacticSettingChange}
          tactic={tactic}
        />
      )}

      {activeSquadTab === 'assignments' && (
        <AssignmentsTab
          assignments={assignments}
          focusAreas={focusAreas}
          onChangeAssignment={onChangeAssignment}
          players={players}
        />
      )}
    </section>
  )
}

function LineupTab({ lineup, onAddBench, onAssignSlot, onChangeFormation, onRemoveBench, onReset, onSave, onSelectPlayer, players, selectedLineupPlayer, selectedLineupPlayerId }) {
  const slots = getFormationSlots(lineup.formation)
  const benchPlayers = (lineup.bench || []).map((playerId) => getPlayerById(players, playerId)).filter(Boolean)

  return (
    <div className="lineup-layout">
      <section className="lineup-main dark-panel">
        <div className="lineup-toolbar">
          <label>
            Formation
            <select onChange={(event) => onChangeFormation(event.target.value)} value={lineup.formation}>
              {formationNames.map((formation) => <option key={formation}>{formation}</option>)}
            </select>
          </label>
          <div>
            <button className="players-os-primary" type="button" onClick={onSave}>Save Lineup</button>
            <button className="players-os-secondary" type="button" onClick={onReset}>Reset Lineup</button>
          </div>
        </div>

        <FormationPitch
          lineup={lineup}
          onAssignSlot={onAssignSlot}
          onSelectPlayer={onSelectPlayer}
          players={players}
          slots={slots}
        />

        <section className="bench-panel">
          <div className="panel-topline compact">
            <span className="players-os-kicker">Bench</span>
            <select onChange={(event) => event.target.value && onAddBench(event.target.value)} value="">
              <option value="">Add player to bench</option>
              {players.map((player, index) => {
                const playerId = getPlayerId(player, index)
                return <option key={playerId} value={playerId}>{getPlayerName(player)}</option>
              })}
            </select>
          </div>
          {benchPlayers.length > 0 ? (
            <div className="bench-list">
              {benchPlayers.map((player, index) => {
                const playerId = getPlayerId(player, index)
                return (
                  <article className="bench-card" key={playerId}>
                    <PlayerAvatar player={player} size="xs" />
                    <span><strong>{getPlayerName(player)}</strong><small>{player.mainPosition || 'No position'}</small></span>
                    <button type="button" onClick={() => onRemoveBench(playerId)}>Remove</button>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="empty-dark-copy">No bench players selected yet.</p>
          )}
        </section>
      </section>

      <LineupSidePanel player={selectedLineupPlayer} selectedLineupPlayerId={selectedLineupPlayerId} />
    </div>
  )
}

function FormationPitch({ lineup, onAssignSlot, onSelectPlayer, players, slots }) {
  return (
    <div className="formation-pitch" aria-label="Lineup pitch">
      <div className="pitch-markings" aria-hidden="true" />
      {slots.map((slot) => {
        const playerId = lineup.startingXI?.[slot.id] || ''
        const player = getPlayerById(players, playerId)

        return (
          <div className="lineup-slot" key={slot.id} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
            <button type="button" onClick={() => playerId && onSelectPlayer(playerId)}>
              {player ? <PlayerAvatar player={player} size="xs" /> : <span className="empty-slot-dot">+</span>}
              <strong>{player ? getPlayerName(player) : 'Select player'}</strong>
              <small>{slot.label}</small>
            </button>
            <select onChange={(event) => onAssignSlot(slot.id, event.target.value)} value={playerId}>
              <option value="">Select player</option>
              {players.map((candidate, index) => {
                const candidateId = getPlayerId(candidate, index)
                return <option key={candidateId} value={candidateId}>{getPlayerName(candidate)}</option>
              })}
            </select>
          </div>
        )
      })}
    </div>
  )
}

function LineupSidePanel({ player }) {
  if (!player) {
    return (
      <aside className="lineup-side dark-panel players-os-empty">
        <h4>Select a player</h4>
        <p>Player details for the lineup will appear here.</p>
      </aside>
    )
  }

  return (
    <aside className="lineup-side dark-panel">
      <div className="lineup-player-card">
        <PlayerAvatar player={player} size="lg" />
        <div>
          <span className="players-os-kicker">Selected player</span>
          <h4>{getPlayerName(player)}</h4>
          <p>{player.mainPosition || 'No position'} - {player.preferredFoot || 'Foot not set'}</p>
        </div>
      </div>
      <div className="lineup-side-grid">
        <StatusTile label="Morale" value={getMorale(player)} tone="green" />
        <StatusTile label="Availability" value={getPlayerStatus(player) === 'Injured' ? 'Unavailable' : 'Available'} tone="green" />
        <StatusTile label="Development Focus" value={player.developmentFocus || 'Not set'} tone="cyan" />
        <StatusTile label="Profile" value={`${getProfileCompleteness(player)}% complete`} tone="blue" />
      </div>
    </aside>
  )
}

function TacticsTab({ onSave, onTacticChange, onTacticSettingChange, tactic }) {
  return (
    <div className="tactics-layout">
      <section className="tactics-control-panel dark-panel">
        <div className="panel-topline compact">
          <span className="players-os-kicker">Tactical setup</span>
          <button className="players-os-primary" type="button" onClick={onSave}>Save Tactic</button>
        </div>

        <label>
          Formation
          <select onChange={(event) => onTacticChange({ ...tactic, formation: event.target.value })} value={tactic.formation}>
            {formationNames.map((formation) => <option key={formation}>{formation}</option>)}
          </select>
        </label>

        <div className="preset-grid">
          {tacticPresets.map((preset) => (
            <button
              className={tactic.preset === preset ? 'active' : ''}
              key={preset}
              type="button"
              onClick={() => onTacticChange({ ...tactic, preset })}
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="tactic-settings-grid">
          <TacticSelect label="Build-up style" name="buildUpStyle" options={['Short passing', 'Mixed', 'Direct']} settings={tactic.settings} onChange={onTacticSettingChange} />
          <TacticSelect label="Defensive approach" name="defensiveApproach" options={['High line', 'Balanced', 'Low block']} settings={tactic.settings} onChange={onTacticSettingChange} />
          <TacticSelect label="Pressing intensity" name="pressingIntensity" options={['Low', 'Medium', 'High']} settings={tactic.settings} onChange={onTacticSettingChange} />
          <TacticSelect label="Team width" name="teamWidth" options={['Narrow', 'Balanced', 'Wide']} settings={tactic.settings} onChange={onTacticSettingChange} />
          <TacticSelect label="Tempo" name="tempo" options={['Slow', 'Balanced', 'Fast']} settings={tactic.settings} onChange={onTacticSettingChange} />
          <TacticSelect label="Focus area" name="focusArea" options={['Central', 'Wide', 'Mixed']} settings={tactic.settings} onChange={onTacticSettingChange} />
        </div>
      </section>

      <section className="tactic-preview-panel dark-panel">
        <div className="panel-topline compact">
          <span className="players-os-kicker">Pitch preview</span>
          <strong>{tactic.formation}</strong>
        </div>
        <MiniFormationPitch formation={tactic.formation} />
        <div className="tactic-summary-grid">
          <StatusTile label="Preset" value={tactic.preset} tone="cyan" />
          <StatusTile label="Build-up" value={tactic.settings.buildUpStyle} tone="blue" />
          <StatusTile label="Press" value={tactic.settings.pressingIntensity} tone="green" />
          <StatusTile label="Tempo" value={tactic.settings.tempo} tone="green" />
        </div>
      </section>
    </div>
  )
}

function TacticSelect({ label, name, onChange, options, settings }) {
  return (
    <label>
      {label}
      <select onChange={(event) => onChange(name, event.target.value)} value={settings[name]}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  )
}

function MiniFormationPitch({ formation }) {
  const slots = getFormationSlots(formation)

  return (
    <div className="mini-formation-pitch">
      <div className="pitch-markings" aria-hidden="true" />
      {slots.map((slot) => (
        <span key={slot.id} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>{slot.label}</span>
      ))}
    </div>
  )
}

function AssignmentsTab({ assignments, focusAreas, onChangeAssignment, players }) {
  const assignedPlayerIds = Object.values(assignments || {}).filter(Boolean)
  const assignedPlayers = assignedPlayerIds.map((playerId) => getPlayerById(players, playerId)).filter(Boolean)

  return (
    <div className="assignments-layout">
      <section className="assignments-list dark-panel">
        <div className="panel-topline compact">
          <span className="players-os-kicker">Key roles</span>
          <strong>{assignedPlayers.length} assigned</strong>
        </div>
        {assignmentRoles.map((role) => (
          <label className="assignment-row" key={role.id}>
            <span className="assignment-icon">{role.label.slice(0, 1)}</span>
            <strong>{role.label}</strong>
            <select onChange={(event) => onChangeAssignment(role.id, event.target.value)} value={assignments?.[role.id] || ''}>
              <option value="">Select player</option>
              {players.map((player, index) => {
                const playerId = getPlayerId(player, index)
                return <option key={playerId} value={playerId}>{getPlayerName(player)}</option>
              })}
            </select>
          </label>
        ))}
      </section>

      <aside className="assignments-preview dark-panel">
        <span className="players-os-kicker">Assignments preview</span>
        {assignedPlayers.length > 0 ? (
          <div className="assignment-preview-list">
            {assignmentRoles.filter((role) => assignments?.[role.id]).slice(0, 6).map((role) => {
              const player = getPlayerById(players, assignments[role.id])
              return (
                <article key={role.id}>
                  <strong>{role.label}</strong>
                  <span>{player ? getPlayerName(player) : 'Player no longer available'}</span>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="empty-dark-copy">Assign captains, set pieces and restarts to make matchday roles clear.</p>
        )}
        <div className="focus-mini-list">
          <span className="players-os-kicker">Development themes</span>
          {focusAreas.length > 0 ? focusAreas.map((focus) => <small key={focus.label}>{focus.label} - {focus.count} player{focus.count === 1 ? '' : 's'}</small>) : <small>No focus themes set yet.</small>}
        </div>
      </aside>
    </div>
  )
}

function DevelopmentPlans({ focusAreas, players }) {
  return (
    <section className="development-plans-page dark-panel">
      <span className="players-os-kicker">Development Plans</span>
      <h4>Build individual plans, track progress and connect feedback to player growth.</h4>
      <p>This section is ready as the future home for individual development plans. The current release keeps it as a lightweight placeholder.</p>
      <div className="development-plan-cards">
        <article>
          <span>01</span>
          <strong>Individual Development Plans</strong>
          <p>Turn each player focus into clear targets and coach actions.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Training Feedback Trends</strong>
          <p>Connect session feedback to visible player growth over time.</p>
        </article>
        <article>
          <span>03</span>
          <strong>Player Progress Timeline</strong>
          <p>See key milestones, reviews and notes in one development story.</p>
        </article>
      </div>
      <div className="development-placeholder-stats">
        <StatusTile label="Players" value={String(players.length)} tone="cyan" />
        <StatusTile label="Active Focus Areas" value={String(focusAreas.length)} tone="green" />
        <StatusTile label="Status" value="Coming Soon" tone="blue" />
      </div>
    </section>
  )
}

function PlayerActionMenu({ menuRef, onAddBench, onAddNote, onAddStartingXI, onClose, onDelete, onEdit, onOpenFocus, onOpenProfile, onOpenSquadManagement, player, playerId, style }) {
  if (!player) {
    return null
  }

  return (
    <aside className="player-action-menu" ref={menuRef} style={style}>
      <ActionGroup title="Profile">
        <ActionMenuButton label="Open Full Profile" onClick={() => { onOpenProfile(playerId); onClose() }} />
        <ActionMenuButton label="Edit Player Details" onClick={() => onEdit(playerId)} />
        <ActionMenuButton label="Change Player Photo" onClick={() => onEdit(playerId)} />
      </ActionGroup>
      <ActionGroup title="Coaching">
        <ActionMenuButton label="Add Coach Note" onClick={() => onAddNote(playerId, 'General')} />
        <ActionMenuButton label="Log Training Feedback" onClick={() => onAddNote(playerId, 'Training')} />
        <ActionMenuButton label="Log Match Feedback" onClick={() => onAddNote(playerId, 'Match')} />
        <ActionMenuButton label="Set Development Focus" onClick={() => onOpenFocus(playerId)} />
      </ActionGroup>
      <ActionGroup title="Squad">
        <ActionMenuButton label="Add to Starting XI" onClick={() => onAddStartingXI(playerId)} />
        <ActionMenuButton label="Add to Bench" onClick={() => onAddBench(playerId)} />
        <ActionMenuButton label="Open in Squad Management" onClick={() => onOpenSquadManagement(playerId)} />
      </ActionGroup>
      <ActionGroup title="Danger">
        <ActionMenuButton danger label="Archive / Remove Player" onClick={() => onDelete(playerId)} />
      </ActionGroup>
    </aside>
  )
}

function ActionGroup({ children, title }) {
  return (
    <div className="action-menu-group">
      <span>{title}</span>
      {children}
    </div>
  )
}

function ActionMenuButton({ danger = false, label, onClick }) {
  return <button className={danger ? 'danger' : ''} type="button" onClick={onClick}>{label}</button>
}

function PlayerAvatar({ player, size = 'md', className = '' }) {
  const avatarClassName = ['player-os-avatar', `player-os-avatar-${size}`, className].filter(Boolean).join(' ')

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

function Fact({ label, value }) {
  return (
    <div className="player-fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function StatusTile({ label, tone = 'blue', value }) {
  return (
    <div className={`status-tile ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function MoralePill({ morale }) {
  return <span className={`morale-pill morale-${morale.toLowerCase().replaceAll(' ', '-')}`}>{morale}</span>
}

function FeedbackCard({ fallback, note, title }) {
  return (
    <article className="detail-card feedback-card">
      <span className="players-os-kicker">{title}</span>
      <p>{note ? truncateText(note.text, 120) : fallback}</p>
      <small>{note ? formatDate(note.createdAt) : 'Future feedback will build this timeline.'}</small>
    </article>
  )
}

function PlayerEditorModal({ avatarMessage, formData, formMode, onAvatarFile, onCancel, onChange, onRemoveAvatar, onSubmit }) {
  return (
    <div className="players-os-modal-overlay" role="presentation">
      <form className="players-os-drawer" role="dialog" aria-modal="true" aria-label={formMode === 'edit' ? 'Edit player details' : 'Add player'} onSubmit={onSubmit}>
        <div className="panel-topline">
          <div>
            <span className="players-os-kicker">{formMode === 'edit' ? 'Edit Player Details' : 'Add Player'}</span>
            <h4>{formMode === 'edit' ? 'Update player profile' : 'Create player profile'}</h4>
          </div>
          <button type="button" onClick={onCancel}>Close</button>
        </div>

        <section className="editor-avatar-row">
          <PlayerAvatar player={formData} size="xl" />
          <div>
            <strong>Player photo</strong>
            <p>Optional. PNG, JPG or WebP under 2MB. Saved only in this browser.</p>
            <label className="players-os-secondary" htmlFor="player-os-avatar-input">{formData.avatarDataUrl ? 'Replace Photo' : 'Upload Photo'}</label>
            <input accept="image/png,image/jpeg,image/webp" id="player-os-avatar-input" onChange={onAvatarFile} type="file" />
            {formData.avatarDataUrl && <button type="button" onClick={onRemoveAvatar}>Remove Photo</button>}
            {avatarMessage && <small>{avatarMessage}</small>}
          </div>
        </section>

        <div className="editor-grid">
          <label>Full name<input name="fullName" onChange={onChange} required value={formData.fullName} /></label>
          <label>Shirt number<input min="0" name="shirtNumber" onChange={onChange} type="number" value={formData.shirtNumber} /></label>
          <label>Age<input min="1" name="age" onChange={onChange} type="number" value={formData.age} /></label>
          <label>Main position<input name="mainPosition" onChange={onChange} value={formData.mainPosition} /></label>
          <label>Secondary position<input name="secondaryPosition" onChange={onChange} value={formData.secondaryPosition} /></label>
          <label>Preferred foot<select name="preferredFoot" onChange={onChange} value={formData.preferredFoot}><option>Right</option><option>Left</option><option>Both</option></select></label>
          <label>Status<select name="status" onChange={onChange} value={formData.status}>{playerStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label>Development focus<input name="developmentFocus" onChange={onChange} placeholder="Scanning before receiving" value={formData.developmentFocus} /></label>
        </div>

        <div className="ratings-grid players-os-ratings">
          {ratingFields.map((field) => (
            <label key={field.name}>
              <span>{field.label}<strong>{formData[field.name]}/10</strong></span>
              <input max="10" min="1" name={field.name} onChange={onChange} type="range" value={formData[field.name]} />
            </label>
          ))}
        </div>

        <div className="editor-notes-grid">
          <label>Strengths<textarea name="strengths" onChange={onChange} rows="4" value={formData.strengths} /></label>
          <label>Areas to improve<textarea name="areasToImprove" onChange={onChange} rows="4" value={formData.areasToImprove} /></label>
          <label>Coach notes<textarea name="coachNotes" onChange={onChange} rows="4" value={formData.coachNotes} /></label>
        </div>

        <div className="editor-actions">
          <button className="players-os-primary" type="submit">{formMode === 'edit' ? 'Save Changes' : 'Save Player'}</button>
          <button className="players-os-secondary" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

function FullProfileModal({ onAddNote, onClose, onDelete, onEdit, player }) {
  const notes = getPlayerNotes(player)

  return (
    <div className="players-os-modal-overlay" role="presentation">
      <article className="players-os-profile-modal" role="dialog" aria-modal="true" aria-label={`${getPlayerName(player)} full profile`}>
        <button className="profile-close" type="button" onClick={onClose}>x</button>
        <header>
          <PlayerAvatar player={player} size="xl" />
          <div>
            <span className="players-os-kicker">Full Profile</span>
            <h4>{getPlayerName(player)}</h4>
            <p>{player.mainPosition || 'No position set'} - {getPlayerStatus(player)}</p>
          </div>
          <div className="profile-modal-actions">
            <button className="players-os-primary" type="button" onClick={onEdit}>Edit Player Details</button>
            <button className="players-os-secondary" type="button" onClick={onAddNote}>Add Coach Note</button>
            <button className="players-os-danger" type="button" onClick={onDelete}>Archive / Remove Player</button>
          </div>
        </header>
        <div className="profile-modal-grid">
          <section className="detail-card"><span className="players-os-kicker">Personal Details</span><p>Age: {player.age || 'Not set'}</p><p>Preferred foot: {player.preferredFoot || 'Not set'}</p><p>Secondary position: {player.secondaryPosition || 'Not set'}</p></section>
          <section className="detail-card"><span className="players-os-kicker">Development</span><p>{player.developmentFocus || 'No development focus set yet.'}</p><small>{getProfileCompleteness(player)}% profile complete</small></section>
          <section className="detail-card"><span className="players-os-kicker">Strengths</span><p>{player.strengths || 'Nothing added yet.'}</p></section>
          <section className="detail-card"><span className="players-os-kicker">Areas to improve</span><p>{player.areasToImprove || 'Nothing added yet.'}</p></section>
        </div>
        <section className="detail-card profile-notes-card">
          <span className="players-os-kicker">Coach Notes</span>
          {notes.length > 0 ? notes.map((note) => <article key={note.id}><strong>{note.type}</strong><p>{note.text}</p><small>{formatDate(note.createdAt)}</small></article>) : <p>No coach notes yet.</p>}
        </section>
      </article>
    </div>
  )
}

function NoteModal({ noteForm, onChange, onClose, onSave, player }) {
  return (
    <div className="players-os-modal-overlay" role="presentation">
      <form className="players-os-note-modal" role="dialog" aria-modal="true" aria-label="Add player note" onSubmit={onSave}>
        <div className="panel-topline compact">
          <div>
            <span className="players-os-kicker">{noteForm.type} note</span>
            <h4>{getPlayerName(player)}</h4>
          </div>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <label>Note type<select name="type" onChange={onChange} value={noteForm.type}>{noteTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>Note<textarea name="text" onChange={onChange} placeholder="What did you notice?" required rows="6" value={noteForm.text} /></label>
        <div className="editor-actions">
          <button className="players-os-primary" type="submit">Save Note</button>
          <button className="players-os-secondary" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

function FocusModal({ focusValue, onChange, onClose, onSave, player }) {
  return (
    <div className="players-os-modal-overlay" role="presentation">
      <form className="players-os-note-modal" role="dialog" aria-modal="true" aria-label="Set development focus" onSubmit={onSave}>
        <div className="panel-topline compact">
          <div>
            <span className="players-os-kicker">Set Development Focus</span>
            <h4>{getPlayerName(player)}</h4>
          </div>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <label>Development focus<input onChange={(event) => onChange(event.target.value)} placeholder="Example: Decision making under pressure" value={focusValue} /></label>
        <div className="editor-actions">
          <button className="players-os-primary" type="submit">Save Focus</button>
          <button className="players-os-secondary" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default PlayersOperatingSystem
