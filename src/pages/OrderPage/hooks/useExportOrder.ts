import { GridColDef } from '@mui/x-data-grid'
import { api } from 'api/index'
import { OrderStatus } from 'api/order'
import { OrderData } from 'api/order/getOrderList'
import useLoading from 'hooks/useLoading'
import { useCallback, useMemo, useState } from 'react'
import {
  ExportDetail,
  exportToPdf,
  PdfGenerator,
  PrintTitle,
  ReceiverDetail,
  SenderDetail,
} from 'utils/exportUtils'
import { formatPhoneNumber, formatPostcode } from 'utils/formatUtils'

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
  const [exportDetail, setExportDetail] = useState<ExportDetail>(initialExportDetail)
  const { setLoading } = useLoading()
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
    const { data } = await api.myCompany().getCompanyDetail()
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
      const [receiver, sender] = await Promise.all([
        getCustomerDetail(orderSelectedData.customerCompanyId),
        getMyCompanyDetail(),
      ])

      const newExportDetail: ExportDetail = {
        id: orderSelectedData.id,
        title: title,
        fileName: title + '(Test)',
        receiver: receiver || ({} as ReceiverDetail),
        sender: sender || ({} as SenderDetail),
      }

      setExportDetail(newExportDetail)

      // exportToPdf(printColumnList, orderSelectedData.product, newExportDetail)
      const orderData = {
        code: '1820',
        companyName: '有限会社 コーワレーザー',
        companyAddress: '京都府久世郡久御山町新珠城117',
        companyPhone: '0774-43-4775',
        companyFax: '0774-43-6098',
        orderNumber: '379548',
        productName: 'BRACKET',
        drawingNumber: 'JH622022380',
        orderDate: '24/09/03',
        deliveryDate: '24/09/10',
        quantity: 1,
        unitPrice: 0, // Add actual unit price
        totalAmount: 0, // Add actual total amount
        recipientCompany: '株式会社さんせん清水',
        recipientAddress: '京都市伏見区淀際目町335番地の5',
        recipientPhone: '075-631-6293',
        recipientFax: '075-631-2394',
      }
      PdfGenerator()
    } catch (error) {
      console.error('Error exporting sale:', error)
    } finally {
      setLoading(false)
    }
  }
  return {
    printColumnList,
    getCustomerDetail,
    getMyCompanyDetail,
    exportDetail,
    exportSaleSelected,
  }
}
