import React, { useState } from 'react'
import { Form, Formik } from 'formik'
import AuthAPI from '_api/_auth'
import { Box, Paper, Typography, InputAdornment } from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import { getApiErrorMessage, notify } from '_utils/helpers'
import Button from '_components/Button'
import Input from '_components/Input'
import IconEye from '_static/img/icons/eye.svg'
import { changePasswordValid } from '../validate'
import { useStyle } from '../style'

const ChangePassword = props => {
  const classes = useStyle()
  const [ loading, setLoading ] = useState(false)

  const dataDefault = {
    currentPassword: '',
    password: '',
    passwordConfirm: ''
  }

  /**
   * Handle submit event
   */
  const handleChangePassword = async (payload, reset) => {
    setLoading(true)

    try {
      const { data } = await AuthAPI.updatePassword(payload)
      notify({ message: data.message })
      reset(dataDefault)
    } catch (error) {
      notify({
        type: 'error',
        message: getApiErrorMessage(error)
      })
    }

    setLoading(false)
  }

  return (
    <Box className={classes.authForm}>
      <Paper className={classes.paper}>
        <Formik
          enableReinitialize
          initialValues={dataDefault}
          onSubmit={() => {}}
          validateOnMount={false}
          validationSchema={changePasswordValid}
          render={({
            values,
            handleChange,
            isValid,
            touched,
            errors,
            handleBlur,
            resetForm
          }) => {
            return (
              <Form onSubmit={(e) => e.preventDefault()}>
                <Typography
                  variant="h6"
                  noWrap
                  className={classes.title}
                  align="center"
                >
                  Change Password
                </Typography>
                <Box mt={3} mb={2}>
                  <Box className={classes.textField}>Current password</Box>

                  <Input
                    fullWidth
                    type="password"
                    name="currentPassword"
                    placeHolder="Current password"
                    value={values.currentPassword}
                    onBlur={handleBlur}
                    errors={errors.currentPassword}
                    touched={touched.currentPassword}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <LockIcon className={classes.emailIcon} />
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
                    onKeyPress={(e) =>
                      e.which === 13 ? handleChangePassword(values, resetForm) : ''}
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
                  content="Change password"
                  loading={loading}
                  disabled={!isValid}
                  handleClick={() => handleChangePassword(values, resetForm)}
                />
              </Form>
            )
          }}
        />
      </Paper>
    </Box>
  )
}

export default ChangePassword
