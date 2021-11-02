import { makeStyles } from '@material-ui/core/styles'
export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    marginBottom: 48
  },
  title: {
    color: theme.color.black,
    fontWeight: 600
  },
  main: {
    display: 'flex'
  }
}))
