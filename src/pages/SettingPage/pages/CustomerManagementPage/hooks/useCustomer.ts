import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { AddNewCustomerProps } from 'api/customer/addNewCustomer'
import { CustomerCompanyDetail, CustomerData } from 'api/customer/getCustomerList'
import { UpdateCustomerDetailProps } from 'api/customer/updateCustomerDetail'
import { api } from 'api/index'
import { ModalCustomerProps } from 'components/Modals/CustomerManagementModal'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'
import React, { useMemo, useState } from 'react'

export default function useCustomer() {
  const [customerListData, setCustomerListData] = useState<CustomerData[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 100,
  })

  const { withLoading } = useLoading()
  const { notificationSnackbar } = useNotification()

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: '名前',
        headerAlign: 'center',
        valueGetter: (value, row: CustomerData) => {
          // console.log(value)
          // console.log('row', row)
          return row.companyInfo.name
        },
      },
      {
        field: 'email',
        headerName: 'メール',
        headerAlign: 'center',
        valueGetter: (value, row: CustomerData) => {
          return row.companyInfo.email
        },
      },
      {
        field: 'phoneNumber',
        headerName: '電話番号',
        headerAlign: 'center',
        valueGetter: (value, row: CustomerData) => row.companyInfo.phoneNumber,
      },
      {
        field: 'postalCode',
        headerName: '郵便番号',
        headerAlign: 'center',
        // minWidth: 200,
        valueGetter: (value, row: CustomerData) => row.companyInfo.address.postalCode,
      },
      {
        field: 'prefecture',
        headerName: '都道府県',
        headerAlign: 'center',
        valueGetter: (value, row: CustomerData) => row.companyInfo.address.prefecture,
      },
      {
        field: 'city',
        headerName: '地区町村',
        headerAlign: 'center',
        valueGetter: (value, row: CustomerData) => row.companyInfo.address.city,
      },
      {
        field: 'street',
        headerName: '番地',
        headerAlign: 'center',
        valueGetter: (value, row: CustomerData) => row.companyInfo.address.streetAddress,
      },
      {
        field: 'buildingName',
        headerName: '建物名・部屋番号',
        headerAlign: 'center',
        valueGetter: (value, row: CustomerData) => row.companyInfo.buildingName,
      },
      { field: 'closingDay', headerName: '締日', headerAlign: 'center' },
    ],
    []
  )

  const handleUpdateData = async (newData: ModalCustomerProps) => {
    let updateCustomerData: UpdateCustomerDetailProps = {
      // closingDay: newData.closingDay,
      companyCode: newData.companyCode,
      companyInfo: {
        address: {
          city: newData.city,
          postalCode: newData.postalCode,
          prefecture: newData.prefecture,
          streetAddress: newData.streetAddress,
        },
        buildingName: newData.buildingName,
        email: newData.email,
        fax: newData.fax,
        name: newData.name,
        phoneNumber: newData.phoneNumber,
      },
      companyType: newData.companyType,
      id: newData?.id ?? '',
      // paymentDeadline: newData.paymentDeadline,
    }
    updateSelectedCustomer(updateCustomerData)
  }

  const getCusomerListData = async () => {
    const result = await withLoading(api.customer.getCustomerList())
    if (result.code === 200 && result.data) {
      setCustomerListData(result.data)
    }
  }

  const createNewCustomer = async (newCustomerData: AddNewCustomerProps) => {
    const result = await withLoading(api.customer.addNewCustomer(newCustomerData))
    if (result.code !== 200) {
      notificationSnackbar.error(result.message)
      // setCustomerListData(result.data)
      return false
    } else {
      notificationSnackbar.success('追加完了しました。')
      return true
    }
  }

  const updateSelectedCustomer = async (updateData: UpdateCustomerDetailProps) => {
    const result = await withLoading(api.customer.updateCustomerDetail(updateData))
    if (result.code !== 200) {
      notificationSnackbar.error(result.message)
      // setCustomerListData(result.data)
      return false
    } else {
      notificationSnackbar.success('編集完了しました。')
      return true
    }
  }

  const deleteSelectedCustomer = async (customerId: string) => {
    const result = await withLoading(api.customer.deleteCustomer(customerId))
    if (result.code === 200) {
      notificationSnackbar.success('削除完了しました。')
      //getList
      return true
    } else {
      notificationSnackbar.error(result.message)
    }
  }

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {}
  return {
    paginationModel,
    columns,
    customerListData,
    getCusomerListData,
    handlePaginationModelChange,
    handleUpdateData,
    updateSelectedCustomer,
    createNewCustomer,
    deleteSelectedCustomer,
  }
}
