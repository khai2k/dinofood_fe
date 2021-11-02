export const setLoading = value => ({
  type: 'LOADING',
  value: value || false
})

export const updateTodos = todos => ({
  type: 'UPDATE_TODOS',
  todos
})

export const addTodo = todo => ({
  type: 'ADD_TODO',
  todo
})

export const removeTodo = _id => ({
  type: 'REMOVE_TODO',
  _id
})
