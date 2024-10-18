import { default as getCustomerList } from './getCustomerList'
import { default as getCustomerDetailById } from './getCustomerDetailById'
import { default as updateCustomerDetail } from './updateCustomerDetail'
import { default as addNewCustomer } from './addNewCustomer'
import { default as deleteCustomer } from './deleteCustomer'

export default function customer() {
  return {
    getCustomerList,
    getCustomerDetailById,
    updateCustomerDetail,
    addNewCustomer,
    deleteCustomer,
  }
}
