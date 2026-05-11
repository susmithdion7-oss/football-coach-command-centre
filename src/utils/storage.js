const appPrefix = 'footballCoachCommandCentre'

export function getStorageItem(key, fallbackValue) {
  const savedValue = window.localStorage.getItem(`${appPrefix}:${key}`)

  if (!savedValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(savedValue)
  } catch {
    return fallbackValue
  }
}

export function setStorageItem(key, value) {
  window.localStorage.setItem(`${appPrefix}:${key}`, JSON.stringify(value))
}
