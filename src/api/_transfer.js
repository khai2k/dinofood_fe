import axios from 'axios'

export const paginate = (params) => axios.get('/api/transfer', { params })
export const create = (payload) => axios.post('/api/transfer', payload)
export const verify = ({ _id, ...payload }) => axios.put(`/api/transfer/${_id}`, payload)

export default {
  paginate,
  create,
  verify
}
