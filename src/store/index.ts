import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import loadingReducer from './loadingSlice'
import notificationReducer from './notificationSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    notification: notificationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
