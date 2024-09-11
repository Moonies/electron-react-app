import { GridColDef } from '@mui/x-data-grid'
import { api } from 'api/index'
import { OrderStatus } from 'api/order'
import { OrderData } from 'api/order/getOrderList'
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
  const printColumnList: GridColDef[] = useMemo(
    () => [
      { field: 'productName', headerName: '品名' },
      { field: 'productNumber', headerName: '図番' },
      {
        field: 'productPrice',
        headerName: '単価',
      },
      { field: 'quantity', headerName: '数量' },
      {
        field: 'totalPrice',
        headerName: '金額',
      },
    ],
    []
  )

  const getCustomerDetail = async (customerId: string) => {
    const { data } = await api.customer().getCustomerDetailById(customerId)
    if (data) {
      return {
        id: data.id,
        name: data.customerName,
        email: data.email,
        fullAddress: data.prefecture + data.city + data.street + data.addressCode,
        phoneNumber: formatPhoneNumber(data.phoneNumber),
        postCode: formatPostcode(data.postalCode),
        fax: formatPhoneNumber(data.faxNumber) ?? '',
      }
    }
  }

  const getMyCompanyDetail = async () => {
    const { data } = await api.myCompany().getMyCompanyDetail()
    if (data) {
      return {
        name: data.companyName,
        email: data.companyEmail,
        fullAddress: data.companyPerfecture + data.companyCity + data.companyAddressCode,
        phoneNumber: formatPhoneNumber(data.companyPhoneNumber),
        postCode: formatPostcode(data.companyPostCode),
        fax: formatPhoneNumber(data.companyFax),
      }
    }
  }

  const convertTitle = useCallback((typeOrder: string | null): string => {
    switch (typeOrder) {
      case OrderStatus.DELIVERED:
        return PrintTitle.SALE
      case OrderStatus.RECEIVED:
        return PrintTitle.ORDER
      case OrderStatus.NonOrder:
        return PrintTitle.NonOrder
      case OrderStatus.INSTORE:
        return PrintTitle.PURCHASE
      default:
        return ''
    }
  }, [])

  const exportSaleSelected = async (orderSelectedData: OrderData) => {
    setLoading(true)
    let title = convertTitle(orderSelectedData.status)
    try {
      const [customer, myCompany] = await Promise.all([
        getCustomerDetail(orderSelectedData.customerCompanyId),
        getMyCompanyDetail(),
      ])

      const newExportDetail: ExportDetail = {
        id: orderSelectedData.id,
        title: title,
        fileName: title + '(Test)',
        receiver: customer || ({} as ReceiverDetail),
        sender: myCompany || ({} as SenderDetail),
      }
      exportToPdf(printColumnList, orderSelectedData.product, newExportDetail)
    } catch (error) {
      notificationModal.error(`Error exporting : ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const prepareSlipData = async (orderSelectedData: OrderData) => {
    try {
      const [customer, myCompany] = await Promise.all([
        getCustomerDetail(orderSelectedData.customerCompanyId),
        getMyCompanyDetail(),
      ])

      let newSlipData: DeliverySlipData = {
        customerNumber: customer?.id ?? '',
        customerName: customer?.name ?? '',
        customerFullAddress: customer?.fullAddress ?? '',
        customerTel: customer?.phoneNumber ?? '',
        customerFax: customer?.fax ?? '',
        myCompanyName: myCompany?.name ?? '',
        myCompanyFullAddress: myCompany?.fullAddress ?? '',
        myCompanyTel: myCompany?.phoneNumber ?? '',
        myCompanyFax: myCompany?.fax ?? '',
        id: orderSelectedData.id,
        orderNumber: orderSelectedData.orderId,
        orderShippingDate: orderSelectedData.shippingmentDate,
        orderShippingExpireDate: '',
        totalProduct: orderSelectedData.product.length,
        product: orderSelectedData.product,
      }

      return newSlipData
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
