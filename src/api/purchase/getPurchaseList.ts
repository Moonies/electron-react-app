import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'

export interface SearchCriteria {
  category: string
  keyword: string
  startDate: Date
  endDate: Date
  page?: number
  pageSize?: number
}

export interface PurchaseData {
  purchaseId: number
  invoiceNumber: number
  supplierCompanyId: string
  supplierCompanyName: string
  quatationRequestDate: string | dayjs.Dayjs
  productId: string
  productName: string
  // 注番: string
  quantity: number
  unitPrice: number
  totalPrice: number
  // ｵｰﾀﾞｰ: string
  employeeName: string
  orderApprovedEmployee: string
  orderId: number
}
//for implement case only when apprved should be remove it
function chunkArray(mockdata: PurchaseData[], pageSize: number, page: number) {
  const result = []
  for (let i = 0; i < mockdata.length; i += pageSize) {
    result.push(mockdata.slice(i, i + pageSize))
  }
  return result[page]
}

export default async function getPurchaseList({
  category,
  keyword,
  startDate,
  endDate,
  page = 0,
  pageSize = 10,
}: SearchCriteria): Promise<ApiResponse<{ data: PurchaseData[]; totalRow: number }>> {
  //for beta:test
  // let newMock = chunkArray(mockdata, pageSize, page)

  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: {
      data: [],
      totalRow: 0,
    },
  }
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
