import { useEffect, useMemo, useState } from 'react'
import {
  getTeamInitials,
  getThemeStyle,
  normaliseTeamIdentity,
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
]

function TeamSetup({ identity, isInitialSetup = false, onSave }) {
  const [formData, setFormData] = useState(() => normaliseTeamIdentity(identity))
  const [message, setMessage] = useState('')
  const previewStyle = useMemo(() => getThemeStyle(formData), [formData])
  const initials = getTeamInitials(formData)

  useEffect(() => {
    setFormData(normaliseTeamIdentity(identity))
  }, [identity])

  function updateField(event) {
    const { name, value } = event.target
    setMessage('')
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function updateColour(fieldName, value) {
    setMessage('')
    setFormData((currentData) => ({ ...currentData, [fieldName]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !formData.teamName.trim() ||
      !formData.seasonName.trim() ||
      !formData.primaryColor ||
      !formData.secondaryColor ||
      !formData.coachName.trim()
    ) {
      setMessage('Please add a team name, season, coach name, and team colours before entering Coach HQ.')
      return
    }

    onSave(formData)
  }

  return (
    <section className={isInitialSetup ? 'team-setup-page first-run' : 'team-setup-page'} style={previewStyle}>
      <div className="team-setup-hero">
        <div>
          <p className="section-kicker">Team Identity</p>
          <h2>{isInitialSetup ? 'Create your team HQ.' : 'Edit your team identity.'}</h2>
          <p>
            Set the team name, season, colours, coaching direction, and matchday feel.
            Your players, sessions, tactical boards, and drafts stay exactly where they are.
          </p>
        </div>
        <div className="team-preview-card" aria-label="Team identity preview">
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
      </div>

      <form className="team-setup-form" onSubmit={handleSubmit}>
        {message && <p className="form-message">{message}</p>}

        <SetupSection kicker="Step 1" title="Team Basics">
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
        </SetupSection>

        <SetupSection kicker="Step 2" title="Team Colours">
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
        </SetupSection>

        <SetupSection kicker="Step 3" title="Coach Identity">
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
                rows="3"
                value={formData.coachGoal}
              />
            </label>
          </div>
        </SetupSection>

        <SetupSection kicker="Step 4" title="Team Direction">
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
                placeholder="Oldham Sports Park"
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
                placeholder="Brave on the ball"
                value={formData.teamMotto}
              />
            </label>
            <label className="wide-field">
              Team goal
              <textarea
                name="teamGoal"
                onChange={updateField}
                placeholder="Improve confidence and decision-making. Build better communication. Develop technical ability."
                rows="3"
                value={formData.teamGoal}
              />
            </label>
          </div>
        </SetupSection>

        <div className="team-setup-actions">
          <button className="primary-button" type="submit">
            {isInitialSetup ? 'Enter Coach HQ' : 'Save Team Identity'}
          </button>
        </div>
      </form>
    </section>
  )
}

function SetupSection({ children, kicker, title }) {
  return (
    <section className="team-setup-card">
      <div className="form-heading">
        <div>
          <p className="section-kicker">{kicker}</p>
          <h3>{title}</h3>
        </div>
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
            key={preset.value}
            onClick={() => onChange(name, preset.value)}
            style={{ background: preset.value }}
            type="button"
          />
        ))}
      </div>
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

export default TeamSetup
