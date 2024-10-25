import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface AuthData {
  token: string
  refreshToken: string
}

export default async function checkAuth(
  // httpRequest: HttpRequest,
  username: string,
  password: string
): Promise<ApiResponse<AuthData>> {
  const storedConfig = localStorage.getItem('apiConfig')
  let parsedConfig
  if (storedConfig && storedConfig !== null) {
    parsedConfig = JSON.parse(storedConfig)
  } else {
    return {
      code: 403,
      message: 'localStorage is error or expired',
      data: null,
    }
  }
  // when use real API
  try {
    // const response = await axiosInstance.post('/api/auth/login', { username, password })
    const response = await axios.post(`http://${parsedConfig.baseUrl}/api/auth/login`, {
      username,
      password,
    })

    return { code: 200, message: 'success', data: response.data }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        code: error.response.status,
        message: error.response.data.message || 'An error occurred during authentication',
        data: null,
      }
    } else if (axios.isAxiosError(error)) {
      return {
        code: error.code ?? 500,
        message: error.message,
        data: null,
      }
    }
    return {
      code: 500,
      message: 'An unexpected error occurred',
      data: null,
    }
  }
}
