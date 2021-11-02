import React, { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'

import convert from '_utils/convert'
import { compareObject, getApiErrorMessage, getNumberFromStr, notify, vndCurrency } from '_utils/helpers'
import ReceiptAPI from '_api/_receipt'
import generate from '_route/generate'

import { Box, Grid, Paper, Typography, FormHelperText, InputAdornment } from '@material-ui/core'
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons'
import Input from '_components/Input'
import Button from '_components/Button'
import ReceiptInformation from '_module/Receipt/components/Information'

import { mapReceiptPayload, splitReceipt, splitReceiptMemberInfo, genNewMember } from '../../util'

export const EditReceipt = props => {
  const numberFields = [ 'shippingFee', 'discount' ]

  const history = useHistory()
  const { _id } = useParams()

  const [ preview, setPreview ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const [ members, setMembers ] = useState([ genNewMember() ])
  const [ cachePayload, setCachePayload ] = useState({})
  const [ formData, setFormData ] = useState({
    title: '',
    shippingFee: 15000,
    discount: ''
  })

  /**
   * Reset component states
   */
  const resetStates = () => {
    setFormData({
      title: '',
      shippingFee: 15000,
      discount: ''
    })

    setMembers([ genNewMember() ])
  }

  /**
   * Handle form input change
   * @param {Event} e
   */
  const handleChange = e => {
    const el = e.target
    const val = el.value
    const name = el.name

    setFormData(prevState => ({
      ...prevState,
      [name]: numberFields.includes(name)
        ? getNumberFromStr(val)
        : val
    }))
  }

  /**
   * Handle form submit event
   * @param {Event} e
   * @param {Member} member
   */
  const handleChangeMember = (e, member) => {
    const onChangeMember = members.find(
      ({ _id }) => _id === member._id
    )
    if (!onChangeMember) {
      return
    }

    const el = e.target
    const val = el.value
    const name = el.name
    onChangeMember[name] = name === 'price'
      ? getNumberFromStr(val)
      : val

    setMembers(prevState => [ ...prevState ])
  }

  /**
   * Add new member
   */
  const addMember = () => {
    setMembers(() => [
      ...members,
      genNewMember()
    ])
  }

  /**
   * Remove member by tracking _id
   * @param {String} _id
   */
  const removeMember = _id => {
    setMembers(() => members.filter(mem => mem._id !== _id))
  }

  /**
   * Check receipt information
   * @param {Event} e
   */
  const handleCheckReceipt = e => {
    try {
      setPreview({
        ...splitReceipt({
          shippingFee: formData.shippingFee,
          discount: formData.discount,
          members
        }),
        title: formData.title
      })
    } catch (error) {
      notify({
        type: 'error',
        message: getApiErrorMessage(error)
      })
    }
  }

  /**
   * Handle form submit event
   * @param {Event} e
   */
  const handleSubmit = async e => {
    e.preventDefault()

    try {
      setLoading(true)
      const payload = mapReceiptPayload({
        title: formData.title,
        shippingFee: formData.shippingFee,
        discount: formData.discount,
        members
      })

      if (compareObject(payload, cachePayload)) {
        throw new Error('Already the newest version.')
      }

      const { data } = await ReceiptAPI.update({
        ...payload,
        _id
      })

      setCachePayload(cloneDeep(payload))
      notify({ message: data.message })
    } catch (error) {
      notify({
        type: 'error',
        message: getApiErrorMessage(error)
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * SECTION: Hooks
   */
  useEffect(() => {
    setLoading(true)
    ReceiptAPI
      .detail({ _id })
      .then(({ data }) => {
        const general = {
          title: data.title,
          shippingFee: data.shippingFee,
          discount: data.discount
        }
        const members = data.members.map(splitReceiptMemberInfo)
        setFormData({ ...general })
        setMembers(cloneDeep(members))

        try {
          setCachePayload(
            mapReceiptPayload({
              ...general,
              members
            })
          )
        } catch (error) {
          // validation failed
        }
      })
      .catch(() => {
        setTimeout(
          () => history.push(generate('404'))
        )
      })
      .finally(() => {
        setLoading(false)
      })

    // reset states
    return resetStates
  }, [ _id ])

  /**
   * SECTION: Render
   */
  const renderMemberRow = (member, index, arr) => (
    <Box key={member._id} display="flex" flexDirection="row" position="relative">
      <Grid item xs={12} md={4}>
        <Input
          disabled={loading}
          value={member.email}
          required
          fullWidth
          placeHolder="Email"
          // label="Email"
          name="email"
          onChange={e => handleChangeMember(e, member)}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <Input
          disabled={loading}
          value={member.domain}
          required
          fullWidth
          placeHolder="Email domain"
          // label="Email domain"
          name="domain"
          onChange={e => handleChangeMember(e, member)}
          InputProps={{
            startAdornment: (<InputAdornment position="start">@</InputAdornment>)
          }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <Input
          disabled={loading}
          value={vndCurrency(member.price, true)}
          required
          fullWidth
          placeHolder="Price"
          // label="Price"
          name="price"
          onChange={e => handleChangeMember(e, member)}
        />
      </Grid>

      {arr.length !== 1 && (
        <RemoveIcon onClick={() => removeMember(member._id)} className="del-member-icon"/>
      )}
      {arr.length - 1 === index && (
        <AddIcon onClick={addMember} className="add-member-icon"/>
      )}
    </Box>
  )

  return (
    <Grid container justify="center" className="form-edit-receipt">
      <Box width="100%" maxWidth={700}>
        <Paper>
          <Box p={3}>
            <Grid item md={12}>
              <Typography variant="h6" noWrap align="center">
                Cập nhật hóa đơn.
              </Typography>
            </Grid>

            <form onSubmit={handleSubmit}>
              <Grid item md={12}>
                <Box mb={3}>
                  <Grid item md={12}>
                    <Input
                      disabled={loading}
                      value={formData.title}
                      required
                      fullWidth
                      placeHolder="Title"
                      label="Title"
                      name="title"
                      onChange={handleChange}
                    />
                  </Grid>
                </Box>

                <Box mb={3}>
                  <Grid container>
                    <Input
                      disabled={loading}
                      value={vndCurrency(formData.shippingFee, true)}
                      // required
                      fullWidth
                      placeHolder="Shipping fee"
                      label="Shipping fee"
                      name="shippingFee"
                      onChange={handleChange}
                    />
                    {!!formData.shippingFee && (
                      <FormHelperText variant="filled">
                        Bằng chữ: {convert.viNumber(formData.shippingFee)} đồng
                      </FormHelperText>
                    )}
                  </Grid>
                </Box>

                <Box mb={3}>
                  <Grid container>
                    <Input
                      disabled={loading}
                      value={vndCurrency(formData.discount, true)}
                      // required
                      fullWidth
                      placeHolder="Discount"
                      label="Discount"
                      name="discount"
                      onChange={handleChange}
                    />
                    {!!formData.discount && (
                      <FormHelperText variant="filled">
                        Bằng chữ: {convert.viNumber(formData.discount)} đồng
                      </FormHelperText>
                    )}
                  </Grid>
                </Box>

                <Box mb={3}>
                  {members.map(renderMemberRow)}
                </Box>

                <Box mb={3}>
                  <Grid container justify="space-between">
                    <Grid item xs={12} md={5}>
                      <Button
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        type="submit"
                        content="Submit"
                        variant="contained"
                        handleClick={handleSubmit}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Button
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        content="Check receipt"
                        variant="contained"
                        handleClick={handleCheckReceipt}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </form>

            <ReceiptInformation receipt={preview}/>
          </Box>
        </Paper>
      </Box>
    </Grid>
  )
}

export default EditReceipt
