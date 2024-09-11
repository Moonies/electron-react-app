import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { mockData } from './_mockSealData'
export interface MyCompnaSeal {
  seal: string
}
export default async function getMyCompanySeal(): Promise<ApiResponse<MyCompnaSeal>> {
  // when use real API
  // try {
  //   const response = await axiosInstance.get<ApiResponse<UserData[]>>('/api/users')
  //   return { code: 200, message: 'success', data: response.data.data }
  // } catch (error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     return {
  //       code: error.response.status,
  //       message: error.response.data.message || 'An error occurred during authentication',
  //       data: null,
  //     }
  //   }
  //   return {
  //     code: 500,
  //     message: 'An unexpected error occurred',
  //     data: null,
  //   }
  // }

  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: { seal: mockData },
  }
}
