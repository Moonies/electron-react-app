import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { ReportSearchCriteria } from 'api/report'
import { HttpRequest } from 'hooks/useHttp'

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
  httpRequest: HttpRequest,
  { category, startDate, endDate }: ReportSearchCriteria
): Promise<ApiResponse<BestSaleProductReportData[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get(
      `/api/reports/best-products?size=60&label=${category}&from=${startDate}&to=${endDate}`
    )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
