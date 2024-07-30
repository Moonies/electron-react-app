import { api } from 'api/index'
import { BestSaleProductReportData } from 'api/report/getBestSaleProductReportData'
import { ProfitReportData } from 'api/report/getProfitReportData'
import { SaleReportData, SearchCriteria } from 'api/report/getSaleReportData'
import { WorstProductReportData } from 'api/report/getWorstSaleProductReportData'
import useLoading from 'hooks/useLoading'
import React, { useState } from 'react'

export default function useReport() {
  const [saleChartData, setSaleChartData] = useState<SaleReportData[]>()
  const [profitChartData, setProfitChartData] = useState<ProfitReportData[]>()
  const [bestSaleProductChartData, setBestSaleProductChartData] =
    useState<BestSaleProductReportData[]>()
  const [worstSaleProductChartData, setWorstSaleProductChartData] =
    useState<WorstProductReportData[]>()

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

  const getSaleReport = async (searchCriteria: SearchCriteria) => {
    const result = await withLoading(api.report().getSaleReportData(searchCriteria))
    if (result.code === 200 && result.data) {
      setSaleChartData(result.data)
    }
  }

  const getProfitReport = async (searchCriteria: SearchCriteria) => {
    const result = await withLoading(api.report().getProfitReportData(searchCriteria))
    if (result.code === 200 && result.data) {
      setProfitChartData(result.data)
    }
  }

  const getBestSaleProductReport = async (searchCriteria: SearchCriteria) => {
    const result = await withLoading(api.report().getBestSaleProductReportData(searchCriteria))
    if (result.code === 200 && result.data) {
      setBestSaleProductChartData(result.data)
    }
  }

  const getWorstSaleProductReport = async (searchCriteria: SearchCriteria) => {
    const result = await withLoading(api.report().getWorstSaleProductReportData(searchCriteria))
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
  }
}
