import { debounce } from '@mui/material'
import {
  GridColDef,
  GridRowModes,
  GridRowModesModel,
  GridRowId,
  GridRowModel,
  GridRowsProp,
  GridEventListener,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import { ComponentData } from 'api/component/getComponentList'
import { SupplierData } from 'api/supplier/getSupplierList'
import { UserData } from 'api/user/getUserList'
import { NewComponentDetail } from 'components/Dialogs/AddNewComponentListDialog'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'

import { useCallback, useMemo, useState } from 'react'
import { PurchaseModalDataProps } from 'components/Modals/PurchaseModal'
import { StatusDetail } from 'api/status/getStatusList'
import { OrderType } from 'api/order'

export default function useAddComponent(purchaseData: PurchaseModalDataProps) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [newComponentListData, setNewComponentListData] = useState<GridRowsProp>(
    purchaseData.component
  )
  const [componentData, setComponentData] = useState<ComponentData[]>([])
  const [userListData, setUserListData] = useState<UserData[]>([])
  const [supplierCompanyListData, setSupplierCompanyListData] = useState<SupplierData[]>([])
  const [statusList, setStatusList] = useState<StatusDetail[]>([])

  const { withLoading, setLoading } = useLoading()
  const { api } = useHttp()

  const handleAddNewComponent = (newComponent: NewComponentDetail) => {
    // let currentIndex = newComponentListData.length
    let currentComponentData = newComponentListData
    //should be get componentbyId for check and create new Id

    if (currentComponentData.length === 0) {
      return setNewComponentListData(prev => [...prev, { ...newComponent }])
    }

    const existingComponent = currentComponentData.find(
      item => item.number === newComponent.number && item.id === newComponent.id
    )
    if (existingComponent) {
      let newRow = currentComponentData.map(item =>
        item.id === newComponent.id
          ? { ...item, quantity: item.quantity + newComponent.quantity }
          : item
      )
      setNewComponentListData(newRow)
    } else {
      setNewComponentListData(prev => [...prev, { ...newComponent }])
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
          const fetchedOptions = await api.component.getComponentList({ keyword: query })
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

  const getUserList = async () => {
    const result = await api.user.getUserList(0, 100)
    if (result.code === 200 && result.data) {
      setUserListData(result.data)
    }
  }
  const getCustomerList = async () => {
    const result = await api.supplier.getSupplierList()
    if (result.data && result.code === 200) {
      setSupplierCompanyListData(result.data)
    }
  }

  const getStatus = async () => {
    const result = await api.status.getStatusList()
    if (result.code === 200 && result.data) {
      let status = result.data.filter(
        status => status.orderType === OrderType.PURCHASE || status.orderType === OrderType.ALL
      )
      setStatusList(status)
    }
    return []
  }

  return {
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
    getStatus,
    statusList,
  }
}
