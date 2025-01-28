import axios from 'axios'
import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse, axiosInstance } from 'api'

export default async function updateDeliveryDate(
  httpRequest: HttpRequest,
  purchaseId: string,
  newDeliveryDate: string
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() =>
    axiosInstance.patch(`/api/purchases/${purchaseId}`, {
      id: purchaseId,
      deliveryDate: newDeliveryDate,
    })
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
