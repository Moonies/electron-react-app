import { ReportSearchCriteria } from 'api/report'
import { BestSaleProductReportData } from 'api/report/getBestSaleProductReportData'
import { ProfitReportData } from 'api/report/getProfitReportData'
import { SaleReportData } from 'api/report/getSaleReportData'
import { WorstProductReportData } from 'api/report/getWorstSaleProductReportData'
import dayjs from 'dayjs'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'
import { useState } from 'react'
import { addCommasToNumber, formatJPY } from 'utils/formatUtils'

export interface SummaryData {
  totalSale: number
  totalAmountSale: number
  totalCost: number
  totalProfit: number
  totalTarget: number
  totalUnit: number
}

interface SummaryPreviousData {
  previousSale: number
  previousAmountSale: number
  previousCost: number
  previousProfit: number
  previousUnit: number
}

export interface SummaryCompareData {
  saleData: number
  amountSaleData: number
  costData: number
  profitData: number
  unitData: number
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
    previousUnit: 0,
  }

  const labelConvert = {
    totalUnit: 'Custom UV Label',
    totalProfit: '総利益',
    quantityPercentage: '数量',
    profitPercentage: '売上',
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
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        }).format(value)
      case 'percent':
        return `${value.toFixed(3)}%`
      default:
        return value
    }
  }

  const formatTextDisplay = (rawData?: number, fixed = false): string => {
    if (rawData) {
      if (Math.abs(rawData) >= 100000000) {
        return `${fixed ? (rawData / 100000000).toFixed(3) : rawData / 100000000} 億円`
      } else if (Math.abs(rawData) >= 1000000) {
        return `${fixed ? (rawData / 1000000).toFixed(3) : rawData / 1000000} 百万円`
      } else if (Math.abs(rawData) >= 10000) {
        return `${fixed ? (rawData / 10000).toFixed(3) : rawData / 1000000} 万円`
      } else if (Math.abs(rawData) >= 1000) {
        return `${fixed ? (rawData / 1000).toFixed(3) : rawData / 1000000} 千円`
      } else return `${rawData}円`
    } else return `${rawData}円`
  }

  const formatTextCompare = (rawData: number | undefined, typeText?: 'quantity') => {
    if (rawData) {
      let mark = rawData >= 0 ? '▲' : '▼'
      let newText =
        typeText === 'quantity' ? addCommasToNumber(rawData) : formatTextDisplay(rawData)
      return mark + newText
    }
    return null
  }

  const checkTextColor = (rawData: number | undefined): string =>
    rawData && rawData >= 0 ? '#02facb' : '#FF0606'

  const getSummary = async (searchCriteria: ReportSearchCriteria) => {
    setLoading(true)
    const start = dayjs(searchCriteria.startDate)
    const end = dayjs(searchCriteria.endDate)
    // Calculate year difference
    let yearDiff = end.diff(start, 'year')
    yearDiff = yearDiff === 0 ? 1 : yearDiff

    //call api and get summary data with date
    const resultTotalSummary = await getTotalSaleSummary(searchCriteria)
    const resultTotalAmount = await getTotalSaleAmount(searchCriteria)
    const resultTotalProfit = await getTotalProfit(searchCriteria)
    let resultFromApi = {
      totalAmountSale: resultTotalAmount,
      totalCost: resultTotalSummary?.totalCost ?? 0,
      totalProfit: resultTotalProfit?.totalProfit ?? 0,
      totalSale: resultTotalSummary?.totalSale ?? 0,
      totalTarget: (resultTotalSummary?.totalTarget ?? 0) / yearDiff,
      totalUnit: resultTotalProfit?.totalUnit ?? 0,
    }
    setSummaryData(resultFromApi)

    //and call api get previous data
    const preveiousDate = calculateDateDifference(searchCriteria.startDate, searchCriteria.endDate)
    const previousTotalAmount = await getTotalSaleAmount({
      ...searchCriteria,
      startDate: preveiousDate.startDate,
      endDate: preveiousDate.endDate,
    })
    const previousTotalSummary = await getTotalSaleSummary({
      ...searchCriteria,
      startDate: preveiousDate.startDate,
      endDate: preveiousDate.endDate,
    })
    const previousTotalProfit = await getTotalProfit({
      ...searchCriteria,
      startDate: preveiousDate.startDate,
      endDate: preveiousDate.endDate,
    })
    summaryPreviousData = {
      previousAmountSale: previousTotalAmount,
      previousCost: previousTotalSummary?.totalCost ?? 0,
      previousProfit: previousTotalProfit?.totalProfit ?? 0,
      previousSale: previousTotalSummary?.totalSale ?? 0,
      previousUnit: previousTotalProfit?.totalUnit ?? 0,
    }

    // should use value from api for error when forgot clear state
    setSummaryCompareData({
      amountSaleData: resultFromApi.totalAmountSale - summaryPreviousData.previousAmountSale,
      costData: resultFromApi.totalCost - summaryPreviousData.previousCost,
      profitData: resultFromApi.totalProfit - summaryPreviousData.previousProfit,
      saleData: resultFromApi.totalSale - summaryPreviousData.previousSale,
      unitData: resultFromApi.totalUnit - summaryPreviousData.previousUnit,
    })

    //###performace chart
    // this value from API totalSale(form Sale Table) / resultSumKpi(form KPI Table)
    let totalSale = resultFromApi.totalAmountSale / resultFromApi.totalTarget
    totalSale = isNaN(totalSale) ? 0 : totalSale
    setInProgressValue(totalSale)
    setProgressChartData([
      { name: 'Completed', value: totalSale },
      { name: 'Remaining', value: 100 - totalSale },
    ])
    setLoading(false)
  }
  const ensureDataCoverage = <T extends { label: string }>(
    existingData: T[],
    startDate: string,
    endDate: string,
    label: string
  ) => {
    // Parse start and end dates
    const parseDate = (dateString: string) => {
      const [year, month, day] = dateString.split('-').map(Number)
      return { year, month }
    }

    const start = parseDate(startDate)
    const end = parseDate(endDate)

    // Create a copy of existing data
    const result = [...existingData]
    // Get the structure of default values from the first item or create empty object if no data
    const defaultTemplate = existingData[0] || {}
    const createEmptyEntry = (newLabel: string): T => {
      // Create new object with all properties from template
      const entry = Object.entries(defaultTemplate).reduce(
        (acc, [key, value]) => {
          if (key === 'label') {
            acc[key] = newLabel
          } else {
            acc[key] = typeof value === 'number' ? 0 : value
          }
          return acc
        },
        {} as Record<string, string | number>
      ) as T

      return entry
    }

    // Find existing labels
    const existingLabels = new Set(existingData.map(item => item.label))

    // Generate missing labels
    for (let year = start.year; year <= end.year; year++) {
      if (label === 'YEAR') {
        // Handle year-level granularity
        const yearLabel = year.toString()
        if (!existingLabels.has(yearLabel)) {
          result.push(createEmptyEntry(yearLabel))
        }
      } else {
        // Handle month-level granularity
        const startMonth = year === start.year ? start.month : 1
        const endMonth = year === end.year ? end.month : 12

        for (let month = startMonth; month <= endMonth; month++) {
          const monthLabel = `${year}-${month.toString().padStart(2, '0')}`

          if (!existingLabels.has(monthLabel)) {
            result.push(createEmptyEntry(monthLabel))
          }
        }
      }
    }
    // Sort the array by label
    return result.sort((a, b) => a.label.localeCompare(b.label))
  }

  const calculateDateDifference = (startDate: string | Date, endDate: string | Date) => {
    const start = dayjs(startDate)
    const end = dayjs(endDate)

    // Calculate year difference
    let yearDiff = end.diff(start, 'year')

    // If yearDiff is 0, use 1 year instead
    yearDiff = yearDiff === 0 ? 1 : yearDiff

    // Keep the same month and day from start date
    const calculatedStartDate = start.subtract(yearDiff, 'year').format('YYYY-MM-DD')
    const calculatedEndDate = end.subtract(yearDiff, 'year').format('YYYY-MM-DD')

    return {
      startDate: calculatedStartDate,
      endDate: calculatedEndDate,
    }
  }

  const transformSalesData = (salesData: SaleReportData[]) => {
    return salesData.map(item => ({
      ...item,
      totalSale: Number(item.totalSale / 1000000),
      totalOrder: Number(item.totalOrder / 1000000),
      totalPreSale: Number(item.totalPreSale / 1000000),
      totalTarget: Number(item.totalTarget / 1000000),
    }))
  }

  const transformProfitData = (profitData: ProfitReportData[]) => {
    return profitData.map(item => ({
      ...item,
      totalProfit: Number(item.totalProfit / 1000000),
    }))
  }

  const getSaleReport = async (searchCriteria: ReportSearchCriteria) => {
    const result = await api.report.getSaleReportData(searchCriteria)
    if (result.code === 200 && result.data) {
      const convertSaleData =
        result.data.length > 0
          ? transformSalesData(result.data)
          : [
              {
                label:
                  searchCriteria.category === 'YEAR'
                    ? dayjs(searchCriteria.endDate).format('YYYY')
                    : dayjs(searchCriteria.endDate).format('YYYY-MM'),
                totalSale: 0,
                totalOrder: 0,
                totalPreSale: 0,
                totalTarget: 0,
                totalCost: 0,
              },
            ] //set default when data is all empty
      const newSaleChartData = ensureDataCoverage<SaleReportData>(
        convertSaleData,
        dayjs(searchCriteria.startDate).format('YYYY-MM-DD'),
        dayjs(searchCriteria.endDate).format('YYYY-MM-DD'),
        searchCriteria.category
      )
      setSaleChartData(newSaleChartData)
    }
  }

  const getProfitReport = async (searchCriteria: ReportSearchCriteria) => {
    const result = await api.report.getProfitReportData(searchCriteria)
    if (result.code === 200 && result.data) {
      const convertProfitData =
        result.data.length > 0
          ? transformProfitData(result.data)
          : [
              {
                label:
                  searchCriteria.category === 'YEAR'
                    ? dayjs(searchCriteria.endDate).format('YYYY')
                    : dayjs(searchCriteria.endDate).format('YYYY-MM'),
                totalUnit: 0,
                totalProfit: 0,
              },
            ] //set default when data is all empty
      const newProfitData = ensureDataCoverage<ProfitReportData>(
        convertProfitData,
        dayjs(searchCriteria.startDate).format('YYYY-MM-DD'),
        dayjs(searchCriteria.endDate).format('YYYY-MM-DD'),
        searchCriteria.category
      )
      setProfitChartData(newProfitData)
    }
  }

  const getBestSaleProductReport = async (searchCriteria: ReportSearchCriteria) => {
    const result = await api.report.getBestSaleProductReportData(searchCriteria)
    if (result.code === 200 && result.data) {
      setBestSaleProductChartData(result.data)
    }
  }

  const getWorstSaleProductReport = async (searchCriteria: ReportSearchCriteria) => {
    const result = await api.report.getWorstSaleProductReportData(searchCriteria)
    if (result.code === 200 && result.data) {
      setWorstSaleProductChartData(result.data)
    }
  }

  const getTotalSaleSummary = async (searchCriteria: ReportSearchCriteria) => {
    const result = await api.report.getSaleReportData(searchCriteria)
    if (result.code === 200 && result.data) {
      return result.data.reduce(
        (acc, curr) => {
          return {
            totalSale: acc.totalSale + curr.totalSale,
            totalOrder: acc.totalOrder + curr.totalOrder,
            totalPreSale: acc.totalPreSale + curr.totalPreSale,
            totalTarget: acc.totalTarget + curr.totalTarget,
            totalCost: acc.totalCost + curr.totalCost,
          }
        },
        {
          totalSale: 0,
          totalOrder: 0,
          totalPreSale: 0,
          totalTarget: 0,
          totalCost: 0,
        }
      )
    }
  }

  const getTotalProfit = async (searchCriteria: ReportSearchCriteria) => {
    const result = await api.report.getProfitReportData(searchCriteria)
    if (result.code === 200 && result.data) {
      return result.data.reduce(
        (acc, curr) => {
          return {
            totalUnit: acc.totalUnit + curr.totalUnit,
            totalProfit: acc.totalProfit + curr.totalProfit,
          }
        },
        {
          totalUnit: 0,
          totalProfit: 0,
        }
      )
    }
  }
  const getTotalSaleAmount = async (searchCriteria: ReportSearchCriteria) => {
    const result = await api.sale.getSaleTotalAmount({
      dateType: 'shipmentDate',
      startDate: dayjs(searchCriteria.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(searchCriteria.endDate).format('YYYY-MM-DD'),
      category: '',
      keyword: '',
    })
    if (result.code === 200 && result.data) {
      return result.data
    }
    return 0
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
    calculateDateDifference,
  }
}
