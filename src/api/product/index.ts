import { default as getProductList } from './getProductList'
import { default as getProductData } from './getProductData'
import { default as getProductOrderHistory } from './getProductOrderHistory'
export default function product() {
  return { getProductList, getProductData, getProductOrderHistory }
}
