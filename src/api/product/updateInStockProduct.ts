import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export default async function updateProductInStock(
  httpRequest: HttpRequest,
  productId: string,
  quantity: number
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() =>
    axiosInstance.patch('/api/products/updateQuantity/' + productId, quantity)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
