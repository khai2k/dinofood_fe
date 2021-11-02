import store from '_store/'
import { getCredentialSelector } from '_store/selectors/auth'

export const isCurrentUser = uid => {
  const credentials = getCredentialSelector(store.getState())
  return credentials._id === uid
}
