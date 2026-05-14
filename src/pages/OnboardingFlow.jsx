import { useMemo, useState } from 'react'
import { getThemeStyle, normaliseTeamIdentity } from '../utils/teamIdentity.js'

const steps = [
  { id: 'coach', label: 'Coach Profile', title: 'Step 1 — Coach Profile', subtitle: 'Let’s build your coach identity first.' },
  { id: 'team', label: 'Team Identity', title: 'Step 2 — Team Identity', subtitle: 'Set the team identity that will shape your Coach HQ.' },
  { id: 'squad', label: 'Squad Setup', title: 'Step 3 — Squad Setup', subtitle: 'Add your players quickly. You can edit every profile later.' },
  { id: 'season', label: 'Season Setup', title: 'Step 4 — Season Setup', subtitle: 'Set the basic rhythm of your season.' },
  { id: 'direction', label: 'Coaching Direction', title: 'Step 5 — Coaching Direction', subtitle: 'Define how you want your team to play and grow.' },
  { id: 'review', label: 'Review & Launch', title: 'Step 6 — Review & Launch', subtitle: 'Everything is ready. Launch your Coach HQ.' },
]

const coachRoles = ['Head Coach', 'Assistant Coach', 'Academy Coach', 'Volunteer Coach', 'Other']
const coachingStyles = ['Player-centred', 'Guided discovery', 'High intensity', 'Possession-based', 'Tactical detail', 'Confidence builder']
const coachFocusOptions = ['Technical', 'Tactical', 'Physical', 'Mental', 'Confidence', 'Team discipline', 'Match preparation', 'Player development']
const ageGroups = ['U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U21', 'Senior', 'Mixed']
const teamTypes = ['Grassroots', 'Academy', 'School', 'College / University', 'Amateur', 'Semi-professional', 'Other']
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const matchDays = ['Saturday', 'Sunday', 'Midweek', 'Varies']
const sessionDurations = ['45 minutes', '60 minutes', '75 minutes', '90 minutes', 'Custom']
const playingStyleOptions = ['Possession-based', 'High pressing', 'Counter-attacking', 'Direct play', 'Build from the back', 'Fast transitions', 'Compact defending', 'Creative attacking']
const trainingPriorityOptions = ['First touch', 'Passing quality', 'Scanning', 'Decision making', 'Finishing', '1v1 attacking', '1v1 defending', 'Defensive shape', 'Support angles', 'Transition reactions', 'Communication', 'Confidence']
const seasonObjectiveOptions = ['Develop confident players', 'Improve technical quality', 'Build tactical understanding', 'Improve team discipline', 'Compete to win', 'Play attractive football', 'Improve match intensity', 'Build team identity']
const coachObjectiveOptions = ['Plan better sessions', 'Track player development', 'Reflect after matches', 'Build a coaching portfolio', 'Improve tactical detail', 'Prepare better for matches', 'Become more organised']
const colourPresets = ['#2563eb', '#38bdf8', '#16a34a', '#f97316', '#dc2626', '#7c3aed', '#0f172a', '#f8fafc']
const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp']
const maxImageSizeBytes = 2 * 1024 * 1024
const maxImageDimension = 512

function createInitialForm(identity) {
  const safeIdentity = normaliseTeamIdentity(identity)

  return {
    coachName: safeIdentity.coachName === 'Coach' ? '' : safeIdentity.coachName,
    coachRole: safeIdentity.coachRole || 'Head Coach',
    coachingStyle: 'Player-centred',
    coachFocusAreas: [],
    coachPhoto: safeIdentity.coachPhoto || null,
    coachMotto: '',
    teamName: safeIdentity.teamName === 'Your Team' ? '' : safeIdentity.teamName,
    clubName: safeIdentity.clubName === 'Coach Command Centre' ? '' : safeIdentity.clubName,
    ageGroup: safeIdentity.ageGroup || '',
    teamType: 'Grassroots',
    homeKitColor: safeIdentity.homeKitColor || safeIdentity.primaryColor || '#2563eb',
    awayKitColor: safeIdentity.awayKitColor || safeIdentity.secondaryColor || '#f8fafc',
    teamCrest: safeIdentity.teamCrest || null,
    teamMotto: '',
    squadMode: 'paste',
    squadSaveMode: 'add',
    pastePlayerList: '',
    squadPreviewRows: [],
    importedPlayers: [],
    squadImportMethod: 'Start Empty',
    csvFileName: '',
    seasonName: safeIdentity.seasonName && safeIdentity.seasonName !== '2024/25 Season' ? safeIdentity.seasonName : '2026/27 Season',
    trainingDays: [],
    trainingTime: '',
    trainingVenue: safeIdentity.homeVenue || '',
    matchDay: safeIdentity.matchDay || '',
    competition: '',
    sessionDurationDefault: '75 minutes',
    playingStyles: [],
    trainingPriorities: [],
    seasonObjectives: [],
    coachObjectives: [],
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

function createPlayer(row) {
  const fullName = (row.fullName || row.name || '').trim()

  if (!fullName) {
    return null
  }

  return {
    fullName,
    shirtNumber: String(row.shirtNumber || '').trim(),
    age: String(row.age || '').trim(),
    mainPosition: String(row.mainPosition || row.position || '').trim(),
    secondaryPosition: '',
    preferredFoot: String(row.preferredFoot || '').trim() || 'Needs details',
    status: 'Needs details',
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
        age: row[2],
        mainPosition: row[3],
        preferredFoot: row[4],
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
    const missingFields = ['shirtNumber', 'age', 'mainPosition', 'preferredFoot'].filter((field) => !player[field] || player[field] === 'Needs details')
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

function OnboardingFlow({ existingPlayersCount = 0, identity, onComplete }) {
  const [mode, setMode] = useState('entry')
  const [stepIndex, setStepIndex] = useState(0)
  const [formData, setFormData] = useState(() => createInitialForm(identity))
  const [message, setMessage] = useState('')
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const currentStep = steps[stepIndex]
  const previewIdentity = useMemo(() => normaliseTeamIdentity({
    teamName: formData.teamName || 'Your Team',
    clubName: formData.clubName || 'Your Club',
    seasonName: formData.seasonName || '2026/27 Season',
    ageGroup: formData.ageGroup,
    teamType: formData.teamType,
    homeKitColor: formData.homeKitColor,
    awayKitColor: formData.awayKitColor,
    primaryColor: formData.homeKitColor,
    secondaryColor: formData.awayKitColor,
    coachName: formData.coachName || 'Coach',
    coachRole: formData.coachRole,
    teamCrest: formData.teamCrest,
  }), [formData])
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

  function toggleChip(fieldName, value, maxItems) {
    setMessage('')
    setFormData((currentData) => {
      const currentValues = currentData[fieldName]

      if (currentValues.includes(value)) {
        return { ...currentData, [fieldName]: currentValues.filter((item) => item !== value) }
      }

      if (currentValues.length >= maxItems) {
        setMessage(`Choose up to ${maxItems}.`)
        return currentData
      }

      return { ...currentData, [fieldName]: [...currentValues, value] }
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
      setMessage('CSV import is supported in this first version. Please upload a .csv file.')
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
    setMessage(`${formData.squadPreviewRows.length} players ready to add when you launch Coach HQ.`)
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
      return Boolean(formData.coachName.trim() && formData.coachRole)
    }

    if (currentStep.id === 'team') {
      return Boolean(formData.teamName.trim() && formData.ageGroup && formData.homeKitColor)
    }

    if (currentStep.id === 'season') {
      return Boolean(formData.seasonName.trim())
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
      return 'Team name, age group and home colour are required.'
    }

    if (currentStep.id === 'season') {
      return 'Season name is required.'
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

    onComplete(formData)
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
              <em>→</em>
            </button>

            <button className="entry-choice-card" type="button" onClick={() => setDemoModalOpen(true)}>
              <span>◐</span>
              <div>
                <strong>Explore Demo</strong>
                <p>Try a sample workspace before creating your own.</p>
              </div>
              <em>→</em>
            </button>
          </div>

          <small>Setup takes around 3–5 minutes.</small>
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
    <section className="onboarding-wizard-page" style={previewStyle}>
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
              <span>{index < stepIndex ? '✓' : index + 1}</span>
              {step.label}
            </button>
          ))}
        </div>
      </header>

      <main className="onboarding-wizard-main">
        <section className="onboarding-form-card">
          <div className="onboarding-step-heading">
            <p>{currentStep.label}</p>
            <h2>{currentStep.title}</h2>
            <span>{currentStep.subtitle}</span>
          </div>

          {currentStep.id === 'coach' && (
            <CoachProfileStep formData={formData} onImageUpload={handleImageUpload} onToggle={toggleChip} onUpdate={updateField} onValue={updateValue} />
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
            <SeasonSetupStep formData={formData} onToggle={toggleChip} onUpdate={updateField} />
          )}
          {currentStep.id === 'direction' && (
            <CoachingDirectionStep formData={formData} onToggle={toggleChip} />
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

function CoachProfileStep({ formData, onImageUpload, onToggle, onUpdate, onValue }) {
  return (
    <div className="onboarding-step-grid two-columns">
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
      <label>
        Coaching style
        <select name="coachingStyle" onChange={onUpdate} value={formData.coachingStyle}>
          {coachingStyles.map((style) => <option key={style}>{style}</option>)}
        </select>
      </label>
      <label>
        Coach motto
        <input maxLength="80" name="coachMotto" onChange={onUpdate} placeholder="e.g. Develop players. Build character. Win together." type="text" value={formData.coachMotto} />
      </label>
      <div className="onboarding-field-block full-width">
        <span>Main coaching focus</span>
        <ChipGrid maxItems={3} fieldName="coachFocusAreas" options={coachFocusOptions} selectedValues={formData.coachFocusAreas} onToggle={onToggle} />
      </div>
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
    <div className="onboarding-step-grid two-columns">
      <label>
        Team name
        <input name="teamName" onChange={onUpdate} placeholder="e.g. U18 Elite" required type="text" value={formData.teamName} />
      </label>
      <label>
        Club name
        <input name="clubName" onChange={onUpdate} placeholder="e.g. Northside FC" type="text" value={formData.clubName} />
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
      <ColourPicker label="Home kit colour" value={formData.homeKitColor} onChange={(value) => onValue('homeKitColor', value)} />
      <ColourPicker label="Away kit colour" value={formData.awayKitColor} onChange={(value) => onValue('awayKitColor', value)} />
      <label>
        Team motto
        <input maxLength="80" name="teamMotto" onChange={onUpdate} placeholder="e.g. Together we improve." type="text" value={formData.teamMotto} />
      </label>
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
  const missingDataCount = getMissingDataCount(readyRows.length > 0 ? readyRows : previewRows)

  return (
    <div className="squad-setup-layout">
      <div className="squad-option-grid">
        {[
          { id: 'import', title: 'Import Squad File', copy: 'Upload a CSV file.' },
          { id: 'paste', title: 'Paste Player List', copy: 'Paste names, numbers and positions.' },
          { id: 'manual', title: 'Start Manually', copy: 'Add players later in Player Hub.' },
        ].map((option) => (
          <button className={formData.squadMode === option.id ? 'squad-option active' : 'squad-option'} key={option.id} type="button" onClick={() => onValue('squadMode', option.id)}>
            <strong>{option.title}</strong>
            <span>{option.copy}</span>
          </button>
        ))}
      </div>

      {formData.squadMode === 'import' && (
        <div className="squad-import-panel">
          <label className="file-drop-card">
            <input accept=".csv,text/csv" onChange={onCsvUpload} type="file" />
            <strong>Upload CSV</strong>
            <span>{formData.csvFileName || 'Expected columns: Name, Shirt Number, Age, Position, Preferred Foot'}</span>
          </label>
        </div>
      )}

      {formData.squadMode === 'paste' && (
        <div className="squad-import-panel">
          <label>
            Paste player list
            <textarea name="pastePlayerList" onChange={onUpdate} placeholder={'Jake Smith, 7, CM, Right\nOscar Brown, 9, ST, Left\nEthan Jones'} rows="6" value={formData.pastePlayerList} />
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
        <div className="squad-preview-panel">
          <div className="squad-preview-header">
            <div>
              <strong>{readyRows.length > 0 ? `${readyRows.length} players ready` : `${previewRows.length} players parsed`}</strong>
              <span>{missingDataCount} missing fields can be completed later.</span>
            </div>
            <button className="onboarding-primary-button small" type="button" onClick={onConfirmImport}>Confirm Import</button>
          </div>

          {existingPlayersCount > 0 && (
            <div className="squad-save-mode">
              <span>Existing squad found</span>
              <label><input checked={formData.squadSaveMode === 'add'} name="squadSaveMode" onChange={() => onValue('squadSaveMode', 'add')} type="radio" /> Add to existing squad</label>
              <label><input checked={formData.squadSaveMode === 'replace'} name="squadSaveMode" onChange={() => onValue('squadSaveMode', 'replace')} type="radio" /> Replace current squad</label>
            </div>
          )}

          <div className="squad-preview-table">
            {(readyRows.length > 0 ? readyRows : previewRows).slice(0, 6).map((player, index) => (
              <div key={`${player.fullName}-${index}`}>
                <strong>{player.fullName}</strong>
                <span>{player.shirtNumber || '--'}</span>
                <span>{player.mainPosition || 'Needs position'}</span>
                <span>{player.preferredFoot || 'Needs foot'}</span>
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
    <div className="onboarding-step-grid two-columns">
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
      <label>
        Competition / league
        <input name="competition" onChange={onUpdate} placeholder="e.g. Local League" type="text" value={formData.competition} />
      </label>
      <label>
        Session duration default
        <select name="sessionDurationDefault" onChange={onUpdate} value={formData.sessionDurationDefault}>
          {sessionDurations.map((duration) => <option key={duration}>{duration}</option>)}
        </select>
      </label>
      <div className="onboarding-field-block full-width">
        <span>Training days</span>
        <ChipGrid maxItems={7} fieldName="trainingDays" options={weekdays} selectedValues={formData.trainingDays} onToggle={onToggle} />
      </div>
    </div>
  )
}

function CoachingDirectionStep({ formData, onToggle }) {
  return (
    <div className="direction-step-stack">
      <div className="onboarding-field-block">
        <span>Team playing style</span>
        <ChipGrid maxItems={2} fieldName="playingStyles" options={playingStyleOptions} selectedValues={formData.playingStyles} onToggle={onToggle} />
      </div>
      <div className="onboarding-field-block">
        <span>Training priorities</span>
        <ChipGrid maxItems={3} fieldName="trainingPriorities" options={trainingPriorityOptions} selectedValues={formData.trainingPriorities} onToggle={onToggle} />
      </div>
      <div className="onboarding-field-block">
        <span>Season objectives</span>
        <ChipGrid maxItems={3} fieldName="seasonObjectives" options={seasonObjectiveOptions} selectedValues={formData.seasonObjectives} onToggle={onToggle} />
      </div>
      <div className="onboarding-field-block">
        <span>Coach objectives</span>
        <ChipGrid maxItems={3} fieldName="coachObjectives" options={coachObjectiveOptions} selectedValues={formData.coachObjectives} onToggle={onToggle} />
      </div>
    </div>
  )
}

function ReviewLaunchStep({ formData, previewIdentity }) {
  const summaryCards = [
    { title: 'Coach Profile', rows: [formData.coachName || 'Coach', formData.coachRole, formData.coachingStyle] },
    { title: 'Team Identity', rows: [formData.teamName || 'Your Team', formData.clubName || 'Your Club', formData.ageGroup || 'No age group'] },
    { title: 'Squad', rows: [`${formData.importedPlayers.length} players`, `${getMissingDataCount(formData.importedPlayers)} missing fields`, formData.squadImportMethod] },
    { title: 'Season', rows: [formData.seasonName, formData.trainingDays.join(', ') || 'No training days set', formData.matchDay || 'No match day set'] },
    { title: 'Coaching Direction', rows: [formData.playingStyles.join(', ') || 'Style can be added later', formData.trainingPriorities.join(', ') || 'Priorities can be added later', formData.seasonObjectives.join(', ')] },
  ]

  return (
    <div className="review-launch-layout">
      <div className="review-card-grid">
        {summaryCards.map((card) => (
          <article key={card.title}>
            <strong>{card.title}</strong>
            {card.rows.map((row) => <span key={row}>{row}</span>)}
          </article>
        ))}
      </div>
      <div className="dashboard-preview-card">
        <CrestPreview crest={formData.teamCrest} identity={previewIdentity} />
        <div>
          <strong>{formData.teamName || 'Your Team'} Coach HQ</strong>
          <span>{formData.coachName || 'Coach'} · {formData.seasonName}</span>
        </div>
        <div className="mini-dashboard-grid">
          <span>Players {formData.importedPlayers.length}</span>
          <span>Style {formData.playingStyles[0] || 'Set later'}</span>
          <span>Next Session Ready</span>
        </div>
      </div>
    </div>
  )
}

function LivePreviewCard({ currentStep, formData, previewIdentity }) {
  const players = formData.importedPlayers.length > 0 ? formData.importedPlayers : formData.squadPreviewRows
  const coverage = getPositionCoverage(players)

  return (
    <aside className="onboarding-live-preview">
      <span>Live Coach HQ Preview</span>
      <div className="preview-identity-row">
        <CrestPreview crest={formData.teamCrest} identity={previewIdentity} />
        <div>
          <strong>{formData.teamName || 'Your Team'}</strong>
          <p>{formData.clubName || 'Your Club'} · {formData.ageGroup || 'Age group'}</p>
        </div>
      </div>

      <div className="preview-coach-card">
        <AvatarPreview image={formData.coachPhoto} name={formData.coachName || 'Coach'} />
        <div>
          <strong>{formData.coachName || 'Coach'}</strong>
          <p>{formData.coachRole} · {formData.coachingStyle}</p>
        </div>
      </div>

      <div className="kit-preview-row">
        <span style={{ background: formData.homeKitColor }}>Home</span>
        <span style={{ background: formData.awayKitColor }}>Away</span>
        <button type="button">Sample Action</button>
      </div>

      {currentStep.id === 'squad' ? (
        <div className="preview-squad-panel">
          <strong>{players.length} players ready</strong>
          <div className="preview-pitch-dots">
            {Array.from({ length: Math.min(players.length || 6, 10) }, (_, index) => <i key={index} />)}
          </div>
          <div className="coverage-grid">
            {Object.entries(coverage).map(([label, count]) => <span key={label}>{label} {count}</span>)}
          </div>
        </div>
      ) : (
        <div className="preview-focus-stack">
          {[...formData.trainingPriorities, ...formData.seasonObjectives].slice(0, 5).map((item) => <span key={item}>{item}</span>)}
          {formData.trainingPriorities.length === 0 && formData.seasonObjectives.length === 0 && <span>This will shape your Coach HQ</span>}
        </div>
      )}
    </aside>
  )
}

function ChipGrid({ fieldName, maxItems, onToggle, options, selectedValues }) {
  return (
    <div className="onboarding-chip-grid">
      {options.map((option) => (
        <button className={selectedValues.includes(option) ? 'selected' : ''} key={option} type="button" onClick={() => onToggle(fieldName, option, maxItems)}>
          {option}
        </button>
      ))}
    </div>
  )
}

function ColourPicker({ label, onChange, value }) {
  return (
    <div className="colour-picker-block">
      <label>
        {label}
        <input onChange={(event) => onChange(event.target.value)} type="color" value={value} />
      </label>
      <div className="colour-preset-strip">
        {colourPresets.map((colour) => (
          <button aria-label={colour} className={value === colour ? 'selected' : ''} key={colour} style={{ background: colour }} type="button" onClick={() => onChange(colour)} />
        ))}
      </div>
    </div>
  )
}

function ImageUploadBlock({ fieldName, image, label, onImageUpload, onRemove }) {
  return (
    <div className="image-upload-block">
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

function DemoModal({ onClose, onCreate }) {
  return (
    <div className="onboarding-modal-backdrop" role="presentation">
      <section className="onboarding-demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
        <button aria-label="Close demo modal" type="button" onClick={onClose}>×</button>
        <span>Explore Demo</span>
        <h2 id="demo-modal-title">Demo workspace is coming soon.</h2>
        <p>You can create your own Team HQ now. A safe sample workspace can be added later without overwriting real data.</p>
        <div>
          <button className="onboarding-secondary-button" type="button" onClick={onClose}>Close</button>
          <button className="onboarding-primary-button" type="button" onClick={onCreate}>Create New Team</button>
        </div>
      </section>
    </div>
  )
}

export default OnboardingFlow
