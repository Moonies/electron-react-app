import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'

export interface KpiData {
  id?: number
  plannedSales: number | null
  plannedVariableCost: number | null
  plannedFixedCost: number | null
  plannedNonOperatingIncome: number | null
  plannedNonOperatingExpense: number | null
}

export default async function GetKpiData(selectedYear: number): Promise<ApiResponse<KpiData>> {
  //for beta:test
  // await new Promise(resolve => setTimeout(resolve, 1000))
  // return {
  //   code: 200,
  //   message: 'Success',
  //   data: mockdata,
  // }
  // when use real API
  try {
    const response = await axiosInstance.get('/api/kpi?year.equal=' + selectedYear)
    return { code: 200, message: 'success', data: response.data.content[0] }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        code: error.response.status,
        message: error.response.data.message || 'An error occurred during authentication',
        data: null,
      }
    }
    return {
      code: 500,
      message: 'An unexpected error occurred',
      data: null,
    }
  }
}
