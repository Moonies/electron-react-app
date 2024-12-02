import {
  GridRowModes,
  GridRowModesModel,
  GridRowId,
  GridRowModel,
  GridRowsProp,
  GridEventListener,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import { CustomerData } from 'api/customer/getCustomerList'
import { ProductDetail as ProductDetailList } from 'api/product/getProductData'
import { UserData } from 'api/user/getUserList'
import { ProductDetail } from 'components/Dialogs/AddNewProductListDialog'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'

import { useState } from 'react'
import { SaleModalDataProps } from 'components/Modals/SaleModal'

export default function useAddOrder(saleData: SaleModalDataProps) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [newProductListData, setNewProductListData] = useState<GridRowsProp>(saleData.product)
  const [productData, setProductData] = useState<ProductDetailList[]>([])
  const [userListData, setUserListData] = useState<UserData[]>([])
  const [customerListData, setCustomerListData] = useState<CustomerData[]>([])
  const { withLoading, setLoading } = useLoading()
  const { api } = useHttp()

  const handleAddNewProduct = (newProduct: ProductDetail) => {
    let currentProductData = newProductListData
    if (currentProductData.length === 0) {
      return setNewProductListData(prev => [...prev, { ...newProduct }])
    }

    const existingComponent = currentProductData.find(
      item => item.number === newProduct.number && item.id === newProduct.id
    )
    if (existingComponent) {
      let newRow = currentProductData.map(item =>
        item.id === newProduct.id
          ? { ...item, quantity: item.quantity + newProduct.quantity }
          : item
      )
      setNewProductListData(newRow)
    } else {
      setNewProductListData(prev => [...prev, { ...newProduct }])
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

  const getUserList = async () => {
    const result = await api.user.getUserList(0, 100)
    if (result.code === 200 && result.data) {
      setUserListData(result.data)
    }
  }
  const getCustomerList = async () => {
    const result = await api.customer.getCustomerList(0, 100)
    if (result.data && result.code === 200) {
      setCustomerListData(result.data)
    }
  }
  return {
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
    productData,
    handleAddNewProduct,
    userListData,
    customerListData,
    getUserList,
    getCustomerList,
  }
}
