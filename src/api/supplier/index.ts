import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { default as addNewSupplier, AddNewSupplierProps } from './addNewSupplier'
import { default as deleteSupplier } from './deleteSupplier'
import { default as getSupplierList, SupplierData } from './getSupplierList'
import { default as updateSupplierDetail, UpdateSupplierDetailProps } from './updateSupplierDetail'
import { default as getSupplierDetailWithId, SupplierDetail } from './getSupplierDetailWithId'
export interface SupplierApi {
  addNewSupplier: (params: AddNewSupplierProps) => Promise<ApiResponse<{}>>
  deleteSupplier: (supplierId: string) => Promise<ApiResponse<{}>>
  getSupplierList: (page?: number, pageSize?: number) => Promise<ApiResponse<SupplierData[]>>
  updateSupplierDetail: (params: UpdateSupplierDetailProps) => Promise<ApiResponse<{}>>
  getSupplierDetailWithId: (supplierId: string) => Promise<ApiResponse<SupplierDetail>>
}

export default function supplier(httpRequest: HttpRequest): SupplierApi {
  return {
    addNewSupplier: params => addNewSupplier(httpRequest, params),
    deleteSupplier: supplierId => deleteSupplier(httpRequest, supplierId),
    getSupplierList: (page, pageSize) => getSupplierList(httpRequest, { page, pageSize }),
    updateSupplierDetail: params => updateSupplierDetail(httpRequest, params),
    getSupplierDetailWithId: supplierId => getSupplierDetailWithId(httpRequest, supplierId),
  }
}
