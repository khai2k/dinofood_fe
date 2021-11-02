import { makeStyles } from '@material-ui/core/styles'
export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    color: theme.color.main,
    padding: '5px 15px',
    border: '2px solid ' + theme.color.main,
    cursor: 'pointer',
    marginRight: 10,
    fontWeight: 600,
    marginBottom: 10,
    borderRadius: '30px',
    '&:hover': {
      color: theme.color.white,
      backgroundColor: theme.color.main
    }
  }
}))
