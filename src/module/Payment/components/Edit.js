import React, { useState, useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router'

import Meta from '_constants/meta'
import convert from '_utils/convert'
import PaymentAPI from '_api/_payment'
import { vndCurrency, notify, getApiErrorMessage, getNumberFromStr, compareObject } from '_utils/helpers'

import { Box, Grid, Paper, Typography, FormHelperText } from '@material-ui/core'
import Button from '_components/Button'
import Input from '_components/Input'
import PaymentInfo from '_components/PaymentInfo'
import SelectComponent from '_components/SelectComponent'

import options from '../options'
import validate from '../validate'
import { useStyles } from '../style'

const PaymentRequestEdit = props => {
  const classes = useStyles()
  const { _id } = useParams()

  const [ cachePayload, setCachePayload ] = useState({})
  const [ formData, setFormData ] = useState({
    amount: '',
    email: '',
    type: options.requestTypes[0].value,
    paymentMethod: options.paymentMethods[0].value,
    description: ''
  })

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
        ? Number(getNumberFromStr(val)) || ''
        : val
    }))
  }

  /**
   * Validate and dispatch API
   */
  const handleSubmit = async () => {
    try {
      const { email, ...payload } = formData

      if (compareObject(payload, cachePayload)) {
        throw new Error('Already the newest version.')
      }

      await validate.edit.validate(payload)
      const { data } = await PaymentAPI.update({
        ...payload,
        _id
      })

      setCachePayload(cloneDeep(payload))
      notify({ message: data.message })
    } catch (error) {
      notify({
        type: 'error',
        message: getApiErrorMessage(error)
      })
    }
  }

  // default use email from credentials
  useEffect(() => {
    PaymentAPI
      .detail({ _id })
      .then(({ data }) => {
        setCachePayload({
          type: data.type,
          amount: data.amount,
          description: data.description,
          paymentMethod: data.paymentMethod
        })

        setFormData(prevState => ({
          ...prevState,
          amount: data.amount || undefined,
          type: data.type || undefined,
          paymentMethod: data.paymentMethod || undefined,
          description: data.description || undefined,
          email: data.user && data.user.email
        }))
      })
      .catch(error => notify({
        type: 'error',
        message: getApiErrorMessage(error)
      }))

    // reset state
    return () => setFormData({
      amount: 0,
      email: '',
      type: options.requestTypes[0].value,
      paymentMethod: options.paymentMethods[0].value,
      description: ''
    })
  }, [ _id ])

  return (
    <Box>
      <Grid container className={classes.root}>
        <Paper className={classes.paper}>
          <Grid item md={12} className={classes.titleWrapper}>
            <Typography variant="h6" noWrap className={classes.title} align="center">
              Cập nhật yêu cầu rút/nạp tiền từ {Meta.title}.
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
                InputProps={{
                  readOnly: true
                }}
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

export default PaymentRequestEdit
