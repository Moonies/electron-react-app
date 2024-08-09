import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import loadingReducer from './loadingSlice'
import notificationReducer from './notificationSlice'
import apiConfigReducer from './apiConfigSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    notification: notificationReducer,
    apiConfig: apiConfigReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
