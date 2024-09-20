import axios from 'axios'
import { ApiResponse } from 'api'
import { mockdata } from './_mockdata'
import dayjs from 'dayjs'

export interface SearchCriteriaProductList {
  category: string
  keyword: string
}

export type ComponentDetail = {
  id: string
  componentNumber: string
  componentName: string
  unitPrice: number
  quantity: number
}
export interface ProductData {
  productId: string
  productName: string
  stockQuantity: number
  productCost: number
  productPrice: number
  productUnit: string
  component: ComponentDetail[]
}

export default async function getProductList(
  criteria: SearchCriteriaProductList
): Promise<ApiResponse<{ data: ProductData[] }>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: {
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
