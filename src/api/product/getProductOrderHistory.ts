import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { mockdata } from './_mockdata'
import { ComponentData } from 'api/component/getComponentList'
import { HttpRequest } from 'hooks/useHttp'

type OwnerDetail = {
  id: string
  name: string
}
type CompanyDetail = {
  id: string
  companyCode: string
  companyInfo: {
    name: string
    productNumber: string
    email: string
    fax?: string
  }
}
type ProductDetail = {
  id: string
  name: string
  number: string
  price: number
  quantity: number
}
export type OrderHistory = {
  id: string
  orderCode: string
  saleCode: string
  company: CompanyDetail
  quantity: number
  shipmentDate: string
  owners: OwnerDetail[]
  products: ProductDetail[]
  memo?: string
}

export default async function getProductOrderHistory(
  httpRequest: HttpRequest,
  productId: string
): Promise<ApiResponse<OrderHistory[]>> {
  //current version is support 100 lasted
  const response = await httpRequest(() =>
    axiosInstance.get(
      `/api/sales?status.equal=COMPLETED&size=100&products.id.equal=${productId}?sort=shipmentDate,asc`
    )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
