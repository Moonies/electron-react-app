import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse, axiosInstance } from 'api'
import axios from 'axios'

export default async function deleteSale(
  httpRequest: HttpRequest,
  saleId: string
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.delete(`/api/sales/${saleId}`))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
