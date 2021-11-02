import { createSelector } from 'reselect'

export const getCredentialSelector = createSelector(
  state => state.auth.credentials,
  credentials => credentials
)

export const getIsAuthenticatedSelector = createSelector(
  state => state.auth.isAuthenticated,
  isAuthenticated => isAuthenticated
)
