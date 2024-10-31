import React, { useCallback, useEffect } from 'react'
import { Document, Page, View, PDFViewer, Image } from '@react-pdf/renderer'
import JsBarcode from 'jsbarcode'
import SubPrintOrderDetail from './components/SubPrintOrderDetail'
import SubPrintDeliveryDetail from './components/SubPrintDeliveryDetail'
import { ProductList } from 'api/sale/getSaleList'
import { styles } from './styles'
import { Dayjs } from 'dayjs'

export type DeliverySlipData = {
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
  orderShippingDate: Dayjs | string
  orderShippingExpireDate: Dayjs | string
  totalProduct: number
  product: ProductList[]
}
export interface DeliverySlipProps {
  data: DeliverySlipData
  render: () => void
}

export type SlipDetail = Omit<DeliverySlipData, 'product'>

export function PDFDocument({ data, render }: DeliverySlipProps) {
  const generateBarcode = useCallback((orderId: string) => {
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, orderId, {
      format: 'CODE128',
      width: 1,
      height: 12,
      displayValue: false,
      margin: 0,
      background: 'transparent',
    })
    return canvas.toDataURL('image/png')
  }, [])

  return (
    <Document onRender={render}>
      {data.product.map((item, index) => (
        <Page size='A4' style={styles.page} key={index}>
          <SubPrintDeliveryDetail
            barCodeGenerate={orderId => generateBarcode(orderId)}
            slipData={data}
            product={item}
            type='delivery'
          />
          <View style={{ marginTop: 40 }} />
          <SubPrintOrderDetail slipData={data} product={item} />
          <View style={{ marginTop: 40 }} />
          <SubPrintDeliveryDetail
            barCodeGenerate={orderId => generateBarcode(orderId)}
            slipData={data}
            product={item}
            type='invoice'
          />
        </Page>
      ))}
    </Document>
  )
}
//for test
export const PDFGenerator: React.FC<DeliverySlipProps> = ({ data, render }) => {
  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <PDFDocument data={data} render={render} />
    </PDFViewer>
  )
}
