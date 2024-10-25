import { axiosInstance, ApiResponse } from 'api'
import { RoleData } from 'api/role/getRoleList'
import axios from 'axios'
import { HttpRequest } from 'hooks/useHttp'

export interface UserData {
  id: string
  username: string
  name: string
  // fullName: string
  password: string
  roleId: string
  number: string
  mail: string
  role: RoleData
}
export interface SearchCriteria {
  page?: number
  pageSize?: number
}

export default async function getUserList(
  httpRequest: HttpRequest,
  page = 0,
  pageSize = 10
): Promise<ApiResponse<UserData[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get('/api/users?page=' + page + '&size=' + pageSize)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}

// export default async function getUserList({
//   page = 0,
//   pageSize = 10,
// }: SearchCriteria): Promise<ApiResponse<UserData[]>> {
//   // when use real API
//   try {
//     const response = await axiosInstance.get('/api/users?page=' + page + '&size=' + pageSize)
//     return { code: 200, message: 'success', data: response.data.content }
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       return {
//         code: error.response.status,
//         message: error.response.data.message || 'An error occurred during authentication',
//         data: null,
//       }
//     }
//     return {
//       code: 500,
//       message: 'An unexpected error occurred',
//       data: null,
//     }
//   }
// }
