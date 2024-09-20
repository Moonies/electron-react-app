import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { api } from 'api/index'
import { OrderStatus } from 'api/order'
import { NewOrder } from 'api/order/addNewOrder'
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
  const [statusOrder, setStatusOrder] = useState<OrderStatus[]>([])
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

  const convertStatus = (status: string) => {
    switch (status) {
      case OrderStatus.RECEIVED:
        return '発注'
      case OrderStatus.PENDING:
        return '見積'
      case OrderStatus.DELAY:
        return '納期超過'
      case OrderStatus.CONFIRMED:
        return '未発注'
      case OrderStatus.PROCESSING:
        return 'processing'
      // case OrderStatus.INSTORE:
      //   return '入庫済'
      // case OrderStatus.DELIVERED:
      //   return '出荷済'
      case OrderStatus.CANCELLED:
        return 'キャンセル'
      default:
        return status
    }
  }

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: '受注番号',
        headerAlign: 'center',
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
      if (item.field === 'status') return
      result.push({ value: item.field, display: item.headerName ? item.headerName : '' })
    })
    setCategorySearch(result)
  }, [])

  const prepareCategoryStatus = useMemo(() => {
    let result: OrderStatus[] = []
    Object.values(OrderStatus).forEach(item => {
      if (
        item === OrderStatus.IN_STORE ||
        item === OrderStatus.DELIVERY ||
        item === OrderStatus.ORDERED
      )
        return
      result.push(item)
    })
    setStatusOrder(result)
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

  const addNewOrder = async (formData: OrderData) => {
    let data: NewOrder = {
      orderId: formData.orderId,
      customerCompanyId: formData.customerCompanyId,
      product: formData.product,
      orderRequestEmployeeId: formData.orderRequestEmployeeId,
      orderApprovedEmployeeId: formData.orderApprovedEmployeeId,
      quotationRequestDate: dayjs(formData.quotationRequestDate).format('YYYY/MM/DD'),
      registDate: dayjs(formData.registDate).format('YYYY/MM/DD'),
      shippingmentDate: dayjs(formData.shippingmentDate).format('YYYY/MM/DD'),
      paymentDueDate: dayjs(formData.paymentDueDate).format('YYYY/MM/DD'),
      status: formData.status,
    }
    // console.log(data)
    //call api
    const result = await api.order().addNewOrder(data)
  }

  const editOrder = async (FormData: OrderData) => {
    //call update api
  }

  const deleteOrder = async (FormData: OrderData) => {
    //cal delete api
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
    prepareCategoryStatus,
    categorySearch,
    handlePaginationModelChange,
    statusOrder,
    convertStatus,
    addNewOrder,
    editOrder,
    deleteOrder,
  }
}
