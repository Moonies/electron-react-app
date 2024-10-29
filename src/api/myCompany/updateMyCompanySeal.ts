import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { mockData } from './_mockSealData'
import { HttpRequest } from 'hooks/useHttp'
export interface UpdateMyCompanySeal {
  id: string
  seal: File
}
export default async function updateMyCompanySeal(
  httpRequest: HttpRequest,
  { id, seal }: UpdateMyCompanySeal
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() =>
    axiosInstance.put(
      '/api/company/' + id + '/seal',
      { file: seal },
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
