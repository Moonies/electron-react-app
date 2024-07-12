import axios from 'axios'
import { ApiResponse } from 'api'
import { mockdata } from './_mockdata'
import dayjs from 'dayjs'

export interface SearchCriteria {
  category: string
  keyword: string
  startDate: Date
  endDate: Date
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
  deliveryDate: Date | string | dayjs.ConfigType
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

export default async function saleList(
  criteria: SearchCriteria
): Promise<ApiResponse<{ summary: SalesSummary; data: SalesData[] }>> {
  //for beta:test
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
      data: mockdata,
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
