import React from 'react'
import { useDispatch } from 'react-redux'
import { AuthData } from 'api/user/checkAuth'
import { login, getInitializedAuthState, logout } from 'store/authSlice'

export default function useAuth() {
  const dispatch = useDispatch()

  const setUserLogin = (userData: AuthData) => {
    dispatch(login(userData))
  }

  const getCurrentUser = () => getInitializedAuthState()

  const removeUserLogin = () => {
    dispatch(logout())
  }

  return { setUserLogin, getCurrentUser, removeUserLogin }
}
