import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { mockData } from './_mockdata'
import { HttpRequest } from 'hooks/useHttp'

export interface ComponentData {
  id: string
  componentNumber: string
  componentName: string
  price: number
}

export default async function getComponentData(
  httpRequest: HttpRequest,
  query: string
): Promise<ApiResponse<ComponentData[]>> {
  //use props query to filter in component
  const response = await httpRequest(() => axiosInstance.get('/api/components/' + query)) //waiting for confirm
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
