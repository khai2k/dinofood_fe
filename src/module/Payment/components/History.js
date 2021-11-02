import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'

import generate from '_route/generate'
import PaymentAPI from '_api/_payment'
import useQueryParam from '_hooks/useQueryParam'
// import { getCredentialSelector } from '_store/selectors/auth'
import { notify, getApiErrorMessage, ensureArray, pascalCase, vndCurrency } from '_utils/helpers'
import { setLoading } from '_store/actions'

import Pagination from '_components/Pagination'
import { Button } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableContainer from '@material-ui/core/TableContainer'

const PaymentRequestHistory = props => {
  const history = useHistory()
  const dispatch = useDispatch()
  const queryParam = useQueryParam()

  // const credentials = useSelector(getCredentialSelector)
  const [ pagination, setPagination ] = useState({ page: 1 })

  /**
   * Push URL parameters history
   */
  const pushURL = (params = {}) => {
    const queryString = {
      page: 1,
      ...params,
      ...queryParam
    }
    const route = generate(history.location.pathname, queryString)
    history.push(route)
  }

  const cancelRequest = _id => {
    const confirm = window.confirm('Cancel payment request?')
    if (confirm) {
      dispatch(setLoading(true))
      PaymentAPI
        .delete({ _id })
        .then(({ data }) => {
          notify({ message: data.message })
          setPagination({
            ...pagination,
            docs: pagination.docs.map(doc => {
              if (doc._id !== _id) {
                return doc
              }

              return {
                ...doc,
                status: 'cancelled'
              }
            })
          })
        })
        .catch(error => notify({
          type: 'error',
          message: getApiErrorMessage(error)
        }))
        .finally(() => {
          dispatch(setLoading(false))
        })
    }
  }

  // auto load
  useEffect(() => {
    if (queryParam.page) {
      dispatch(setLoading(true))
      PaymentAPI
        .paginate(queryParam)
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
  }, [ queryParam ])

  return (
    <>
      <h1>Payment request history</h1>

      <TableContainer component={Paper} style={{ margin: '8px 0' }}>
        <Table aria-label="Payment request histories">
          <TableHead>
            <TableRow>
              <TableCell>Create at</TableCell>
              <TableCell>Payment method</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ensureArray(pagination.docs).map(row => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">{moment(row.createdAt).format('hh:mm A MMM DD, YYYY')}</TableCell>
                <TableCell>{pascalCase(row.paymentMethod)}</TableCell>
                <TableCell>{row.type === 'income' ? 'Nạp tiền' : 'Rút tiền'}</TableCell>
                <TableCell>{vndCurrency(row.amount)}</TableCell>
                <TableCell>{pascalCase(row.status)}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  {row.status === 'pending'
                    ? (
                      <>
                        <Button onClick={() => history.push(generate([ 'paymentRequest.edit', { _id: row._id } ]))} size="small" color="primary">Edit</Button>
                        <Button onClick={() => cancelRequest(row._id)} size="small" color="secondary">Cancel</Button>
                      </>
                    )
                    : ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination {...pagination}/>
    </>
  )
}

export default PaymentRequestHistory
