import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'

export interface RoleData {
  id: string
  name: string
  label: string
}

export default async function getRoleList(): Promise<ApiResponse<RoleData[]>> {
  // when use real API
  try {
    const response = await axiosInstance.get('/api/roles')
    return { code: 200, message: 'success', data: response.data.content }
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
