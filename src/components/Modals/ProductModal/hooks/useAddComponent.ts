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
import { ComponentData } from 'api/component/getComponentData'
import { ProductUnitDetail } from 'api/product/getProductUnitList'
import { NewComponentDetail } from 'components/Dialogs/AddNewComponentListDialog'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatJPY } from 'utils/formatUtils'
import { ProductDetailModalProps } from '..'

export default function useAddComponent(productData: ProductDetailModalProps) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [newComponentListData, setNewComponentListData] = useState<GridRowsProp>(
    productData.components
  )
  const [productUnitList, setProductUnitList] = useState<ProductUnitDetail[]>([])
  const { setLoading } = useLoading()
  const { api } = useHttp()

  // useEffect(() => {
  //   prepareComponent()
  // }, [productData])

  const handleAddNewComponent = async (newComponent: NewComponentDetail) => {
    setLoading(true)
    let currentComponentData = newComponentListData
    let totalAmount = await getTotalRemainComponent(newComponent.id)
    //please check function again in task Sale order
    if (currentComponentData.length > 0) {
      const resultIndex = currentComponentData.findIndex(
        item => item.componentNumber === newComponent.number
      )
      if (resultIndex !== -1) {
        let newRow = currentComponentData.map((component, index) =>
          index === resultIndex
            ? {
                ...component,
                quantity: component.quantity + newComponent.quantity,
                // totalQuantity: totalAmount,
              }
            : // : { ...component, totalQuantity: totalAmount }
              { ...component }
        )
        setNewComponentListData(newRow)
      } else {
        // setNewComponentListData(prev => [...prev, { ...newComponent, totalQuantity: totalAmount }])
        setNewComponentListData(prev => [...prev, { ...newComponent }])
      }
    } else {
      // setNewComponentListData(prev => [...prev, { ...newComponent, totalQuantity: totalAmount }])
      setNewComponentListData(prev => [...prev, { ...newComponent }])
    }
    setLoading(false)
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
    setNewComponentListData(newComponentListData.filter(row => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = newComponentListData.find(row => row.id === id)
    if (editedRow!.isNew) {
      setNewComponentListData(newComponentListData.filter(row => row.id !== id))
    }
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false }
    setNewComponentListData(
      newComponentListData.map(row => (row.id === newRow.id ? updatedRow : row))
    )
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const prepareComponent = async () => {
    setLoading(true)
    try {
      // Fetch details for each item
      // const updateComponent = await Promise.all(
      //   productData.component.map(async component => {
      //     const totalRemain = await getTotalRemainComponent(component.id)
      //     return { ...component, totalQuantity: totalRemain }
      //   })
      // )
      // setItems(itemsWithDetails);
      // setNewComponentListData(updateComponent)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  const getTotalRemainComponent = useCallback(async (componentId: string) => {
    // const { data } = await api.component.getTotalAmountComponent(componentId)
    // return data?.totalAmount ?? 0
    // setNewComponentListData({ ...updatedProducts })
  }, [])

  const getProductUnit = async () => {
    const response = await api.product.getProductUnitList()
    if (response.code === 200 && response.data) {
      setProductUnitList(response.data)
    }
  }
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'number',
        headerName: '部品番号',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'name',
        headerName: '部品名',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'quantity',
        headerName: '数量',
        headerAlign: 'center',
        type: 'number',
        flex: 1,
        editable: true,
      },
      // {
      //   field: 'totalQuantity',
      //   headerName: '合計残り',
      //   headerAlign: 'center',
      //   flex: 1,
      // },
      {
        field: 'price',
        headerName: '単価',
        type: 'number',
        headerAlign: 'center',
        flex: 1,
        valueFormatter: value => formatJPY(Number(value)),
      },
      {
        field: 'totalPrice',
        headerName: '金額',
        type: 'number',
        headerAlign: 'center',
        flex: 1,
        valueFormatter: value => formatJPY(Number(value)),
        valueGetter: (value, row) => {
          return row.quantity * row.price
        },
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
    handleAddNewComponent,
    handleRowEditStop,
    handleEditClick,
    handleSaveClick,
    handleDeleteClick,
    handleCancelClick,
    processRowUpdate,
    handleRowModesModelChange,
    newComponentListData,
    rowModesModel,
    columns,
    productUnitList,
    getProductUnit,
  }
}
