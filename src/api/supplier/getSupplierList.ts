import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'

export interface SupplierData {
  id: string
  customerName: string
  closeingDay: string | dayjs.Dayjs
  phoneNumber: string
  postalCode: string
  prefecture: string
  city: string
  street: string
  buildingName: string
  paymentDueDate: string | dayjs.Dayjs
  email: string
}

export default async function getSupplierList(): Promise<ApiResponse<SupplierData[]>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: [
      {
        customerName: '㈲エスユー',
        email: 'Anastasia_McGlynn@example.com',
        phoneNumber: '631.358.0516 x4835',
        street: '798 Abbott Manor',
        city: 'Bloomington',
        postalCode: '13315-3600',
        id: 'ss01',
        buildingName: '',
        paymentDueDate: '',
        closeingDay: '',
        prefecture: '',
      },
      {
        customerName: '京都帝酸㈱',
        email: 'Jeanie.Fritsch-Gerhold@example.com',
        phoneNumber: '736.214.3844 x30389',
        street: '77355 Joan Ford',
        city: 'Donnellychester',
        postalCode: '81709',
        id: '42b3a0d8-a6ac-4e47-baff-e0c1b6a5dc15',
        buildingName: '',
        paymentDueDate: '',
        closeingDay: '',
        prefecture: '',
      },
      {
        customerName: '㈱タキノ工業所',
        email: 'Frances63@gmail.com',
        phoneNumber: '754.624.2886 x63507',
        street: '31270 Mona Cove',
        city: 'Nienowmouth',
        postalCode: '33605',
        id: 'ss02',
        buildingName: '',
        paymentDueDate: '',
        closeingDay: '',
        prefecture: '',
      },
      {
        customerName: '㈲フジイ精密工業',
        email: 'Justine4@example.com',
        phoneNumber: '(324) 453-4660 x2611',
        street: '403 McClure Village',
        city: 'Kiehnfort',
        postalCode: '23134-2161',
        id: 'sb01',
        buildingName: '',
        paymentDueDate: '',
        closeingDay: '',
        prefecture: '',
      },
      {
        customerName: '福岡計測工業㈲',
        email: 'Ruthe.Gutmann@gmail.com',
        phoneNumber: '644-667-3041 x7722',
        street: '43756 3rd Avenue',
        city: 'Cristianton',
        postalCode: '89109',
        id: 'sc11',
        buildingName: '',
        paymentDueDate: '',
        closeingDay: '',
        prefecture: '',
      },
    ],
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
