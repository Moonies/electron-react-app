import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { ReportSearchCriteria } from 'api/report'
import { HttpRequest } from 'hooks/useHttp'

export interface WorstProductReportData {
  number: string
  name: string
  quantityPercentage: number
  profitPercentage: number
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
  httpRequest: HttpRequest,
  { category, endDate, startDate }: ReportSearchCriteria
): Promise<ApiResponse<WorstProductReportData[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get(
      `/api/reports/worst-products?status.equal=COMPLETED&shipmentDate.from=${startDate}&shipmentDate.to=${endDate}`
    )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
