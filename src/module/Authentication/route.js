/**
 * Authentication
 */
import Login from '_module/Authentication/components/Login'
import Register from '_module/Authentication/components/Register'
import ResetPassword from '_module/Authentication/components/ResetPassword'
import ForgotPassword from '_module/Authentication/components/ForgotPassword'
import ChangePassword from '_module/Authentication/components/ChangePassword'

export default [
  {
    path: '/login',
    name: 'login',
    exact: true,
    auth: false,
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    exact: true,
    auth: false,
    component: Register
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    exact: true,
    auth: false,
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    exact: true,
    auth: false,
    component: ResetPassword
  },
  {
    path: '/change-password',
    name: 'changePassword',
    exact: true,
    component: ChangePassword
  }
]
