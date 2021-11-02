import axios from 'axios'

export const paginate = params => axios.get('/api/payment-requests', { params })
export const detail = ({ _id }) => axios.get(`/api/payment-requests/${_id}`)
export const create = payload => axios.post('/api/payment-requests', payload)
export const update = ({ _id, ...payload }) => axios.put(`/api/payment-requests/${_id}`, payload)
export const remove = ({ _id }) => axios.delete(`/api/payment-requests/${_id}`)

export default {
  paginate,
  detail,
  create,
  update,
  remove,
  delete: remove
}
