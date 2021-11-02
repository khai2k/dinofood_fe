import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import '_utils/axios.config'

import registerServiceWorker from './registerServiceWorker'
import store from './store'
import App from './App'

ReactDOM.render(
  <Provider store={store}>
    <App history={store.history}/>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
