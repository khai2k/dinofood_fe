import React from 'react'
import { Box } from '@material-ui/core'
import { useStyles } from './styles'

const Tag = React.memo(({ label }) => {
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      {label}
    </Box>
  )
})
export default Tag
