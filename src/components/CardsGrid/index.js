import React from 'react'
import { useStyles } from './styles'
import { Box } from '@material-ui/core'

const CardsGrid = React.memo(({ title, children, className }) => {
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      <span className={classes.title}>{title}</span>
      <Box className={className || classes.main}>
        {children}
      </Box>
    </Box>
  )
})
export default CardsGrid
