import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Formik } from 'formik'
import { Box, Typography, InputAdornment } from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import Input from '_components/Input'
import Button from '_components/Button'
import { RESET_PASSWORD } from '_constants'
import { getApiErrorMessage, notify } from '_utils/helpers'
import { resetPasswordValid } from '../validate'
import { useStyle } from '../style'
import AuthFrom from './AuthForm'
import IconEye from '_static/img/icons/eye.svg'

const ResetPassword = props => {
  const classes = useStyle()
  const dispatch = useDispatch()
  const [ loading, setLoading ] = useState(false)

  const dataDefault = {
    token: '',
    password: '',
    passwordConfirm: ''
  }

  /**
   * Handle submit event
   */
  const handleResetPassword = async payload => {
    setLoading(true)

    try {
      await dispatch({ type: RESET_PASSWORD, payload })
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
        validationSchema={resetPasswordValid}
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
                Reset Password
              </Typography>
              <Box mt={3} mb={2}>
                <Box className={classes.textField}>Token</Box>

                <Input
                  fullWidth
                  name="token"
                  placeHolder="Token"
                  value={values.token}
                  onBlur={handleBlur}
                  errors={errors.token}
                  touched={touched.token}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <LockIcon className={classes.emailIcon}/>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box>
                <Box className={classes.textField}>New password</Box>
                <Input
                  fullWidth
                  type="password"
                  name="password"
                  placeHolder="New password"
                  value={values.password}
                  onBlur={handleBlur}
                  errors={errors.password}
                  touched={touched.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img src={IconEye}/>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box mt={2} mb={3}>
                <Box className={classes.textField}>Confirm new password</Box>
                <Input
                  fullWidth
                  type="password"
                  name="passwordConfirm"
                  placeHolder="Confirm new password"
                  value={values.passwordConfirm}
                  onBlur={handleBlur}
                  errors={errors.passwordConfirm}
                  touched={touched.passwordConfirm}
                  onChange={handleChange}
                  onKeyPress={e => e.which === 13 ? handleResetPassword(values) : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img src={IconEye}/>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                content="Reset password"
                loading={loading}
                disabled={!isValid}
                handleClick={() => handleResetPassword(values)}
              />
            </Form>)
        }}
      />
    </AuthFrom>
  )
}

export default ResetPassword
