import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { OrderStatus, OrderType } from 'api/order'
import { HttpRequest } from 'hooks/useHttp'

export interface PurchaseOrderSearchCriteria {
  category: string
  keyword?: string
  startDate: string
  endDate: string
  pageSize?: number
  status?: `${OrderStatus}` | string
  dateType?: string
}

type ComponentList = {
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
export interface PurchaseOrderData {
  id: string
  company: CompanyDetail
  orderCode: string
  registrationDate: string
  deliveryDate: string | Dayjs
  invoiceNumber: string
  memo: string
  status: string
  orderType: string
  purchaseCode: string
  components: ComponentList[]
  owners: {
    id: string
    name: string
  }[]
}

export default async function getPurchaseOrderList(
  httpRequest: HttpRequest,
  {
    category,
    keyword,
    startDate,
    endDate,
    status = '',
    pageSize = 10,
    dateType,
  }: PurchaseOrderSearchCriteria
): Promise<ApiResponse<PurchaseOrderData[]>> {
  const response = await httpRequest(() =>
    dateType && dateType !== ''
      ? axiosInstance.get(
          `/api/purchases?${category}.contains=${keyword}&status.contains=${status}&${dateType}.from=${startDate}&${dateType}.to=${endDate}&size=${pageSize}`
        )
      : axiosInstance.get(
          `/api/purchases?${category}.contains=${keyword}&status.contains=${status}&status.notEqual=COMPLETED&size=${pageSize}`
        )
  )

  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content, page: response?.data.page }
}
