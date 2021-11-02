import React from 'react'
import { Box } from '@material-ui/core'
import HeaderDesktop from './HeaderDesktop'
import Drawer from './Drawer'

const Header = props => {
  return (
    <Box className="fixed-header" style={{ zIndex: 999 }}>
      {/* response desktop size */}
      <HeaderDesktop/>

      {/* response mobile size */}
      <Drawer/>
    </Box>
  )
}

export default Header
