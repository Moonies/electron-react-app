import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse, axiosInstance } from 'api'
import axios from 'axios'
import { SaleStatus } from '.'

export default async function updateSaleStatus(
  httpRequest: HttpRequest,
  saleId: string,
  status: SaleStatus
): Promise<ApiResponse<{}>> {
  let urlStatus: string
  switch (status) {
    case SaleStatus.CONFIRM:
      urlStatus = 'CONFIRM'
      break
    case SaleStatus.ON_DELIVERY:
      urlStatus = 'SHIP'
      break
    case SaleStatus.DELIVERED:
      urlStatus = 'COMPLETE'
      break
  }
  const response = await httpRequest(() => axiosInstance.patch(`/api/sales/${saleId}/${urlStatus}`))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
