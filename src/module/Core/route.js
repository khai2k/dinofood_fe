/**
 * Core
 */
import Home from '_module/Core/components/Home'
import Error404 from '_module/Core/components/404'

export default [
  {
    path: '/',
    name: 'home',
    exact: true,
    auth: false,
    component: Home
  },
  {
    path: '/404',
    name: '404',
    exact: true,
    auth: false,
    component: Error404
  }
]
