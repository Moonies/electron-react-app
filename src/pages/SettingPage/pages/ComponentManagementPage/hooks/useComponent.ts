import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { ComponentData } from 'api/component/getComponentList'
import { api } from 'api/index'
import useLoading from 'hooks/useLoading'
import React, { useMemo, useState } from 'react'

export default function useComponent() {
  const [componentListData, setComponentListData] = useState<ComponentData[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })

  const { withLoading } = useLoading()

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'componentNumber', headerName: '商品番号', headerAlign: 'center' },

      { field: 'componentName', headerName: '商品名', headerAlign: 'center' },
      {
        field: 'price',
        headerName: '単価',
        headerAlign: 'center',
        // minWidth: 200,
      },
      { field: 'quantity', headerName: '数量', headerAlign: 'center' },
      { field: 'lastestPriceDate', headerName: '単価時点', headerAlign: 'center' },
    ],
    []
  )
  const getComponentListData = async () => {
    const result = await withLoading(api.component().getComponentList())
    if (result.code === 200 && result.data) {
      setComponentListData(result.data)
    }
  }
  const handlePaginationModelChange = () => {}
  return {
    paginationModel,
    columns,
    getComponentListData,
    componentListData,
    handlePaginationModelChange,
  }
}
