import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse, axiosInstance } from 'api'
import axios from 'axios'
import { PurchaseStatus } from 'api/purchase'

export default async function updatePurchaseStatus(
  httpRequest: HttpRequest,
  purchaseId: string,
  status: PurchaseStatus
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() =>
    axiosInstance.patch(`/api/purchases/${purchaseId}/${status}`)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
