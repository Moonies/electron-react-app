import { useState, useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { api } from 'api'
import useLoading from 'hooks/useLoading'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { SaleData, SalesSummary, SearchCriteria } from 'api/sale/getSaleList'

interface CategorySaleSearch {
  value: string
  display: string
}

interface CachedData {
  [key: string]: SaleData[]
}

export default function useSales() {
  const dateThreeMonthsAgo = dayjs().subtract(6, 'month').toDate()

  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    category: '',
    keyword: '',
    startDate: dateThreeMonthsAgo,
    endDate: new Date(),
  })
  const [categorySearch, setCategorySearch] = useState<CategorySaleSearch[]>()
  const [cachedData, setCachedData] = useState<CachedData>({})

  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null)
  const [saleData, setSaleData] = useState<SaleData[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [totalRows, setTotalRows] = useState(0)
  const { withLoading, setLoading } = useLoading()

  const handleChange = (name: string, value: string | Date) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  })

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: '受注番号',
        headerAlign: 'center',
      },
      { field: 'customerCompanyName', headerName: '発注先', headerAlign: 'center', flex: 1 },
      { field: 'orderId', headerName: '注番', headerAlign: 'center' },
      // { field: 'registDate', headerName: '登録日付', headerAlign: 'center' },
      { field: 'orderRequestEmployeeName', headerName: '担当者', headerAlign: 'center' },
      // { field: 'orderApprovedEmployeeName', headerName: '承認者', headerAlign: 'center' },
      { field: 'quotationRequestDate', headerName: '見積書日付', headerAlign: 'center' },
      { field: 'shippingmentDate', headerName: '出荷日付', headerAlign: 'center' },
      { field: 'paymentDueDate', headerName: '支払期限', headerAlign: 'center' },
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

  const handleSearch = useCallback(async () => {
    //if condition when search put in here
    getSaleList(paginationModel)
  }, [searchCriteria, withLoading])

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
      setSaleData(cachedData[cacheKey])
      return
    }
    getSaleList(newModel)
  }

  const addNewSaleData = useCallback(() => {
    //call api to insert
  }, [])

  const updateSaleData = useCallback(() => {
    //call api to update
    //and refersh dataTable
  }, [])

  const getSaleList = async ({ page, pageSize }: GridPaginationModel) => {
    setLoading(true)
    const result = await api.sale().getSaleList(searchCriteria)
    if (result.code === 200 && result.data) {
      setSalesSummary(result.data.summary)
      setSaleData(result.data.data)
      setTotalRows(result.data.totalRow)
      // Cache the fetched data
      setCachedData(prevCache => ({
        ...prevCache,
        [`${page}-${pageSize}`]: result.data ? result.data.data : [],
      }))
    }
    setLoading(false)
  }

  return {
    searchCriteria,
    handleChange,
    handleSearch,
    salesSummary,
    saleData,
    columns,
    handlePaginationModelChange,
    paginationModel,
    currencyFormatter,
    addNewSaleData,
    updateSaleData,
    prepareCategorySearch,
    categorySearch,
    totalRows,
  }
}
