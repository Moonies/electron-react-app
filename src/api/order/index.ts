import { default as getOrderList, OrderData, OrderSearchCriteria } from './getOrderList'
import { default as addNewOrder } from './addNewOrder'
import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export enum OrderStatus {
  // ALL = 'all',
  // NonOrder = 'quatation',
  // RECEIVED = 'ordered',
  // OVER_DUE_DATE = 'over_due_date',
  // ORDER = 'order',
  // ORDERING = 'ordering', //shipping?
  // CANCEL = 'cancel',

  //basic status
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  //to sale order
  ORDERED = 'ordered',
  PROCESSING = 'processing',
  DELIVERY = 'delivery',
  DELAY = 'delay',
  //to purchase order
  CONFIRMED = 'confirmed',
  RECEIVED = 'received',
  IN_STORE = 'in_store',
}

export enum OrderType {
  SALE = 'Sale',
  PURCHASE = 'Purchase',
}
export interface OrderApi {
  getOrderList: (params: OrderSearchCriteria) => Promise<ApiResponse<OrderData[]>>
}

export default function order(httpRequest: HttpRequest): OrderApi {
  return { getOrderList: params => getOrderList(httpRequest, params) }
}
