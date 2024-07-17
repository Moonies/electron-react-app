import { useState, useCallback, useMemo } from 'react'
import { subMonths } from 'date-fns'
import { saleList } from 'api'
import useLoading from 'hooks/useLoading'
import { GridColDef } from '@mui/x-data-grid'
import { SalesData, SalesSummary, SearchCriteria } from 'api/sales/saleList'

export default function useExportSale() {
  const printColumnList: GridColDef[] = useMemo(
    () => [
      // {
      //   field: 'invoiceNumber',
      //   headerName: '伝票番号',
      // },
      // { field: 'customerName', headerName: '取引先' },
      { field: 'productName', headerName: '品名' },
      { field: 'productId', headerName: '図番' },
      {
        field: 'unitPrice',
        headerName: '単価',
      },
      { field: 'quantity', headerName: '数量' },
      {
        field: 'totalPrice',
        headerName: '金額',
      },
    ],
    []
  )

  return {
    printColumnList,
  }
}
