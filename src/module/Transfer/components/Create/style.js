import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(() => ({
  otpInput: {
    display: 'flex',
    justifyContent: 'center',
    '& input': {
      fontSize: '18px',
      width: '44px !important',
      height: '44px',
      borderRadius: '5px',
      backgroundColor: '#f2f2f2',
      border: 'none',
      marginRight: '5px'
    },
    '& input[type=number]::-webkit-inner-spin-button, &input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input:focus': {
      outlineColor: '#E38D03'
    }
  },
  error: {
    border: '1px solid red !important'
  },
  OTPForm: {
    display: 'flex',
    flexDirection: 'row'
  }
}))
