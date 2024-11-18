import { default as getSaleList, SearchCriteria, SaleData } from './getSaleList'
import { default as getSaleDetail, SaleDetail } from './getSaleDetail'
import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { default as addNewSale, AddNewSaleOrderProps } from './addNewSale'
import { default as updateSaleDetail, NewSaleDetailProps } from './updateSaleDetail'
import { default as deleteSale } from './deleteSale'
import { default as updateSaleStatus } from './updateSaleStatus'

export enum SaleStatus {
  INVOICE_PENDING = 'invoice_pending',
  PENDING = 'PENDING',
  CONFIRM = 'CONFIRMED',
  ON_DELIVERY = 'SHIPPED',
  DELIVERED = 'COMPLETED',
  CANCEL = 'CANCEL',
}

export interface SaleApi {
  getSaleList: (params: SearchCriteria) => Promise<ApiResponse<SaleData[]>>
  getSaleDetail: (saleId: string) => Promise<ApiResponse<SaleDetail>>
  addNewSale: (params: AddNewSaleOrderProps) => Promise<ApiResponse<{}>>
  updateSaleDetail: (params: NewSaleDetailProps) => Promise<ApiResponse<{}>>
  deleteSale: (saleId: string) => Promise<ApiResponse<{}>>
  updateSaleStatus: (saleId: string, status: SaleStatus) => Promise<ApiResponse<{}>>
}

export default function sale(httpRequest: HttpRequest): SaleApi {
  return {
    getSaleList: params => getSaleList(httpRequest, params),
    getSaleDetail: saleId => getSaleDetail(httpRequest, saleId),
    addNewSale: params => addNewSale(httpRequest, params),
    updateSaleDetail: params => updateSaleDetail(httpRequest, params),
    deleteSale: saleId => deleteSale(httpRequest, saleId),
    updateSaleStatus: (saleId, status) => updateSaleStatus(httpRequest, saleId, status),
  }
}
