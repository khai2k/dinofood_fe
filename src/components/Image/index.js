import React from 'react'
import { makeStyles } from '@material-ui/core'

const Image = props => {
  const pxAttr = value => Number(value) ? `${value}px` : value

  const classes = makeStyles(theme => ({
    image: {
      width: props.width ? pxAttr(props.width) : 'unset',
      height: props.height ? pxAttr(props.height) : 'unset',
      maxWidth: props.maxWidth ? pxAttr(props.maxWidth) : 'unset',
      maxHeight: props.maxHeight ? pxAttr(props.maxHeight) : 'unset'
    }
  }))()

  return (
    <img
      src={props.src}
      className={[ classes.image, props.className || '' ].join('').trim()}
      alt={props.alt || 'image'}
    />
  )
}

export default Image
