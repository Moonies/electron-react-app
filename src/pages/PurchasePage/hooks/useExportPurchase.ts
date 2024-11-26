import { PurchaseData } from 'api/purchase/getPurchaseList'
import * as XLSX from 'xlsx'

import React from 'react'

export default function useExportPurchase() {
  // Helper function to flatten and transform the data
  const transformData = (orders: PurchaseData[]) => {
    return orders.reduce((acc: any, order) => {
      // Get the owner name (assuming we take the first owner if multiple exist)
      const ownerName = order.owners?.[0]?.name || ''

      // Get the customer name from company info
      const customerName = order.company?.companyInfo?.name || ''

      // Transform each component into a row
      const rows = order.components.map(component => ({
        invoiceNumber: order.invoiceNumber,
        orderCode: order.orderCode,
        customerName: customerName,
        componentNumber: component.number,
        componentName: component.name,
        quantity: component.quantity,
        price: component.price,
        totalPrice: component.quantity * component.price,
        purchaseCode: order.purchaseCode,
        owner: ownerName,
        registrationDate: order.registrationDate,
        deliveryDate: order.deliveryDate,
      }))

      return acc.concat(rows)
    }, [])
  }

  const columns = [
    { key: 'invoiceNumber', header: '伝票番号' },
    { key: 'orderCode', header: '受注番号' },
    { key: 'customerName', header: '名称' },
    { key: 'componentNumber', header: '図番' },
    { key: 'componentName', header: '品名' },
    { key: 'quantity', header: '数量' },
    { key: 'price', header: '単価' },
    { key: 'totalPrice', header: '金額' },
    { key: 'purchaseCode', header: '注番' },
    { key: 'owner', header: '担当者名' },
    { key: 'registrationDate', header: '納入日' },
    { key: 'deliveryDate', header: '手配納期' },
  ]

  const exportPurchaseSelected = (dataToExport: PurchaseData[]) => {
    try {
      const transformedData = transformData(dataToExport)

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(transformedData)

      // Add headers
      columns.forEach((col, idx) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: idx })
        if (!ws[cellRef]) ws[cellRef] = { v: '' }
        ws[cellRef].v = col.header
      })

      // Format numbers in the worksheet
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
      for (let R = 1; R <= range.e.r; R++) {
        // Format quantity column
        const quantityCell = XLSX.utils.encode_cell({
          r: R,
          c: columns.findIndex(col => col.key === 'quantity'),
        })
        if (ws[quantityCell]) {
          ws[quantityCell].z = '#,##0' // Format for whole numbers
        }

        // Format price column
        const priceCell = XLSX.utils.encode_cell({
          r: R,
          c: columns.findIndex(col => col.key === 'price'),
        })
        if (ws[priceCell]) {
          ws[priceCell].z = '#,##0.00' // Format for currency
        }

        // Format total price column
        const totalPriceCell = XLSX.utils.encode_cell({
          r: R,
          c: columns.findIndex(col => col.key === 'totalPrice'),
        })
        if (ws[totalPriceCell]) {
          ws[totalPriceCell].z = '#,##0.00' // Format for currency
        }
      }

      // Add styling to headers
      const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1')
      for (let i = 0; i <= headerRange.e.c; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i })
        if (!ws[cellRef].s) ws[cellRef].s = {}
        ws[cellRef].s.font = { bold: true }
      }

      // Set column widths
      ws['!cols'] = columns.map(col => {
        // Set wider columns for formatted numbers
        if (['price', 'totalPrice'].includes(col.key)) {
          return { wch: 20 }
        }
        return { wch: 15 }
      })

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Orders')

      XLSX.writeFile(wb, 'orders.xlsx')
    } catch (error) {
      console.error('Error exporting to XLSX:', error)
      alert('Failed to export XLSX. Please ensure the xlsx library is properly imported.')
    }
  }

  return { exportPurchaseSelected }
}
