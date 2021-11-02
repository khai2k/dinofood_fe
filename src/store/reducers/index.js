const initialState = {}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.value }
    case 'UPDATE_TODOS':
      return { ...state, todos: action.todos }
    case 'ADD_TODO':
      return { ...state, todos: [ ...state.todos, action.todo ] }
    case 'REMOVE_TODO':
      return { ...state, todos: state.todos.filter(t => t._id !== action._id) }
    default:
      return state
  }
}

export default rootReducer
