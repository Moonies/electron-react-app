import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { api } from 'api/index'
import { OrderStatus } from 'api/order'
import { OrderData } from 'api/order/getOrderList'
import dayjs from 'dayjs'
import useLoading from 'hooks/useLoading'
import { useCallback, useMemo, useState } from 'react'

interface CategorySaleSearch {
  value: string
  display: string
}

export default function useOrder() {
  const dateThreeMonthsAgo = dayjs().subtract(6, 'month').toDate()
  const { withLoading, setLoading } = useLoading()
  const [orderData, setOrderData] = useState<OrderData[]>([])
  // const [cachedData, setCachedData] = useState<CachedData>({})
  const [totalRows, setTotalRows] = useState(0)
  const statusOrder: OrderStatus[] = Object.values(OrderStatus)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [searchCriteria, setSearchCriteria] = useState({
    category: '',
    keyword: '',
    startDate: dateThreeMonthsAgo,
    endDate: new Date(),
    status: null,
  })

  const [categorySearch, setCategorySearch] = useState<CategorySaleSearch[]>()
  const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  })

  const convertStatus = (status: string) => {
    switch (status) {
      case OrderStatus.RECEIVED:
        return '未発注'
      case OrderStatus.PROCESSING:
        return '発注済'
      case OrderStatus.OVER_DUE_DATE:
        return '納期超過'
      case OrderStatus.SHIPPED:
        return '出荷中'
      case OrderStatus.DELIVERED:
        return '出荷済'
      case OrderStatus.CANCEL:
        return 'キャンセル'
      default:
        return ''
    }
  }

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: '受注番号',
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
      { field: 'customerCompanyName', headerName: '発注先', headerAlign: 'center', flex: 1 },
      { field: 'orderId', headerName: '注番', headerAlign: 'center' },
      { field: 'registDate', headerName: '登録日付', headerAlign: 'center' },
      // { field: 'productNumber', headerName: '商品番号', minWidth: 100, headerAlign: 'center' },

      // { field: 'productName', headerName: '品名', minWidth: 100, headerAlign: 'center', flex: 1 },
      // { field: 'quantity', headerName: '数量', type: 'number', headerAlign: 'center' },
      // {
      //   field: 'unitPrice',
      //   headerName: '単価',
      //   type: 'number',
      //   headerAlign: 'center',
      //   valueFormatter: value => currencyFormatter.format(Number(value)),
      // },
      // {
      //   field: 'totalPrice',
      //   headerName: '金額',
      //   type: 'number',
      //   headerAlign: 'center',
      //   valueFormatter: value => currencyFormatter.format(Number(value)),
      // },
      { field: 'orderRequestEmployeeName', headerName: '担当者名', headerAlign: 'center' },
      { field: 'orderApprovedEmployeeName', headerName: '承認者', headerAlign: 'center' },
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
  const handleChange = (name: string, value: string | Date) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = useCallback(async () => {
    //if condition when search put in here
    getPurchaseListData(paginationModel)
  }, [searchCriteria, withLoading])

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

  const getPurchaseListData = async ({ page, pageSize }: GridPaginationModel) => {
    setLoading(true)
    //call api
    const result = await api.order().getOrderList(searchCriteria)
    if (result.code === 200 && result.data) {
      setOrderData(result.data.data)
    }
    setLoading(false)
  }
  return {
    searchCriteria,
    paginationModel,
    handleChange,
    handleSearch,
    orderData,
    columns,
    prepareCategorySearch,
    categorySearch,
    handlePaginationModelChange,
    statusOrder,
  }
}
