import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

export type componentList = {
  // id: string
  name: string
  number: string
  price: number
  quantity: number
}
export interface AddNewPurchase {
  // orderCode: string //may be auto create from database
  totalAmount: number
  registrationDate: string
  deliveryDate: string
  invoiceNumber: string
  memo: string
  purchaseCode: string
  quotationRequestDate: string
  // orderApprovalPendingDate: string
  orderApprovalDate: string
  // stockApprovalPendingDate: string
  stockApprovalDate: string
  components: componentList[]
  companyId: string
}

export default async function addNewPurchase(
  httpRequest: HttpRequest,
  newPurchase: AddNewPurchase
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.post('/api/purchases', { ...newPurchase }))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
  //for beta:test
  // let newMock = chunkArray(mockData, pageSize, page)

  // await new Promise(resolve => setTimeout(resolve, 1000))
  // return {
  //   code: 200,
  //   message: 'Success',
  //   data: {},
}
