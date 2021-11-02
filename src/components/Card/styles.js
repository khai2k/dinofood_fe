import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    cursor: 'pointer',
    marginLeft: 12,
    marginRight: 12,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    position: 'relative',
    '&:hover $hoverRate, &:hover $mask': {
      display: 'flex'
    }
  },
  mask: {
    width: '100%',
    height: 290,
    display: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#383838',
    opacity: 0.3,
    borderRadius: '15px'
  },
  hoverRate: {
    display: 'none'
  },
  img: {
    width: '100%',
    height: 290,
    objectFit: 'cover',
    borderRadius: '15px',
    marginBottom: 12
  },
  title: {
    width: '100%',
    display: 'block',
    fontSize: 18,
    fontWeight: 800,
    color: theme.color.black,
    marginBottom: 4,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  address: {
    fontSize: 16,
    fontWeight: 400,
    color: theme.color.black,
    marginBottom: 12,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  coupon: {
    display: 'flex',
    flexFlow: 'row',
    '& svg': {
      marginRight: 10
    }
  },
  couponLabel: {
    fontSize: 14
  }
}))
