import React from 'react'
import { useStyles } from './styles'
import { Box } from '@material-ui/core'
import StarIcon from '@material-ui/icons/Star'

const LabelRate = React.memo(({ label, className }) => {
  const classes = useStyles()
  return (
    <Box className={`${classes.root} ${className || ''}`}><StarIcon className={classes.icon}/> {label}</Box>
  )
})
export default LabelRate
