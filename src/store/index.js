import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import createReducer from './createReducer'
import rootSaga from '../store/saga'

const sagaMiddleware = createSagaMiddleware()
const middleware = history => {
  if (process.env.NODE_ENV === 'development') {
    return composeWithDevTools(
      applyMiddleware(sagaMiddleware, routerMiddleware(history))
    )
  }
  return applyMiddleware(sagaMiddleware, routerMiddleware(history))
}

function configureStore (initialState, history) {
  const store = createStore(createReducer(), initialState, middleware(history))
  store.runSaga = sagaMiddleware.run
  store.injectedReducers = {} // Reducer registry
  store.injectedSagas = {} // Saga registry
  store.runSaga(rootSaga)
  return store
}

const store = configureStore({}, createReducer.history)

store.history = createReducer.history

export default store
