import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import { exportToXlsx } from 'utils/exportUtils'

export type ExportAllProductData = {
  id: string
  // components: string
  cost: number
  grossMarginRate: number
  inStock: number
  name: string
  number: string
  totalQuantity: number
  price: number
  productUnit: {
    id: string
    label: string
    name: string
  }
  createdAt: string | Dayjs
}
export default function useExportProduct() {
  const transformData = (productList: ExportAllProductData[]) => {
    return productList.map(product => ({
      productNumber: product.number,
      productName: product.name,
      inStock: product.inStock === null ? 0 : product.inStock,
      quantity: product.totalQuantity,
      cost: product.cost,
      price: product.price,
      totalPrice: product.price * product.totalQuantity,
      registrationDate: dayjs(product.createdAt).format('YYYY-MM-DD'),
    }))
  }

  const columns = [
    { key: 'productNumber', header: '商品番号' },
    { key: 'productName', header: '商品名' },
    { key: 'inStock', header: '在庫数' },
    { key: 'quantity', header: '数量' },
    { key: 'cost', header: '評価' },
    { key: 'price', header: '単価' },
    { key: 'totalPrice', header: '小計' },
    { key: 'registrationDate', header: '登録日付' },
  ]

  const exportProduct = async (dataToExport: ExportAllProductData[]) => {
    try {
      const transformedData = transformData(dataToExport)
      exportToXlsx(columns, transformedData, 'product-report')
    } catch (error) {
      console.error('Error exporting to XLSX:', error)
      alert('Failed to export XLSX. Please ensure the xlsx library is properly imported.')
    }
  }
  return { exportProduct }
}
