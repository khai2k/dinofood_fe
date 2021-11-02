import { takeLatest, put } from 'redux-saga/effects'
import { push } from 'connected-react-router'
// import { removeLocalStore } from '../../utils/localStore'
import get from 'lodash/get'
import generate from '_route/generate'
import {
  COMMON_HANDLE_ERROR,
  COMMON_SET_SERVER_ERROR
} from '_constants'

function * errorHandle (action) {
  const { data, status } = action.payload
  if (status === 401) {
    // removeLocalStore()
    yield put(push(generate('login')))
  }

  if (data) {
    yield put({ type: COMMON_SET_SERVER_ERROR, payload: get(data, 'errors') })
  }
}

export default function * errors () {
  yield takeLatest(COMMON_HANDLE_ERROR, errorHandle)
}
