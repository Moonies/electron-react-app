import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { api } from 'api/index'
import { AddNewSupplierProps } from 'api/supplier/addNewSupplier'
import { SupplierData } from 'api/supplier/getSupplierList'
import { UpdateSupplierDetailProps } from 'api/supplier/updateSupplierDetail'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'
import { useMemo, useState } from 'react'

export default function useSupplier() {
  const [supplierListData, setSupplierListData] = useState<SupplierData[]>([])
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
        valueGetter: (value, row: SupplierData) => {
          // console.log(value)
          // console.log('row', row)
          return row.companyInfo.name
        },
      },
      {
        field: 'email',
        headerName: 'メール',
        headerAlign: 'center',
        valueGetter: (value, row: SupplierData) => {
          return row.companyInfo.email
        },
      },
      {
        field: 'phoneNumber',
        headerName: '電話番号',
        headerAlign: 'center',
        valueGetter: (value, row: SupplierData) => row.companyInfo.phoneNumber,
      },
      {
        field: 'postalCode',
        headerName: '郵便番号',
        headerAlign: 'center',
        // minWidth: 200,
        valueGetter: (value, row: SupplierData) => row.companyInfo.address.postalCode,
      },
      {
        field: 'prefecture',
        headerName: '都道府県',
        headerAlign: 'center',
        valueGetter: (value, row: SupplierData) => row.companyInfo.address.prefecture,
      },
      {
        field: 'city',
        headerName: '地区町村',
        headerAlign: 'center',
        valueGetter: (value, row: SupplierData) => row.companyInfo.address.city,
      },
      {
        field: 'street',
        headerName: '番地',
        headerAlign: 'center',
        valueGetter: (value, row: SupplierData) => row.companyInfo.address.streetAddress,
      },
      {
        field: 'buildingName',
        headerName: '建物名・部屋番号',
        headerAlign: 'center',
        valueGetter: (value, row: SupplierData) => row.companyInfo.buildingName,
      },
      { field: 'closingDay', headerName: '締日', headerAlign: 'center' },
    ],
    []
  )

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {}

  const getSupplierListData = async () => {
    const result = await withLoading(api.supplier.getSupplierList())
    if (result.code === 200 && result.data) {
      setSupplierListData(result.data)
    }
  }

  const createNewSupplier = async (newSupplier: AddNewSupplierProps) => {
    const result = await withLoading(api.supplier.addnewSupplier(newSupplier))
    if (result.code === 200) {
      notificationSnackbar.success('追加完了しました。')
      return true
    } else {
      notificationSnackbar.error(result.message)
      return false
    }
  }

  const updateSelectedSupplier = async (updateData: UpdateSupplierDetailProps) => {
    const result = await withLoading(api.supplier.updateSupplierDetail(updateData))
    if (result.code === 200) {
      notificationSnackbar.success('編集完了しました。')
      return true
    } else {
      notificationSnackbar.error(result.message)
      return false
    }
  }

  const deleteSelectedSupplier = async (supplierId: string) => {
    const result = await withLoading(api.supplier.deleteSupplier(supplierId))
    if (result.code === 200) {
      notificationSnackbar.success('削除完了しました。')
      //getList
      return true
    } else {
      notificationSnackbar.error(result.message)
    }
  }
  return {
    paginationModel,
    columns,
    handlePaginationModelChange,
    getSupplierListData,
    supplierListData,
    createNewSupplier,
    updateSelectedSupplier,
    deleteSelectedSupplier,
  }
}
