import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { OrderHistory } from 'api/product/getProductOrderHistory'
import { useMemo, useState } from 'react'
import { formatJPY } from 'utils/formatUtils'

export default function useProductHistory() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'orderNumber',
        headerName: '受注番号',
        headerAlign: 'center',
        flex: 1,
        valueFormatter: (value, row: OrderHistory) => row.orderCode,
      },
      {
        field: 'customerName',
        headerName: '発注先',
        headerAlign: 'center',
        flex: 1,
        valueFormatter: (value, row: OrderHistory) => row.company.companyInfo.name,
      },
      {
        field: 'quantity',
        headerName: '数量',
        headerAlign: 'center',
        flex: 1,
        valueFormatter: (value, row: OrderHistory) => row.products && row.products[0].quantity,
      },

      {
        field: 'shipmentDate',
        headerName: '出荷日',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'owners',
        headerName: '担当者',
        headerAlign: 'center',
        flex: 1,
        valueGetter: (value: { id: string; name: string }[]) =>
          value.length > 0 ? value[0].name : '',
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'メモ',
        width: 100,
        cellClassName: 'actions',
      },
    ],
    []
  )
  const handlePaginationModelChange = () => {}

  return { columns, paginationModel, handlePaginationModelChange }
}
