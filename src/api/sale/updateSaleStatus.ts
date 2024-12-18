import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse, axiosInstance } from 'api'
import axios from 'axios'
import { SaleStatus } from 'api/sale'

export default async function updateSaleStatus(
  httpRequest: HttpRequest,
  saleId: string,
  status: SaleStatus
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.patch(`/api/sales/${saleId}/${status}`))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
