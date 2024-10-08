import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'

export interface AddNewKpiData {
  year: number
  planSalesRevenue?: number | null
  planVariableCosts?: number | null
  planFixedCosts?: number | null
  planOperatingIncome?: number | null
  planOperatingExpenses?: number | null
  planOrdinaryProfit?: number | null
}

export default async function addNewKpiData(data: AddNewKpiData): Promise<ApiResponse<{}>> {
  //for beta:test
  // await new Promise(resolve => setTimeout(resolve, 1000))
  // return {
  //   code: 200,
  //   message: 'Success',
  //   data: {
  //     data: mockdata,
  //   },
  // }
  // when use real API
  try {
    const response = await axiosInstance.post('/api/kpi', data)
    return { code: 200, message: 'success', data: response.data }
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
