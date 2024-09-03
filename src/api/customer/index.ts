import { default as getCustomerList } from './getCustomerList'
import { default as getCustomerDetailById } from './getCustomerDetailById'
export default function customer() {
  return { getCustomerList, getCustomerDetailById }
}
