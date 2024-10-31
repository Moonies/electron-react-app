import {
  default as getPurchaseList,
  PurchaseData,
  SearchCriteria as PurchaseListSearchCriteria,
} from './getPurchaseList'
import { default as addNewPurchase, AddNewPurchase } from './addNewPurchase'
import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse } from 'api'

export enum PurchaseStatus {
  INVOICE_PENDING = 'invoice_pending',
  ON_DELIVERY = 'on_delivery',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface PurchaseApi {
  addNewPurchase: (params: AddNewPurchase) => Promise<ApiResponse<{}>>
  getPurchaseList: (params: PurchaseListSearchCriteria) => Promise<ApiResponse<PurchaseData[]>>
}
export default function purchase(httpRequest: HttpRequest): PurchaseApi {
  return {
    getPurchaseList: params => getPurchaseList(httpRequest, params),
    addNewPurchase: params => addNewPurchase(httpRequest, params),
  }
}
