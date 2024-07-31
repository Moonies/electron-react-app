import { default as getSaleReportData } from './getSaleReportData'
import { default as getProfitReportData } from './getProfitReportData'
import { default as getWorstSaleProductReportData } from './getWorstSaleProductReportData'
import { default as getBestSaleProductReportData } from './getBestSaleProductReportData'

export interface ReportSearchCriteria {
  category: string
  startDate: Date
  endDate: Date
}

export default function report() {
  return {
    getSaleReportData,
    getProfitReportData,
    getWorstSaleProductReportData,
    getBestSaleProductReportData,
  }
}
