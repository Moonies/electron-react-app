import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

type ProductDetail = {
  name: string
  number: string
  price: number
  quantity: number
  useCanBeMadeInQuantity: boolean
}

type OwnerDetail = {
  id: string
  name: string
}
export type AddNewSaleOrderProps = {
  orderCode: string
  totalAmount: number
  registrationDate: string
  invoiceNumber: string
  memo?: string
  saleCode: string
  // remainingOrder: number
  // allocation: string
  // quotationDate: string
  // billingDate: string
  planShipmentDate: string
  // shipmentDate: string
  products: ProductDetail[]
  owners: OwnerDetail[]
  companyId: string
}

export default async function addNewSaleOrder(
  httpRequest: HttpRequest,
  newSaleOrder: AddNewSaleOrderProps
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.post('/api/sales', { ...newSaleOrder }))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
