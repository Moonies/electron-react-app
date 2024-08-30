import { GridColDef } from '@mui/x-data-grid'
import { CustomerData } from 'api/customer/getCustomerList'
import { api } from 'api/index'
import { OrderStatus } from 'api/order'
import { OrderData } from 'api/order/getOrderList'
import { ProductDataDetail } from 'api/product/getProductData'
import { UserData } from 'api/user/getUserList'
import { ProductDetail } from 'components/Dialogs/AddNewProductListDialog'
import useLoading from 'hooks/useLoading'

import { useCallback, useMemo, useState } from 'react'

export default function useSaleDetail() {
  const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  })

  const convertStatus = (status: string | null) => {
    switch (status) {
      case OrderStatus.RECEIVED:
        return '未発注'
      case OrderStatus.PROCESSING:
        return '発注済'
      case OrderStatus.OVER_DUE_DATE:
        return '納期超過'
      case OrderStatus.SHIPPED:
        return '出荷中'
      case OrderStatus.DELIVERED:
        return '出荷済'
      case OrderStatus.CANCEL:
        return 'キャンセル'
      default:
        return ''
    }
  }

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'productNumber',
        headerName: '商品番号',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'productName',
        headerName: '商品名',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'quantity',
        headerName: '数量',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'productPrice',
        headerName: '単価',
        type: 'number',
        headerAlign: 'center',
        flex: 1,
        valueFormatter: value => currencyFormatter.format(Number(value)),
      },
      {
        field: 'totalPrice',
        headerName: '金額',
        type: 'number',
        headerAlign: 'center',
        flex: 1,
        valueFormatter: value => currencyFormatter.format(Number(value)),
        valueGetter: (value, row) => {
          return row.quantity * row.productPrice
        },
      },
    ],
    []
  )

  return {
    columns,
    convertStatus,
  }
}
