import { ReportSearchCriteria } from 'api/report'
import { BestSaleProductReportData } from 'api/report/getBestSaleProductReportData'
import { ProfitReportData } from 'api/report/getProfitReportData'
import { SaleReportData } from 'api/report/getSaleReportData'
import { WorstProductReportData } from 'api/report/getWorstSaleProductReportData'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'
import { useState } from 'react'

export interface SummaryData {
  totalSale: number
  totalAmountSale: number
  totalCost: number
  totalProfit: number
  totalTarget: number
}

interface SummaryPreviousData {
  previousSale: number
  previousAmountSale: number
  previousCost: number
  previousProfit: number
}

export interface SummaryCompareData {
  saleData: number
  amountSaleData: number
  costData: number
  profitData: number
}

export default function useReport() {
  const [saleChartData, setSaleChartData] = useState<SaleReportData[]>()
  const [profitChartData, setProfitChartData] = useState<ProfitReportData[]>()
  const [bestSaleProductChartData, setBestSaleProductChartData] =
    useState<BestSaleProductReportData[]>()
  const [worstSaleProductChartData, setWorstSaleProductChartData] =
    useState<WorstProductReportData[]>()
  const [progressChartData, setProgressChartData] = useState<
    {
      name: string
      value: number
    }[]
  >()
  const [inProgessValue, setInProgressValue] = useState<number>()
  const [summaryData, setSummaryData] = useState<SummaryData>()
  const [summaryCompareData, setSummaryCompareData] = useState<SummaryCompareData>()
  const { api } = useHttp()
  let summaryPreviousData: SummaryPreviousData = {
    previousSale: 0,
    previousAmountSale: 0,
    previousCost: 0,
    previousProfit: 0,
  }

  const labelConvert = {
    totalUnit: 'Custom UV Label',
    totalProfit: '総利益',
    quantityPercent: '数量',
    profitPercent: '売上',
    totalSale: '売上',
    totalPreSale: '予測販売値',
    totalTarget: '目標',
  }
  const { withLoading, setLoading } = useLoading()

  const customLegendFormatter = (value: string) => {
    const labelMap: { [key: string]: string } = labelConvert
    return labelMap[value] || value
  }

  const convertTooltip = (label: string, value: number | string) => {
    const labelMap: { [key: string]: string } = labelConvert
    return `${labelMap[label]} : ${value}` || value
  }

  const currencyFormatter = (value = 0, typeValue: 'percent' | 'currency' | '') => {
    switch (typeValue) {
      case 'currency':
        return new Intl.NumberFormat('ja-JP', {
          style: 'currency',
          currency: 'JPY',
        }).format(value)
      case 'percent':
        return `${value}%`
      default:
        return ''
    }
  }

  const formatTextDisplay = (rawData?: number): string => {
    if (rawData) {
      if (Math.abs(rawData) >= 100000000) {
        return `${(rawData / 100000000).toFixed(2)} 億円`
      } else if (Math.abs(rawData) >= 1000000) {
        return `${(rawData / 1000000).toFixed(2)} 百万円`
      } else if (Math.abs(rawData) >= 10000) {
        return `${(rawData / 10000).toFixed(2)} 万円`
      } else if (Math.abs(rawData) >= 1000) {
        return `${(rawData / 1000).toFixed(2)} 千円`
      } else return `${rawData}`
    } else return ''
  }

  const formatTextCompare = (rawData: number | undefined, typeText?: 'amount') => {
    if (rawData) {
      let mark = rawData >= 0 ? '▲' : '▼'
      let newText = typeText === 'amount' ? rawData : formatTextDisplay(rawData)
      return mark + newText
    }
    return null
  }

  const checkTextColor = (rawData: number | undefined): string =>
    rawData && rawData >= 0 ? '#02facb' : '#FF0606'

  const getSummary = async (searchCriteria: ReportSearchCriteria) => {
    //call api and get summary data with date
    let resultFromApi = {
      totalAmountSale: 30040040,
      totalCost: 100515,
      totalProfit: 23400000,
      totalSale: 12000000,
      totalTarget: 500000000,
    }
    setSummaryData(resultFromApi)
    //and call api get previous data
    summaryPreviousData = {
      previousAmountSale: 5689044,
      previousCost: 95004,
      previousProfit: 28400000,
      previousSale: 1200000,
    }

    // should use value from api for error when forgot clear state
    setSummaryCompareData({
      amountSaleData:
        (resultFromApi?.totalAmountSale ?? 0) - summaryPreviousData.previousAmountSale,
      costData: (resultFromApi?.totalCost ?? 0) - summaryPreviousData.previousCost,
      profitData: (resultFromApi?.totalProfit ?? 0) - summaryPreviousData.previousProfit,
      saleData: (resultFromApi?.totalSale ?? 0) - summaryPreviousData.previousSale,
    })
    let totalSale = 56 // this value from API totalSale(form Sale Table) / resultSumKpi(form KPI Table)
    setInProgressValue(totalSale)
    setProgressChartData([
      { name: 'Completed', value: totalSale },
      { name: 'Remaining', value: 100 - totalSale },
    ])
  }

  const getSaleReport = async (searchCriteria: ReportSearchCriteria) => {
    const result = await withLoading(api.report.getSaleReportData(searchCriteria))
    if (result.code === 200 && result.data) {
      setSaleChartData(result.data)
    }
  }

  const getProfitReport = async (searchCriteria: ReportSearchCriteria) => {
    const result = await withLoading(api.report.getProfitReportData(searchCriteria))
    if (result.code === 200 && result.data) {
      setProfitChartData(result.data)
    }
  }

  const getBestSaleProductReport = async (searchCriteria: ReportSearchCriteria) => {
    const result = await withLoading(api.report.getBestSaleProductReportData(searchCriteria))
    if (result.code === 200 && result.data) {
      setBestSaleProductChartData(result.data)
    }
  }

  const getWorstSaleProductReport = async (searchCriteria: ReportSearchCriteria) => {
    const result = await withLoading(api.report.getWorstSaleProductReportData(searchCriteria))
    if (result.code === 200 && result.data) {
      setWorstSaleProductChartData(result.data)
    }
  }
  return {
    saleChartData,
    profitChartData,
    bestSaleProductChartData,
    worstSaleProductChartData,
    getSaleReport,
    getProfitReport,
    getBestSaleProductReport,
    getWorstSaleProductReport,
    customLegendFormatter,
    convertTooltip,
    currencyFormatter,
    progressChartData,
    inProgessValue,
    getSummary,
    formatTextDisplay,
    summaryData,
    formatTextCompare,
    summaryCompareData,
    checkTextColor,
  }
}
