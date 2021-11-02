
import qs from 'qs'
import { useLocation } from 'react-router-dom'

import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

/**
 * Random number in range
 * @param {Number} minimum
 * @param {Number} maximum
 * @return {Number}
 */
export const rand = (minimum = 0, maximum = 999999999999) => {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}

export const isArray = arr => Array.isArray(arr)

export const checkArrayAvailable = array => isArray(array) && array.length > 0

export const isObject = obj => obj instanceof Object && !Array.isArray(obj)

export const ensureArray = (arr, defaultValue) =>
  isArray(arr) ? arr : isArray(defaultValue) ? defaultValue : []

export const ensureObject = (obj, defaultValue) =>
  isObject(obj) ? obj : isObject(defaultValue) ? defaultValue : {}

/**
 * Uppercase string
 * @param {String} string
 * @return {String}
 */
export const upperCase = string => {
  if (typeof string === 'string') {
    return string.toUpperCase()
  }
  return string
}

/**
 * Lowercase string
 * @param {String} string
 * @return {String}
 */
export const lowerCase = string => {
  if (typeof string === 'string') {
    return string.toLowerCase()
  }

  return string
}

/**
 * Convert string to camel case
 * @return {String}
 */
export const camelCase = str => String(str)
  .toLowerCase()
  // Replaces any - or _ characters with a space
  .replace(/[-_]+/g, ' ')
  // Removes any non alphanumeric characters
  .replace(/[^\w\s]/g, '')
  // Uppercase the first character in each group immediately following a space
  // (delimited by spaces)
  .replace(/ (.)/g, $1 => $1.toUpperCase())
  // Removes spaces
  .replace(/ /g, '')

/**
 * Convert string to pascal case
 * @return {String}
 */
export const pascalCase = str => String(str)
  // Replaces any - or _ characters with a space
  .replace(/[-_]+/g, ' ')
  // Removes any non alphanumeric characters
  .replace(/[^\w\s]/g, '')
  // Uppercase the first character in each group immediately following a space
  // (delimited by spaces)
  .replace(
    /\s+(.)(\w+)/g,
    ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
  )
  // Removes spaces
  .replace(/\s/g, '')
  // Uppercase first letter
  .replace(/\w/, s => s.toUpperCase())

export function downloadFile (url) {
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', '')
  document.body.appendChild(link)
  link.click()
}

/**
 * Show notify message
 */
export const notify = ({ type = 'success', message = '' } = {}, options = {}) => {
  const types = [ 'info', 'success', 'warning', 'error' ]
  if (!types.includes(type)) {
    throw new Error('Notify type must be one of: [ \'info\', \'success\', \'warning\', \'error\' ]')
  }

  const title = pascalCase(type)
  const content = {
    ...options,
    title: '',
    transitionIn: 'fadeInDown', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight, flipInX
    transitionOut: 'fadeOutUp', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
    message: message || title,
    backgroundColor: title === 'Error' ? 'red' : undefined,
    // backgroundColor: title === 'Error' ? 'red' : '#4cd0529e',
    close: options.close || false,
    closeOnClick: true,
    progressBar: options.progressBar || false,
    position: options.position || 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
    class: `toast-item ${type}`,
    icon: '',
    displayMode: 'replace' // 0, once, replace
  }

  iziToast.destroy()
  iziToast[type](content)
}

export const readFilePromise = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = function (e) {
    resolve(e.target.result)
  }
  if (file && file.type.match('image.*')) {
    reader.readAsDataURL(file)
  }
})

export const currencyFormat = num => {
  if (num !== undefined) {
    var numbers = Number(
      String(num)
        .split(',')
        .join('')
    )
    return Number(numbers)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
}

export const checkURL = url => {
  return String(url).match(/\.(jpeg|jpg|gif|png)$/) != null
}

export const useQuery = () => {
  return qs.parse(useLocation().search?.replace(/^\?+/, ''))
}

export function formatCurrencyNotIcon (amount) {
  return `${amount.toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export const countryToFlag = isoCode => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(char.charCodeAt(0) + 127397)
      )
    : isoCode
}

/**
 * Get API error message
 * @param {Object} response
 * @return {String}
 */
export const getApiErrorMessage = err => {
  try {
    const response = (err && err.response) || err
    if (response && typeof response === 'object') {
      return (
        response.data &&
        (
          response.data.message ||
          response.data.error ||
          JSON.stringify(response.data, null, 2)
        )
      ) ||
        response.data ||
        response.message ||
        response
    }

    return typeof response === 'string' ? response : JSON.stringify(response, null, 2)
  } catch (error) {
    console.log({ error })
    return String(err)
  }
}

/**
 * alphabeticalSort option of qs module
 * @param {String} a
 * @param {String} b
 */
export const alphabeticalSort = (a, b) => {
  return a.localeCompare(b)
}

/**
 * Compare object use qs stringify, true if two object is equal.
 * @param {*} obj1
 * @param {*} obj2
 * @return {Boolean}
 */
export const compareObject = (obj1, obj2) => {
  const qs1 = qs.stringify(ensureObject(obj1), {
    arrayFormat: 'repeat',
    sort: alphabeticalSort
  })

  const qs2 = qs.stringify(ensureObject(obj2), {
    arrayFormat: 'repeat',
    sort: alphabeticalSort
  })

  return qs1 === qs2
}

/**
 * Format number to vnđ currency
 * @param {Number} money
 * @return {String}
 */
export const vndCurrency = (money, noSubfix) => {
  return String(money || (noSubfix ? '' : 0)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + (noSubfix ? '' : ' vnđ')
}

/**
 * Filter and join all number from input string
 * @param {String} str
 * @returns {String}
 */
export const getNumberFromStr = str => {
  const matches = String(str).match(/\d+/g)
  return matches
    ? matches.join('').replace(/^0+/, '')
    : ''
}

/**
 * Redirect location
 * @param {String} href
 */
export const toURL = href => {
  window.location.href = href
}

/**
 * Generate array of integer
 * @param {Number} number
 * @return {Number[]}
 */
export const generateArray = number => {
  const numb = Math.floor(Math.abs(Number(number) || 0))
  return Array.from(new Array(numb), (val, index) => index + 1)
}

/**
 * Clear duplicate array items
 * @param {Any[]} arr
 * @param {Any} getVal
 * @return {Any[]}
 */
export const clearDuplicate = (arr, getVal) => ensureArray(arr).filter((item, index, self) => {
  let itemVal = getVal ? item[getVal] : item
  switch (typeof getVal) {
    case 'string':
      itemVal = item[getVal]
      break
    case 'function':
      itemVal = getVal(item)
      break
    default:
      itemVal = item
  }

  const cIndex = self.findIndex(e => (getVal ? e[getVal] : e) === itemVal)

  return cIndex === index
})
