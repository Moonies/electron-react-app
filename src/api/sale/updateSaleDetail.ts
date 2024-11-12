import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

type ProductDetail = {
  name: string
  number: string
  price: number
  quantity: number
}
type OwnerDetail = {
  id: string
  name: string
}
export interface NewSaleDetailProps {
  id: string
  orderCode: string
  totalAmount: number
  registrationDate: string
  invoiceNumber: string
  memo?: string
  saleCode: string
  // deliveryDate: string
  // remainingOrder: number
  // allocation: string
  // quotationDate: string
  // billingDate: string
  shipmentDate: string
  products: ProductDetail[]
  owners: OwnerDetail[]
  companyId: string
}

export default async function updatePurchaseDetail(
  httpRequest: HttpRequest,
  newSaleDetail: NewSaleDetailProps
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.put('/api/sales', { ...newSaleDetail }))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
