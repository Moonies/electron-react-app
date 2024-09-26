import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { useMemo, useState } from 'react'
import { formatJPY } from 'utils/formatUtils'

export default function useComponent() {
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
      },
      {
        field: 'customerName',
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
      },
      {
        field: 'price',
        headerName: '単価',
        type: 'number',
        headerAlign: 'center',
        flex: 1,
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
