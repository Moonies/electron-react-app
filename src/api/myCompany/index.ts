import { default as getMyCompanyDetail } from './getMyCompanyDetail'
import { default as getMyConpanySeal } from './getMyCompanySeal'
import { default as updateMyCompanyDetail } from './updateMyCompanyDetail'
import { default as updateMyCompanySeal } from './updateMyCompanySeal'
import { default as addNewMyCompnayDetail } from './addNewMyCompanyDetail'

export default function myCompany() {
  return {
    getMyCompanyDetail,
    getMyConpanySeal,
    updateMyCompanyDetail,
    updateMyCompanySeal,
    addNewMyCompnayDetail,
  }
}
