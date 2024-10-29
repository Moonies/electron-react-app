import { default as getKpiData, KpiData } from './getKpiData'
import { default as saveKpiData, KpiSaveData } from './saveKpiData'
import { default as addNewKpiData, AddNewKpiData } from './addNewKpiData'
import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'

export interface KpiApi {
  getKpiData: (selectedYear: number) => Promise<ApiResponse<KpiData>>
  saveKpiData: (params: KpiSaveData) => Promise<ApiResponse<{}>>
  addNewKpiData: (params: AddNewKpiData) => Promise<ApiResponse<{}>>
}

export default function kpi(httpRequest: HttpRequest): KpiApi {
  return {
    getKpiData: selectedYear => getKpiData(httpRequest, selectedYear),
    saveKpiData: params => saveKpiData(httpRequest, params),
    addNewKpiData: params => addNewKpiData(httpRequest, params),
  }
}
