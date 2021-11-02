
import { makeStyles } from '@material-ui/core/styles'

export const useStyle = makeStyles(theme => ({
  authForm: {
    margin: '0 auto',
    display: 'flex',
    width: '100%',
    maxWidth: '600px',
    alignItems: 'center'
  },
  paper: {
    position: 'relative',
    width: '100%',
    padding: '24px'
  },
  rows: {
    marginTop: '24px'
  },
  title: {
    fontSize: 24,
    fontWeight: 600
  },
  textField: {
    fontSize: 16
  },
  boxRememberAndForgotPassword: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16
  },
  rememberPassword: {
    '& >span': {
      fontSize: 16
    }
  },
  forgotPassword: {
    fontSize: 16
  },
  emailIcon: {
    color: theme.color.grey1,
    width: 20,
    height: 20,
    paddingRight: 3
  }
}))
