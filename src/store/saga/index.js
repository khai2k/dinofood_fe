import { all } from 'redux-saga/effects'
import Errors from './errors'
import PaymentRequest from '_module/Payment/saga'
import Authentication from '_module/Authentication/saga'

export default function * rootSaga () {
  yield all([
    Errors(),
    PaymentRequest(),
    Authentication()
  ])
}
