import { debounce } from '@mui/material'
import {
  GridColDef,
  GridActionsCellItem,
  GridRowModes,
  GridRowModesModel,
  GridRowId,
  GridRowModel,
  GridRowsProp,
  GridEventListener,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import { api } from 'api/index'
import { ProductDataDetail } from 'api/product/getProductData'

import React, { useCallback, useMemo, useState } from 'react'
import { ProductDetail } from '../components/DialogProduct'

export default function useAddOrder() {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({})
  const [newProductListData, setNewProductListData] = useState<GridRowsProp>([
    // { id: 1, productNumber: 'AA00-11001', productName: 'init-product', quantity: 1234 },
  ])
  const [productData, setProductData] = useState<ProductDataDetail[]>([])

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

  const columns: GridColDef[] = useMemo(
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
        // getActions: ({ id }) => {
        //   const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
        //   if (isInEditMode) {
        //     return [
        //       { label: 'Save', onClick: handleSaveClick(id) },
        //       { label: 'Cancel', onClick: handleCancelClick(id) },
        //     ]
        //   }
        //   return [
        //     { label: 'Edit', onClick: handleEditClick(id) },
        //     { label: 'Delete', onClick: handleDeleteClick(id) },
        //   ]
        // },
      },
    ],
    [rowModesModel, handleSaveClick, handleCancelClick, handleEditClick, handleDeleteClick]
  )
  return {
    columns,
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
