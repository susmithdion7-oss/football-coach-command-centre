export const teamIdentityStorageKey = 'teamIdentity'

export const defaultTeamIdentity = {
  teamName: 'Your Team',
  clubName: 'Coach Command Centre',
  seasonName: '2024/25 Season',
  ageGroup: '',
  teamType: 'Grassroots team',
  homeKitColor: '#f97316',
  awayKitColor: '#151515',
  primaryColor: '#f97316',
  secondaryColor: '#151515',
  playingStyle: 'Player development first',
  teamGoal: '',
  coachName: 'Coach',
  coachRole: 'Head Coach',
  coachGoal: '',
  teamMotto: '',
  squadSizeTarget: '',
  homeVenue: '',
  trainingDays: '',
  matchDay: '',
  setupCompleted: false,
  createdAt: '',
  updatedAt: '',
}

const textFields = [
  'teamName',
  'clubName',
  'seasonName',
  'ageGroup',
  'teamType',
  'playingStyle',
  'teamGoal',
  'coachName',
  'coachRole',
  'coachGoal',
  'teamMotto',
  'squadSizeTarget',
  'homeVenue',
  'trainingDays',
  'matchDay',
  'createdAt',
  'updatedAt',
]

function isValidHexColor(value) {
  return /^#[0-9A-F]{6}$/i.test(value || '')
}

function normaliseColor(value, fallback) {
  return isValidHexColor(value) ? value : fallback
}

function normaliseText(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function hexToRgb(hex) {
  const safeHex = normaliseColor(hex, '#f97316').replace('#', '')
  const value = Number.parseInt(safeHex, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((channel) => Math.max(0, Math.min(255, channel)).toString(16).padStart(2, '0'))
    .join('')}`
}

function shadeColor(hex, amount) {
  const rgb = hexToRgb(hex)

  return rgbToHex({
    r: rgb.r + amount,
    g: rgb.g + amount,
    b: rgb.b + amount,
  })
}

function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function getSoftColor(hex) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, 0.12)`
}

export function normaliseTeamIdentity(identity = {}) {
  const mergedIdentity = {
    ...defaultTeamIdentity,
    ...(identity || {}),
  }

  const normalisedIdentity = {
    ...mergedIdentity,
    primaryColor: normaliseColor(mergedIdentity.primaryColor, defaultTeamIdentity.primaryColor),
    secondaryColor: normaliseColor(mergedIdentity.secondaryColor, defaultTeamIdentity.secondaryColor),
    homeKitColor: normaliseColor(mergedIdentity.homeKitColor, defaultTeamIdentity.homeKitColor),
    awayKitColor: normaliseColor(mergedIdentity.awayKitColor, defaultTeamIdentity.awayKitColor),
    setupCompleted: Boolean(mergedIdentity.setupCompleted),
  }

  textFields.forEach((fieldName) => {
    normalisedIdentity[fieldName] = normaliseText(
      mergedIdentity[fieldName],
      defaultTeamIdentity[fieldName],
    )
  })

  normalisedIdentity.teamName = normalisedIdentity.teamName || defaultTeamIdentity.teamName
  normalisedIdentity.clubName = normalisedIdentity.clubName || defaultTeamIdentity.clubName
  normalisedIdentity.seasonName = normalisedIdentity.seasonName || defaultTeamIdentity.seasonName
  normalisedIdentity.coachName = normalisedIdentity.coachName || defaultTeamIdentity.coachName

  return normalisedIdentity
}

export function prepareTeamIdentityForSave(identity, existingIdentity = {}) {
  const now = new Date().toISOString()
  const normalisedIdentity = normaliseTeamIdentity(identity)

  return {
    ...normalisedIdentity,
    teamName: normalisedIdentity.teamName.trim(),
    clubName: normalisedIdentity.clubName.trim(),
    seasonName: normalisedIdentity.seasonName.trim(),
    ageGroup: normalisedIdentity.ageGroup.trim(),
    teamType: normalisedIdentity.teamType.trim(),
    playingStyle: normalisedIdentity.playingStyle.trim(),
    teamGoal: normalisedIdentity.teamGoal.trim(),
    coachName: normalisedIdentity.coachName.trim(),
    coachRole: normalisedIdentity.coachRole.trim(),
    coachGoal: normalisedIdentity.coachGoal.trim(),
    teamMotto: normalisedIdentity.teamMotto.trim(),
    squadSizeTarget: normalisedIdentity.squadSizeTarget.trim(),
    homeVenue: normalisedIdentity.homeVenue.trim(),
    trainingDays: normalisedIdentity.trainingDays.trim(),
    matchDay: normalisedIdentity.matchDay.trim(),
    setupCompleted: true,
    createdAt: existingIdentity.createdAt || normalisedIdentity.createdAt || now,
    updatedAt: now,
  }
}

export function getTeamInitials(identity) {
  const safeIdentity = normaliseTeamIdentity(identity)
  const sourceName = safeIdentity.teamName || safeIdentity.clubName || defaultTeamIdentity.teamName
  const words = sourceName
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(' ')
    .filter(Boolean)

  if (words.length === 0) {
    return 'CT'
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

export function getThemeStyle(identity) {
  const safeIdentity = normaliseTeamIdentity(identity)
  const primary = safeIdentity.primaryColor
  const secondary = safeIdentity.secondaryColor
  const primaryLuminance = getRelativeLuminance(primary)
  const secondaryLuminance = getRelativeLuminance(secondary)

  return {
    '--club-primary': primary,
    '--club-primary-dark': shadeColor(primary, primaryLuminance > 0.55 ? -88 : -34),
    '--club-primary-soft': getSoftColor(primary),
    '--club-secondary': secondary,
    '--club-accent': safeIdentity.homeKitColor,
    '--club-on-primary': primaryLuminance > 0.58 ? '#171717' : '#ffffff',
    '--club-on-secondary': secondaryLuminance > 0.58 ? '#171717' : '#ffffff',
  }
}
