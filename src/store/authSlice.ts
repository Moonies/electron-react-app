import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthData } from 'api/user/checkAuth'
import { UserDetail } from 'api/user/getUserDetail'

interface AuthState {
  isAuthenticated: boolean
  user: any | null
  token: string
  refreshToken: string
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  refreshToken: '',
  token: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    logout: state => {
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem('user')
    },
    setToken: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true
      localStorage.setItem('token', JSON.stringify(action.payload))
    },
  },
})
// Custom action creator to get the initialized auth state
export const getInitializedAuthState = (): UserDetail | null => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? (JSON.parse(storedUser) as UserDetail) : null
}

export const getCurrentToken = (): AuthData | null => {
  const storedToken = localStorage.getItem('token')
  return storedToken ? (JSON.parse(storedToken) as AuthData) : null
}

export const { login, logout, setToken } = authSlice.actions

export default authSlice.reducer
