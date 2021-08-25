import React, { useReducer, useContext } from 'react'
import { Alert } from 'react-native'
import { TodoContext } from './todoContext'
import { todoReducer } from './todoReducer'
import {
  ADD_TODO,
  REMOVE_TODO,
  UPDATE_TODO,
  SHOW_LOADER,
  HIDE_LOADER,
  SHOW_ERROR,
  CLEAR_ERROR,
  FETCH_TODOS,
} from '../types'
import { ScreenContext } from '../screen/screenContext'
import { Http } from '../../http'

export const TodoState = ({ children }) => {
  const initialState = {
    todos: [],
    loading: false,
    error: null,
  }
  const { changeScreen } = useContext(ScreenContext)
  const [state, dispatch] = useReducer(todoReducer, initialState)

  const addTodo = async (title) => {
    clearError()
    try {
      const data = await Http.post(
        'https://rn-todo-app-54599-default-rtdb.europe-west1.firebasedatabase.app/todos.json',
        { title }
      )
      dispatch({ type: ADD_TODO, title, id: data.name })
    } catch (e) {
      showError('Somethink went wrong1...')
    }
  }

  const removeTodo = (id) => {
    const todo = state.todos.find((t) => t.id === id)
    Alert.alert(
      'Deleting an element',
      `Are you sure you want to delete "${todo.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'del',
          style: 'destructive',
          onPress: async () => {
            changeScreen(null)
            await Http.delete(
              `https://rn-todo-app-54599-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`
            )
            dispatch({ type: REMOVE_TODO, id })
          },
        },
      ],
      { cancelable: false }
    )
  }

  const fetchTodos = async () => {
    showLoader()
    clearError()
    try {
      const data = await Http.get(
        'https://rn-todo-app-54599-default-rtdb.europe-west1.firebasedatabase.app/todos.json'
      )
      const todos = Object.keys(data).map((key) => ({ ...data[key], id: key }))
      dispatch({ type: FETCH_TODOS, todos })
    } catch (e) {
      showError()
    } finally {
      hideLoader()
    }
  }

  const updateTodo = async (id, title) => {
    clearError()

    try {
      await fetch(
        `https://rn-todo-app-54599-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        }
      )
      dispatch({ type: UPDATE_TODO, id, title })
    } catch (e) {
      showError('Somethink went wrong2...')
      console.log(e)
    }
  }

  const showLoader = () => dispatch({ type: SHOW_LOADER })

  const hideLoader = () => dispatch({ type: HIDE_LOADER })

  const showError = (error) => dispatch({ type: SHOW_ERROR, error })

  const clearError = () => dispatch({ type: CLEAR_ERROR })

  return (
    <TodoContext.Provider
      value={{
        todos: state.todos,
        loading: state.loading,
        error: state.error,
        addTodo,
        removeTodo,
        updateTodo,
        fetchTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}
