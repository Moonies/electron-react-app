import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface KpiData {
  id?: number
  plannedSales: number | null
  plannedVariableCost: number | null
  plannedFixedCost: number | null
  plannedNonOperatingIncome: number | null
  plannedNonOperatingExpense: number | null
}

export default async function GetKpiData(
  httpRequest: HttpRequest,
  selectedYear: number
): Promise<ApiResponse<KpiData>> {
  const response = await httpRequest(() => axiosInstance.get('/api/kpi?year.equal=' + selectedYear))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content[0] }
  // try {
  //   const response = await axiosInstance.get('/api/kpi?year.equal=' + selectedYear)
  //   return { code: 200, message: 'success', data: response.data.content[0] }
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
