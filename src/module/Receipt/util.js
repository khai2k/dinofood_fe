import store from '_store/'
import { getCredentialSelector } from '_store/selectors/auth'
import { ensureArray } from '_utils/helpers'
import { receiptSchema } from './validate'

/**
 * SECTION: validate receipt form
 */
export const genNewMember = () => ({
  _id: Math.random(),
  email: '',
  domain: 'dinovative.com',
  price: ''
})

export const splitReceiptMemberInfo = member => {
  const { _id, email } = member.member
  const splitEmail = email.split('@')

  return {
    _id,
    email: splitEmail[0],
    domain: splitEmail[1],
    price: member.price
  }
}

export const mapReceiptPayload = ({ title, shippingFee, discount, members }) => {
  return receiptSchema.validateSync({
    title,
    shippingFee,
    discount,
    members: ensureArray(members).map(
      member => ({
        price: member.price,
        email: `${member.email}@${member.domain}`
      })
    )
  })
}

/**
 * SECTION: calculate receipt amount
 */
function getDiscounted (price, total, discount) {
  if (!total) {
    return 0
  }

  const percent = Math.floor((price * 10000) / total)
  const dist = Math.floor((discount * percent) / 10000)
  return dist
}

export const splitReceipt = ({ shippingFee, discount, members }) => {
  const result = mapReceiptPayload({
    title: 'ignore error',
    shippingFee,
    discount,
    members
  })

  result.subTotal = 0

  // unique members price by email
  const uniqueMembers = result.members.reduce(
    (uniq, { email, price }) => {
      result.subTotal += price

      return uniq[email]
        ? {
          ...uniq,
          [email]: {
            ...uniq[email],
            price: uniq[email].price + price
          }
        } : {
          ...uniq,
          [email]: { email, price }
        }
    },
    {}
  )

  result.discounted = Math.max(result.discount - result.shippingFee, 0)
  result.amount = Math.max(result.subTotal + result.shippingFee - result.discount, 0)
  result.feeOnOne = Math.floor(
    Math.max(result.shippingFee - result.discount, 0) / Object.keys(uniqueMembers).length
  )

  for (const { email, price } of Object.values(uniqueMembers)) {
    const discount = getDiscounted(price, result.subTotal, result.discounted)
    const maxDiscount = Math.min(price + result.feeOnOne, discount)
    const amount = Math.max(price + result.feeOnOne - maxDiscount, 0)

    uniqueMembers[email] = {
      ...uniqueMembers[email],
      fee: result.feeOnOne,
      discount: maxDiscount,
      amount
    }
  }

  result.members = Object.values(uniqueMembers)

  return result
}

/**
 * SECTION: utilities
 */
export const getMemberUid = member => member?.member?._id || member?.member

export const isPaidReceipt = receipt => {
  const credentials = getCredentialSelector(store.getState())
  return ensureArray(receipt.members).some(
    member => member?.paid && getMemberUid(member) === credentials._id
  )
}

export const isReceiptOwner = receipt => {
  const credentials = getCredentialSelector(store.getState())
  const authorId = (receipt.author && receipt.author._id) || receipt.author
  return credentials._id === authorId
}
