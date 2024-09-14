import { default as kpiApi } from './kpi'
import { default as userApi } from './user'
import { default as productApi } from './product'
import { default as saleApi } from './sale'
import { default as reportApi } from './report'
import { default as myCompanyApi } from './myCompany'
import { default as postCodeApi } from './postCode'
import { default as customerApi } from './customer'
import { default as supplierApi } from './supplier'
import { default as componentApi } from './component'
import { default as purchaseApi } from './purchase'
import { default as orderApi } from './order'
import { default as prefectureApi } from './perfecture'
import axios, { AxiosInstance } from 'axios'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T | null | undefined
}

// Determine the base URL based on the environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    // Use Docker host in development
    return 'http://192.168.68.126:8080'
  } else if (process.env.NODE_ENV === 'production') {
    // Use the production URL in production
    return 'https://api.yourdomain.com'
  }
  // Default fallback
  return 'http://localhost:3000'
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // 10 seconds
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
})

export const api = {
  user: userApi,
  kpi: kpiApi,
  product: productApi,
  sale: saleApi,
  report: reportApi,
  myCompany: myCompanyApi,
  postCode: postCodeApi,
  customer: customerApi,
  supplier: supplierApi,
  component: componentApi,
  purchase: purchaseApi,
  order: orderApi,
  prefecture: prefectureApi,
}
