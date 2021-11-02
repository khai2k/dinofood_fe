/**
 * File name: /src/route/util.js
 * Created by Visual studio code
 * User: Danh Le / danh.le@dinovative.com
 * Date: 2020-06-11 15:18:20
 */
import store from '_store'
import { push } from 'connected-react-router'
import Routes from '_route'

/**
 * Check and get internal route path
 * @param {String} path
 */
export const internalPath = path => {
  try {
    const url = new URL(path)
    if (url.host === window.location.host) {
      return `${url.pathname}${url.search}`
    }

    return false
  } catch (error) {
    return Routes.some(route => String(path).match(
      new RegExp(`^${route.path}`)
    )) && path
  }
}

/**
 * Check and redirect to URL
 * @param {String} path
 */
export const goURL = (path, state) => {
  if (navigator?.onLine === false) {
    const memoryStack = store.getState().root.memoryStack
    const { pathname } = new URL(path, window.location.origin)

    if (!memoryStack.includes(pathname)) {
      return
    }
  }

  try {
    const url = new URL(path)
    if (url.host === window.location.host) {
      return store.dispatch(
        push(`${url.pathname}${url.search}`, state)
      )
    }
    // open new tab
    window.open(url)
    // window.location.href = url
  } catch (error) {
    return store.dispatch(
      push(path, state)
    )
  }
}

export default {
  internalPath,
  goURL
}
