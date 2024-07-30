import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs, { Dayjs } from 'dayjs'

export interface YearKpiSelecte {
  selectedYear: number
}

export interface KpiData {
  planSalesRevenue?: number
  planVariableCosts?: number
  planFixedCosts?: number
  planOperatingIncome?: number
  planOperatingExpenses?: number
  planOrdinaryProfit?: number
  actualSalesRevenue?: number
  actualVariableCosts?: number
  actualFixedCosts?: number
  actualOperatingIncome?: number
  actualOperatingExpenses?: number
  actualOrdinaryProfit?: number
}

const mockdata = {
  planSalesRevenue: 2000000,
  planVariableCosts: 1000000,
  planFixedCosts: 6000000,
  planOperatingIncome: 4000000,
  planOperatingExpenses: 3000000,
  planOrdinaryProfit: 170000,
  actualSalesRevenue: 2000000,
  actualVariableCosts: 0,
  actualFixedCosts: 500000,
  actualOperatingIncome: 0,
  actualOperatingExpenses: 0,
  actualOrdinaryProfit: 1500000,
}

export default async function GetKpiData(
  selectedYear: YearKpiSelecte
): Promise<ApiResponse<KpiData>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: mockdata,
  }
  // when use real API
  // try {
  //     const response = await axios.post<ApiResponse<AuthData>>('/api/auth', { username, password });
  //     return response.data;
  // } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //         return {
  //             code: error.response.status,
  //             message: error.response.data.message || 'An error occurred during authentication',
  //             data: null
  //         };
  //     }
  //     return {
  //         code: 500,
  //         message: 'An unexpected error occurred',
  //         data: null
  //     };
  // }
}
