import React, { useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import { debounce } from 'lodash'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import generate from '_route/generate'
import ReceiptAPI from '_api/_receipt'
import useQueryParam from '_hooks/useQueryParam'
import { notify, getApiErrorMessage, ensureArray/** , pascalCase */, vndCurrency, compareObject } from '_utils/helpers'
import { setLoading } from '_store/actions'
import { getIsLoadingSelector } from '_store/selectors'
import { getCredentialSelector } from '_store/selectors/auth'

import {
  Button,
  Grid,
  Paper,
  Box,
  Fade,
  Modal,
  Backdrop,
  TextField,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import Pagination from '_components/Pagination'
import SelectComponent from '_components/SelectComponent'
import VerifyOTPDialog from '_components/VerifyOTPDialog'
import ReceiptInformation from '_module/Receipt/components/Information'
import { getMemberUid, isPaidReceipt, isReceiptOwner } from '_module/Receipt/util'
import { isOwnerOptions, statuses } from './options'

export const ReceiptHistory = props => {
  const history = useHistory()
  const dispatch = useDispatch()
  const urlParams = useQueryParam()
  const loading = useSelector(getIsLoadingSelector)
  const credentials = useSelector(getCredentialSelector)

  const [ receipt, setReceipt ] = useState(false)
  const [ pagination, setPagination ] = useState({ page: 1 })
  const [ payTransferRefId, setPayTransferRefId ] = useState({})
  const [ queryParams, setQueryParams ] = useState({
    keyword: '',
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().endOf('month').format('YYYY-MM-DD'),
    ...urlParams
  })
  const reMapDocs = ({ docs, _id, mergeDoc, notId, memberId, mergeMember }) => {
    if (notId) {
      return docs.filter(doc => doc._id !== notId)
    }

    if (memberId) {
      return docs.map(
        doc => doc._id !== _id
          ? doc
          : {
            ...doc,
            ...mergeDoc,
            members: doc.members.map(
              member => ({
                ...member,
                ...mergeMember
              })
            )
          }
      )
    }

    return docs.map(
      doc => doc._id !== _id
        ? doc
        : { ...doc, ...mergeDoc }
    )
  }

  const loadingAPISkeleton = async apiCall => {
    try {
      dispatch(setLoading(true))
      await apiCall()
    } catch (error) {
      notify({
        type: 'error',
        message: getApiErrorMessage(error)
      })
    } finally {
      dispatch(setLoading(false))
    }
  }

  // debounce query with keyword
  const searchKeyword = useMemo(
    () => debounce(
      keyword => {
        pushURL({ keyword })
      },
      300
    ),
    []
  )

  const handleChangeKeyword = e => {
    setQueryParams({
      ...queryParams,
      keyword: e.target.value
    })

    searchKeyword(e.target.value)
  }

  /**
   * Push URL parameters history
   */
  const pushURL = (params = {}) => {
    const query = {
      page: params.page || urlParams.page || 1,
      status: params.status || 'status' in params ? params.status : urlParams.status || '',
      keyword: params.keyword || 'keyword' in params ? params.keyword : urlParams.keyword || '',
      isOwner: params.isOwner || 'isOwner' in params ? params.isOwner : urlParams.isOwner || '',
      fromDate: params.fromDate || urlParams.fromDate || moment().startOf('month').format('YYYY-MM-DD'),
      toDate: params.toDate || urlParams.toDate || moment().endOf('month').format('YYYY-MM-DD')
    }
    const route = generate(history.location.pathname, query)
    history.push(route)
  }

  /**
   * Handle delete receipt
   * @param {string} _id
   */
  const deleteReceipt = _id => {
    const confirm = window.confirm('Delete receipt?')
    if (!confirm) {
      return
    }

    loadingAPISkeleton(
      async () => {
        const { data } = await ReceiptAPI.delete({ _id })
        notify({ message: data.message })
        setPagination({
          ...pagination,
          docs: reMapDocs({
            docs: pagination.docs,
            notId: _id
          })
        })
      }
    )
  }

  /**
   * Handle confirm receipt
   * @param {string} _id
   */
  const confirmReceipt = _id => {
    const confirm = window.confirm('Confirm receipt information. Send receipt notify to members. Cannot edit after confirmed?')
    if (!confirm) {
      return
    }

    loadingAPISkeleton(
      async () => {
        const { data } = await ReceiptAPI.confirm({ _id })
        notify({ message: data.message })
        setPagination({
          ...pagination,
          docs: reMapDocs({
            docs: pagination.docs,
            _id,
            mergeDoc: { confirmed: true }
          })
        })
      }
    )
  }

  /**
   * Handle paid receipt
   * @param {string} _id
   */
  const paidReceipt = _id => {
    const confirm = window.confirm('Are you sure you have received enough money?')
    if (!confirm) {
      return
    }

    loadingAPISkeleton(
      async () => {
        const { data } = await ReceiptAPI.paid({ _id })
        notify({ message: data.message })
        setPagination({
          ...pagination,
          docs: reMapDocs({
            docs: pagination.docs,
            _id,
            mergeDoc: { paid: true },
            mergeMember: { paid: true }
          })
        })
      }
    )
  }

  /**
   * Handle paid receipt's member
   * @param {string} mId member _id
   */
  const paidForMember = mId => {
    const confirm = window.confirm('Are you have received money from this member?')
    if (!confirm) {
      return
    }

    loadingAPISkeleton(
      async () => {
        const { data } = await ReceiptAPI.paidOnMember({
          _id: receipt._id,
          member: mId
        })

        const updatedReceipt = {
          ...receipt,
          ...receipt.members.reduce(({ paid, members }, item) => ({
            paid: paid && (getMemberUid(item) === mId || item.paid),
            members: [
              ...members,
              {
                ...item,
                paid: item.paid || getMemberUid(item) === mId
              }
            ]
          }), {
            paid: true,
            members: []
          })
        }

        setReceipt(updatedReceipt)
        setPagination({
          ...pagination,
          docs: reMapDocs({
            docs: pagination.docs,
            _id: updatedReceipt._id,
            mergeDoc: updatedReceipt
          })
        })

        notify({ message: data.message })
      }
    )
  }

  /**
   * Handle pay to receipt
   * @param {string} _id receipt _id
   */
  const payToReceipt = _id => {
    loadingAPISkeleton(
      async () => {
        const { data } = await ReceiptAPI.pay({ _id })
        setPayTransferRefId({
          _id,
          transfer: data._id
        })
        notify({ message: data.message })
      }
    )
  }

  /**
   * Handle verify OTP transfer for receipt
   * @param {string} OTP transfer OTP
   */
  const verifyPayToReceipt = OTP => {
    loadingAPISkeleton(
      async () => {
        const { data } = await ReceiptAPI.verifyPay({
          ...payTransferRefId,
          OTP
        })

        const mId = credentials._id
        const currentReceipt = receipt || pagination.docs.find(
          ({ _id }) => _id === payTransferRefId._id
        )
        const updatedReceipt = {
          ...currentReceipt,
          ...currentReceipt.members.reduce(({ paid, members }, item) => ({
            paid: paid && (getMemberUid(item) === mId || item.paid),
            members: [
              ...members,
              {
                ...item,
                paid: item.paid || getMemberUid(item) === mId
              }
            ]
          }), {
            paid: true,
            members: []
          })
        }

        if (receipt) {
          setReceipt(updatedReceipt)
        }

        setPagination({
          ...pagination,
          docs: reMapDocs({
            docs: pagination.docs,
            _id: updatedReceipt._id,
            mergeDoc: updatedReceipt
          })
        })
        setPayTransferRefId({})
        notify({ message: data.message })
      }
    )
  }

  /**
   * Blame receipt members
   */
  const blameReceiptMembers = _id => {
    loadingAPISkeleton(
      async () => {
        const { data } = await ReceiptAPI.blame({ _id })
        notify({ message: data.message })
      }
    )
  }

  /**
   * Show receipt information
   */
  const showReceipt = receipt => {
    loadingAPISkeleton(
      async () => {
        const _id = (receipt && receipt._id) || receipt
        const { data } = await ReceiptAPI.detail({ _id })
        setReceipt(data)
      }
    )
  }

  /**
   * Hooks
   */
  useEffect(() => {
    const newQueryParams = {
      keyword: '',
      fromDate: moment().startOf('month').format('YYYY-MM-DD'),
      toDate: moment().endOf('month').format('YYYY-MM-DD'),
      ...urlParams
    }
    if (!compareObject(newQueryParams, queryParams)) {
      setQueryParams(newQueryParams)
    }

    if (urlParams.page) {
      loadingAPISkeleton(
        async () => {
          const { data } = await ReceiptAPI.paginate({
            ...urlParams,
            isOwner: [ true, 'true' ].includes(urlParams.isOwner || queryParams.isOwner),
            fromDate: moment(urlParams.fromDate || queryParams.fromDate).startOf('day').toISOString(),
            toDate: moment(urlParams.toDate || queryParams.toDate).endOf('day').toISOString()
          })
          setPagination(data)
        }
      )
    } else {
      pushURL()
    }

    // reset state
    return () => setPagination({ page: 1 })
  }, [ urlParams ])

  const renderOwnerBtnGroup = row => (
    row.confirmed
      ? (
        <>
          <Button
            onClick={() => blameReceiptMembers(row._id)}
            size="small"
            color="primary"
            variant="contained"
          >Blame
          </Button>
          <Button
            onClick={() => paidReceipt(row._id)}
            size="small"
            color="primary"
            variant="contained"
          >Paid
          </Button>
        </>
      )
      : (
        <>
          <Button
            onClick={() => confirmReceipt(row._id)}
            size="small"
            color="primary"
            variant="contained"
          >Confirm
          </Button>
          <Button
            onClick={() => history.push(generate([ 'receipt.edit', { _id: row._id } ]))}
            size="small"
            color="primary"
            variant="contained"
          >Edit
          </Button>
          <Button
            onClick={() => deleteReceipt(row._id)}
            size="small"
            color="secondary"
            variant="contained"
          >Delete
          </Button>
        </>
      )
  )
  const renderMemberBtnGroup = row => !isPaidReceipt(row) && (
    <Button
      size="small"
      color="primary"
      variant="contained"
      onClick={() => payToReceipt(row._id)}
    >Pay
    </Button>
  )
  const renderBtnGroup = row => isReceiptOwner(row)
    ? renderOwnerBtnGroup(row)
    : renderMemberBtnGroup(row)

  return (
    <Box className="receipt-history">
      <h1>Receipt request history</h1>

      <Grid container wrap="wrap" spacing={1}>
        <Grid item xs={12} sm={4} md={4}>
          <TextField
            style={{ width: '100%' }}
            // inputProps={{ readOnly: true }}
            variant="outlined"
            margin="normal"
            placeholder="Search by title"
            label="Search by title"
            type="text"
            value={queryParams.keyword}
            InputLabelProps={{ shrink: true }}
            onChange={handleChangeKeyword}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={2}>
          <SelectComponent
            label="Owner"
            name="isOwner"
            displayEmpty
            listMenu={isOwnerOptions}
            value={[ true, 'true' ].includes(queryParams.isOwner)}
            handleChange={e => pushURL({ isOwner: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={2}>
          <SelectComponent
            name="status"
            label="Filter status"
            displayEmpty
            listMenu={statuses}
            value={queryParams.status || ''}
            handleChange={e => pushURL({ status: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={2}>
          <TextField
            style={{ width: '100%' }}
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

        <Grid item xs={12} sm={4} md={2}>
          <TextField
            style={{ width: '100%' }}
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

      <TableContainer component={Paper} style={{ margin: '8px 0' }}>
        <Table aria-label="Receipt request histories">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Sub total</TableCell>
              <TableCell>Shipping fee</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Create at</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ensureArray(pagination.docs).map(row => (
              <TableRow key={row._id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{vndCurrency(row.subTotal)}</TableCell>
                <TableCell>{vndCurrency(row.shippingFee)}</TableCell>
                <TableCell>{vndCurrency(row.discount)}</TableCell>
                <TableCell>{vndCurrency(row.amount)}</TableCell>
                <TableCell component="th" scope="row">{moment(row.createdAt).format('hh:mm A MMM DD, YYYY')}</TableCell>
                <TableCell>
                  {
                    row.paid
                      ? 'Paid'
                      : row.confirmed
                        ? 'Confirmed'
                        : 'Not confirm'
                  }
                </TableCell>
                <TableCell>
                  <Button onClick={() => showReceipt(row)} size="small" variant="contained" color="default">Info</Button>
                  {!row.paid && renderBtnGroup(row)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination {...pagination}/>

      {/* Receipt information Modal */}
      <Modal
        open={!!receipt}
        onClose={() => setReceipt(false)}
        className="modal-flex-center"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
        // disableEscapeKeyDown
        disableBackdropClick
        disableScrollLock
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
            <ReceiptInformation
              receipt={receipt}
              onPayToReceipt={payToReceipt}
              // onPayToReceipt={() => payToReceipt(receipt._id)}
              onPaidOfMember={memId => paidForMember(memId)}
            />
          </Box>
        </Fade>
      </Modal>

      {/* OTP dialog */}
      <VerifyOTPDialog
        open={!!payTransferRefId._id}
        loading={loading}
        onClose={() => setPayTransferRefId({})}
        onSubmit={verifyPayToReceipt}
      />
    </Box>
  )
}

export default ReceiptHistory
