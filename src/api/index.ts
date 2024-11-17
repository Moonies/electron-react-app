import { default as reportApi } from './report'
import axios, { AxiosInstance } from 'axios'
import { getCurrentToken } from 'store/authSlice'
import { getBaseUrl } from 'store/apiConfigSlice'

export interface ApiResponse<T> {
  code: number | string
  message: string
  data: T | null | undefined
  page?: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  } | null
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

// Function to update the axios instance
export const updateAxiosBaseUrl = () => {
  axiosInstance.defaults.baseURL = getBaseUrl()
}
export const api = {
  report: reportApi(),
}
