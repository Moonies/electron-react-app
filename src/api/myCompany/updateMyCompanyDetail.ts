import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { mockData } from './_mockSealData'
import { HttpRequest } from 'hooks/useHttp'

export interface UpdateMyCompanyDetailData {
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
    fax: string
  }
  accountNumber: string
  corporationNumber: string
  tax: number
}
export default async function updateMyCompanyDetail(
  httpRequest: HttpRequest,
  data: UpdateMyCompanyDetailData
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() =>
    axiosInstance.patch('/api/company/' + data.id, { ...data })
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
