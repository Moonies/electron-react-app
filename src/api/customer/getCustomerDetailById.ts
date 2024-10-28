import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

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
  httpRequest: HttpRequest,
  customerCode: string
): Promise<ApiResponse<CustomerDetailData>> {
  const response = await httpRequest(() =>
    axiosInstance.get(
      '/api/companies?companyType.equal=customer&companyCode.contains=' + customerCode
    )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
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
