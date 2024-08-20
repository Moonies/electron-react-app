import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'
import { OrderStatus } from '.'
import { mockData } from './_mockdata'
// import { PurchaseStatus } from '.'
// export type OrderStatus = 'DELIVERED' | 'CANCEL' | 'PENDING' | 'SHIPPING' | 'OVERDUEDATE' | 'ALL'
export interface SearchCriteria {
  category: string
  keyword: string
  startDate: Date
  endDate: Date
  page?: number
  pageSize?: number
  status: `${OrderStatus}` | null
}

// export type OrderStatusType = `${OrderStatus}`;

export interface OrderData {
  orderId: string
  invoiceNumber: string
  customerCompanyId: string
  customerCompanyName: string
  productNumber: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  orderRequestEmployeeName: string
  orderApprovedEmployeeName: string
  quotationRequestDate: string | dayjs.Dayjs
  registDate: string | dayjs.Dayjs
  shippingmentDate: string | dayjs.Dayjs
  paymentDueDate: string | dayjs.Dayjs
  status: string | null
}
//for implement case only when apprved should be remove it
function chunkArray(mockdata: OrderData[], pageSize: number, page: number) {
  const result = []
  for (let i = 0; i < mockdata.length; i += pageSize) {
    result.push(mockdata.slice(i, i + pageSize))
  }
  return result[page]
}

export default async function getOrderList({
  category,
  keyword,
  startDate,
  endDate,
  page = 0,
  pageSize = 10,
}: SearchCriteria): Promise<ApiResponse<{ data: OrderData[]; totalRow: number }>> {
  //for beta:test
  // let newMock = chunkArray(mockData, pageSize, page)

  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: {
      data: mockData,
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
