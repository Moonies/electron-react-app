import { axiosInstance, ApiResponse } from 'api'
import axios from 'axios'
import { HttpRequest } from 'hooks/useHttp'

export interface UserDetail {
  id: string
  mail: string
  name: string
  number: string
  role: {
    name: string
    label: string
  }
  username: string
  // password: string
}

export default async function getUserDetail(
  httpRequest: HttpRequest,
  username: string
  // password: string
): Promise<ApiResponse<UserDetail>> {
  const response = await httpRequest(() =>
    axiosInstance.get('/api/users?username.equal=' + username)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content[0] }
}

// export default async function getUserDetail(
//   httpRequest: HttpRequest,
//   username: string,
//   password: string
// ): Promise<ApiResponse<UserDetail>> {
//   // when use real API
//   try {
//     const response = await axiosInstance.get('/api/users?username.equal=' + username)
//     return { code: 200, message: 'success', data: response.data.content[0] }
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
