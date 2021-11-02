
import { makeStyles } from '@material-ui/core/styles'

export const useStyle = makeStyles(theme => ({
  root: {
    '& div': {
      fontSize: 16
    },
    '& input': {
      height: 40,
      padding: 0,
      backgroundColor: 'transparent !important'
    },
    '& >div:before': {
      borderBottom: `1px solid ${theme.color.black}`
    },
    '& >div:after': {
      borderBottom: `2px solid ${theme.color.main}`
    }
  }
}))
