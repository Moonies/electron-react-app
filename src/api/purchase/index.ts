import {
  default as getPurchaseList,
  PurchaseData,
  SearchCriteria as PurchaseListSearchCriteria,
} from './getPurchaseList'
import { default as addNewPurchase, AddNewPurchase } from './addNewPurchase'
import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse } from 'api'
import { default as getPurchaseDetail, PurchaseDetail } from './getPurchaseDetail'
import { default as updatePurchaseDetail, NewPurchaseDetail } from './updatePurchaseDetail'
import updatePurchaseStatus from './updatePurchaseStatus'
import { default as deletePurchaseOrder } from './deletePurchase'

export enum PurchaseStatus {
  INVOICE_PENDING = 'invoice_pending',
  PENDING = 'PENDING',
  CONFIRM = 'CONFIRM',
  ON_DELIVERY = 'SHIP',
  DELIVERED = 'COMPLETE',
  CANCEL = 'CANCEL',
}

export interface PurchaseApi {
  addNewPurchase: (params: AddNewPurchase) => Promise<ApiResponse<{}>>
  deletePurchaseOrder: (purchaseId: string) => Promise<ApiResponse<{}>>
  getPurchaseList: (params: PurchaseListSearchCriteria) => Promise<ApiResponse<PurchaseData[]>>
  getPurchaseDetail: (orderId: string) => Promise<ApiResponse<PurchaseDetail>>
  updatePurchaseDetail: (params: NewPurchaseDetail) => Promise<ApiResponse<{}>>
  updatePurchaseStatus: (purchaseId: string, status: PurchaseStatus) => Promise<ApiResponse<{}>>
}

export default function purchase(httpRequest: HttpRequest): PurchaseApi {
  return {
    getPurchaseList: params => getPurchaseList(httpRequest, params),
    addNewPurchase: params => addNewPurchase(httpRequest, params),
    getPurchaseDetail: orderId => getPurchaseDetail(httpRequest, orderId),
    updatePurchaseDetail: params => updatePurchaseDetail(httpRequest, params),
    updatePurchaseStatus: (purchaseId, status) =>
      updatePurchaseStatus(httpRequest, purchaseId, status),
    deletePurchaseOrder: purchaseId => deletePurchaseOrder(httpRequest, purchaseId),
  }
}
