import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'

export interface SupplierData {
  // id: string
  // customerName: string
  // closingDay: string | dayjs.Dayjs
  // phoneNumber: string
  // postalCode: string
  // prefecture: string
  // city: string
  // street: string
  // buildingName: string
  // paymentDeadline: string | dayjs.Dayjs
  // email: string
  closingDay: string
  paymentDeadline: string
  id: number
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

export default async function getSupplierList(): Promise<ApiResponse<SupplierData[]>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: [
      {
        id: 0,
        name: '㈲エスユー',
        email: 'Anastasia_McGlynn@example.com',
        phoneNumber: '631.358.0516 x4835',
        streetAddress: '798 Abbott Manor',
        city: 'Bloomington',
        postalCode: '13315-3600',
        companyCode: 'ss01',
        buildingName: '',
        paymentDeadline: '',
        closingDay: '',
        prefecture: '',
        companyType: '',
      },
      {
        id: 1,
        name: '京都帝酸㈱',
        email: 'Jeanie.Fritsch-Gerhold@example.com',
        phoneNumber: '736.214.3844 x30389',
        streetAddress: '77355 Joan Ford',
        city: 'Donnellychester',
        postalCode: '81709',
        companyCode: '42b3a0d8-a6ac-4e47-baff-e0c1b6a5dc15',
        buildingName: '',
        paymentDeadline: '',
        closingDay: '',
        prefecture: '',
        companyType: '',
      },
      {
        id: 2,
        name: '㈱タキノ工業所',
        email: 'Frances63@gmail.com',
        phoneNumber: '754.624.2886 x63507',
        streetAddress: '31270 Mona Cove',
        city: 'Nienowmouth',
        postalCode: '33605',
        companyCode: 'ss02',
        buildingName: '',
        paymentDeadline: '',
        closingDay: '',
        prefecture: '',
        companyType: '',
      },
      {
        id: 3,
        name: '㈲フジイ精密工業',
        email: 'Justine4@example.com',
        phoneNumber: '(324) 453-4660 x2611',
        streetAddress: '403 McClure Village',
        city: 'Kiehnfort',
        postalCode: '23134-2161',
        companyCode: 'sb01',
        buildingName: '',
        paymentDeadline: '',
        closingDay: '',
        prefecture: '',
        companyType: '',
      },
      {
        id: 4,
        name: '福岡計測工業㈲',
        email: 'Ruthe.Gutmann@gmail.com',
        phoneNumber: '644-667-3041 x7722',
        streetAddress: '43756 3rd Avenue',
        city: 'Cristianton',
        postalCode: '89109',
        companyCode: 'sc11',
        buildingName: '',
        paymentDeadline: '',
        closingDay: '',
        prefecture: '',
        companyType: '',
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
