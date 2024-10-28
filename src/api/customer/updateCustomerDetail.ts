import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

export interface UpdateCustomerDetailProps {
  id: string
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

export default async function updateCustomerDetail(
  httpRequest: HttpRequest,
  data: UpdateCustomerDetailProps
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.patch('/api/companies', { ...data }))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
