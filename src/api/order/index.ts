import { default as getOrderList, OrderData, OrderSearchCriteria } from './getOrderList'
import {
  default as getSaleOrderList,
  SaleOrderData,
  SaleOrderSearchCriteria,
} from './getSaleOrderList'
import {
  default as getPurchaseOrderList,
  PurchaseOrderData,
  PurchaseOrderSearchCriteria,
} from './getPurchaseOrderList'
import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export enum OrderStatus {
  //basic status
  // PENDING = 'PENDING',
  // CANCEL = 'CANCELLED',
  //to sale order
  // ORDERED = 'ordered',
  // PROCESSING = 'processing',
  // DELIVERY = 'delivery',
  // DELAY = 'delay',
  // //to purchase order
  // CONFIRM = 'CONFIRMED',
  // RECEIVED = 'received',
  // IN_STORE = 'in_store',

  //v2 orderStatus
  PENDING = 'PENDING',
  CONFIRM = 'CONFIRMED',
  SHIP = 'SHIPPED',
  COMPLETE = 'COMPLETED',
  REJECT = 'REJECTED',
  CANCEL = 'CANCELLED',
  ALL = '',
}

export enum OrderType {
  SALE = 'Sale',
  PURCHASE = 'Purchase',
  ALL = 'All', //for basic OrderStatus
}
export interface OrderApi {
  getOrderList: (params: OrderSearchCriteria) => Promise<ApiResponse<OrderData[]>>
  getSaleOrderList: (params: SaleOrderSearchCriteria) => Promise<ApiResponse<SaleOrderData[]>>
  getPurchaseOrderList: (
    params: PurchaseOrderSearchCriteria
  ) => Promise<ApiResponse<PurchaseOrderData[]>>
}

export default function order(httpRequest: HttpRequest): OrderApi {
  return {
    getOrderList: params => getOrderList(httpRequest, params),
    getSaleOrderList: params => getSaleOrderList(httpRequest, params),
    getPurchaseOrderList: params => getPurchaseOrderList(httpRequest, params),
  }
}
