import axios from 'axios'
import { ApiResponse } from 'api'
import { ReportSearchCriteria } from '.'

export interface BestSaleProductReportData {
  productCode: string
  productName: string
  totalProfit: number
  profitPercent: number
}

const mockBestSaleProductList = [
  {
    productCode: 'F006',
    productName: 'Bread - Bagels Mini',
    totalProfit: 3076834,
    profitPercent: 20.087,
  },
  {
    productCode: 'C003',
    productName: 'Appetizer - Soutwestern',
    totalProfit: 2932209,
    profitPercent: 19.143,
  },
  { productCode: 'H008', productName: 'Absolut', totalProfit: 2281535, profitPercent: 14.895 },
  {
    productCode: 'B002',
    productName: 'example 001',
    totalProfit: 1852830,
    profitPercent: 12.096,
  },
  {
    productCode: 'J010',
    productName: 'example 002',
    totalProfit: 1713865,
    profitPercent: 11.189,
  },
]

export default async function GetBestSaleProductReportData(
  searchCriteria: ReportSearchCriteria
): Promise<ApiResponse<BestSaleProductReportData[]>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: mockBestSaleProductList,
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
