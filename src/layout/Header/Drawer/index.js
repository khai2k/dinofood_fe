import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import {
  Typography,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  IconButton,
  ListItem,
  ListItemText,
  Hidden,
  Divider,
  ClickAwayListener
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { getCredentialSelector } from '_store/selectors/auth'
import Logo from '_static/img/icons/logo.svg'
import generate from '_route/generate'
import { goURL } from '_route/util'
import { notify } from '_utils/helpers'
import { LOG_OUT } from '_constants'
import { loggedInDropdown } from '../options'
import { useStyle } from './style'

export default function ResponsiveDrawer () {
  const history = useHistory()
  const classes = useStyle()
  const dispatch = useDispatch()
  const credentials = useSelector(getCredentialSelector)
  const [ open, setOpen ] = useState(false)

  const handleToggleDrawer = params => {
    if (!params) {
      return setOpen(false)
    }
    return setOpen(prevState => !prevState)
  }

  const handleLogOut = () => {
    handleToggleDrawer(false)
    const ok = window.confirm('Logout?')
    if (ok) {
      dispatch({ type: LOG_OUT })
    }
  }

  const downloadApp = () => {
    const _isAppleProduct = /iPhone|iPod|iPad|Macintosh/.test(navigator.userAgent)
    if (_isAppleProduct) {
      return goURL('https://tiny.app.link/RRWsc65wNcb')
    }
    notify({
      type: 'warning',
      message: 'Only available on IOS.' + navigator.userAgent
    }, {
      timeout: 50000
    })
  }

  const handleChangeRouter = (event, path) => {
    event.preventDefault()
    history.push(path)
    setOpen(false)
  }

  const renderRightMenu = () => {
    if (credentials._id) {
      return (
        <>
          <Box className={classes.infoBox}>
            <img src={credentials.avatar} className={classes.infoBoxAvatar} alt={credentials.name}/>
            <Typography variant="h6" noWrap>
              {credentials.name}
            </Typography>
          </Box>

          <Divider/>

          <List>
            {loggedInDropdown.map((item, index) => (
              <ListItem
                key={index}
                button
                className={classes.nested}
                onClick={e => handleChangeRouter(e, item.path)}
              >
                <ListItemText primary={item.label}/>
              </ListItem>
            ))}

            <ListItem
              button
              className={classes.nested}
              onClick={downloadApp}
            >
              <ListItemText primary="Download App"/>
            </ListItem>

            <ListItem
              button
              className={classes.nested}
              onClick={handleLogOut}
            >
              <ListItemText primary="Log Out"/>
            </ListItem>
          </List>
        </>
      )
    }

    return (
      <List>
        <ListItem
          button
          onClick={(e) => handleChangeRouter(e, generate('login'))}
        >
          <ListItemText primary="Login" />
        </ListItem>

        <ListItem button className={classes.nested} onClick={downloadApp}>
          <ListItemText primary="Download App" />
        </ListItem>
      </List>
    )
  }

  return (
    <Hidden mdUp lgUp xlUp>
      <ClickAwayListener onClickAway={() => handleToggleDrawer(false)}>
        <Box className={classes.root}>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open
            })}
          >
            <Toolbar style={{ height: '100%' }}>
              <Box className={classes.title}>
                <Link to="/">
                  <img src={Logo} className={classes.logo}/>
                </Link>
              </Box>
              <IconButton
                edge="end"
                aria-label="open drawer"
                onClick={handleToggleDrawer}
                className={clsx(open && classes.hide)}
              >
                <MenuIcon/>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={open}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {renderRightMenu()}
          </Drawer>
        </Box>
      </ClickAwayListener>
    </Hidden>
  )
}
