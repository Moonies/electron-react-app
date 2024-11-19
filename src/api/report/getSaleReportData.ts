import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { ReportSearchCriteria } from 'api/report'
import { HttpRequest } from 'hooks/useHttp'

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
  httpRequest: HttpRequest,
  { category, endDate, startDate }: ReportSearchCriteria
): Promise<ApiResponse<SaleReportData[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get(
      `/api/reports/sales?size=60&label=${category}&from=${startDate}&to=${endDate}`
    )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }
}
