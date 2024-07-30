import axios from 'axios'
import { ApiResponse } from 'api'

export interface SearchCriteria {
  category: string
  startDate: Date
  endDate: Date
}

export interface ProfitReportData {
  label: string
  totalUnit: number
  totalProfit: number
}

const mockProfitChartData = [
  { label: '2023/1', totalUnit: 69170, totalProfit: 3595781 },
  { label: '2023/2', totalUnit: 49683, totalProfit: 2495526 },
  { label: '2023/3', totalUnit: 43967, totalProfit: 1977547 },
  { label: '2023/4', totalUnit: 1000, totalProfit: 4729200 },
]

export default async function GetProfitReportData(
  searchCriteria: SearchCriteria
): Promise<ApiResponse<ProfitReportData[]>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: mockProfitChartData,
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
