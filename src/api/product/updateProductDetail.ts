import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { HttpRequest } from 'hooks/useHttp'

type ComponentDetail = {
  name: string
  number: string
  quantity: number
  price: number
}
export type NewProductDetailProps = {
  id: string
  name: string
  number: string
  price: number
  lastestPriceDecisionDate: string
  cost: number
  grossMarginRate: number
  productUnitId: string
  // taxCategory: string
  components: ComponentDetail[]
  // inStock: number
}

export default async function updateProductDetail(
  httpRequest: HttpRequest,
  data: NewProductDetailProps
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.put('/api/products', { ...data }))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
