
import { makeStyles } from '@material-ui/core/styles'

export const useStyle = makeStyles(theme => ({
  root: {
    height: 40,
    color: theme.color.white,
    background: theme.color.main,
    borderRadius: 24,
    fontSize: 16,
    '&:hover': {
      background: theme.color.purple
    }
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.7
  },
  loading: {
    color: theme.color.secondary,
    marginLeft: theme.spacing(1.5)
  }
}))
