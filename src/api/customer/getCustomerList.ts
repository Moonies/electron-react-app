import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'

export type CustomerCompanyDetail = {
  name: string
  phoneNumber: string
  email: string
  buildingName: string
  fax?: string
  address: {
    postalCode: string
    prefecture: string
    city: string
    streetAddress: string
  }
}

export interface CustomerData {
  id: string
  closingDay: string
  paymentDeadline: string | dayjs.Dayjs
  companyCode: string
  companyType: string
  companyInfo: CustomerCompanyDetail
}

export default async function getCustomerList(): Promise<ApiResponse<CustomerData[]>> {
  // when use real API
  try {
    const response = await axiosInstance.get('/api/companies')
    return { code: 200, message: 'success', data: response.data.content }
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

  //for beta:test
  // await new Promise(resolve => setTimeout(resolve, 1000))
  // return {
  //   code: 200,
  //   message: 'Success',
  //   data: [
  //     {
  //       name: '㈲エスユー',
  //       email: 'Jeanie.Fritsch-Gerhold@example.com',
  //       phoneNumber: '736.214.3844 x30389',
  //       streetAddress: '77355 Joan Ford',
  //       city: 'Donnellychester',
  //       postalCode: '81709',
  //       id: 1,
  //       buildingName: '',
  //       paymentDeadline: '',
  //       closingDay: '',
  //       prefecture: '',
  //       companyCode: '1',
  //       companyType: '',
  //       fax: '',
  //     },
  //     {
  //       name: 'ニデックマシンツ－ル㈱',
  //       email: 'Frances63@gmail.com',
  //       phoneNumber: '754.624.2886 x63507',
  //       streetAddress: '31270 Mona Cove',
  //       city: 'Nienowmouth',
  //       postalCode: '33605',
  //       id: 2,
  //       buildingName: '',
  //       paymentDeadline: '',
  //       closingDay: '',
  //       prefecture: '',
  //       companyCode: '2',
  //       companyType: '',
  //       fax: '',
  //     },
  //     {
  //       name: 'Linnea',
  //       email: 'Justine4@example.com',
  //       phoneNumber: '(324) 453-4660 x2611',
  //       streetAddress: '403 McClure Village',
  //       city: 'Kiehnfort',
  //       postalCode: '23134-2161',
  //       id: 3,
  //       buildingName: '',
  //       paymentDeadline: '',
  //       closingDay: '',
  //       prefecture: '',
  //       companyCode: '72364c15-779c-4d5a-8065-02cdda4d4c6b',
  //       companyType: '',
  //       fax: '',
  //     },
  //     {
  //       name: 'Kassandra',
  //       email: 'Ruthe.Gutmann@gmail.com',
  //       phoneNumber: '644-667-3041 x7722',
  //       streetAddress: '43756 3rd Avenue',
  //       city: 'Cristianton',
  //       postalCode: '89109',
  //       id: 4,
  //       buildingName: '',
  //       paymentDeadline: '',
  //       closingDay: '',
  //       prefecture: '',
  //       companyCode: '3812404b-f8e1-41c2-97ba-be1f8c9ad7f7',
  //       companyType: '',
  //       fax: '',
  //     },
  //   ],
  // }
}
