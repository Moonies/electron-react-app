import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ApiConfig {
  baseUrl: string
  apiKey?: string
}

interface ApiConfigState {
  config: ApiConfig | null
}

const initialState: ApiConfigState = {
  config: null,
}

const apiConfigSlice = createSlice({
  name: 'apiConfig',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ApiConfig>) => {
      state.config = action.payload
      localStorage.setItem('apiConfig', JSON.stringify(action.payload))
    },
    clearConfig: state => {
      state.config = null
      localStorage.removeItem('apiConfig')
    },
  },
})
export const { setConfig, clearConfig } = apiConfigSlice.actions
export default apiConfigSlice.reducer
