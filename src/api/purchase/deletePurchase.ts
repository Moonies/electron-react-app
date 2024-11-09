import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse, axiosInstance } from 'api'
import axios from 'axios'
import { PurchaseStatus } from '.'

export default async function deletePurchaseOrder(
  httpRequest: HttpRequest,
  purchaseId: string
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.delete(`/api/purchases/${purchaseId}`))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
