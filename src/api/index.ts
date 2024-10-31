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
import { default as roleApi } from './role'
import axios, { AxiosInstance } from 'axios'
import { getCurrentToken } from 'store/authSlice'

export interface ApiResponse<T> {
  code: number | string
  message: string
  data: T | null | undefined
}

// Determine the base URL based on the environment
const getBaseUrl = () => {
  const storedConfig = localStorage.getItem('apiConfig')
  let parsedConfig
  //end point can be change depens on user
  if (storedConfig && storedConfig !== null) {
    parsedConfig = JSON.parse(storedConfig)
    return `http://${parsedConfig.baseUrl}`
  }
  return 'http://localhost:3000'
  // if (process.env.NODE_ENV === 'development') {
  //   // Use Docker host in development
  //   // return 'http://192.168.68.126:8044'
  //   return `http://${parsedConfig.baseUrl}`
  // } else if (process.env.NODE_ENV === 'production') {
  //   // Use the production URL in production
  //   return 'https://api.yourdomain.com'
  // }
  // Default fallback
  // return 'http://localhost:3000'
}

const getToken = () => {
  const authData = getCurrentToken()
  return authData?.token
}
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // 10 seconds
  headers: {
    Accept: '*/*',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
})

// Set up interceptor to ensure token is always current
axiosInstance.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Best practice: use Authorization header
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export const api = {
  // user: userApi(),
  // kpi: kpiApi(),
  product: productApi(),
  sale: saleApi(),
  report: reportApi(),
  // myCompany: myCompanyApi(),
  // postCode: postCodeApi(),
  // customer: customerApi(),
  // supplier: supplierApi(),
  // component: componentApi(),
  // purchase: purchaseApi(),
  // order: orderApi(),
  // prefecture: prefectureApi(),
  // role: roleApi(),
}
