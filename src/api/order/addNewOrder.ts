import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'

export type ProductList = {
  id: string
  productNumber: string
  quantity: number
}
export interface NewOrder {
  orderId: string
  customerCompanyId: string
  product: ProductList[]
  orderRequestEmployeeId: string
  orderApprovedEmployeeId: number
  quotationRequestDate: string | dayjs.Dayjs
  registDate: string | dayjs.Dayjs
  shippingmentDate: string | dayjs.Dayjs
  paymentDueDate: string | dayjs.Dayjs
  status: string | null
}

export default async function addNewOrder(newOrder: NewOrder): Promise<ApiResponse<{}>> {
  //for beta:test
  // let newMock = chunkArray(mockData, pageSize, page)

  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: {},
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
