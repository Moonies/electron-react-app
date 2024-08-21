import { default as getProductList } from './getProductList'
import { default as getProductData } from './getProductData'

export default function product() {
  return { getProductList, getProductData }
}
