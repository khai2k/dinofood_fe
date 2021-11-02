import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import generate from '_route/generate'
import ReceiptAPI from '_api/_receipt'
import BalanceAPI from '_api/_balance'
import useQueryParam from '_hooks/useQueryParam'
// import { getCredentialSelector } from '_store/selectors/auth'
import { notify, getApiErrorMessage, ensureArray, vndCurrency } from '_utils/helpers'
import { setLoading } from '_store/actions'

import Pagination from '_components/Pagination'
import ReceiptInformation from '_module/Receipt/components/Information'

import { Close as CloseIcon } from '@material-ui/icons'
import {
  Box,
  Fade,
  Grid,
  Paper,
  Table,
  Modal,
  // Button,
  Backdrop,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  TableContainer
} from '@material-ui/core'

const BalanceHistory = props => {
  const history = useHistory()
  const dispatch = useDispatch()
  const urlParams = useQueryParam()

  const queryParams = {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().endOf('month').format('YYYY-MM-DD'),
    ...urlParams
  }

  const [ receipt, setReceipt ] = useState(false)
  const [ pagination, setPagination ] = useState({
    balance: 0,
    page: 1
  })

  /**
   * Push URL parameters history
   */
  const pushURL = (params = {}) => {
    const query = {
      page: params.page || urlParams.page || 1,
      fromDate: params.fromDate || urlParams.fromDate || moment().startOf('month').format('YYYY-MM-DD'),
      toDate: params.toDate || urlParams.toDate || moment().endOf('month').format('YYYY-MM-DD')
    }
    const route = generate(history.location.pathname, query)
    history.push(route)
  }

  /**
   * Show receipt information
   */
  const showReceipt = (e, receipt) => {
    e.preventDefault()
    const _id = (receipt && receipt._id) || receipt
    if (_id) {
      dispatch(setLoading(true))
      ReceiptAPI
        .detail({ _id })
        .then(({ data }) => setReceipt(data))
        .catch(error => notify({
          type: 'error',
          message: getApiErrorMessage(error)
        }))
        .finally(() => {
          dispatch(setLoading(false))
        })
    }
  }

  /**
   * Hooks
   */
  useEffect(() => {
    if (urlParams.page) {
      dispatch(setLoading(true))
      BalanceAPI
        .check({
          ...urlParams,
          fromDate: moment(urlParams.fromDate || queryParams.fromDate).startOf('day').toISOString(),
          toDate: moment(urlParams.toDate || queryParams.toDate).endOf('day').toISOString()
        })
        .then(({ data }) => setPagination(data))
        .catch(error => notify({
          type: 'error',
          message: getApiErrorMessage(error)
        }))
        .finally(() => {
          dispatch(setLoading(false))
        })
    } else {
      pushURL()
    }

    // reset state
    return () => setPagination({ page: 1 })
  }, [ urlParams ])

  return (
    <>
      <h1>Current balance: {vndCurrency(pagination.balance)}</h1>

      <Grid container spacing={0}>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            // inputProps={{ readOnly: true }}
            variant="outlined"
            margin="normal"
            label="From date"
            type="date"
            value={queryParams.fromDate}
            InputLabelProps={{ shrink: true }}
            onChange={e => pushURL({ fromDate: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <TextField
            // inputProps={{ readOnly: true }}
            variant="outlined"
            margin="normal"
            label="To date"
            type="date"
            value={queryParams.toDate}
            InputLabelProps={{ shrink: true }}
            onChange={e => pushURL({ toDate: e.target.value })}
          />
        </Grid>
      </Grid>

      <h3>
        Total income: +{vndCurrency(pagination.summary && pagination.summary.income)}
        <br/>
        Total outcome: -{vndCurrency(pagination.summary && pagination.summary.outcome)}
      </h3>

      <TableContainer component={Paper} style={{ margin: '8px 0' }}>
        <Table aria-label="Balance histories">
          <TableHead>
            <TableRow>
              <TableCell>Create at</TableCell>
              <TableCell>Before change</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>After change</TableCell>
              <TableCell>Reason</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ensureArray(pagination.docs).map(row => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">{moment(row.createdAt).format('hh:mm A MMM DD, YYYY')}</TableCell>
                <TableCell>{vndCurrency(row.oldBalance)}</TableCell>
                <TableCell>
                  {row.type === 'income' ? '+' : '-'}
                  {vndCurrency(row.amount)}
                </TableCell>
                <TableCell>{vndCurrency(row.newBalance)}</TableCell>
                <TableCell>
                  {
                    row.reference && row.reference.model === 'Receipt' && row.reference.value && row.reference.value.title
                      ? <Link className="link" to="#" onClick={e => showReceipt(e, row.reference.value)}>{row.reference.value.title}</Link>
                      : (row.reason || row.description)
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination {...pagination}/>

      <Modal
        open={!!receipt}
        onClose={() => setReceipt(false)}
        className="modal-flex-center"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={!!receipt}>
          <Box
            maxWidth="100%"
            maxHeight="100%"
            position="relative"
          >
            <CloseIcon
              position="absolute"
              className="right pointer"
              onClick={() => setReceipt(false)}
            />
            <ReceiptInformation receipt={receipt}/>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

export default BalanceHistory
