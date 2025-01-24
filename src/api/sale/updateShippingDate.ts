import axios from 'axios'
import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse, axiosInstance } from 'api'

export default async function updateShippingDate(
  httpRequest: HttpRequest,
  saleId: string,
  newShippingDate: string
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() =>
    axiosInstance.patch(`/api/sales/${saleId}`, { id: saleId, shipmentDate: newShippingDate })
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
