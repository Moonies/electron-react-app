import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'

export type PurchaseOrderDetail = {
  orderId: string
  orderNumber: string
  customerId: string
  customerNumber: string
  customerName: string
  price: number
  quantity: number
  orderDate: string
  receivedDate: string
  memo?: string
}
export interface ComponentData {
  id: string
  purchaseOrderList: PurchaseOrderDetail[]
}

export default async function getComponentDetail(
  componentId: string
): Promise<ApiResponse<ComponentData>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: {
      id: '157143',
      purchaseOrderList: [
        {
          orderId: '1',
          orderNumber: '2305542',
          customerId: '9998',
          customerNumber: '9998',
          customerName: '諸口',
          price: 6000,
          quantity: 5,
          orderDate: '2024/05/05',
          receivedDate: '2024/05/07',
          memo: 'quantity > 3, prices down 10%',
        },
        {
          orderId: '5',
          orderNumber: '2305559',
          customerId: '9998',
          customerNumber: '9998',
          customerName: '諸口',
          price: 6818,
          quantity: 1,
          orderDate: '2024/06/05',
          receivedDate: '2024/06/07',
          memo: 'different memo test',
        },
        {
          orderId: '42',
          orderNumber: '2306064',
          customerId: '9998',
          customerNumber: '9998',
          customerName: '諸口',
          price: 6818,
          quantity: 1,
          orderDate: '2024/06/05',
          receivedDate: '2024/06/07',
        },
      ],
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
