import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'

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
  data: NewMyCompanyDetailData
): Promise<ApiResponse<ResultAddNewMyCompany>> {
  // when use real API
  try {
    const response = await axiosInstance.post('/api/company', data)
    return { code: 200, message: 'success', data: response.data.id }
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
}
