import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { default as addNewSupplier, AddNewSupplierProps } from './addNewSupplier'
import { default as deleteSupplier } from './deleteSupplier'
import { default as getSupplierList, SupplierData } from './getSupplierList'
import { default as updateSupplierDetail, UpdateSupplierDetailProps } from './updateSupplierDetail'

export interface SupplierApi {
  addNewSupplier: (params: AddNewSupplierProps) => Promise<ApiResponse<{}>>
  deleteSupplier: (supplierId: string) => Promise<ApiResponse<{}>>
  getSupplierList: () => Promise<ApiResponse<SupplierData[]>>
  updateSupplierDetail: (params: UpdateSupplierDetailProps) => Promise<ApiResponse<{}>>
}

export default function supplier(httpRequest: HttpRequest): SupplierApi {
  return {
    addNewSupplier: params => addNewSupplier(httpRequest, params),
    deleteSupplier: supplierId => deleteSupplier(httpRequest, supplierId),
    getSupplierList: () => getSupplierList(httpRequest),
    updateSupplierDetail: params => updateSupplierDetail(httpRequest, params),
  }
}
