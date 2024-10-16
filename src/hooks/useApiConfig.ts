import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/index'
import { setConfig, clearConfig } from 'store/apiConfigSlice'

export interface ApiConfig {
  baseUrl: string
  apiKey?: string
}

export default function useApiConfig() {
  const dispatch = useDispatch()
  const { config } = useSelector((state: RootState) => state.apiConfig)

  const updateConfig = (newConfig: ApiConfig) => {
    dispatch(setConfig(newConfig))
    // localStorage.setItem('apiConfig', JSON.stringify(newConfig))
  }

  const resetConfig = () => {
    dispatch(clearConfig())
  }

  const loadConfig = () => {
    const storedConfig = localStorage.getItem('apiConfig')
    if (storedConfig && storedConfig !== null) {
      const parsedConfig = JSON.parse(storedConfig)
      dispatch(setConfig(parsedConfig))
      return true
    }
    return false
  }

  const isConfigSet = () => {
    return !!config && !!config.baseUrl
  }

  return {
    config,
    updateConfig,
    resetConfig,
    loadConfig,
    isConfigSet,
  }
}
