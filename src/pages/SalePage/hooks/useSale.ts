import { useState, useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import useLoading from 'hooks/useLoading'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { SaleData, SalesSummary, SearchCriteria } from 'api/sale/getSaleList'
import useHttp from 'hooks/useHttp'
import { SaleModalDataProps } from 'components/Modals/SaleModal'

interface CategorySaleSearch {
  value: string
  display: string
}

interface CachedData {
  [key: string]: SaleData[]
}

export default function useSales() {
  const dateThreeMonthsAgo = dayjs().subtract(3, 'month').toDate()
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    category: '',
    keyword: '',
    startDate: dateThreeMonthsAgo,
    endDate: new Date(),
    dateType: '',
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
  const { api } = useHttp()
  const dateTypeList = [
    { value: 'registrationDate', display: '登録日付' },
    { value: 'deliveryDate', display: '出荷日付' },
  ]

  const handleChange = (name: string, value: string | Date | null) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  })

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'orderCode',
        headerName: '受注番号',
        headerAlign: 'center',
      },
      {
        field: 'saleCode',
        headerName: '注番',
        headerAlign: 'center',
      },
      {
        field: 'companyName',
        headerName: '発注先名',
        headerAlign: 'center',
        flex: 1,
        valueGetter: (value, row: any) => (row.company ? row.company.companyInfo.name : ''),
      },
      // { field: 'orderId', headerName: '注番', headerAlign: 'center' },
      { field: 'registrationDate', headerName: '登録日付', headerAlign: 'center' },
      {
        field: 'owners',
        headerName: '担当者',
        headerAlign: 'center',
        valueGetter: (value: { id: string; name: string }[]) =>
          value.length > 0 ? value[0].name : '',
      },
      // { field: 'orderApprovedEmployeeName', headerName: '承認者', headerAlign: 'center' },
      // { field: 'quotationRequestDate', headerName: '見積書日付', headerAlign: 'center' },
      { field: 'shipmentDate', headerName: '出荷日付', headerAlign: 'center' },
    ],
    []
  )

  const prepareCategorySearch = useMemo(() => {
    let result: CategorySaleSearch[] = []
    columns.forEach(item => {
      if (['status', 'registrationDate', 'deliveryDate'].includes(item.field)) {
        return
      }
      if (item.field === 'companyName') {
        return result.push({
          value: 'company.companyInfo.name',
          display: item.headerName || '',
        })
      }

      if (item.field === 'owners') {
        return result.push({
          value: 'owners.name',
          display: item.headerName || '',
        })
      }

      result.push({
        value: item.field,
        display: item.headerName || '',
      })
    })
    setCategorySearch(result)
  }, [])

  const handleSelectedSaleDetail = (selectedSaleOrder: SaleData) => {
    let saleDetail: SaleModalDataProps = {
      id: selectedSaleOrder.id,
      orderCode: selectedSaleOrder.orderCode,
      saleCode: selectedSaleOrder.saleCode,
      invoiceNumber: selectedSaleOrder.invoiceNumber,
      customerCompanyId: selectedSaleOrder.companyId,
      customerCompanyName: selectedSaleOrder.company.companyInfo.name,
      product: selectedSaleOrder.products,
      registrationDate: selectedSaleOrder.registrationDate,
      shippingmentDate: selectedSaleOrder.shipmentDate,
      status: selectedSaleOrder.status,
      totalAmount: selectedSaleOrder.totalAmount,
      owners: selectedSaleOrder.owners,
      memo: selectedSaleOrder.memo,
    }
    return saleDetail
  }

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

  const getSaleList = async ({ page, pageSize }: GridPaginationModel) => {
    setLoading(true)
    const result = await api.sale.getSaleList(searchCriteria)
    if (result.code === 200 && result.data) {
      // setSalesSummary(result.data.summary)
      setSaleData(result.data)
      setTotalRows(result.page?.totalElements ?? 0)
      // Cache the fetched data
      setCachedData(prevCache => ({
        ...prevCache,
        [`${page}-${pageSize}`]: result.data ? result.data : [],
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
    prepareCategorySearch,
    categorySearch,
    totalRows,
    dateTypeList,
    handleSelectedSaleDetail,
  }
}
