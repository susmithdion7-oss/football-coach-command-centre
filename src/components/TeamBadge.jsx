import { getTeamCrest, getTeamInitials } from '../utils/teamIdentity.js'

function TeamBadge({ className = '', identity, label = 'Team crest', size = 'medium' }) {
  const crest = getTeamCrest(identity)
  const initials = getTeamInitials(identity)
  const classes = ['team-badge', `team-badge-${size}`, className].filter(Boolean).join(' ')

  return (
    <div className={classes} aria-label={crest ? label : `${initials} team initials`}>
      {crest ? (
        <img alt={label} src={crest.dataUrl} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

export default TeamBadge
