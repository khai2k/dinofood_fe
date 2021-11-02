import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import { Grid, Typography, Box, InputAdornment } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import Input from '_components/Input'
import { getApiErrorMessage, notify } from '_utils/helpers'
import Button from '_components/Button'
import { REGISTER } from '_constants'
import { registerValid } from '../validate'
import { useStyle } from '../style'
import AuthFrom from './AuthForm'
import IconEye from '_static/img/icons/eye.svg'

const Register = React.memo(() => {
  const classes = useStyle()
  const dispatch = useDispatch()
  const [ loading, setLoading ] = useState(false)

  const dataDefault = {
    email: '',
    password: '',
    passwordConfirm: ''
  }

  const handleRegister = async (payload) => {
    setLoading(true)

    try {
      await dispatch({ type: REGISTER, payload })
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
        validationSchema={registerValid}
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
              <Grid container >
                <Grid item xs={12} >
                  <Typography variant="h6" noWrap className={classes.title} align="center">
                    Register
                  </Typography>
                </Grid>

                <Grid item xs={12} className={classes.rows}>
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <EmailIcon className={classes.emailIcon}/>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} style={{ marginTop: 16 }}>
                  <Box className={classes.textField}>Password</Box>
                  <Input
                    fullWidth
                    type="password"
                    name="password"
                    placeHolder="Password"
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
                </Grid>

                <Grid item xs={12} style={{ marginTop: 16 }}>
                  <Box className={classes.textField}>Confirm Password</Box>
                  <Input
                    fullWidth
                    type="password"
                    name="passwordConfirm"
                    placeHolder="Confirm Password"
                    value={values.passwordConfirm}
                    onBlur={handleBlur}
                    errors={errors.passwordConfirm}
                    touched={touched.passwordConfirm}
                    onChange={handleChange}
                    onKeyPress={e => e.which === 13 ? handleRegister(values) : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <img src={IconEye}/>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} className={classes.rows}>
                  <Button
                    fullWidth
                    color="primary"
                    content="Register"
                    variant="contained"
                    loading={loading}
                    disabled={!isValid}
                    handleClick={() => handleRegister(values)}
                  />
                </Grid>
              </Grid>
            </Form>)
        }}
      />
    </AuthFrom>
  )
})

export default Register
