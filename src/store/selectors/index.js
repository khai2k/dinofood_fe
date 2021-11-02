import { createSelector } from 'reselect'

export const getIsLoadingSelector = createSelector(
  state => state.root.loading,
  loading => loading
)
