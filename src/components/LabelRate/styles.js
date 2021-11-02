import { makeStyles } from '@material-ui/core/styles'
export const useStyles = makeStyles(theme => ({
  root: {
    display: 'none',
    position: 'absolute',
    color: theme.color.white,
    backgroundColor: theme.color.main,
    padding: '3px 10px',
    alignItems: 'center',
    borderRadius: 20,
    fontSize: 14,
    right: 10,
    top: 10
  },
  icon: {
    fontSize: 14,
    marginRight: 5
  }
}))
