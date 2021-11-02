import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'

import generate from '_route/generate'
import TransferAPI from '_api/_transfer'
import useQueryParam from '_hooks/useQueryParam'
import { vndCurrency, notify, getApiErrorMessage, ensureArray, pascalCase } from '_utils/helpers'
import { setLoading } from '_store/actions'

import Pagination from '_components/Pagination'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableContainer from '@material-ui/core/TableContainer'

const TransferHistory = props => {
  const history = useHistory()
  const dispatch = useDispatch()
  const queryParam = useQueryParam()
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

  // auto load
  useEffect(() => {
    if (queryParam.page) {
      dispatch(setLoading(true))
      TransferAPI
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
      <h1>Transfer history</h1>

      <TableContainer component={Paper} style={{ margin: '8px 0' }}>
        <Table aria-label="Transfer history">
          <TableHead>
            <TableRow>
              <TableCell>Create at</TableCell>
              <TableCell>Receiver</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ensureArray(pagination.docs).map(row => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">{moment(row.createdAt).format('hh:mm A MMM DD, YYYY')}</TableCell>
                <TableCell>{row.receiver?.username}</TableCell>
                <TableCell>{vndCurrency(row.amount)}</TableCell>
                <TableCell>{pascalCase(row.status)}</TableCell>
                <TableCell>{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination {...pagination}/>
    </>
  )
}

export default TransferHistory
