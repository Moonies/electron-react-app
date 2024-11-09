import { default as getProductList, ProductData, SearchCriteriaProductList } from './getProductList'
import { default as getProductData } from './getProductData'
import { default as getProductOrderHistory } from './getProductOrderHistory'
import { default as getProductUnitList, ProductUnitDetail } from './getProductUnitList'
import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { default as addnewProduct, AddNewProductProps } from './addNewProduct'

export interface ProductApi {
  getProductUnitList: () => Promise<ApiResponse<ProductUnitDetail[]>>
  addNewProduct: (params: AddNewProductProps) => Promise<ApiResponse<{}>>
  getProductList: (params: SearchCriteriaProductList) => Promise<ApiResponse<ProductData[]>>
}

export default function product(httpRequest: HttpRequest): ProductApi {
  return {
    getProductUnitList: () => getProductUnitList(httpRequest),
    addNewProduct: params => addnewProduct(httpRequest, params),
    getProductList: params => getProductList(httpRequest, params),
  }
}
