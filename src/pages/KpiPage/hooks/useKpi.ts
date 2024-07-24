import React, { useState } from 'react'
import { kpi } from 'api/index'
import dayjs from 'dayjs'
import useLoading from 'hooks/useLoading'
import { KpiData } from 'api/kpi/kpiData'

export interface FinancialKpiData {
  planSalesRevenue?: number
  planVariableCosts?: number
  planFixedCosts?: number
  planMarginalProfit?: number
  planMarginalProfitRate?: string
  planOperatingIncome?: number
  planOperatingExpenses?: number
  planOrdinaryProfit?: number
  actualSalesRevenue?: number
  actualVariableCosts?: number
  actualFixedCosts?: number
  actualMarginalProfit?: number
  actualMarginalProfitRate?: string
  actualOperatingIncome?: number
  actualOperatingExpenses?: number
  actualOrdinaryProfit?: number
  resultOrdinaryProfit?: number
  resultSalesRevenue?: number
  resultSalesRevenueIncreaseRate?: string
  resultFixedCosts?: number
  resultOperatingIncome?: string
  resultOperatingExpenses?: string
  resultSubTotal?: number
}

export interface SettingPlanFinancialKpiData {
  settingSalesRevenue?: number
  settingVariableCosts?: number
  settingFixedCosts?: number
  settingMarginalProfit?: number
  settingMarginalProfitRate?: string
  settingOperatingIncome?: number
  settingOperatingExpenses?: number
  settingOrdinaryProfit?: number
}

const calculatedFields: (keyof FinancialKpiData)[] = [
  'planMarginalProfit',
  'planMarginalProfitRate',
  'planOrdinaryProfit',
  'actualMarginalProfit',
  'actualMarginalProfitRate',
  'actualOrdinaryProfit',
  'resultOrdinaryProfit',
  'resultSalesRevenue',
  'resultSalesRevenueIncreaseRate',
  'resultFixedCosts',
  'resultOperatingIncome',
  'resultOperatingExpenses',
  'resultSubTotal',
]
export default function useKpi() {
  const [kpiData, setKpiData] = useState<FinancialKpiData>({})
  const convertDivider = 1000000
  const currentYear = dayjs().get('year')
  const { withLoading } = useLoading()

  const getKpiData = async () => {
    const result = await withLoading(kpi().kpiData({ selectedYear: currentYear }))
    if (result.code == 200 && result.data) {
      let convertKpiData = convertToPercentages(result.data)
      // Reset only calculated fields
      // const resetData = kpiData
      // calculatedFields.forEach(field => {
      //   resetData[field] = undefined
      // })
      setKpiData({ ...convertKpiData })
    }
  }

  function convertToPercentages(obj: KpiData): FinancialKpiData {
    const result: Record<string, number> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = value / convertDivider
    }
    return result
  }
  const isUndefined = (rawData: number | undefined): number => (rawData === undefined ? 0 : rawData)

  const formattedNumber = (rawData: number): string =>
    `${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(rawData * 100)}%`

  const kpiCalculate = (formInput: KpiData) => {
    let result: FinancialKpiData = {}
    let planMarginalProfit = 0
    result.planMarginalProfit =
      isUndefined(formInput.planSalesRevenue) - isUndefined(formInput.planVariableCosts)
    result.planMarginalProfitRate = formattedNumber(
      result.planMarginalProfit / isUndefined(formInput.planSalesRevenue)
    )
    result.planOrdinaryProfit =
      isUndefined(formInput.planSalesRevenue) -
      isUndefined(formInput.planVariableCosts) -
      isUndefined(formInput.planFixedCosts) +
      isUndefined(formInput.planOperatingIncome) -
      isUndefined(formInput.planOperatingExpenses)
    planMarginalProfit = result.planMarginalProfit / isUndefined(formInput.planSalesRevenue)
    result.actualMarginalProfit =
      isUndefined(formInput.actualSalesRevenue) - isUndefined(formInput.actualVariableCosts)
    result.actualMarginalProfitRate = formattedNumber(
      result.actualMarginalProfit / isUndefined(formInput.actualSalesRevenue)
    )
    result.actualOrdinaryProfit =
      isUndefined(formInput.actualSalesRevenue) -
      isUndefined(formInput.actualVariableCosts) -
      isUndefined(formInput.actualFixedCosts) +
      isUndefined(formInput.actualOperatingIncome) -
      isUndefined(formInput.actualOperatingExpenses)

    result.resultOrdinaryProfit = result.actualOrdinaryProfit - result.planOrdinaryProfit
    result.resultSalesRevenue =
      (isUndefined(formInput.actualSalesRevenue) - isUndefined(formInput.planSalesRevenue)) *
      planMarginalProfit
    result.resultFixedCosts =
      isUndefined(result.actualFixedCosts) - isUndefined(result.planFixedCosts)
    result.resultOperatingExpenses = (
      isUndefined(formInput.actualOperatingExpenses) - isUndefined(formInput.planOperatingExpenses)
    ).toString()
    result.resultSalesRevenueIncreaseRate = (
      (result.actualMarginalProfit - result.planMarginalProfit) *
      isUndefined(formInput.actualSalesRevenue)
    ).toString()
    result.resultFixedCosts =
      isUndefined(formInput.planFixedCosts) - isUndefined(formInput.actualFixedCosts)
    result.resultOperatingIncome = (
      isUndefined(formInput.actualOperatingIncome) - isUndefined(formInput.planOperatingIncome)
    ).toString()
    result.resultOperatingExpenses = (
      isUndefined(formInput.actualOperatingExpenses) - isUndefined(formInput.planOperatingExpenses)
    ).toString()
    setKpiData({ ...formInput, ...result })
  }
  const isShrink = (value: number | undefined | string): boolean => !!value || value === 0

  return { kpiData, getKpiData, isShrink, kpiCalculate }
}
