import React from 'react'
import { default as getOrderList } from './getOrderList'
import { default as addNewOrder } from './addNewOrder'

export enum OrderStatus {
  // ALL = 'all',
  NonOrder = 'quatation',
  RECEIVED = 'ordered',
  // PROCESSING = 'processing',
  OVER_DUE_DATE = 'over_due_date',
  ORDER = 'order',
  ORDERING = 'ordering', //shipping?
  INSTORE = 'instore',
  DELIVERED = 'delivered',
  CANCEL = 'cancel',
}
export default function order() {
  return { getOrderList, addNewOrder }
}
