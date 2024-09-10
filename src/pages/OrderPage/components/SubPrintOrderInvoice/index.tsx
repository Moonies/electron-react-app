import React, { useEffect, useState } from 'react'
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer'
import JsBarcode from 'jsbarcode'

const styles = StyleSheet.create({
  table: {
    // display: 'table',
    width: 540,
    borderStyle: 'solid',
    borderWidth: 1,
    // borderRightWidth: 0,
    // borderBottomWidth: 0,
    // borderLeftWidth: 0,
    // borderColor: 'red',
    height: 216,
  },
  tableRow: {
    // margin: 'auto',
    flexDirection: 'row',
    textAlign: 'left',
    // flex: 1,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 0.4,
    // borderLeftWidth: 0,
    // borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    // marginTop: 5,
    fontSize: 10,
  },
  headerCell: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})

type InvoiceDetail = {
  customerNumber: string
  customerName: string
  customerFullAddress: string
  customerTel: string
  customerFax?: string
  myCompanyName: string
  myCompanyFullAddress: string
  myCompanyTel: string
  myCompanyFax: string
  orderNumber: string
  productNumber: string
  productName: string
  orderShippingDate: Date
  orderShippingExpireDate: Date
  totalProduct: number
}
export interface DeliverySlipData {
  barCodeGenerate: (orderId: string) => void
  invoiceData: InvoiceDetail
}

export default function SubPrintOrderInvoice() {
  const [barcodeImage, setBarcodeImage] = useState('')

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

  return (
    <>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '100%', borderBottomWidth: 0 }]}>
            <Text style={[styles.tableCell, styles.headerCell]}>請求明細書</Text>
            {/* <Text>納品書</Text> */}
          </View>
        </View>
        <View style={styles.tableRow}>
          <View
            style={[
              styles.tableCol,
              {
                width: '50%',
                paddingTop: 10,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderRightWidth: 0,
              },
            ]}
          >
            <Text style={{ textAlign: 'left', paddingLeft: 8, fontSize: 12 }}>
              株式会社さんせん清水 御中
            </Text>
            <Text style={{ textAlign: 'left', paddingLeft: 8, fontSize: 10 }}>担当：</Text>
          </View>
          <View
            style={[
              styles.tableCol,
              {
                width: '50%',
                marginTop: -10,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
              },
            ]}
          >
            <View style={{ paddingLeft: 80 }}>
              <Text style={{ fontSize: 10, marginLeft: 25 }}>コード 1820</Text>
              <Text style={{ fontSize: 10 }}>有限会社 コーワレーザー</Text>
              <Text style={{ paddingTop: 15, fontSize: 10 }}>京都府久世郡久御山町新珠城117</Text>
              <Text style={{ fontSize: 10 }}>TEL 0774-43-4775 FAX 0774-43-6098</Text>
            </View>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>発注番号</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>品名</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            <Text style={styles.tableCell}>図面番号</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>発注日</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>手配納期</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '15%', paddingVertical: 8 }]}>
            <Text style={styles.tableCell}>379548</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>BRACKET</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            <Text style={styles.tableCell}>JH622022380</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>24/09/03</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>24/09/10</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '8%' }]}>
            <Text style={styles.tableCell}>納入日</Text>
          </View>
          <View style={[styles.tableCol, { width: '7%' }]}>
            <Text style={styles.tableCell}>要入庫</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCell}>注文数</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>納入数</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCell}>不良品・他</Text>
          </View>
          <View style={[styles.tableCol, { width: '10%' }]}>
            <Text style={styles.tableCell}>単価</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCell}>合計金額</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '8%', paddingVertical: 8 }]}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={[styles.tableCol, { width: '7%' }]}>
            <Text style={styles.tableCell}>☆</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%', paddingVertical: 8 }]}>
            <Text style={styles.tableCell}>1</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={[styles.tableCol, { width: '10%' }]}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCell}></Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '15%', paddingVertical: 8 }]}>
            <Text style={styles.tableCell}>摘　　要</Text>
          </View>
          <View style={[styles.tableCol, { width: '55%' }]}>
            <Text style={styles.tableCell}>☆</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            {/* <Image
              src={generateBarcode(item.orderNumber)}
              style={{ paddingHorizontal: 12, paddingTop: 4 }}
            />
            <Text style={[styles.tableCell]}>*{item.orderNumber}*</Text> */}
          </View>
        </View>
      </View>
      {/* footer */}
      <View>
        <Text style={{ textAlign: 'right', fontSize: 10, paddingRight: 12 }}>
          受注番号：2306292-20
        </Text>
      </View>
    </>
  )
}
