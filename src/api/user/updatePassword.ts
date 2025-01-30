import { axiosInstance, ApiResponse } from 'api'
import axios from 'axios'
import { HttpRequest } from 'hooks/useHttp'

export interface UpdatePasswordData {
  username: string
  password: string
  rePasswordCode: string
}

export default async function updatePassword(
  httpRequest: HttpRequest,
  { username, password, rePasswordCode }: UpdatePasswordData
): Promise<ApiResponse<{}>> {
  // when use real API
  const response = await httpRequest(() =>
    axiosInstance.put('/api/users/update-password', {
      username: username,
      newPassword: password,
      resetPassword: rePasswordCode,
    })
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
