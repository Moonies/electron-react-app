import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs from 'dayjs'
import { HttpRequest } from 'hooks/useHttp'

type component = {
  name: string
  number: string
  price: number
  quantity: number
}
type Company = {
  id: string
  companyCode: string
  companyInfo: {
    name: string
    email: string
    phoneNumber: string
    buildingName: string
  }
}
export type PurchaseOrderHistory = {
  id: string
  orderCode: string
  totalAmount: number
  registrationDate: string
  deliveryDate: string
  invoiceNumber: string
  memo: string
  status: string
  orderType: string
  purchaseCode: string
  quotationRequestDate: string
  orderApprovalPendingDate: string
  orderApprovalDate: string
  stockApprovalPendingDate: string
  stockApprovalDate: string
  components: component[]
  companyId: string
  company: Company
}

export default async function getComponentPurchaseHistory(
  httpRequest: HttpRequest,
  componentName: string
): Promise<ApiResponse<PurchaseOrderHistory[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get(
      '/api/purchases?orderType.equal=Purchase&size=100&status.equal=COMPLETED&components.name.equal=' +
        componentName
    )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
