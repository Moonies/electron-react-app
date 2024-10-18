import { default as getSupplierList } from './getSupplierList'
import { default as addnewSupplier } from './addNewSupplier'
import { default as updateSupplierDetail } from './updateSupplierDetail'
import { default as deleteSupplier } from './deleteSupplier'

export default function supplier() {
  return { getSupplierList, addnewSupplier, updateSupplierDetail, deleteSupplier }
}
