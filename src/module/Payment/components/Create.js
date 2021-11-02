import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import convert from '_utils/convert'
import { vndCurrency, notify, getApiErrorMessage, getNumberFromStr } from '_utils/helpers'
import { MAKE_PAYMENT_REQUEST } from '_constants'
import Meta from '_constants/meta'

import useQueryParam from '_hooks/useQueryParam'
import { getCredentialSelector } from '_store/selectors/auth'

import { Box, Grid, Paper, Typography, FormHelperText } from '@material-ui/core'
import Button from '_components/Button'
import Input from '_components/Input'
import PaymentInfo from '_components/PaymentInfo'
import SelectComponent from '_components/SelectComponent'

import options from '../options'
import validate from '../validate'
import { useStyles } from '../style'

const PaymentRequestCreate = props => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const queryParams = useQueryParam()

  const [ formData, setFormData ] = useState({
    amount: 0,
    email: '',
    type: options.requestTypes[0].value,
    paymentMethod: options.paymentMethods[0].value,
    description: ''
  })

  const credentials = useSelector(getCredentialSelector)

  // default use email from credentials
  useEffect(() => {
    if (credentials.email) {
      setFormData(prevState => ({
        ...prevState,
        email: queryParams.email || credentials.email || prevState.email
      }))
    }
  }, [ credentials.email ])

  useEffect(() => {
    setFormData(prevState => ({
      amount: Number(queryParams.amount) ? Number(queryParams.amount) : prevState.amount,
      email: queryParams.email || prevState.email,
      type: options.requestTypes.some(e => e.value === queryParams.type) ? queryParams.type : options.requestTypes[0].value,
      paymentMethod: options.paymentMethods[0].value,
      description: queryParams.description || prevState.description
    }))

    // reset state
    return () => setFormData({
      amount: 0,
      email: '',
      type: options.requestTypes[0].value,
      paymentMethod: options.paymentMethods[0].value,
      description: ''
    })
  }, [ queryParams ])

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
   * Validate and dispatch API
   */
  const handleSubmit = async () => {
    try {
      await validate.create.validate(formData)
      dispatch({ type: MAKE_PAYMENT_REQUEST, payload: formData })
    } catch (error) {
      notify({
        type: 'error',
        message: getApiErrorMessage(error)
      })
    }
  }

  return (
    <Box>
      <Grid container className={classes.root}>
        <Paper className={classes.paper}>
          <Grid item md={12} className={classes.titleWrapper}>
            <Typography variant="h6" noWrap className={classes.title} align="center">
              Gửi yêu cầu rút/nạp tiền từ {Meta.title}.
            </Typography>
            <PaymentInfo/>
          </Grid>

          <Grid item md={12} className={classes.right}>
            <Grid item md={12} className={classes.rows}>
              <Input
                value={formData.email}
                fullWidth
                placeHolder="Email"
                name="email"
                label="Email"
                onChange={handleChange}
              />
            </Grid>

            <Grid container spacing={2} className={classes.rows}>
              <Grid item xs={12} md={6}>
                <SelectComponent
                  listMenu={options.requestTypes}
                  label="Type Transaction"
                  handleChange={handleChange}
                  name="type"
                  value={formData.type}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <SelectComponent
                  listMenu={options.paymentMethods}
                  label="Payment Method"
                  handleChange={handleChange}
                  name="paymentMethod"
                  value={formData.paymentMethod}
                />
              </Grid>
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
                handleClick={handleSubmit}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Box>
  )
}

export default PaymentRequestCreate
