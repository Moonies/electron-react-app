import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

type CustomerCompanyDetail = {
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
export interface CustomerDetailData {
  id: string
  closingDay: string
  paymentDeadline: string | dayjs.Dayjs
  companyCode: string
  companyType: string
  companyInfo: CustomerCompanyDetail
}

export default async function GetCustomerDetailById(
  httpRequest: HttpRequest,
  customerId: string
): Promise<ApiResponse<CustomerDetailData>> {
  const response = await httpRequest(() => axiosInstance.get('/api/companies/' + customerId))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
