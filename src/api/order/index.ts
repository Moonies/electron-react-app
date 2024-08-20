import React from 'react'
import { default as getOrderList } from './getOrderList'
export enum OrderStatus {
  ALL = 'all',
  RECEIVED = 'received',
  PROCESSING = 'processing',
  OVER_DUE_DATE = 'over_due_date',
  SHIPPED = 'shipping',
  DELIVERED = 'delivered',
  CANCEL = 'cancel',
}
export default function order() {
  return { getOrderList }
}
