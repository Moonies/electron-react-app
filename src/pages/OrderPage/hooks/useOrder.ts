import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { OrderStatus, OrderType } from 'api/order'
import { NewOrder } from 'api/order/addNewOrder'
import { OrderData, OrderSearchCriteria } from 'api/order/getOrderList'
import { PurchaseStatus } from 'api/purchase'
import { AddNewPurchase } from 'api/purchase/addNewPurchase'
import { PurchaseData } from 'api/purchase/getPurchaseList'
import { NewPurchaseDetail } from 'api/purchase/updatePurchaseDetail'
import { PurchaseModalDataProps } from 'components/Modals/PurchaseModal'
import dayjs from 'dayjs'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'
import { useCallback, useMemo, useState } from 'react'

interface CategorySaleSearch {
  value: string
  display: string
}
interface StatusOption {
  value: OrderStatus
  label: string
  type: OrderType
}

export default function useOrder() {
  const dateThreeMonthsAgo = dayjs().subtract(3, 'month').toDate()
  const { withLoading, setLoading } = useLoading()
  const [orderData, setOrderData] = useState<OrderData[]>([])
  // const [cachedData, setCachedData] = useState<CachedData>({})
  const [totalRows, setTotalRows] = useState(0)
  const [statusOrder, setStatusOrder] = useState<StatusOption[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [searchCriteria, setSearchCriteria] = useState({
    category: '',
    keyword: '',
    startDate: dateThreeMonthsAgo,
    endDate: new Date(),
    status: '',
  })
  const { api } = useHttp()

  const [categorySearch, setCategorySearch] = useState<CategorySaleSearch[]>()

  const convertStatus = (status: string, orderType: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return orderType === OrderType.SALE ? '見積' : '未発注'
      // case OrderStatus.DELAY:
      //   return '納期超過'
      case OrderStatus.CONFIRM:
        return '発注'
      // case OrderStatus.RECEIVED:
      //   return '発注'
      // case OrderStatus.PROCESSING:
      //   return 'processing'
      // case OrderStatus.INSTORE:　//completed in purchase order should be can see purchase page only
      //   return '入庫済'
      // case OrderStatus.DELIVERED: //completed in sale order should be can see sale page only
      //   return '出荷済'
      case OrderStatus.CANCEL:
        return 'キャンセル'
      default:
        return status
    }
  }

  const convertOrderType = (orderType: string) => {
    switch (orderType) {
      case OrderType.PURCHASE:
        return '仕入'
      case OrderType.SALE:
        return '売上'
      default:
        break
    }
  }

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'orderCode',
        headerName: '受注番号',
        headerAlign: 'center',
      },
      {
        field: 'orderType',
        headerName: '受注タイプ',
        headerAlign: 'center',
        valueFormatter: value => convertOrderType(value),
      },
      {
        field: 'status',
        headerName: '状態',
        headerAlign: 'center',
        valueFormatter: (value, row: OrderData) => convertStatus(value, row.orderType),
      },
      {
        field: 'companyName',
        headerName: '発注先',
        headerAlign: 'center',
        flex: 1,
        valueGetter: (value, row: OrderData) => row.company.companyInfo.name,
      },
      // { field: 'orderId', headerName: '注番', headerAlign: 'center' },
      { field: 'registrationDate', headerName: '登録日付', headerAlign: 'center' },
      { field: 'orderRequestEmployeeName', headerName: '担当者', headerAlign: 'center' },
      // { field: 'orderApprovedEmployeeName', headerName: '承認者', headerAlign: 'center' },
      // { field: 'quotationRequestDate', headerName: '見積書日付', headerAlign: 'center' },
      { field: 'deliveryDate', headerName: '出荷日付', headerAlign: 'center' },
      // { field: 'paymentDueDate', headerName: '支払期限', headerAlign: 'center' },
    ],
    []
  )

  const prepareCategorySearch = useMemo(() => {
    let result: CategorySaleSearch[] = []
    columns.forEach(item => {
      if (item.field === 'status' || item.field === 'orderType') return
      result.push({ value: item.field, display: item.headerName ? item.headerName : '' })
    })
    setCategorySearch(result)
  }, [])

  const prepareCategoryStatus = useMemo(() => {
    // let result: OrderStatus[] = []
    // Object.values(OrderStatus).forEach(item => {
    //   if (
    //     item === OrderStatus.IN_STORE ||
    //     item === OrderStatus.DELIVERY ||
    //     item === OrderStatus.ORDERED
    //   )
    //     return
    //   result.push(item)
    // })
    let status: StatusOption[] = [
      { value: OrderStatus.PENDING, label: '見積', type: OrderType.SALE },
      { value: OrderStatus.CONFIRM, label: '受注', type: OrderType.SALE },
      { value: OrderStatus.SHIP, label: '出荷', type: OrderType.SALE },
      // { value: OrderStatus.COMPLETE, label: '売上', type: OrderType.SALE },
      { value: OrderStatus.PENDING, label: '未発注', type: OrderType.PURCHASE },
      { value: OrderStatus.CONFIRM, label: '発注', type: OrderType.PURCHASE },
      { value: OrderStatus.SHIP, label: '手配', type: OrderType.PURCHASE },
      // { value: OrderStatus.COMPLETE, label: '入庫', type: OrderType.PURCHASE },
      // { value: OrderStatus.CANCEL, label: 'キャンセル', type: OrderType.PURCHASE },
      { value: OrderStatus.REJECT, label: '返品', type: OrderType.ALL },
      { value: OrderStatus.CANCEL, label: 'キャンセル', type: OrderType.ALL },
    ]
    setStatusOrder(status)
  }, [])

  const handleChange = (name: string, value: string | Date | null) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = useCallback(async () => {
    //if condition when search put in here
    getOrderListData(paginationModel)
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

  const handlerDeleteOrder = async (selectedOrder: OrderData) => {
    if (selectedOrder.orderType === OrderType.SALE) {
    } else {
      return await deletePurchaseOrder(selectedOrder.id)
    }
  }

  const addNewOrder = async (formData: OrderData) => {
    // let data: NewOrder = {
    //   orderId: formData.orderId,
    //   customerCompanyId: formData.customerCompanyId,
    //   product: formData.product,
    //   orderRequestEmployeeId: formData.orderRequestEmployeeId,
    //   orderApprovedEmployeeId: formData.orderApprovedEmployeeId,
    //   quotationRequestDate: dayjs(formData.quotationRequestDate).format('YYYY/MM/DD'),
    //   registDate: dayjs(formData.registDate).format('YYYY/MM/DD'),
    //   shippingmentDate: dayjs(formData.shippingmentDate).format('YYYY/MM/DD'),
    //   paymentDueDate: dayjs(formData.paymentDueDate).format('YYYY/MM/DD'),
    //   status: formData.status,
    // }
    // console.log(data)
    //call api
    // const result = await api.order.addNewOrder(data)
  }

  const editOrder = async (FormData: OrderData) => {
    //call update api
  }

  const deleteOrder = async (FormData: OrderData) => {
    //cal delete api
  }

  const addNewPurchaseOrder = async (formData: PurchaseModalDataProps) => {
    console.log(formData)
    let data: AddNewPurchase = {
      orderCode: formData.orderCode,
      totalAmount: formData.totalAmount,
      registrationDate: dayjs(formData.registrationDate).format('YYYY-MM-DD'),
      deliveryDate: '',
      invoiceNumber: formData.invoiceNumber ?? '',
      memo: formData.memo,
      purchaseCode: formData.purchaseId ?? '',
      components: formData.component,
      companyId: formData.supplierCompanyId,
    }
    const result = await api.purchase.addNewPurchase(data)
    if (result.code === 200) return true
  }

  const editPurchaseOrder = async (formData: PurchaseModalDataProps) => {
    //call update api
    switch (formData.status) {
      case PurchaseStatus.PENDING:
        let data: NewPurchaseDetail = {
          id: formData.id ?? '',
          orderCode: formData.orderCode,
          totalAmount: formData.totalAmount,
          registrationDate: dayjs(formData.registrationDate).format('YYYY-MM-DD'),
          deliveryDate: dayjs(formData.deliveryDate).format('YYYY-MM-DD'),
          invoiceNumber: formData.invoiceNumber ?? '',
          memo: formData.memo,
          purchaseCode: formData.purchaseId ?? '',
          components: formData.component,
          companyId: formData.supplierCompanyId,
          ownerId: formData.ownerId,
          // ownerId:''
        }
        const response = await api.purchase.updatePurchaseDetail(data)
        if (response.code === 200) return true
        break
      case PurchaseStatus.CONFIRM:
      case PurchaseStatus.DELIVERED:
      case PurchaseStatus.CANCEL:
        if (formData.id) {
          const response = await api.purchase.updatePurchaseStatus(formData.id, formData.status)
          if (response.code === 200) return true
        }
        break

      default:
        break
    }
  }

  const deletePurchaseOrder = async (orderId: string) => {
    //cal delete api
    const result = await api.purchase.deletePurchaseOrder(orderId)
    if (result.code === 200 && result.data) {
      return result.data
    }
  }

  const getPurchaseDetail = async (orderId: string) => {
    const result = await api.purchase.getPurchaseDetail(orderId)
    if (result.code === 200 && result.data) {
      return result.data
    }
  }
  const getOrderListData = async ({ page, pageSize }: GridPaginationModel) => {
    setLoading(true)
    const [orderType, status] = searchCriteria.status.split('.')

    // console.log(searchCriteria)
    //call api
    let prepareSearhCriteria: OrderSearchCriteria = {
      ...searchCriteria,
      startDate: dayjs(searchCriteria.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(searchCriteria.endDate).format('YYYY-MM-DD'),
      orderStatus: status,
      orderType: orderType as OrderType,
    }
    console.log(prepareSearhCriteria)
    const result = await api.order.getOrderList(prepareSearhCriteria)
    if (result.code === 200 && result.data) {
      setOrderData(result.data)
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
    addNewPurchaseOrder,
    editPurchaseOrder,
    deletePurchaseOrder,
    getPurchaseDetail,
    handlerDeleteOrder,
  }
}
