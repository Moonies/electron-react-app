import React, { useEffect, useState } from 'react'
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer'
import JsBarcode from 'jsbarcode'
import order from 'api/order'
// import MyFonts from 'asset/fonts/NotoSansJP-Regular.ttf'
Font.register({
  // family: 'notosansjp',
  // src: '../../../../asset/fonts/noto-sans-jp-0-500-normal.ttf',
  format: 'truetype',
  // fontWeight: 'normal',

  family: 'Noto Sans JP',
  style: 'normal',
  weight: 400,
  src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf',
})
// /Users/sansen-24/Desktop/Project/hayaraku-react-app/src/asset/fonts/NotoSansJP-Regular.ttf
// '../asset/fonts/NotoSansJP-normal'
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Noto Sans JP',
    // fontWeight: 'normal',
    // fontFamily: 'Helvetica, Arial, sans-serif',
  },
  table: {
    // display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    // margin: 'auto',
    flexDirection: 'row',
    textAlign: 'left',
    // flex: 1,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
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

interface PDFDocumentProps {
  orderId: string
}

// test
export interface DeliverySlipData {
  orderNumber: string
  companyName: string
  contactPerson: string
  productName: string
  drawingNumber: string
  orderDate: string
  dueDate: string
  quantity: number
}

export const PDFDocument: React.FC<{ data: DeliverySlipData[] }> = ({ data }) => {
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
  // useEffect(() => {
  //   const canvas = document.createElement('canvas')
  //   JsBarcode(canvas, props.orderNumber, {
  //     format: 'CODE128',
  //     width: 1,
  //     height: 12,
  //     displayValue: false,
  //     margin: 0,
  //     background: 'transparent',
  //   })
  //   setBarcodeImage(canvas.toDataURL('image/png'))
  // }, [])

  return (
    <Document>
      {data.map((item, index) => (
        <Page size='A4' style={styles.page} key={index}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '100%', borderBottom: 0 }]}>
                <Text style={[styles.tableCell, styles.headerCell]}>納品書</Text>
                {/* <Text>納品書</Text> */}
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '50%', borderRight: 0 }]}>
                <Text style={{ textAlign: 'left', paddingLeft: 8, fontSize: 12 }}>
                  株式会社さんせん清水 御中
                </Text>
                <Text style={{ textAlign: 'left', paddingLeft: 8, fontSize: 10 }}>担当：</Text>
              </View>
              <View style={[styles.tableCol, { width: '50%', marginTop: -20 }]}>
                <View style={{ margin: 'auto' }}>
                  <Text style={{ fontSize: 10, marginLeft: 25 }}>コード 1820</Text>
                  <Text style={{ fontSize: 10 }}>有限会社 コーワレーザー</Text>
                  <Text style={{ paddingTop: 5, fontSize: 10 }}>京都府久世郡久御山町新珠城117</Text>
                  <Text style={{ fontSize: 10 }}>TEL 0774-43-4775 FAX 0774-43-6098</Text>
                </View>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>発注番号</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>品名</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>図面番号</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>発注日</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>手配納期</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>379548</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>BRACKET</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>JH622022380</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>24/09/03</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>24/09/10</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text style={styles.tableCell}>納入日</Text>
              </View>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text style={styles.tableCell}>要入庫</Text>
              </View>
              <View style={[styles.tableCol, { width: '13%' }]}>
                <Text style={styles.tableCell}>注文数</Text>
              </View>
              <View style={[styles.tableCol, { width: '13%' }]}>
                <Text style={styles.tableCell}>納入数</Text>
              </View>
              <View style={[styles.tableCol, { width: '14%' }]}>
                <Text style={styles.tableCell}>不良品・他</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>単価</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>合計金額</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text style={styles.tableCell}>☆</Text>
              </View>
              <View style={[styles.tableCol, { width: '13%' }]}>
                <Text style={styles.tableCell}>1</Text>
              </View>
              <View style={[styles.tableCol, { width: '13%' }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: '14%' }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>摘要 ☆</Text>
              </View>
              <View style={[styles.tableCol, { width: '40%' }]}>
                <Text style={styles.tableCell}>☆</Text>
              </View>
              <View style={[styles.tableCol, { width: '40%' }]}>
                <Image
                  src={generateBarcode(item.orderNumber)}
                  style={{ paddingHorizontal: 12, paddingTop: 4 }}
                />
                {/* <Text style={[styles.tableCell]}>*0379548-0-S*</Text> */}
                <Text style={[styles.tableCell]}>*{item.orderNumber}*</Text>
              </View>
            </View>
          </View>
          {/* footer */}
          <View>
            <Text style={{ textAlign: 'right', fontSize: 10, paddingRight: 12 }}>
              受注番号：2306292-20
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  )
}

// export const MultiDeliverySlipDocument: React.FC<{ slips: DeliverySlipData[] }> = ({ slips }) => (
//   <Document>
//     {slips.map((slip, index) => (
//       <PDFDocument key={index} {...slip} />
//     ))}
//   </Document>
// )

// type PDFGenerator = {
//   orderId: string
// }
// const PDFGenerator = ({ orderId }: PDFGenerator) => (
//   <PDFViewer style={{ width: '100%', height: '90vh' }}>
//     <PDFDocument orderId={orderId} />
//   </PDFViewer>
// )

// export default PDFGenerator
