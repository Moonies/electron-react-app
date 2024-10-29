import { default as getMyCompanyDetail, MyCompanyDetail } from './getMyCompanyDetail'
import { default as getMyCompanySeal, MyCompnaSeal } from './getMyCompanySeal'
import {
  default as updateMyCompanyDetail,
  UpdateMyCompanyDetailData,
} from './updateMyCompanyDetail'
import { default as updateMyCompanySeal, UpdateMyCompanySeal } from './updateMyCompanySeal'
import { default as addNewMyCompanyDetail, NewMyCompanyDetailData } from './addNewMyCompanyDetail'
import { default as deleteMyCompanySeal } from './deleteMyCompanySeal'
import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse } from 'api'

export interface MyCompanyApi {
  addNewMyCompanyDetail: (params: NewMyCompanyDetailData) => Promise<ApiResponse<{ id: string }>>
  deleteMyCompanySeal: (id: string) => Promise<ApiResponse<{}>>
  getMyCompanyDetail: () => Promise<ApiResponse<MyCompanyDetail>>
  getMyCompanySeal: (id: string) => Promise<ApiResponse<MyCompnaSeal>>
  updateMyCompanyDetail: (params: UpdateMyCompanyDetailData) => Promise<ApiResponse<{}>>
  updateMyCompanySeal: (params: UpdateMyCompanySeal) => Promise<ApiResponse<{}>>
}

export default function myCompany(httpRequest: HttpRequest): MyCompanyApi {
  return {
    addNewMyCompanyDetail: params => addNewMyCompanyDetail(httpRequest, params),
    deleteMyCompanySeal: id => deleteMyCompanySeal(httpRequest, id),
    getMyCompanyDetail: () => getMyCompanyDetail(httpRequest),
    getMyCompanySeal: id => getMyCompanySeal(httpRequest, id),
    updateMyCompanyDetail: params => updateMyCompanyDetail(httpRequest, params),
    updateMyCompanySeal: params => updateMyCompanySeal(httpRequest, params),
  }
}
