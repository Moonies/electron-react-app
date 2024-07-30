import axios from 'axios'
import { ApiResponse } from 'api'

export interface SearchCriteria {
  category: string
  startDate: Date
  endDate: Date
}

export interface WorstProductReportData {
  productCode: string
  productName: string
  quantityPercent: number
  profitPercent: number
}

const mockWorstProductList = [
  {
    productCode: 'abc123',
    productName: 'abc',
    quantityPercent: 0.004,
    profitPercent: 0.002,
  },
  {
    productCode: 'M2',
    productName: 'Meepo all Mid bobo',
    quantityPercent: 0.004,
    profitPercent: 0.009,
  },
  {
    productCode: 'TG-UB15-30-DN',
    productName: 'Absolut',
    quantityPercent: 0.004,
    profitPercent: 0.025,
  },
  {
    productCode: 'NB-VM10006-BU',
    productName: 'VM TUMBLER (BLUE)',
    quantityPercent: 0.008,
    profitPercent: 0.039,
  },
  {
    productCode: 'NB-VM1006-RD',
    productName: 'VM TUMBLER (RED)',
    quantityPercent: 0.008,
    profitPercent: 0.039,
  },
]

export default async function GetWorstSaleProductReportData(
  searchCriteria: SearchCriteria
): Promise<ApiResponse<WorstProductReportData[]>> {
  //for beta:test
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: mockWorstProductList,
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
