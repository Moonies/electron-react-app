import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { PurchaseOrderHistory } from 'api/component/getComponentPurchaseHistory'
import { useMemo, useState } from 'react'
import { formatJPY } from 'utils/formatUtils'

export default function useComponent() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 100,
  })

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'orderCode',
        headerName: '受注番号',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'companyName',
        headerName: '発注先',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'quantity',
        headerName: '数量',
        headerAlign: 'center',
        type: 'number',
        flex: 1,
        valueGetter: (value, row: PurchaseOrderHistory) => {
          return row.components[0].quantity
        },
      },
      {
        field: 'price',
        headerName: '単価',
        type: 'number',
        headerAlign: 'center',
        flex: 1,
        valueGetter: (value, row: PurchaseOrderHistory) => {
          return row.components[0].price
        },
        valueFormatter: value => formatJPY(Number(value)),
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
