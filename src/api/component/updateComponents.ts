import axios from 'axios'
import { axiosInstance, ApiResponse } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

export interface UpdateComponentProps {
  price: number
  latestPriceDecisionDate: string | dayjs.Dayjs
  id: string
  name: string
  number: string
}

export default async function updateComponent(
  httpRequest: HttpRequest,
  data: UpdateComponentProps
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() =>
    axiosInstance.patch('/api/components/' + data.id, { ...data })
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
