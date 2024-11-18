import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { OrderStatus, OrderType } from 'api/order'
import { AddNewSaleOrderProps } from 'api/sale/addNewSale'
import { OrderData, OrderSearchCriteria } from 'api/order/getOrderList'
import { PurchaseStatus } from 'api/purchase'
import { AddNewPurchase } from 'api/purchase/addNewPurchase'
import { PurchaseData } from 'api/purchase/getPurchaseList'
import { NewPurchaseDetail } from 'api/purchase/updatePurchaseDetail'
import { PurchaseModalDataProps } from 'components/Modals/PurchaseModal'
import { SaleModalDataProps } from 'components/Modals/SaleModal'
import dayjs from 'dayjs'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'
import { useCallback, useMemo, useState } from 'react'
import { SaleStatus } from 'api/sale'
import { NewSaleDetailProps } from 'api/sale/updateSaleDetail'
import { StatusDetail } from 'api/status/getStatusList'

interface CategorySaleSearch {
  value: string
  display: string
}
// interface StatusOption {
//   name: OrderStatus
//   label: string
//   orderType: OrderType
// }
interface CachedData {
  [key: string]: OrderData[]
}

export default function useOrder() {
  const dateThreeMonthsAgo = dayjs().subtract(3, 'month').toDate()
  const { withLoading, setLoading } = useLoading()
  const [orderData, setOrderData] = useState<OrderData[]>([])
  const [cachedData, setCachedData] = useState<CachedData>({})
  const [totalRows, setTotalRows] = useState(0)
  const [statusOrder, setStatusOrder] = useState<StatusDetail[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [searchCriteria, setSearchCriteria] = useState({
    category: '',
    keyword: '',
    dateType: '',
    startDate: dateThreeMonthsAgo,
    endDate: new Date(),
    status: '',
    orderType: '',
  })
  const { notificationSnackbar } = useNotification()
  const { api } = useHttp()

  const [categorySearch, setCategorySearch] = useState<CategorySaleSearch[]>()
  const dateTypeList = [
    { value: 'registrationDate', display: '登録日付' },
    { value: 'deliveryDate', display: '配達日付' },
    { value: 'shipmentDate', display: '出荷日付' },
  ]
  const orderTypeList = [
    { value: 'All', display: '全て' },
    { value: 'Sale', display: '売上' },
    { value: 'Purchase', display: '仕入' },
  ]
  const convertStatus = (status: string, orderType: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return orderType === OrderType.SALE ? '見積' : '未発注'
      // case OrderStatus.DELAY:
      //   return '納期超過'
      case OrderStatus.CONFIRM:
        return orderType === OrderType.SALE ? '受注' : '発注'
      case OrderStatus.SHIP:
        return orderType === OrderType.SALE ? '出荷' : '配達'
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

  const convertOrderType = (orderType: string) =>
    orderType === OrderType.PURCHASE ? '仕入' : '売上'

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
        headerName: '発注先 / 仕入先',
        headerAlign: 'center',
        flex: 1,
        valueGetter: (value, row: OrderData) => (row.company ? row.company.companyInfo.name : ''),
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
      {
        field: 'deliveryDate',
        headerName: '出荷 / 配達日付',
        headerAlign: 'center',
        valueGetter: (value, row: OrderData) =>
          row.orderType === OrderType.SALE ? row.shipmentDate : row.deliveryDate,
      },
      // { field: 'paymentDueDate', headerName: '支払期限', headerAlign: 'center' },
    ],
    []
  )

  const prepareCategorySearch = useMemo(() => {
    let result: CategorySaleSearch[] = []
    columns.forEach(item => {
      // Skip these fields
      if (['status', 'orderType', 'registrationDate', 'deliveryDate'].includes(item.field)) {
        return
      }

      // Handle special fields
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

  const prepareCategoryStatus = useMemo(async () => {
    const result = await api.status.getStatusList()
    if (result.code === 200 && result.data) {
      setStatusOrder(result.data)
    }
    // let status: StatusOption[] = [
    //   { name: OrderStatus.ALL, label: '全て', type: OrderType.ALL },
    //   { name: OrderStatus.PENDING, label: '見積', type: OrderType.SALE },
    //   { name: OrderStatus.CONFIRM, label: '受注', type: OrderType.SALE },
    //   { name: OrderStatus.SHIP, label: '出荷', type: OrderType.SALE },
    //   // { name: OrderStatus.COMPLETE, label: '売上', type: OrderType.SALE },
    //   { name: OrderStatus.PENDING, label: '未発注', type: OrderType.PURCHASE },
    //   { name: OrderStatus.CONFIRM, label: '発注', type: OrderType.PURCHASE },
    //   { name: OrderStatus.SHIP, label: '配達', type: OrderType.PURCHASE },
    //   // { name: OrderStatus.COMPLETE, label: '入庫', type: OrderType.PURCHASE },
    //   { name: OrderStatus.REJECT, label: '返品', type: OrderType.ALL },
    //   { name: OrderStatus.CANCEL, label: 'キャンセル', type: OrderType.ALL },
    // ]
  }, [])

  const handleChange = (name: string, value?: string | Date | null) => {
    if (name === 'orderType') setSearchCriteria(prev => ({ ...prev, status: '' }))

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
      setCachedData({})
    } else {
      setPaginationModel(newModel)
    }
    const cacheKey = `${newModel.page}-${newModel.pageSize}`

    if (cachedData[cacheKey]) {
      setOrderData(cachedData[cacheKey])
      return
    }
    getOrderListData(newModel)
  }

  const handleDeleteOrder = async (selectedOrder: OrderData) => {
    if (selectedOrder.orderType === OrderType.SALE) {
      const response = await deleteSaleOrder(selectedOrder.id)
      return response
    } else {
      const response = await deletePurchaseOrder(selectedOrder.id)
      return response
    }
  }

  const handleSelectedSaleDetail = async (saleId: string) => {
    const result = await getSaleDetail(saleId)
    if (result) {
      let saleDetail: SaleModalDataProps = {
        id: result.id,
        orderCode: result.orderCode,
        saleCode: result.saleCode,
        invoiceNumber: result.invoiceNumber,
        customerCompanyId: result.companyId,
        customerCompanyName: result.company.companyInfo.name,
        product: result.products,
        registrationDate: result.registrationDate,
        shippingmentDate: result.shipmentDate,
        status: result.status,
        totalAmount: result.totalAmount,
        owners: result.owners,
        memo: result.memo,
      }
      return saleDetail
    }
  }

  const handleSelectedPurchaseDetail = async (purchaseId: string) => {
    const result = await getPurchaseDetail(purchaseId)
    if (result) {
      let purchaseDetail: PurchaseModalDataProps = {
        id: purchaseId,
        orderCode: result.orderCode,
        purchaseCode: result.purchaseCode,
        invoiceNumber: result.invoiceNumber,
        supplierCompanyId: result.companyId ?? '',
        supplierCompanyName: result.company?.companyInfo.name ?? '',
        component: result.components.map(item => ({
          ...item,
          id: item.number + item.name,
        })),
        orderRequestEmployeeId: result.createdBy,
        orderRequestEmployeeName: '',
        orderApprovedEmployeeId: '',
        orderApprovedEmployeeName: '',
        memo: result.memo,
        registrationDate: result.registrationDate,
        totalAmount: result.totalAmount,
        status: result.status,
        owners: result.owners,
        deliveryDate: result.deliveryDate,
      }
      return purchaseDetail
    }
  }

  const addNewSaleOrder = async (formData: SaleModalDataProps) => {
    let data: AddNewSaleOrderProps = {
      orderCode: formData.orderCode,
      companyId: formData.customerCompanyId,
      products: formData.product.map(item => ({
        ...item,
        useCanBeMadeInQuantity: true,
      })),
      registrationDate: dayjs().format('YYYY-MM-DD'),
      shipmentDate: dayjs(formData.shippingmentDate).format('YYYY-MM-DD'),
      invoiceNumber: formData.invoiceNumber,
      owners: formData.owners,
      saleCode: formData.saleCode,
      totalAmount: formData.totalAmount,
      memo: formData.memo,
    }
    const result = await api.sale.addNewSale(data)
    if (result.code === 200) {
      notificationSnackbar.success('追加完了しました。')
      return true
    }
  }

  const editSaleOrder = async (formData: SaleModalDataProps) => {
    switch (formData.status) {
      case SaleStatus.PENDING:
        let data: NewSaleDetailProps = {
          id: formData.id ?? '',
          orderCode: formData.orderCode,
          totalAmount: formData.totalAmount,
          registrationDate: dayjs(formData.registrationDate).format('YYYY-MM-DD'),
          shipmentDate: dayjs(formData.shippingmentDate).format('YYYY-MM-DD'),
          invoiceNumber: formData.invoiceNumber ?? '',
          memo: formData.memo,
          saleCode: formData.saleCode ?? '',
          products: formData.product.map(item => ({
            ...item,
            useCanBeMadeInQuantity: true,
          })),
          companyId: formData.customerCompanyId,
          owners: formData.owners,
        }
        const response = await api.sale.updateSaleDetail(data)
        if (response.code === 200) {
          notificationSnackbar.success('編集完了しました。')
          return true
        }
        break
      case SaleStatus.ON_DELIVERY:
      case SaleStatus.CONFIRM:
      case SaleStatus.DELIVERED:
      case SaleStatus.CANCEL:
        {
          if (formData.id) {
            const response = await api.sale.updateSaleStatus(formData.id, formData.status)
            if (response.code === 200) {
              notificationSnackbar.success('編集完了しました。')
              return true
            }
          }
        }
        break

      default:
        break
    }
  }

  const addNewPurchaseOrder = async (formData: PurchaseModalDataProps) => {
    console.log(formData)
    let data: AddNewPurchase = {
      orderCode: formData.orderCode,
      totalAmount: formData.totalAmount,
      registrationDate: dayjs(formData.registrationDate).format('YYYY-MM-DD'),
      deliveryDate: dayjs(formData.deliveryDate).format('YYYY-MM-DD'),
      invoiceNumber: formData.invoiceNumber ?? '',
      memo: formData.memo,
      purchaseCode: formData.purchaseCode ?? '',
      components: formData.component,
      companyId: formData.supplierCompanyId,
      owners: formData.owners,
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
          purchaseCode: formData.purchaseCode ?? '',
          components: formData.component,
          companyId: formData.supplierCompanyId,
          owners: formData.owners,
        }
        const response = await api.purchase.updatePurchaseDetail(data)
        if (response.code === 200) return true
        break
      case PurchaseStatus.CONFIRM:
      case PurchaseStatus.ON_DELIVERY:
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

  const deletePurchaseOrder = async (purchaseId: string) => {
    const result = await api.purchase.deletePurchaseOrder(purchaseId)
    if (result.code === 200 && result.data) {
      return true
    }
  }

  const getPurchaseDetail = async (purchaseId: string) => {
    const result = await api.purchase.getPurchaseDetail(purchaseId)
    if (result.code === 200 && result.data) {
      return result.data
    }
  }

  const getSaleDetail = async (saleId: string) => {
    const result = await api.sale.getSaleDetail(saleId)
    if (result.code === 200 && result.data) return result.data
  }

  const deleteSaleOrder = async (saleId: string) => {
    const result = await api.sale.deleteSale(saleId)
    if (result.code === 200 && result.data) {
      return true
    }
  }

  const getOrderListData = async ({ page, pageSize }: GridPaginationModel) => {
    setLoading(true)
    const [orderType, status] = searchCriteria.status.split('.')

    //call api
    let prepareSearhCriteria = {
      ...searchCriteria,
      startDate: dayjs(searchCriteria.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(searchCriteria.endDate).format('YYYY-MM-DD'),
      status: status,
      page: page,
      pageSize: pageSize,
      // orderType: orderType as OrderType,
    }
    const result = await api.order.getOrderList(prepareSearhCriteria as OrderSearchCriteria)
    if (result.code === 200 && result.data) {
      setOrderData(result.data)
      setTotalRows(result.page?.totalElements ?? 0)
      setCachedData(prevCache => ({
        ...prevCache,
        [`${page}-${pageSize}`]: result.data ? result.data : [],
      }))
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
    addNewSaleOrder,
    editSaleOrder,
    deleteSaleOrder,
    addNewPurchaseOrder,
    editPurchaseOrder,
    deletePurchaseOrder,
    getPurchaseDetail,
    handleDeleteOrder,
    dateTypeList,
    orderTypeList,
    handleSelectedPurchaseDetail,
    totalRows,
    handleSelectedSaleDetail,
  }
}
