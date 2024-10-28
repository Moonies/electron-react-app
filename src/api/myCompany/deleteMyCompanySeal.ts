import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export default async function deleteMyCompanySeal(
  httpRequest: HttpRequest,
  id: string
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.delete('/api/company/' + id + '/seal'))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.data }
}
