import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input'
import { Grid, Dialog, DialogContent, DialogTitle, CircularProgress } from '@material-ui/core'
import { useStyles } from './style'

export const VerifyOTPDialog = ({ open, loading, length, onSubmit, ...props }) => {
  const classes = useStyles()

  const [ OTP, setOTP ] = useState('')
  const [ OTPError, setOTPError ] = useState(true)
  const [ OTPLength, setOTPLength ] = useState(6)

  /**
   * Handle OTP change
   */
  const handleOTPChange = value => {
    setOTP(value)
  }

  useEffect(() => {
    setOTPLength(
      Math.max(
        Number(length) || 6,
        6
      )
    )
  }, [ length ])

  useEffect(() => {
    setOTP('')
  }, [ open ])

  useEffect(() => {
    setOTPError(OTP.length !== OTPLength)
  }, [ OTP ])

  useEffect(() => {
    if (!OTPError && typeof onSubmit === 'function') {
      onSubmit(OTP)
    }
  }, [ OTPError ])

  return (
    <Dialog
      {...{ open, ...props }}
      disableBackdropClick
      disableScrollLock
      aria-labelledby="OTP-dialog"
    >
      <DialogTitle id="OTP-dialog">Check your OTP</DialogTitle>
      <DialogContent dividers>
        <Grid item md={12} className={[ classes.right, classes.OTPForm ].join(' ')}>
          <OtpInput
            value={OTP}
            onChange={handleOTPChange}
            numInputs={OTPLength}
            isDisabled={loading}
            hasErrored={OTPError}
            errorStyle={classes.error}
            className={classes.otpInput}
            isInputNum
            shouldAutoFocus
          />

          {loading && <CircularProgress/>}
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default VerifyOTPDialog
