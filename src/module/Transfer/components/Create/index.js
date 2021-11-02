import React, { useState, useEffect } from 'react'

import Meta from '_constants/meta'
import convert from '_utils/convert'
import TransferAPI from '_api/_transfer'
import useQueryParam from '_hooks/useQueryParam'
import { vndCurrency, notify, getApiErrorMessage, getNumberFromStr } from '_utils/helpers'

import OtpInput from 'react-otp-input'
import { Box, Grid, Paper, Typography, FormHelperText, CircularProgress } from '@material-ui/core'

import Button from '_components/Button'
import Input from '_components/Input'

import validate from '../../validate'
import { useStyles as transferStyle } from '../../style'
import { useStyles as createTransferStyle } from './style'

const TransferCreate = props => {
  const classes = transferStyle()
  const transferClasses = createTransferStyle()
  const queryParams = useQueryParam()

  const [ loading, setLoading ] = useState(false)
  const [ OTPLength ] = useState(6)
  const [ OTP, setOTP ] = useState('')
  const [ OTPError, setOTPError ] = useState(true)
  const [ transferId, setTransferId ] = useState('')
  const [ formData, setFormData ] = useState({
    email: '',
    amount: 0,
    description: ''
  })

  /**
   * Reset data state
   */
  const resetState = () => {
    setTransferId('')
    setFormData({
      email: '',
      amount: 0,
      description: ''
    })
  }

  /**
   * Update state on change
   */
  const handleChange = event => {
    const el = event.target
    const val = el.value
    const name = el.name

    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'amount'
        ? getNumberFromStr(val)
        : val
    }))
  }

  /**
   * Handle OTP change
   */
  const handleOTPChange = value => {
    setOTP(value)
  }

  /**
   * Validate and dispatch API
   */
  const submitTransferRequest = async () => {
    setLoading(true)

    try {
      await validate.create.validate(formData)
      const { data } = await TransferAPI.create(formData)
      notify({ message: data.message })
      setTransferId(data._id)
    } catch (error) {
      notify({
        type: 'error',
        message: getApiErrorMessage(error)
      })
    }

    setLoading(false)
  }

  /**
   * Verify transfer OTP
   */
  const verifyTransferOTP = async () => {
    setLoading(true)

    try {
      const { data } = await TransferAPI.verify({
        _id: transferId,
        OTP
      })
      notify({ message: data.message })
    } catch (error) {
      notify({
        type: 'error',
        message: getApiErrorMessage(error)
      })
    }

    setTimeout(() => {
      resetState()
      setLoading(false)
    }, 3000)
  }

  /**
   * Hooks
   */
  useEffect(() => {
    // setTransferId('')
    setFormData(prevState => ({
      email: queryParams.email || prevState.email,
      amount: Number(queryParams.amount) ? Number(queryParams.amount) : prevState.amount,
      description: queryParams.description || prevState.description
    }))

    // reset state
    return () => resetState()
  }, [ queryParams ])

  useEffect(() => {
    setOTP('')
  }, [ transferId ])

  useEffect(() => {
    setOTPError(OTP.length !== OTPLength)
  }, [ OTP ])

  useEffect(() => {
    if (!OTPError) {
      verifyTransferOTP()
    }
  }, [ OTPError ])

  return (
    <Box>
      <Grid container className={classes.root}>
        <Paper className={classes.paper}>
          <Grid item md={12} className={classes.titleWrapper}>
            <Typography variant="h6" noWrap className={classes.title} align="center">
              {transferId ? 'Check your OTP.' : `Chuyển tiền trong ${Meta.title}.`}
            </Typography>
          </Grid>

          {/* Request form */}
          <Grid item md={12} className={[ classes.right, transferId ? 'hidden' : '' ].join(' ')}>
            <Grid item md={12} className={classes.rows}>
              <Input
                value={formData.email}
                fullWidth
                placeHolder="Email người nhận"
                name="email"
                label="Transfer to"
                onChange={handleChange}
              />
            </Grid>

            <Grid container className={classes.rows}>
              <Input
                value={vndCurrency(formData.amount, true)}
                fullWidth
                placeHolder="Amount"
                label="Amount"
                name="amount"
                onChange={handleChange}
              />
              {!!formData.amount && (
                <FormHelperText variant="filled">
                  Bằng chữ: {convert.viNumber(formData.amount)} đồng
                </FormHelperText>
              )}
            </Grid>

            <Grid container className={classes.rows}>
              <Input
                value={formData.description}
                fullWidth
                placeHolder="Description"
                name="description"
                label="Description"
                multiline
                rows={12}
                onChange={handleChange}
              />
            </Grid>

            <Grid container className={classes.rows} justify="flex-end">
              <Button
                fullWidth
                color="primary"
                content="Submit"
                variant="contained"
                loading={loading}
                disabled={loading}
                handleClick={submitTransferRequest}
              />
            </Grid>
          </Grid>

          {/* OTP form */}
          <Grid item md={12} className={[ classes.right, transferClasses.OTPForm, transferId ? '' : 'hidden' ].join(' ')}>
            <OtpInput
              value={OTP}
              onChange={handleOTPChange}
              numInputs={OTPLength}
              isDisabled={loading}
              hasErrored={OTPError}
              errorStyle={transferClasses.error}
              className={transferClasses.otpInput}
              isInputNum
              shouldAutoFocus
            />

            {loading && <CircularProgress/>}
          </Grid>
        </Paper>
      </Grid>
    </Box>
  )
}

export default TransferCreate
