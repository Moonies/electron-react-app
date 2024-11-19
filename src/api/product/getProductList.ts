import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface SearchCriteriaProductList {
  category: string
  keyword: string
  page: number
  pageSize: number
}
type ComponentDetail = {
  // id: string
  number: string
  name: string
  price: number
  quantity: number
}
export interface ProductData {
  id: string
  number: string
  name: string
  cost: number
  price: number
  grossMarginRate: number
  inStock: number
  howManyProductsCanBeMade: number
  components: ComponentDetail[]
  productUnit: {
    id: string
    label: string
    name: string
  }
  productUnitId: string
}

export default async function getProductList(
  httpRequest: HttpRequest,
  { keyword, category, page, pageSize }: SearchCriteriaProductList
): Promise<ApiResponse<ProductData[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get(`/api/products?${category}.contains=${keyword}&page=${page}&size=${pageSize}`)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content, page: response?.data.page }
}
