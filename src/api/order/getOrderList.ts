import axios from 'axios'
import { ApiResponse, axiosInstance } from 'api'
import dayjs, { Dayjs } from 'dayjs'
import { OrderStatus, OrderType } from '.'
import { mockData } from './_mockdata'
import { HttpRequest } from 'hooks/useHttp'
// import { PurchaseStatus } from '.'
export interface OrderSearchCriteria {
  category: string
  keyword?: string
  startDate: string
  endDate: string
  page?: number
  pageSize?: number
  orderStatus?: `${OrderStatus}` | string
  orderType?: OrderType
  dateType?: string
}
type Company = {
  companyType: string
  companyInfo: {
    name: string
    buildingName: string
    address: {
      streetAddress: string
      city: string
      prefecture: string
      postalCode: string
    }
    phoneNumber: string
    email: string
    fax?: string
  }
}
export interface OrderData {
  id: string
  orderCode: string
  companyId: string
  company: Company
  orderRequestEmployeeId: string
  orderRequestEmployeeName: string
  orderApprovedEmployeeId: string
  orderApprovedEmployeeName: string
  quotationRequestDate: string | Dayjs
  registDate: string | Dayjs
  shippingmentDate: string | Dayjs
  paymentDueDate: string | Dayjs
  status: string | null
  orderType: string
}
//for implement case only when apprved should be remove it
function chunkArray(mockdata: OrderData[], pageSize: number, page: number) {
  const result = []
  for (let i = 0; i < mockdata.length; i += pageSize) {
    result.push(mockdata.slice(i, i + pageSize))
  }
  return result[page]
}

export default async function getOrderList(
  httpRequest: HttpRequest,
  {
    category,
    keyword,
    startDate,
    endDate,
    orderStatus = '',
    page = 0,
    pageSize = 10,
    dateType,
    orderType = OrderType.ALL,
  }: OrderSearchCriteria
): Promise<ApiResponse<OrderData[]>> {
  let response
  if (orderType === OrderType.SALE) {
    // api/sales status is not completed
  } else if (orderType === OrderType.PURCHASE) {
    // api/purchase status is not completed
    response = await httpRequest(() =>
      dateType && dateType !== ''
        ? axiosInstance.get(
            `/api/purchase?${category}.contains=${keyword}&status.contains=${orderStatus}&${dateType}.from=${startDate}&${dateType}.to=${endDate}`
          )
        : axiosInstance.get(
            `/api/purchase?${category}.contains=${keyword}&status.contains=${orderStatus}&status.notEqual=COMPLETED`
          )
    )
  } else {
    response = await httpRequest(() =>
      dateType && dateType !== ''
        ? axiosInstance.get(
            `/api/orders?${category}.contains=${keyword}&status.contains=${orderStatus}&${dateType}.from=${startDate}&${dateType}.to=${endDate}`
          )
        : axiosInstance.get(
            `/api/orders?${category}.contains=${keyword}&status.contains=${orderStatus}`
          )
    )
  }
  // const response = await httpRequest(() =>
  //   category !== 'registrationDate' && category !== 'deliveryDate'
  //     ? axiosInstance.get(
  //         `/api/orders?${category}.contains=${keyword}&registrationDate.from=${startDate}&registrationDate.to=${endDate}&deliveryDate.from=${startDate}&deliveryDate.to=${endDate}`
  //       )
  //     : axiosInstance.get(`/api/orders?${category}.form=${startDate}&${category}.to=${endDate}`)
  // )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data.content }

  //for beta:test
  // let newMock = chunkArray(mockData, pageSize, page)

  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: [],
  }
}
