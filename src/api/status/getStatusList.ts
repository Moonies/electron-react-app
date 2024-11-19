import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

export type StatusDetail = {
  name: string
  label: string
  orderType: string
}
export default async function getStatusList(
  httpRequest: HttpRequest
): Promise<ApiResponse<StatusDetail[]>> {
  const response = await httpRequest(() => axiosInstance.get('/api/status'))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
