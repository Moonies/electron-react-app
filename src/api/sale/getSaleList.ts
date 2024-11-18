import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

export interface SearchCriteria {
  category: string
  keyword: string
  startDate: string | Dayjs
  endDate: string | Dayjs
  page?: number
  pageSize?: number
  dateType: string
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
export interface SalesSummary {
  totalSales: number
  averageOrderValue: number
  topSellingProduct: string
}
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
export interface SaleData {
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
  shipmentDate: string | Dayjs
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
  owners: OwnerDetail[]
}

export default async function getSaleList(
  httpRequest: HttpRequest,
  { category, keyword, startDate, endDate, page = 0, pageSize = 10, dateType }: SearchCriteria
): Promise<ApiResponse<SaleData[]>> {
  //for beta:test
  // let newMock = chunkArray(mockData, pageSize, page)

  const response = await httpRequest(() =>
    dateType && dateType !== ''
      ? axiosInstance.get(
          `/api/sales?status.equal=COMPLETED&${category}.contains=${keyword}&${dateType}.from=${startDate}&${dateType}.to=${endDate}&page=${page}&size=${pageSize}`
        )
      : axiosInstance.get(
          `/api/sales?status.equal=COMPLETED&${category}.contains=${keyword}&page=${page}&size=${pageSize}`
        )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content, page: response?.data.page }
}
