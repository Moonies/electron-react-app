import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { mockdata } from './_mockdata'
import { ComponentData } from 'api/component/getComponentList'
import { HttpRequest } from 'hooks/useHttp'

export interface ProductDetail {
  id: string
  number: string
  name: string
  price: number
  cost: number
  inStock: number
  howManyProductsCanBeMade: number
}

type SearchCriteria = {
  category: string
  keyword: string
}

export default async function getProductData(
  httpRequest: HttpRequest,
  { category, keyword }: SearchCriteria
): Promise<ApiResponse<ProductDetail[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get(`/api/products?${category}.contains=${keyword}`)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
