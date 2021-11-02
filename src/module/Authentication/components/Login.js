import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { Box, Grid, Typography, Checkbox, FormControlLabel, InputAdornment } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import Input from '_components/Input'
import { getApiErrorMessage, notify } from '_utils/helpers'
import Button from '_components/Button'
import { LOGIN } from '_constants'
import { loginValid } from '../validate'
import { useStyle } from '../style'
import AuthFrom from './AuthForm'
import IconEye from '_static/img/icons/eye.svg'

const Login = () => {
  const classes = useStyle()
  const dispatch = useDispatch()
  const [ loading, setLoading ] = useState(false)

  const dataDefault = {
    email: '',
    password: '',
    remember: false
  }

  const handleLogin = async payload => {
    setLoading(true)

    try {
      await dispatch({ type: LOGIN, payload })
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
        validationSchema={loginValid}
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
                    Sign In
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
                    onKeyPress={e => e.which === 13 ? handleLogin(values) : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <img src={IconEye}/>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box className={classes.boxRememberAndForgotPassword}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.remember}
                          onChange={handleChange}
                          name="remember"
                          color="primary"
                        />
                      }
                      label="Remember me"
                      className={classes.rememberPassword}
                    />
                    <Link to="/forgot-password" className={classes.forgotPassword}>Forgot password?</Link>
                  </Box>
                </Grid>

                <Grid item xs className={classes.rows}>
                  <Button
                    fullWidth
                    color="primary"
                    content="Sign In"
                    variant="contained"
                    loading={loading}
                    disabled={!isValid}
                    handleClick={() => handleLogin(values)}
                  />
                </Grid>
              </Grid>
            </Form>)
        }}
      />
    </AuthFrom>
  )
}

export default Login
