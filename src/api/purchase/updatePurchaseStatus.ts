import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse, axiosInstance } from 'api'
import axios from 'axios'
import { PurchaseStatus } from '.'

export default async function updatePurchaseStatus(
  httpRequest: HttpRequest,
  purchaseId: string,
  status: PurchaseStatus
): Promise<ApiResponse<{}>> {
  let urlStatus: string
  switch (status) {
    case PurchaseStatus.CONFIRM:
      urlStatus = 'CONFIRM'
      break
    case PurchaseStatus.ON_DELIVERY:
      urlStatus = 'SHIP'
      break
    case PurchaseStatus.DELIVERED:
      urlStatus = 'COMPLETE'
      break
  }
  const response = await httpRequest(() =>
    axiosInstance.patch(`/api/purchases/${purchaseId}/${urlStatus}`)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
