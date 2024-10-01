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
import { ComponentData } from 'api/component/getComponentList'
import { CustomerData } from 'api/customer/getCustomerList'
import { api } from 'api/index'
import { OrderData } from 'api/order/getOrderList'
import { ProductDataDetail } from 'api/product/getProductData'
import { PurchaseData } from 'api/purchase/getPurchaseList'
import { SupplierData } from 'api/supplier/getSupplierList'
import { UserData } from 'api/user/getUserList'
import { NewComponentDetail } from 'components/Dialogs/AddNewComponentListDialog'
import { ProductDetail } from 'components/Dialogs/AddNewProductListDialog'
import useLoading from 'hooks/useLoading'

import { useCallback, useMemo, useState } from 'react'

export default function useAddComponent(purchaseData: PurchaseData) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [newComponentListData, setNewComponentListData] = useState<GridRowsProp>(
    purchaseData.component
  )
  const [componentData, setComponentData] = useState<ComponentData[]>([])
  const [userListData, setUserListData] = useState<UserData[]>([])
  const [supplierCompanyListData, setSupplierCompanyListData] = useState<SupplierData[]>([])
  const { withLoading, setLoading } = useLoading()

  const handleAddNewComponent = (newComponent: NewComponentDetail) => {
    let currentIndex = newComponentListData.length
    let currentComponentData = newComponentListData
    //should be get componentbyId for check and create new Id
    if (currentComponentData.length > 0) {
      const resultIndex = currentComponentData.findIndex(
        item => item.componentNumber === newComponent.componentNumber
      )
      if (resultIndex !== -1) {
        let newRow = currentComponentData.map((product, index) =>
          index === resultIndex
            ? { ...product, quantity: product.quantity + newComponent.quantity }
            : product
        )
        setNewComponentListData(newRow)
      } else {
        // setNewComponentListData(prev => [...prev, { id: currentIndex + 1, ...newComponent }])
      }
    } else {
      // setNewComponentListData(prev => [...prev, { id: currentIndex + 1, ...newComponent }])
    }
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

  const debouncedFetchOptions = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        setLoading(true)
        try {
          const fetchedOptions = await api.component().getComponentList()
          setComponentData(fetchedOptions.data ?? [])
        } catch (error) {
          console.error('Error fetching options:', error)
        } finally {
          setLoading(false)
        }
      }
    }, 300),
    []
  )

  const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  })

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'componentNumber',
        headerName: '商品番号',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'componentName',
        headerName: '商品名',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'quantity',
        headerName: '数量',
        headerAlign: 'center',
        flex: 1,
        editable: true,
      },
      {
        field: 'unitPrice',
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
          return row.quantity * row.unitPrice
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

  const getUserList = async () => {
    const result = await api.user().getUserList({})
    if (result.code === 200 && result.data) {
      setUserListData(result.data)
    }
  }
  const getCustomerList = async () => {
    const result = await api.supplier().getSupplierList()
    if (result.data && result.code === 200) {
      setSupplierCompanyListData(result.data)
    }
  }
  return {
    columns,
    newComponentListData,
    rowModesModel,
    processRowUpdate,
    handleRowModesModelChange,
    handleRowEditStop,
    setRowModesModel,
    setNewComponentListData,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteClick,
    debouncedFetchOptions,
    componentData,
    handleAddNewComponent,
    userListData,
    supplierCompanyListData,
    getUserList,
    getCustomerList,
  }
}
