import { useState, useCallback, useMemo } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { api } from 'api/index'
import { CustomerDetailData } from 'api/customer/getCustomerDetailById'
import { MyCompanyDetail } from 'api/myCompany/getMyCompanyDetail'
import {
  ExportDetail,
  exportToPdf,
  PrintTitle,
  ReceiverDetail,
  SenderDetail,
} from 'utils/exportUtils'
import { formatPhoneNumber, formatPostcode } from 'utils/formatUtils'
import { SaleData } from 'api/sale/getSaleList'
import useLoading from 'hooks/useLoading'

export type SaleExportDetail = {
  id: string
  fileName: string
  type: string
  taxType: string
  senderDetail: SenderDetail
  receiverDetail: ReceiverDetail
}

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

export default function useExportSale() {
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
      // setExportDetail(prev => ({ ...prev, receiver: newReceiver }))
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
      // setExportDetail(prev => ({ ...prev, sender: newSender }))
    }
  }

  const exportSaleSelected = async (saleSelectedData: SaleData) => {
    setLoading(true)
    try {
      const [receiver, sender] = await Promise.all([
        getCustomerDetail(saleSelectedData.customerCompanyId),
        getMyCompanyDetail(),
      ])

      const newExportDetail: ExportDetail = {
        id: saleSelectedData.id,
        title: PrintTitle.SALE, // Assuming PrintTitle.SALE is 'SALE'
        fileName: PrintTitle.SALE + '(Test)', // Assuming PrintTitle.SALE is 'SALE'
        receiver: receiver || ({} as ReceiverDetail),
        sender: sender || ({} as ReceiverDetail),
      }

      setExportDetail(newExportDetail)

      // console.log(newExportDetail)
      exportToPdf(printColumnList, saleSelectedData.product, newExportDetail)
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
