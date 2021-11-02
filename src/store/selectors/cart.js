import { createSelector } from 'reselect'

export const getCartSelector = createSelector(
  state => state.cart,
  cart => cart
)
