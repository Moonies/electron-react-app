import { Text, View, Image } from '@react-pdf/renderer'
import { SlipDetail } from '../..'
import { ProductList } from 'api/order/getOrderList'
import { styles } from './styles'
import dayjs from 'dayjs'
export interface DeliverySlipData {
  barCodeGenerate: (orderId: string) => string
  slipData: SlipDetail
  product: ProductList
  type: 'invoice' | 'delivery'
}
export default function SubPrintDeliveryDetail({
  barCodeGenerate,
  slipData,
  product,
  type,
}: DeliverySlipData) {
  const isDelivery = type === 'delivery'

  return (
    <>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '100%', borderBottomWidth: 0 }]}>
            <Text style={[styles.tableCell, styles.headerCell]}>
              {isDelivery ? '納　品　書' : '請求明細書'}
            </Text>
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
              {slipData.myCompanyName} 御中
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
              <Text style={{ fontSize: 10, marginLeft: 25 }}>コード {slipData.customerNumber}</Text>
              <Text style={{ fontSize: 10 }}>{slipData.customerName}</Text>
              <Text style={{ paddingTop: 15, fontSize: 10 }}>{slipData.customerFullAddress}</Text>
              <Text style={{ fontSize: 10 }}>
                TEL {slipData.customerTel}　FAX {slipData.customerFax}
              </Text>
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
            <Text style={styles.tableCell}>{slipData.id}</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>{product.productName}</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            <Text style={styles.tableCell}>{product.productNumber}</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>
              {dayjs(slipData.orderShippingDate).format('YYYY/MM/DD')}
            </Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>
              {dayjs(slipData.orderShippingExpireDate).format('YYYY/MM/DD')}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: isDelivery ? '8%' : '15%' }]}>
            <Text style={styles.tableCell}>納入日</Text>
          </View>
          {isDelivery && (
            <View style={[styles.tableCol, { width: '7%' }]}>
              <Text style={styles.tableCell}>要入庫</Text>
            </View>
          )}
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
          <View style={[styles.tableCol, { width: isDelivery ? '8%' : '15%', paddingVertical: 8 }]}>
            <Text style={styles.tableCell}></Text>
          </View>
          {isDelivery && (
            <View style={[styles.tableCol, { width: '7%' }]}>
              <Text style={styles.tableCell}>☆</Text>
            </View>
          )}
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
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>摘　　要</Text>
          </View>
          <View style={[styles.tableCol, { width: '55%' }]}>
            <Text style={styles.tableCell}>☆</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            {slipData.orderNumber && (
              <Image
                src={barCodeGenerate(slipData.orderNumber)}
                style={{ paddingHorizontal: 12, paddingTop: 4 }}
              />
            )}
            <Text style={[styles.tableCell]}>*{slipData.orderNumber}*</Text>
          </View>
        </View>
      </View>
      {/* footer */}
      <View>
        <Text style={{ textAlign: 'right', fontSize: 10, paddingRight: 12 }}>
          受注番号：{slipData.id}
        </Text>
      </View>
    </>
  )
}
