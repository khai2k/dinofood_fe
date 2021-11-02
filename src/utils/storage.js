// const Storage = window.sessionStorage
const Storage = window.localStorage
const tokenKey = 'token'

/**
 * Get Storage item
 * @return {Void}
 */
export function getStorage (key) {
  try {
    return JSON.parse(
      Storage.getItem(key)
    )
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error(error)
  }

  return undefined
}

/**
 * Set Storage item
 * @return {Void}
 */
export function setStorage (key, value) {
  return Storage.setItem(
    key,
    JSON.stringify(value)
  )
}

/**
 * Remove Storage item
 * @return {Void}
 */
export function delStorage (key) {
  return Storage.removeItem(key)
}

/**
 * Get token
 * @return {String}
 */
export function getToken () {
  return getStorage(tokenKey)
}

/**
 * Set token
 * @param {String} token
 * @return {Void}
 */
export function setToken (token) {
  return setStorage(tokenKey, token)
}

/**
 * Remove Storage item
 * @return {Void}
 */
export function clearToken () {
  return delStorage(tokenKey)
}

export default {
  getStorage,
  setStorage,
  delStorage,
  getToken,
  setToken,
  clearToken
}
