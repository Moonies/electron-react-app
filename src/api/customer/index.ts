import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { default as addNewCustomer, AddNewCustomerProps } from './addNewCustomer'
import { default as deleteCustomer } from './deleteCustomer'
import { default as getCustomerDetailById, CustomerDetailData } from './getCustomerDetailById'
import { default as getCustomerList, CustomerData } from './getCustomerList'
import { default as updateCustomerDetail, UpdateCustomerDetailProps } from './updateCustomerDetail'

export interface CustomerApi {
  addNewCustomer: (params: AddNewCustomerProps) => Promise<ApiResponse<{}>>
  deleteCustomer: (customerId: string) => Promise<ApiResponse<{}>>
  getCustomerDetailById: (customerCode: string) => Promise<ApiResponse<CustomerDetailData>>
  getCustomerList: (page?: number, pageSize?: number) => Promise<ApiResponse<CustomerData[]>>
  updateCustomerDetail: (params: UpdateCustomerDetailProps) => Promise<ApiResponse<{}>>
}

export default function customer(httpRequest: HttpRequest): CustomerApi {
  return {
    addNewCustomer: params => addNewCustomer(httpRequest, params),
    deleteCustomer: customerId => deleteCustomer(httpRequest, customerId),
    getCustomerDetailById: customerCode => getCustomerDetailById(httpRequest, customerCode),
    getCustomerList: (page, pageSize) => getCustomerList(httpRequest, { page, pageSize }),
    updateCustomerDetail: params => updateCustomerDetail(httpRequest, params),
  }
}
