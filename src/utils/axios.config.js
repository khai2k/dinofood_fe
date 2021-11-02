import axios from 'axios'
import store from '_store'
import { LOG_OUT } from '_constants'
import { getToken, setToken, clearToken } from '_utils/storage'

/**
 * axios config
 */
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = process.env.REACT_APP_PROXY
}

/**
 * Before request interceptor
 */
axios.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }

  return config
})

/**
 * Before response interceptor
 */
axios.interceptors.response.use(response => {
  // handler authorization|remapped by aws igw
  const newAuthorization = response.headers && response.headers.authorization
  if (newAuthorization) {
    const token = newAuthorization.split(' ').pop()
    setToken(token)
  }

  return response
}, error => {
  // handler 401/clear session
  if (error.response && error.response.status === 401) {
    clearToken()
    store.dispatch({ type: LOG_OUT })
  }

  throw error
})
