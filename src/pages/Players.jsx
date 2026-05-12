import { useEffect, useMemo, useRef, useState } from 'react'
import { getStorageItem, removeStorageItem, setStorageItem } from '../utils/storage.js'

const emptyPlayer = {
  fullName: '',
  shirtNumber: '',
  age: '',
  mainPosition: '',
  secondaryPosition: '',
  preferredFoot: 'Right',
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
  { name: 'technicalRating', label: 'Technical rating' },
  { name: 'physicalRating', label: 'Physical rating' },
  { name: 'tacticalRating', label: 'Tactical understanding rating' },
  { name: 'mentalRating', label: 'Mentality / attitude rating' },
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
    formMode: 'add',
    restored: false,
    savedSnapshot: emptyPlayerSnapshot,
    selectedPlayerId: players[0]?.id ?? null,
  }
}

function Players({ players, onAddPlayer, onDeletePlayer, onUpdatePlayer }) {
  const [initialDraftState] = useState(() => getDraftInitialState(players))
  const [selectedPlayerId, setSelectedPlayerId] = useState(initialDraftState.selectedPlayerId)
  const [formMode, setFormMode] = useState(initialDraftState.formMode)
  const [formData, setFormData] = useState(initialDraftState.formData)
  const [message, setMessage] = useState(initialDraftState.restored ? 'Draft restored.' : '')
  const [draftStatus, setDraftStatus] = useState(initialDraftState.restored ? 'Unsaved changes' : '')
  const savedSnapshotRef = useRef(initialDraftState.savedSnapshot)
  const currentSnapshot = getPlayerSnapshot(formData)
  const hasUnsavedChanges =
    currentSnapshot !== savedSnapshotRef.current &&
    (currentSnapshot !== emptyPlayerSnapshot || formMode === 'edit')

  const selectedPlayer = useMemo(
    () => players.find((player) => player.id === selectedPlayerId),
    [players, selectedPlayerId],
  )

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

    const cleanPlayer = {
      ...formData,
      fullName: formData.fullName.trim(),
      shirtNumber: formData.shirtNumber.trim(),
      age: formData.age.trim(),
      mainPosition: formData.mainPosition.trim(),
      secondaryPosition: formData.secondaryPosition.trim(),
      strengths: formData.strengths.trim(),
      areasToImprove: formData.areasToImprove.trim(),
      coachNotes: formData.coachNotes.trim(),
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
    setCleanPlayerForm(emptyPlayer, null, 'add', 'New player form ready.')
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

  function discardDraft() {
    const shouldDiscard = window.confirm('Discard the current unsaved player draft?')

    if (!shouldDiscard) {
      return
    }

    clearPlayerDraft()

    if (selectedPlayer) {
      setCleanPlayerForm(emptyPlayer, selectedPlayer.id, 'view', 'Draft discarded. Saved player restored.')
      return
    }

    setCleanPlayerForm(emptyPlayer, null, 'add', 'Draft discarded. New player form ready.')
  }

  function handleDeletePlayer() {
    if (!selectedPlayer) {
      return
    }

    const shouldDelete = window.confirm(`Delete ${selectedPlayer.fullName}?`)

    if (!shouldDelete) {
      return
    }

    clearPlayerDraft()
    onDeletePlayer(selectedPlayer.id)
    const nextPlayer = players.find((player) => player.id !== selectedPlayer.id)
    setCleanPlayerForm(
      emptyPlayer,
      nextPlayer?.id ?? null,
      nextPlayer ? 'view' : 'add',
      nextPlayer ? 'Player deleted.' : 'Player deleted. New player form ready.',
    )
  }

  return (
    <section className="players-page">
      <div className="players-header">
        <div>
          <p className="section-kicker">Player profiles</p>
          <h3>Manage your squad</h3>
          <p>Add, view, edit, and delete player profiles saved in this browser.</p>
        </div>
        <button className="primary-button" type="button" onClick={startAddingPlayer}>
          Add new player
        </button>
      </div>

      <div className="players-layout">
        <aside className="player-list-panel">
          <div className="panel-heading">
            <span>Squad list</span>
            <strong>{players.length}</strong>
          </div>

          {players.length === 0 ? (
            <p className="empty-message">No players added yet.</p>
          ) : (
            <div className="player-list">
              {players.map((player) => (
                <button
                  className={
                    player.id === selectedPlayerId
                      ? 'player-list-item active'
                      : 'player-list-item'
                  }
                  key={player.id}
                  onClick={() => selectPlayer(player.id)}
                  type="button"
                >
                  <span className="shirt-number">#{player.shirtNumber || '-'}</span>
                  <span>
                    <strong>{player.fullName}</strong>
                    <small>{player.mainPosition || 'No position set'}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <div className="player-main-panel">
          {(message || draftStatus) && <p className="form-message">{message || draftStatus}</p>}

          {(formMode === 'add' || formMode === 'edit') && (
            <PlayerForm
              formData={formData}
              formMode={formMode}
              onCancel={() => setFormMode(selectedPlayer ? 'view' : 'add')}
              onChange={handleChange}
              onDiscardDraft={discardDraft}
              onSubmit={handleSubmit}
            />
          )}

          {formMode === 'view' && selectedPlayer && (
            <PlayerDetails
              player={selectedPlayer}
              onDelete={handleDeletePlayer}
              onEdit={startEditingPlayer}
            />
          )}

          {formMode === 'view' && !selectedPlayer && (
            <div className="placeholder-page compact-placeholder">
              <p className="section-kicker">Select a player</p>
              <h3>No player selected</h3>
              <p>Choose a player from the list or add a new player profile.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function PlayerForm({ formData, formMode, onCancel, onChange, onDiscardDraft, onSubmit }) {
  return (
    <form className="player-form" onSubmit={onSubmit}>
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

      <div className="form-actions">
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

function PlayerDetails({ player, onDelete, onEdit }) {
  return (
    <article className="player-details">
      <div className="details-header">
        <div>
          <p className="section-kicker">Player profile</p>
          <h3>{player.fullName}</h3>
        </div>
        <span className="shirt-badge">#{player.shirtNumber || '-'}</span>
      </div>

      <div className="details-grid">
        <DetailItem label="Age" value={player.age || 'Not set'} />
        <DetailItem label="Main position" value={player.mainPosition || 'Not set'} />
        <DetailItem label="Secondary position" value={player.secondaryPosition || 'Not set'} />
        <DetailItem label="Preferred foot" value={player.preferredFoot || 'Not set'} />
      </div>

      <div className="rating-summary">
        <RatingItem label="Technical" value={player.technicalRating} />
        <RatingItem label="Physical" value={player.physicalRating} />
        <RatingItem label="Tactical" value={player.tacticalRating} />
        <RatingItem label="Mental" value={player.mentalRating} />
      </div>

      <div className="notes-display">
        <DetailBlock label="Strengths" value={player.strengths} />
        <DetailBlock label="Areas to improve" value={player.areasToImprove} />
        <DetailBlock label="Coach notes" value={player.coachNotes} />
      </div>

      <div className="form-actions">
        <button className="primary-button" type="button" onClick={onEdit}>
          Edit player
        </button>
        <button className="danger-button" type="button" onClick={onDelete}>
          Delete player
        </button>
      </div>
    </article>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function RatingItem({ label, value }) {
  return (
    <div className="rating-item">
      <span>{label}</span>
      <strong>{value || '0'}/10</strong>
    </div>
  )
}

function DetailBlock({ label, value }) {
  return (
    <div className="detail-block">
      <span>{label}</span>
      <p>{value || 'No notes added.'}</p>
    </div>
  )
}

export default Players
