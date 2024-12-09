import { default as getSaleList, SearchCriteria, SaleData } from './getSaleList'
import { default as getSaleDetail, SaleDetail } from './getSaleDetail'
import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { default as addNewSale, AddNewSaleOrderProps } from './addNewSale'
import { default as updateSaleDetail, NewSaleDetailProps } from './updateSaleDetail'
import { default as deleteSale } from './deleteSale'
import { default as updateSaleStatus } from './updateSaleStatus'
import {
  default as getSaleTotalAmount,
  SearchCriteria as TotalAmountSerachCriteria,
} from './getSaleTotalAmount'

export enum SaleStatus {
  INVOICE_PENDING = 'invoice_pending',
  PENDING = 'PENDING',
  CONFIRM = 'CONFIRM',
  ON_DELIVERY = 'SHIP',
  DELIVERED = 'COMPLETE',
  CANCEL = 'CANCEL',
}

export interface SaleApi {
  getSaleList: (params: SearchCriteria) => Promise<ApiResponse<SaleData[]>>
  getSaleDetail: (saleId: string) => Promise<ApiResponse<SaleDetail>>
  getSaleTotalAmount: (params: TotalAmountSerachCriteria) => Promise<ApiResponse<number>>
  addNewSale: (params: AddNewSaleOrderProps) => Promise<ApiResponse<{}>>
  updateSaleDetail: (params: NewSaleDetailProps) => Promise<ApiResponse<{}>>
  deleteSale: (saleId: string) => Promise<ApiResponse<{}>>
  updateSaleStatus: (saleId: string, status: SaleStatus) => Promise<ApiResponse<{}>>
}

export default function sale(httpRequest: HttpRequest): SaleApi {
  return {
    getSaleList: params => getSaleList(httpRequest, params),
    getSaleDetail: saleId => getSaleDetail(httpRequest, saleId),
    getSaleTotalAmount: params => getSaleTotalAmount(httpRequest, params),
    addNewSale: params => addNewSale(httpRequest, params),
    updateSaleDetail: params => updateSaleDetail(httpRequest, params),
    deleteSale: saleId => deleteSale(httpRequest, saleId),
    updateSaleStatus: (saleId, status) => updateSaleStatus(httpRequest, saleId, status),
  }
}
