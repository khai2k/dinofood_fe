import { takeLatest, put } from 'redux-saga/effects'
import { push } from 'connected-react-router'

import PaymentAPI from '_api/_payment'
import generate from '_route/generate'
import { getApiErrorMessage, notify } from '_utils/helpers'
import { MAKE_PAYMENT_REQUEST, COMMON_HIDE_LOADING, COMMON_SHOW_LOADING } from '_constants'

function * createPaymentRequest (action) {
  try {
    yield put({ type: COMMON_SHOW_LOADING })
    const { data } = yield PaymentAPI.create(action.payload)
    notify({ message: data.message })
    yield put(push(generate('paymentRequest.list')))
  } catch (error) {
    notify({
      type: 'error',
      message: getApiErrorMessage(error)
    })
  } finally {
    yield put({ type: COMMON_HIDE_LOADING })
  }
}

export default function * paymentRequest () {
  yield takeLatest(MAKE_PAYMENT_REQUEST, createPaymentRequest)
}
