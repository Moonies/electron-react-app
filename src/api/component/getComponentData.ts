import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'
import { mockData } from './_mockdata'

export interface ComponentData {
  id: string
  componentNumber: string
  componentName: string
  price: number
}

export default async function getComponentData(
  query: string
): Promise<ApiResponse<ComponentData[]>> {
  //for beta:test
  //use props query to filter in component
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: mockData,
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
