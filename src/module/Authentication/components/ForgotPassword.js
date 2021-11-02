import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import { Box, Typography, InputAdornment } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import Input from '_components/Input'
import Button from '_components/Button'
import { FORGOT_PASSWORD } from '_constants'
import { getApiErrorMessage, notify } from '_utils/helpers'
import { forgotPasswordValid } from '../validate'
import { useStyle } from '../style'
import AuthFrom from './AuthForm'

const ForgotPassword = () => {
  const classes = useStyle()
  const dispatch = useDispatch()
  const [ loading, setLoading ] = useState(false)

  const dataDefault = {
    email: ''
  }

  const handleSendEmail = async payload => {
    setLoading(true)

    try {
      await dispatch({ type: FORGOT_PASSWORD, payload })
    } catch (error) {
      notify({
        type: 'error',
        message: getApiErrorMessage(error)
      })
    }

    setLoading(false)
  }

  return (
    <AuthFrom>
      <Formik
        enableReinitialize
        initialValues={dataDefault}
        onSubmit={() => {}}
        validateOnMount={false}
        validationSchema={forgotPasswordValid}
        render={({
          values,
          handleChange,
          isValid,
          touched,
          errors,
          handleBlur
        }) => {
          return (
            <Form onSubmit={e => e.preventDefault()}>
              <Typography variant="h6" noWrap className={classes.title} align="center">
                Forgot Password
              </Typography>
              <Box mb={3} mt={3}>
                <Box className={classes.textField}>Email</Box>
                <Input
                  fullWidth
                  name="email"
                  placeHolder="Email"
                  value={values.email}
                  onBlur={handleBlur}
                  errors={errors.email}
                  touched={touched.email}
                  onChange={handleChange}
                  onKeyPress={e => e.which === 13 ? handleSendEmail(values) : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailIcon className={classes.emailIcon}/>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                content="Send email"
                loading={loading}
                disabled={!isValid}
                handleClick={() => handleSendEmail(values)}
              />
            </Form>)
        }}
      />
    </AuthFrom>
  )
}

export default ForgotPassword
