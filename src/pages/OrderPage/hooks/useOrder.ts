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
import { SaleOrderData } from 'api/order/getSaleOrderList'
import { PurchaseOrderData } from 'api/order/getPurchaseOrderList'

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
    pageSize: 50,
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
    { value: 'registrationDate', display: '登録日' },
    { value: 'deliveryDate', display: '配達日' },
    { value: 'shipmentDate', display: '出荷日' },
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
      // case OrderStatus.SHIP:
      //   return orderType === OrderType.SALE ? '出荷' : '配達'
      //completed in purchase order should be can see purchase page only
      //completed in sale order should be can see sale page only

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
      { field: 'registrationDate', headerName: '登録日', headerAlign: 'center' },
      {
        field: 'owners',
        headerName: '担当者',
        headerAlign: 'center',
        valueGetter: (value: { id: string; name: string }[]) =>
          value.length > 0 ? value[0].name : '',
      },
      // { field: 'orderApprovedEmployeeName', headerName: '承認者', headerAlign: 'center' },
      // { field: 'quotationRequestDate', headerName: '見積日', headerAlign: 'center' },
      {
        field: 'deliveryDate',
        headerName: '出荷 / 配達日',
        headerAlign: 'center',
        valueGetter: (value, row: OrderData) =>
          row.orderType === OrderType.SALE
            ? row.shipmentDate ?? row.planShipmentDate
            : row.deliveryDate ?? row.planDeliveryDate,
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

  const prepareCategoryStatus = useCallback(async () => {
    const result = await api.status.getStatusList()
    if (result.code === 200 && result.data) {
      let newResult = result.data.filter(item => item.name !== 'COMPLETE')
      setStatusOrder(newResult)
    }
  }, [])

  const handleChange = (name: string, value?: string | Date | null) => {
    if (name === 'orderType') setSearchCriteria(prev => ({ ...prev, status: '' }))

    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = useCallback(async () => {
    //if condition when search put in here
    setCachedData({})
    getOrderListData(paginationModel)
  }, [searchCriteria, withLoading, paginationModel])

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
    } else if (orderData.length !== 0) {
      getOrderListData(newModel)
    }
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

  const mappingStatus = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'PENDING'
      case OrderStatus.CONFIRM:
        return 'CONFIRM'
      case OrderStatus.COMPLETE:
        return 'COMPLETE'
      case OrderStatus.CANCEL:
        return 'CANCEL'
      case OrderStatus.REJECT:
        return 'REJECT'

      default:
        return ''
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
        planShipmentDate: result.planShipmentDate,
        status: mappingStatus(result.status),
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
        // orderRequestEmployeeName: '',
        // orderApprovedEmployeeId: '',
        // orderApprovedEmployeeName: '',
        memo: result.memo,
        registrationDate: result.registrationDate,
        totalAmount: result.totalAmount,
        status: mappingStatus(result.status),
        owners: result.owners,
        deliveryDate: result.deliveryDate,
        planDeliveryDate: result.planDeliveryDate,
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
      // shipmentDate: dayjs(formData.shippingmentDate).format('YYYY-MM-DD'),
      planShipmentDate: dayjs(formData.planShipmentDate).format('YYYY-MM-DD'),
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

  const editSaleOrder = async (formData: SaleModalDataProps, skipUpdateOrderStatus: boolean) => {
    switch (formData.status) {
      case SaleStatus.PENDING:
        let data: NewSaleDetailProps = {
          id: formData.id ?? '',
          orderCode: formData.orderCode,
          totalAmount: formData.totalAmount,
          registrationDate: dayjs(formData.registrationDate).format('YYYY-MM-DD'),
          // shipmentDate: dayjs(formData.shippingmentDate).format('YYYY-MM-DD'),
          planShipmentDate: dayjs(formData.planShipmentDate).format('YYYY-MM-DD'),

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
      case SaleStatus.CONFIRM:
      case SaleStatus.DELIVERED:
        {
          if (formData.id) {
            await updateShippingDate(
              formData.id,
              dayjs(formData.shippingmentDate).format('YYYY-MM-DD')
            )
            if (skipUpdateOrderStatus) {
              notificationSnackbar.success('編集完了しました。')
              return true
            }

            const response = await updateSaleStatus(formData.id, formData.status)
            if (response) {
              notificationSnackbar.success('編集完了しました。')
              return true
            }
          }
        }
        break
      case SaleStatus.CANCEL:
        {
          if (formData.id) {
            const response = await updateSaleStatus(formData.id, formData.status)
            if (response) {
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
      planDeliveryDate: dayjs(formData.deliveryDate).format('YYYY-MM-DD'),
      invoiceNumber: formData.invoiceNumber ?? '',
      memo: formData.memo,
      purchaseCode: formData.purchaseCode ?? '',
      components: formData.component,
      companyId: formData.supplierCompanyId,
      owners: formData.owners,
    }
    const result = await api.purchase.addNewPurchase(data)
    if (result.code === 200) {
      notificationSnackbar.success('追加完了しました。')
      return true
    }
  }

  const editPurchaseOrder = async (
    formData: PurchaseModalDataProps,
    skipUpdateOrderStatus: boolean
  ) => {
    switch (formData.status) {
      case PurchaseStatus.PENDING:
        let data: NewPurchaseDetail = {
          id: formData.id ?? '',
          orderCode: formData.orderCode,
          totalAmount: formData.totalAmount,
          registrationDate: dayjs(formData.registrationDate).format('YYYY-MM-DD'),
          planDeliveryDate: dayjs(formData.planDeliveryDate).format('YYYY-MM-DD'),
          // deliveryDate: dayjs(formData.deliveryDate).format('YYYY-MM-DD'),
          invoiceNumber: formData.invoiceNumber ?? '',
          memo: formData.memo,
          purchaseCode: formData.purchaseCode ?? '',
          components: formData.component,
          companyId: formData.supplierCompanyId,
          owners: formData.owners,
        }
        const response = await api.purchase.updatePurchaseDetail(data)
        if (response.code === 200) {
          notificationSnackbar.success('編集完了しました。')
          return true
        }
        break
      case PurchaseStatus.CONFIRM:
      case PurchaseStatus.INSTOCK:
        {
          if (formData.id) {
            await updateDeliveryDate(formData.id, dayjs(formData.deliveryDate).format('YYYY-MM-DD'))
            if (skipUpdateOrderStatus) {
              notificationSnackbar.success('編集完了しました。')
              return true
            }
            const response = await updatePurchaseStatus(formData.id, formData.status)
            if (response) {
              notificationSnackbar.success('編集完了しました。')
              return true
            }
          }
        }
        break
      case PurchaseStatus.CANCEL:
        if (formData.id) {
          const response = await updatePurchaseStatus(formData.id, formData.status)
          if (response) {
            notificationSnackbar.success('編集完了しました。')
            return true
          }
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

  const updateShippingDate = async (saleId: string, newShippingDate: string) => {
    const result = await api.sale.updateShippingDate(saleId, newShippingDate)
    if (result.code === 200) {
      return true
    }
  }

  const updateSaleStatus = async (saleId: string, status: SaleStatus) => {
    const response = await api.sale.updateSaleStatus(saleId, status)
    if (response.code === 200) {
      return true
    }
  }

  const updateDeliveryDate = async (purchaseId: string, newDeliveryDate: string) => {
    const response = await api.purchase.updateDeliveryDate(purchaseId, newDeliveryDate)
    if (response.code === 200) {
      return true
    }
  }
  const updatePurchaseStatus = async (purchaseId: string, status: PurchaseStatus) => {
    const response = await api.purchase.updatePurchaseStatus(purchaseId, status)
    if (response.code === 200) return true
  }
  const getSaleOrderList = async () => {
    const [orderType, status] = searchCriteria.status.split('.')

    let newSearhCriteria = {
      ...searchCriteria,
      startDate: dayjs(searchCriteria.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(searchCriteria.endDate).format('YYYY-MM-DD'),
      status: status,
      pageSize: totalRows,
    }
    const response = await api.order.getSaleOrderList(newSearhCriteria)
    if (response.code === 200 && response.data) return response.data
    return undefined
  }

  const getPurchaseOrderList = async () => {
    const [orderType, status] = searchCriteria.status.split('.')

    let newSearhCriteria = {
      ...searchCriteria,
      startDate: dayjs(searchCriteria.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(searchCriteria.endDate).format('YYYY-MM-DD'),
      status: status,
      pageSize: totalRows,
    }

    const response = await api.order.getPurchaseOrderList(newSearhCriteria)
    if (response.code === 200 && response.data) return response.data
    return undefined
  }

  const getOrderListData = async ({ page, pageSize }: GridPaginationModel) => {
    setLoading(true)
    const [orderType, status] = searchCriteria.status.split('.')

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
    getSaleOrderList,
    getPurchaseOrderList,
    convertOrderType,
    updateSaleStatus,
    updatePurchaseStatus,
    updateShippingDate,
    updateDeliveryDate,
  }
}
