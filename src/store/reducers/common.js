import produce from 'immer'
import { COMMON_HIDE_LOADING, COMMON_SHOW_LOADING, SHOW_ALERT, CLOSE_ALERT } from '_constants'

export const initState = {
  isLoading: false,
  alertNotifycation: {
    isAlert: false,
    type: '',
    message: ''
  }
}

const commonReducer = (state = initState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case COMMON_SHOW_LOADING:
        draft.isLoading = true
        break
      case COMMON_HIDE_LOADING:
        draft.isLoading = false
        break
      case SHOW_ALERT:
        draft.alertNotifycation.isAlert = true
        draft.alertNotifycation.message = action.payload.message
        break
      case CLOSE_ALERT:
        draft.alertNotifycation.isAlert = false
        draft.alertNotifycation.message = ''
        break
      default:
        return state
    }
  })

export default commonReducer
