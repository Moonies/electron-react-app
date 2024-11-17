import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { mockdata } from './_mockdata'
import { ComponentData } from 'api/component/getComponentList'
import { HttpRequest } from 'hooks/useHttp'

export type OrderHistory = {
  id: string
  orderCode: string
  saleCode: string
  customerName: string
  company: number
  quantity: number
  deliveryDate: string
  memo?: string
}

export default async function getProductOrderHistory(
  httpRequest: HttpRequest,
  productId: string
): Promise<ApiResponse<OrderHistory[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get(`/api/sale?status.equal=COMPLETED?product.id.equal=${productId}`)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
