import { default as getSupplierList } from './getSupplierList'
import { default as addnewSupplier } from './addNewSupplier'
export default function supplier() {
  return { getSupplierList, addnewSupplier }
}
