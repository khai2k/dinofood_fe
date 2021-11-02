import { makeStyles } from '@material-ui/core/styles'
export const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 auto',
    display: 'flex',
    maxWidth: '600px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleWrapper: {
    paddingLeft: '24px',
    paddingTop: '24px',
    paddingRight: '24px'
  },
  title: {
    fontSize: '20px'
  },
  subTitle: {
    fontSize: '16px'
  },
  paper: {
    width: '100%'
  },
  right: {
    width: '100%',
    padding: '24px'
  },
  rows: {
    marginBottom: '24px'
  }
}))
