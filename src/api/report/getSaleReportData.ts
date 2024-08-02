import axios from 'axios'
import { ApiResponse } from 'api'
import { ReportSearchCriteria } from './'

export interface SaleReportData {
  label: string
  totalSale: number
  totalOrder: number
  totalPreSale: number
  totalTarget: number
}

const mockSaleChartData = [
  { label: '2023/1', totalSale: 7191135, totalOrder: 0, totalPreSale: 0, totalTarget: 2666666 },
  { label: '2023/2', totalSale: 4991116, totalOrder: 0, totalPreSale: 0, totalTarget: 2666666 },
  { label: '2023/3', totalSale: 395531, totalOrder: 0, totalPreSale: 0, totalTarget: 2666666 },
  { label: '2023/4', totalSale: 6077421, totalOrder: 0, totalPreSale: 0, totalTarget: 2666666 },
  { label: '2023/5', totalSale: 7134497, totalOrder: 0, totalPreSale: 0, totalTarget: 2666666 },
]

export default async function GetSaleReportData(
  searchCriteria: ReportSearchCriteria
): Promise<ApiResponse<SaleReportData[]>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: mockSaleChartData,
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
