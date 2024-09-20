import { default as getOrderList } from './getOrderList'
import { default as addNewOrder } from './addNewOrder'

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
export default function order() {
  return { getOrderList, addNewOrder }
}
