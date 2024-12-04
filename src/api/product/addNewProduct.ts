import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { HttpRequest } from 'hooks/useHttp'

type ComponentDetail = {
  name: string
  number: string
  quantity: number
}
export type AddNewProductProps = {
  name: string
  number: string
  price: number
  cost: number
  grossMarginRate: number
  productUnitId: string
  // taxCategory: string
  components: ComponentDetail[]
}

type NewProductDetail = {
  id: string
  name: string
  number: string
  price: number
  cost: number
  grossMarginRate: number
  productUnitId: string
  // taxCategory: string
  components: ComponentDetail[]
}

export default async function addNewProduct(
  httpRequest: HttpRequest,
  data: AddNewProductProps
): Promise<ApiResponse<{ id: string }>> {
  const response = await httpRequest(() => axiosInstance.post('/api/products', { ...data }))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
