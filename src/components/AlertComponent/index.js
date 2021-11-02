import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { CLOSE_ALERT } from '_constants'

const AlertComponent = React.memo(() => {
  const getIsAlertSelector = () => {
    return createSelector(
      state => state.common.alertNotifycation.isAlert,
      isAlert => isAlert
    )
  }
  const getMessageAlertSelector = () => {
    return createSelector(
      state => state.common.alertNotifycation.message,
      message => message
    )
  }
  const isAlert = useSelector(getIsAlertSelector())
  const message = useSelector(getMessageAlertSelector())
  const dispatch = useDispatch()
  const handleClose = () => {
    dispatch({ type: CLOSE_ALERT })
  }
  return (
    <Snackbar open={isAlert} autoHideDuration={4000} onClose={handleClose} message={message} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}/>
  )
})
export default AlertComponent
