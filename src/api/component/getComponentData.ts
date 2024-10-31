import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { mockData } from './_mockdata'
import { HttpRequest } from 'hooks/useHttp'

export interface ComponentData {
  id: string
  number: string
  name: string
  price: number
  inStock: number
}

export default async function getComponentData(
  httpRequest: HttpRequest,
  componentNumber: string
): Promise<ApiResponse<ComponentData[]>> {
  //use props query to filter in component
  const response = await httpRequest(() =>
    axiosInstance.get('/api/components?number.contains=' + componentNumber)
  ) //waiting for confirm
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
