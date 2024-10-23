import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { AuthData } from './checkAuth'

// export interface AuthData {
//   token: string
//   refreshToken: string
// }

export default async function getNewToken(
  username: string,
  refreshToken: string
): Promise<ApiResponse<AuthData>> {
  // when use real API
  try {
    const response = await axiosInstance.post('/api/auth/login', { username, refreshToken })
    return { code: 200, message: 'success', data: response.data }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        code: error.response.status,
        message: error.response.data.message || 'An error occurred during authentication',
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
