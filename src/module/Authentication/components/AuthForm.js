import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Paper } from '@material-ui/core'
import { getCredentialSelector } from '_store/selectors/auth'
import generate from '_route/generate'
import { useStyle } from '../style'

const AuthFrom = props => {
  const history = useHistory()
  const classes = useStyle()
  const credentials = useSelector(getCredentialSelector)

  useEffect(() => {
    if (credentials._id) {
      history.push(generate('home'))
    }
  })

  if (credentials._id) {
    return null
  }

  return (
    <Box className={classes.authForm}>
      <Paper className={classes.paper}>
        {props.children}
      </Paper>
    </Box>
  )
}

export default AuthFrom
