import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { mockData } from './_mockSealData'
import { HttpRequest } from 'hooks/useHttp'
export interface MyCompnaSeal {
  seal: string
}

export default async function getMyCompanySeal(
  httpRequest: HttpRequest,
  id: string
): Promise<ApiResponse<MyCompnaSeal>> {
  const response = await httpRequest(
    () =>
      axiosInstance.get('/api/company/' + id + '/seal', {
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
  return { code: 200, message: 'success', data: { seal: imageObjectURL } }
}
