import { useState } from 'react'
import dayjs from 'dayjs'
import useLoading from 'hooks/useLoading'
import { KpiData } from 'api/kpi/getKpiData'
import { AddNewKpiData } from 'api/kpi/addNewKpiData'
import useNotification from 'hooks/useNotification'
import { useConfirmModal } from 'hooks/useConfirmModal'
import useHttp from 'hooks/useHttp'
import { addCommasToNumber, removeCommasToNumber } from 'utils/formatUtils'

export interface FinancialKpiData {
  planSalesRevenue: number | null
  planVariableCosts: number | null
  planFixedCosts: number | null
  planMarginalProfit?: number
  planMarginalProfitRate?: string
  planOperatingIncome: number | null
  planOperatingExpenses: number | null
  planOrdinaryProfit?: number
  actualSalesRevenue: number | null
  actualVariableCosts: number | null
  actualFixedCosts: number | null
  actualMarginalProfit?: number
  actualMarginalProfitRate?: string
  actualOperatingIncome: number | null
  actualOperatingExpenses: number | null
  actualOrdinaryProfit?: number
  resultOrdinaryProfit?: string
  resultSalesRevenue?: string
  resultSalesRevenueIncreaseRate?: string
  resultFixedCosts?: string
  resultOperatingIncome?: string
  resultOperatingExpenses?: string
  resultSubTotal?: string
}

export interface SettingPlanFinancialKpiData {
  settingSalesRevenue: number | null
  settingVariableCosts: number | null
  settingFixedCosts?: number
  settingMarginalProfit?: number
  settingMarginalProfitRate?: string
  settingOperatingIncome?: number
  settingOperatingExpenses?: number
  settingOrdinaryProfit?: number
}

// Define a type for the object
type MyObject = {
  [key: string]: number | null
}

// Define a type for the processed object that maintains the same structure
type ProcessedObject<T extends MyObject> = {
  [K in keyof T]: number | null
}
export default function useKpi() {
  const initFormData = {
    planSalesRevenue: null,
    planVariableCosts: null,
    planFixedCosts: null,
    planOperatingIncome: null,
    planOperatingExpenses: null,
    actualSalesRevenue: null,
    actualVariableCosts: null,
    actualFixedCosts: null,
    actualOperatingIncome: null,
    actualOperatingExpenses: null,
  }
  const [kpiData, setKpiData] = useState<FinancialKpiData>(initFormData)
  const [settingPlanData, setSettingPlanData] = useState<SettingPlanFinancialKpiData>({
    settingSalesRevenue: null,
    settingVariableCosts: null,
  })

  const convertDivider = 1000000
  const currentYear = dayjs().get('year')
  const { withLoading, setLoading } = useLoading()
  const { openConfirmModal } = useConfirmModal()
  const { notificationModal } = useNotification()
  const { api } = useHttp()
  // Function to process the object
  const processObject = <T extends MyObject>(
    obj: T,
    operation: (value: number) => number
  ): ProcessedObject<T> => {
    const processed: Partial<ProcessedObject<T>> = {}

    for (const [key, value] of Object.entries(obj)) {
      processed[key as keyof T] = value !== null ? operation(value) : null
    }

    return processed as ProcessedObject<T>
  }

  const isUndefined = (rawData: number | undefined | null): number =>
    rawData === undefined || rawData === null ? 0 : rawData

  const formattedNumber = (rawData: number): string =>
    `${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rawData * 100)}%`

  const convertResultFormat = (value: number): string => {
    return value >= 0
      ? `${addCommasToNumber(value.toFixed(2))}`
      : `▲${addCommasToNumber(Math.abs(value).toFixed(2))}`
  }
  const reverseResultFormat = (value = '0'): number => {
    return value.includes('▲')
      ? -Number(value.slice(1).replace(/,/g, ''))
      : Number(removeCommasToNumber(value))
  }

  const saveSettingKpi = async (inputYear: number, settingInput: SettingPlanFinancialKpiData) => {
    setLoading(true)
    const { isExistSettingKpi, kpiId } = await checkSettingYear(inputYear)
    let newKpiData = {
      plannedFixedCost: settingInput.settingFixedCosts ?? null,
      plannedNonOperatingExpense: settingInput.settingOperatingExpenses ?? null,
      plannedNonOperatingIncome: settingInput.settingOperatingIncome ?? null,
      plannedSales: settingInput.settingSalesRevenue,
      plannedVariableCost: settingInput.settingVariableCosts,
    }
    let convertNewKpiData: KpiData = processObject(newKpiData, value => value * convertDivider)
    if (isExistSettingKpi && kpiId) {
      setLoading(false)
      const confirmed = await openConfirmModal({
        title: '確認してください',
        message: `${inputYear}のKPIが存在していますが、置き換えますか？`,
      })
      //update
      if (confirmed) {
        const result = await withLoading(api.kpi.saveKpiData({ id: kpiId, ...convertNewKpiData }))
        if (result.code === 200) notificationModal.success('編集完了しました。')
      }
    } else {
      //new
      const result = await withLoading(
        api.kpi.addNewKpiData({ year: inputYear, ...convertNewKpiData } as AddNewKpiData)
      )
      if (result.code === 200) notificationModal.success('新KPIを挿入完了しました。')
    }
    setLoading(false)
  }

  const getKpiData = async (planType: 'time' | 'plan') => {
    let selectedYear = planType === 'time' ? currentYear - 1 : currentYear
    setLoading(true)
    if (planType === 'time') {
      const [currentYearKpiData, previousYearKpiData] = await Promise.all([
        getKpiCurrentYear(currentYear),
        getKpiPreviousYear(selectedYear),
      ])
      let convertCurrentData = !!currentYearKpiData
        ? processObject(currentYearKpiData, value => value / convertDivider)
        : currentYearKpiData
      let convertPreviousData = !!previousYearKpiData
        ? processObject(previousYearKpiData, value => value / convertDivider)
        : previousYearKpiData
      setKpiData({ ...convertPreviousData, ...convertCurrentData })
    } else {
      setKpiData(initFormData)
      const previousYearKpiData = await getKpiPreviousYear(selectedYear)
      if (previousYearKpiData) {
        let convertPreviousData = processObject(
          previousYearKpiData,
          value => value / convertDivider
        )
        setKpiData(prev => ({ ...prev, ...convertPreviousData }))
      }
    }

    setLoading(false)
  }

  const getKpiCurrentYear = async (year: number) => {
    const result = await api.kpi.getKpiData(year)
    console.log(result)
    if (result.code === 200 && result.data) {
      return {
        actualSalesRevenue: result.data.plannedSales,
        actualVariableCosts: result.data.plannedVariableCost,
        actualFixedCosts: result.data.plannedFixedCost,
        // actualMarginalProfit?: number
        // actualMarginalProfitRate?: string
        actualOperatingIncome: result.data.plannedNonOperatingIncome,
        actualOperatingExpenses: result.data.plannedNonOperatingExpense,
        // actualOrdinaryProfit?: number
      }
    } else {
      return {
        actualSalesRevenue: null,
        actualVariableCosts: null,
        actualFixedCosts: null,
        actualOperatingIncome: null,
        actualOperatingExpenses: null,
      }
    }
  }

  const getKpiPreviousYear = async (year: number) => {
    const result = await api.kpi.getKpiData(year)
    if (result.code === 200 && result.data) {
      return {
        planSalesRevenue: result.data.plannedSales,
        planVariableCosts: result.data.plannedVariableCost,
        planFixedCosts: result.data.plannedFixedCost,
        // planMarginalProfit?: number
        // planMarginalProfitRate?: string
        planOperatingIncome: result.data.plannedNonOperatingIncome,
        planOperatingExpenses: result.data.plannedNonOperatingExpense,
        // planOrdinaryProfit?:
      }
    } else {
      return {
        planSalesRevenue: null,
        planVariableCosts: null,
        planFixedCosts: null,
        planOperatingIncome: null,
        planOperatingExpenses: null,
      }
    }
  }

  const checkSettingYear = async (year: number) => {
    const result = await api.kpi.getKpiData(year)
    if (result.code === 200 && result.data)
      return { isExistSettingKpi: true, kpiId: result.data.id }
    return { isExistSettingKpi: false, kpiId: result.data?.id }
  }

  const kpiCalculate = (formInput: FinancialKpiData) => {
    setLoading(true)
    let result: FinancialKpiData = formInput
    let planMarginalProfit,
      actualMarginalProfit,
      resultOrdinaryProfit,
      resultSalesRevenue,
      resultFixedCosts,
      resultSalesRevenueIncreaseRate,
      resultOperatingIncome,
      resultOperatingExpenses = 0

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
    actualMarginalProfit = result.actualMarginalProfit / isUndefined(formInput.actualSalesRevenue)

    resultOrdinaryProfit = result.actualOrdinaryProfit - result.planOrdinaryProfit
    resultSalesRevenue =
      (isUndefined(formInput.actualSalesRevenue) - isUndefined(formInput.planSalesRevenue)) *
      planMarginalProfit
    resultFixedCosts =
      isUndefined(formInput.planFixedCosts) - isUndefined(formInput.actualFixedCosts)
    resultSalesRevenueIncreaseRate =
      (actualMarginalProfit - planMarginalProfit) * isUndefined(formInput.actualSalesRevenue)
    resultOperatingIncome =
      isUndefined(formInput.actualOperatingIncome) - isUndefined(formInput.planOperatingIncome)
    resultOperatingExpenses =
      isUndefined(formInput.actualOperatingExpenses) - isUndefined(formInput.planOperatingExpenses)

    result.resultOrdinaryProfit = convertResultFormat(resultOrdinaryProfit)
    result.resultSalesRevenue = convertResultFormat(resultSalesRevenue)
    result.resultFixedCosts = convertResultFormat(resultFixedCosts)

    result.resultSalesRevenueIncreaseRate = convertResultFormat(resultSalesRevenueIncreaseRate)
    result.resultOperatingIncome = convertResultFormat(resultOperatingIncome)
    result.resultOperatingExpenses = convertResultFormat(resultOperatingExpenses)

    result.resultSubTotal = convertResultFormat(
      resultSalesRevenue +
        resultSalesRevenueIncreaseRate +
        resultFixedCosts +
        resultOperatingIncome +
        resultOperatingExpenses
    )

    setKpiData({ ...formInput, ...result })

    setSettingPlanData({
      settingSalesRevenue: formInput.actualSalesRevenue,
      settingVariableCosts: formInput.actualVariableCosts,
      settingMarginalProfit: result.actualMarginalProfit,
      settingMarginalProfitRate: result.actualMarginalProfitRate,
    })
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  const settingPlanCalculate = (formSetting: SettingPlanFinancialKpiData) => {
    let result: SettingPlanFinancialKpiData = formSetting
    result.settingMarginalProfit =
      isUndefined(formSetting.settingSalesRevenue) - isUndefined(formSetting.settingVariableCosts)
    result.settingMarginalProfitRate = formattedNumber(
      result.settingMarginalProfit / isUndefined(formSetting.settingSalesRevenue)
    )
    result.settingOrdinaryProfit =
      isUndefined(formSetting.settingSalesRevenue) -
      isUndefined(formSetting.settingVariableCosts) -
      (isUndefined(formSetting.settingFixedCosts) +
        isUndefined(formSetting.settingOperatingExpenses) -
        isUndefined(formSetting.settingOperatingIncome))
    setSettingPlanData({ ...formSetting, ...result })
  }

  return {
    kpiData,
    getKpiData,
    kpiCalculate,
    settingPlanData,
    setSettingPlanData,
    settingPlanCalculate,
    currentYear,
    reverseResultFormat,
    initFormData,
    saveSettingKpi,
  }
}
