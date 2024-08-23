import { debounce } from '@mui/material'
import {
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
} from '@mui/x-data-grid'
import { api } from 'api/index'
import { OrderData } from 'api/order/getOrderList'
import { ProductDataDetail } from 'api/product/getProductData'
import { ProductDetail } from 'components/Dialogs/AddNewProductListDialog'
import React, { useCallback, useMemo, useState } from 'react'

export default function useOrderDetail(orderDeta: OrderData) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [newProductListData, setNewProductListData] = useState<GridRowsProp>(orderDeta.product)
  const [productData, setProductData] = useState<ProductDataDetail[]>()

  const [loading, setLoading] = useState(false)

  const handleAddNewProduct = (newProduct: ProductDetail) => {
    console.log(newProduct)
    let currentIndex = newProductListData.length
    setNewProductListData(prev => [...prev, { id: currentIndex + 1, ...newProduct }])
  }
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setNewProductListData(newProductListData.filter(row => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = newProductListData.find(row => row.id === id)
    if (editedRow!.isNew) {
      setNewProductListData(newProductListData.filter(row => row.id !== id))
    }
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false }
    setNewProductListData(newProductListData.map(row => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const debouncedFetchOptions = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        setLoading(true)
        try {
          const fetchedOptions = await api.product().getProductData(query)
          setProductData(fetchedOptions.data?.data ?? [])
        } catch (error) {
          console.error('Error fetching options:', error)
        } finally {
          setLoading(false)
        }
      }
    }, 300),
    []
  )
  const baseColumns: GridColDef[] = useMemo(
    () => [
      {
        field: 'productNumber',
        headerName: '商品番号',
        headerAlign: 'center',
        flex: 1,
        // editable: true,
      },
      {
        field: 'productName',
        headerName: '商品名',
        headerAlign: 'center',
        flex: 1,
        editable: true,
      },
      {
        field: 'quantity',
        headerName: '数量',
        headerAlign: 'center',
        flex: 1,
        editable: true,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
      },
    ],
    []
  )
  return {
    baseColumns,
    newProductListData,
    rowModesModel,
    processRowUpdate,
    handleRowModesModelChange,
    handleRowEditStop,
    setRowModesModel,
    setNewProductListData,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteClick,
    debouncedFetchOptions,
    productData,
    loading,
    handleAddNewProduct,
  }
}
