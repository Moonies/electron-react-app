import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface AddNewKpiData {
  year: number
  planSalesRevenue?: number | null
  planVariableCosts?: number | null
  planFixedCosts?: number | null
  planOperatingIncome?: number | null
  planOperatingExpenses?: number | null
  planOrdinaryProfit?: number | null
}

export default async function addNewKpiData(
  httpRequest: HttpRequest,
  data: AddNewKpiData
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() => axiosInstance.post('/api/kpi', data))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
  // try {
  //   const response = await axiosInstance.post('/api/kpi', data)
  //   return { code: 200, message: 'success', data: response.data }
  // } catch (error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     return {
  //       code: error.response.status,
  //       message: error.response.data.message || 'An error occurred during authentication',
  //       data: null,
  //     }
  //   }
  //   return {
  //     code: 500,
  //     message: 'An unexpected error occurred',
  //     data: null,
  //   }
  // }
}
