import { default as getSaleReportData, SaleReportData } from './getSaleReportData'
import { default as getProfitReportData, ProfitReportData } from './getProfitReportData'
import {
  default as getWorstSaleProductReportData,
  WorstProductReportData,
} from './getWorstSaleProductReportData'
import {
  default as getBestSaleProductReportData,
  BestSaleProductReportData,
} from './getBestSaleProductReportData'
import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface ReportSearchCriteria {
  category: string
  startDate: Date | string
  endDate: Date | string
}

export interface ReportApi {
  getSaleReportData: (params: ReportSearchCriteria) => Promise<ApiResponse<SaleReportData[]>>
  getProfitReportData: (params: ReportSearchCriteria) => Promise<ApiResponse<ProfitReportData[]>>
  getWorstSaleProductReportData: (
    params: ReportSearchCriteria
  ) => Promise<ApiResponse<WorstProductReportData[]>>
  getBestSaleProductReportData: (
    params: ReportSearchCriteria
  ) => Promise<ApiResponse<BestSaleProductReportData[]>>
}

export default function report(httpRequest: HttpRequest): ReportApi {
  return {
    getSaleReportData: params => getSaleReportData(httpRequest, params),
    getProfitReportData: params => getProfitReportData(httpRequest, params),
    getWorstSaleProductReportData: params => getWorstSaleProductReportData(httpRequest, params),
    getBestSaleProductReportData: params => getBestSaleProductReportData(httpRequest, params),
  }
}
