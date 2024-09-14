import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import dayjs from 'dayjs'

export interface AddNewSupplierProps {
  // customerName: string
  // closeingDay: string | dayjs.Dayjs
  // phoneNumber: string
  // postalCode: string
  // prefecture: string
  // city: string
  // street: string
  // buildingName: string
  // paymentDueDate: string | dayjs.Dayjs
  // email: string
  closingDay: string
  paymentDeadline: string
  city: string
  companyCode: string
  companyType: string
  email: string
  fax?: string
  name: string
  phoneNumber: string
  postalCode: string
  prefecture: string
  streetAddress: string
  buildingName?: string
}

export default async function addNewSupplier({}: AddNewSupplierProps): Promise<ApiResponse<null>> {
  // when use real API
  // try {
  //   const response = await axiosInstance.get<ApiResponse<UserData[]>>('/api/supplier')
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
  return new Promise<ApiResponse<null>>((resolve, reject) => {
    setTimeout(() => {
      //test only
      resolve({ code: 200, message: 'success', data: null })

      //   // reject(new Error('Invalid credentials'))
      // }
    }, 1000)
  })
}
