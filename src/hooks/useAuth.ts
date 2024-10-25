import React from 'react'
import { useDispatch } from 'react-redux'
import { AuthData } from 'api/user/checkAuth'
import {
  login,
  getInitializedAuthState,
  logout,
  setToken as token,
  getCurrentToken as getToken,
} from 'store/authSlice'
import { UserDetail } from 'api/user/getUserDetail'

export default function useAuth() {
  const dispatch = useDispatch()

  const setUserLogin = (userData: UserDetail) => {
    dispatch(login(userData))
  }

  const getCurrentUser = () => getInitializedAuthState()

  const removeUserLogin = () => {
    dispatch(logout())
  }

  const setToken = (tokenData: AuthData) => {
    dispatch(token(tokenData))
  }

  const getCurrentToken = () => getToken()

  return { setUserLogin, getCurrentUser, removeUserLogin, setToken, getCurrentToken }
}
