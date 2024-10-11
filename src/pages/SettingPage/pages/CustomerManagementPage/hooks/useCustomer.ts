import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { CustomerData } from 'api/customer/getCustomerList'
import { api } from 'api/index'
import useLoading from 'hooks/useLoading'
import React, { useMemo, useState } from 'react'

export default function useCustomer() {
  const [customerListData, setCustomerListData] = useState<CustomerData[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })

  const { withLoading } = useLoading()

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'customerName', headerName: '名前', headerAlign: 'center' },
      { field: 'email', headerName: 'メール', headerAlign: 'center' },
      { field: 'phoneNumber', headerName: '電話番号', headerAlign: 'center' },
      {
        field: 'postalCode',
        headerName: '郵便番号',
        headerAlign: 'center',
        // minWidth: 200,
      },
      { field: 'prefecture', headerName: '都道府県', headerAlign: 'center' },
      { field: 'city', headerName: '地区町村', headerAlign: 'center' },
      { field: 'street', headerName: '番地', headerAlign: 'center' },
      { field: 'buildingName', headerName: '建物名・部屋番号', headerAlign: 'center' },
      { field: 'closeingDate', headerName: '締日', headerAlign: 'center' },
    ],
    []
  )

  const getCusomerListData = async () => {
    const result = await withLoading(api.customer.getCustomerList())
    if (result.code === 200 && result.data) {
      setCustomerListData(result.data)
    }
  }

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {}
  return {
    paginationModel,
    columns,
    customerListData,
    getCusomerListData,
    handlePaginationModelChange,
  }
}
