import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'

export interface CustomerDetailData {
  id: string
  customerName: string
  closeingDay: string | dayjs.Dayjs
  phoneNumber: string
  postalCode: string
  addressCode: string
  prefecture: string
  city: string
  street: string
  buildingName: string
  fullAddress?: string
  paymentDueDate: string | dayjs.Dayjs
  email: string
  faxNumber: string | null
}

export default async function GetCustomerDetailById(
  customerId: string
): Promise<ApiResponse<CustomerDetailData>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: {
      customerName: '㈱アーキテクト・笹原',
      email: 'Anastasia_McGlynn@example.com',
      phoneNumber: '075-644-4431',
      street: '竹田浄菩提院町',
      addressCode: '226番地',
      city: '伏見区',
      postalCode: '612-8445',
      id: '0060',
      buildingName: '',
      paymentDueDate: '',
      closeingDay: '',
      prefecture: '京都市',
      faxNumber: '075-644-4531',
      fullAddress: '京都市伏見区竹田浄菩提院町226番地,',
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
