import { axiosInstance, ApiResponse } from 'api'
import axios from 'axios'
import { HttpRequest } from 'hooks/useHttp'

export default async function deleteUser(
  httpRequest: HttpRequest,
  userId: string
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.delete('/api/users/' + userId))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }

  // when use real API
  // try {
  //   const response = await axiosInstance.delete('/api/users/' + userId)
  //   return { code: 200, message: 'success', data: response.data.content }
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
