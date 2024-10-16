import { default as getMyCompanyDetail } from './getMyCompanyDetail'
import { default as getMyCompanySeal } from './getMyCompanySeal'
import { default as updateMyCompanyDetail } from './updateMyCompanyDetail'
import { default as updateMyCompanySeal } from './updateMyCompanySeal'
import { default as addNewMyCompanyDetail } from './addNewMyCompanyDetail'
import { default as deleteMyCompanySeal } from './deleteMyCompanySeal'
export default function myCompany() {
  return {
    getMyCompanyDetail,
    getMyCompanySeal,
    updateMyCompanyDetail,
    updateMyCompanySeal,
    addNewMyCompanyDetail,
    deleteMyCompanySeal,
  }
}
