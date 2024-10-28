import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

export default async function deleteCustomer(
  httpRequest: HttpRequest,
  customerId: string
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.delete('/api/companies/' + customerId))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
  // when use real API
  // try {
  //   const response = await axiosInstance.delete('/api/companies/' + customerId)
  //   return { code: 200, message: 'success', data: response.data.content }
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
  // return new Promise<ApiResponse<null>>((resolve, reject) => {
  //   setTimeout(() => {
  //     //test only
  //     resolve({ code: 200, message: 'success', data: null })

  //     //   // reject(new Error('Invalid credentials'))
  //     // }
  //   }, 1000)
  // })
}
