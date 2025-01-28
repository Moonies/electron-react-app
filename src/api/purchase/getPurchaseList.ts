import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { mockData } from './_mockdata'
import { PurchaseStatus } from '.'
import { HttpRequest } from 'hooks/useHttp'
export interface SearchCriteria {
  category: string
  keyword: string
  startDate: string
  endDate: string
  page?: number
  pageSize?: number
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
type OwnerList = {
  id: string
  name: string
}
export interface PurchaseData {
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
  planDeliveryDate: string | Dayjs
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

//for implement case only when apprved should be remove it
function chunkArray(mockdata: PurchaseData[], pageSize: number, page: number) {
  const result = []
  for (let i = 0; i < mockdata.length; i += pageSize) {
    result.push(mockdata.slice(i, i + pageSize))
  }
  return result[page]
}

export default async function getPurchaseList(
  httpRequest: HttpRequest,
  { category, keyword, startDate, endDate, page = 0, pageSize = 10, dateType }: SearchCriteria
): Promise<ApiResponse<PurchaseData[]>> {
  //for beta:test
  const response = await httpRequest(() =>
    dateType && dateType !== ''
      ? axiosInstance.get(
          `/api/purchases?status.equal=COMPLETED&${category}.contains=${keyword}&${dateType}.from=${startDate}&${dateType}.to=${endDate}&page=${page}&size=${pageSize}`
        )
      : axiosInstance.get(
          `/api/purchases?status.equal=COMPLETED&${category}.contains=${keyword}&page=${page}&size=${pageSize}`
        )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content, page: response?.data.page }
}
