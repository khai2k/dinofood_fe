import { makeStyles } from '@material-ui/core/styles'
export const useStyles = makeStyles(theme => ({
  formControl: {
    width: '100%',
    minWidth: 120,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  select: {
    width: '100%'
  }
}))
