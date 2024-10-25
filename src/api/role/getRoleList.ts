import { axiosInstance, ApiResponse } from 'api'
import axios from 'axios'
import { HttpRequest } from 'hooks/useHttp'

export interface RoleData {
  id: string
  name: string
  label: string
}

export default async function getRoleList(
  httpRequest: HttpRequest
): Promise<ApiResponse<RoleData[]>> {
  // when use real API
  const response = await httpRequest(() => axiosInstance.get('/api/roles'))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
  // try {
  //   const response = await axiosInstance.get('/api/roles')
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
