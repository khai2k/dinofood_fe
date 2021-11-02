/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'

/** import main reducer load sync */
import root from './reducers'
import cart from './reducers/cart'
import common from './reducers/common'
import auth from '_store/reducers/auth'

const history = createBrowserHistory()

function createReducer (injectedReducers = {}) {
  return (state, action) => combineReducers({
    router: connectRouter(history),
    root,
    cart,
    common,
    auth,
    ...injectedReducers
  })(action.type === 'LOGOUT_SUCCESS' ? undefined : state, action)
}

createReducer.history = history

export default createReducer
