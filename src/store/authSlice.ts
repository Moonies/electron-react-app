import { PaletteOptions } from '@mui/material'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthData } from 'api/user/checkAuth'

interface AuthState {
  isAuthenticated: boolean
  user: any | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
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
  },
})
// Custom action creator to get the initialized auth state
export const getInitializedAuthState = (): AuthData | null => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? (JSON.parse(storedUser) as AuthData) : null
}

export const { login, logout } = authSlice.actions

export default authSlice.reducer
