import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { ReportSearchCriteria } from 'api/report'
import { HttpRequest } from 'hooks/useHttp'

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
  httpRequest: HttpRequest,
  { category, startDate, endDate }: ReportSearchCriteria
): Promise<ApiResponse<ProfitReportData[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get(
      `/api/reports/profits?size=60&label=${category}&from=${startDate}&to=${endDate}`
    )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
