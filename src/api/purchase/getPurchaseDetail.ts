import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { mockData } from './_mockdata'
import { PurchaseStatus } from 'api/purchase'
import { HttpRequest } from 'hooks/useHttp'
export interface SearchCriteria {
  category: string
  keyword: string
  startDate: string
  endDate: string
  page?: number
  pageSize?: number
  status: `${PurchaseStatus}` | null
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
type OwnerList = {
  id: string
  name: string
}
export interface PurchaseDetail {
  id: string
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
  company: CompanyDetail
  orderCode: string
  totalAmount: number
  registrationDate: string
  deliveryDate: string | Dayjs
  invoiceNumber: string
  memo: string
  status: string
  orderType: string
  purchaseCode: string
  quotationRequestDate: string
  orderApprovalPendingDate: null
  orderApprovalDate: string
  stockApprovalPendingDate: null
  stockApprovalDate: string
  components: ComponentList[]
  companyId: string
  owners: OwnerList[]
}

export default async function getPurchaseDetail(
  httpRequest: HttpRequest,
  orderId: string
): Promise<ApiResponse<PurchaseDetail>> {
  //for beta:test
  const response = await httpRequest(() => axiosInstance.get('/api/purchases/' + orderId))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
