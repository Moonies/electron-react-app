import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'

export type SupplierCompanyDetail = {
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

export interface SupplierData {
  id: string
  closingDay: string
  paymentDeadline: string | dayjs.Dayjs
  companyCode: string
  companyType: string
  companyInfo: SupplierCompanyDetail
}

export default async function getSupplierList(): Promise<ApiResponse<SupplierData[]>> {
  // when use real API
  try {
    const response = await axiosInstance.get('/api/companies?companyType.equal=supplier')
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
}
