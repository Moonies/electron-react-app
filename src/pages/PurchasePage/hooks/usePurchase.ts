import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { api } from 'api/index'
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

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    category: '',
    keyword: '',
    startDate: dateThreeMonthsAgo,
    endDate: new Date(),
  })

  const handleChange = (name: string, value: string | Date) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const [categorySearch, setCategorySearch] = useState<CategorySaleSearch[]>()

  const handleSearch = useCallback(async () => {
    //if condition when search put in here
    getPurchaseListData(paginationModel)
  }, [searchCriteria, withLoading])

  const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  })

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'invoiceNumber',
        headerName: '伝票番号',
        headerAlign: 'center',
        // minWidth: 100,
        // flex: 1,
        // valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD'),
      },
      { field: 'supplierCompanyName', headerName: '仕入先', headerAlign: 'center', flex: 1 },
      { field: 'quotationRequestDate', headerName: '登録日付', headerAlign: 'center' },
      { field: 'productId', headerName: '商品番号', minWidth: 100, headerAlign: 'center' },

      { field: 'productName', headerName: '品名', minWidth: 100, headerAlign: 'center', flex: 1 },
      { field: 'quantity', headerName: '数量', type: 'number', headerAlign: 'center' },
      {
        field: 'unitPrice',
        headerName: '単価',
        type: 'number',
        headerAlign: 'center',
        valueFormatter: value => currencyFormatter.format(Number(value)),
      },
      {
        field: 'totalPrice',
        headerName: '金額',
        type: 'number',
        headerAlign: 'center',
        valueFormatter: value => currencyFormatter.format(Number(value)),
      },
      { field: 'orderRequestEmployeeName', headerName: '担当者名', headerAlign: 'center' },
      { field: 'orderApprovedEmployeeName', headerName: '承認者', headerAlign: 'center' },
      { field: 'purchaseApprovedDate', headerName: '見積書依頼', headerAlign: 'center' },
      { field: 'purchaseReciptDate', headerName: '入庫承認済', headerAlign: 'center' },
    ],
    []
  )

  const prepareCategorySearch = useMemo(() => {
    let result: CategorySaleSearch[] = []
    columns.forEach(item => {
      result.push({ value: item.field, display: item.headerName ? item.headerName : '' })
    })
    setCategorySearch(result)
  }, [])

  const getPurchaseListData = async ({ page, pageSize }: GridPaginationModel) => {
    setLoading(true)
    //call api
    const result = await api.purchase().getPurchaseList(searchCriteria)
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
  }
}
