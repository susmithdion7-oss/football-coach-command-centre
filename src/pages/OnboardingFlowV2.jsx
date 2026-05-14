import { useMemo, useState } from 'react'
import { getThemeStyle, normaliseTeamIdentity } from '../utils/teamIdentity.js'

const steps = [
  { id: 'coach', label: 'Coach Profile', title: 'Step 1 - Coach Profile', subtitle: "Let's build your coach identity first." },
  { id: 'team', label: 'Team Identity', title: 'Step 2 - Team Identity', subtitle: 'Set the team identity that will shape your Coach HQ.' },
  { id: 'squad', label: 'Squad Setup', title: 'Step 3 - Squad Setup', subtitle: 'Add your players quickly. You can edit every profile later.' },
  { id: 'season', label: 'Season Setup', title: 'Step 4 - Season Setup', subtitle: 'Set the basic rhythm of your season.' },
  { id: 'direction', label: 'Coaching Direction', title: 'Step 5 - Coaching Direction', subtitle: 'Define how you want your team to play and grow.' },
  { id: 'review', label: 'Review & Launch', title: 'Step 6 - Review & Launch', subtitle: 'Everything is ready. Launch your Coach HQ.' },
]

const coachRoles = ['Head Coach', 'Assistant Coach', 'Academy Coach', 'Volunteer Coach', 'Other']
const coachingStyles = ['Player-centred', 'Guided discovery', 'High intensity', 'Possession-based', 'Tactical detail', 'Confidence builder']
const coachFocusOptions = ['Technical', 'Tactical', 'Physical', 'Mental', 'Confidence', 'Team discipline', 'Match preparation', 'Player development']
const ageGroups = ['U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U21', 'Senior', 'Mixed', 'Custom age group']
const teamTypes = ['Grassroots', 'Academy', 'School', 'College / University', 'Amateur', 'Semi-professional', 'Other']
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const matchDays = ['Saturday', 'Sunday', 'Midweek', 'Varies', 'Other']
const sessionDurations = ['45 minutes', '60 minutes', '75 minutes', '90 minutes', 'Custom']
const playingStyleOptions = ['Possession-based', 'High pressing', 'Counter-attacking', 'Build from the back', 'Fast transitions', 'Compact defending', 'Direct play', 'Creative attacking']
const trainingPriorityOptions = ['First touch', 'Scanning', 'Decision making', 'Passing quality', 'Finishing', '1v1 attacking', '1v1 defending', 'Defensive shape', 'Support angles', 'Confidence']
const objectiveOptions = ['Develop confident players', 'Improve technical quality', 'Build tactical understanding', 'Improve team discipline', 'Compete to win', 'Play attractive football', 'Improve match intensity', 'Build team identity']

const colourPresets = [
  { label: 'Sky Blue', value: '#38bdf8' },
  { label: 'Royal Blue', value: '#2563eb' },
  { label: 'Navy', value: '#0f172a' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Dark Red', value: '#991b1b' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Yellow', value: '#facc15' },
  { label: 'Gold', value: '#d97706' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Dark Green', value: '#166534' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Maroon', value: '#7f1d1d' },
  { label: 'Pink', value: '#db2777' },
  { label: 'Black', value: '#111827' },
  { label: 'White', value: '#f8fafc' },
  { label: 'Grey', value: '#64748b' },
]

const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp']
const maxImageSizeBytes = 2 * 1024 * 1024
const maxImageDimension = 512

function createInitialForm(identity) {
  const safeIdentity = normaliseTeamIdentity(identity)

  return {
    coachName: safeIdentity.coachName === 'Coach' ? '' : safeIdentity.coachName,
    coachRole: safeIdentity.coachRole || 'Head Coach',
    customCoachRole: '',
    coachingStyle: safeIdentity.coachStyle || 'Player-centred',
    customCoachingStyle: '',
    coachFocusAreas: Array.isArray(safeIdentity.coachFocusAreas) ? safeIdentity.coachFocusAreas : [],
    customCoachFocus: '',
    coachPhoto: safeIdentity.coachPhoto || null,
    coachMotto: safeIdentity.coachMotto || '',
    teamName: safeIdentity.teamName === 'Your Team' ? '' : safeIdentity.teamName,
    clubName: safeIdentity.clubName === 'Coach Command Centre' ? '' : safeIdentity.clubName,
    ageGroup: safeIdentity.ageGroup || '',
    customAgeGroup: '',
    teamType: safeIdentity.teamType && safeIdentity.teamType !== 'Grassroots team' ? safeIdentity.teamType : 'Grassroots',
    customTeamType: '',
    homeKitColor: safeIdentity.homeKitColor || safeIdentity.primaryColor || '#2563eb',
    awayKitColor: safeIdentity.awayKitColor || '#0f172a',
    useCustomColour: false,
    teamCrest: safeIdentity.teamCrest || null,
    teamMotto: safeIdentity.teamMotto || '',
    squadMode: 'paste',
    squadSaveMode: 'add',
    pastePlayerList: '',
    squadPreviewRows: [],
    importedPlayers: [],
    squadImportMethod: 'Start Empty',
    csvFileName: '',
    seasonName: safeIdentity.seasonName && safeIdentity.seasonName !== '2024/25 Season' ? safeIdentity.seasonName : '2026/27 Season',
    trainingDays: Array.isArray(safeIdentity.trainingDaysList) ? safeIdentity.trainingDaysList : [],
    trainingTime: safeIdentity.trainingTime || '',
    trainingVenue: safeIdentity.homeVenue || '',
    matchDay: safeIdentity.matchDay || '',
    customMatchDay: '',
    competition: safeIdentity.competition || '',
    sessionDurationDefault: safeIdentity.sessionDurationDefault || '75 minutes',
    customDuration: '',
    playingStyles: [],
    customPlayingStyle: '',
    trainingPriorities: Array.isArray(safeIdentity.trainingPriorities) ? safeIdentity.trainingPriorities : [],
    customTrainingPriority: '',
    seasonObjectives: Array.isArray(safeIdentity.seasonObjectives) ? safeIdentity.seasonObjectives : [],
    customObjective: '',
    coachObjectives: Array.isArray(safeIdentity.coachObjectives) ? safeIdentity.coachObjectives : [],
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('The image could not be read. Please try another file.'))
    reader.readAsDataURL(file)
  })
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('The file could not be read. Please try another CSV file.'))
    reader.readAsText(file)
  })
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The image could not be opened. Please try another PNG, JPG or WebP file.'))
    image.src = dataUrl
  })
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, mimeType, quality)
  })
}

async function processImageFile(file) {
  if (!acceptedImageTypes.includes(file.type)) {
    throw new Error('Please upload a PNG, JPG or WebP image.')
  }

  if (file.size > maxImageSizeBytes) {
    throw new Error('Please choose an image under 2MB.')
  }

  const originalDataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(originalDataUrl)
  const scale = Math.min(1, maxImageDimension / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height
  context.drawImage(image, 0, 0, width, height)

  const compressedBlob = await canvasToBlob(canvas, 'image/webp', 0.86)

  if (!compressedBlob) {
    return {
      dataUrl: canvas.toDataURL('image/jpeg', 0.86),
      fileName: file.name,
      mimeType: 'image/jpeg',
      sizeBytes: file.size,
      updatedAt: new Date().toISOString(),
    }
  }

  return {
    dataUrl: await readFileAsDataUrl(compressedBlob),
    fileName: file.name,
    mimeType: compressedBlob.type || 'image/webp',
    sizeBytes: compressedBlob.size,
    updatedAt: new Date().toISOString(),
  }
}

function splitCsvLine(line) {
  const cells = []
  let currentCell = ''
  let isInsideQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    const nextCharacter = line[index + 1]

    if (character === '"' && nextCharacter === '"') {
      currentCell += '"'
      index += 1
      continue
    }

    if (character === '"') {
      isInsideQuotes = !isInsideQuotes
      continue
    }

    if (character === ',' && !isInsideQuotes) {
      cells.push(currentCell.trim())
      currentCell = ''
      continue
    }

    currentCell += character
  }

  cells.push(currentCell.trim())
  return cells
}

function normaliseHeader(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getHeaderKey(value) {
  const header = normaliseHeader(value)
  const headerMap = {
    name: 'fullName',
    fullname: 'fullName',
    player: 'fullName',
    playername: 'fullName',
    shirtnumber: 'shirtNumber',
    number: 'shirtNumber',
    shirt: 'shirtNumber',
    squadnumber: 'shirtNumber',
    age: 'age',
    position: 'mainPosition',
    mainposition: 'mainPosition',
    preferredfoot: 'preferredFoot',
    foot: 'preferredFoot',
  }

  return headerMap[header] || ''
}

function normalisePreferredFoot(value = '') {
  const safeValue = String(value).trim().toLowerCase()

  if (['right', 'r'].includes(safeValue)) {
    return 'Right'
  }

  if (['left', 'l'].includes(safeValue)) {
    return 'Left'
  }

  if (['both', 'either', 'two-footed', 'two footed'].includes(safeValue)) {
    return 'Both'
  }

  return value ? String(value).trim() : ''
}

function getPlayerImportStatus(player) {
  const missing = []

  if (!player.shirtNumber) {
    missing.push('number')
  }

  if (!player.mainPosition) {
    missing.push('position')
  }

  if (!player.preferredFoot) {
    missing.push('foot')
  }

  if (missing.length === 0) {
    return 'Ready'
  }

  if (missing.length === 1) {
    return `Missing ${missing[0]}`
  }

  return 'Needs details'
}

function createPlayer(row) {
  const fullName = (row.fullName || row.name || '').trim()

  if (!fullName) {
    return null
  }

  const player = {
    fullName,
    shirtNumber: String(row.shirtNumber || '').trim(),
    age: String(row.age || '').trim(),
    mainPosition: String(row.mainPosition || row.position || '').trim(),
    secondaryPosition: '',
    preferredFoot: normalisePreferredFoot(row.preferredFoot),
    developmentFocus: '',
    technicalRating: '5',
    physicalRating: '5',
    tacticalRating: '5',
    mentalRating: '5',
    strengths: '',
    areasToImprove: '',
    coachNotes: 'Imported during onboarding. Add more detail in Player Hub.',
    avatarDataUrl: '',
    notes: [],
  }
  const importStatus = getPlayerImportStatus(player)

  return {
    ...player,
    status: importStatus === 'Ready' ? 'On Track' : 'Needs details',
    importStatus,
  }
}

function parseCsvPlayers(csvText) {
  const rows = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(splitCsvLine)

  if (rows.length === 0) {
    return []
  }

  const headerKeys = rows[0].map(getHeaderKey)
  const hasHeader = headerKeys.some(Boolean)
  const dataRows = hasHeader ? rows.slice(1) : rows

  return dataRows
    .map((row) => {
      if (hasHeader) {
        return row.reduce((player, cell, index) => {
          const key = headerKeys[index]
          return key ? { ...player, [key]: cell } : player
        }, {})
      }

      return {
        fullName: row[0],
        shirtNumber: row[1],
        mainPosition: row[2],
        preferredFoot: row[3],
      }
    })
    .map(createPlayer)
    .filter(Boolean)
}

function parsePastedPlayers(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = splitCsvLine(line)
      const [fullName, shirtNumber, mainPosition, preferredFoot] = parts
      return createPlayer({ fullName, shirtNumber, mainPosition, preferredFoot })
    })
    .filter(Boolean)
}

function getMissingDataCount(players) {
  return players.reduce((total, player) => {
    const missingFields = ['shirtNumber', 'mainPosition', 'preferredFoot'].filter((field) => !player[field])
    return total + missingFields.length
  }, 0)
}

function getPositionGroup(position = '') {
  const safePosition = position.toLowerCase()

  if (safePosition.includes('gk') || safePosition.includes('goal')) {
    return 'GK'
  }

  if (safePosition.includes('def') || safePosition.includes('back') || safePosition.includes('cb') || safePosition.includes('rb') || safePosition.includes('lb')) {
    return 'DEF'
  }

  if (safePosition.includes('mid') || safePosition.includes('wing') || safePosition.includes('cm') || safePosition.includes('dm') || safePosition.includes('am')) {
    return 'MID'
  }

  if (safePosition.includes('st') || safePosition.includes('fwd') || safePosition.includes('striker') || safePosition.includes('forward')) {
    return 'FWD'
  }

  return 'Other'
}

function getPositionCoverage(players) {
  return players.reduce((coverage, player) => {
    const group = getPositionGroup(player.mainPosition)
    return { ...coverage, [group]: (coverage[group] || 0) + 1 }
  }, { GK: 0, DEF: 0, MID: 0, FWD: 0, Other: 0 })
}

function getFinalCoachRole(formData) {
  return formData.coachRole === 'Other' ? formData.customCoachRole.trim() : formData.coachRole
}

function getFinalCoachingStyle(formData) {
  return formData.coachingStyle === 'Custom style' ? formData.customCoachingStyle.trim() : formData.coachingStyle
}

function getFinalAgeGroup(formData) {
  return formData.ageGroup === 'Custom age group' ? formData.customAgeGroup.trim() : formData.ageGroup
}

function getFinalTeamType(formData) {
  return formData.teamType === 'Other' ? formData.customTeamType.trim() : formData.teamType
}

function getFinalMatchDay(formData) {
  return formData.matchDay === 'Other' ? formData.customMatchDay.trim() : formData.matchDay
}

function getFinalDuration(formData) {
  return formData.sessionDurationDefault === 'Custom' ? formData.customDuration.trim() : formData.sessionDurationDefault
}

function getSubmissionData(formData) {
  return {
    ...formData,
    coachRole: getFinalCoachRole(formData),
    coachingStyle: getFinalCoachingStyle(formData),
    ageGroup: getFinalAgeGroup(formData),
    teamType: getFinalTeamType(formData),
    awayKitColor: '#0f172a',
    matchDay: getFinalMatchDay(formData),
    sessionDurationDefault: getFinalDuration(formData),
    coachObjectives: [],
  }
}

function OnboardingFlowV2({ existingPlayersCount = 0, identity, onComplete }) {
  const [mode, setMode] = useState('entry')
  const [stepIndex, setStepIndex] = useState(0)
  const [formData, setFormData] = useState(() => createInitialForm(identity))
  const [message, setMessage] = useState('')
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const currentStep = steps[stepIndex]
  const finalAgeGroup = getFinalAgeGroup(formData)
  const previewIdentity = useMemo(() => normaliseTeamIdentity({
    teamName: formData.teamName || 'Your Team',
    clubName: formData.clubName || 'Your Club',
    seasonName: formData.seasonName || '2026/27 Season',
    ageGroup: finalAgeGroup,
    teamType: getFinalTeamType(formData),
    homeKitColor: formData.homeKitColor,
    awayKitColor: '#0f172a',
    primaryColor: formData.homeKitColor,
    secondaryColor: '#0f172a',
    coachName: formData.coachName || 'Coach',
    coachRole: getFinalCoachRole(formData) || 'Head Coach',
    teamCrest: formData.teamCrest,
  }), [formData, finalAgeGroup])
  const previewStyle = useMemo(() => getThemeStyle(previewIdentity), [previewIdentity])

  function updateField(event) {
    const { name, value } = event.target
    setMessage('')
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function updateValue(fieldName, value) {
    setMessage('')
    setFormData((currentData) => ({ ...currentData, [fieldName]: value }))
  }

  function toggleLimitedValue(fieldName, value, maxItems) {
    setMessage('')
    setFormData((currentData) => {
      const currentValues = currentData[fieldName]

      if (currentValues.includes(value)) {
        return { ...currentData, [fieldName]: currentValues.filter((item) => item !== value) }
      }

      if (currentValues.length >= maxItems) {
        setMessage(`You can choose up to ${maxItems}.`)
        return currentData
      }

      return { ...currentData, [fieldName]: [...currentValues, value] }
    })
  }

  function addCustomValue(fieldName, inputFieldName, maxItems) {
    setMessage('')
    setFormData((currentData) => {
      const value = currentData[inputFieldName].trim()

      if (!value) {
        setMessage('Add a custom value first.')
        return currentData
      }

      if (currentData[fieldName].includes(value)) {
        return { ...currentData, [inputFieldName]: '' }
      }

      if (currentData[fieldName].length >= maxItems) {
        setMessage(`You can choose up to ${maxItems}.`)
        return currentData
      }

      return {
        ...currentData,
        [fieldName]: [...currentData[fieldName], value],
        [inputFieldName]: '',
      }
    })
  }

  async function handleImageUpload(event, fieldName) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    try {
      const processedImage = await processImageFile(file)
      updateValue(fieldName, processedImage)
      setMessage(`${fieldName === 'coachPhoto' ? 'Coach photo' : 'Team crest'} ready.`)
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function handleCsvUpload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setMessage('CSV import is supported in this version. Please upload a .csv file.')
      return
    }

    try {
      const text = await readFileAsText(file)
      const parsedPlayers = parseCsvPlayers(text)
      setFormData((currentData) => ({
        ...currentData,
        csvFileName: file.name,
        squadMode: 'import',
        squadPreviewRows: parsedPlayers,
        importedPlayers: [],
        squadImportMethod: 'CSV Import',
      }))
      setMessage(parsedPlayers.length > 0 ? `${parsedPlayers.length} players parsed. Review and confirm import.` : 'No players found in this CSV.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  function parsePastedList() {
    const parsedPlayers = parsePastedPlayers(formData.pastePlayerList)
    setFormData((currentData) => ({
      ...currentData,
      squadMode: 'paste',
      squadPreviewRows: parsedPlayers,
      importedPlayers: [],
      squadImportMethod: 'Paste Player List',
    }))
    setMessage(parsedPlayers.length > 0 ? `${parsedPlayers.length} players parsed. Review and confirm import.` : 'Paste at least one player name to preview.')
  }

  function confirmSquadImport() {
    if (formData.squadPreviewRows.length === 0) {
      setMessage('Add a CSV or paste player names before confirming import.')
      return
    }

    setFormData((currentData) => ({ ...currentData, importedPlayers: currentData.squadPreviewRows }))
    setMessage(`${formData.squadPreviewRows.length} players ready.`)
  }

  function startEmptySquad() {
    setFormData((currentData) => ({
      ...currentData,
      squadMode: 'manual',
      squadPreviewRows: [],
      importedPlayers: [],
      squadImportMethod: 'Start Empty',
    }))
    setMessage('You can add players later in Player Hub.')
  }

  function validateCurrentStep() {
    if (currentStep.id === 'coach') {
      return Boolean(formData.coachName.trim() && getFinalCoachRole(formData))
    }

    if (currentStep.id === 'team') {
      return Boolean(formData.teamName.trim() && getFinalAgeGroup(formData) && formData.homeKitColor)
    }

    if (currentStep.id === 'season') {
      return Boolean(formData.seasonName.trim() && getFinalDuration(formData))
    }

    if (currentStep.id === 'direction') {
      return formData.seasonObjectives.length > 0
    }

    return true
  }

  function getValidationMessage() {
    if (currentStep.id === 'coach') {
      return 'Coach name and role are required.'
    }

    if (currentStep.id === 'team') {
      return 'Team name, age group and primary colour are required.'
    }

    if (currentStep.id === 'season') {
      return 'Season name and default duration are required.'
    }

    if (currentStep.id === 'direction') {
      return 'Choose at least one season objective.'
    }

    return 'Complete the required fields before continuing.'
  }

  function goNext() {
    if (!validateCurrentStep()) {
      setMessage(getValidationMessage())
      return
    }

    setMessage('')
    setStepIndex((currentIndex) => Math.min(currentIndex + 1, steps.length - 1))
  }

  function goBack() {
    setMessage('')

    if (stepIndex === 0) {
      setMode('entry')
      return
    }

    setStepIndex((currentIndex) => Math.max(currentIndex - 1, 0))
  }

  function launchCoachHq() {
    if (!validateCurrentStep()) {
      setMessage(getValidationMessage())
      return
    }

    onComplete(getSubmissionData(formData))
  }

  if (mode === 'entry') {
    return (
      <section className="onboarding-entry-page" style={previewStyle}>
        <div className="onboarding-atmosphere" />
        <header className="onboarding-entry-header">
          <strong>Coach Command Centre</strong>
          <span>Coach-first football workspace</span>
        </header>

        <main className="onboarding-entry-main">
          <p className="onboarding-kicker">Build your Coach HQ</p>
          <h1>Take charge of your team.</h1>
          <p>Build your coaching HQ for the season ahead.</p>

          <div className="entry-choice-grid">
            <button className="entry-choice-card primary" type="button" onClick={() => setMode('wizard')}>
              <span>+</span>
              <div>
                <strong>Create New Team</strong>
                <p>Build your coaching HQ from the ground up.</p>
              </div>
              <em>-&gt;</em>
            </button>

            <button className="entry-choice-card" type="button" onClick={() => setDemoModalOpen(true)}>
              <span>View</span>
              <div>
                <strong>Explore Demo</strong>
                <p>Try a sample workspace before creating your own.</p>
              </div>
              <em>-&gt;</em>
            </button>
          </div>

          <small>Setup takes around 3-5 minutes.</small>
        </main>

        {demoModalOpen && (
          <DemoModal onClose={() => setDemoModalOpen(false)} onCreate={() => {
            setDemoModalOpen(false)
            setMode('wizard')
          }} />
        )}
      </section>
    )
  }

  return (
    <section className="onboarding-wizard-page onboarding-v2" style={previewStyle}>
      <header className="onboarding-wizard-header">
        <div>
          <strong>Coach Command Centre</strong>
          <span>{currentStep.title}</span>
        </div>
        <div className="onboarding-stepper" aria-label="Onboarding progress">
          {steps.map((step, index) => (
            <button
              className={index === stepIndex ? 'active' : index < stepIndex ? 'complete' : ''}
              disabled={index > stepIndex}
              key={step.id}
              type="button"
              onClick={() => index <= stepIndex && setStepIndex(index)}
            >
              <span>{index < stepIndex ? 'OK' : index + 1}</span>
              {step.label}
            </button>
          ))}
        </div>
      </header>

      <main className="onboarding-wizard-main">
        <section className="onboarding-form-card compact-setup-card">
          <div className="onboarding-step-heading">
            <p>{currentStep.label}</p>
            <h2>{currentStep.title}</h2>
            <span>{currentStep.subtitle}</span>
          </div>

          {currentStep.id === 'coach' && (
            <CoachProfileStep
              formData={formData}
              onAddCustom={addCustomValue}
              onImageUpload={handleImageUpload}
              onToggle={toggleLimitedValue}
              onUpdate={updateField}
              onValue={updateValue}
            />
          )}
          {currentStep.id === 'team' && (
            <TeamIdentityStep formData={formData} onImageUpload={handleImageUpload} onUpdate={updateField} onValue={updateValue} />
          )}
          {currentStep.id === 'squad' && (
            <SquadSetupStep
              existingPlayersCount={existingPlayersCount}
              formData={formData}
              onConfirmImport={confirmSquadImport}
              onCsvUpload={handleCsvUpload}
              onParsePaste={parsePastedList}
              onStartEmpty={startEmptySquad}
              onUpdate={updateField}
              onValue={updateValue}
            />
          )}
          {currentStep.id === 'season' && (
            <SeasonSetupStep formData={formData} onToggle={toggleLimitedValue} onUpdate={updateField} />
          )}
          {currentStep.id === 'direction' && (
            <CoachingDirectionStep formData={formData} onAddCustom={addCustomValue} onToggle={toggleLimitedValue} onUpdate={updateField} />
          )}
          {currentStep.id === 'review' && (
            <ReviewLaunchStep formData={formData} previewIdentity={previewIdentity} />
          )}

          {message && <p className="onboarding-message">{message}</p>}
        </section>

        <LivePreviewCard currentStep={currentStep} formData={formData} previewIdentity={previewIdentity} />
      </main>

      <footer className="onboarding-action-bar">
        <button className="onboarding-secondary-button" type="button" onClick={goBack}>Back</button>
        {currentStep.id === 'review' ? (
          <button className="onboarding-primary-button" type="button" onClick={launchCoachHq}>Enter Coach HQ</button>
        ) : (
          <button className="onboarding-primary-button" disabled={!validateCurrentStep()} type="button" onClick={goNext}>Continue</button>
        )}
      </footer>
    </section>
  )
}

function CoachProfileStep({ formData, onAddCustom, onImageUpload, onToggle, onUpdate, onValue }) {
  return (
    <div className="onboarding-step-stack">
      <section className="setup-section-card two-column-section">
        <div>
          <h3>Coach identity</h3>
          <p>This tells Coach HQ who is taking charge.</p>
        </div>
        <div className="onboarding-step-grid two-columns compact-fields">
          <label>
            Coach name
            <input name="coachName" onChange={onUpdate} placeholder="e.g. Alex Morgan" required type="text" value={formData.coachName} />
          </label>
          <label>
            Role
            <select name="coachRole" onChange={onUpdate} required value={formData.coachRole}>
              {coachRoles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
          {formData.coachRole === 'Other' && (
            <label className="full-width">
              Custom role
              <input name="customCoachRole" onChange={onUpdate} placeholder="e.g. Lead Development Coach" type="text" value={formData.customCoachRole} />
            </label>
          )}
          <label className="full-width">
            Coach motto
            <input maxLength="80" name="coachMotto" onChange={onUpdate} placeholder="Develop players. Build character. Win together." type="text" value={formData.coachMotto} />
          </label>
        </div>
      </section>

      <section className="setup-section-card">
        <SectionHeading title="Coaching style" copy="Choose a preset or describe your own style." />
        <SingleChoiceGrid
          customLabel="Custom style"
          customValue={formData.customCoachingStyle}
          fieldName="coachingStyle"
          inputName="customCoachingStyle"
          inputPlaceholder="Describe your coaching style"
          onUpdate={onUpdate}
          onValue={onValue}
          options={coachingStyles}
          selectedValue={formData.coachingStyle}
        />
      </section>

      <section className="setup-section-card">
        <SectionHeading title="Main coaching focus" copy="Choose up to 3. You can add a custom focus." />
        <OptionSection
          customFieldName="customCoachFocus"
          customPlaceholder="Add your own coaching focus"
          fieldName="coachFocusAreas"
          maxItems={3}
          onAddCustom={onAddCustom}
          onToggle={onToggle}
          onUpdate={onUpdate}
          options={coachFocusOptions}
          selectedValues={formData.coachFocusAreas}
          value={formData.customCoachFocus}
        />
      </section>

      <ImageUploadBlock
        fieldName="coachPhoto"
        image={formData.coachPhoto}
        label="Upload coach photo"
        onImageUpload={onImageUpload}
        onRemove={() => onValue('coachPhoto', null)}
      />
    </div>
  )
}

function TeamIdentityStep({ formData, onImageUpload, onUpdate, onValue }) {
  return (
    <div className="onboarding-step-stack">
      <section className="setup-section-card">
        <SectionHeading title="Team details" copy="Create the identity your Coach HQ will use." />
        <div className="onboarding-step-grid two-columns compact-fields">
          <label>
            Team name
            <input name="teamName" onChange={onUpdate} placeholder="e.g. Manchester United U16" required type="text" value={formData.teamName} />
          </label>
          <label>
            Club name
            <input name="clubName" onChange={onUpdate} placeholder="e.g. Manchester United" type="text" value={formData.clubName} />
          </label>
          <label>
            Age group
            <select name="ageGroup" onChange={onUpdate} required value={formData.ageGroup}>
              <option value="">Select age group</option>
              {ageGroups.map((ageGroup) => <option key={ageGroup}>{ageGroup}</option>)}
            </select>
          </label>
          <label>
            Team type
            <select name="teamType" onChange={onUpdate} value={formData.teamType}>
              {teamTypes.map((teamType) => <option key={teamType}>{teamType}</option>)}
            </select>
          </label>
          {formData.ageGroup === 'Custom age group' && (
            <label>
              Custom age group
              <input name="customAgeGroup" onChange={onUpdate} placeholder="e.g. U19 Development" type="text" value={formData.customAgeGroup} />
            </label>
          )}
          {formData.teamType === 'Other' && (
            <label>
              Custom team type
              <input name="customTeamType" onChange={onUpdate} placeholder="e.g. Community programme" type="text" value={formData.customTeamType} />
            </label>
          )}
          <label className="full-width">
            Team motto
            <input maxLength="80" name="teamMotto" onChange={onUpdate} placeholder="Together we improve." type="text" value={formData.teamMotto} />
          </label>
        </div>
      </section>

      <section className="setup-section-card">
        <SectionHeading title="Primary team colour" copy="This colour becomes the main Coach HQ theme." />
        <ColourSwatches formData={formData} onValue={onValue} />
      </section>

      <ImageUploadBlock
        fieldName="teamCrest"
        image={formData.teamCrest}
        label="Upload team crest"
        onImageUpload={onImageUpload}
        onRemove={() => onValue('teamCrest', null)}
      />
    </div>
  )
}

function SquadSetupStep({ existingPlayersCount, formData, onConfirmImport, onCsvUpload, onParsePaste, onStartEmpty, onUpdate, onValue }) {
  const previewRows = formData.squadPreviewRows
  const readyRows = formData.importedPlayers
  const visibleRows = readyRows.length > 0 ? readyRows : previewRows
  const missingDataCount = getMissingDataCount(visibleRows)
  const parsedCount = previewRows.length
  const readyCount = readyRows.length

  return (
    <div className="squad-setup-layout polished-squad-layout">
      <div className="squad-option-grid">
        {[
          { id: 'import', title: 'Import Squad File', copy: 'Upload a CSV file with player details.' },
          { id: 'paste', title: 'Paste Player List', copy: 'Paste one player per line.' },
          { id: 'manual', title: 'Start Empty', copy: 'Add players later in Player Hub.' },
        ].map((option) => (
          <button className={formData.squadMode === option.id ? 'squad-option active' : 'squad-option'} key={option.id} type="button" onClick={() => onValue('squadMode', option.id)}>
            <strong>{option.title}</strong>
            <span>{option.copy}</span>
          </button>
        ))}
      </div>

      <section className="setup-section-card squad-format-card">
        <strong>Supported format</strong>
        <span>Name, Shirt Number, Position, Preferred Foot</span>
        <p>Only player name is required. Missing details can be completed later.</p>
      </section>

      {formData.squadMode === 'import' && (
        <div className="squad-import-panel compact-import-panel">
          <label className="file-drop-card">
            <input accept=".csv,text/csv" onChange={onCsvUpload} type="file" />
            <strong>Upload CSV</strong>
            <span>{formData.csvFileName || 'Supported columns: Name, Shirt Number, Position, Preferred Foot'}</span>
          </label>
        </div>
      )}

      {formData.squadMode === 'paste' && (
        <div className="squad-import-panel compact-import-panel">
          <label>
            Paste player list
            <textarea name="pastePlayerList" onChange={onUpdate} placeholder={'Jake Smith, 7, CM, Right\nOscar Brown, 9, ST, Left\nEthan Jones, 4, CB, Right'} rows="7" value={formData.pastePlayerList} />
          </label>
          <button className="onboarding-secondary-button" type="button" onClick={onParsePaste}>Preview pasted players</button>
        </div>
      )}

      {formData.squadMode === 'manual' && (
        <div className="squad-empty-panel">
          <strong>Start with an empty squad</strong>
          <p>You can launch Coach HQ now and add player profiles later.</p>
          <button className="onboarding-secondary-button" type="button" onClick={onStartEmpty}>Start empty squad</button>
        </div>
      )}

      {(previewRows.length > 0 || readyRows.length > 0) && (
        <div className="squad-preview-panel full-preview-panel">
          <div className="squad-preview-header">
            <div>
              <strong>{readyCount > 0 ? `${readyCount} players ready` : `${parsedCount} players parsed`}</strong>
              <span>{missingDataCount} missing fields can be completed later.</span>
            </div>
            <button className="onboarding-primary-button small" type="button" onClick={onConfirmImport}>Confirm Import</button>
          </div>

          <p className="import-trust-note">
            Showing all {visibleRows.length} of {visibleRows.length} players. All {visibleRows.length} players will be imported.
          </p>

          {existingPlayersCount > 0 && (
            <div className="squad-save-mode">
              <span>You already have players in this workspace.</span>
              <label><input checked={formData.squadSaveMode === 'add'} name="squadSaveMode" onChange={() => onValue('squadSaveMode', 'add')} type="radio" /> Add to existing squad</label>
              <label><input checked={formData.squadSaveMode === 'replace'} name="squadSaveMode" onChange={() => onValue('squadSaveMode', 'replace')} type="radio" /> Replace current squad</label>
            </div>
          )}

          <div className="squad-preview-table full-preview-table">
            <div className="squad-preview-row header">
              <strong>Name</strong>
              <span>No.</span>
              <span>Position</span>
              <span>Foot</span>
              <span>Status</span>
            </div>
            {visibleRows.map((player, index) => (
              <div className="squad-preview-row" key={`${player.fullName}-${index}`}>
                <strong>{player.fullName}</strong>
                <span>{player.shirtNumber || '--'}</span>
                <span>{player.mainPosition || 'Missing'}</span>
                <span>{player.preferredFoot || 'Missing'}</span>
                <span>{player.importStatus || getPlayerImportStatus(player)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SeasonSetupStep({ formData, onToggle, onUpdate }) {
  return (
    <div className="onboarding-step-stack">
      <section className="setup-section-card">
        <SectionHeading title="Season rhythm" copy="Set the basic weekly pattern for training and matches." />
        <div className="onboarding-step-grid two-columns compact-fields">
          <label>
            Season name
            <input name="seasonName" onChange={onUpdate} placeholder="2026/27 Season" required type="text" value={formData.seasonName} />
          </label>
          <label>
            Usual training time
            <input name="trainingTime" onChange={onUpdate} type="time" value={formData.trainingTime} />
          </label>
          <label>
            Training venue
            <input name="trainingVenue" onChange={onUpdate} placeholder="e.g. Academy Pitch 2" type="text" value={formData.trainingVenue} />
          </label>
          <label>
            Match day
            <select name="matchDay" onChange={onUpdate} value={formData.matchDay}>
              <option value="">Select match day</option>
              {matchDays.map((matchDay) => <option key={matchDay}>{matchDay}</option>)}
            </select>
          </label>
          {formData.matchDay === 'Other' && (
            <label>
              Custom match day
              <input name="customMatchDay" onChange={onUpdate} placeholder="e.g. Friday evening" type="text" value={formData.customMatchDay} />
            </label>
          )}
          <label>
            Competition / league
            <input name="competition" onChange={onUpdate} placeholder="e.g. Local League" type="text" value={formData.competition} />
          </label>
          <label>
            Default session duration
            <select name="sessionDurationDefault" onChange={onUpdate} value={formData.sessionDurationDefault}>
              {sessionDurations.map((duration) => <option key={duration}>{duration}</option>)}
            </select>
          </label>
          {formData.sessionDurationDefault === 'Custom' && (
            <label>
              Custom duration
              <input name="customDuration" onChange={onUpdate} placeholder="e.g. 80 minutes" type="text" value={formData.customDuration} />
            </label>
          )}
        </div>
      </section>
      <section className="setup-section-card">
        <SectionHeading title="Training days" copy="Choose the days your team usually trains." />
        <OptionPills fieldName="trainingDays" maxItems={7} onToggle={onToggle} options={weekdays} selectedValues={formData.trainingDays} />
      </section>
    </div>
  )
}

function CoachingDirectionStep({ formData, onAddCustom, onToggle, onUpdate }) {
  return (
    <div className="direction-step-stack polished-direction-stack">
      <DirectionSection
        copy="Choose up to 2."
        customFieldName="customPlayingStyle"
        customPlaceholder="Add your own playing style"
        fieldName="playingStyles"
        maxItems={2}
        onAddCustom={onAddCustom}
        onToggle={onToggle}
        onUpdate={onUpdate}
        options={playingStyleOptions}
        selectedValues={formData.playingStyles}
        title="How do you want your team to play?"
        value={formData.customPlayingStyle}
      />
      <DirectionSection
        copy="Choose up to 3."
        customFieldName="customTrainingPriority"
        customPlaceholder="Add your own training focus"
        fieldName="trainingPriorities"
        maxItems={3}
        onAddCustom={onAddCustom}
        onToggle={onToggle}
        onUpdate={onUpdate}
        options={trainingPriorityOptions}
        selectedValues={formData.trainingPriorities}
        title="What should training focus on first?"
        value={formData.customTrainingPriority}
      />
      <DirectionSection
        copy="Choose up to 3."
        customFieldName="customObjective"
        customPlaceholder="Add your own objective"
        fieldName="seasonObjectives"
        maxItems={3}
        onAddCustom={onAddCustom}
        onToggle={onToggle}
        onUpdate={onUpdate}
        options={objectiveOptions}
        selectedValues={formData.seasonObjectives}
        title="What does success look like this season?"
        value={formData.customObjective}
      />
    </div>
  )
}

function ReviewLaunchStep({ formData, previewIdentity }) {
  const players = formData.importedPlayers
  const missingDataCount = getMissingDataCount(players)
  const summaryCards = [
    { title: 'Coach Profile', rows: [formData.coachName || 'Coach', getFinalCoachRole(formData), getFinalCoachingStyle(formData)] },
    { title: 'Team Identity', rows: [formData.teamName || 'Your Team', formData.clubName || 'Your Club', getFinalAgeGroup(formData) || 'No age group'] },
    { title: 'Squad', rows: [`${players.length} players ready`, `${missingDataCount} need details`, formData.squadImportMethod] },
    { title: 'Season Setup', rows: [formData.seasonName, formData.trainingDays.join(', ') || 'No training days set', getFinalMatchDay(formData) || 'No match day set'] },
    { title: 'Coaching Direction', rows: [formData.playingStyles.join(', ') || 'Style can be added later', formData.trainingPriorities.join(', ') || 'Priorities can be added later', formData.seasonObjectives.join(', ')] },
  ]

  return (
    <div className="review-launch-layout polished-review-layout">
      <div className="review-card-grid">
        {summaryCards.map((card) => (
          <article key={card.title}>
            <strong>{card.title}</strong>
            {card.rows.map((row) => <span key={row}>{row}</span>)}
          </article>
        ))}
      </div>
      <div className="dashboard-preview-card launch-preview-card">
        <CrestPreview crest={formData.teamCrest} identity={previewIdentity} />
        <div>
          <strong>{formData.teamName || 'Your Team'} Coach HQ</strong>
          <span>{formData.coachName || 'Coach'} - {formData.seasonName}</span>
        </div>
        <div className="mini-dashboard-grid">
          <span>Players {players.length}</span>
          <span>Style {formData.playingStyles[0] || 'Set later'}</span>
          <span>Theme ready</span>
        </div>
      </div>
    </div>
  )
}

function LivePreviewCard({ currentStep, formData, previewIdentity }) {
  const players = formData.importedPlayers.length > 0 ? formData.importedPlayers : formData.squadPreviewRows
  const coverage = getPositionCoverage(players)
  const missingDataCount = getMissingDataCount(players)

  return (
    <aside className="onboarding-live-preview polished-live-preview">
      <span>Live Coach HQ Preview</span>
      <div className="preview-identity-row">
        <CrestPreview crest={formData.teamCrest} identity={previewIdentity} />
        <div>
          <strong>{formData.teamName || 'Your Team'}</strong>
          <p>{formData.clubName || 'Your Club'} - {getFinalAgeGroup(formData) || 'Age group'}</p>
        </div>
      </div>

      {currentStep.id === 'coach' && (
        <PreviewBlock title="Coach Profile">
          <div className="preview-coach-card compact-preview-coach">
            <AvatarPreview image={formData.coachPhoto} name={formData.coachName || 'Coach'} />
            <div>
              <strong>{formData.coachName || 'Coach'}</strong>
              <p>{getFinalCoachRole(formData) || 'Role'} - {getFinalCoachingStyle(formData) || 'Style'}</p>
            </div>
          </div>
          <div className="preview-focus-stack">
            {formData.coachFocusAreas.map((item) => <span key={item}>{item}</span>)}
            {formData.coachFocusAreas.length === 0 && <span>Focus areas will appear here</span>}
          </div>
          {formData.coachMotto && <p className="preview-note">{formData.coachMotto}</p>}
        </PreviewBlock>
      )}

      {currentStep.id === 'team' && (
        <PreviewBlock title="Team Theme">
          <div className="kit-preview-row single-theme-preview">
            <span style={{ background: formData.homeKitColor }}>Primary colour</span>
            <button type="button">Sample Action</button>
          </div>
          <div className="mini-theme-preview">
            <i />
            <div><strong>{formData.teamName || 'Your Team'}</strong><span>Sidebar theme preview</span></div>
          </div>
        </PreviewBlock>
      )}

      {currentStep.id === 'squad' && (
        <PreviewBlock title="Squad Import">
          <div className="preview-squad-panel">
            <strong>{players.length} players ready</strong>
            <span>{missingDataCount} missing fields</span>
            <div className="preview-pitch-dots">
              {Array.from({ length: Math.min(players.length || 6, 10) }, (_, index) => <i key={index} />)}
            </div>
            <div className="coverage-grid">
              {Object.entries(coverage).map(([label, count]) => <span key={label}>{label} {count}</span>)}
            </div>
          </div>
        </PreviewBlock>
      )}

      {currentStep.id === 'season' && (
        <PreviewBlock title="Season Setup">
          <PreviewRows rows={[
            ['Season', formData.seasonName || 'Season name'],
            ['Training', formData.trainingDays.join(', ') || 'No days set'],
            ['Time', formData.trainingTime || 'No time set'],
            ['Venue', formData.trainingVenue || 'No venue set'],
            ['Match day', getFinalMatchDay(formData) || 'No match day set'],
            ['Duration', getFinalDuration(formData) || 'No duration set'],
          ]} />
        </PreviewBlock>
      )}

      {currentStep.id === 'direction' && (
        <PreviewBlock title="Coaching Direction">
          <PreviewRows rows={[
            ['Playing style', formData.playingStyles.join(', ') || 'Choose up to 2'],
            ['Training priorities', formData.trainingPriorities.join(', ') || 'Choose up to 3'],
            ['Season objectives', formData.seasonObjectives.join(', ') || 'Choose up to 3'],
          ]} />
          <p className="preview-note">This will shape your Coach HQ, session planning and player development.</p>
        </PreviewBlock>
      )}

      {currentStep.id === 'review' && (
        <PreviewBlock title="Ready to launch">
          <PreviewRows rows={[
            ['Team', formData.teamName || 'Your Team'],
            ['Coach', formData.coachName || 'Coach'],
            ['Players', `${formData.importedPlayers.length} ready`],
            ['Theme', 'Ready'],
          ]} />
        </PreviewBlock>
      )}
    </aside>
  )
}

function SectionHeading({ copy, title }) {
  return (
    <div className="setup-section-heading">
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  )
}

function SingleChoiceGrid({ customLabel, customValue, fieldName, inputName, inputPlaceholder, onUpdate, onValue, options, selectedValue }) {
  const allOptions = [...options, customLabel]

  return (
    <div className="single-choice-stack">
      <div className="selectable-card-grid compact-choice-grid">
        {allOptions.map((option) => (
          <button className={selectedValue === option ? 'selected' : ''} key={option} type="button" onClick={() => onValue(fieldName, option)}>
            {option}
          </button>
        ))}
      </div>
      {selectedValue === customLabel && (
        <label>
          {inputPlaceholder}
          <input name={inputName} onChange={onUpdate} placeholder={inputPlaceholder} type="text" value={customValue} />
        </label>
      )}
    </div>
  )
}

function OptionSection({ customFieldName, customPlaceholder, fieldName, maxItems, onAddCustom, onToggle, onUpdate, options, selectedValues, value }) {
  const allOptions = [...options, ...selectedValues.filter((item) => !options.includes(item))]

  return (
    <div className="custom-option-section">
      <OptionPills fieldName={fieldName} maxItems={maxItems} onToggle={onToggle} options={allOptions} selectedValues={selectedValues} />
      <div className="custom-input-row">
        <input name={customFieldName} onChange={onUpdate} placeholder={customPlaceholder} type="text" value={value} />
        <button className="onboarding-secondary-button" type="button" onClick={() => onAddCustom(fieldName, customFieldName, maxItems)}>Add</button>
      </div>
    </div>
  )
}

function DirectionSection({ copy, customFieldName, customPlaceholder, fieldName, maxItems, onAddCustom, onToggle, onUpdate, options, selectedValues, title, value }) {
  return (
    <section className="setup-section-card direction-section-card">
      <SectionHeading title={title} copy={copy} />
      <OptionSection
        customFieldName={customFieldName}
        customPlaceholder={customPlaceholder}
        fieldName={fieldName}
        maxItems={maxItems}
        onAddCustom={onAddCustom}
        onToggle={onToggle}
        onUpdate={onUpdate}
        options={options}
        selectedValues={selectedValues}
        value={value}
      />
    </section>
  )
}

function OptionPills({ fieldName, maxItems, onToggle, options, selectedValues }) {
  return (
    <div className="onboarding-chip-grid compact-pill-grid">
      {options.map((option) => (
        <button className={selectedValues.includes(option) ? 'selected' : ''} key={option} type="button" onClick={() => onToggle(fieldName, option, maxItems)}>
          {option}
        </button>
      ))}
    </div>
  )
}

function ColourSwatches({ formData, onValue }) {
  return (
    <div className="colour-swatch-workspace">
      <div className="named-colour-grid">
        {colourPresets.map((colour) => (
          <button className={formData.homeKitColor === colour.value && !formData.useCustomColour ? 'selected' : ''} key={colour.label} type="button" onClick={() => {
            onValue('homeKitColor', colour.value)
            onValue('useCustomColour', false)
          }}>
            <span style={{ background: colour.value }} />
            <strong>{colour.label}</strong>
          </button>
        ))}
        <button className={formData.useCustomColour ? 'selected custom' : 'custom'} type="button" onClick={() => onValue('useCustomColour', true)}>
          <span style={{ background: formData.homeKitColor }} />
          <strong>Custom</strong>
        </button>
      </div>
      {formData.useCustomColour && (
        <label className="custom-colour-control">
          Custom colour
          <input onChange={(event) => onValue('homeKitColor', event.target.value)} type="color" value={formData.homeKitColor} />
        </label>
      )}
    </div>
  )
}

function ImageUploadBlock({ fieldName, image, label, onImageUpload, onRemove }) {
  return (
    <div className="image-upload-block compact-upload-block">
      <div className="image-upload-preview">
        {image?.dataUrl ? <img alt={label} src={image.dataUrl} /> : <span>+</span>}
      </div>
      <div>
        <strong>{label}</strong>
        <span>PNG, JPG or WebP under 2MB.</span>
        <label className="upload-button">
          Choose image
          <input accept="image/png,image/jpeg,image/webp" onChange={(event) => onImageUpload(event, fieldName)} type="file" />
        </label>
        {image?.dataUrl && <button className="text-button" type="button" onClick={onRemove}>Remove</button>}
      </div>
    </div>
  )
}

function AvatarPreview({ image, name }) {
  if (image?.dataUrl) {
    return <img alt={`${name} avatar`} className="preview-avatar" src={image.dataUrl} />
  }

  return <div className="preview-avatar placeholder">{name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'CO'}</div>
}

function CrestPreview({ crest, identity }) {
  if (crest?.dataUrl) {
    return <img alt={`${identity.teamName} crest`} className="preview-crest" src={crest.dataUrl} />
  }

  const initials = (identity.teamName || 'Your Team').split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'YT'
  return <div className="preview-crest placeholder">{initials}</div>
}

function PreviewBlock({ children, title }) {
  return (
    <section className="preview-block">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function PreviewRows({ rows }) {
  return (
    <div className="preview-row-stack">
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}

function DemoModal({ onClose, onCreate }) {
  return (
    <div className="onboarding-modal-backdrop" role="presentation">
      <section className="onboarding-demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
        <button aria-label="Close demo modal" type="button" onClick={onClose}>x</button>
        <span>Explore Demo</span>
        <h2 id="demo-modal-title">Demo workspace is coming soon.</h2>
        <p>Create your own Team HQ to start building. A safe sample workspace can be added later without overwriting real data.</p>
        <div>
          <button className="onboarding-secondary-button" type="button" onClick={onClose}>Close</button>
          <button className="onboarding-primary-button" type="button" onClick={onCreate}>Create New Team</button>
        </div>
      </section>
    </div>
  )
}

export default OnboardingFlowV2
