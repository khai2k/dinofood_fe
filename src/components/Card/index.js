import React from 'react'
import { Box } from '@material-ui/core'
import { useStyles } from './styles'
import LabelRate from '../LabelRate'

const Card = React.memo(({ src, title, address, coupon, className, rateLabel, ...props }) => {
  const classes = useStyles()
  const couponBlock = coupon => {
    if (coupon) {
      return (
        <>
          {coupon.icon}
          <span className={classes.couponLabel}>{coupon.label}</span>
        </>
      )
    }
  }
  const rootClass = className || classes.root
  return (
    <Box onClick={e => typeof props.onClick === 'function' && props.onClick(e)} className={rootClass}>
      <Box className={classes.mask} />
      <LabelRate label={rateLabel} className={classes.hoverRate}/>
      <img src={src} alt="test" className={classes.img}/>
      <span className={classes.title}>{title}</span>
      <span className={classes.address}>{address}</span>
      <Box className={classes.coupon}>{couponBlock(coupon)}</Box>
    </Box>
  )
})
export default Card
