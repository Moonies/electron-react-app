import { useState, useCallback, useMemo } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { CustomerDetailData } from 'api/customer/getCustomerDetailById'
import { MyCompanyDetail } from 'api/myCompany/getMyCompanyDetail'
import {
  ExportDetail,
  exportToPdf,
  exportToXlsx,
  PrintTitle,
  ReceiverDetail,
  SenderDetail,
} from 'utils/exportUtils'
import { formatPhoneNumber, formatPostcode } from 'utils/formatUtils'
import { SaleData } from 'api/sale/getSaleList'
import useLoading from 'hooks/useLoading'
import useHttp from 'hooks/useHttp'

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

  const transformData = (orders: SaleData[]) => {
    return orders.reduce((acc: any, order) => {
      // Get the owner name (assuming we take the first owner if multiple exist)
      const ownerName = order.owners?.[0]?.name || ''

      // Get the customer name from company info
      const customerName = order.company?.companyInfo?.name || ''

      // Transform each product into a row
      const rows = order.products.map(product => ({
        invoiceNumber: order.invoiceNumber,
        orderCode: order.orderCode,
        customerName: customerName,
        productNumber: product.number,
        productName: product.name,
        quantity: product.quantity,
        price: product.price,
        totalPrice: product.quantity * product.price,
        saleCode: order.saleCode,
        owner: ownerName,
        registrationDate: order.registrationDate,
        shipmentDate: order.shipmentDate,
      }))

      return acc.concat(rows)
    }, [])
  }
  const columns = [
    { key: 'invoiceNumber', header: '伝票番号' },
    { key: 'orderCode', header: '受注番号' },
    { key: 'customerName', header: '取引先' },
    { key: 'productNumber', header: '図番' },
    { key: 'productName', header: '品名' },
    { key: 'quantity', header: '数量' },
    { key: 'price', header: '単価' },
    { key: 'totalPrice', header: '金額' },
    { key: 'saleCode', header: '注番' },
    { key: 'owner', header: '担当者名' },
    { key: 'registrationDate', header: '納入日' },
    { key: 'shipmentDate', header: '出荷日' },
  ]

  const getCustomerDetail = async (customerId: string) => {
    const { data } = await api.customer.getCustomerDetailById(customerId)
    console.log(data)
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

  const printSaleInvoice = async (saleSelectedData: SaleData) => {
    setLoading(true)
    try {
      const [receiver, sender] = await Promise.all([
        getCustomerDetail(saleSelectedData.company.id),
        getMyCompanyDetail(),
      ])

      const newExportDetail: ExportDetail = {
        id: saleSelectedData.orderCode, //orderCode or saleCode ??
        title: PrintTitle.SALE, // Assuming PrintTitle.SALE is 'SALE'
        fileName: PrintTitle.SALE + '(Test)', // Assuming PrintTitle.SALE is 'SALE'
        receiver: receiver || ({} as ReceiverDetail),
        sender: sender || ({} as SenderDetail),
      }

      const newProductList = saleSelectedData.products.map(
        ({ useCanBeMadeInQuantity, ...item }) => ({
          ...item,
          totalPrice: item.price * item.quantity,
        })
      )

      setExportDetail(newExportDetail)

      exportToPdf(printColumnList, newProductList, newExportDetail, '下記の通り、納品致しました。')
    } catch (error) {
      console.error('Error exporting sale:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportSale = async (dataToExport: SaleData[]) => {
    try {
      const transformedData = transformData(dataToExport)
      exportToXlsx(columns, transformedData, 'sale-report')
    } catch (error) {
      console.error('Error exporting to XLSX:', error)
      alert('Failed to export XLSX. Please ensure the xlsx library is properly imported.')
    }
  }

  return {
    printColumnList,
    getCustomerDetail,
    getMyCompanyDetail,
    exportDetail,
    printSaleInvoice,
    exportSale,
  }
}
