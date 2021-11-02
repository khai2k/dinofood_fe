const strNumbers = [
  'không',
  'một',
  'hai',
  'ba',
  'bốn',
  'năm',
  'sáu',
  'bảy',
  'tám',
  'chín'
]

/**
 * Convert dozens block number to string
 * @return {String}
 */
function readNumberDozens (number, fullNumbers) {
  let result = ''
  const tenNo = Math.floor(number / 10)
  const unit = number % 10
  if (tenNo > 1) {
    result = ' ' + strNumbers[tenNo] + ' mươi'
    if (unit === 1) {
      result += ' mốt'
    }
  } else if (tenNo === 1) {
    result = ' mười'
    if (unit === 1) {
      result += ' một'
    }
  } else if (fullNumbers && unit > 0) {
    result = ' lẻ'
  }
  if (unit === 5 && tenNo > 1) {
    result += ' lăm'
  } else if (unit > 1 || (unit === 1 && tenNo === 0)) {
    result += ' ' + strNumbers[unit]
  }

  return result
}

/**
 * Convert thousand block number to string
 * @return {String}
 */
function readBlock (number, fullNumbers) {
  let result = ''
  const hundred = Math.floor(number / 100)
  const noDivHundred = number % 100
  if (fullNumbers || hundred > 0) {
    result = ' ' + strNumbers[hundred] + ' trăm'
    result += readNumberDozens(noDivHundred, true)
  } else {
    result = readNumberDozens(noDivHundred, false)
  }
  return result
}

/**
 * Convert million number to string
 * @return {String}
 */
function readMillion (number, fullNumbers) {
  let result = ''
  const million = Math.floor(number / 1000000)
  let numberDivMillion = number % 1000000
  if (million > 0) {
    result = readBlock(million, fullNumbers) + ' triệu'
    fullNumbers = true
  }

  const thousand = Math.floor(numberDivMillion / 1000)
  numberDivMillion = numberDivMillion % 1000
  if (thousand > 0) {
    result += readBlock(thousand, fullNumbers) + ' nghìn'
    fullNumbers = true
  }

  if (numberDivMillion > 0) {
    result += readBlock(numberDivMillion, fullNumbers)
  }

  return result
}

/**
 * Convert number to VN string
 * @param {Number} number
 * @return {String}
 */
function readNumber (number, upperFirst) {
  if (number === 0) {
    return strNumbers[0]
  }

  let result = ''
  let suffix = ''
  do {
    const billion = number % 1000000000
    number = Math.floor(number / 1000000000)
    if (number > 0) {
      result = readMillion(billion, true) + suffix + result
    } else {
      result = readMillion(billion, false) + suffix + result
    }

    suffix = ' tỷ'
  } while (number > 0)

  const numberAsStr = result.trim()

  return upperFirst
    ? `${numberAsStr.charAt(0).toUpperCase()}${numberAsStr.slice(1)}`
    : numberAsStr
}

export default {
  readNumber,
  viNumber: readNumber
}
