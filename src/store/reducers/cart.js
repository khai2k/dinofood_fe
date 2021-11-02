import { CART } from '_constants/'
import { ensureObject, ensureArray } from '_utils/helpers'

export const cart = {}

const reducer = (state = cart, action) => {
  switch (action.type) {
    case CART: {
      const payload = ensureObject(action.payload)
      const members = ensureArray(payload.users)
      const { countDish, subTotal } = members.reduce((result, { dishes }, index) => {
        for (const dish of dishes) {
          const qty = dish.qty || 0
          const price = dish.price || 0
          result.countDish += qty
          result.subTotal += qty * price
        }

        return result
      }, {
        countDish: 0,
        subTotal: 0
      })

      payload.countMember = members.length
      payload.countDish = countDish
      payload.subTotal = subTotal
      payload.members = members
      state = payload
      break
    }
    default:
      return state
  }

  return state
}

export default reducer
