import React, { useEffect, useState } from 'react'
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer'
import JsBarcode from 'jsbarcode'
import SubPrintOrderInvoice from '../SubPrintOrderInvoice'
import SubPrintOrderDetail from '../SubPrintOrderDetail'
import MyFonts from 'asset/fonts/NotoSansJP-Regular.ttf'
import SubPrintDeliveryDetail from '../SubPrintDeliveryDetail'
import { ProductList } from 'api/order/getOrderList'
import useSubOrder from './hooks/useSubOrder'
import useLoading from 'hooks/useLoading'
Font.register({
  format: 'truetype',
  family: 'Noto Sans JP',
  style: 'normal',
  weight: 400,
  // src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf',
  src: MyFonts,
})
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingHorizontal: 28,
    fontFamily: 'Noto Sans JP',
  },
})

export interface DeliverySlipData {
  customerCompanyId: string
  orderId: string
  id: string
  shippingmentDate: string | Date
  product: ProductList[]
}

export type SlipDetail = {
  customerNumber: string
  customerName: string
  customerFullAddress: string
  customerTel: string
  customerFax?: string
  myCompanyName: string
  myCompanyFullAddress: string
  myCompanyTel: string
  myCompanyFax: string
  id: string
  orderNumber: string
  orderShippingDate: Date | string
  orderShippingExpireDate: Date | string
  totalProduct: number
}

export const PDFDocument: React.FC<{ data: DeliverySlipData }> = ({ data }) => {
  const [barcodeImage, setBarcodeImage] = useState('')
  const { slipData, prepareNewSlipData } = useSubOrder(data)
  // const { setLoading } = useLoading()

  const generateBarcode = (orderId: string) => {
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, orderId, {
      format: 'CODE128',
      width: 1,
      height: 12,
      displayValue: false,
      margin: 0,
      background: 'transparent',
    })
    // setBarcodeImage(canvas.toDataURL('image/png'))
    return canvas.toDataURL('image/png')
  }

  useEffect(() => {
    prepareNewSlipData()
  }, [])

  return (
    <Document>
      {data.product.map((item, index) => (
        <Page size='A4' style={styles.page} key={index}>
          <SubPrintDeliveryDetail
            barCodeGenerate={orderId => generateBarcode(orderId)}
            slipData={slipData}
            product={item}
          />
          <View style={{ marginTop: 40 }} />
          <SubPrintOrderDetail />
          <View style={{ marginTop: 40 }} />
          <SubPrintOrderInvoice />
        </Page>
      ))}
    </Document>
  )
}

export const PDFGenerator: React.FC<{ data: DeliverySlipData }> = ({ data }) => {
  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <PDFDocument data={data} />
    </PDFViewer>
  )
}
