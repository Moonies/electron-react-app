import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

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

export interface SupplierDetail {
  id: string
  closingDay: string
  paymentDeadline: string | dayjs.Dayjs
  companyCode: string
  companyType: string
  companyInfo: SupplierCompanyDetail
}

export default async function getSupplierDetailWithId(
  httpRequest: HttpRequest,
  companyId: string
): Promise<ApiResponse<SupplierDetail>> {
  const response = await httpRequest(() =>
    axiosInstance.get('/api/companies?companyType.equal=supplier&companyId.equal=' + companyId)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content[0] }
}
