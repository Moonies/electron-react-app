import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'
import { mockData } from './_mockdata'

export interface ComponentData {
  componentNumber: string
  componentName: string
  totalAmount: number
}

export default async function getTotalAmountComponent(
  query: string
): Promise<ApiResponse<ComponentData>> {
  //for beta:test
  //use props query to filter in component
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: {
      componentNumber: 'HW327351070',
      componentName: 'STOPPER',
      totalAmount: 100,
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
