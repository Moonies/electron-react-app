import { axiosInstance, ApiResponse } from 'api'
import { AuthData } from './checkAuth'
import { HttpRequest } from 'hooks/useHttp'
import axios from 'axios'

export default async function getNewToken(
  username: string,
  refreshToken: string
): Promise<ApiResponse<AuthData>> {
  // when use real API
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
  try {
    const response = await axios.post(`http://${parsedConfig.baseUrl}/api/auth/refresh`, {
      username,
      refreshToken,
    })
    // const response = await axios.post(`http://${parsedConfig.baseUrl}/api/auth/login`, {
    //   username,
    //   password,
    // })

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

  // return { code: 200, message: 'success', data: response?.data }
  // try {
  //   const response = await axiosInstance.post('/api/auth/refresh', { username, refreshToken })
  //   return { code: 200, message: 'success', data: response.data }
  // } catch (error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     return {
  //       code: error.response.status,
  //       message: error.response.data.message || 'An error occurred during authentication',
  //       data: null,
  //     }
  //   }
  //   return {
  //     code: 500,
  //     message: 'An unexpected error occurred',
  //     data: null,
  //   }
  // }
}
