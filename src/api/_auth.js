import axios from 'axios'

export const login = (payload) => axios.post('/api/auth/login', payload)
export const logout = () => axios.delete('/api/auth/logout')
export const getProfile = () => axios.get('/api/auth/profile')
export const register = (payload) => axios.post('/api/auth/register', payload)
export const forgotPassword = (payload) => axios.post('/api/auth/forget-password', payload)
export const resetPassword = (payload) => axios.post('/api/auth/reset-password', payload)
export const updatePassword = (payload) => axios.post('/api/users/update-password', payload)

export default {
  login,
  logout,
  getProfile,
  register,
  forgotPassword,
  resetPassword,
  updatePassword
}
