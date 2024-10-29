import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface NewMyCompanyDetailData {
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
    fax: string
  }
  accountNumber: string
  corporationNumber: string
  tax: number
}
type ResultAddNewMyCompany = {
  id: string
}
export default async function addNewMyCompanyDetail(
  httpRequest: HttpRequest,
  data: NewMyCompanyDetailData
): Promise<ApiResponse<ResultAddNewMyCompany>> {
  const response = await httpRequest(() => axiosInstance.post('/api/company', data))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: { id: response?.data } }
}
