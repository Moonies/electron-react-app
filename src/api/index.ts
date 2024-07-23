export interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
}

export { default as checkAuth } from './users/auth'
export { default as productList } from './products/productList'
export { default as saleList } from './sales/saleList'
export { default as kpi } from './kpi'
