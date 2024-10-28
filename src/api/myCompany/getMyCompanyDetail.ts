import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface MyCompanyDetail {
  id: string
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
  accountNumber: string
  corporationNumber: string
  tax: number
}
export default async function getMyCompanyDetail(
  httpRequest: HttpRequest
): Promise<ApiResponse<MyCompanyDetail>> {
  const response = await httpRequest(() => axiosInstance.get('/api/company'))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content[0] }
}
