import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { api } from 'api/index'
import { PurchaseStatus } from 'api/purchase'
import { PurchaseData, SearchCriteria } from 'api/purchase/getPurchaseList'
import dayjs from 'dayjs'
import useLoading from 'hooks/useLoading'
import React, { useCallback, useMemo, useState } from 'react'

interface CategorySaleSearch {
  value: string
  display: string
}

export default function usePurchase() {
  const dateThreeMonthsAgo = dayjs().subtract(6, 'month').toDate()
  const { withLoading, setLoading } = useLoading()
  const [purchaseData, setPurchaseData] = useState<PurchaseData[]>([])
  // const [cachedData, setCachedData] = useState<CachedData>({})
  const [totalRows, setTotalRows] = useState(0)
  const statusPurchase = Object.values(PurchaseStatus)

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    category: '',
    keyword: '',
    startDate: dateThreeMonthsAgo,
    endDate: new Date(),
    status: null,
  })

  const handleChange = (name: string, value: string | Date) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const [categorySearch, setCategorySearch] = useState<CategorySaleSearch[]>()

  const handleSearch = useCallback(async () => {
    //if condition when search put in here
    getPurchaseListData(paginationModel)
  }, [searchCriteria, withLoading])

  const convertStatus = (status: string) => {
    switch (status) {
      case PurchaseStatus.INVOICE_PENDING:
        return '見積書依頼'
      case PurchaseStatus.ON_DELIVERY:
        return '配達中'
      case PurchaseStatus.DELIVERED:
        return '入庫済'
      case PurchaseStatus.REJECTED:
        return '返品中'
      case PurchaseStatus.CANCELLED:
        return 'キャンセル'
      default:
        return ''
    }
  }

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'invoiceNumber',
        headerName: '注番',
        headerAlign: 'center',
        // minWidth: 100,
        // flex: 1,
        // valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD'),
      },
      {
        field: 'status',
        headerName: '状態',
        headerAlign: 'center',
        valueFormatter: value => convertStatus(value),
      },
      { field: 'supplierCompanyName', headerName: '仕入先', headerAlign: 'center', flex: 1 },
      { field: 'quotationRequestDate', headerName: '登録日付', headerAlign: 'center' },
      { field: 'orderRequestEmployeeName', headerName: '担当者', headerAlign: 'center' },
      { field: 'orderApprovedEmployeeName', headerName: '承認者', headerAlign: 'center' },
      { field: 'purchaseApprovedDate', headerName: '見積書依頼', headerAlign: 'center' },
      { field: 'purchaseReciptDate', headerName: '入庫承認済', headerAlign: 'center' },
    ],
    []
  )

  const prepareCategorySearch = useMemo(() => {
    let result: CategorySaleSearch[] = []
    columns.forEach(item => {
      if (item.field === 'status') return
      result.push({ value: item.field, display: item.headerName ? item.headerName : '' })
    })
    setCategorySearch(result)
  }, [])

  const getPurchaseListData = async ({ page, pageSize }: GridPaginationModel) => {
    setLoading(true)
    //call api
    const result = await api.purchase.getPurchaseList(searchCriteria)
    if (result.code === 200 && result.data) {
      setPurchaseData(result.data.data)
    }
    setLoading(false)
  }

  const handlePaginationModelChange = async (newModel: GridPaginationModel) => {
    if (newModel.pageSize !== paginationModel.pageSize) {
      // If page size has changed, reset to the first page
      setPaginationModel({ page: 0, pageSize: newModel.pageSize })
      // Clear the cache when page size changes
      // setCachedData({})
    } else {
      setPaginationModel(newModel)
    }
    const cacheKey = `${newModel.page}-${newModel.pageSize}`
    // if (cachedData[cacheKey]) {
    //   setSalesData(cachedData[cacheKey])
    //   return
    // }
    // getSaleList(newModel)
  }
  return {
    searchCriteria,
    handleChange,
    handleSearch,
    columns,
    purchaseData,
    paginationModel,
    handlePaginationModelChange,
    prepareCategorySearch,
    categorySearch,
    statusPurchase,
    convertStatus,
  }
}
