import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
export interface UpdateProductImage {
  id: string
  image: File
}
export default async function updateProductImage(
  httpRequest: HttpRequest,
  { id, image }: UpdateProductImage
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() =>
    axiosInstance.put(
      '/api/products/' + id + '/productPhoto',
      { file: image },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
