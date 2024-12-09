import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface AddressData {
  postCode: string
  prefecture: string
  city: string
}

export default async function getPostCode(
  httpRequest: HttpRequest,
  postCode: string
): Promise<ApiResponse<AddressData>> {
  const response = await httpRequest(() =>
    axiosInstance.get('/api/postal-codes?postalCode.equal=' + postCode)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content[0] }
}
