import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface ProductUnitDetail {
  id: string
  name: string
  label: string
}

export default async function getProductUnitList(
  httpRequest: HttpRequest
): Promise<ApiResponse<ProductUnitDetail[]>> {
  const response = await httpRequest(() => axiosInstance.get('/api/product-units'))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
