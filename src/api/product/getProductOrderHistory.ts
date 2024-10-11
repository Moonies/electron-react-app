import axios from 'axios'
import { ApiResponse } from 'api'
import { mockdata } from './_mockdata'
import { ComponentData } from 'api/component/getComponentList'

export type orderHistory = {
  id: string
  orderNumber: string
  customerName: string
  price: number
  quantity: number
  orderDate: string
  memo?: string
}

export default async function getProductOrderHistory(
  productId: string
): Promise<ApiResponse<orderHistory[]>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: [
      {
        id: '1',
        orderNumber: '2305542',
        // customerId: '9998',
        // customerNumber: '9998',
        customerName: '諸口',
        price: 6000,
        quantity: 5,
        orderDate: '2024/05/05',
        // receivedDate: '2024/05/07',
        memo: 'quantity > 3, prices down 10%',
      },
      {
        id: '5',
        orderNumber: '2305559',
        // customerId: '9998',
        // customerNumber: '9998',
        customerName: '諸口',
        price: 6818,
        quantity: 1,
        orderDate: '2024/06/05',
        // receivedDate: '2024/06/07',
        memo: 'different memo test',
      },
      {
        id: '42',
        orderNumber: '2306064',
        // customerId: '9998',
        // customerNumber: '9998',
        customerName: '諸口',
        price: 6818,
        quantity: 1,
        orderDate: '2024/06/05',
        // receivedDate: '2024/06/07',
      },
    ],
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
