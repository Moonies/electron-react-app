import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

type componentList = {
  name: string
  number: string
  price: number
  quantity: number
}
export interface NewPurchaseDetail {
  id: string
  orderCode: string //may be auto create from database
  totalAmount: number
  registrationDate: string
  deliveryDate: string
  invoiceNumber: string
  memo: string
  purchaseCode: string
  // quotationRequestDate: string //may be auto update when update event
  // orderApprovalDate: string //may be auto update when update event
  // stockApprovalDate: string //may be auto update when update event
  components: componentList[]
  companyId: string
  // createdBy: string // can auto with token header?
  ownerId: string // can auto with token header?
}

export default async function updatePurchaseDetail(
  httpRequest: HttpRequest,
  newPurchaseDetail: NewPurchaseDetail
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() =>
    axiosInstance.put('/api/purchases', { ...newPurchaseDetail })
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
