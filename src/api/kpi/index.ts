import { default as getKpiData } from './getKpiData'
import { default as saveKpiData } from './saveKpiData'
import { default as addNewKpiData } from './addNewKpiData'

export default function kpi() {
  return { getKpiData, saveKpiData, addNewKpiData }
}
