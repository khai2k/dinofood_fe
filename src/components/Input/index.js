import React from 'react'
import { TextField } from '@material-ui/core'
import { useStyle } from './style'

const Input = ({
  rows,
  name,
  type,
  value,
  errors,
  onBlur,
  touched,
  onChange,
  className,
  fullWidth,
  multiline,
  InputProps,
  placeHolder,
  defaultValue,
  ...props
}) => {
  const classes = useStyle()

  return (
    <TextField
      {...props}
      name={name}
      rows={rows}
      type={type}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      fullWidth={fullWidth}
      multiline={multiline}
      InputProps={InputProps}
      placeholder={placeHolder}
      defaultValue={defaultValue}
      helperText={touched && errors}
      error={Boolean(touched && errors)}
      className={classes.root + ' ' + (className || '')}
    />
  )
}

export default Input
