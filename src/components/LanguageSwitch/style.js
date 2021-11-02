import { makeStyles } from '@material-ui/core/styles'
export const useStyle = makeStyles(them => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  label: {
    color: '#000000',
    fontSize: 14
  },
  icon: {
    color: '#000000'
  }
}))
