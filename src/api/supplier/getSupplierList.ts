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
        customerName: 'Leo',
        email: 'Anastasia_McGlynn@example.com',
        phoneNumber: '631.358.0516 x4835',
        street: '798 Abbott Manor',
        city: 'Bloomington',
        postalCode: '13315-3600',
        id: '85b45c72-095c-42a5-b3a0-03c22b46e4e4',
        buildingName: '',
        paymentDueDate: '',
        closeingDay: '',
        prefecture: '',
      },
      {
        customerName: 'Reilly',
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
        customerName: 'Obie',
        email: 'Frances63@gmail.com',
        phoneNumber: '754.624.2886 x63507',
        street: '31270 Mona Cove',
        city: 'Nienowmouth',
        postalCode: '33605',
        id: '7b5c4dff-7a91-4cb9-9844-2ac94707ac12',
        buildingName: '',
        paymentDueDate: '',
        closeingDay: '',
        prefecture: '',
      },
      {
        customerName: 'Linnea',
        email: 'Justine4@example.com',
        phoneNumber: '(324) 453-4660 x2611',
        street: '403 McClure Village',
        city: 'Kiehnfort',
        postalCode: '23134-2161',
        id: '72364c15-779c-4d5a-8065-02cdda4d4c6b',
        buildingName: '',
        paymentDueDate: '',
        closeingDay: '',
        prefecture: '',
      },
      {
        customerName: 'Kassandra',
        email: 'Ruthe.Gutmann@gmail.com',
        phoneNumber: '644-667-3041 x7722',
        street: '43756 3rd Avenue',
        city: 'Cristianton',
        postalCode: '89109',
        id: '3812404b-f8e1-41c2-97ba-be1f8c9ad7f7',
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
