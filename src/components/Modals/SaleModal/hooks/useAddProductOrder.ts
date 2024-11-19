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
  GridValidRowModel,
} from '@mui/x-data-grid'
import { CustomerData } from 'api/customer/getCustomerList'
import { OrderData } from 'api/order/getOrderList'
import { ProductDetail as ProductDetailList } from 'api/product/getProductData'
import { UserData } from 'api/user/getUserList'
import { ProductDetail } from 'components/Dialogs/AddNewProductListDialog'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'

import { useCallback, useMemo, useState } from 'react'
import { formatJPY } from 'utils/formatUtils'
import { SaleModalDataProps } from '..'

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

  // const debouncedFetchOptions = useCallback(
  //   debounce(async (query: string) => {
  //     if (query.length >= 2) {
  //       setLoading(true)
  //       try {
  //         const fetchedOptions = await api.product.getProductData(query)
  //         setProductData(fetchedOptions.data?.data ?? [])
  //       } catch (error) {
  //         console.error('Error fetching options:', error)
  //       } finally {
  //         setLoading(false)
  //       }
  //     }
  //   }, 300),
  //   []
  // )

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'number',
        headerName: '商品番号',
        headerAlign: 'center',
        flex: 1,
      },
      {
        field: 'name',
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
    [rowModesModel, handleSaveClick, handleCancelClick, handleEditClick, handleDeleteClick]
  )

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
    productData,
    handleAddNewProduct,
    userListData,
    customerListData,
    getUserList,
    getCustomerList,
  }
}
