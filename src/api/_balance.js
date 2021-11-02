import axios from 'axios'

export const check = params => axios.get('/api/check-balance', { params })

export default {
  check
}
