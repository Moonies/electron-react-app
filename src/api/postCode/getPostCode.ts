import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'

export interface AddressData {
  postCode: string
  prefecture: string
  city: string
}

export default async function getPostCode(postCode: string): Promise<ApiResponse<AddressData>> {
  //for beta:test
  // await new Promise(resolve => setTimeout(resolve, 1000))
  // return {
  //   code: 200,
  //   message: 'Success',
  //   data: {},
  // }
  // when use real API
  try {
    const response = await axiosInstance.get('/api/postal-codes?postalCode.equal=' + postCode)
    return {
      code: 200,
      message: 'success',
      data: response.data._embedded.postalCodes[0] ?? undefined,
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        code: error.response.status,
        message: error.response.data.message || 'An error occurred during authentication',
        data: null,
      }
    }
    return {
      code: 500,
      message: 'An unexpected error occurred',
      data: null,
    }
  }
}
