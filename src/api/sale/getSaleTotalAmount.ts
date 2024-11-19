import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { Dayjs } from 'dayjs'

export interface SearchCriteria {
  category: string
  keyword: string
  startDate: string | Dayjs
  endDate: string | Dayjs
  dateType: string
}

export default async function getSaleTotalAmount(
  httpRequest: HttpRequest,
  { category, keyword, startDate, endDate, dateType }: SearchCriteria
): Promise<ApiResponse<number>> {
  const response = await httpRequest(() =>
    dateType && dateType !== ''
      ? axiosInstance.get(
          `/api/sales/total-amount?status.equal=COMPLETED&${category}.contains=${keyword}&${dateType}.from=${startDate}&${dateType}.to=${endDate}`
        )
      : axiosInstance.get(
          `/api/sales/total-amount?status.equal=COMPLETED&${category}.contains=${keyword}`
        )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
