import { ApiResponse } from 'api'
import { default as addnewProduct, AddNewProductProps } from './addNewProduct'
import { default as deleteProduct } from './deleteProduct'
import { default as deleteProductImage } from './deleteProductImage'
import { default as getProductData, ProductDetail } from './getProductData'
import { default as getProductImage, ProductImage } from './getProductImage'
import { default as getProductList, ProductData, SearchCriteriaProductList } from './getProductList'
import { default as getProductOrderHistory, OrderHistory } from './getProductOrderHistory'
import { default as getProductUnitList, ProductUnitDetail } from './getProductUnitList'
import { default as updateProductDetail, NewProductDetailProps } from './updateProductDetail'
import { default as updateProductInStock } from './updateInStockProduct'
import { default as updateProductImage, UpdateProductImage } from './updateProductImage'
import { HttpRequest } from 'hooks/useHttp'

export interface ProductApi {
  addNewProduct: (params: AddNewProductProps) => Promise<ApiResponse<{ id: string }>>
  deleteProduct: (productId: string) => Promise<ApiResponse<{}>>
  deleteProductImage: (productId: string) => Promise<ApiResponse<{}>>
  getProductData: (category: string, keyword: string) => Promise<ApiResponse<ProductDetail[]>>
  getProductImage: (productId: string) => Promise<ApiResponse<ProductImage>>
  getProductList: (params: SearchCriteriaProductList) => Promise<ApiResponse<ProductData[]>>
  getProductOrderHistory: (productId: string) => Promise<ApiResponse<OrderHistory[]>>
  getProductUnitList: () => Promise<ApiResponse<ProductUnitDetail[]>>
  updateProductDetail: (params: NewProductDetailProps) => Promise<ApiResponse<{}>>
  updateProductInStock: (productId: string, newQuantity: number) => Promise<ApiResponse<{}>>
  updateProductImage: (params: UpdateProductImage) => Promise<ApiResponse<{}>>
}

export default function product(httpRequest: HttpRequest): ProductApi {
  return {
    addNewProduct: params => addnewProduct(httpRequest, params),
    deleteProduct: productId => deleteProduct(httpRequest, productId),
    deleteProductImage: productId => deleteProductImage(httpRequest, productId),
    getProductData: (category, keyword) => getProductData(httpRequest, { category, keyword }),
    getProductImage: productId => getProductImage(httpRequest, productId),
    getProductList: params => getProductList(httpRequest, params),
    getProductOrderHistory: params => getProductOrderHistory(httpRequest, params),
    getProductUnitList: () => getProductUnitList(httpRequest),
    updateProductDetail: params => updateProductDetail(httpRequest, params),
    updateProductInStock: (productId, newQuantity) =>
      updateProductInStock(httpRequest, productId, newQuantity),
    updateProductImage: params => updateProductImage(httpRequest, params),
  }
}
