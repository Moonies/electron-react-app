import { default as getProductList, ProductData, SearchCriteriaProductList } from './getProductList'
import { default as getProductData, ProductDetail } from './getProductData'
import { default as getProductOrderHistory, OrderHistory } from './getProductOrderHistory'
import { default as getProductUnitList, ProductUnitDetail } from './getProductUnitList'
import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { default as addnewProduct, AddNewProductProps } from './addNewProduct'
import { default as updateProductDetail, NewProductDetailProps } from './updateProductDetail'
import { default as deleteProduct } from './deleteProduct'
import { default as updateProductInStock } from './updateInStockProduct'

export interface ProductApi {
  getProductUnitList: () => Promise<ApiResponse<ProductUnitDetail[]>>
  addNewProduct: (params: AddNewProductProps) => Promise<ApiResponse<{}>>
  getProductList: (params: SearchCriteriaProductList) => Promise<ApiResponse<ProductData[]>>
  updateProductDetail: (params: NewProductDetailProps) => Promise<ApiResponse<{}>>
  deleteProduct: (productId: string) => Promise<ApiResponse<{}>>
  getProductData: (category: string, keyword: string) => Promise<ApiResponse<ProductDetail[]>>
  updateProductInStock: (productId: string, newQuantity: number) => Promise<ApiResponse<{}>>
  getProductOrderHistory: (productId: string) => Promise<ApiResponse<OrderHistory[]>>
}

export default function product(httpRequest: HttpRequest): ProductApi {
  return {
    getProductUnitList: () => getProductUnitList(httpRequest),
    addNewProduct: params => addnewProduct(httpRequest, params),
    getProductList: params => getProductList(httpRequest, params),
    updateProductDetail: params => updateProductDetail(httpRequest, params),
    deleteProduct: productId => deleteProduct(httpRequest, productId),
    getProductData: (category, keyword) => getProductData(httpRequest, { category, keyword }),
    updateProductInStock: (productId, newQuantity) =>
      updateProductInStock(httpRequest, productId, newQuantity),
    getProductOrderHistory: params => getProductOrderHistory(httpRequest, params),
  }
}
