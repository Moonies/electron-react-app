import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'

import { AddNewCustomerProps } from 'api/customer/addNewCustomer'
import { CustomerCompanyDetail, CustomerData } from 'api/customer/getCustomerList'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { ModalCustomerProps } from 'components/Modals/CustomerManagementModal'
import { UpdateCustomerDetailProps } from 'api/customer/updateCustomerDetail'
import { useMemo, useState } from 'react'

interface CachedData {
  [key: string]: CustomerData[]
}

export default function useCustomer() {
  const [customerListData, setCustomerListData] = useState<CustomerData[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 100,
  })
  const { api } = useHttp()

  const { withLoading } = useLoading()
  const { notificationSnackbar } = useNotification()
  const [cachedData, setCachedData] = useState<CachedData>({})
  const [totalRows, setTotalRows] = useState(0)

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

  const getCusomerListData = async ({ page, pageSize }: GridPaginationModel) => {
    const result = await withLoading(api.customer.getCustomerList(page, pageSize))
    if (result.code === 200 && result.data) {
      // setCustomerListData(result.data)
      setCustomerListData(result.data)
      setTotalRows(result.page?.totalElements ?? 0)
      // Cache the fetched data
      setCachedData(prevCache => ({
        ...prevCache,
        [`${page}-${pageSize}`]: result.data ? result.data : [],
      }))
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

  const handlePaginationModelChange = async (newModel: GridPaginationModel) => {
    if (newModel.pageSize !== paginationModel.pageSize) {
      // If page size has changed, reset to the first page
      setPaginationModel({ page: 0, pageSize: newModel.pageSize })
      // Clear the cache when page size changes
      setCachedData({})
    } else {
      setPaginationModel(newModel)
    }
    const cacheKey = `${newModel.page}-${newModel.pageSize}`
    if (cachedData[cacheKey]) {
      setCustomerListData(cachedData[cacheKey])
      return
    } else if (customerListData.length !== 0) {
      getCusomerListData(newModel)
    }
  }

  return {
    paginationModel,
    columns,
    customerListData,
    getCusomerListData,
    handlePaginationModelChange,
    updateSelectedCustomer,
    createNewCustomer,
    deleteSelectedCustomer,
    totalRows,
  }
}
