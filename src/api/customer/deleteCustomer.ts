import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

export default async function deleteCustomer(
  httpRequest: HttpRequest,
  customerId: string
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.delete('/api/companies/' + customerId))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
