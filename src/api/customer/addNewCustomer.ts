import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

export interface AddNewCustomerProps {
  companyCode: string
  companyType: string
  companyInfo: {
    name: string
    buildingName: string
    address: {
      streetAddress: string
      city: string
      prefecture: string
      postalCode: string
    }
    phoneNumber: string
    email: string
    fax?: string
  }
  // closingDay: string
  // paymentDeadline: string | Dayjs
}

export default async function addNewCustomer(
  httpRequest: HttpRequest,
  data: AddNewCustomerProps
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.post('/api/companies', { ...data }))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
  // when use real API
  // try {
  //   const response = await axiosInstance.post('/api/companies', { ...data })
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
  // return new Promise<ApiResponse<null>>((resolve, reject) => {
  //   setTimeout(() => {
  //     //test only
  //     resolve({ code: 200, message: 'success', data: null })

  //     //   // reject(new Error('Invalid credentials'))
  //     // }
  //   }, 1000)
  // })
}
