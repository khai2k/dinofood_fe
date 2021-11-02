import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Btn from '@material-ui/core/Button'
import { useStyle } from './style'

const Button = ({
  size,
  color,
  variant,
  content,
  loading,
  disabled,
  fullWidth,
  className,
  handleClick,
  ...props
}) => {
  const classes = useStyle()

  return (
    <Btn
      {...props}
      size={size}
      color={color}
      variant={variant}
      onClick={handleClick}
      disabled={disabled}
      fullWidth={fullWidth}
      className={classes.root + ' ' + (disabled ? classes.disabled : '') + ' ' + (className || '')}
    >
      {content}{loading && <CircularProgress size={14} className={classes.loading}/>}
    </Btn>
  )
}

Button.defaultProps = {
  variant: '',
  loading: false,
  disabled: false
}

export default Button
