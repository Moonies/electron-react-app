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
export type ComponentList = {
  id: string
  componentNumber: string
  componentName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}
export interface PurchaseData {
  purchaseId: string
  invoiceNumber: string
  supplierCompanyId: string
  supplierCompanyName: string
  component: ComponentList[]
  orderRequestEmployeeId: string
  orderRequestEmployeeName: string
  orderApprovedEmployeeId: string
  orderApprovedEmployeeName: string
  quotationRequestDate: string | dayjs.Dayjs
  purchaseApprovedDate: string | dayjs.Dayjs
  purchaseReciptDate: string | dayjs.Dayjs
  status: string | null

  //newData
  // deliveryDate :Dayjs | string
  // orderApprovalDate :Dayjs | string
  // orderApprovalPendingDate :Dayjs | string
  // orderCode : string
  // purchaseCode: string
  // registrationDate :Dayjs | string
  // stockApprovalDate: Dayjs | string
  // stockApprovalPendingDate: Dayjs | string
  // totalAmount : number
  // companyId: number
  // id :number
  // memo : string
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
          `/api/purchases?status.equal=COMPLETED&${category}.contains=${keyword}&${dateType}.from=${startDate}&${dateType}.to=${endDate}`
        )
      : axiosInstance.get(`/api/purchases?status.equal=COMPLETED&${category}.contains=${keyword}`)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content, page: response?.data.page }
  // when use real API
  // try {
  //     const response = await axios.post<ApiResponse<AuthData>>('/api/auth', { username, password });
  //     return response.data;
  // } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //         return {
  //             code: error.response.status,
  //             message: error.response.data.message || 'An error occurred during authentication',
  //             data: null
  //         };
  //     }
  //     return {
  //         code: 500,
  //         message: 'An unexpected error occurred',
  //         data: null
  //     };
  // }
}
