import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { OrderStatus, OrderType } from 'api/order'
import { HttpRequest } from 'hooks/useHttp'

export interface SaleOrderSearchCriteria {
  category: string
  keyword?: string
  startDate: string
  endDate: string
  page?: number
  pageSize?: number
  status?: `${OrderStatus}` | string
  dateType?: string
}

type ProductDetail = {
  name: string
  number: string
  price: number
  quantity: number
}
type CompanyDetail = {
  id: string
  companyCode: string
  companyType: string
  companyInfo: {
    name: string
    buildingName: string
    address: {
      streetAddress: string
      city: string
      prefecture: string
      postalCode: string
    }
    phoneNumber: string
    email: string
    fax: string
  }
}
export interface SaleOrderData {
  id: string
  company: CompanyDetail
  orderCode: string
  registrationDate: string
  deliveryDate: string | Dayjs
  shipmentDate: string | Dayjs
  invoiceNumber: string
  memo: string
  status: string
  orderType: string
  saleCode: string
  products: ProductDetail[]
  owners: {
    id: string
    name: string
  }[]
}

export default async function getSaleOrderList(
  httpRequest: HttpRequest,
  {
    category,
    keyword,
    startDate,
    endDate,
    status = '',
    page = 0,
    pageSize = 10,
    dateType,
  }: SaleOrderSearchCriteria
): Promise<ApiResponse<SaleOrderData[]>> {
  const response = await httpRequest(() =>
    dateType && dateType !== ''
      ? axiosInstance.get(
          `/api/sales?${category}.contains=${keyword}&status.contains=${status}&${dateType}.from=${startDate}&${dateType}.to=${endDate}&size=${pageSize}`
        )
      : axiosInstance.get(
          `/api/sales?${category}.contains=${keyword}&status.contains=${status}&status.notEqual=COMPLETED&size=${pageSize}`
        )
  )

  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content, page: response?.data.page }
}
