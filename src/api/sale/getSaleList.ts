import axios from 'axios'
import { ApiResponse } from 'api'
import { mockdata } from './_mockdata'
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

export interface SalesData {
  saleId: number
  invoiceNumber: number
  customerName: string
  deliveryDate: string | dayjs.Dayjs
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
function chunkArray(mockdata: SalesData[], pageSize: number, page: number) {
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
  ApiResponse<{ summary: SalesSummary; data: SalesData[]; totalRow: number }>
> {
  //for beta:test
  let newMock = chunkArray(mockdata, pageSize, page)

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
      totalRow: mockdata.length,
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
