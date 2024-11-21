import { GridColDef } from '@mui/x-data-grid'
// import { api } from 'api/index'
import { OrderStatus } from 'api/order'
import { OrderData } from 'api/order/getOrderList'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'
import { useCallback, useMemo, useState } from 'react'
import {
  ExportDetail,
  exportToPdf,
  PrintTitle,
  ReceiverDetail,
  SenderDetail,
} from 'utils/exportUtils'
import { formatPhoneNumber, formatPostcode } from 'utils/formatUtils'
import { DeliverySlipData, SlipDetail } from '../components/SlipDeliveryOrder'

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

  const columns = [
    { key: 'invoiceNumber', header: '伝票番号' },
    { key: 'orderCode', header: '受注番号' },
    { key: 'customerName', header: '名称' },
    { key: 'productNumber', header: '図番' },
    { key: 'productName', header: '品名' },
    { key: 'quantity', header: '数量' },
    { key: 'price', header: '単価' },
    { key: 'totalPrice', header: '金額' },
    { key: 'purchaseCode', header: '注番' },
    { key: 'owner', header: '担当者名' },
    { key: 'registrationDate', header: '納入日' },
    { key: 'deliveryDate', header: '手配納期' },
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
  }
}
