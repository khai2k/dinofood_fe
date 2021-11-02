import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import Routes from '_route'
import { theme } from '_layout/Theme'
import { getToken } from '_utils/storage'
import { getIsLoadingSelector } from '_store/selectors'
import { GET_INFO_USER, LOG_OUT_SUCCESS } from '_constants'

import Loading from '_components/Loading'
import { MuiThemeProvider } from '@material-ui/core/styles'

import '_style/app.scss'

function App ({ history }) {
  const dispatch = useDispatch()
  const isLoading = useSelector(getIsLoadingSelector)

  useEffect(() => {
    if (getToken()) {
      dispatch({ type: GET_INFO_USER })
    } else {
      dispatch({ type: LOG_OUT_SUCCESS })
    }
  }, [])

  return (
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <Routes/>
        <Loading show={isLoading}/>
      </ConnectedRouter>
    </MuiThemeProvider>
  )
}

export default App
