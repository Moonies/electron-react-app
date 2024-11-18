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

export const getBaseUrl = (): string => {
  const storedBaseUrl = localStorage.getItem('apiConfig')
  let parsedConfig
  //end point can be change depens on user
  if (storedBaseUrl && storedBaseUrl !== null) {
    parsedConfig = JSON.parse(storedBaseUrl)
    // return `http://${parsedConfig.baseUrl}`
  }
  // return 'http://localhost:3000'
  return parsedConfig ? `http://${parsedConfig.baseUrl}` : 'http://localhost:3000'
}

export const { setConfig, clearConfig } = apiConfigSlice.actions
export default apiConfigSlice.reducer
