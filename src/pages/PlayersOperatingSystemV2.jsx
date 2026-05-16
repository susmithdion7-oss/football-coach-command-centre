import { useEffect, useMemo, useRef, useState } from 'react'
import { getStorageItem, setStorageItem } from '../utils/storage.js'

const lineupStorageKey = 'squadLineup'
const tacticalStorageKey = 'tacticalSetup'
const assignmentsStorageKey = 'playerAssignments'

const playerStatuses = ['Improving', 'On Track', 'Stable', 'Needs Support', 'Injured', 'Returning']
const noteTypes = ['General', 'Training', 'Match', 'Development']
const avatarFileTypes = ['image/png', 'image/jpeg', 'image/webp']
const maxAvatarFileSize = 2 * 1024 * 1024
const avatarOutputSize = 512

const sections = [
  { id: 'playerCentre', label: 'Player Centre' },
  { id: 'squadManagement', label: 'Squad Management' },
  { id: 'developmentPlans', label: 'Development Plans' },
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

const tacticSettingGroups = [
  { key: 'buildUpStyle', label: 'Build-up style', options: ['Short passing', 'Mixed', 'Direct'] },
  { key: 'defensiveApproach', label: 'Defensive approach', options: ['High line', 'Balanced', 'Low block'] },
  { key: 'pressingIntensity', label: 'Pressing intensity', options: ['Low', 'Medium', 'High'] },
  { key: 'teamWidth', label: 'Team width', options: ['Narrow', 'Balanced', 'Wide'] },
  { key: 'tempo', label: 'Tempo', options: ['Slow', 'Balanced', 'Fast'] },
  { key: 'focusArea', label: 'Focus area', options: ['Central', 'Wide', 'Mixed'] },
]

const assignmentRoles = [
  { id: 'captain', label: 'Captain', icon: 'C' },
  { id: 'viceCaptain', label: 'Vice Captain', icon: 'VC' },
  { id: 'penaltyTaker', label: 'Penalty Taker', icon: 'PK' },
  { id: 'leftFreeKick', label: 'Left Free Kick', icon: 'LFK' },
  { id: 'rightFreeKick', label: 'Right Free Kick', icon: 'RFK' },
  { id: 'longFreeKick', label: 'Long Free Kick', icon: 'FK' },
  { id: 'leftCorner', label: 'Left Corner', icon: 'LC' },
  { id: 'rightCorner', label: 'Right Corner', icon: 'RC' },
  { id: 'leftThrowIn', label: 'Left Throw-in', icon: 'LT' },
  { id: 'rightThrowIn', label: 'Right Throw-in', icon: 'RT' },
]

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

function createRecordId(prefix) {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${prefix}-${Date.now()}`
}

function getPlayerName(player = {}) {
  return player.fullName || player.name || 'Unnamed player'
}

function getPlayerId(player, index = 0) {
  return player?.id || `${getPlayerName(player).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`
}

function getPlayerInitials(player) {
  const parts = getPlayerName(player).split(' ').filter(Boolean)

  if (parts.length === 0) {
    return 'PL'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function getAvatarUrl(player = {}) {
  return player.avatarDataUrl || player.avatar?.dataUrl || player.coachPhoto || ''
}

function getPlayerForForm(player = {}) {
  return {
    ...emptyPlayer,
    ...player,
    avatarDataUrl: getAvatarUrl(player),
    notes: Array.isArray(player.notes) ? player.notes : [],
    tacticalRating: player.tacticalRating || player.tacticalUnderstandingRating || emptyPlayer.tacticalRating,
    mentalRating: player.mentalRating || player.mentalityRating || emptyPlayer.mentalRating,
  }
}

function getPlayerStatus(player = {}) {
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

function getRatingValue(player = {}, key) {
  const ratings = {
    technical: player.technicalRating,
    physical: player.physicalRating,
    tactical: player.tacticalRating || player.tacticalUnderstandingRating,
    mental: player.mentalRating || player.mentalityRating,
  }
  const value = Number(ratings[key])
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

function getPlayerNotes(player = {}) {
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
    return [{ id: `${player.id || 'player'}-legacy-note`, type: 'General', text: player.coachNotes, createdAt: player.updatedAt || player.createdAt || '', isLegacy: true }]
  }

  return []
}

function getLatestNoteByType(player, type) {
  return getPlayerNotes(player).find((note) => note.type === type)
}

function getProfileCompleteness(player = {}) {
  const checks = [
    player.fullName || player.name,
    player.shirtNumber,
    player.age,
    player.mainPosition,
    player.preferredFoot,
    player.developmentFocus,
    player.strengths,
    player.areasToImprove,
    getPlayerNotes(player).length > 0,
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

  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function getFormationSlots(formation) {
  const lines = formationLines[formation] || formationLines[defaultLineup.formation]
  const yPositions = lines.length === 6 ? [89, 72, 58, 44, 30, 15] : lines.length === 5 ? [89, 70, 53, 36, 17] : [89, 66, 43, 18]

  return lines.flatMap((line, lineIndex) => line.map((label, index) => {
    const count = line.length
    const x = count === 1 ? 50 : 12 + (index * (76 / Math.max(count - 1, 1)))

    return { id: `${lineIndex}-${index}-${label}`, label, x, y: yPositions[lineIndex] || 50 }
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
    settings: { ...defaultTactic.settings, ...(savedTactic?.settings || {}) },
  }
}

function getLineupRole(lineup, playerId) {
  const slots = getFormationSlots(lineup.formation)
  const startingSlot = Object.entries(lineup.startingXI || {}).find(([, currentPlayerId]) => currentPlayerId === playerId)

  if (startingSlot) {
    const slot = slots.find((slotItem) => slotItem.id === startingSlot[0])
    return { label: 'Starting XI', detail: slot?.label || 'Selected slot' }
  }

  if ((lineup.bench || []).includes(playerId)) {
    return { label: 'Bench', detail: 'Matchday squad' }
  }

  return { label: 'Not selected', detail: 'Available for lineup' }
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

function PlayersOperatingSystemV2({ players = [], onAddPlayer, onDeletePlayer, onUpdatePlayer }) {
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
  const [toastMessage, setToastMessage] = useState('')
  const [notePlayerId, setNotePlayerId] = useState(null)
  const [noteForm, setNoteForm] = useState({ type: 'General', text: '' })
  const [focusPlayerId, setFocusPlayerId] = useState(null)
  const [focusValue, setFocusValue] = useState('')
  const [playerPicker, setPlayerPicker] = useState(null)
  const [selectedAssignmentRoleId, setSelectedAssignmentRoleId] = useState('captain')
  const [lineup, setLineup] = useState(() => normaliseLineup(getStorageItem(lineupStorageKey, null)))
  const [tactic, setTactic] = useState(() => normaliseTactic(getStorageItem(tacticalStorageKey, null)))
  const [assignments, setAssignments] = useState(() => getStorageItem(assignmentsStorageKey, {}))
  const menuRef = useRef(null)

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
  const selectedLineupPlayer = getPlayerById(players, selectedLineupPlayerId)
  const focusAreas = getFocusAreas(players)
  const selectedRole = assignmentRoles.find((role) => role.id === selectedAssignmentRoleId) || assignmentRoles[0]

  useEffect(() => {
    if (!players.length) {
      setSelectedPlayerId(null)
      setSelectedLineupPlayerId(null)
      return
    }

    if (!selectedPlayerId || !getPlayerById(players, selectedPlayerId)) {
      setSelectedPlayerId(getPlayerId(players[0], 0))
    }

    if (!selectedLineupPlayerId || !getPlayerById(players, selectedLineupPlayerId)) {
      setSelectedLineupPlayerId(getPlayerId(players[0], 0))
    }
  }, [players, selectedLineupPlayerId, selectedPlayerId])

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => setToastMessage(''), 2400)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

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

  function showToast(message) {
    setToastMessage(message)
  }

  function clearFilters() {
    setSearchTerm('')
    setPositionFilter('All positions')
    setStatusFilter('All statuses')
  }

  function openActionMenu(event, playerId) {
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()
    const menuWidth = 292
    const left = Math.min(Math.max(16, rect.right - menuWidth), window.innerWidth - menuWidth - 16)
    const top = Math.min(rect.bottom + 8, window.innerHeight - 470)
    setActionMenu({ playerId, left, top })
  }

  function startAddingPlayer() {
    setFormMode('add')
    setFormData(emptyPlayer)
    setAvatarMessage('')
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
      showToast('Please add a player name before saving.')
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
        showToast('Player updated')
      }
      closeEditor()
      return
    }

    const newPlayerId = onAddPlayer(cleanPlayer)
    setSelectedPlayerId(newPlayerId)
    setSelectedLineupPlayerId(newPlayerId)
    showToast('Player created')
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
    showToast('Player removed')
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
      onUpdatePlayer(notePlayer.id, { notes: [nextNote, ...existingNotes], updatedAt: now })
    }

    setSelectedPlayerId(notePlayer.id || notePlayerId)
    setNotePlayerId(null)
    setNoteForm({ type: 'General', text: '' })
    showToast(`${nextNote.type} note saved`)
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

    onUpdatePlayer(focusPlayer.id, { developmentFocus: focusValue.trim(), updatedAt: new Date().toISOString() })
    setFocusPlayerId(null)
    showToast('Development focus updated')
  }

  function saveLineup(nextLineup, message = 'Lineup saved') {
    setLineup(nextLineup)
    setStorageItem(lineupStorageKey, nextLineup)
    showToast(message)
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

    saveLineup(nextLineup, playerId ? 'Starting XI updated' : 'Slot cleared')
    if (playerId) {
      setSelectedLineupPlayerId(playerId)
    }
  }

  function addPlayerToStartingXI(playerId) {
    const slots = getFormationSlots(lineup.formation)
    const alreadyAssignedSlot = Object.entries(lineup.startingXI || {}).find(([, currentPlayerId]) => currentPlayerId === playerId)?.[0]
    const targetSlot = alreadyAssignedSlot || slots.find((slot) => !lineup.startingXI?.[slot.id])?.id

    if (!targetSlot) {
      showToast('Starting XI is full. Remove a player first.')
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

    saveLineup({ ...lineup, startingXI: nextStartingXI, bench: nextBench }, 'Bench updated')
    setSelectedLineupPlayerId(playerId)
    setActiveSection('squadManagement')
    setActiveSquadTab('lineup')
    setActionMenu(null)
  }

  function removeFromBench(playerId) {
    saveLineup({ ...lineup, bench: (lineup.bench || []).filter((benchPlayerId) => benchPlayerId !== playerId) }, 'Bench updated')
  }

  function removeFromStartingXI(playerId) {
    const nextStartingXI = Object.entries(lineup.startingXI || {}).reduce((slots, [slotId, currentPlayerId]) => {
      if (currentPlayerId !== playerId) {
        slots[slotId] = currentPlayerId
      }
      return slots
    }, {})

    saveLineup({ ...lineup, startingXI: nextStartingXI }, 'Starting XI updated')
  }

  function movePlayerToBench(playerId) {
    removeFromStartingXI(playerId)
    const nextBench = [...new Set([...(lineup.bench || []), playerId])]
    const nextStartingXI = Object.entries(lineup.startingXI || {}).reduce((slots, [slotId, currentPlayerId]) => {
      if (currentPlayerId !== playerId) {
        slots[slotId] = currentPlayerId
      }
      return slots
    }, {})
    saveLineup({ ...lineup, startingXI: nextStartingXI, bench: nextBench }, 'Moved to bench')
  }

  function resetLineup() {
    const shouldReset = window.confirm('Reset this lineup? Player profiles will not be affected.')

    if (!shouldReset) {
      return
    }

    saveLineup({ ...defaultLineup, formation: lineup.formation }, 'Lineup reset')
  }

  function setLineupFormation(formation) {
    saveLineup({ ...lineup, formation }, 'Formation updated')
  }

  function saveTactic(nextTactic = tactic, message = 'Tactic saved') {
    setTactic(nextTactic)
    setStorageItem(tacticalStorageKey, nextTactic)
    showToast(message)
  }

  function updateTacticSetting(settingName, value) {
    setTactic((currentTactic) => ({ ...currentTactic, settings: { ...currentTactic.settings, [settingName]: value } }))
  }

  function updateAssignment(roleId, playerId) {
    const nextAssignments = { ...assignments, [roleId]: playerId }
    setAssignments(nextAssignments)
    setStorageItem(assignmentsStorageKey, nextAssignments)
    setSelectedAssignmentRoleId(roleId)
    if (playerId) {
      setSelectedLineupPlayerId(playerId)
    }
    showToast('Assignments saved')
  }

  function openPlayerPicker(context) {
    setPlayerPicker(context)
  }

  function choosePickerPlayer(playerId) {
    if (!playerPicker) {
      return
    }

    if (playerPicker.type === 'slot') {
      assignPlayerToSlot(playerPicker.slotId, playerId)
    }

    if (playerPicker.type === 'bench') {
      addPlayerToBench(playerId)
    }

    if (playerPicker.type === 'assignment') {
      updateAssignment(playerPicker.roleId, playerId)
    }

    setPlayerPicker(null)
  }

  function clearPickerSelection() {
    if (!playerPicker) {
      return
    }

    if (playerPicker.type === 'slot') {
      assignPlayerToSlot(playerPicker.slotId, '')
    }

    if (playerPicker.type === 'assignment') {
      updateAssignment(playerPicker.roleId, '')
    }

    setPlayerPicker(null)
  }

  return (
    <section className="players-os-page players-os-page-v2">
      <div className="players-os-backdrop" aria-hidden="true" />
      <header className="players-os-compact-header">
        <div className="players-os-title-block compact">
          <span className="players-os-kicker">Players</span>
          <h3>Players</h3>
          <p>Manage your squad, lineups and player development.</p>
        </div>

        <div className="players-os-top-tools compact">
          <label className="players-os-search compact-search">
            <span>Search</span>
            <input onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search players" type="search" value={searchTerm} />
          </label>
          <button className="players-os-secondary" type="button" onClick={clearFilters}>Clear filters</button>
          <button className="players-os-primary" type="button" onClick={startAddingPlayer}>Add Player</button>
        </div>
      </header>

      <nav className="players-os-module-tabs" aria-label="Players sections">
        {sections.map((section) => (
          <button className={activeSection === section.id ? 'active' : ''} key={section.id} onClick={() => setActiveSection(section.id)} type="button">
            {section.label}
          </button>
        ))}
      </nav>

      <Toast message={toastMessage} />

      {activeSection === 'playerCentre' && (
        <PlayerCentre
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
          onEditPlayer={startEditingPlayer}
          onMoveBench={movePlayerToBench}
          onOpenNote={openNoteForPlayer}
          onOpenPicker={openPlayerPicker}
          onOpenProfile={setProfilePlayerId}
          onRemoveBench={removeFromBench}
          onRemoveFromXI={removeFromStartingXI}
          onResetLineup={resetLineup}
          onSaveLineup={() => saveLineup(lineup)}
          onSaveTactic={() => saveTactic(tactic)}
          onSelectAssignmentRole={setSelectedAssignmentRoleId}
          onSelectLineupPlayer={setSelectedLineupPlayerId}
          onTacticChange={setTactic}
          onTacticSettingChange={updateTacticSetting}
          players={players}
          selectedAssignmentRole={selectedRole}
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
        <FocusModal focusValue={focusValue} onChange={setFocusValue} onClose={() => setFocusPlayerId(null)} onSave={saveDevelopmentFocus} player={focusPlayer} />
      )}

      {playerPicker && (
        <PlayerPickerModal
          context={playerPicker}
          onClear={clearPickerSelection}
          onClose={() => setPlayerPicker(null)}
          onPick={choosePickerPlayer}
          players={players}
        />
      )}
    </section>
  )
}

function Toast({ message }) {
  return <div className={message ? 'players-os-toast show' : 'players-os-toast'}>{message}</div>
}

function PlayerCentre({ filteredPlayers, onActionMenu, onAddPlayer, onClearFilters, onEditPlayer, onOpenNote, onOpenProfile, onPositionFilter, onSearch, onSelectPlayer, onStatusFilter, players, positionFilter, positionOptions, searchTerm, selectedPlayer, selectedPlayerId, statusFilter }) {
  return (
    <div className="player-centre-grid player-centre-grid-v2">
      <aside className="player-list-panel dark-panel">
        <div className="panel-topline compact-panel-topline">
          <div>
            <span className="players-os-kicker">Player list</span>
            <h4>{players.length} players</h4>
          </div>
          <button type="button" onClick={onClearFilters}>View all</button>
        </div>

        <div className="player-list-filters compact-filters">
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

        <div className="player-list-header-row" aria-hidden="true">
          <span>#</span>
          <span>POS</span>
          <span>PLAYER</span>
          <span>MORALE</span>
          <span>STATUS</span>
          <span />
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="players-os-empty compact-empty">
            <strong>No players yet.</strong>
            <p>Add players to start building your squad.</p>
            <button className="players-os-primary" type="button" onClick={onAddPlayer}>Add Player</button>
          </div>
        ) : (
          <div className="player-row-scroll player-row-scroll-tall">
            {filteredPlayers.map((player, index) => {
              const playerId = getPlayerId(player, players.indexOf(player))
              return (
                <PlayerRow
                  key={playerId}
                  onActionMenu={onActionMenu}
                  onSelectPlayer={onSelectPlayer}
                  player={player}
                  playerId={playerId}
                  rowIndex={index}
                  selected={selectedPlayerId === playerId}
                />
              )
            })}
          </div>
        )}
      </aside>

      <SelectedPlayerPanel
        onAddNote={(type = 'General') => selectedPlayer && onOpenNote(selectedPlayer.id || selectedPlayerId, type)}
        onEdit={() => selectedPlayer && onEditPlayer(selectedPlayer.id || selectedPlayerId)}
        onOpenProfile={() => selectedPlayer && onOpenProfile(selectedPlayer.id || selectedPlayerId)}
        player={selectedPlayer}
      />
    </div>
  )
}

function PlayerRow({ onActionMenu, onSelectPlayer, player, playerId, selected }) {
  const avatarUrl = getAvatarUrl(player)
  const morale = getMorale(player)
  const status = getPlayerStatus(player)

  return (
    <div className={selected ? 'player-row selected' : 'player-row'} onClick={() => onSelectPlayer(playerId)} onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        onSelectPlayer(playerId)
      }
    }} role="button" tabIndex="0">
      <span className="player-number">{player.shirtNumber || '--'}</span>
      <span className="player-position-pill">{getPositionGroup(player.mainPosition)}</span>
      <span className="player-row-name-cell">
        <PlayerAvatar player={player} size="small" />
        <span className="player-row-name-wrap">
          <strong>{getPlayerName(player)}</strong>
          <small>{player.mainPosition || 'No position set'}</small>
        </span>
      </span>
      <span className={`morale-chip morale-${morale.toLowerCase().replace(/\s+/g, '-')}`}>{morale}</span>
      <span className={`status-chip status-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
      <button className="row-action-button" onClick={(event) => onActionMenu(event, playerId)} type="button" aria-label={`Open actions for ${getPlayerName(player)}`}>
        ...
      </button>
      {avatarUrl && <span className="sr-only">Player photo available</span>}
    </div>
  )
}

function SelectedPlayerPanel({ onAddNote, onEdit, onOpenProfile, player }) {
  if (!player) {
    return (
      <section className="selected-player-panel dark-panel profile-command-panel empty-profile-panel">
        <div className="players-os-empty compact-empty">
          <strong>No player selected.</strong>
          <p>Select a player from the list to view their profile command panel.</p>
        </div>
      </section>
    )
  }

  const notes = getPlayerNotes(player)
  const coachNote = notes[0]
  const trainingFeedback = getLatestNoteByType(player, 'Training')
  const matchFeedback = getLatestNoteByType(player, 'Match')
  const completeness = getProfileCompleteness(player)
  const averageRating = getAverageRating(player)
  const morale = getMorale(player)
  const status = getPlayerStatus(player)

  return (
    <section className="selected-player-panel dark-panel profile-command-panel">
      <div className="selected-player-hero profile-hero-strong">
        <div className="player-hero-number">{player.shirtNumber || '--'}</div>
        <PlayerAvatar player={player} size="large" />
        <div className="selected-player-title">
          <span className="players-os-kicker">Player profile</span>
          <h4>{getPlayerName(player)}</h4>
          <p>{player.mainPosition || 'No position set'}{player.secondaryPosition ? ` / ${player.secondaryPosition}` : ''}</p>
          <div className="player-fact-row">
            <span>Age <strong>{player.age || 'Not set'}</strong></span>
            <span>Foot <strong>{player.preferredFoot || 'Not set'}</strong></span>
            <span>Rating <strong>{averageRating ? Math.round(averageRating * 10) : '--'}</strong></span>
          </div>
        </div>
      </div>

      <div className="player-status-strip command-status-strip">
        <StatusMetric label="Availability" value={status === 'Injured' ? 'Unavailable' : 'Available'} tone={status === 'Injured' ? 'danger' : 'success'} />
        <StatusMetric label="Morale" value={morale} tone={morale === 'Needs Support' ? 'warning' : 'success'} />
        <StatusMetric label="Training Status" value={status} tone="accent" />
        <StatusMetric label="Development Focus" value={player.developmentFocus || 'No development focus'} tone="accent" />
      </div>

      <div className="profile-action-row profile-action-row-rich">
        <button type="button" onClick={() => onAddNote('General')}>Add Coach Note</button>
        <button type="button" onClick={() => onAddNote('Training')}>Log Training Feedback</button>
        <button type="button" onClick={() => onAddNote('Match')}>Log Match Feedback</button>
        <button type="button" onClick={onOpenProfile}>Open Full Profile</button>
        <button type="button" onClick={onEdit}>Edit Player Details</button>
      </div>

      <div className="profile-command-grid">
        <InfoCard title="Coach Note Summary" value={coachNote ? truncateText(coachNote.text, 170) : 'No coach notes yet.'} meta={coachNote ? `Updated ${formatDate(coachNote.createdAt)}` : 'Add a note to start a feedback history.'} />
        <CompletenessCard value={completeness} />
        <InfoCard title="Latest Training Feedback" value={trainingFeedback ? truncateText(trainingFeedback.text, 120) : 'No training feedback yet.'} meta={trainingFeedback ? formatDate(trainingFeedback.createdAt) : 'Use training notes after each session.'} />
        <InfoCard title="Latest Match Feedback" value={matchFeedback ? truncateText(matchFeedback.text, 120) : 'No match feedback yet.'} meta={matchFeedback ? formatDate(matchFeedback.createdAt) : 'Connect match feedback to future sessions.'} />
      </div>

      <div className="recent-notes-panel unified-notes-panel">
        <div className="panel-topline mini-topline">
          <div>
            <span className="players-os-kicker">Recent notes</span>
            <h4>Feedback loop</h4>
          </div>
          <button type="button" onClick={() => onAddNote('General')}>Add note</button>
        </div>
        {notes.length === 0 ? (
          <p className="empty-dark-copy">No recent notes yet.</p>
        ) : (
          notes.slice(0, 3).map((note) => (
            <article className="recent-note-row" key={note.id || note.createdAt || note.text}>
              <span>{note.type || 'General'}</span>
              <p>{truncateText(note.text, 100)}</p>
              <small>{formatDate(note.createdAt)}</small>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

function PlayerActionMenu({ menuRef, onAddBench, onAddNote, onAddStartingXI, onDelete, onEdit, onOpenFocus, onOpenProfile, onOpenSquadManagement, player, playerId, style }) {
  if (!player) {
    return null
  }

  return (
    <div className="player-action-menu player-action-menu-polished" ref={menuRef} style={style}>
      <div className="action-menu-player-card">
        <PlayerAvatar player={player} size="small" />
        <div>
          <strong>{getPlayerName(player)}</strong>
          <span>{player.mainPosition || 'No position set'}</span>
        </div>
      </div>
      <ActionGroup title="Profile">
        <button type="button" onClick={() => onOpenProfile(playerId)}>Open Full Profile</button>
        <button type="button" onClick={() => onEdit(playerId)}>Edit Player Details</button>
        <button type="button" onClick={() => onEdit(playerId)}>Change Player Photo</button>
      </ActionGroup>
      <ActionGroup title="Coaching">
        <button type="button" onClick={() => onAddNote(playerId, 'General')}>Add Coach Note</button>
        <button type="button" onClick={() => onAddNote(playerId, 'Training')}>Log Training Feedback</button>
        <button type="button" onClick={() => onAddNote(playerId, 'Match')}>Log Match Feedback</button>
        <button type="button" onClick={() => onOpenFocus(playerId)}>Set Development Focus</button>
      </ActionGroup>
      <ActionGroup title="Squad">
        <button type="button" onClick={() => onAddStartingXI(playerId)}>Add to Starting XI</button>
        <button type="button" onClick={() => onAddBench(playerId)}>Add to Bench</button>
        <button type="button" onClick={() => onOpenSquadManagement(playerId)}>Open in Squad Management</button>
      </ActionGroup>
      <ActionGroup title="Danger">
        <button className="danger-action" type="button" onClick={() => onDelete(playerId)}>Archive / Remove Player</button>
      </ActionGroup>
    </div>
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

function SquadManagement({ activeSquadTab, assignments, focusAreas, lineup, onAddBench, onAssignSlot, onChangeAssignment, onChangeLineupFormation, onChangeSquadTab, onEditPlayer, onMoveBench, onOpenNote, onOpenPicker, onOpenProfile, onRemoveBench, onRemoveFromXI, onResetLineup, onSaveLineup, onSaveTactic, onSelectAssignmentRole, onSelectLineupPlayer, onTacticChange, onTacticSettingChange, players, selectedAssignmentRole, selectedLineupPlayer, selectedLineupPlayerId, tactic }) {
  return (
    <section className="squad-management-section squad-management-section-v2">
      <div className="squad-management-toolbar compact-squad-toolbar">
        <div>
          <span className="players-os-kicker">Squad Management</span>
          <h4>Build your best XI, tactics and assignments.</h4>
        </div>
        <nav className="squad-tabs compact-squad-tabs" aria-label="Squad management tabs">
          {squadTabs.map((tab) => (
            <button className={activeSquadTab === tab.id ? 'active' : ''} key={tab.id} onClick={() => onChangeSquadTab(tab.id)} type="button">
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeSquadTab === 'lineup' && (
        <LineupTab
          lineup={lineup}
          onAddBench={onAddBench}
          onChangeFormation={onChangeLineupFormation}
          onEditPlayer={onEditPlayer}
          onMoveBench={onMoveBench}
          onOpenNote={onOpenNote}
          onOpenPicker={onOpenPicker}
          onOpenProfile={onOpenProfile}
          onRemoveBench={onRemoveBench}
          onRemoveFromXI={onRemoveFromXI}
          onReset={onResetLineup}
          onSave={onSaveLineup}
          onSelectPlayer={onSelectLineupPlayer}
          players={players}
          selectedPlayer={selectedLineupPlayer}
          selectedPlayerId={selectedLineupPlayerId}
          tactic={tactic}
        />
      )}

      {activeSquadTab === 'tactics' && (
        <TacticsTab lineup={lineup} onSave={onSaveTactic} onTacticChange={onTacticChange} onTacticSettingChange={onTacticSettingChange} tactic={tactic} />
      )}

      {activeSquadTab === 'assignments' && (
        <AssignmentsTab
          assignments={assignments}
          onChangeAssignment={onChangeAssignment}
          onOpenPicker={onOpenPicker}
          onSelectRole={onSelectAssignmentRole}
          players={players}
          selectedRole={selectedAssignmentRole}
        />
      )}
    </section>
  )
}

function LineupTab({ lineup, onChangeFormation, onEditPlayer, onMoveBench, onOpenNote, onOpenPicker, onOpenProfile, onRemoveBench, onRemoveFromXI, onReset, onSave, onSelectPlayer, players, selectedPlayer, selectedPlayerId, tactic }) {
  const slots = getFormationSlots(lineup.formation)
  const role = selectedPlayerId ? getLineupRole(lineup, selectedPlayerId) : null

  return (
    <div className="lineup-workspace lineup-workspace-v2">
      <div className="lineup-main-stage">
        <div className="lineup-toolbar compact-lineup-toolbar">
          <select onChange={(event) => onChangeFormation(event.target.value)} value={lineup.formation}>
            {formationNames.map((formation) => <option key={formation}>{formation}</option>)}
          </select>
          <button className="players-os-primary" type="button" onClick={onSave}>Save Lineup</button>
          <button className="players-os-secondary" type="button" onClick={onReset}>Reset Lineup</button>
        </div>

        <FormationPitch
          lineup={lineup}
          onOpenPicker={(slot) => onOpenPicker({ type: 'slot', slotId: slot.id, slotLabel: slot.label, currentPlayerId: lineup.startingXI?.[slot.id] || '' })}
          onSelectPlayer={onSelectPlayer}
          players={players}
          selectedPlayerId={selectedPlayerId}
          slots={slots}
        />

        <BenchPanel
          lineup={lineup}
          onAddBench={() => onOpenPicker({ type: 'bench' })}
          onRemoveBench={onRemoveBench}
          onSelectPlayer={onSelectPlayer}
          players={players}
          selectedPlayerId={selectedPlayerId}
        />
      </div>

      <LineupSidePanel
        lineupRole={role}
        onEditPlayer={onEditPlayer}
        onMoveBench={onMoveBench}
        onOpenNote={onOpenNote}
        onOpenProfile={onOpenProfile}
        onRemoveFromXI={onRemoveFromXI}
        player={selectedPlayer}
        playerId={selectedPlayerId}
        tactic={tactic}
      />
    </div>
  )
}

function FormationPitch({ lineup, onOpenPicker, onSelectPlayer, players, selectedPlayerId, slots }) {
  return (
    <div className="formation-pitch formation-pitch-mainstage" aria-label="Starting XI pitch">
      <div className="pitch-lines" aria-hidden="true">
        <span className="pitch-box top" />
        <span className="pitch-box bottom" />
        <span className="pitch-centre" />
        <span className="pitch-half" />
      </div>
      {slots.map((slot) => {
        const playerId = lineup.startingXI?.[slot.id]
        const player = getPlayerById(players, playerId)
        const isSelected = playerId && playerId === selectedPlayerId

        return (
          <button
            className={player ? `pitch-slot-card filled ${isSelected ? 'selected' : ''}` : 'pitch-slot-card empty'}
            key={slot.id}
            onClick={() => {
              if (playerId) {
                onSelectPlayer(playerId)
              }
              onOpenPicker(slot)
            }}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            type="button"
          >
            {player ? (
              <>
                <PlayerAvatar player={player} size="tiny" />
                <span className="slot-player-name">{getPlayerName(player)}</span>
                <span className="slot-meta">{slot.label}</span>
              </>
            ) : (
              <>
                <span className="slot-plus">+</span>
                <span className="slot-player-name">Select</span>
                <span className="slot-meta">{slot.label}</span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}

function BenchPanel({ lineup, onAddBench, onRemoveBench, onSelectPlayer, players, selectedPlayerId }) {
  const benchPlayers = (lineup.bench || []).map((playerId) => ({ playerId, player: getPlayerById(players, playerId) })).filter((entry) => entry.player)

  return (
    <div className="bench-panel bench-panel-v2">
      <div className="panel-topline mini-topline">
        <div>
          <span className="players-os-kicker">Bench</span>
          <h4>{benchPlayers.length} selected</h4>
        </div>
        <button type="button" onClick={onAddBench}>Add player</button>
      </div>

      {benchPlayers.length === 0 ? (
        <div className="bench-empty-state">
          <strong>No bench players selected.</strong>
          <p>Add players to your matchday squad.</p>
        </div>
      ) : (
        <div className="bench-card-grid">
          {benchPlayers.map(({ player, playerId }) => (
            <article className={playerId === selectedPlayerId ? 'bench-player-card selected' : 'bench-player-card'} key={playerId} onClick={() => onSelectPlayer(playerId)}>
              <PlayerAvatar player={player} size="tiny" />
              <div>
                <strong>{getPlayerName(player)}</strong>
                <span>{player.mainPosition || 'No position set'}</span>
              </div>
              <button type="button" onClick={(event) => { event.stopPropagation(); onRemoveBench(playerId) }}>Remove</button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function LineupSidePanel({ lineupRole, onEditPlayer, onMoveBench, onOpenNote, onOpenProfile, onRemoveFromXI, player, playerId, tactic }) {
  if (!player) {
    return (
      <aside className="lineup-side-panel dark-panel lineup-side-panel-v2">
        <div className="players-os-empty compact-empty">
          <strong>Select a player.</strong>
          <p>Select a player on the pitch or bench to view details.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="lineup-side-panel dark-panel lineup-side-panel-v2">
      <div className="lineup-player-card enhanced-lineup-card">
        <PlayerAvatar player={player} size="medium" />
        <div>
          <span className="players-os-kicker">Selected player</span>
          <h4>{getPlayerName(player)}</h4>
          <p>{player.mainPosition || 'No position set'} · {player.preferredFoot || 'Foot not set'}</p>
        </div>
        <strong className="lineup-rating">{Math.round((getAverageRating(player) || 0) * 10) || '--'}</strong>
      </div>

      <div className="lineup-detail-stack">
        <StatusMetric label="Lineup Role" value={lineupRole?.label || 'Not selected'} tone="accent" />
        <StatusMetric label="Slot" value={lineupRole?.detail || 'Available'} tone="accent" />
        <StatusMetric label="Morale" value={getMorale(player)} tone="success" />
        <StatusMetric label="Availability" value={getPlayerStatus(player) === 'Injured' ? 'Unavailable' : 'Available'} tone="success" />
        <StatusMetric label="Development Focus" value={player.developmentFocus || 'No development focus'} tone="accent" />
        <StatusMetric label="Profile" value={`${getProfileCompleteness(player)}% complete`} tone="accent" />
      </div>

      <div className="tactics-preview-card">
        <span className="players-os-kicker">Tactics preview</span>
        <strong>{tactic.preset}</strong>
        <p>{tactic.settings.buildUpStyle} · {tactic.settings.pressingIntensity} press · {tactic.settings.teamWidth} width</p>
      </div>

      <div className="lineup-side-actions">
        <button type="button" onClick={() => onOpenProfile(playerId)}>Open Profile</button>
        <button type="button" onClick={() => onOpenNote(playerId, 'General')}>Add Note</button>
        <button type="button" onClick={() => onMoveBench(playerId)}>Move to Bench</button>
        <button type="button" onClick={() => onRemoveFromXI(playerId)}>Remove from XI</button>
        <button type="button" onClick={() => onEditPlayer(playerId)}>Edit Details</button>
      </div>
    </aside>
  )
}

function TacticsTab({ lineup, onSave, onTacticChange, onTacticSettingChange, tactic }) {
  const slots = getFormationSlots(tactic.formation)

  function updateTactic(nextValues) {
    onTacticChange({ ...tactic, ...nextValues })
  }

  return (
    <div className="tactics-grid tactics-grid-v2">
      <div className="tactics-control-panel dark-panel">
        <div className="panel-topline mini-topline">
          <div>
            <span className="players-os-kicker">Tactics</span>
            <h4>Team setup</h4>
          </div>
          <button className="players-os-primary" type="button" onClick={onSave}>Save Tactic</button>
        </div>

        <label className="tactic-select-row">
          <span>Formation</span>
          <select value={tactic.formation} onChange={(event) => updateTactic({ formation: event.target.value })}>
            {formationNames.map((formation) => <option key={formation}>{formation}</option>)}
          </select>
        </label>

        <div className="preset-chip-grid">
          {tacticPresets.map((preset) => (
            <button className={tactic.preset === preset ? 'active' : ''} key={preset} onClick={() => updateTactic({ preset })} type="button">
              {preset}
            </button>
          ))}
        </div>

        <div className="tactic-setting-groups">
          {tacticSettingGroups.map((group) => (
            <div className="tactic-setting-group" key={group.key}>
              <span>{group.label}</span>
              <div>
                {group.options.map((option) => (
                  <button className={tactic.settings[group.key] === option ? 'active' : ''} key={option} onClick={() => onTacticSettingChange(group.key, option)} type="button">
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tactics-preview-panel dark-panel">
        <div className="panel-topline mini-topline">
          <div>
            <span className="players-os-kicker">Formation preview</span>
            <h4>{tactic.formation}</h4>
          </div>
          <span className="tactic-pill">{tactic.preset}</span>
        </div>
        <MiniFormationPreview slots={slots} lineup={lineup} />
      </div>
    </div>
  )
}

function AssignmentsTab({ assignments, onChangeAssignment, onOpenPicker, onSelectRole, players, selectedRole }) {
  const selectedPlayer = getPlayerById(players, assignments[selectedRole.id])

  return (
    <div className="assignments-grid assignments-grid-v2">
      <div className="assignments-list dark-panel">
        <div className="panel-topline mini-topline">
          <div>
            <span className="players-os-kicker">Assignments</span>
            <h4>Matchday roles</h4>
          </div>
        </div>

        {assignmentRoles.map((role) => {
          const assignedPlayer = getPlayerById(players, assignments[role.id])
          return (
            <button className={selectedRole.id === role.id ? 'assignment-row selected' : 'assignment-row'} key={role.id} onClick={() => onSelectRole(role.id)} type="button">
              <span className="assignment-icon">{role.icon}</span>
              <span>
                <strong>{role.label}</strong>
                <small>{assignedPlayer ? getPlayerName(assignedPlayer) : 'Unassigned'}</small>
              </span>
              <span className="assignment-change" onClick={(event) => { event.stopPropagation(); onOpenPicker({ type: 'assignment', roleId: role.id, roleLabel: role.label, currentPlayerId: assignments[role.id] || '' }) }} role="button" tabIndex="0">
                Change
              </span>
            </button>
          )
        })}
      </div>

      <div className="assignment-preview dark-panel">
        <span className="players-os-kicker">Selected assignment</span>
        <h4>{selectedRole.label}</h4>
        {selectedPlayer ? (
          <div className="assignment-player-preview">
            <PlayerAvatar player={selectedPlayer} size="medium" />
            <div>
              <strong>{getPlayerName(selectedPlayer)}</strong>
              <p>{selectedPlayer.mainPosition || 'No position set'} · {selectedPlayer.preferredFoot || 'Foot not set'}</p>
              <span>{getMorale(selectedPlayer)} morale</span>
            </div>
          </div>
        ) : (
          <p className="empty-dark-copy">No player assigned yet.</p>
        )}
        <button className="players-os-primary" type="button" onClick={() => onOpenPicker({ type: 'assignment', roleId: selectedRole.id, roleLabel: selectedRole.label, currentPlayerId: assignments[selectedRole.id] || '' })}>Choose Player</button>
        {selectedPlayer && <button className="players-os-secondary" type="button" onClick={() => onChangeAssignment(selectedRole.id, '')}>Clear Assignment</button>}
      </div>
    </div>
  )
}

function DevelopmentPlans({ focusAreas, players }) {
  return (
    <section className="development-plans-page development-plans-page-v2 dark-panel">
      <span className="players-os-kicker">Development Plans</span>
      <h4>Build individual plans, track progress and connect feedback to player growth.</h4>
      <p>This area is ready as the future home for deeper player development workflows.</p>
      <div className="development-card-grid">
        <article>
          <span>01</span>
          <strong>Individual Development Plans</strong>
          <p>Create focused plans for each player.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Training Feedback Trends</strong>
          <p>Connect session feedback to long-term growth.</p>
        </article>
        <article>
          <span>03</span>
          <strong>Player Progress Timeline</strong>
          <p>Review milestones, notes and coach reflections.</p>
        </article>
      </div>
      <div className="development-summary-strip">
        <span>{players.length} players</span>
        <span>{focusAreas.length || 0} focus areas</span>
        <strong>Coming Soon</strong>
      </div>
    </section>
  )
}

function PlayerPickerModal({ context, onClear, onClose, onPick, players }) {
  const [pickerSearch, setPickerSearch] = useState('')
  const [pickerPosition, setPickerPosition] = useState('All positions')
  const positionOptions = useMemo(() => getPositionOptions(players), [players])
  const filteredPlayers = players.filter((player) => {
    const search = pickerSearch.trim().toLowerCase()
    const matchesSearch = !search || getPlayerName(player).toLowerCase().includes(search) || String(player.shirtNumber || '').includes(search)
    return matchesSearch && playerMatchesPosition(player, pickerPosition)
  })

  const title = context.type === 'slot'
    ? `Select ${context.slotLabel}`
    : context.type === 'assignment'
      ? `Choose ${context.roleLabel}`
      : 'Add Bench Player'

  return (
    <div className="players-os-modal-backdrop player-picker-backdrop">
      <div className="player-picker-modal dark-panel">
        <div className="panel-topline mini-topline">
          <div>
            <span className="players-os-kicker">Player picker</span>
            <h4>{title}</h4>
          </div>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <div className="player-picker-controls">
          <input placeholder="Search players" type="search" value={pickerSearch} onChange={(event) => setPickerSearch(event.target.value)} />
          <select value={pickerPosition} onChange={(event) => setPickerPosition(event.target.value)}>
            {positionOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="player-picker-list">
          {filteredPlayers.map((player, index) => {
            const playerId = getPlayerId(player, players.indexOf(player) || index)
            return (
              <button className={context.currentPlayerId === playerId ? 'selected' : ''} key={playerId} onClick={() => onPick(playerId)} type="button">
                <PlayerAvatar player={player} size="small" />
                <span>
                  <strong>{getPlayerName(player)}</strong>
                  <small>{player.mainPosition || 'No position set'} · #{player.shirtNumber || '--'}</small>
                </span>
                <em>{getMorale(player)}</em>
              </button>
            )
          })}
        </div>
        {context.currentPlayerId && <button className="players-os-secondary" type="button" onClick={onClear}>Clear current selection</button>}
      </div>
    </div>
  )
}

function PlayerAvatar({ player, size = 'medium' }) {
  const avatarUrl = getAvatarUrl(player)
  return (
    <span className={`player-avatar player-avatar-${size}`}>
      {avatarUrl ? <img alt="" src={avatarUrl} /> : getPlayerInitials(player)}
    </span>
  )
}

function StatusMetric({ label, tone = 'accent', value }) {
  return (
    <div className={`status-metric tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function InfoCard({ meta, title, value }) {
  return (
    <article className="profile-info-card">
      <span>{title}</span>
      <p>{value}</p>
      <small>{meta}</small>
    </article>
  )
}

function CompletenessCard({ value }) {
  return (
    <article className="profile-info-card completeness-card">
      <span>Profile Completeness</span>
      <div className="completeness-ring" style={{ '--progress': `${value}%` }}>
        <strong>{value}%</strong>
      </div>
      <small>Complete the profile to improve coaching context.</small>
    </article>
  )
}

function MiniFormationPreview({ lineup, slots }) {
  return (
    <div className="mini-formation-pitch mini-formation-pitch-v2">
      {slots.map((slot) => {
        const playerId = lineup.startingXI?.[slot.id]
        return <span className={playerId ? 'filled' : ''} key={slot.id} style={{ left: `${slot.x}%`, top: `${slot.y}%` }} />
      })}
    </div>
  )
}

function PlayerEditorModal({ avatarMessage, formData, formMode, onAvatarFile, onCancel, onChange, onRemoveAvatar, onSubmit }) {
  return (
    <div className="players-os-modal-backdrop">
      <form className="players-os-drawer" onSubmit={onSubmit}>
        <div className="panel-topline mini-topline">
          <div>
            <span className="players-os-kicker">{formMode === 'edit' ? 'Edit player' : 'Add player'}</span>
            <h4>{formMode === 'edit' ? 'Edit Player Details' : 'Add Player'}</h4>
          </div>
          <button type="button" onClick={onCancel}>Close</button>
        </div>

        <div className="player-editor-grid">
          <label>
            <span>Player name</span>
            <input name="fullName" onChange={onChange} placeholder="e.g. Jake Smith" value={formData.fullName} />
          </label>
          <label>
            <span>Shirt number</span>
            <input name="shirtNumber" onChange={onChange} value={formData.shirtNumber} />
          </label>
          <label>
            <span>Age</span>
            <input name="age" onChange={onChange} value={formData.age} />
          </label>
          <label>
            <span>Main position</span>
            <input name="mainPosition" onChange={onChange} placeholder="CM" value={formData.mainPosition} />
          </label>
          <label>
            <span>Secondary position</span>
            <input name="secondaryPosition" onChange={onChange} value={formData.secondaryPosition} />
          </label>
          <label>
            <span>Preferred foot</span>
            <select name="preferredFoot" onChange={onChange} value={formData.preferredFoot}>
              <option>Right</option>
              <option>Left</option>
              <option>Both</option>
            </select>
          </label>
          <label>
            <span>Status</span>
            <select name="status" onChange={onChange} value={formData.status}>
              {playerStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label>
            <span>Development focus</span>
            <input name="developmentFocus" onChange={onChange} value={formData.developmentFocus} />
          </label>
        </div>

        <div className="player-editor-ratings">
          {ratingFields.map((field) => (
            <label key={field.name}>
              <span>{field.label}</span>
              <input max="10" min="1" name={field.name} onChange={onChange} type="number" value={formData[field.name]} />
            </label>
          ))}
        </div>

        <label>
          <span>Strengths</span>
          <textarea name="strengths" onChange={onChange} rows="2" value={formData.strengths} />
        </label>
        <label>
          <span>Areas to improve</span>
          <textarea name="areasToImprove" onChange={onChange} rows="2" value={formData.areasToImprove} />
        </label>
        <label>
          <span>Coach notes</span>
          <textarea name="coachNotes" onChange={onChange} rows="3" value={formData.coachNotes} />
        </label>

        <div className="avatar-upload-row">
          <PlayerAvatar player={formData} size="medium" />
          <label className="players-os-secondary">
            Change photo
            <input accept="image/png,image/jpeg,image/webp" onChange={onAvatarFile} type="file" />
          </label>
          {formData.avatarDataUrl && <button className="players-os-secondary" type="button" onClick={onRemoveAvatar}>Remove photo</button>}
          {avatarMessage && <small>{avatarMessage}</small>}
        </div>

        <div className="drawer-actions">
          <button className="players-os-secondary" type="button" onClick={onCancel}>Cancel</button>
          <button className="players-os-primary" type="submit">Save Player</button>
        </div>
      </form>
    </div>
  )
}

function NoteModal({ noteForm, onChange, onClose, onSave, player }) {
  return (
    <div className="players-os-modal-backdrop">
      <form className="players-os-note-modal" onSubmit={onSave}>
        <div className="panel-topline mini-topline">
          <div>
            <span className="players-os-kicker">Coach feedback</span>
            <h4>Add note for {getPlayerName(player)}</h4>
          </div>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <label>
          <span>Note type</span>
          <select name="type" onChange={onChange} value={noteForm.type}>
            {noteTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <label>
          <span>Note</span>
          <textarea name="text" onChange={onChange} placeholder="What did you notice?" rows="6" value={noteForm.text} />
        </label>
        <div className="drawer-actions">
          <button className="players-os-secondary" type="button" onClick={onClose}>Cancel</button>
          <button className="players-os-primary" type="submit">Save Note</button>
        </div>
      </form>
    </div>
  )
}

function FocusModal({ focusValue, onChange, onClose, onSave, player }) {
  return (
    <div className="players-os-modal-backdrop">
      <form className="players-os-note-modal" onSubmit={onSave}>
        <div className="panel-topline mini-topline">
          <div>
            <span className="players-os-kicker">Development focus</span>
            <h4>{getPlayerName(player)}</h4>
          </div>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <label>
          <span>Focus area</span>
          <input onChange={(event) => onChange(event.target.value)} placeholder="e.g. Scanning before receiving" value={focusValue} />
        </label>
        <div className="drawer-actions">
          <button className="players-os-secondary" type="button" onClick={onClose}>Cancel</button>
          <button className="players-os-primary" type="submit">Save Focus</button>
        </div>
      </form>
    </div>
  )
}

function FullProfileModal({ onAddNote, onClose, onDelete, onEdit, player }) {
  const notes = getPlayerNotes(player)
  const averageRating = getAverageRating(player)

  return (
    <div className="players-os-modal-backdrop">
      <section className="players-os-profile-modal">
        <button className="profile-close" onClick={onClose} type="button">Close</button>
        <div className="profile-modal-hero">
          <PlayerAvatar player={player} size="large" />
          <div>
            <span className="players-os-kicker">Full player profile</span>
            <h4>{getPlayerName(player)}</h4>
            <p>#{player.shirtNumber || '--'} · {player.mainPosition || 'No position set'} · {player.preferredFoot || 'Foot not set'}</p>
          </div>
          <strong>{averageRating ? Math.round(averageRating * 10) : '--'}</strong>
        </div>
        <div className="profile-modal-grid">
          <InfoCard title="Strengths" value={player.strengths || 'No strengths recorded yet.'} meta="Coach profile" />
          <InfoCard title="Areas to Improve" value={player.areasToImprove || 'No development gaps recorded yet.'} meta="Coach profile" />
          <CompletenessCard value={getProfileCompleteness(player)} />
          <InfoCard title="Development Focus" value={player.developmentFocus || 'No development focus set.'} meta="Player growth" />
        </div>
        <div className="recent-notes-panel">
          <div className="panel-topline mini-topline">
            <div>
              <span className="players-os-kicker">Notes</span>
              <h4>Recent feedback</h4>
            </div>
            <button type="button" onClick={onAddNote}>Add note</button>
          </div>
          {notes.length === 0 ? <p className="empty-dark-copy">No notes yet.</p> : notes.map((note) => (
            <article className="recent-note-row" key={note.id || note.createdAt || note.text}>
              <span>{note.type || 'General'}</span>
              <p>{note.text}</p>
              <small>{formatDate(note.createdAt)}</small>
            </article>
          ))}
        </div>
        <div className="drawer-actions">
          <button className="players-os-secondary" type="button" onClick={onEdit}>Edit Player Details</button>
          <button className="players-os-danger" type="button" onClick={onDelete}>Archive / Remove Player</button>
        </div>
      </section>
    </div>
  )
}

export default PlayersOperatingSystemV2
