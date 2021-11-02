import axios from 'axios'

export const paginate = params => axios.get('/api/receipts', { params })
export const detail = ({ _id }) => axios.get(`/api/receipts/${_id}`)
export const create = payload => axios.post('/api/receipts', payload)
export const update = ({ _id, ...payload }) => axios.put(`/api/receipts/${_id}`, payload)
export const remove = ({ _id }) => axios.delete(`/api/receipts/${_id}`)

export const confirm = ({ _id }) => axios.patch(`/api/receipts/${_id}/confirm`)
export const paid = ({ _id }) => axios.patch(`/api/receipts/${_id}/paid`)
export const paidOnMember = ({ _id, member }) => axios.patch(`/api/receipts/${_id}/members/${member}/paid`)
export const pay = ({ _id }) => axios.patch(`/api/receipts/${_id}/pay`)
export const verifyPay = ({ _id, ...payload }) => axios.put(`/api/receipts/${_id}/pay`, payload)
export const blame = ({ _id, ...payload }) => axios.put(`/api/receipts/${_id}/blame`, payload)

export default {
  paginate,
  detail,
  create,
  update,
  remove,
  delete: remove,
  confirm,
  paid,
  paidOnMember,
  pay,
  verifyPay,
  blame
}
