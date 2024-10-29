import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

export interface SearchCriteriaComponentList {
  category?: string
  keyword?: string
}

export interface ComponentData {
  id: string
  name: string
  number: string
  latestPriceDecisionDate: string | dayjs.Dayjs
  price: number
  // productId: string
  inStock: number
}

export default async function getComponentList(
  httpRequest: HttpRequest,
  { category = '', keyword = '' }: SearchCriteriaComponentList
): Promise<ApiResponse<ComponentData[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get('/api/components?' + category + '.contains=' + keyword)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
