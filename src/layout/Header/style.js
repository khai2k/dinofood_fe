import { makeStyles } from '@material-ui/core/styles'

export const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '80px',
    width: '90%',
    backgroundColor: theme.color.white,
    justifyContent: 'space-between',
    margin: 'auto',
    alignItems: 'center'
  },
  logo: {
    width: 'auto',
    height: 35
  },
  boxFlex: {
    display: 'flex',
    alignItems: 'center'
  },
  name: {
    marginLeft: theme.spacing(1),
    fontSize: 17
  },
  pointer: {
    cursor: 'pointer'
  },
  arrowDown: {
    cursor: 'pointer',
    marginLeft: theme.spacing(1.5)
  },
  menu: {
    '& .MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded': {
      top: '70px !important',
      '&>ul': {
        padding: 0,
        width: 200
      },
      '&>ul li': {
        fontSize: 17,
        color: theme.color.black
      }
    }
  },
  btnSignIn: {
    backgroundColor: '#fff',
    border: '1px solid #602BB2',
    padding: '8px 20px',
    outline: 'none',
    color: '#602BB2',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 600,
    transition: '0.3s',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#602BB2',
      transition: '0.3s',
      color: '#fff'
    }
  },
  headerMenuLabel: {
    color: '#000000',
    marginRight: 50,
    fontWeight: 600,
    cursor: 'pointer',
    '&:last-child': {
      marginRight: 0
    }
  },
  btnAction: {
    fontSize: 17,
    fontWeight: 500,
    fontStyle: 'normal',
    '&:hover': {
      color: 'rgba(238, 238, 238, 0.94)'
    }
  },
  flash: {
    margin: theme.spacing(0, 0.75)
  }
}))
