import { default as getKpiData } from './getKpiData'
import { default as saveKpiData } from './saveKpiData'

export default function kpi() {
  return { getKpiData, saveKpiData }
}
