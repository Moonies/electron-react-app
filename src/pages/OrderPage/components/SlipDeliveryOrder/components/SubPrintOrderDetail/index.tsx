import React, { useEffect, useState } from 'react'
import { Text, View, Image as PDFImage } from '@react-pdf/renderer'
import { api } from 'api/index'
import { styles } from './styles'
import { SlipDetail } from '../..'
import { ProductList } from 'api/order/getOrderList'
import dayjs from 'dayjs'

export interface DeliverySlipOrderData {
  slipData: SlipDetail
  product: ProductList
}

export default function SubPrintOrderDetail({ product, slipData }: DeliverySlipOrderData) {
  const [base64String, setBase64String] = useState<string | null>(null)

  useEffect(() => {
    //may be pass by props
    async function getSeal() {
      const result = await api.myCompany.getMyConpanySeal()
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
              <Text style={{ fontSize: 10, marginLeft: 25 }}>コード {slipData.customerNumber}</Text>
              <Text style={{ fontSize: 10 }}>{slipData.customerName}</Text>
              <Text style={{ paddingTop: 15, fontSize: 10 }}>{slipData.customerFullAddress}</Text>
              <Text style={{ fontSize: 10 }}>
                TEL {slipData.customerTel} FAX {slipData.customerFax}
              </Text>
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
              <Text style={{ fontSize: 10 }}>
                発注日： {dayjs(slipData.orderShippingDate).format('YYYY年MM月DD日')}
              </Text>
              <Text style={{ fontSize: 10, paddingTop: 15 }}>{slipData.myCompanyName}</Text>
              <Text style={{ fontSize: 10 }}>{slipData.myCompanyFullAddress}</Text>
              <Text style={{ fontSize: 10 }}>
                TEL {slipData.myCompanyTel} FAX {slipData.myCompanyFax}
              </Text>
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
            <Text style={styles.tableCell}>{slipData.id}</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>{product.productName}</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            <Text style={styles.tableCell}>{product.productNumber}</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}></Text>
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
            <Text style={styles.tableCell}>
              {dayjs(slipData.orderShippingExpireDate).format('YYYY/MM/DD')}
            </Text>
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
