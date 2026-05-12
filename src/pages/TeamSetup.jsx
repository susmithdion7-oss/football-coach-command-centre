import { useEffect, useMemo, useState } from 'react'
import { setStorageItem } from '../utils/storage.js'
import {
  getTeamInitials,
  getThemeStyle,
  normaliseTeamIdentity,
  teamIdentityStorageKey,
} from '../utils/teamIdentity.js'

const teamTypes = [
  'Youth team',
  'Adult team',
  'University team',
  'School team',
  'Grassroots team',
  'Academy team',
  'Futsal team',
]

const coachRoles = [
  'Head Coach',
  'Assistant Coach',
  'Academy Coach',
  'Student Coach',
  'Futsal Coach',
  'Volunteer Coach',
]

const playingStyles = [
  'Possession-based',
  'High pressing',
  'Counter attacking',
  'Direct play',
  'Build from the back',
  'Defensive organisation',
  'Player development first',
  'Balanced',
]

const colourPresets = [
  { label: 'Sky Blue', value: '#38bdf8' },
  { label: 'Royal Blue', value: '#2563eb' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Black', value: '#151515' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Yellow', value: '#facc15' },
  { label: 'White / Light', value: '#f8fafc' },
  { label: 'Navy', value: '#0f172a' },
]

const setupSteps = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'identity', label: 'Team' },
  { id: 'colours', label: 'Colours' },
  { id: 'coach', label: 'Coach' },
  { id: 'season', label: 'Season' },
  { id: 'preview', label: 'Preview' },
]

const editSteps = setupSteps.filter((step) => step.id !== 'welcome')

function TeamSetup({ identity, isInitialSetup = false, onSave }) {
  const [formData, setFormData] = useState(() => normaliseTeamIdentity(identity))
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [message, setMessage] = useState('')
  const previewStyle = useMemo(() => getThemeStyle(formData), [formData])
  const initials = getTeamInitials(formData)
  const steps = isInitialSetup ? setupSteps : editSteps
  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  useEffect(() => {
    setFormData(normaliseTeamIdentity(identity))
    setCurrentStepIndex(0)
    setMessage('')
  }, [identity, isInitialSetup])

  useEffect(() => {
    if (!isInitialSetup) {
      return
    }

    setStorageItem(teamIdentityStorageKey, {
      ...formData,
      setupCompleted: false,
      updatedAt: new Date().toISOString(),
    })
  }, [formData, isInitialSetup])

  function updateField(event) {
    const { name, value } = event.target
    setMessage('')
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function updateColour(fieldName, value) {
    setMessage('')
    setFormData((currentData) => ({ ...currentData, [fieldName]: value }))
  }

  function validateRequiredFields() {
    if (
      !formData.teamName.trim() ||
      !formData.seasonName.trim() ||
      !formData.primaryColor ||
      !formData.secondaryColor ||
      !formData.coachName.trim()
    ) {
      setMessage('Add a team name, season, coach name, and team colours before entering Coach HQ.')
      return false
    }

    return true
  }

  function goToNextStep() {
    setMessage('')
    setCurrentStepIndex((stepIndex) => Math.min(stepIndex + 1, steps.length - 1))
  }

  function goToPreviousStep() {
    setMessage('')
    setCurrentStepIndex((stepIndex) => Math.max(stepIndex - 1, 0))
  }

  function goToStep(stepIndex) {
    setMessage('')
    setCurrentStepIndex(stepIndex)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validateRequiredFields()) {
      return
    }

    onSave(formData)
  }

  return (
    <section className={isInitialSetup ? 'team-setup-page first-run' : 'team-setup-page'} style={previewStyle}>
      <div className="wizard-shell">
        <WizardHeader isInitialSetup={isInitialSetup} />

        <div className="wizard-progress" aria-label="Team creation progress">
          <span>
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <div className="wizard-step-dots">
            {steps.map((step, index) => (
              <button
                aria-label={`Go to ${step.label}`}
                className={index === currentStepIndex ? 'wizard-dot active' : 'wizard-dot'}
                key={step.id}
                onClick={() => goToStep(index)}
                type="button"
              />
            ))}
          </div>
        </div>

        <div className="wizard-layout">
          <form className="wizard-stage" onSubmit={handleSubmit}>
            {message && <p className="form-message">{message}</p>}

            {currentStep.id === 'welcome' && (
              <WelcomeStep onStart={goToNextStep} />
            )}

            {currentStep.id === 'identity' && (
              <WizardCard
                eyebrow="Team profile"
                title={isInitialSetup ? 'Give your coaching workspace an identity.' : 'Update your team profile.'}
                description="This will appear across your dashboard, club shell, and future reports."
              >
                <div className="form-grid">
                  <label>
                    Team name
                    <input
                      name="teamName"
                      onChange={updateField}
                      placeholder="Manchester City U12"
                      required
                      value={formData.teamName}
                    />
                  </label>
                  <label>
                    Club name
                    <input
                      name="clubName"
                      onChange={updateField}
                      placeholder="Manchester City FC"
                      value={formData.clubName}
                    />
                  </label>
                  <label>
                    Season name
                    <input
                      name="seasonName"
                      onChange={updateField}
                      placeholder="2024/25 Season"
                      required
                      value={formData.seasonName}
                    />
                  </label>
                  <label>
                    Age group
                    <input
                      name="ageGroup"
                      onChange={updateField}
                      placeholder="U12, U16, Senior"
                      value={formData.ageGroup}
                    />
                  </label>
                  <label>
                    Team type
                    <select name="teamType" onChange={updateField} value={formData.teamType}>
                      {teamTypes.map((teamType) => (
                        <option key={teamType}>{teamType}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="crest-placeholder-card">
                  <div className="team-preview-crest">{initials}</div>
                  <div>
                    <strong>Team crest placeholder</strong>
                    <p>Logo upload will be added later. For now, your team initials become your HQ badge.</p>
                  </div>
                </div>
              </WizardCard>
            )}

            {currentStep.id === 'colours' && (
              <WizardCard
                eyebrow="Colours & kit identity"
                title="Shape the visual identity of your team HQ."
                description="Use club colours as accents. Cards stay clean and readable so the app still feels professional."
              >
                <div className="colour-field-grid">
                  <ColourField
                    label="Home kit colour"
                    name="homeKitColor"
                    onChange={updateColour}
                    value={formData.homeKitColor}
                  />
                  <ColourField
                    label="Away kit colour"
                    name="awayKitColor"
                    onChange={updateColour}
                    value={formData.awayKitColor}
                  />
                  <ColourField
                    label="Primary UI colour"
                    name="primaryColor"
                    onChange={updateColour}
                    value={formData.primaryColor}
                  />
                  <ColourField
                    label="Secondary UI colour"
                    name="secondaryColor"
                    onChange={updateColour}
                    value={formData.secondaryColor}
                  />
                </div>

                <div className="kit-card-row">
                  <KitPreviewCard label="Home kit" value={formData.homeKitColor} />
                  <KitPreviewCard label="Away kit" value={formData.awayKitColor} />
                </div>

                <div className="mini-ui-preview">
                  <button className="primary-button" type="button">Sample primary button</button>
                  <span className="sample-badge">Team badge</span>
                  <div className="sample-nav-item"><span>HQ</span> Active nav sample</div>
                </div>
              </WizardCard>
            )}

            {currentStep.id === 'coach' && (
              <WizardCard
                eyebrow="Coach identity"
                title="Set your coaching identity."
                description="This helps the app feel like your own coaching space and reminds you what you want to improve."
              >
                <div className="form-grid">
                  <label>
                    Coach name
                    <input
                      name="coachName"
                      onChange={updateField}
                      placeholder="Coach Dion"
                      required
                      value={formData.coachName}
                    />
                  </label>
                  <label>
                    Coach role
                    <select name="coachRole" onChange={updateField} value={formData.coachRole}>
                      {coachRoles.map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>
                  </label>
                  <label className="wide-field">
                    Coach goal
                    <textarea
                      name="coachGoal"
                      onChange={updateField}
                      placeholder="Plan better sessions, track player development, and improve tactical explanations."
                      rows="4"
                      value={formData.coachGoal}
                    />
                  </label>
                </div>

                <CoachPreview formData={formData} />
              </WizardCard>
            )}

            {currentStep.id === 'season' && (
              <WizardCard
                eyebrow="Season direction"
                title="Define what this season is about."
                description="Give your team a clear direction before the first session is planned."
              >
                <div className="form-grid">
                  <label>
                    Playing style
                    <select name="playingStyle" onChange={updateField} value={formData.playingStyle}>
                      {playingStyles.map((style) => (
                        <option key={style}>{style}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Squad size target
                    <input
                      name="squadSizeTarget"
                      onChange={updateField}
                      placeholder="18 players"
                      value={formData.squadSizeTarget}
                    />
                  </label>
                  <label>
                    Home venue
                    <input
                      name="homeVenue"
                      onChange={updateField}
                      placeholder="Community Sports Park"
                      value={formData.homeVenue}
                    />
                  </label>
                  <label>
                    Training days
                    <input
                      name="trainingDays"
                      onChange={updateField}
                      placeholder="Tuesday and Thursday"
                      value={formData.trainingDays}
                    />
                  </label>
                  <label>
                    Match day
                    <input
                      name="matchDay"
                      onChange={updateField}
                      placeholder="Saturday morning"
                      value={formData.matchDay}
                    />
                  </label>
                  <label>
                    Team motto
                    <input
                      name="teamMotto"
                      onChange={updateField}
                      placeholder="Work hard. Play brave."
                      value={formData.teamMotto}
                    />
                  </label>
                  <label className="wide-field">
                    Team goal
                    <textarea
                      name="teamGoal"
                      onChange={updateField}
                      placeholder="Improve confidence and decision-making. Build better communication. Develop technical ability."
                      rows="4"
                      value={formData.teamGoal}
                    />
                  </label>
                </div>
              </WizardCard>
            )}

            {currentStep.id === 'preview' && (
              <WizardCard
                eyebrow="Final preview"
                title={isInitialSetup ? 'Your Team HQ is ready to create.' : 'Review your Team HQ changes.'}
                description="Check the identity, colours, coach card, and season direction before saving."
              >
                <FinalPreview formData={formData} initials={initials} />
              </WizardCard>
            )}

            {currentStep.id !== 'welcome' && (
              <div className="wizard-actions">
                <button
                  className="secondary-button"
                  disabled={isFirstStep}
                  onClick={goToPreviousStep}
                  type="button"
                >
                  Back
                </button>

                {!isLastStep && (
                  <button className="primary-button" onClick={goToNextStep} type="button">
                    Next
                  </button>
                )}

                {isLastStep && (
                  <button className="primary-button" type="submit">
                    {isInitialSetup ? 'Enter Coach HQ' : 'Update Coach HQ'}
                  </button>
                )}
              </div>
            )}
          </form>

          <LivePreview formData={formData} initials={initials} />
        </div>
      </div>
    </section>
  )
}

function WizardHeader({ isInitialSetup }) {
  return (
    <header className="wizard-header-card">
      <div>
        <p className="section-kicker">Team Creation Wizard</p>
        <h2>{isInitialSetup ? 'Create your Team HQ' : 'Update your Team HQ'}</h2>
        <p>
          {isInitialSetup
            ? 'Build your squad, plan your sessions, design tactics, and track your team across the season.'
            : 'Refresh your team identity, colours, coach profile, and season direction.'}
        </p>
      </div>
    </header>
  )
}

function WelcomeStep({ onStart }) {
  return (
    <section className="wizard-welcome-card">
      <div className="wizard-pitch-visual" aria-hidden="true">
        <div className="wizard-pitch-line halfway" />
        <div className="wizard-pitch-circle" />
        <div className="wizard-pitch-box left" />
        <div className="wizard-pitch-box right" />
      </div>
      <div>
        <p className="section-kicker">Start your season</p>
        <h3>Create your Team HQ</h3>
        <p>
          This is where your coaching work starts. Set the team identity, choose the
          colours, define the season direction, and make the workspace feel like yours.
        </p>
        <button className="primary-button" onClick={onStart} type="button">
          Start Creating My Team
        </button>
      </div>
    </section>
  )
}

function WizardCard({ children, description, eyebrow, title }) {
  return (
    <section className="wizard-card">
      <div className="wizard-card-heading">
        <p className="section-kicker">{eyebrow}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {children}
    </section>
  )
}

function ColourField({ label, name, onChange, value }) {
  return (
    <div className="colour-field">
      <label>
        {label}
        <input
          name={name}
          onChange={(event) => onChange(name, event.target.value)}
          type="color"
          value={value}
        />
      </label>
      <div className="colour-preset-row" aria-label={`${label} presets`}>
        {colourPresets.map((preset) => (
          <button
            aria-label={preset.label}
            className={value === preset.value ? 'colour-swatch active' : 'colour-swatch'}
            key={`${name}-${preset.value}`}
            onClick={() => onChange(name, preset.value)}
            style={{ background: preset.value }}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}

function KitPreviewCard({ label, value }) {
  return (
    <div className="kit-preview-card">
      <div className="kit-shirt" style={{ background: value }}>
        <span />
      </div>
      <strong>{label}</strong>
    </div>
  )
}

function KitSwatch({ label, value }) {
  return (
    <div className="kit-swatch">
      <span style={{ background: value }} />
      <strong>{label}</strong>
    </div>
  )
}

function CoachPreview({ formData }) {
  const initials = getCoachInitials(formData.coachName)

  return (
    <div className="coach-preview-card">
      <div className="coach-preview-avatar">{initials}</div>
      <div>
        <span>{formData.coachRole || 'Coach role'}</span>
        <strong>{formData.coachName || 'Coach'}</strong>
        <p>{formData.coachGoal || 'Set your coaching goal for this season.'}</p>
      </div>
    </div>
  )
}

function FinalPreview({ formData, initials }) {
  return (
    <div className="final-preview-grid">
      <div className="final-team-card">
        <div className="team-preview-crest">{initials}</div>
        <div>
          <span>{formData.clubName || 'Club'}</span>
          <strong>{formData.teamName || 'Your Team'}</strong>
          <small>{formData.seasonName || 'Season'}</small>
        </div>
      </div>
      <PreviewItem label="Age group" value={formData.ageGroup || 'Not set'} />
      <PreviewItem label="Team type" value={formData.teamType || 'Not set'} />
      <PreviewItem label="Coach" value={formData.coachName || 'Coach'} />
      <PreviewItem label="Coach role" value={formData.coachRole || 'Coach role'} />
      <PreviewItem label="Playing style" value={formData.playingStyle || 'Balanced'} />
      <PreviewItem label="Team goal" value={formData.teamGoal || 'Not set yet'} />
      <PreviewItem label="Team motto" value={formData.teamMotto || 'Not set yet'} />
      <div className="final-kit-row">
        <KitSwatch label="Home" value={formData.homeKitColor} />
        <KitSwatch label="Away" value={formData.awayKitColor} />
      </div>
    </div>
  )
}

function PreviewItem({ label, value }) {
  return (
    <div className="preview-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function LivePreview({ formData, initials }) {
  return (
    <aside className="team-live-preview" aria-label="Live Team HQ preview">
      <div className="team-preview-card">
        <div className="team-preview-topline">
          <div className="team-preview-crest">{initials}</div>
          <div>
            <span>{formData.clubName || 'Club'}</span>
            <strong>{formData.teamName || 'Your Team'}</strong>
            <small>{formData.seasonName || 'Season'}</small>
          </div>
        </div>

        <div className="kit-preview-row">
          <KitSwatch label="Home" value={formData.homeKitColor} />
          <KitSwatch label="Away" value={formData.awayKitColor} />
        </div>

        <div className="team-preview-meta">
          <span>{formData.coachName || 'Coach'}</span>
          <span>{formData.coachRole || 'Coach role'}</span>
          <span>{formData.playingStyle || 'Playing style'}</span>
        </div>

        {(formData.teamGoal || formData.teamMotto) && (
          <div className="team-preview-statement">
            {formData.teamMotto && <strong>"{formData.teamMotto}"</strong>}
            {formData.teamGoal && <p>{formData.teamGoal}</p>}
          </div>
        )}
      </div>

      <div className="live-ui-card">
        <span>Theme preview</span>
        <button className="primary-button" type="button">Create Session</button>
        <div className="sample-nav-item"><span>HQ</span> Dashboard active</div>
        <span className="sample-badge">Season badge</span>
      </div>
    </aside>
  )
}

function getCoachInitials(coachName) {
  const words = String(coachName || 'Coach').split(' ').filter(Boolean)

  if (words.length === 0) {
    return 'CO'
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

export default TeamSetup
