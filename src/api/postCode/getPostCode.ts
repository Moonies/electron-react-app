import axios from 'axios'
import { ApiResponse } from 'api'

export interface SearchPostCodeProps {
  postCode: string
}

export interface AddressData {
  postCode: string
  prefecture: string
  city: number
}

export default async function getPostCode(postCode: SearchPostCodeProps): Promise<ApiResponse<{}>> {
  //for beta:test
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
