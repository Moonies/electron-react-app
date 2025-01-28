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
  status?: `${OrderStatus}` | string
  orderType?: OrderType
  dateType?: string
}
type Company = {
  id: string
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
  invoiceNumber: string
  company: Company
  orderRequestEmployeeId: string
  orderRequestEmployeeName: string
  orderApprovedEmployeeId: string
  orderApprovedEmployeeName: string
  quotationRequestDate: string | Dayjs
  registDate: string | Dayjs
  planShipmentDate: string | Dayjs
  shipmentDate: string | Dayjs
  planDeliveryDate: string | Dayjs
  deliveryDate: string | Dayjs
  paymentDueDate: string | Dayjs
  status: string
  orderType: OrderType
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
    status = '',
    page = 0,
    pageSize = 10,
    dateType,
    orderType = OrderType.ALL,
  }: OrderSearchCriteria
): Promise<ApiResponse<OrderData[]>> {
  let response
  if (orderType === OrderType.SALE) {
    // api/sales status is not completed
    response = await httpRequest(() =>
      dateType && dateType !== ''
        ? axiosInstance.get(
            `/api/sales?${category}.contains=${keyword}&status.contains=${status}&status.notEqual=COMPLETED&${dateType}.from=${startDate}&${dateType}.to=${endDate}&page=${page}&size=${pageSize}`
          )
        : axiosInstance.get(
            `/api/sales?${category}.contains=${keyword}&status.contains=${status}&status.notEqual=COMPLETED&page=${page}&size=${pageSize}`
          )
    )
  } else if (orderType === OrderType.PURCHASE) {
    // api/purchase status is not completed
    response = await httpRequest(() =>
      dateType && dateType !== ''
        ? axiosInstance.get(
            `/api/purchases?${category}.contains=${keyword}&status.contains=${status}&status.notEqual=COMPLETED&${dateType}.from=${startDate}&${dateType}.to=${endDate}&page=${page}&size=${pageSize}`
          )
        : axiosInstance.get(
            `/api/purchases?${category}.contains=${keyword}&status.contains=${status}&status.notEqual=COMPLETED&page=${page}&size=${pageSize}`
          )
    )
  } else {
    response = await httpRequest(() =>
      dateType && dateType !== ''
        ? axiosInstance.get(
            `/api/orders?${category}.contains=${keyword}&status.contains=${status}&${dateType}.from=${startDate}&${dateType}.to=${endDate}&status.notEqual=COMPLETED&page=${page}&size=${pageSize}`
          )
        : axiosInstance.get(
            `/api/orders?${category}.contains=${keyword}&status.contains=${status}&status.notEqual=COMPLETED&page=${page}&size=${pageSize}`
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
  return { code: 200, message: 'success', data: response?.data.content, page: response?.data.page }
}
