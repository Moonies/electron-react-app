import { GridColDef } from '@mui/x-data-grid'
// import { api } from 'api/index'
import { OrderStatus, OrderType } from 'api/order'
import { OrderData } from 'api/order/getOrderList'
import { PurchaseOrderData } from 'api/order/getPurchaseOrderList'
import { SaleOrderData } from 'api/order/getSaleOrderList'
import dayjs from 'dayjs'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'
import { useCallback, useMemo, useState } from 'react'
import {
  ExportDetail,
  exportToPdf,
  exportToXlsx,
  PrintTitle,
  ReceiverDetail,
  SenderDetail,
} from 'utils/exportUtils'
import { formatPhoneNumber, formatPostcode } from 'utils/formatUtils'
import { DeliverySlipData, SlipDetail } from '../components/SlipDeliveryOrder'
import useOrder from './useOrder'

const initialExportDetail: ExportDetail = {
  id: '',
  title: '',
  fileName: '',
  // type: '',
  // taxType: '',
  sender: {
    postCode: '',
    fullAddress: '',
    phoneNumber: '',
    email: '',
    name: '',
  },
  receiver: {
    postCode: '',
    fullAddress: '',
    phoneNumber: '',
    email: '',
    name: '',
  },
}

export default function useExportOrder() {
  const { setLoading } = useLoading()
  const { notificationModal } = useNotification()
  const { api } = useHttp()
  const { convertStatus, convertOrderType } = useOrder()
  const printColumnList: GridColDef[] = useMemo(
    () => [
      { field: 'number', headerName: '図面番号' },
      { field: 'name', headerName: '品名' },
      { field: 'quantity', headerName: '数量' },
      {
        field: 'price',
        headerName: '単価',
      },
      {
        field: 'totalPrice',
        headerName: '金額',
      },
    ],
    []
  )

  const transformSaleData = (orders: SaleOrderData[]) => {
    return orders.reduce((acc: any, order) => {
      // Get the owner name (assuming we take the first owner if multiple exist)
      const ownerName = order.owners?.[0]?.name || ''

      // Get the customer name from company info
      const customerName = order.company?.companyInfo?.name || ''

      // Transform each product into a row
      const rows = order.products.map(product => ({
        invoiceNumber: order.invoiceNumber,
        orderCode: order.orderCode,
        orderType: convertOrderType(order.orderType),
        status: convertStatus(order.status, order.orderType),
        customerName: customerName,
        productNumber: product.number,
        productName: product.name,
        quantity: product.quantity,
        price: product.price,
        totalPrice: product.quantity * product.price,
        orderNumber: order.saleCode,
        owner: ownerName,
        registrationDate: order.registrationDate,
        deliveryDate: '', //in sale delivery is all null, null is not support in xlsx and csv
        shipmentDate: order.shipmentDate,
        memo: order.memo,
      }))

      return acc.concat(rows)
    }, [])
  }

  const transformPurchaseData = (orders: PurchaseOrderData[]) => {
    return orders.reduce((acc: any, order) => {
      // Get the owner name (assuming we take the first owner if multiple exist)
      const ownerName = order.owners?.[0]?.name || ''

      // Get the customer name from company info
      const customerName = order.company?.companyInfo?.name || ''

      // Transform each product into a row
      const rows = order.components.map(component => ({
        invoiceNumber: order.invoiceNumber,
        orderCode: order.orderCode,
        orderType: convertOrderType(order.orderType),
        status: convertStatus(order.status, order.orderType),
        customerName: customerName,
        productNumber: component.number,
        productName: component.name,
        quantity: component.quantity,
        price: component.price,
        totalPrice: component.quantity * component.price,
        orderNumber: order.purchaseCode,
        owner: ownerName,
        registrationDate: order.registrationDate,
        deliveryDate: order.deliveryDate,
        shipmentDate: '', //in purchase shipment is all null,null is not support in xlsx and csv
        memo: order.memo,
      }))

      return acc.concat(rows)
    }, [])
  }

  const columns = [
    { key: 'invoiceNumber', header: '伝票番号' },
    { key: 'orderCode', header: '受注番号' },
    { key: 'orderType', header: '受注タイプ' },
    { key: 'status', header: '状態' },
    { key: 'customerName', header: '名称' },
    { key: 'productNumber', header: '図番' },
    { key: 'productName', header: '品名' },
    { key: 'quantity', header: '数量' },
    { key: 'price', header: '単価' },
    { key: 'totalPrice', header: '金額' },
    { key: 'orderNumber', header: '注番' },
    { key: 'owner', header: '担当者名' },
    { key: 'registrationDate', header: '登録日付' },
    { key: 'deliveryDate', header: '配達日付' },
    { key: 'shipmentDate', header: '出荷日付' },
  ]

  const getCustomerDetail = async (customerId: string) => {
    const { data } = await api.customer.getCustomerDetailById(customerId)
    if (data) {
      return {
        name: data.companyInfo.name,
        email: data.companyInfo.email,
        fullAddress:
          data.companyInfo.address.prefecture +
          data.companyInfo.address.city +
          data.companyInfo.address.streetAddress,
        phoneNumber: formatPhoneNumber(data.companyInfo.phoneNumber),
        postCode: formatPostcode(data.companyInfo.address.postalCode),
        fax: formatPhoneNumber(data.companyInfo.fax) ?? '',
      }
    }
  }

  const getMyCompanyDetail = async () => {
    const { data } = await api.myCompany.getMyCompanyDetail()
    if (data) {
      return {
        name: data.companyInfo.name,
        email: data.companyInfo.email,
        fullAddress:
          data.companyInfo.address.prefecture +
          data.companyInfo.address.city +
          data.companyInfo.address.streetAddress,
        phoneNumber: formatPhoneNumber(data.companyInfo.phoneNumber),
        postCode: formatPostcode(data.companyInfo.address.postalCode),
        fax: formatPhoneNumber(data.companyInfo.fax),
      }
    }
  }

  const getSaleDetail = async (saleId: string) => {
    const response = await api.sale.getSaleDetail(saleId)
    if (response.code === 200 && response.data) return response
  }

  const getPurchaseDetail = async (purchaseId: string) => {
    const response = await api.purchase.getPurchaseDetail(purchaseId)
    if (response.code === 200 && response.data) return response
  }
  const convertTitle = useCallback((typeOrder: string | null): string => {
    switch (typeOrder) {
      // case OrderStatus.DELIVERY:
      //   return PrintTitle.SALE
      // case OrderStatus.RECEIVED:
      //   return PrintTitle.PURCHASE
      case OrderStatus.PENDING:
        return PrintTitle.PENDING
      case OrderStatus.CONFIRM:
        return PrintTitle.ORDER
      default:
        return ''
    }
  }, [])

  const exportSaleSelected = async (orderSelectedData: OrderData) => {
    setLoading(true)
    let title = convertTitle(orderSelectedData.status)
    try {
      const [customer, myCompany] = await Promise.all([
        getCustomerDetail(orderSelectedData.companyId),
        getMyCompanyDetail(),
      ])

      const newExportDetail: ExportDetail = {
        id: orderSelectedData.id,
        title: title,
        fileName: title + '(Test)',
        receiver: customer || ({} as ReceiverDetail),
        sender: myCompany || ({} as SenderDetail),
      }
      //watiting re check export task
      // exportToPdf(printColumnList, orderSelectedData.product, newExportDetail)
    } catch (error) {
      notificationModal.error(`Error exporting : ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const exportOrder = async (saleOrder?: SaleOrderData[], purchaseOrder?: PurchaseOrderData[]) => {
    if (saleOrder && purchaseOrder) {
      const [saleReport, purchaseReport] = await Promise.all([
        transformSaleData(saleOrder),
        transformPurchaseData(purchaseOrder),
      ])
      let exportOrderSelected = [...saleReport, ...purchaseReport]
      exportOrderSelected.sort(
        (a, b) => dayjs(a.registrationDate).valueOf() - dayjs(b.registrationDate).valueOf()
      )
      exportToXlsx(columns, exportOrderSelected, 'order-report')
    } else if (saleOrder) {
      const report = await transformSaleData(saleOrder)
      exportToXlsx(columns, report, 'order-report')
    } else if (purchaseOrder) {
      const report = await transformPurchaseData(purchaseOrder)
      exportToXlsx(columns, report, 'order-report')
    }
  }

  const prepareSlipData = async (orderSelectedData: OrderData) => {
    try {
      const [customer, myCompany] = await Promise.all([
        getCustomerDetail(orderSelectedData.companyId),
        getMyCompanyDetail(),
      ])
      //waiting re check export task
      // let newSlipData: DeliverySlipData = {
      //   customerNumber: customer?.id ?? '',
      //   customerName: customer?.name ?? '',
      //   customerFullAddress: customer?.fullAddress ?? '',
      //   customerTel: customer?.phoneNumber ?? '',
      //   customerFax: customer?.fax ?? '',
      //   myCompanyName: myCompany?.name ?? '',
      //   myCompanyFullAddress: myCompany?.fullAddress ?? '',
      //   myCompanyTel: myCompany?.phoneNumber ?? '',
      //   myCompanyFax: myCompany?.fax ?? '',
      //   id: orderSelectedData.id,
      //   orderNumber: orderSelectedData.orderId,
      //   orderShippingDate: orderSelectedData.shippingmentDate,
      //   orderShippingExpireDate: '',
      //   totalProduct: orderSelectedData.product.length,
      //   product: orderSelectedData.product,
      // }

      // return newSlipData
    } catch (error) {
      notificationModal.error(`Error Prepare SlipData : ${error}`)
    } finally {
      setLoading(false)
    }
  }
  return {
    exportSaleSelected,
    prepareSlipData,
    exportOrder,
  }
}
