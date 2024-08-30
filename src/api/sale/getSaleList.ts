import axios from 'axios'
import { ApiResponse } from 'api'
import { mockData } from './_mockdata'
import dayjs from 'dayjs'

export interface SearchCriteria {
  category: string
  keyword: string
  startDate: Date
  endDate: Date
  page?: number
  pageSize?: number
}
export interface SalesSummary {
  totalSales: number
  averageOrderValue: number
  topSellingProduct: string
}
export type ProductList = {
  id: string
  productNumber: string
  productName: string
  quantity: number
  productPrice: number
  totalPrice: number
}
export interface SaleData {
  id: string
  orderId: string
  customerCompanyId: string
  customerCompanyName: string
  product: ProductList[]
  orderRequestEmployeeId: string
  orderRequestEmployeeName: string
  orderApprovedEmployeeId: string
  orderApprovedEmployeeName: string
  quotationRequestDate: string | dayjs.Dayjs
  registDate: string | dayjs.Dayjs
  shippingmentDate: string | dayjs.Dayjs
  paymentDueDate: string | dayjs.Dayjs
  status: string | null
}
//for implement case only when apprved should be remove it
function chunkArray(mockdata: SaleData[], pageSize: number, page: number) {
  const result = []
  for (let i = 0; i < mockdata.length; i += pageSize) {
    result.push(mockdata.slice(i, i + pageSize))
  }
  return result[page]
}

export default async function getSaleList({
  category,
  keyword,
  startDate,
  endDate,
  page = 0,
  pageSize = 10,
}: SearchCriteria): Promise<
  ApiResponse<{ summary: SalesSummary; data: SaleData[]; totalRow: number }>
> {
  //for beta:test
  let newMock = chunkArray(mockData, pageSize, page)

  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: {
      summary: {
        totalSales: 10000,
        averageOrderValue: 100,
        topSellingProduct: 'Product A',
      },
      data: newMock,
      totalRow: mockData.length,
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
