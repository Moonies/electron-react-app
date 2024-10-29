import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

// export interface deleteComponentProps {
//   id: string
// }

export default async function deleteComponent(
  httpRequest: HttpRequest,
  componentId: string
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.delete('/api/components/' + componentId))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
