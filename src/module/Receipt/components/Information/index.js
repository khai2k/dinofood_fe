import React from 'react'
import { ensureArray, vndCurrency } from '_utils/helpers'

import {
  Box,
  Grid,
  Button,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { isReceiptOwner } from '_module/Receipt/util'
import { isCurrentUser } from '_module/Authentication/util'

const useStyles = makeStyles((theme) => ({
  paper: {
    outline: 'none',
    padding: theme.spacing(2),
    maxWidth: '100%',
    boxShadow: theme.shadows[5],
    borderRadius: '5px',
    backgroundColor: theme.palette.background.paper
  },
  gridItem: {
    [theme.breakpoints.down('sm')]: { overflow: 'auto' }
  }
}))

export const ReceiptInformation = ({ receipt, onPaidOfMember, onPayToReceipt }) => {
  const classes = useStyles()

  if (!receipt) {
    return null
  }

  return (
    <Box className={classes.paper}>
      <Grid item xs={12} className={classes.gridItem}>
        <h2 style={{ margin: 0 }}>{receipt.title}</h2>

        <Table aria-label="Receipt summary">
          <TableBody>
            <TableRow>
              <TableCell style={{ padding: '.25rem 0' }}>Sub total</TableCell>
              <TableCell style={{ padding: '.25rem 0', textAlign: 'right' }}>{vndCurrency(receipt.subTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ padding: '.25rem 0' }}>Shipping fee</TableCell>
              <TableCell style={{ padding: '.25rem 0', textAlign: 'right' }}>{vndCurrency(receipt.shippingFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ padding: '.25rem 0' }}>Discount</TableCell>
              <TableCell style={{ padding: '.25rem 0', textAlign: 'right' }}>{vndCurrency(receipt.discount)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ padding: '.25rem 0' }}>Amount</TableCell>
              <TableCell style={{ padding: '.25rem 0', textAlign: 'right' }}>{vndCurrency(receipt.amount)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table aria-label="Receipt information">
          <TableHead>
            <TableRow>
              <TableCell style={{ padding: '.25rem .75rem .25rem 0' }}>Member</TableCell>
              <TableCell style={{ padding: '.25rem .75rem', textAlign: 'right' }}>Price</TableCell>
              <TableCell style={{ padding: '.25rem .75rem', textAlign: 'right' }}>Fee</TableCell>
              <TableCell style={{ padding: '.25rem .75rem', textAlign: 'right' }}>Discount</TableCell>
              <TableCell style={{ padding: '.25rem .75rem', textAlign: 'right' }}>Amount</TableCell>
              <TableCell style={{ padding: '.25rem .75rem', textAlign: 'right' }}>Status</TableCell>
              {receipt.confirmed && !receipt.paid && (
                <TableCell style={{ padding: '.25rem 0 .25rem .75rem', textAlign: 'right' }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {ensureArray(receipt.members).map(({ member, email, price, fee = 0, discount = 0, amount, paid }) => {
              const _email = member?.email || email
              return (
                <TableRow key={_email}>
                  <TableCell style={{ padding: '.25rem .75rem .25rem 0' }}>{_email}</TableCell>
                  <TableCell style={{ padding: '.25rem .75rem', textAlign: 'right' }}>{vndCurrency(price)}</TableCell>
                  <TableCell style={{ padding: '.25rem .75rem', textAlign: 'right' }}>{vndCurrency(fee)}</TableCell>
                  <TableCell style={{ padding: '.25rem .75rem', textAlign: 'right' }}>{vndCurrency(discount)}</TableCell>
                  <TableCell style={{ padding: '.25rem .75rem', textAlign: 'right' }}>{vndCurrency(amount)}</TableCell>
                  <TableCell style={{ padding: '.25rem .75rem', textAlign: 'right' }}>{receipt.paid || paid ? 'Paid' : 'Not paid'}</TableCell>
                  {receipt.confirmed && !receipt.paid && (
                    <TableCell style={{ padding: '.25rem 0 .25rem .75rem', textAlign: 'right' }}>
                      {
                        !paid && (
                          isReceiptOwner(receipt)
                            ? typeof onPaidOfMember === 'function' && (
                              <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() => onPaidOfMember(member?._id)}
                              >Paid
                              </Button>
                            )
                            : typeof onPayToReceipt === 'function' && isCurrentUser(member?._id) && (
                              <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() => onPayToReceipt(receipt._id)}
                              >Pay
                              </Button>
                            )
                        )
                      }
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Grid>
    </Box>
  )
}

export default ReceiptInformation
