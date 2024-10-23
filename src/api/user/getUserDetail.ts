import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { executeApi } from 'api/executeApi'

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
  username: string,
  password: string
): Promise<ApiResponse<UserDetail>> {
  const response = await executeApi(() =>
    axiosInstance.get('/api/users?username.equal=' + username)
  )
  if (response) {
    return { code: 200, message: 'success', data: response.content[0] }
  }
  return {
    code: 500,
    message: 'Failed to add user: Invalid or no data received',
    data: null,
  }
}

// export default async function getUserDetail(
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
