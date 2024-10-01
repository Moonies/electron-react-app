import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'

export default async function deleteUser(userId: number): Promise<ApiResponse<{}>> {
  // when use real API
  try {
    const response = await axiosInstance.delete('/api/users/' + userId)
    return { code: 200, message: 'success', data: response.data._embedded }
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
