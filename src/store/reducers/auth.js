import {
  LOGIN_SUCCESS,
  LOG_OUT_SUCCESS,
  REGISTER_SUCCESS,
  GET_INFO_USER_SUCCESS
} from '_constants'

export const initState = {
  credentials: {},
  isAuthenticated: null
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case GET_INFO_USER_SUCCESS:
      state = {
        ...state,
        credentials: action.payload,
        isAuthenticated: true
      }
      break
    case LOG_OUT_SUCCESS:
      state = {
        ...state,
        credentials: {},
        isAuthenticated: false
      }
      break
    default:
      return state
  }

  return state
}

export default reducer
