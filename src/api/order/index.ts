import { default as getOrderList, OrderData, OrderSearchCriteria } from './getOrderList'
import { default as addNewOrder } from './addNewOrder'
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
}

export enum OrderType {
  SALE = 'Sale',
  PURCHASE = 'Purchase',
  ALL = 'All', //for basic OrderStatus
}
export interface OrderApi {
  getOrderList: (params: OrderSearchCriteria) => Promise<ApiResponse<OrderData[]>>
}

export default function order(httpRequest: HttpRequest): OrderApi {
  return { getOrderList: params => getOrderList(httpRequest, params) }
}
