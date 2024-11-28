import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface ProductImage {
  image: string
}

export default async function getProductImage(
  httpRequest: HttpRequest,
  productId: string
): Promise<ApiResponse<ProductImage>> {
  const response = await httpRequest(
    () =>
      axiosInstance.get('/api/products/' + productId + '/productPhoto', {
        responseType: 'blob',
        headers: {
          ...axiosInstance.defaults.headers.common, // Keep other default headers
          'Content-Type': 'image/jpeg',
        },
      }),
    true
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  const imageObjectURL = URL.createObjectURL(response?.data)
  return { code: 200, message: 'success', data: { image: imageObjectURL } }
}
