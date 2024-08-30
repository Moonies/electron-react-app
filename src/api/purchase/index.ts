import React from 'react'
import { default as getPurchaseList } from './getPurchaseList'
import { default as addNewPurchase } from './addNewPurchase'

export enum PurchaseStatus {
  INVOICE_PENDING = 'invoice_pending',
  ON_DELIVERY = 'on_delivery',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}
export default function purchase() {
  return { getPurchaseList, addNewPurchase }
}
