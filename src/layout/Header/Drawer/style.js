
import { makeStyles } from '@material-ui/core/styles'

const drawerWidth = 240

export const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '80px',
    width: '90%',
    // backgroundColor: theme.color.main,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    margin: 'auto'
  },
  appBar: {
    display: 'flex',
    height: '80px',
    // backgroundColor: theme.color.main,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    transition: theme.transitions.create([ 'margin', 'width' ], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create([ 'margin', 'width' ], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  },
  logo: {
    width: 'auto',
    height: 40
  },
  infoBox: {
    display: 'flex',
    alignItems: 'center',
    height: '70px',
    paddingLeft: '16px',
    paddingRight: '24px'
  },
  infoBoxAvatar: {
    width: '40px',
    height: '40px',
    border: '1px solid #ddd',
    borderRadius: '50%',
    marginRight: '10px'
  }
}))
