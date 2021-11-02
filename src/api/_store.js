import axios from 'axios'

export const paginate = (params) => axios.get('/api/stores', { params })
export const detail = ({ slug }) => axios.get(`/api/stores/${slug}`)
export const menu = ({ _id }) => axios.get(`/api/stores/${_id}/menu`)

export default {
  paginate,
  detail,
  menu
}
