import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Box, MenuItem, Menu, Hidden } from '@material-ui/core'
import { getCredentialSelector } from '_store/selectors/auth'
import Logo from '_static/img/icons/logo.svg'
import { /* headerMenuList, */ loggedInDropdown } from '../options'
import { useStyle } from '../style'
import { LOG_OUT } from '_constants'

import Avatar from '@material-ui/core/Avatar'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { theme } from '_layout/Theme'

const HeaderDesktop = props => {
  const classes = useStyle()
  const history = useHistory()
  const dispatch = useDispatch()

  const credentials = useSelector(getCredentialSelector)
  const anchorEl = React.useRef()
  const [ isOpen, setIsOpen ] = React.useState(false)

  const clickItem = (path) => {
    setIsOpen(false)
    history.push(path)
  }

  const handleLogOut = () => {
    setIsOpen(false)
    const ok = window.confirm('Logout?')
    if (ok) {
      dispatch({ type: LOG_OUT })
    }
  }

  return (
    <Hidden smDown>
      <Box className={classes.root}>
        <Box className={classes.boxFlex}>
          <Link to="/">
            <img src={Logo} className={classes.logo}/>
          </Link>
        </Box>

        {/* <Box className={classes.boxFlex}>
          {headerMenuList.map(item => (
            <span className={classes.headerMenuLabel} key={item.id}>{item.label}</span>
          ))}
        </Box> */}

        {!credentials._id && (
          <Box className={classes.boxFlex}>
            <Link to="/login" className={classes.btnSignIn}>Login</Link>
          </Box>
        )}

        {credentials._id && (
          <Box>
            <Box onClick={() => setIsOpen(true)} className={`${classes.boxFlex} ${classes.pointer}`}>
              <Avatar alt={credentials.avatar} src={credentials.avatar || ''} />
              <Box className={classes.name}>{credentials.name}</Box>
              <ArrowDropDownIcon ref={anchorEl} className={classes.arrowDown}/>
            </Box>

            <Menu
              keepMounted
              open={isOpen}
              anchorEl={anchorEl.current}
              className={classes.menu}
              onClose={() => setIsOpen(false)}
            >
              {loggedInDropdown.map(
                (item, index) => (
                  <MenuItem onClick={() => clickItem(item.path)} key={index}>
                    <Box mr={1} display="flex" color={theme.color.main}>{item.icon}</Box>
                    {item.label}
                  </MenuItem>
                )
              )}

              <MenuItem onClick={handleLogOut}>
                <Box mr={1} display="flex" color={theme.color.main}>
                  <ExitToAppIcon/>
                </Box>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>
    </Hidden>
  )
}

export default HeaderDesktop
