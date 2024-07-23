import React, { useState } from 'react'
import { kpi } from 'api/index'
import dayjs from 'dayjs'
import useLoading from 'hooks/useLoading'
import { KpiData } from 'api/kpi/kpiData'
export default function useKpi() {
  const [kpiData, setKpiData] = useState<KpiData>({})
  const convertDivider = 1000000
  const currentYear = dayjs().get('year')
  const { withLoading } = useLoading()

  const getKpiData = async () => {
    const result = await withLoading(kpi().kpiData({ selectedYear: currentYear }))
    if (result.code == 200 && result.data) {
      let convertKpiData = convertToPercentages(result.data)
      setKpiData(convertKpiData)
    }
  }

  function convertToPercentages(obj: KpiData): KpiData {
    const result: Record<string, number> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = value / convertDivider
    }
    return result
  }

  const isShrink = (value: number | undefined): boolean => {
    return !!value || value === 0
  }

  return { kpiData, getKpiData, isShrink }
}
