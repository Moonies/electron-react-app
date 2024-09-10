import React, { useEffect, useState } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
  Image as PDFImage,
  Svg,
} from '@react-pdf/renderer'
import { api } from 'api/index'
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
    height: 230,
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

type orderDetail = {
  customerNumber: string
  customerName: string
  customerFullAddress: string
  customerTel: string
  customerFax?: string
  myCompanyName: string
  myCompanyFullAddress: string
  myCompanyTel: string
  myCompanyFax: string
  myCompanySeal: string
  orderNumber: string
  productNumber: string
  productName: string
  productQuantity: number
  productPrices: number
  orderShippingExpireDate: Date
}
export interface DeliverySlipData {
  invoiceData: orderDetail
}

export default function SubPrintOrderDetail() {
  const [base64String, setBase64String] = useState<string | null>(null)

  useEffect(() => {
    //may be pass by props
    async function getSeal() {
      const result = await api.myCompany().getMyConpanySeal()
      if (result.code === 200 && result.data) setBase64String(result.data.seal)
    }
    getSeal()
  }, [])
  return (
    <>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '100%', borderBottomWidth: 0 }]}>
            <Text style={[styles.tableCell, styles.headerCell]}>注　文　書</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View
            style={[
              styles.tableCol,
              {
                width: '50%',
                // marginTop: -5,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderRightWidth: 0,
              },
            ]}
          >
            <View style={{ paddingLeft: 8 }}>
              <Text style={{ fontSize: 10, marginLeft: 25 }}>コード 1820</Text>
              <Text style={{ fontSize: 10 }}>有限会社 コーワレーザー</Text>
              <Text style={{ paddingTop: 15, fontSize: 10 }}>京都府久世郡久御山町新珠城117</Text>
              <Text style={{ fontSize: 10 }}>TEL 0774-43-4775 FAX 0774-43-6098</Text>
            </View>
          </View>
          <View
            style={[
              styles.tableCol,
              {
                width: '50%',
                // marginTop: -5,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
              },
            ]}
          >
            <View style={{ paddingLeft: 80 }}>
              <Text style={{ fontSize: 10 }}>発注日：2023年02月10日</Text>
              <Text style={{ fontSize: 10, paddingTop: 15 }}>株式会社さんせん清水</Text>
              <Text style={{ fontSize: 10 }}>京都府京都市伏見区淀際目町335-5</Text>
              <Text style={{ fontSize: 10 }}>TEL 075-631-6293 FAX 075-631-2394</Text>
              <Text style={{ textAlign: 'right', paddingRight: 48, fontSize: 10 }}>担当：</Text>
            </View>
            {base64String ? (
              <View style={{ zIndex: -1, top: 5, right: 10, position: 'absolute' }}>
                <PDFImage source={base64String} style={{ width: 56, height: 56 }} />
              </View>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '20%', paddingVertical: 8 }]}>
            <Text style={styles.tableCell}>発注番号</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>品名</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            <Text style={styles.tableCell}>図面番号</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>予備</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '20%', paddingVertical: 8 }]}>
            <Text style={styles.tableCell}>379548</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>BRACKET</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            <Text style={styles.tableCell}>JH622022380</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>24/09/03</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '15%', paddingVertical: 8 }]}>
            <Text style={styles.tableCell}>工程名</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={[styles.tableCol, { width: '5%' }]}>
            <Text style={styles.tableCell}>数量</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={[styles.tableCol, { width: '5%' }]}>
            <Text style={styles.tableCell}>単価</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={[styles.tableCol, { width: '5%' }]}>
            <Text style={styles.tableCell}>金額</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}></Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '15%', paddingVertical: 8 }]}>
            <Text style={styles.tableCell}>納期</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>24/00/00</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>摘　　要</Text>
          </View>
          <View style={[styles.tableCol, { width: '45%' }]}>
            <Text style={styles.tableCell}>☆</Text>
          </View>
        </View>
      </View>
      {/* footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ textAlign: 'left', fontSize: 10, paddingLeft: 20 }}>
          支払方法、条件等は「支払方法等について」による
        </Text>
        <Text style={{ textAlign: 'right', fontSize: 10, paddingRight: 12 }}>
          受注番号：2306292-20
        </Text>
      </View>
    </>
  )
}
