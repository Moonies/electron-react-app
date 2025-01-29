import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { mockData } from './_mockdata'
import { HttpRequest } from 'hooks/useHttp'
import { SaleStatus } from '.'

type ProductDetail = {
  name: string
  number: string
  price: number
  quantity: number
  useCanBeMadeInQuantity: boolean
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
type OwnerList = {
  id: string
  name: string
}
export interface SaleDetail {
  id: string
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
  company: CompanyDetail
  orderCode: string
  totalAmount: number
  registrationDate: string
  // deliveryDate: string | Dayjs
  shipmentDate: string | Dayjs
  planShipmentDate: string | Dayjs
  invoiceNumber: string
  memo: string
  status: string
  orderType: string
  saleCode: string
  quotationRequestDate: string
  orderApprovalPendingDate: null
  orderApprovalDate: string
  stockApprovalPendingDate: null
  stockApprovalDate: string
  products: ProductDetail[]
  companyId: string
  owners: OwnerList[]
}

export default async function getSaleDetail(
  httpRequest: HttpRequest,
  orderId: string
): Promise<ApiResponse<SaleDetail>> {
  //for beta:test
  const response = await httpRequest(() => axiosInstance.get('/api/sales/' + orderId))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
