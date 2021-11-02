import { takeLatest, put } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { clearToken, delStorage, getStorage } from '_utils/storage'
import AuthAPI from '_api/_auth'
import { notify, ensureObject, getApiErrorMessage } from '_utils/helpers'
import generate from '_route/generate'
import {
  LOGIN,
  LOG_OUT,
  REGISTER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  LOGIN_SUCCESS,
  LOG_OUT_SUCCESS,
  COMMON_HIDE_LOADING,
  COMMON_SHOW_LOADING,
  GET_INFO_USER,
  GET_INFO_USER_SUCCESS
} from '_constants/'

/**
 * Get user credentials with jwt-token
 * @return {Void}
 */
function * getProfile () {
  try {
    yield put({ type: COMMON_SHOW_LOADING })
    const { data } = yield AuthAPI.getProfile()
    yield put({ type: GET_INFO_USER_SUCCESS, payload: data })
  } catch (error) {
    yield put({ type: LOG_OUT_SUCCESS })
    // notify({
    //   type: 'error',
    //   message: getApiErrorMessage(error)
    // })
  } finally {
    yield put({ type: COMMON_HIDE_LOADING })
  }
}

/**
 * Call login with user credentials
 * @param {Object} action
 * @return {Redirect} Go home
 */
function * login (action) {
  try {
    yield put({ type: COMMON_SHOW_LOADING })
    const { data } = yield AuthAPI.login(action.payload)
    if (data.jwtToken) {
      const { user } = ensureObject(data)
      yield put({ type: LOGIN_SUCCESS, payload: user })

      const toURL = getStorage('auth-redirect')
      yield put(push(toURL || generate('home')))
      delStorage('auth-redirect')
    }

    notify({ message: 'Login successfully!' })
  } catch (error) {
    notify({
      type: 'error',
      message: getApiErrorMessage(error)
    })
  } finally {
    yield put({ type: COMMON_HIDE_LOADING })
  }
}

/**
 * Logout, redirect to home, clear credentials
 * @return {Redirect} Go home
 */
function * logout () {
  try {
    yield put({ type: COMMON_SHOW_LOADING })
    yield AuthAPI.logout()
  } catch (error) {
    notify({
      type: 'error',
      message: getApiErrorMessage(error)
    })
  } finally {
    yield put({ type: LOG_OUT_SUCCESS })
    yield clearToken()
    yield put(push(generate('home')))
    yield put({ type: COMMON_HIDE_LOADING })
  }
}

/**
 * Register and save credentials
 * @param {Object} action
 * @return {Redirect} Go /login
 */
function * register (action) {
  try {
    yield put({ type: COMMON_SHOW_LOADING })
    const { data } = yield AuthAPI.register(action.payload)
    yield put(push(generate('login')))
    notify({ message: data.message })
  } catch (error) {
    notify({
      type: 'error',
      message: getApiErrorMessage(error)
    })
  } finally {
    yield put({ type: COMMON_HIDE_LOADING })
  }
}

/**
 * Call API forgot password with email
 * @param {Object} action
 * @return {Redirect} Go /reset-password
 */
function * forgotPassword (action) {
  try {
    yield put({ type: COMMON_SHOW_LOADING })
    const { data } = yield AuthAPI.forgotPassword(action.payload)
    notify({ message: data.message })
    yield put(push(generate('resetPassword')))
  } catch (error) {
    notify({
      type: 'error',
      message: getApiErrorMessage(error)
    })
  } finally {
    yield put({ type: COMMON_HIDE_LOADING })
  }
}

/**
 * Call API reset password
 * @param {Object} action
 * @return {Redirect} Go /login
 */
function * resetPassword (action) {
  try {
    yield put({ type: COMMON_SHOW_LOADING })
    const { data } = yield AuthAPI.resetPassword(action.payload)
    notify({ message: data.message })
    yield put(push(generate('login')))
  } catch (error) {
    notify({
      type: 'error',
      message: getApiErrorMessage(error)
    })
  } finally {
    yield put({ type: COMMON_HIDE_LOADING })
  }
}

export default function * authentication () {
  yield takeLatest(REGISTER, register)
  yield takeLatest(FORGOT_PASSWORD, forgotPassword)
  yield takeLatest(RESET_PASSWORD, resetPassword)

  yield takeLatest(LOGIN, login)
  yield takeLatest(LOG_OUT, logout)
  yield takeLatest(GET_INFO_USER, getProfile)
}
