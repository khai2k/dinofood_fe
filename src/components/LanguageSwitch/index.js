import React from 'react'
import { Box } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { useStyle } from './style'
const LanguageSwitch = React.memo(({ lang }) => {
  const classes = useStyle()
  return (
    <Box className={classes.root}>
      <span className={classes.label}>{lang}</span>
      <ArrowDropDownIcon className={classes.icon}/>
    </Box>
  )
})
export default LanguageSwitch
